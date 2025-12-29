<script setup>
import { onMounted, ref } from 'vue'
import { useServicesStore } from '@/stores/services'
import { confirmService } from '@/utils/confirmService'

const servicesStore = useServicesStore()
const showModal = ref(false)
const editingService = ref(null)

const form = ref({
  name: '',
  description: '',
  price: 0
})

onMounted(() => {
  servicesStore.fetchServices()
})

const openModal = (service = null) => {
  if (service) {
    console.log('📝 Opening edit modal for service:', service)
    editingService.value = { ...service } // Create a copy to avoid reference issues
    form.value = {
      name: service.name || '',
      description: service.description || '',
      price: Number(service.price) || 0
    }
    console.log('📋 Form populated with:', form.value)
  } else {
    console.log('➕ Opening create modal')
    editingService.value = null
    form.value = {
      name: '',
      description: '',
      price: 0
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingService.value = null
  form.value = {
    name: '',
    description: '',
    price: 0
  }
}

const saveService = async () => {
  try {
    console.log('💾 Saving service...', {
      isEdit: !!editingService.value,
      serviceId: editingService.value?.id,
      formData: form.value
    })

    if (editingService.value) {
      console.log('🔄 Updating service:', editingService.value.id)
      await servicesStore.updateService(editingService.value.id, form.value)
      console.log('✅ Service updated successfully')
    } else {
      console.log('➕ Creating new service')
      await servicesStore.addService(form.value)
      console.log('✅ Service created successfully')
    }
    closeModal()
  } catch (error) {
    console.error('❌ Error saving service:', error)
  }
}

const deleteService = async (id) => {
  const confirmed = await confirmService.confirm(
    '¿Estás seguro de eliminar este servicio?',
    {
      title: 'Confirmar eliminación',
      danger: true,
      confirmText: 'Eliminar'
    }
  )

  if (!confirmed) return

  await servicesStore.deleteService(id)
}
</script>

<template>
  <div class="text-slate-900 dark:text-white">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-xl md:text-2xl font-bold">Servicios</h2>
        <p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
          Gestión de servicios CCTV
        </p>
      </div>
      <button
        @click="openModal()"
        class="px-4 py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
      >
        + Nuevo Servicio
      </button>
    </div>

    <!-- Tabla de servicios -->
    <div class="relative overflow-x-auto shadow-sm rounded-xl border-2 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
      <table class="w-full text-sm text-left text-slate-500 dark:text-slate-400 min-w-[600px] border-collapse">
        <thead class="text-sm text-slate-900 dark:text-white bg-cyan-500 dark:bg-slate-700 text-white dark:text-slate-400 border-b-2 border-cyan-400 dark:border-slate-600">
          <tr>
            <th scope="col" class="px-6 py-3 font-medium border-r border-cyan-400 dark:border-slate-600">#</th>
            <th scope="col" class="px-6 py-3 font-medium border-r border-cyan-400 dark:border-slate-600">Nombre</th>
            <th scope="col" class="px-6 py-3 font-medium border-r border-cyan-400 dark:border-slate-600">Descripción</th>
            <th scope="col" class="px-6 py-3 font-medium border-r border-cyan-400 dark:border-slate-600">Precio</th>
            <th scope="col" class="px-6 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="servicesStore.loading">
            <td colspan="5" class="px-6 py-8 text-center">Cargando...</td>
          </tr>
          <tr v-else-if="!servicesStore.list.length">
            <td colspan="5" class="px-6 py-8 text-center">No hay servicios registrados.</td>
          </tr>
          <tr
            v-for="(service, index) in servicesStore.list"
            :key="service.id"
            class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
              {{ index + 1 }}
            </td>
            <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
              {{ service.name }}
            </td>
            <td class="px-6 py-4">
              {{ service.description }}
            </td>
            <td class="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
              S/. {{ Number(service.price || 0).toFixed(2) }}
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <button
                  @click="openModal(service)"
                  class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  title="Editar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="deleteService(service.id)"
                  class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  title="Eliminar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-xl font-bold mb-4">
          {{ editingService ? 'Editar Servicio' : 'Nuevo Servicio' }}
        </h3>

        <form @submit.prevent="saveService" class="space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium mb-1">Nombre del servicio</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
              placeholder="Ej: Instalación de CCTV"
            />
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              v-model="form.description"
              rows="3"
              required
              class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
              placeholder="Describe el servicio..."
            ></textarea>
          </div>

          <!-- Precio -->
          <div>
            <label class="block text-sm font-medium mb-1">Precio (S/.)</label>
            <input
              v-model.number="form.price"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
              placeholder="0.00"
            />
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            >
              {{ editingService ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
