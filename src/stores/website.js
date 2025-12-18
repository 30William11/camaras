import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/firebase/firebase'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export const useWebsiteStore = defineStore('website', () => {
    const content = ref({
        home: {
            hero_title: 'Protege lo que más importa',
            hero_subtitle: 'Sistemas de videovigilancia CCTV profesionales con tecnología de última generación',
            features: []
        },
        about: {
            mission: '',
            vision: '',
            description: ''
        },
        contact: {
            address: '',
            phone: '',
            email: '',
            hours: ''
        },
        social: {
            facebook: '',
            instagram: '',
            linkedin: ''
        }
    })

    const loading = ref(false)
    const error = ref(null)

    // Actions
    const loadContent = async () => {
        loading.value = true
        error.value = null

        try {
            const docRef = doc(db, 'website_content', 'main')
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                content.value = { ...content.value, ...docSnap.data() }
            }
        } catch (err) {
            console.error('Error loading website content:', err)
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    const updateContent = async (newContent) => {
        loading.value = true
        error.value = null

        try {
            const docRef = doc(db, 'website_content', 'main')
            await setDoc(docRef, {
                ...newContent,
                updated_at: serverTimestamp()
            }, { merge: true })

            content.value = { ...content.value, ...newContent }
        } catch (err) {
            console.error('Error updating website content:', err)
            error.value = err.message
            throw err
        } finally {
            loading.value = false
        }
    }

    const updateSection = async (section, data) => {
        const newContent = {
            ...content.value,
            [section]: { ...content.value[section], ...data }
        }

        await updateContent(newContent)
    }

    return {
        content,
        loading,
        error,
        loadContent,
        updateContent,
        updateSection
    }
})
