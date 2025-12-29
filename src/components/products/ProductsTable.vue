<!-- src/components/products/ProductsTable.vue -->
<script setup>
import { computed, ref } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  onEdit: { type: Function, required: true },
  onDelete: { type: Function, required: true },
})

const productsStore = useProductsStore()
const authStore = useAuthStore()

// Global Exchange Rate
const globalExchangeRate = ref(3.750) // Default T.C.

// Load T.C. from localStorage on mount
const loadExchangeRate = () => {
  const saved = localStorage.getItem('globalExchangeRate')
  if (saved) {
    globalExchangeRate.value = parseFloat(saved)
  }
}

// Save T.C. to localStorage when it changes
const saveExchangeRate = () => {
  // Ensure we have a valid number with 3 decimals
  const value = Number(globalExchangeRate.value)
  if (!isNaN(value) && value >= 0) {
    // Round to 3 decimals
    globalExchangeRate.value = Math.round(value * 1000) / 1000
    localStorage.setItem('globalExchangeRate', globalExchangeRate.value.toString())
    console.log('💱 T.C. actualizado:', globalExchangeRate.value.toFixed(3))
  }
}

// Load on component mount
loadExchangeRate()

// Pagination and filtering state
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10) // Default page size

// Sorting state
const sortColumn = ref('name') // Default sort by name
const sortDirection = ref('asc') // 'asc' or 'desc'

// Toggle sort
const toggleSort = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const products = computed(() => productsStore.list)
const isAdmin = computed(() => {
  const role = authStore.profile?.role
  return role === 'admin' || role === 'superadmin'
})

// Products with calculated prices based on global T.C.
const productsWithCalculations = computed(() => {
  return products.value.map(product => {
    const priceUsd = Number(product.priceUsd) || 0
    const salePrice = Number(product.price) || 0

    // Calculate purchase price in soles (USD * T.C.)
    const purchasePrice = priceUsd * globalExchangeRate.value

    // Calculate profit percentage
    const profitPercentage = purchasePrice > 0
      ? (((salePrice - purchasePrice) / purchasePrice) * 100).toFixed(1)
      : 0

    // Calculate profit amount
    const profit = salePrice - purchasePrice

    return {
      ...product,
      exchangeRate: globalExchangeRate.value,
      purchasePrice,
      profitPercentage,
      profit,
      salePrice
    }
  })
})

// Filtered and sorted products
const filteredProducts = computed(() => {
  let result = productsWithCalculations.value

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(product => {
      return (
        product.name?.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      )
    })
  }

  // Apply sorting
  result = [...result].sort((a, b) => {
    let aVal = a[sortColumn.value]
    let bVal = b[sortColumn.value]

    // Handle null/undefined values
    if (aVal == null) aVal = ''
    if (bVal == null) bVal = ''

    // Convert to lowercase for string comparison
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()

    // Compare
    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })

  return result
})

// Paginated products
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

// Pagination calculations
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / pageSize.value))
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, filteredProducts.value.length))

// Watch for search changes and reset to page 1
const handleSearch = () => {
  currentPage.value = 1
}

