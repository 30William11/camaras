/* eslint-env node */
// Script para crear el primer usuario superadmin
// Ejecutar con: node scripts/create-superadmin.js

import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import * as readline from 'readline'

// Configuración de Firebase (debe coincidir con tu .env)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Función para leer input del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function createSuperadmin() {
  try {
    console.log('\n=== Crear Usuario Superadmin ===\n')

    const displayName = await question('Nombre completo: ')
    const email = await question('Email: ')
    const password = await question('Contraseña (mínimo 6 caracteres): ')

    if (!displayName || !email || !password) {
      console.error('❌ Todos los campos son requeridos')
      process.exit(1)
    }

    if (password.length < 6) {
      console.error('❌ La contraseña debe tener al menos 6 caracteres')
      process.exit(1)
    }

    console.log('\n⏳ Creando usuario...')

    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid

    console.log('✅ Usuario creado en Firebase Auth')

    // Crear perfil en Firestore
    const profile = {
      displayName,
      email,
      role: 'superadmin',
      active: true,
      createdAt: new Date().toISOString()
    }

    await setDoc(doc(db, 'users', uid), profile)

    console.log('✅ Perfil creado en Firestore')
    console.log('\n🎉 ¡Superadmin creado exitosamente!')
    console.log(`\nPuedes iniciar sesión con:`)
    console.log(`Email: ${email}`)
    console.log(`Contraseña: ${password}`)
    console.log('\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    process.exit(1)
  }
}

createSuperadmin()
