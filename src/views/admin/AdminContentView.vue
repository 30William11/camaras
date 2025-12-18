<script setup>
import { ref, onMounted } from 'vue'
import { useWebsiteStore } from '@/stores/website'
import { useAlertStore } from '@/stores/alert'

const websiteStore = useWebsiteStore()
const alertStore = useAlertStore()

const loading = ref(false)
const form = ref({
  hero_title: '',
  hero_subtitle: '',
  mission: '',
  vision: '',
  description: '',
  address: '',
  phone: '',
  email: '',
  hours: ''
})

onMounted(async () => {
  await websiteStore.loadContent()

  // Populate form with existing content
  form.value = {
    hero_title: websiteStore.content.home?.hero_title || '',
    hero_subtitle: websiteStore.content.home?.hero_subtitle || '',
    mission: websiteStore.content.about?.mission || '',
    vision: websiteStore.content.about?.vision || '',
    description: websiteStore.content.about?.description || '',
    address: websiteStore.content.contact?.address || '',
    phone: websiteStore.content.contact?.phone || '',
    email: websiteStore.content.contact?.email || '',
    hours: websiteStore.content.contact?.hours || ''
  }
})

const handleSave = async () => {
  loading.value = true

  try {
    await websiteStore.updateContent({
      home: {
        hero_title: form.value.hero_title,
        hero_subtitle: form.value.hero_subtitle
      },
      about: {
        mission: form.value.mission,
        vision: form.value.vision,
        description: form.value.description
      },
      contact: {
        address: form.value.address,
        phone: form.value.phone,
        email: form.value.email,
        hours: form.value.hours
      }
    })

    alertStore.success('Contenido actualizado correctamente')
  } catch {
    alertStore.error('Error al actualizar el contenido')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
        Gestión de Contenido Web
      </h1>
      <button
        @click="handleSave"
        :disabled="loading"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>{{ loading ? 'Guardando...' : 'Guardar Cambios' }}</span>
      </button>
    </div>

    <div class="space-y-6">
      <!-- Home Section -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Página Principal
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Título Principal
            </label>
            <input
              v-model="form.hero_title"
              type="text"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Protege lo que más importa"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Subtítulo
            </label>
            <textarea
              v-model="form.hero_subtitle"
              rows="2"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Sistemas de videovigilancia CCTV profesionales..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- About Section -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Acerca de Nosotros
        </h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Misión
            </label>
            <textarea
              v-model="form.mission"
              rows="3"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Nuestra misión..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Visión
            </label>
            <textarea
              v-model="form.vision"
              rows="3"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Nuestra visión..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Descripción
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Descripción de la empresa..."
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Contact Section -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Información de Contacto
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Dirección
            </label>
            <input
              v-model="form.address"
              type="text"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Calle Principal #123, Ciudad"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Teléfono
            </label>
            <input
              v-model="form.phone"
              type="text"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+123 456 7890"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="info@cctvpro.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Horario
            </label>
            <input
              v-model="form.hours"
              type="text"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Lunes - Viernes: 9:00 AM - 6:00 PM"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