// Watch for page size changes and reset to page 1
const handlePageSizeChange = () => {
  currentPage.value = 1
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handleQtyChange = (product, delta) => {
  const newQty = (product.qty || 0) + delta
  productsStore.updateQty(product.id, newQty)
}

const handleQtyManual = (product, e) => {
  const value = Number(e.target.value)
  productsStore.updateQty(product.id, value)
}

const toggleActive = (product) => {
  productsStore.toggleActive(product.id)
}
</script>

<template>
  <div class="space-y-3 md:space-y-4">
    <!-- Search and Filters -->
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
      <!-- Search Bar -->
      <div class="flex-1 w-full sm:max-w-md">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Buscar..."
          class="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
        />
      </div>

      <!-- Exchange Rate Input (Admin Only) -->
      <div v-if="isAdmin" class="flex items-center gap-2 flex-shrink-0">
        <label class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap font-medium">T.C.:</label>
        <input
          v-model.number="globalExchangeRate"
          @input="saveExchangeRate"
          type="number"
          step="0.001"
          min="0"
          placeholder="3.750"
          class="w-24 px-2 py-2 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm font-semibold text-blue-600 dark:text-blue-400"
        />
      </div>

      <!-- Page Size Selector -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <label class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">Mostrar:</label>
        <select
          v-model.number="pageSize"
          @change="handlePageSizeChange"
          class="px-2 py-2 sm:px-3 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
        >
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </div>

    <!-- Table - Con scroll horizontal en móvil -->
    <div class="relative overflow-x-auto shadow-sm rounded-xl border-2 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
      <table class="w-full text-sm text-left rtl:text-right text-slate-500 dark:text-slate-400 min-w-[800px] border-collapse">
        <thead class="text-xs text-slate-700 uppercase bg-cyan-500 dark:bg-slate-700 text-white dark:text-slate-400">
          <tr>
            <th scope="col" class="px-4 py-3 border-r border-cyan-400 dark:border-slate-600">#</th>
            <th scope="col" class="px-4 py-3 border-r border-cyan-400 dark:border-slate-600">Img</th>
            <th scope="col" class="px-4 py-3 cursor-pointer hover:bg-cyan-600 dark:hover:bg-slate-600 transition-colors border-r border-cyan-400 dark:border-slate-600" @click="toggleSort('name')">
              <div class="flex items-center justify-between">
                <span>Producto</span>
                <span class="ml-1">
                  <svg v-if="sortColumn === 'name'" class="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="sortDirection === 'asc'" d="M5 10l5-5 5 5H5z"/>
                    <path v-else d="M5 10l5 5 5-5H5z"/>
                  </svg>
                  <svg v-else class="w-4 h-4 inline opacity-30" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 8l5-5 5 5H5zM5 12l5 5 5-5H5z"/>
                  </svg>
                </span>
              </div>
            </th>
            <th scope="col" class="px-4 py-3 border-r border-cyan-400 dark:border-slate-600">Descripción</th>
            <th scope="col" class="px-4 py-3 cursor-pointer hover:bg-cyan-600 dark:hover:bg-slate-600 transition-colors border-r border-cyan-400 dark:border-slate-600" @click="toggleSort('category')">
              <div class="flex items-center justify-between">
                <span>Categoría</span>
                <span class="ml-1">
                  <svg v-if="sortColumn === 'category'" class="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="sortDirection === 'asc'" d="M5 10l5-5 5 5H5z"/>
                    <path v-else d="M5 10l5 5 5-5H5z"/>
                  </svg>
                  <svg v-else class="w-4 h-4 inline opacity-30" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 8l5-5 5 5H5zM5 12l5 5 5-5H5z"/>
                  </svg>
                </span>
              </div>
            </th>

            <!-- Admin Columns -->
            <template v-if="isAdmin">
              <th scope="col" class="px-4 py-3 text-right cursor-pointer hover:bg-cyan-600 dark:hover:bg-slate-600 transition-colors border-r border-cyan-400 dark:border-slate-600" @click="toggleSort('priceUsd')">
                <div class="flex items-center justify-end">
                  <span>USD</span>
                  <span class="ml-1">
                    <svg v-if="sortColumn === 'priceUsd'" class="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path v-if="sortDirection === 'asc'" d="M5 10l5-5 5 5H5z"/>
                      <path v-else d="M5 10l5 5 5-5H5z"/>
                    </svg>
                    <svg v-else class="w-4 h-4 inline opacity-30" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 8l5-5 5 5H5zM5 12l5 5 5-5H5z"/>
                    </svg>
                  </span>
                </div>
              </th>
              <th scope="col" class="px-4 py-3 text-right border-r border-cyan-400 dark:border-slate-600">T.C.</th>
              <th scope="col" class="px-4 py-3 text-right border-r border-cyan-400 dark:border-slate-600">Compra (S/)</th>
              <th scope="col" class="px-4 py-3 text-right border-r border-cyan-400 dark:border-slate-600">% Gan.</th>
            </template>

            <th scope="col" class="px-4 py-3 text-right cursor-pointer hover:bg-cyan-600 dark:hover:bg-slate-600 transition-colors border-r border-cyan-400 dark:border-slate-600" @click="toggleSort('salePrice')">
              <div class="flex items-center justify-end">
                <span>Venta (S/)</span>
                <span class="ml-1">
                  <svg v-if="sortColumn === 'salePrice'" class="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="sortDirection === 'asc'" d="M5 10l5-5 5 5H5z"/>
                    <path v-else d="M5 10l5 5 5-5H5z"/>
                  </svg>
                  <svg v-else class="w-4 h-4 inline opacity-30" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 8l5-5 5 5H5zM5 12l5 5 5-5H5z"/>
                  </svg>
                </span>
              </div>
            </th>

            <template v-if="isAdmin">
              <th scope="col" class="px-4 py-3 text-right border-r border-cyan-400 dark:border-slate-600">Ganancia</th>
            </template>

            <th scope="col" class="px-4 py-3 text-center cursor-pointer hover:bg-cyan-600 dark:hover:bg-slate-600 transition-colors border-r border-cyan-400 dark:border-slate-600" @click="toggleSort('qty')">
              <div class="flex items-center justify-center">
                <span>Stock</span>
                <span class="ml-1">
                  <svg v-if="sortColumn === 'qty'" class="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                    <path v-if="sortDirection === 'asc'" d="M5 10l5-5 5 5H5z"/>
                    <path v-else d="M5 10l5 5 5-5H5z"/>
                  </svg>
                  <svg v-else class="w-4 h-4 inline opacity-30" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 8l5-5 5 5H5zM5 12l5 5 5-5H5z"/>
                  </svg>
                </span>
              </div>
            </th>
            <th scope="col" class="px-4 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading State -->
          <tr v-if="productsStore.loading" class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <td :colspan="isAdmin ? 12 : 6" class="px-6 py-8 text-center text-slate-400">
              Cargando productos...
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="!filteredProducts.length" class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <td :colspan="isAdmin ? 12 : 6" class="px-6 py-8 text-center text-slate-400">
              {{ searchQuery ? 'No se encontraron productos con ese criterio de búsqueda.' : 'No hay productos registrados todavía.' }}
            </td>
          </tr>

          <!-- Products List -->
          <template v-else>
            <tr
              v-for="(product, index) in paginatedProducts"
              :key="product.id"
              class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <!-- Row Number -->
              <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">
                {{ startIndex + index }}
              </td>

              <td class="p-4">
                <img
                  v-if="product.imageUrl"
                  :src="product.imageUrl"
                  class="w-12 h-12 rounded object-cover"
                  :alt="product.name"
                >
                <div v-else class="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded flex items-center justify-center text-xs text-slate-400">
                  No img
                </div>
              </td>
              <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">
                {{ product.name }}
                <div v-if="product.sku" class="text-xs font-normal text-slate-500 dark:text-slate-400">
                  SKU: {{ product.sku }}
                </div>
              </td>
              <td class="px-4 py-3 text-slate-500 truncate max-w-xs" :title="product.description">
                {{ product.description || '-' }}
              </td>
              <td class="px-4 py-3 text-slate-500">
                {{ product.category }}
              </td>

              <!-- Admin Data -->
              <template v-if="isAdmin">
                <td class="px-4 py-3 text-right text-slate-500">
                  {{ product.priceUsd ? `$${Number(product.priceUsd).toFixed(2)}` : '-' }}
                </td>
                <td class="px-4 py-3 text-right text-slate-500">
                  {{ product.exchangeRate ? product.exchangeRate.toFixed(3) : '-' }}
                </td>
                <td class="px-4 py-3 text-right text-slate-500">
                  {{ product.purchasePrice ? `S/ ${Number(product.purchasePrice).toFixed(2)}` : '-' }}
                </td>
                <td class="px-4 py-3 text-right text-slate-500">
                  {{ product.profitPercentage ? `${product.profitPercentage}%` : '-' }}
                </td>
              </template>

              <!-- Sale Price (Visible to all) -->
              <td class="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                S/ {{ Number(product.salePrice || product.price).toFixed(2) }}
              </td>

              <!-- Admin Profit -->
              <template v-if="isAdmin">
                <td class="px-4 py-3 text-right text-slate-500">
                  {{ product.profit ? `S/ ${Number(product.profit).toFixed(2)}` : '-' }}
                </td>
              </template>

              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button @click="handleQtyChange(product, -1)" class="text-slate-400 hover:text-slate-600">-</button>
                  <span class="w-8 text-center text-sm">{{ product.qty }}</span>
                  <button @click="handleQtyChange(product, 1)" class="text-slate-400 hover:text-slate-600">+</button>
                </div>
              </td>

              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-3">
                  <button
                    @click="props.onEdit(product)"
                    class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    title="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="props.onDelete(product)"
                    class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    title="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 2 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div v-if="filteredProducts.length > 0" class="flex justify-between items-center">
      <!-- Info Text -->
      <div class="text-sm text-slate-600 dark:text-slate-400">
        Mostrando {{ startIndex }} - {{ endIndex }} de {{ filteredProducts.length }} productos
      </div>

      <!-- Page Numbers -->
      <div class="flex items-center gap-2">
        <!-- Previous Button -->
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          Anterior
        </button>

        <!-- Page Numbers -->
        <template v-for="page in totalPages" :key="page">
          <button
            v-if="page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"
            @click="goToPage(page)"
            class="px-3 py-1 rounded-lg border text-sm"
            :class="page === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'"
          >
            {{ page }}
          </button>
          <span v-else-if="page === currentPage - 2 || page === currentPage + 2" class="px-2">...</span>
        </template>

        <!-- Next Button -->
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>
