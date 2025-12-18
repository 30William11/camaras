<script setup>
import { ref, onMounted } from 'vue'
import { useClientsStore } from '@/stores/clients'
import { alertService } from '@/utils/alertService'
import { confirmService } from '@/utils/confirmService'
import ClientModal from '@/components/clients/ClientModal.vue'

const clientsStore = useClientsStore()

const showModal = ref(false)
const editingClient = ref(null)

onMounted(() => {
  clientsStore.fetchClients()
})

const openCreateModal = () => {
  editingClient.value = null
  showModal.value = true
}

const openEditModal = (client) => {
  editingClient.value = client
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingClient.value = null
}

const handleSave = async (data) => {
  let res
  if (data.id) {
    res = await clientsStore.updateClient(data.id, data)
  } else {
    res = await clientsStore.createClient(data)
  }

  if (res.success) {
    closeModal()
  } else {
    alertService.showDanger('Error al guardar: ' + res.error)
  }
}

const handleDelete = async (client) => {
  const confirmed = await confirmService.confirm(
    `¿Estás seguro de eliminar al cliente "${client.name}"?`,
    {
      title: 'Confirmar eliminación',
      danger: true,
      confirmText: 'Eliminar'
    }
  )

  if (!confirmed) return

  await clientsStore.deleteClient(client.id)
}
</script>

<template>
  <div class="text-slate-900 dark:text-white">
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-xl md:text-2xl font-bold">Clientes</h2>
        <p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
          Gestión de clientes y contactos
        </p>
      </div>
      <button
        @click="openCreateModal"
        class="px-4 py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
      >
        + Nuevo Cliente
      </button>
    </div>

    <div class="relative overflow-x-auto shadow-sm rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <table class="w-full text-sm text-left text-slate-500 dark:text-slate-400 min-w-[700px]">
        <thead class="text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
          <tr>
            <th scope="col" class="px-6 py-3 font-medium">Nombre / Razón Social</th>
            <th scope="col" class="px-6 py-3 font-medium">Documento</th>
            <th scope="col" class="px-6 py-3 font-medium">Contacto</th>
            <th scope="col" class="px-6 py-3 font-medium">Dirección</th>
            <th scope="col" class="px-6 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="clientsStore.loading">
            <td colspan="5" class="px-6 py-8 text-center">Cargando...</td>
          </tr>
          <tr v-else-if="!clientsStore.list.length">
            <td colspan="5" class="px-6 py-8 text-center">No hay clientes registrados.</td>
          </tr>
          <tr
            v-for="client in clientsStore.list"
            :key="client.id"
            class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
              {{ client.name }}
            </td>
            <td class="px-6 py-4">
              <span class="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mr-2">
                {{ client.documentType }}
              </span>
              {{ client.documentNumber }}
            </td>
            <td class="px-6 py-4">
              <div v-if="client.phone" class="flex items-center gap-1 text-xs mb-1">
                <span>📞</span> {{ client.phone }}
              </div>
              <div v-if="client.email" class="flex items-center gap-1 text-xs">
                <span>✉️</span> {{ client.email }}
              </div>
            </td>
            <td class="px-6 py-4 truncate max-w-xs" :title="client.address">
              {{ client.address }}
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <button
                  @click="openEditModal(client)"
                  class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  title="Editar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="handleDelete(client)"
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

    <ClientModal
      :show="showModal"
      :client="editingClient"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>
