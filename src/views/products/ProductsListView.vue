<script setup>
import { ref, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { confirmService } from '@/utils/confirmService'
import ProductsTable from '@/components/products/ProductsTable.vue'
import ProductModal from '@/components/products/ProductModal.vue'
import ProductImportModal from '@/components/products/ProductImportModal.vue'

const productsStore = useProductsStore()

const isModalOpen = ref(false)
const isImportModalOpen = ref(false)
const currentProduct = ref(null) // null = create, object = edit

onMounted(() => {
  productsStore.fetchProducts()
})

const openCreateModal = () => {
  currentProduct.value = null
  isModalOpen.value = true
}

const openEditModal = (product) => {
  currentProduct.value = product
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  currentProduct.value = null
}

const handleSave = async (data) => {
  if (data.id) {
    await productsStore.updateProduct(data.id, data)
  } else {
    await productsStore.createProduct(data)
  }
  closeModal()
}

const handleDelete = async (product) => {
  const confirmed = await confirmService.confirm(
    `¿Estás seguro de eliminar el producto "${product.name}"?`,
    {
      title: 'Confirmar eliminación',
      danger: true,
      confirmText: 'Eliminar'
    }
  )

  if (!confirmed) return

  await productsStore.deleteProduct(product.id)
}
</script>

<template>
  <div class="text-slate-900 dark:text-white">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold">Productos</h2>
        <p class="text-slate-600 dark:text-slate-300 text-sm">
          Gestión del catálogo de productos
        </p>
      </div>
      <div class="flex gap-2">
        <router-link
          :to="{ name: 'app.categories.index' }"
          class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 rounded-lg text-sm font-medium transition flex items-center gap-2"
        >
          <span>🏷️</span> Categorías
        </router-link>
        <button
          @click="isImportModalOpen = true"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
        >
          <span>📊</span> Importar Excel
        </button>
        <button
          @click="openCreateModal"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
        >
          + Nuevo Producto
        </button>
      </div>
    </div>

    <ProductsTable
      :onEdit="openEditModal"
      :onDelete="handleDelete"
    />

    <ProductModal
      :isOpen="isModalOpen"
      :product="currentProduct"
      @close="closeModal"
      @save="handleSave"
    />

    <ProductImportModal
      :show="isImportModalOpen"
      @close="isImportModalOpen = false"
      @imported="productsStore.fetchProducts()"
    />
  </div>
</template>
