import { defineStore } from 'pinia'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import { logInfo, logError } from '@/utils/logger'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    list: [],
    loading: false,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        const colRef = collection(db, 'categories')
        const snap = await getDocs(colRef)
        this.list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        logInfo('[categories] Categorías cargadas:', this.list.length)
      } catch (e) {
        logError('[categories] Error al cargar categorías:', e)
      } finally {
        this.loading = false
      }
    },

    async createCategory(name) {
      try {
        const col = collection(db, 'categories')
        const payload = {
          name,
          createdAt: serverTimestamp(),
        }
        const docRef = await addDoc(col, payload)
        this.list.push({ id: docRef.id, ...payload })
        return { success: true, id: docRef.id }
      } catch (e) {
        logError('[categories] Error al crear categoría:', e)
        return { success: false, error: e.message }
      }
    },

    async updateCategory(id, name) {
      try {
        const ref = doc(db, 'categories', id)
        await updateDoc(ref, { name, updatedAt: serverTimestamp() })
        const idx = this.list.findIndex((c) => c.id === id)
        if (idx !== -1) this.list[idx].name = name
        return { success: true }
      } catch (e) {
        logError('[categories] Error al actualizar categoría:', e)
        return { success: false, error: e.message }
      }
    },

    async deleteCategory(id) {
      try {
        const ref = doc(db, 'categories', id)
        await deleteDoc(ref)
        const idx = this.list.findIndex((c) => c.id === id)
        if (idx !== -1) this.list.splice(idx, 1)
        return { success: true }
      } catch (e) {
        logError('[categories] Error al eliminar categoría:', e)
        return { success: false, error: e.message }
      }
    },
  },
})
