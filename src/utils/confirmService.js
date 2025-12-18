import { reactive } from 'vue'

const state = reactive({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Aceptar',
  cancelText: 'Cancelar',
  danger: false,
  resolve: null,
  reject: null
})

export const confirmService = {
  state,

  confirm(message, options = {}) {
    return new Promise((resolve, reject) => {
      state.message = message
      state.title = options.title || 'Confirmar'
      state.confirmText = options.confirmText || 'Aceptar'
      state.cancelText = options.cancelText || 'Cancelar'
      state.danger = options.danger || false
      state.isOpen = true
      state.resolve = resolve
      state.reject = reject
    })
  },

  handleConfirm() {
    if (state.resolve) {
      state.resolve(true)
    }
    this.close()
  },

  handleCancel() {
    if (state.resolve) {
      state.resolve(false)
    }
    this.close()
  },

  close() {
    state.isOpen = false
    state.message = ''
    state.title = ''
    state.confirmText = 'Aceptar'
    state.cancelText = 'Cancelar'
    state.danger = false
    state.resolve = null
    state.reject = null
  }
}
