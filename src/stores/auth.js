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
          console.log('🔐 Auth State Changed:', firebaseUser ? firebaseUser.email : 'No user')
          this.user = firebaseUser

          if (firebaseUser) {
            try {
              console.log('📄 Loading profile for UID:', firebaseUser.uid)
              const ref = doc(db, 'users', firebaseUser.uid)
              const snap = await getDoc(ref)

              if (snap.exists()) {
                this.profile = snap.data()
                console.log('✅ Profile loaded successfully:', {
                  email: this.profile.email,
                  role: this.profile.role,
                  displayName: this.profile.displayName
                })
              } else {
                console.error('❌ Profile document does not exist for UID:', firebaseUser.uid)
                this.profile = null
              }
            } catch (error) {
              console.error('❌ Error loading profile:', error.message)
              console.error('Full error:', error)
              this.profile = null
            }
          } else {
            this.profile = null
          }

          this.loading = false
          resolve()
        })
      })
    },

    async login(email, password) {
      console.log('🔑 Attempting login for:', email)
      await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ Login successful')
    },

    async logout() {
      console.log('👋 Logging out')
      await signOut(auth)
      this.user = null
      this.profile = null
    },
  },
})
