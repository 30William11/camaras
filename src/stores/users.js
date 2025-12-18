// src/stores/users.js
import { defineStore } from 'pinia'
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc, // 👈 para eliminar documentos
} from 'firebase/firestore'
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'
import { auth, db } from '@/firebase/firebase'
import { logInfo, logError } from '@/utils/logger'

export const useUsersStore = defineStore('users', {
  state: () => ({
    list: [],
    loading: false,
  }),

  getters: {
    activeUsers: (state) => state.list.filter((u) => u.active === true),
    inactiveUsers: (state) => state.list.filter((u) => u.active === false),
    getUserById: (state) => (id) => state.list.find((u) => u.id === id),
  },

  actions: {
    async fetchUsers() {
      this.loading = true
      try {
        const q = collection(db, 'users')
        const snap = await getDocs(q)

        this.list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        logInfo('Usuarios cargados:', this.list.length)
      } catch (e) {
        logError('Error al obtener usuarios:', e)
      } finally {
        this.loading = false
      }
    },

    async createUser(userData) {
      try {
        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userData.email,
          userData.password,
        )

        const uid = userCredential.user.uid

        // Perfil en Firestore
        const profile = {
          displayName: userData.displayName,
          email: userData.email,
          role: userData.role || 'trabajador',
          active: true,
          createdAt: new Date().toISOString(),
        }

        await setDoc(doc(db, 'users', uid), profile)

        // Actualizar lista local
        this.list.push({ id: uid, ...profile })

        logInfo('Usuario creado:', uid)
        return { success: true, userId: uid }
      } catch (e) {
        logError('Error al crear usuario:', e)
        return { success: false, error: e.message }
      }
    },

    async updateUser(userId, updates) {
      try {
        const userRef = doc(db, 'users', userId)

        // Nunca mandamos password por aquí
        // eslint-disable-next-line no-unused-vars
        const { password, ...safeUpdates } = updates

        await updateDoc(userRef, {
          ...safeUpdates,
          updatedAt: new Date().toISOString(),
        })

        // Actualizar lista local
        const index = this.list.findIndex((u) => u.id === userId)
        if (index !== -1) {
          this.list[index] = { ...this.list[index], ...safeUpdates }
        }

        logInfo('Usuario actualizado:', userId)
        return { success: true }
      } catch (e) {
        logError('Error al actualizar usuario:', e)
        return { success: false, error: e.message }
      }
    },

    async toggleUserStatus(userId, active) {
      try {
        const userRef = doc(db, 'users', userId)

        await updateDoc(userRef, {
          active,
          updatedAt: new Date().toISOString(),
        })

        const index = this.list.findIndex((u) => u.id === userId)
        if (index !== -1) {
          this.list[index].active = active
        }

        logInfo(`Usuario ${active ? 'activado' : 'desactivado'}:`, userId)
        return { success: true }
      } catch (e) {
        logError('Error al cambiar estado del usuario:', e)
        return { success: false, error: e.message }
      }
    },

    async deleteUser(userId) {
      try {
        const userRef = doc(db, 'users', userId)
        await deleteDoc(userRef)

        this.list = this.list.filter((u) => u.id !== userId)

        logInfo('Usuario eliminado (Firestore):', userId)
        return { success: true }
      } catch (e) {
        logError('Error al eliminar usuario:', e)
        return { success: false, error: e.message }
      }
    },

    async sendPasswordReset(email) {
      try {
        await sendPasswordResetEmail(auth, email)
        logInfo('Correo de restablecimiento enviado:', email)
        return { success: true }
      } catch (e) {
        logError('Error al enviar correo de restablecimiento:', e)
        return { success: false, error: e.message }
      }
    },

    /**
     * Reset user password directly using Cloud Function
     * Only available for superadmin users
     */
    async resetUserPassword(userId, newPassword) {
      try {
        const { getFunctions, httpsCallable } = await import('firebase/functions')
        const functions = getFunctions()
        const updateUserPassword = httpsCallable(functions, 'updateUserPassword')

        const result = await updateUserPassword({
          userId,
          newPassword
        })

        logInfo('Contraseña actualizada exitosamente para:', userId)
        return { success: true, data: result.data }
      } catch (e) {
        logError('Error al actualizar contraseña:', e)

        // Extract meaningful error message from Cloud Function error
        let errorMessage = e.message

        // Check if functions are not deployed yet
        if (e.code === 'functions/not-found' || e.message.includes('NOT_FOUND')) {
          errorMessage = 'Cloud Functions no desplegadas. Ejecuta: firebase deploy --only functions'
        } else if (e.code === 'functions/internal' || e.message.includes('INTERNAL')) {
          errorMessage = 'Cloud Functions no disponibles. Verifica que estén desplegadas correctamente.'
        } else if (e.code === 'functions/unauthenticated') {
          errorMessage = 'Debes estar autenticado'
        } else if (e.code === 'functions/permission-denied') {
          errorMessage = 'Solo superadministradores pueden cambiar contraseñas'
        } else if (e.code === 'functions/invalid-argument') {
          errorMessage = e.message.replace('functions/invalid-argument: ', '')
        }

        return { success: false, error: errorMessage }
      }
    },
  },
})
