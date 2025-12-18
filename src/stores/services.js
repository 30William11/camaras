import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/firebase/firebase'

export const useServicesStore = defineStore('services', () => {
  const list = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const activeServices = computed(() => list.value.filter(s => s.active !== false))
  const totalServices = computed(() => list.value.length)

  // Fetch all services
  const fetchServices = async () => {
    loading.value = true
    error.value = null
    try {
      const q = query(collection(db, 'services'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      list.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (err) {
      error.value = err.message
      console.error('Error fetching services:', err)
    } finally {
      loading.value = false
    }
  }

  // Add service
  const addService = async (serviceData) => {
    loading.value = true
    error.value = null
    try {
      const docRef = await addDoc(collection(db, 'services'), {
        ...serviceData,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      await fetchServices()
      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('Error adding service:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update service
  const updateService = async (id, serviceData) => {
    loading.value = true
    error.value = null
    try {
      const serviceRef = doc(db, 'services', id)
      await updateDoc(serviceRef, {
        ...serviceData,
        updatedAt: serverTimestamp()
      })
      await fetchServices()
    } catch (err) {
      error.value = err.message
      console.error('Error updating service:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete service
  const deleteService = async (id) => {
    loading.value = true
    error.value = null
    try {
      await deleteDoc(doc(db, 'services', id))
      await fetchServices()
    } catch (err) {
      error.value = err.message
      console.error('Error deleting service:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    list,
    loading,
    error,
    activeServices,
    totalServices,
    fetchServices,
    addService,
    updateService,
    deleteService
  }
})
