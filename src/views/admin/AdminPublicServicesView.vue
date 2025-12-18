<script setup>
import { ref, onMounted } from 'vue'
import { usePublicServicesStore } from '@/stores/publicServices'
import { useAlertStore } from '@/stores/alert'

const servicesStore = usePublicServicesStore()
const alertStore = useAlertStore()

const showModal = ref(false)
const showDeleteConfirm = ref(false)
const serviceToDelete = ref(null)
const editingService = ref(null)
const form = ref({
  name: '',
  description: '',
  category: '',
  image_url: '',
  active: true,
  order: 0
})

onMounted(() => {
  servicesStore.loadServices()
})

const openCreateModal = () => {
  editingService.value = null
  form.value = {
    name: '',
    description: '',
    category: '',
    image_url: '',
    active: true,
    order: 0
  }
  showModal.value = true
}

const openEditModal = (service) => {
  editingService.value = service
  form.value = {
    name: service.name,
    description: service.description,
    category: service.category || '',
    image_url: service.image_url || '',
    active: service.active,
    order: service.order || 0
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingService.value = null
}

const handleSubmit = async () => {
  try {
    if (editingService.value) {
      await servicesStore.updateService(editingService.value.id, form.value)
      alertStore.success('Servicio actualizado correctamente')
    } else {
      await servicesStore.createService(form.value)
      alertStore.success('Servicio creado correctamente')
    }
    closeModal()
  } catch {
    alertStore.error('Error al guardar el servicio')
  }
}

const confirmDelete = (service) => {
  serviceToDelete.value = service
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  serviceToDelete.value = null
  showDeleteConfirm.value = false
}

const handleDelete = async () => {
  if (!serviceToDelete.value) return

  try {
    await servicesStore.deleteService(serviceToDelete.value.id)
    alertStore.success('Servicio eliminado correctamente')
  } catch {
    alertStore.error('Error al eliminar el servicio')
  } finally {
    cancelDelete()
  }
}

const toggleActive = async (service) => {
  try {
    await servicesStore.toggleServiceActive(service.id, !service.active)
    alertStore.success(`Servicio ${service.active ? 'desactivado' : 'activado'}`)
  } catch {
    alertStore.error('Error al actualizar el servicio')
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
        Gestión de Servicios Públicos
      </h1>
      <button
        @click="openCreateModal"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nuevo Servicio
      </button>
    </div>

    <!-- Services List -->
    <div v-if="servicesStore.services.length > 0" class="grid grid-cols-1 gap-4">
      <div
        v-for="service in servicesStore.services"
        :key="service.id"
        class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md"
      >
        <div class="flex items-start gap-4">
          <!-- Image -->
          <div class="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex-shrink-0 overflow-hidden">
            <img
              v-if="service.image_url"
              :src="service.image_url"
              :alt="service.name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-2">
              <div>
                <h3 class="text-xl font-semibold text-slate-900 dark:text-white">
                  {{ service.name }}
                </h3>
                <div class="flex items-center gap-2 mt-1">
                  <span
                    v-if="service.category"
                    class="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                  >
                    {{ service.category }}
                  </span>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded"
                    :class="service.active
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'"
                  >
                    {{ service.active ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <button
                  @click="toggleActive(service)"
                  class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  :title="service.active ? 'Desactivar' : 'Activar'"
                >
                  <svg v-if="service.active" class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
                <button
                  @click="openEditModal(service)"
                  class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-blue-600 dark:text-blue-400"
                  title="Editar"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(service)"
                  class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-red-600 dark:text-red-400"
                  title="Eliminar"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <p class="text-slate-600 dark:text-slate-400 mt-2">
              {{ service.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 bg-white dark:bg-slate-800 rounded-xl">
      <svg class="w-24 h-24 mx-auto text-slate-300 dark:text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        No hay servicios
      </h3>
      <p class="text-slate-600 dark:text-slate-400 mb-6">
        Comienza agregando tu primer servicio público
      </p>
      <button
        @click="openCreateModal"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Crear Servicio
      </button>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          {{ editingService ? 'Editar Servicio' : 'Nuevo Servicio' }}
        </h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Nombre del Servicio *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Instalación de Cámaras CCTV"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Descripción *
            </label>
            <textarea
              v-model="form.description"
              required
              rows="4"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe el servicio..."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Categoría
              </label>
              <input
                v-model="form.category"
                type="text"
                class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Instalación"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Orden
              </label>
              <input
                v-model.number="form.order"
                type="number"
                class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              URL de Imagen
            </label>
            <input
              v-model="form.image_url"
              type="url"
              class="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="form.active"
              type="checkbox"
              id="active"
              class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label for="active" class="text-sm font-medium text-slate-700 dark:text-slate-300">
              Servicio activo (visible en la web pública)
            </label>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {{ editingService ? 'Actualizar' : 'Crear' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="cancelDelete"
    >
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">
          ¿Eliminar servicio?
        </h3>
        <p class="text-slate-600 dark:text-slate-400 mb-6">
          ¿Estás seguro de que deseas eliminar "{{ serviceToDelete?.name }}"? Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-3">
          <button
            @click="handleDelete"
            class="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Eliminar
          </button>
          <button
            @click="cancelDelete"
            class="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
