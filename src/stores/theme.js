import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Estado: true = dark, false = light
  const isDark = ref(false)

  // Inicializar tema desde localStorage o preferencia del sistema
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme !== null) {
      // Usar tema guardado
      isDark.value = savedTheme === 'dark'
    } else {
      // Usar preferencia del sistema
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    applyTheme()
  }

  // Aplicar tema al HTML
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Cambiar tema
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  // Establecer tema específico
  const setTheme = (dark) => {
    isDark.value = dark
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  return {
    isDark,
    initTheme,
    toggleTheme,
    setTheme
  }
})
