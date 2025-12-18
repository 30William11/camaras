import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '@/firebase/firebase'
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore'

export const usePublicServicesStore = defineStore('publicServices', () => {
    const services = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Getters
    const activeServices = computed(() => {
        return services.value.filter(s => s.active)
    })

    const servicesByCategory = computed(() => {
        return (category) => {
            return activeServices.value.filter(s => s.category === category)
        }
    })

    // Actions
    const loadServices = async () => {
        loading.value = true
        error.value = null

        try {
            const q = query(
                collection(db, 'public_services'),
                orderBy('order', 'asc')
            )

            const snapshot = await getDocs(q)
            services.value = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (err) {
            console.error('Error loading public services:', err)
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    const createService = async (serviceData) => {
        loading.value = true
        error.value = null

        try {
            const docRef = await addDoc(collection(db, 'public_services'), {
                ...serviceData,
                active: serviceData.active ?? true,
                order: serviceData.order ?? 0,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp()
            })

            await loadServices()
            return docRef.id
        } catch (err) {
            console.error('Error creating service:', err)
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateService = async (id, serviceData) => {
        loading.value = true
        error.value = null

        try {
            const serviceRef = doc(db, 'public_services', id)
            await updateDoc(serviceRef, {
                ...serviceData,
                updated_at: serverTimestamp()
            })

            await loadServices()
        } catch (err) {
            console.error('Error updating service:', err)
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteService = async (id) => {
        loading.value = true
        error.value = null

        try {
            await deleteDoc(doc(db, 'public_services', id))
            await loadServices()
        } catch (err) {
            console.error('Error deleting service:', err)
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const toggleServiceActive = async (id, active) => {
        await updateService(id, { active })
    }

    return {
        services,
        loading,
        error,
        activeServices,
        servicesByCategory,
        loadServices,
        createService,
        updateService,
        deleteService,
        toggleServiceActive
    }
})
