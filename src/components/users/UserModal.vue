<!-- src/components/users/UserModal.vue -->
<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const isEditMode = computed(() => !!props.user)

// Form data
const formData = ref({
  displayName: '',
  email: '',
  password: '',
  role: 'trabajador'
})

const errors = ref({})
const saving = ref(false)

/* ✅ PRIMERO definimos resetForm */
const resetForm = () => {
  formData.value = {
    displayName: '',
    email: '',
    password: '',
    role: 'trabajador'
  }
  errors.value = {}
}

/* 👀 LUEGO usamos resetForm en el watch */
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      formData.value = {
        displayName: newUser.displayName || '',
        email: newUser.email || '',
        password: '', // Nunca prellenar password
        role: newUser.role || 'trabajador'
      }
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// Validación
const validateForm = () => {
  errors.value = {}

  if (!formData.value.displayName.trim()) {
    errors.value.displayName = 'El nombre es requerido'
  }

  if (!formData.value.email.trim()) {
    errors.value.email = 'El email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Email inválido'
  }

  if (!isEditMode.value && !formData.value.password) {
    errors.value.password = 'La contraseña es requerida'
  } else if (!isEditMode.value && formData.value.password.length < 6) {
    errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
  }

  return Object.keys(errors.value).length === 0
}

// Guardar
const handleSave = async () => {
  if (!validateForm()) return

  saving.value = true
  try {
    await emit('save', {
      ...formData.value,
      id: props.user?.id
    })
    resetForm()
  } finally {
    saving.value = false
  }
}

// Cerrar
const handleClose = () => {
  resetForm()
  emit('close')
}

// Click en fondo
const handleBackdropClick = (e) => {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      @click="handleBackdropClick"
    >
      <div
        class="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800"
        @click.stop
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {{ isEditMode ? 'Editar Usuario' : 'Crear Usuario' }}
          </h3>
          <button
            @click="handleClose"
            class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <form @submit.prevent="handleSave" class="p-6 space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nombre completo
            </label>
            <input
              v-model="formData.displayName"
              type="text"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              :class="{ 'border-red-500 dark:border-red-500': errors.displayName }"
              placeholder="Juan Pérez"
            >
            <p v-if="errors.displayName" class="mt-1 text-xs text-red-600 dark:text-red-400">
              {{ errors.displayName }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              v-model="formData.email"
              type="email"
              :disabled="isEditMode"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{ 'border-red-500 dark:border-red-500': errors.email }"
              placeholder="juan@ejemplo.com"
            >
            <p v-if="errors.email" class="mt-1 text-xs text-red-600 dark:text-red-400">
              {{ errors.email }}
            </p>
            <p v-if="isEditMode" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              El email no se puede modificar
            </p>
          </div>

          <!-- Password (solo crear) -->
          <div v-if="!isEditMode">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Contraseña
            </label>
            <input
              v-model="formData.password"
              type="password"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              :class="{ 'border-red-500 dark:border-red-500': errors.password }"
              placeholder="Mínimo 6 caracteres"
            >
            <p v-if="errors.password" class="mt-1 text-xs text-red-600 dark:text-red-400">
              {{ errors.password }}
            </p>
          </div>

          <!-- Rol -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Rol
            </label>
            <select
              v-model="formData.role"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            >
              <option value="trabajador">Trabajador</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>

          <!-- Botones -->
          <div class="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              @click="handleClose"
              class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
              :disabled="saving"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="saving"
            >
              {{ saving ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>
