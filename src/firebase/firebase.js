// src/firebase/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCa3dq1Q4pHdw6TOFe8Ren0wPYsn1gxdco",
  authDomain: "camaras-a9d74.firebaseapp.com",
  projectId: "camaras-a9d74",
  storageBucket: "camaras-a9d74.firebasestorage.app",
  messagingSenderId: "358451032988",
  appId: "1:358451032988:web:3a9255473ae91990390e59",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
