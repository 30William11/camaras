import { reactive } from 'vue'

const state = reactive({
  alerts: []
})

let nextId = 1

const addAlert = (message, type = 'info', duration = 5000) => {
  const id = nextId++
  const alert = {
    id,
    message,
    type,
    visible: true
  }

  state.alerts.push(alert)

  if (duration > 0) {
    setTimeout(() => {
      removeAlert(id)
    }, duration)
  }

  return id
}

const removeAlert = (id) => {
  const index = state.alerts.findIndex(a => a.id === id)
  if (index !== -1) {
    state.alerts.splice(index, 1)
  }
}

export const alertService = {
  state,

  showInfo(message, duration = 5000) {
    return addAlert(message, 'info', duration)
  },

  showDanger(message, duration = 5000) {
    return addAlert(message, 'danger', duration)
  },

  showSuccess(message, duration = 5000) {
    return addAlert(message, 'success', duration)
  },

  showWarning(message, duration = 5000) {
    return addAlert(message, 'warning', duration)
  },

  showDark(message, duration = 5000) {
    return addAlert(message, 'dark', duration)
  },

  dismiss(id) {
    removeAlert(id)
  },

  dismissAll() {
    state.alerts = []
  }
}
