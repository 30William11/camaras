<!-- src/views/products/ProductsListView.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { alertService } from '@/utils/alertService'
import { confirmService } from '@/utils/confirmService'
import ProductsTable from '@/components/products/ProductsTable.vue'
import ProductModal from '@/components/products/ProductModal.vue'
import { logInfo, logError } from '@/utils/logger'

const productsStore = useProductsStore()

const showModal = ref(false)
const editingProduct = ref(null)

onMounted(async () => {
  logInfo('[ProductsListView] onMounted – llamando fetchProducts')
  try {
    await productsStore.fetchProducts()
    logInfo('[ProductsListView] Productos en store:', productsStore.list.length)
  } catch (e) {
    logError('[ProductsListView] Error en onMounted', e)
  }
})

const openCreateModal = () => {
  editingProduct.value = null
  showModal.value = true
}

const openEditModal = (product) => {
  editingProduct.value = product
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingProduct.value = null
}

const handleSave = async (payload) => {
  let result
  if (payload.id) {
    result = await productsStore.updateProduct(payload.id, payload)
  } else {
    result = await productsStore.createProduct(payload)
  }

  if (result.success) {
    logInfo('[ProductsListView] Producto guardado OK')
    closeModal()
  } else {
    logError('[ProductsListView] Error al guardar producto', result.error)
    alertService.showDanger('Error al guardar producto: ' + result.error)
  }
}

const handleDelete = async (product) => {
  const confirmed = await confirmService.confirm(
    `¿Eliminar el producto "${product.name}"?`,
    {
      title: 'Confirmar eliminación',
      danger: true,
      confirmText: 'Eliminar'
    }
  )

  if (!confirmed) return

  logInfo('[ProductsListView] TODO borrar producto en Firestore', product.id)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Productos
        </h2>
        <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Aquí gestionaremos el catálogo de productos y servicios.
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition shadow-sm"
        @click="openCreateModal"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo producto
      </button>
    </div>

    <ProductsTable
      :on-edit="openEditModal"
      :on-delete="handleDelete"
    />

    <ProductModal
      :show="showModal"
      :product="editingProduct"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>
