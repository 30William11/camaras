const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Cloud Function to update user password
 * Callable only by authenticated superadmin users
 */
exports.updateUserPassword = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Usuario debe estar autenticado'
    );
  }

  try {
    // Get the caller's user document to verify role
    const callerDoc = await admin.firestore()
      .collection('users')
      .doc(context.auth.uid)
      .get();

    if (!callerDoc.exists) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Usuario no encontrado'
      );
    }

    const callerRole = callerDoc.data().role;

    // Only superadmin can reset passwords
    if (callerRole !== 'superadmin') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Solo superadministradores pueden cambiar contraseñas'
      );
    }

    // Validate input
    const { userId, newPassword } = data;

    if (!userId || typeof userId !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'userId es requerido y debe ser string'
      );
    }

    if (!newPassword || typeof newPassword !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'newPassword es requerido y debe ser string'
      );
    }

    if (newPassword.length < 6) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'La contraseña debe tener al menos 6 caracteres'
      );
    }

    // Update password in Firebase Auth
    await admin.auth().updateUser(userId, {
      password: newPassword
    });

    // Optionally update metadata in Firestore
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .update({
        passwordSetBy: callerDoc.data().displayName || context.auth.email,
        passwordSetAt: admin.firestore.FieldValue.serverTimestamp(),
        requiresPasswordChange: true
      });

    console.log(`Password updated for user ${userId} by ${context.auth.email}`);

    return {
      success: true,
      message: 'Contraseña actualizada exitosamente'
    };

  } catch (error) {
    console.error('Error updating password:', error);

    // If it's already a HttpsError, re-throw it
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    // Convert other errors to HttpsError
    if (error.code === 'auth/user-not-found') {
      throw new functions.https.HttpsError(
        'not-found',
        'Usuario no encontrado en Firebase Auth'
      );
    }

    throw new functions.https.HttpsError(
      'internal',
      'Error al actualizar contraseña: ' + error.message
    );
  }
});
