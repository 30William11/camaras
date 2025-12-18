import { defineStore } from 'pinia'
import { auth, db } from '@/firebase/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    profile: null,
    loading: true,
  }),

  actions: {
    init() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (firebaseUser) => {
          this.user = firebaseUser

          if (firebaseUser) {
            const ref = doc(db, 'users', firebaseUser.uid)
            const snap = await getDoc(ref)
            this.profile = snap.exists() ? snap.data() : null
          } else {
            this.profile = null
          }

          this.loading = false
          resolve()
        })
      })
    },

    async login(email, password) {
      await signInWithEmailAndPassword(auth, email, password)
    },

    async logout() {
      await signOut(auth)
      this.user = null
      this.profile = null
    },
  },
})
