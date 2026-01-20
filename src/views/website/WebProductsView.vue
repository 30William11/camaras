<script setup>
import { ref, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useCategoriesStore } from '@/stores/categories'

const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const showModal = ref(false)
const editingProduct = ref(null)

const form = ref({
  name: '',
  description: '',
  brand: '',
  category: '',
  type: 'equipo',
  active: true,
  imageFile: null,
  imageUrl: null,
  pdfFile: null,
  pdfUrl: null
})

onMounted(async () => {
  await Promise.all([
    productsStore.fetchProducts(),
    categoriesStore.fetchCategories()
  ])
})

const openCreateModal = () => {
  editingProduct.value = null
  form.value = {
    name: '',
    description: '',
    brand: '',
    category: '',
    type: 'equipo',
    active: true,
    imageFile: null,
    imageUrl: null,
    pdfFile: null,
    pdfUrl: null
  }
  showModal.value = true
}

const openEditModal = (product) => {
  editingProduct.value = product
  form.value = {
    name: product.name,
    description: product.description || '',
    brand: product.brand || '',
    category: product.category || '',
    type: product.type || 'equipo',
    active: product.active ?? true,
    imageFile: null,
    imageUrl: product.imageUrl,
    pdfFile: null,
    pdfUrl: product.pdfUrl
  }
  showModal.value = true
}

const handleImageChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.imageFile = file
    form.value.imageUrl = URL.createObjectURL(file)
  }
}

const handlePdfChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.pdfFile = file
  }
}

const saveProduct = async () => {
  const saving = ref(true)

  try {
    console.log('=== SAVING PRODUCT ===')
    console.log('Editing:', editingProduct.value?.id)
    console.log('Form data:', {
      name: form.value.name,
      hasImageFile: !!form.value.imageFile,
      imageFileName: form.value.imageFile?.name,
      hasPdfFile: !!form.value.pdfFile,
      pdfFileName: form.value.pdfFile?.name,
      imageUrl: form.value.imageUrl,
      pdfUrl: form.value.pdfUrl
    })

    if (editingProduct.value) {
      // EDIT: Only update web-relevant fields
      const productData = {
        name: form.value.name,
        description: form.value.description,
        brand: form.value.brand,
        category: form.value.category,
        type: form.value.type,
        active: form.value.active
      }

      // Add image file if selected
      if (form.value.imageFile) {
        console.log('Adding image file to update:', form.value.imageFile.name)
        productData.imageFile = form.value.imageFile
      }

      // Add PDF file if selected
      if (form.value.pdfFile) {
        console.log('Adding PDF file to update:', form.value.pdfFile.name)
        productData.pdfFile = form.value.pdfFile
      }

      console.log('Calling updateProduct with:', productData)
      const result = await productsStore.updateProduct(editingProduct.value.id, productData)
      console.log('Update result:', result)

      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar')
      }
    } else {
      // CREATE: Set all fields including defaults for quotation system
      const productData = {
        name: form.value.name,
        description: form.value.description,
        brand: form.value.brand,
        category: form.value.category,
        type: form.value.type,
        active: form.value.active,
        imageFile: form.value.imageFile,
        pdfFile: form.value.pdfFile,
        // Set default values for quotation system fields
        sku: '',
        qty: 0,
        priceUsd: 0,
        exchangeRate: 0,
        profitPercentage: 0,
        salePrice: 0,
        unit: 'unidad'
      }

      console.log('Creating new product with:', productData)
      const result = await productsStore.createProduct(productData)
      console.log('Create result:', result)

      if (!result.success) {
        throw new Error(result.error || 'Error al crear')
      }
    }

    showModal.value = false
    await productsStore.fetchProducts()
    console.log('=== PRODUCT SAVED SUCCESSFULLY ===')
  } catch (error) {
    console.error('=== ERROR SAVING PRODUCT ===')
    console.error('Error details:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    alert('Error al guardar el producto: ' + (error.message || 'Error desconocido'))
  } finally {
    saving.value = false
  }
}

const toggleActive = async (product) => {
  await productsStore.toggleActive(product.id)
}

const deleteProduct = async (product) => {
  if (confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
    await productsStore.deleteProduct(product.id)
  }
}

