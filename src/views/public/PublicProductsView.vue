<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useCategoriesStore } from '@/stores/categories'
import ProductCard from '@/components/public/ProductCard.vue'

const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const searchQuery = ref('')
const selectedType = ref('')
const selectedBrand = ref('')
const selectedCategory = ref('')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

onMounted(async () => {
  await Promise.all([
    productsStore.fetchActiveProducts(),
    categoriesStore.fetchCategories()
  ])
})

// Get unique brands from products
const availableBrands = computed(() => {
  const brands = productsStore.list
    .map(p => p.brand)
    .filter(b => b && b.trim() !== '')
  return [...new Set(brands)].sort()
})

// Get unique types
const availableTypes = [
  { value: 'equipo', label: 'Equipo' },
  { value: 'mano_obra', label: 'Mano de Obra' },
  { value: 'servicio', label: 'Servicio' }
]

// Filter products
const filteredProducts = computed(() => {
  let products = productsStore.list

  // Search by name
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query) ||
      p.brand?.toLowerCase().includes(query)
    )
  }

  // Filter by type
  if (selectedType.value) {
    products = products.filter(p => p.type === selectedType.value)
  }

  // Filter by brand
  if (selectedBrand.value) {
    products = products.filter(p => p.brand === selectedBrand.value)
  }

  // Filter by category
  if (selectedCategory.value) {
    products = products.filter(p => p.category === selectedCategory.value)
  }

  return products
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const changeItemsPerPage = (value) => {
  itemsPerPage.value = value
  currentPage.value = 1
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  selectedBrand.value = ''
  selectedCategory.value = ''
  currentPage.value = 1
}

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedType.value || selectedBrand.value || selectedCategory.value
})

// Watch for filter changes to reset to page 1
const resetPage = () => {
  currentPage.value = 1
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Nuestros Productos
          </h1>
          <p class="text-xl text-blue-100 max-w-2xl mx-auto">
            Explora nuestro catálogo de productos profesionales para sistemas de videovigilancia CCTV
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Filters Bar (Horizontal) -->
      <div class="mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Filtros</h2>
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Limpiar filtros
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Buscar
            </label>
            <input
              v-model="searchQuery"
              @input="resetPage"
              type="text"
              placeholder="Nombre, descripción..."
              class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <!-- Type Filter -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tipo
            </label>
            <select
              v-model="selectedType"
              @change="resetPage"
              class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              <option v-for="type in availableTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <!-- Brand Filter -->
          <div v-if="availableBrands.length > 0">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Marca
            </label>
            <select
              v-model="selectedBrand"
              @change="resetPage"
              class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las marcas</option>
              <option v-for="brand in availableBrands" :key="brand" :value="brand">
                {{ brand }}
              </option>
            </select>
          </div>

          <!-- Category Filter -->
          <div v-if="categoriesStore.list.length > 0">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Categoría
            </label>
            <select
              v-model="selectedCategory"
              @change="resetPage"
              class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              <option v-for="cat in categoriesStore.list" :key="cat.id" :value="cat.name">
                {{ cat.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Results Summary -->
        <div class="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>
            Mostrando {{ paginatedProducts.length }} de {{ filteredProducts.length }} productos
          </span>

          <!-- Items per page -->
          <div class="flex items-center gap-2">
            <span>Mostrar:</span>
            <select
              v-model.number="itemsPerPage"
              @change="changeItemsPerPage(itemsPerPage)"
              class="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <span>por página</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="productsStore.loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-slate-600 dark:text-slate-400">Cargando productos...</p>
        </div>
      </div>

      <!-- Products Grid -->
      <div
        v-else-if="paginatedProducts.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
      >
        <ProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Empty State -->
      <div v-else-if="!productsStore.loading" class="text-center py-20">
        <svg class="mx-auto h-24 w-24 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
          No se encontraron productos
        </h3>
        <p class="mt-2 text-slate-600 dark:text-slate-400">
          {{ hasActiveFilters ? 'Intenta ajustar los filtros' : 'No hay productos disponibles en este momento' }}
        </p>
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          Limpiar filtros
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1 && paginatedProducts.length > 0" class="flex items-center justify-center gap-2 mt-8">
        <!-- Previous Button -->
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Page Numbers -->
        <template v-for="page in totalPages" :key="page">
          <button
            v-if="page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"
            @click="goToPage(page)"
            class="px-4 py-2 rounded-lg border transition-colors"
            :class="page === currentPage
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'"
          >
            {{ page }}
          </button>
          <span
            v-else-if="page === currentPage - 2 || page === currentPage + 2"
            class="px-2 text-slate-500"
          >
            ...
          </span>
        </template>

        <!-- Next Button -->
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
