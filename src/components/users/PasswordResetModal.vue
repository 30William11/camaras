<script setup>
import { ref, computed } from 'vue'

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'reset'])

const newPassword = ref('')
const showPassword = ref(false)
const copied = ref(false)

// Password strength indicator
const passwordStrength = computed(() => {
  const pwd = newPassword.value
  if (!pwd) return { level: 0, text: '', color: '' }

  let strength = 0
  if (pwd.length >= 8) strength++
  if (pwd.length >= 12) strength++
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
  if (/\d/.test(pwd)) strength++
  if (/[^a-zA-Z0-9]/.test(pwd)) strength++

  if (strength <= 2) return { level: 1, text: 'Débil', color: 'text-red-600 dark:text-red-400' }
  if (strength === 3) return { level: 2, text: 'Media', color: 'text-yellow-600 dark:text-yellow-400' }
  if (strength === 4) return { level: 3, text: 'Fuerte', color: 'text-green-600 dark:text-green-400' }
  return { level: 4, text: 'Muy Fuerte', color: 'text-emerald-600 dark:text-emerald-400' }
})

const generatePassword = () => {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''

  // Ensure at least one of each type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
  password += '0123456789'[Math.floor(Math.random() * 10)]
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]

  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }

  // Shuffle
  newPassword.value = password.split('').sort(() => Math.random() - 0.5).join('')
  copied.value = false
}

const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(newPassword.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Error al copiar:', err)
  }
}

const handleSubmit = () => {
  if (!newPassword.value || newPassword.value.length < 6) {
    return
  }
  emit('reset', newPassword.value)
  handleClose()
}

const handleClose = () => {
  newPassword.value = ''
  showPassword.value = false
  copied.value = false
  emit('close')
}
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    @click.self="handleClose"
  >
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              Cambiar Contraseña
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {{ user?.displayName || 'Usuario' }}
            </p>
          </div>
          <button
            @click="handleClose"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-4">
        <!-- User Info Alert -->
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-sm text-blue-800 dark:text-blue-200">
              <p class="font-medium mb-1">Email: {{ user?.email }}</p>
              <p>Deberás compartir esta contraseña manualmente con el usuario. Asegúrate de copiarla antes de cerrar este diálogo.</p>
            </div>
          </div>
        </div>

        <!-- Password Input -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Nueva Contraseña
          </label>
          <div class="relative">
            <input
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Ingresa o genera una contraseña"
              class="w-full px-4 py-2.5 pr-24 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>

          <!-- Password Strength -->
          <div v-if="newPassword" class="mt-2 flex items-center gap-2">
            <div class="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-300"
                :class="{
                  'bg-red-500': passwordStrength.level === 1,
                  'bg-yellow-500': passwordStrength.level === 2,
                  'bg-green-500': passwordStrength.level === 3,
                  'bg-emerald-500': passwordStrength.level === 4
                }"
                :style="{ width: `${(passwordStrength.level / 4) * 100}%` }"
              />
            </div>
            <span class="text-xs font-medium" :class="passwordStrength.color">
              {{ passwordStrength.text }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button
            type="button"
            @click="generatePassword"
            class="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition font-medium text-sm"
          >
            🎲 Generar Contraseña
          </button>
          <button
            type="button"
            @click="copyPassword"
            :disabled="!newPassword"
            class="px-4 py-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ copied ? '✓ Copiado' : '📋 Copiar' }}
          </button>
        </div>

        <!-- Warning -->
        <div class="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p class="text-xs text-amber-800 dark:text-amber-200">
            ⚠️ <strong>Importante:</strong> Esta contraseña solo se mostrará una vez. Asegúrate de copiarla antes de continuar.
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
        <button
          type="button"
          @click="handleClose"
          class="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium text-sm"
        >
          Cancelar
        </button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="!newPassword || newPassword.length < 6"
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Establecer Contraseña
        </button>
      </div>
    </div>
  </div>
</template>
