<script setup>
import { ref, onMounted } from 'vue'
import { useWebsiteStore } from '@/stores/website'

const websiteStore = useWebsiteStore()

const activeTab = ref('home')

const form = ref({
  home: {
    hero_title: '',
    hero_subtitle: ''
  },
  about: {
    mission: '',
    vision: '',
    description: ''
  }
})

const saving = ref(false)
const successMessage = ref('')

onMounted(async () => {
  await websiteStore.loadContent()

  // Initialize form with current values
  form.value.home = {
    hero_title: websiteStore.content.home?.hero_title || '',
    hero_subtitle: websiteStore.content.home?.hero_subtitle || ''
  }

  form.value.about = {
    mission: websiteStore.content.about?.mission || '',
    vision: websiteStore.content.about?.vision || '',
    description: websiteStore.content.about?.description || ''
  }
})

const saveContent = async () => {
  saving.value = true
  successMessage.value = ''

  try {
    await websiteStore.updateContent({
      home: form.value.home,
      about: form.value.about
    })

    successMessage.value = 'Contenido guardado exitosamente'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error saving content:', error)
    alert('Error al guardar el contenido')
  } finally {
    saving.value = false
  }
}

const tabs = [
  { id: 'home', name: 'Página de Inicio', icon: '🏠' },
  { id: 'about', name: 'Nosotros', icon: '👥' }
]
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
        Contenido del Sitio Web
      </h1>
      <p class="text-slate-600 dark:text-slate-400">
        Edita los textos y contenido de las páginas públicas
      </p>
    </div>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3"
    >
      <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      <span class="text-green-800 dark:text-green-200 font-medium">{{ successMessage }}</span>
    </div>

    <!-- Tabs -->
    <div class="mb-6 border-b border-slate-200 dark:border-slate-700">
      <nav class="flex gap-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-3 text-sm font-medium transition-colors relative"
          :class="activeTab === tab.id
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'"
        >
          <span class="flex items-center gap-2">
            <span class="text-lg">{{ tab.icon }}</span>
            {{ tab.name }}
          </span>
          <span
            v-if="activeTab === tab.id"
            class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
          ></span>
        </button>
      </nav>
    </div>

    <form @submit.prevent="saveContent" class="space-y-6">
      <!-- Home Tab -->
      <div v-show="activeTab === 'home'" class="space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Sección Hero (Portada)
            </h2>
          </div>

          <div class="p-6 space-y-4">
            <!-- Hero Title -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Título Principal
              </label>
              <input
                v-model="form.home.hero_title"
                type="text"
                placeholder="Protege lo que más importa"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
              />
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Este es el título grande que aparece en la página de inicio
              </p>
            </div>

            <!-- Hero Subtitle -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Subtítulo
              </label>
              <textarea
                v-model="form.home.hero_subtitle"
                rows="3"
                placeholder="Sistemas de videovigilancia CCTV profesionales con tecnología de última generación"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Descripción breve que aparece debajo del título principal
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- About Tab -->
      <div v-show="activeTab === 'about'" class="space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Página "Nosotros"
            </h2>
          </div>

          <div class="p-6 space-y-4">
            <!-- Mission -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Misión
              </label>
              <textarea
                v-model="form.about.mission"
                rows="4"
                placeholder="Nuestra misión es..."
                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <!-- Vision -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Visión
              </label>
              <textarea
                v-model="form.about.vision"
                rows="4"
                placeholder="Nuestra visión es..."
                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Descripción de la Empresa
              </label>
              <textarea
                v-model="form.about.description"
                rows="6"
                placeholder="Somos una empresa dedicada a..."
                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Descripción general de la empresa que aparece en la página "Nosotros"
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end gap-3 sticky bottom-6">
        <button
          type="submit"
          :disabled="saving || websiteStore.loading"
          class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg v-if="saving" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {{ saving ? 'Guardando...' : 'Guardar Contenido' }}
        </button>
      </div>
    </form>
  </div>
</template>
