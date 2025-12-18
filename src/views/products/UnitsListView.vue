<script setup>
import { onMounted, ref } from 'vue'
import { useUnitsStore } from '@/stores/units'
import { confirmService } from '@/utils/confirmService'

const unitsStore = useUnitsStore()
const showModal = ref(false)
const editingUnit = ref(null)

const form = ref({
  name: '',
  abbreviation: ''
})

onMounted(() => {
  unitsStore.fetchUnits()
})

const openModal = (unit = null) => {
  if (unit) {
    editingUnit.value = unit
    form.value = {
      name: unit.name,
      abbreviation: unit.abbreviation
    }
  } else {
    editingUnit.value = null
    form.value = {
      name: '',
      abbreviation: ''
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingUnit.value = null
  form.value = {
    name: '',
    abbreviation: ''
  }
}

const saveUnit = async () => {
  try {
    if (editingUnit.value) {
      await unitsStore.updateUnit(editingUnit.value.id, form.value)
    } else {
      await unitsStore.addUnit(form.value)
    }
    closeModal()
  } catch (error) {
    console.error('Error saving unit:', error)
  }
}

const deleteUnit = async (id) => {
  const confirmed = await confirmService.confirm(
    '¿Estás seguro de eliminar esta unidad de medida?',
    {
      title: 'Confirmar eliminación',
      danger: true,
      confirmText: 'Eliminar'
    }
  )

  if (!confirmed) return

  await unitsStore.deleteUnit(id)
}
</script>

<template>
  <div class="text-slate-900 dark:text-white">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-xl md:text-2xl font-bold">Unidades de Medida</h2>
        <p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
          Gestión de unidades para productos
        </p>
      </div>
      <button
        @click="openModal()"
        class="px-4 py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
      >
        + Nueva Unidad
      </button>
    </div>

    <!-- Tabla de unidades -->
    <div class="relative overflow-x-auto shadow-sm rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-w-2xl">
      <table class="w-full text-sm text-left text-slate-500 dark:text-slate-400 min-w-[400px]">
        <thead class="text-sm text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
          <tr>
            <th scope="col" class="px-6 py-3 font-medium">#</th>
            <th scope="col" class="px-6 py-3 font-medium">Nombre</th>
            <th scope="col" class="px-6 py-3 font-medium">Abreviación</th>
            <th scope="col" class="px-6 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="unitsStore.loading">
            <td colspan="4" class="px-6 py-8 text-center">Cargando...</td>
          </tr>
          <tr v-else-if="!unitsStore.list.length">
            <td colspan="4" class="px-6 py-8 text-center">No hay unidades registradas.</td>
          </tr>
          <tr
            v-for="(unit, index) in unitsStore.list"
            :key="unit.id"
            class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
              {{ index + 1 }}
            </td>
            <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
              {{ unit.name }}
            </td>
            <td class="px-6 py-4">
              {{ unit.abbreviation }}
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <button
                  @click="openModal(unit)"
                  class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  title="Editar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="deleteUnit(unit.id)"
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
          {{ editingUnit ? 'Editar Unidad' : 'Nueva Unidad' }}
        </h3>

        <form @submit.prevent="saveUnit" class="space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium mb-1">Nombre</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
              placeholder="Ej: Metro"
            />
          </div>

          <!-- Abreviación -->
          <div>
            <label class="block text-sm font-medium mb-1">Abreviación</label>
            <input
              v-model="form.abbreviation"
              type="text"
              required
              class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
              placeholder="Ej: m"
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
              {{ editingUnit ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
