<script setup>
import { ref, onMounted } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { confirmService } from '@/utils/confirmService'

const categoriesStore = useCategoriesStore()
const showModal = ref(false)
const editingCategory = ref(null)
const formName = ref('')

onMounted(() => {
  categoriesStore.fetchCategories()
})

const openCreate = () => {
  editingCategory.value = null
  formName.value = ''
  showModal.value = true
}

const openEdit = (cat) => {
  editingCategory.value = cat
  formName.value = cat.name
  showModal.value = true
}

const handleDelete = async (cat) => {
  const confirmed = await confirmService.confirm(
    `¿Eliminar categoría "${cat.name}"?`,
    {
      title: 'Confirmar eliminación',
      danger: true,
      confirmText: 'Eliminar'
    }
  )

  if (!confirmed) return

  await categoriesStore.deleteCategory(cat.id)
}

const handleSubmit = async () => {
  if (!formName.value.trim()) return

  if (editingCategory.value) {
    await categoriesStore.updateCategory(editingCategory.value.id, formName.value)
  } else {
    await categoriesStore.createCategory(formName.value)
  }
  showModal.value = false
}
</script>

<template>
  <div class="text-slate-900 dark:text-white">
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-xl md:text-2xl font-bold">Categorías</h2>
        <p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
          Gestión de categorías de productos
        </p>
      </div>
      <button
        @click="openCreate"
        class="px-4 py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
      >
        + Nueva Categoría
      </button>
    </div>

    <!-- Tabla -->
    <div class="relative overflow-x-auto shadow-sm rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 max-w-2xl">
      <table class="w-full text-sm text-left text-slate-500 dark:text-slate-400 min-w-[400px]">
        <thead class="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
          <tr>
            <th scope="col" class="px-4 py-3 w-16 text-center">N°</th>
            <th scope="col" class="px-6 py-3">Nombre</th>
            <th scope="col" class="px-6 py-3 text-center w-28">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="categoriesStore.loading">
            <td colspan="3" class="px-6 py-4 text-center">Cargando...</td>
          </tr>
          <tr v-else-if="!categoriesStore.list.length">
            <td colspan="3" class="px-6 py-4 text-center">No hay categorías.</td>
          </tr>
          <tr
            v-for="(cat, index) in categoriesStore.list"
            :key="cat.id"
            class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <td class="px-4 py-4 text-center text-slate-500 dark:text-slate-400 font-medium">
              {{ index + 1 }}
            </td>
            <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
              {{ cat.name }}
            </td>
            <td class="px-6 py-4 text-center">
              <div class="flex items-center justify-center gap-3">
                <button
                  @click="openEdit(cat)"
                  class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  title="Editar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="handleDelete(cat)"
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
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm p-6">
        <h3 class="text-lg font-bold mb-4 text-slate-900 dark:text-white">
          {{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}
        </h3>
        <form @submit.prevent="handleSubmit">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
          <input
            v-model="formName"
            type="text"
            required
            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white mb-4"
          />
          <div class="flex justify-end gap-2">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
