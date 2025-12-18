import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
    const alerts = ref([])
    let nextId = 1

    const addAlert = (type, message, duration = 5000) => {
        const id = nextId++
        alerts.value.push({ id, type, message })

        if (duration > 0) {
            setTimeout(() => {
                removeAlert(id)
            }, duration)
        }

        return id
    }

    const removeAlert = (id) => {
        const index = alerts.value.findIndex(a => a.id === id)
        if (index !== -1) {
            alerts.value.splice(index, 1)
        }
    }

    const success = (message, duration) => addAlert('success', message, duration)
    const error = (message, duration) => addAlert('error', message, duration)
    const warning = (message, duration) => addAlert('warning', message, duration)
    const info = (message, duration) => addAlert('info', message, duration)

    const clear = () => {
        alerts.value = []
    }

    return {
        alerts,
        addAlert,
        removeAlert,
        success,
        error,
        warning,
        info,
        clear
    }
})
