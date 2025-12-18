// src/stores/quotes.js
import { defineStore } from 'pinia'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import { logInfo, logError } from '@/utils/logger'
import { useProductsStore } from './products'

export const useQuotesStore = defineStore('quotes', {
  state: () => ({
    list: [],
    loading: false
  }),

  getters: {
    totalQuotes(state) {
      return state.list.length
    },

    totalRevenue(state) {
      return state.list.reduce((acc, q) => acc + (q.total || 0), 0)
    },

    lastQuotes(state) {
      return state.list.slice(0, 5)
    }
  },

  actions: {
    async fetchQuotes() {
      this.loading = true
      try {
        const q = collection(db, 'quotes')
        const snap = await getDocs(q)
        this.list = snap.docs.map((d) => {
          const data = d.data()
          return {
            id: d.id,
            ...data,
            // Ensure all quotes have a status (default to 'en_proceso' for legacy data)
            status: data.status || 'en_proceso'
          }
        })
        logInfo('Cotizaciones cargadas:', this.list)
      } catch (e) {
        logError('Error al obtener cotizaciones:', e)
      } finally {
        this.loading = false
      }
    },

    async createQuote(quote) {
      try {
        const col = collection(db, 'quotes')
        const payload = {
          ...quote,
          status: quote.status || 'en_proceso', // Default status
          createdAt: serverTimestamp(),
        }
        const docRef = await addDoc(col, payload)
        this.list.push({ id: docRef.id, ...payload })
        logInfo('Cotización creada:', docRef.id)
        return { success: true, id: docRef.id }
      } catch (e) {
        logError('Error al crear cotización:', e)
        return { success: false, error: e.message }
      }
    },

    async updateQuote(id, quote) {
      try {
        const ref = doc(db, 'quotes', id)
        const payload = {
          ...quote,
          updatedAt: serverTimestamp(),
        }
        await updateDoc(ref, payload)

        const idx = this.list.findIndex(q => q.id === id)
        if (idx !== -1) {
          this.list[idx] = { ...this.list[idx], ...payload }
        }

        logInfo('Cotización actualizada:', id)
        return { success: true }
      } catch (e) {
        logError('Error al actualizar cotización:', e)
        return { success: false, error: e.message }
      }
    },

    async deleteQuote(id) {
      try {
        const ref = doc(db, 'quotes', id)
        await deleteDoc(ref)
        this.list = this.list.filter(q => q.id !== id)
        logInfo('Cotización eliminada:', id)
        return { success: true }
      } catch (e) {
        logError('Error al eliminar cotización:', e)
        return { success: false, error: e.message }
      }
    },

    async updateQuoteStatus(id, newStatus) {
      try {
        const quote = this.list.find(q => q.id === id)
        if (!quote) {
          return { success: false, error: 'Cotización no encontrada' }
        }

        const oldStatus = quote.status

        // If changing to 'aprobado', deduct inventory for products
        if (newStatus === 'aprobado' && oldStatus !== 'aprobado') {
          const productsStore = useProductsStore()
          const errors = []

          // First, validate all products have sufficient stock
          for (const item of quote.items || []) {
            if (item.productId) {
              const product = productsStore.getById(item.productId)
              if (product && product.qty < item.qty) {
                errors.push(`${item.name}: Stock insuficiente (disponible: ${product.qty}, requerido: ${item.qty})`)
              }
            }
          }

          if (errors.length > 0) {
            return {
              success: false,
              error: 'Stock insuficiente para los siguientes productos:\n' + errors.join('\n')
            }
          }

          // Then deduct stock for all products
          for (const item of quote.items || []) {
            if (item.productId) {
              const result = await productsStore.decreaseStock(item.productId, item.qty)
              if (!result.success) {
                logError('[quotes] Error al reducir stock:', result.error)
                return { success: false, error: result.error }
              }
            }
          }

          logInfo('[quotes] Inventario reducido para cotización:', id)
        }

        // Update status in Firebase
        const ref = doc(db, 'quotes', id)
        await updateDoc(ref, {
          status: newStatus,
          updatedAt: serverTimestamp()
        })

        // Update local state
        const idx = this.list.findIndex(q => q.id === id)
        if (idx !== -1) {
          this.list[idx].status = newStatus
        }

        logInfo('[quotes] Estado de cotización actualizado:', id, newStatus)
        return { success: true }
      } catch (e) {
        logError('[quotes] Error al actualizar estado:', e)
        return { success: false, error: e.message }
      }
    }
  }
})
