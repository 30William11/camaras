<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuotesStore } from '@/stores/quotes'
import { confirmService } from '@/utils/confirmService'
import { alertService } from '@/utils/alertService'

const router = useRouter()
const quotesStore = useQuotesStore()

// Pagination and filtering state
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(25) // Changed default to 25 like ProductsTable

onMounted(() => {
  quotesStore.fetchQuotes()
})

const createQuote = () => {
  router.push({ name: 'app.quotes.create' })
}

const editQuote = (id) => {
  router.push({ name: 'app.quotes.edit', params: { id } })
}

const deleteQuote = async (id) => {
  const confirmed = await confirmService.confirm(
    '¿Estás seguro de eliminar esta cotización?',
    {
      title: 'Confirmar eliminación',
      danger: true,
      confirmText: 'Eliminar'
    }
  )

  if (!confirmed) return

  await quotesStore.deleteQuote(id)
}

// Computed properties for filtering and pagination
const filteredQuotes = computed(() => {
  if (!searchQuery.value.trim()) {
    return quotesStore.list
  }

  const query = searchQuery.value.toLowerCase()
  return quotesStore.list.filter(quote => {
    return (
      quote.code?.toLowerCase().includes(query) ||
      quote.clientName?.toLowerCase().includes(query) ||
      quote.date?.includes(query)
    )
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredQuotes.value.length / pageSize.value)
})

const paginatedQuotes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredQuotes.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, filteredQuotes.value.length))

// Pagination controls
const handleSearch = () => {
  currentPage.value = 1
}

const handlePageSizeChange = () => {
  currentPage.value = 1
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Status management
const showStatusModal = ref(false)
const selectedQuoteForStatus = ref(null)

const statusOptions = [
  { value: 'en_proceso', label: 'En proceso', color: 'yellow', icon: '🔄' },
  { value: 'aprobado', label: 'Aprobado', color: 'green', icon: '✓' },
  { value: 'rechazado', label: 'Rechazado', color: 'red', icon: '✗' }
]

const getStatusInfo = (status) => {
  return statusOptions.find(opt => opt.value === status) || statusOptions[0]
}

const openStatusModal = (quote) => {
  selectedQuoteForStatus.value = quote
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
  selectedQuoteForStatus.value = null
}

const changeQuoteStatus = async (newStatus) => {
  if (!selectedQuoteForStatus.value) return

  const statusInfo = getStatusInfo(newStatus)
  const quoteId = selectedQuoteForStatus.value.id

  closeStatusModal()

  const confirmed = await confirmService.confirm(
    `¿Cambiar el estado de esta cotización a "${statusInfo.label}"?`,
    {
      title: 'Confirmar cambio de estado',
      confirmText: 'Cambiar'
    }
  )

  if (!confirmed) return

  const result = await quotesStore.updateQuoteStatus(quoteId, newStatus)

  if (result.success) {
    alertService.showSuccess(`Estado cambiado a "${statusInfo.label}"`)
  } else {
    alertService.showDanger('Error: ' + result.error)
  }
}

// Get row number accounting for pagination
const getRowNumber = (index) => {
  return startIndex.value + index
}
</script>

<template>
  <div class="text-slate-900 dark:text-white">
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-xl md:text-2xl font-bold">Cotizaciones</h2>
        <p class="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
          Gestión de cotizaciones
        </p>
      </div>
      <button
        @click="createQuote"
        class="px-4 py-2.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
      >
        + Nueva Cotización
      </button>
    </div>

    <!-- Search Bar and Filters -->
    <div class="mb-3 md:mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4">
      <div class="flex-1 w-full sm:max-w-md">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Buscar..."
          class="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm"
        />
      </div>

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

    <!-- Table -->
    <div class="relative overflow-x-auto shadow-sm rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <table class="w-full text-sm text-left text-slate-500 dark:text-slate-400 min-w-[900px]">
        <thead class="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
          <tr>
            <th scope="col" class="px-4 py-3">#</th>
            <th scope="col" class="px-6 py-3">Código</th>
            <th scope="col" class="px-6 py-3">Cliente</th>
            <th scope="col" class="px-6 py-3">Fecha</th>
            <th scope="col" class="px-6 py-3">Total</th>
            <th scope="col" class="px-6 py-3">Estado</th>
            <th scope="col" class="px-6 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="quotesStore.loading" class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <td colspan="7" class="px-6 py-8 text-center text-slate-400">Cargando...</td>
          </tr>
          <tr v-else-if="!filteredQuotes.length" class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <td colspan="7" class="px-6 py-8 text-center text-slate-400">
              {{ searchQuery ? 'No se encontraron resultados.' : 'No hay cotizaciones registradas.' }}
            </td>
          </tr>
          <template v-else>
            <tr
              v-for="(quote, index) in paginatedQuotes"
              :key="quote.id"
              class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">
                {{ getRowNumber(index) }}
              </td>
              <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
                {{ quote.code }}
              </td>
              <td class="px-6 py-4">
                {{ quote.clientName }}
              </td>
              <td class="px-6 py-4">
                {{ new Date(quote.date).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                S/. {{ Number(quote.total || 0).toFixed(2) }}
              </td>
              <td class="px-6 py-4">
                <button
                  @click="openStatusModal(quote)"
                  :class="[
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition hover:opacity-80',
                    getStatusInfo(quote.status).color === 'yellow'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      : getStatusInfo(quote.status).color === 'green'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  ]"
                >
                  <span class="text-base">{{ getStatusInfo(quote.status).icon }}</span>
                  {{ getStatusInfo(quote.status).label }}
                </button>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center gap-3">
                  <button
                    @click="editQuote(quote.id)"
                    class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    title="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteQuote(quote.id)"
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

    <!-- Pagination Controls (matching ProductsTable style) -->
    <div v-if="filteredQuotes.length > 0" class="mt-4 flex justify-between items-center">
      <div class="text-sm text-slate-600 dark:text-slate-400">
        Mostrando {{ startIndex }} - {{ endIndex }} de {{ filteredQuotes.length }} cotizaciones
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          Anterior
        </button>

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

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          Siguiente
        </button>
      </div>
    </div>

    <!-- Status Change Modal -->
    <div
      v-if="showStatusModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="closeStatusModal"
    >
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm">
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 class="font-bold text-lg">Cambiar Estado</h3>
        </div>
        <div class="p-6 space-y-3">
          <button
            v-for="option in statusOptions"
            :key="option.value"
            @click="changeQuoteStatus(option.value)"
            :class="[
              'w-full text-left px-4 py-3 rounded-lg border-2 transition-all hover:scale-[1.02]',
              selectedQuoteForStatus?.status === option.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            ]"
          >
            <div class="flex items-center gap-3">
              <span
                :class="[
                  'w-3 h-3 rounded-full',
                  option.color === 'yellow' ? 'bg-yellow-500' :
                  option.color === 'green' ? 'bg-green-500' : 'bg-red-500'
                ]"
              ></span>
              <span class="text-lg">{{ option.icon }}</span>
              <span class="font-medium">{{ option.label }}</span>
            </div>
          </button>
        </div>
        <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            @click="closeStatusModal"
            class="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
