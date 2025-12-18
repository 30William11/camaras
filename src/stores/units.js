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

export const useUnitsStore = defineStore('units', () => {
  const list = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const activeUnits = computed(() => list.value.filter(u => u.active !== false))
  const totalUnits = computed(() => list.value.length)

  // Fetch all units
  const fetchUnits = async () => {
    loading.value = true
    error.value = null
    try {
      const q = query(collection(db, 'units'), orderBy('name', 'asc'))
      const snapshot = await getDocs(q)
      list.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (err) {
      error.value = err.message
      console.error('Error fetching units:', err)
    } finally {
      loading.value = false
    }
  }

  // Add unit
  const addUnit = async (unitData) => {
    loading.value = true
    error.value = null
    try {
      const docRef = await addDoc(collection(db, 'units'), {
        ...unitData,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      await fetchUnits()
      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('Error adding unit:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update unit
  const updateUnit = async (id, unitData) => {
    loading.value = true
    error.value = null
    try {
      const unitRef = doc(db, 'units', id)
      await updateDoc(unitRef, {
        ...unitData,
        updatedAt: serverTimestamp()
      })
      await fetchUnits()
    } catch (err) {
      error.value = err.message
      console.error('Error updating unit:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete unit
  const deleteUnit = async (id) => {
    loading.value = true
    error.value = null
    try {
      await deleteDoc(doc(db, 'units', id))
      await fetchUnits()
    } catch (err) {
      error.value = err.message
      console.error('Error deleting unit:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    list,
    loading,
    error,
    activeUnits,
    totalUnits,
    fetchUnits,
    addUnit,
    updateUnit,
    deleteUnit
  }
})
