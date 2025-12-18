import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '@/firebase/firebase'
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore'

export const useContactMessagesStore = defineStore('contactMessages', () => {
    const messages = ref([])
    const loading = ref(false)
    const error = ref(null)

    // Getters
    const unreadMessages = computed(() => {
        return messages.value.filter(m => !m.read)
    })

    const unreadCount = computed(() => {
        return unreadMessages.value.length
    })

    const sortedMessages = computed(() => {
        return [...messages.value].sort((a, b) => {
            if (!a.created_at || !b.created_at) return 0
            return b.created_at.seconds - a.created_at.seconds
        })
    })

    // Actions
    const loadMessages = async () => {
        loading.value = true
        error.value = null

        try {
            const q = query(
                collection(db, 'contact_messages'),
                orderBy('created_at', 'desc')
            )

            const snapshot = await getDocs(q)
            messages.value = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        } catch (err) {
            console.error('Error loading messages:', err)
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    const createMessage = async (messageData) => {
        loading.value = true
        error.value = null

        try {
            const docRef = await addDoc(collection(db, 'contact_messages'), {
                name: messageData.name,
                email: messageData.email,
                phone: messageData.phone || '',
                message: messageData.message,
                read: false,
                replied: false,
                created_at: serverTimestamp()
            })

            return docRef.id
        } catch (err) {
            console.error('Error creating message:', err)
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const markAsRead = async (id, read = true) => {
        loading.value = true
        error.value = null

        try {
            const messageRef = doc(db, 'contact_messages', id)
            await updateDoc(messageRef, { read })

            await loadMessages()
        } catch (err) {
            console.error('Error updating message:', err)
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const markAsReplied = async (id, replied = true) => {
        loading.value = true
        error.value = null

        try {
            const messageRef = doc(db, 'contact_messages', id)
            await updateDoc(messageRef, { replied })

            await loadMessages()
        } catch (err) {
            console.error('Error updating message:', err)
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const deleteMessage = async (id) => {
        loading.value = true
        error.value = null

        try {
            await deleteDoc(doc(db, 'contact_messages', id))
            await loadMessages()
        } catch (err) {
            console.error('Error deleting message:', err)
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        messages,
        loading,
        error,
        unreadMessages,
        unreadCount,
        sortedMessages,
        loadMessages,
        createMessage,
        markAsRead,
        markAsReplied,
        deleteMessage
    }
})