const typeLabels = {
  equipo: 'Equipo',
  mano_obra: 'Mano de Obra',
  servicio: 'Servicio'
}
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Productos del Sitio Web
        </h1>
        <p class="text-slate-600 dark:text-slate-400">
          Gestiona los productos que se muestran en el catálogo público
        </p>
      </div>
      <button
        @click="openCreateModal"
        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nuevo Producto
      </button>
    </div>

    <!-- Products Grid -->
    <div v-if="productsStore.loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="product in productsStore.list"
        :key="product.id"
        class="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
      >
        <!-- Image -->
        <div class="relative h-48 bg-slate-100 dark:bg-slate-700">
          <img
            v-if="product.imageUrl"
            :src="product.imageUrl"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-slate-400">
            <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <!-- Status Badge -->
          <div class="absolute top-2 right-2">
            <span
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="product.active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'"
            >
              {{ product.active ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2 line-clamp-2">
            {{ product.name }}
          </h3>

          <div class="flex flex-wrap gap-2 mb-3">
            <span v-if="product.brand" class="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
              {{ product.brand }}
            </span>
            <span class="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
              {{ typeLabels[product.type] || product.type }}
            </span>
          </div>

          <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
            {{ product.description || 'Sin descripción' }}
          </p>

          <!-- PDF Indicator -->
          <div class="mb-4">
            <span
              v-if="product.pdfUrl"
              class="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
              PDF disponible
            </span>
            <span v-else class="inline-flex items-center gap-1 text-xs text-slate-400">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
              Sin PDF
            </span>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              @click="openEditModal(product)"
              class="flex-1 px-3 py-2 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              Editar
            </button>
            <button
              @click="toggleActive(product)"
              class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="product.active ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30' : 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'"
            >
              {{ product.active ? 'Desactivar' : 'Activar' }}
            </button>
            <button
              @click="deleteProduct(product)"
              class="px-3 py-2 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!productsStore.loading && productsStore.list.length === 0" class="text-center py-20">
      <svg class="mx-auto h-24 w-24 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
        No hay productos
      </h3>
      <p class="mt-2 text-slate-600 dark:text-slate-400">
        Comienza agregando tu primer producto para el catálogo web
      </p>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showModal = false"
    >
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">
            {{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}
          </h3>
          <button @click="showModal = false" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            ✕
          </button>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="saveProduct" class="flex flex-col flex-1 overflow-hidden">
          <div class="p-6 space-y-4 overflow-y-auto flex-1">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nombre del Producto *
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                placeholder="Cámara IP 4MP"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Descripción Breve
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Cámara de seguridad con visión nocturna y detección de movimiento..."
                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <!-- Brand & Type -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Marca
                </label>
                <input
                  v-model="form.brand"
                  type="text"
                  placeholder="Hikvision"
                  class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tipo
                </label>
                <select
                  v-model="form.type"
                  class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="equipo">Equipo</option>
                  <option value="mano_obra">Mano de Obra</option>
                  <option value="servicio">Servicio</option>
                </select>
              </div>
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Categoría
              </label>
              <select
                v-model="form.category"
                class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sin categoría</option>
                <option v-for="cat in categoriesStore.list" :key="cat.id" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <!-- Image Upload -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Imagen del Producto
              </label>
              <div class="flex items-center gap-4">
                <div v-if="form.imageUrl" class="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                  <img :src="form.imageUrl" class="w-full h-full object-cover" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageChange"
                  class="block w-full text-sm text-slate-500 dark:text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    dark:file:bg-slate-700 dark:file:text-slate-300
                  "
                />
              </div>
            </div>

            <!-- PDF Upload -->
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Especificaciones Técnicas (PDF)
              </label>
              <div class="space-y-2">
                <div v-if="form.pdfUrl || form.pdfFile" class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                  <span>{{ form.pdfFile ? form.pdfFile.name : 'PDF cargado' }}</span>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  @change="handlePdfChange"
                  class="block w-full text-sm text-slate-500 dark:text-slate-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-red-50 file:text-red-700
                    hover:file:bg-red-100
                    dark:file:bg-slate-700 dark:file:text-slate-300
                  "
                />
              </div>
            </div>

            <!-- Active Status -->
            <div class="flex items-center">
              <input
                v-model="form.active"
                id="active"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
              />
              <label for="active" class="ml-2 text-sm font-medium text-slate-900 dark:text-slate-300">
                Producto Activo (visible en la web)
              </label>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0 bg-white dark:bg-slate-800">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {{ editingProduct ? 'Guardar Cambios' : 'Crear Producto' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
