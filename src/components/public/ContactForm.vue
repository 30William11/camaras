<script setup>
import { ref } from 'vue'
import { useContactMessagesStore } from '@/stores/contactMessages'
import { useAlertStore } from '@/stores/alert'

const contactStore = useContactMessagesStore()
const alertStore = useAlertStore()

const form = ref({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const loading = ref(false)
const errors = ref({})

const validateForm = () => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'El nombre es requerido'
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'El email es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Email inválido'
  }

  if (!form.value.message.trim()) {
    errors.value.message = 'El mensaje es requerido'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    await contactStore.createMessage(form.value)

    alertStore.success('Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.')

    // Reset form
    form.value = {
      name: '',
      email: '',
      phone: '',
      message: ''
    }
  } catch {
    alertStore.error('Error al enviar el mensaje. Por favor intenta nuevamente.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md">
    <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">
      Envíanos un Mensaje
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Name -->
      <div>
        <label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Nombre <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          :class="errors.name ? 'border-red-500' : ''"
          placeholder="Tu nombre completo"
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Email <span class="text-red-500">*</span>
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          :class="errors.email ? 'border-red-500' : ''"
          placeholder="tu@email.com"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
      </div>

      <!-- Phone -->
      <div>
        <label for="phone" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Teléfono
        </label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="+123 456 7890"
        />
      </div>

      <!-- Message -->
      <div>
        <label for="message" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Mensaje <span class="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          v-model="form.message"
          rows="5"
          class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          :class="errors.message ? 'border-red-500' : ''"
          placeholder="Cuéntanos sobre tu proyecto o consulta..."
        ></textarea>
        <p v-if="errors.message" class="mt-1 text-sm text-red-500">{{ errors.message }}</p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full px-6 py-4 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>{{ loading ? 'Enviando...' : 'Enviar Mensaje' }}</span>
      </button>
    </form>
  </div>
</template>
