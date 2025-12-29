// Script para verificar y corregir el rol del usuario en Firestore
import 'dotenv/config'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function checkAndFixRoles() {
    console.log('🔍 Verificando usuarios en Firestore...\n')

    try {
        const usersRef = collection(db, 'users')
        const snapshot = await getDocs(usersRef)

        if (snapshot.empty) {
            console.log('❌ No se encontraron usuarios en Firestore')
            return
        }

        console.log(`✅ Se encontraron ${snapshot.size} usuario(s)\n`)

        for (const userDoc of snapshot.docs) {
            const data = userDoc.data()
            const uid = userDoc.id

            console.log('─'.repeat(60))
            console.log(`📄 Usuario: ${data.displayName || 'Sin nombre'}`)
            console.log(`   Email: ${data.email}`)
            console.log(`   UID: ${uid}`)
            console.log(`   Rol actual: "${data.role}"`)
            console.log(`   Activo: ${data.active}`)

            // Verificar si el rol necesita corrección
            if (data.role && data.role !== data.role.toLowerCase()) {
                const newRole = data.role.toLowerCase()
                console.log(`   ⚠️  El rol tiene mayúsculas incorrectas`)
                console.log(`   🔧 Corrigiendo: "${data.role}" → "${newRole}"`)

                await updateDoc(doc(db, 'users', uid), {
                    role: newRole
                })

                console.log(`   ✅ Rol actualizado correctamente`)
            } else if (data.email === 'admin@camaras.com' && data.role !== 'superadmin') {
                console.log(`   ⚠️  Este usuario debería ser superadmin`)
                console.log(`   🔧 Actualizando rol a "superadmin"`)

                await updateDoc(doc(db, 'users', uid), {
                    role: 'superadmin'
                })

                console.log(`   ✅ Rol actualizado a superadmin`)
            } else {
                console.log(`   ✅ Rol correcto`)
            }
        }

        console.log('─'.repeat(60))
        console.log('\n✅ Verificación completada')
        console.log('\n📝 Próximos pasos:')
        console.log('   1. Recarga la aplicación en el navegador (F5)')
        console.log('   2. Cierra sesión y vuelve a iniciar sesión')
        console.log('   3. Verifica que el sidebar muestre el rol correcto')

    } catch (error) {
        console.error('\n❌ Error:', error.message)
        console.error('\nDetalles del error:', error)
    }

    process.exit(0)
}

checkAndFixRoles()
