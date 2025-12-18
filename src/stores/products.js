// src/stores/products.js
import { defineStore } from 'pinia'
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/firebase/firebase'
import { logInfo, logError } from '@/utils/logger'

export const useProductsStore = defineStore('products', {
  state: () => ({
    list: [],
    loading: false,
  }),

  getters: {
    getById: (state) => (id) => state.list.find((p) => p.id === id),
    activeCount: (state) => state.list.filter((p) => p.active).length,
  },

  actions: {
    async fetchProducts() {
      this.loading = true
      logInfo('[products] fetchProducts() INICIO')

      try {
        const colRef = collection(db, 'products')
        const snap = await getDocs(colRef)

        logInfo('[products] snap.size =', snap.size)

        this.list = snap.docs.map((d) => {
          const data = d.data()
          logInfo('[products] doc:', d.id, data)
          return {
            id: d.id,
            name: data.name || 'Sin nombre',
            sku: data.sku || '',
            price: data.salePrice ?? data.basePrice ?? data.price ?? 0, // Map salePrice to price

            // New fields
            priceUsd: data.priceUsd ?? 0,
            exchangeRate: data.exchangeRate ?? 0,
            purchasePrice: data.purchasePrice ?? 0,
            profitPercentage: data.profitPercentage ?? 0,
            profit: data.profit ?? 0,
            salePrice: data.salePrice ?? data.basePrice ?? data.price ?? 0,

            qty: data.qty ?? 0,
            imageUrl: data.imageUrl || null,
            active: data.active ?? true,
            category: data.category || '',
            description: data.description || '', // New field
            type: data.type || '',
            unit: data.unit || '',
          }
        })

        logInfo('[products] list final =', this.list)
      } catch (e) {
        logError('[products] ERROR en fetchProducts:', e)
      } finally {
        this.loading = false
        logInfo('[products] fetchProducts() FIN – loading =', this.loading)
      }
    },

    async uploadImageIfNeeded(file) {
      if (!file) return null
      try {
        const ext = file.name.split('.').pop()
        const fileName = `products/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${ext}`
        const ref = storageRef(storage, fileName)
        await uploadBytes(ref, file)
        const url = await getDownloadURL(ref)
        return url
      } catch (e) {
        logError('[products] Error subiendo imagen', e)
        throw e
      }
    },

    async createProduct(data) {
      try {
        let imageUrl = data.imageUrl || null
        if (data.imageFile) {
          imageUrl = await this.uploadImageIfNeeded(data.imageFile)
        }

        const payload = {
          name: data.name,
          sku: data.sku || '',
          // New pricing fields
          priceUsd: Number(data.priceUsd) || 0,
          exchangeRate: Number(data.exchangeRate) || 0,
          purchasePrice: Number(data.purchasePrice) || 0,
          profitPercentage: Number(data.profitPercentage) || 0,
          profit: Number(data.profit) || 0,
          salePrice: Number(data.salePrice) || 0,

          // Legacy/Base fields
          basePrice: Number(data.salePrice) || 0, // Keep basePrice as salePrice for compatibility
          qty: Number(data.qty) || 0,
          imageUrl,
          active: data.active ?? true,
          category: data.category || 'general',
          description: data.description || '',
          type: data.type || 'equipo',
          unit: data.unit || 'unidad',
          createdAt: serverTimestamp(),
        }

        const col = collection(db, 'products')
        const docRef = await addDoc(col, payload)

        this.list.push({
          id: docRef.id,
          ...payload,
          price: payload.salePrice, // Update local state
        })

        logInfo('[products] Producto creado:', docRef.id)
        return { success: true, id: docRef.id }
      } catch (e) {
        logError('[products] Error al crear producto:', e)
        return { success: false, error: e.message }
      }
    },

    async updateProduct(id, data) {
      try {
        const current = this.getById(id)
        if (!current) throw new Error('Producto no encontrado')

        let imageUrl = current.imageUrl || null

        if (data.imageFile) {
          imageUrl = await this.uploadImageIfNeeded(data.imageFile)
        } else if (data.removeImage) {
          imageUrl = null
        }

        const payload = {
          name: data.name ?? current.name,
          sku: data.sku ?? current.sku,

          // New pricing fields
          priceUsd: data.priceUsd != null ? Number(data.priceUsd) : current.priceUsd,
          exchangeRate: data.exchangeRate != null ? Number(data.exchangeRate) : current.exchangeRate,
          purchasePrice: data.purchasePrice != null ? Number(data.purchasePrice) : current.purchasePrice,
          profitPercentage: data.profitPercentage != null ? Number(data.profitPercentage) : current.profitPercentage,
          profit: data.profit != null ? Number(data.profit) : current.profit,
          salePrice: data.salePrice != null ? Number(data.salePrice) : current.salePrice,

          // Legacy/Base fields
          basePrice: data.salePrice != null ? Number(data.salePrice) : current.salePrice, // Update basePrice too

          qty: data.qty != null ? Number(data.qty) : current.qty,
          imageUrl,
          active: data.active ?? current.active,
          category: data.category ?? current.category,
          description: data.description ?? current.description,
          type: data.type ?? current.type,
          unit: data.unit ?? current.unit,
          updatedAt: serverTimestamp(),
        }

        const ref = doc(db, 'products', id)
        await updateDoc(ref, payload)

        const idx = this.list.findIndex((p) => p.id === id)
        if (idx !== -1) {
          this.list[idx] = {
            ...this.list[idx],
            ...payload,
            price: payload.salePrice // Update local state
          }
        }

        logInfo('[products] Producto actualizado:', id)
        return { success: true }
      } catch (e) {
        logError('[products] Error al actualizar producto:', e)
        return { success: false, error: e.message }
      }
    },

    async updateQty(id, newQty) {
      try {
        const current = this.getById(id)
        if (!current) return

        const qty = Math.max(0, Number(newQty) || 0)

        const ref = doc(db, 'products', id)
        await updateDoc(ref, { qty })

        current.qty = qty
        logInfo('[products] Cantidad actualizada', id, qty)
      } catch (e) {
        logError('[products] Error al actualizar cantidad', e)
      }
    },

    async decreaseStock(productId, quantity) {
      try {
        const product = this.getById(productId)
        if (!product) {
          logError('[products] Producto no encontrado:', productId)
          return { success: false, error: 'Producto no encontrado' }
        }

        const newQty = product.qty - quantity

        if (newQty < 0) {
          logError('[products] Stock insuficiente para:', productId, 'disponible:', product.qty, 'requerido:', quantity)
          return {
            success: false,
            error: `Stock insuficiente para ${product.name}. Disponible: ${product.qty}, Requerido: ${quantity}`
          }
        }

        const ref = doc(db, 'products', productId)
        await updateDoc(ref, { qty: newQty, updatedAt: serverTimestamp() })

        product.qty = newQty
        logInfo('[products] Stock reducido:', productId, 'nueva cantidad:', newQty)

        return { success: true, newQty }
      } catch (e) {
        logError('[products] Error al reducir stock:', e)
        return { success: false, error: e.message }
      }
    },

    async toggleActive(id) {
      try {
        const current = this.getById(id)
        if (!current) return

        const ref = doc(db, 'products', id)
        await updateDoc(ref, { active: !current.active })
        current.active = !current.active

        logInfo('[products] Estado cambiado', id, current.active)
      } catch (e) {
        logError('[products] Error al cambiar estado producto', e)
      }
    },

    async deleteProduct(id) {
      try {
        const ref = doc(db, 'products', id)
        await deleteDoc(ref)

        const idx = this.list.findIndex((p) => p.id === id)
        if (idx !== -1) {
          this.list.splice(idx, 1)
        }

        logInfo('[products] Producto eliminado:', id)
        return { success: true }
      } catch (e) {
        logError('[products] Error al eliminar producto:', e)
        return { success: false, error: e.message }
      }
    },
  },
})
