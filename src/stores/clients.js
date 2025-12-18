import { defineStore } from 'pinia'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import { logInfo, logError } from '@/utils/logger'

export const useClientsStore = defineStore('clients', {
  state: () => ({
    list: [],
    loading: false,
  }),

  actions: {
    async fetchClients() {
      this.loading = true
      try {
        const col = collection(db, 'clients')
        const snap = await getDocs(col)
        this.list = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        logInfo('Clientes cargados:', this.list.length)
      } catch (e) {
        logError('Error al cargar clientes:', e)
      } finally {
        this.loading = false
      }
    },

    async createClient(client) {
      try {
        const col = collection(db, 'clients')
        const payload = {
          ...client,
          createdAt: serverTimestamp(),
        }
        const docRef = await addDoc(col, payload)
        this.list.push({ id: docRef.id, ...payload })
        logInfo('Cliente creado:', docRef.id)
        return { success: true, id: docRef.id }
      } catch (e) {
        logError('Error al crear cliente:', e)
        return { success: false, error: e.message }
      }
    },

    async updateClient(id, client) {
      try {
        const ref = doc(db, 'clients', id)
        const payload = {
          ...client,
          updatedAt: serverTimestamp(),
        }
        await updateDoc(ref, payload)

        const idx = this.list.findIndex((c) => c.id === id)
        if (idx !== -1) {
          this.list[idx] = { ...this.list[idx], ...payload }
        }

        logInfo('Cliente actualizado:', id)
        return { success: true }
      } catch (e) {
        logError('Error al actualizar cliente:', e)
        return { success: false, error: e.message }
      }
    },

    async deleteClient(id) {
      try {
        const ref = doc(db, 'clients', id)
        await deleteDoc(ref)
        this.list = this.list.filter((c) => c.id !== id)
        logInfo('Cliente eliminado:', id)
        return { success: true }
      } catch (e) {
        logError('Error al eliminar cliente:', e)
        return { success: false, error: e.message }
      }
    },
  },
})
