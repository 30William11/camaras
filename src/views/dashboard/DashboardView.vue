<script setup>
import { onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useQuotesStore } from '@/stores/quotes'
import { logInfo } from '@/utils/logger'

const productsStore = useProductsStore()
const quotesStore = useQuotesStore()

onMounted(async () => {
  logInfo('Cargando datos del dashboard...')
  await productsStore.fetchProducts()
  await quotesStore.fetchQuotes()
})

// Datos para gráfica de torta (distribución de productos por categoría)
const categoryData = computed(() => {
  const categories = {}
  productsStore.list.forEach(product => {
    const cat = product.category || 'Sin categoría'
    categories[cat] = (categories[cat] || 0) + 1
  })

  const total = Object.values(categories).reduce((a, b) => a + b, 0)
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return Object.entries(categories).map(([name, value], index) => ({
    name,
    value,
    percentage: total > 0 ? ((value / total) * 100).toFixed(1) : 0,
    color: colors[index % colors.length]
  }))
})

// Datos para gráfica de barras (cotizaciones por mes)
const monthlyQuotesData = computed(() => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const currentYear = new Date().getFullYear()
  const quotesPerMonth = new Array(12).fill(0)

  quotesStore.list.forEach(quote => {
    const date = new Date(quote.date)
    if (date.getFullYear() === currentYear) {
      quotesPerMonth[date.getMonth()]++
    }
  })

  const maxValue = Math.max(...quotesPerMonth, 1)

  return months.map((month, index) => ({
    month,
    value: quotesPerMonth[index],
    height: (quotesPerMonth[index] / maxValue) * 100
  }))
})

// Datos para gráfica de líneas (ingresos por mes)
const monthlyRevenueData = computed(() => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const currentYear = new Date().getFullYear()
  const revenuePerMonth = new Array(12).fill(0)

  quotesStore.list.forEach(quote => {
    const date = new Date(quote.date)
    if (date.getFullYear() === currentYear) {
      revenuePerMonth[date.getMonth()] += Number(quote.total || 0)
    }
  })

  const maxValue = Math.max(...revenuePerMonth, 1)

  return months.map((month, index) => ({
    month,
    value: revenuePerMonth[index],
    y: 100 - ((revenuePerMonth[index] / maxValue) * 100)
  }))
})

// Generar path para la línea SVG
const linePath = computed(() => {
  const data = monthlyRevenueData.value
  if (data.length === 0) return ''

  const width = 100
  const step = width / (data.length - 1)

  return data.map((point, index) => {
    const x = index * step
    const y = point.y
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')
})
</script>

<template>
  <div class="text-slate-900 dark:text-white">
    <!-- Título -->
    <h1 class="text-3xl font-bold mb-8">
      📊 Dashboard – Sistema CCTV
    </h1>

    <!-- Tarjetas de estadísticas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Productos activos -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <p class="text-sm text-slate-600 dark:text-slate-400">Productos activos</p>
        <p class="text-3xl font-bold mt-2 text-blue-600 dark:text-blue-400">
          {{ productsStore.activeCount }}
        </p>
      </div>

      <!-- Total cotizaciones -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <p class="text-sm text-slate-600 dark:text-slate-400">Total cotizaciones</p>
        <p class="text-3xl font-bold mt-2 text-emerald-600 dark:text-emerald-400">
          {{ quotesStore.totalQuotes }}
        </p>
      </div>

      <!-- Monto total -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <p class="text-sm text-slate-600 dark:text-slate-400">Monto total cotizado</p>
        <p class="text-3xl font-bold mt-2 text-amber-600 dark:text-amber-400">
          S/. {{ quotesStore.totalRevenue.toLocaleString() }}
        </p>
      </div>

      <!-- Último cliente -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <p class="text-sm text-slate-600 dark:text-slate-400">Último cliente</p>
        <p class="text-xl font-semibold mt-2 truncate">
          {{ quotesStore.list[0]?.clientName || "—" }}
        </p>
      </div>
    </div>

    <!-- Gráficas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Gráfica de Torta - Distribución de Productos -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 class="text-lg font-bold mb-4">Productos por Categoría</h2>
        <div class="flex flex-col items-center">
          <!-- Torta -->
          <div class="relative w-48 h-48 mb-4">
            <svg viewBox="0 0 100 100" class="transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e2e8f0"
                stroke-width="20"
                class="dark:stroke-slate-700"
              />
              <circle
                v-for="(item, index) in categoryData"
                :key="item.name"
                cx="50"
                cy="50"
                r="40"
                fill="none"
                :stroke="item.color"
                stroke-width="20"
                :stroke-dasharray="`${item.percentage * 2.51} 251`"
                :stroke-dashoffset="`${-categoryData.slice(0, index).reduce((sum, i) => sum + (i.percentage * 2.51), 0)}`"
                class="transition-all duration-500"
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <p class="text-2xl font-bold">{{ productsStore.activeCount }}</p>
                <p class="text-xs text-slate-600 dark:text-slate-400">Total</p>
              </div>
            </div>
          </div>
          <!-- Leyenda -->
          <div class="w-full space-y-2">
            <div v-for="item in categoryData" :key="item.name" class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }"></div>
                <span class="text-slate-700 dark:text-slate-300">{{ item.name }}</span>
              </div>
              <span class="font-semibold">{{ item.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfica de Barras - Cotizaciones por Mes -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 class="text-lg font-bold mb-4">Cotizaciones Mensuales</h2>
        <div class="h-64 flex items-end justify-between gap-2">
          <div
            v-for="data in monthlyQuotesData"
            :key="data.month"
            class="flex-1 flex flex-col items-center gap-2"
          >
            <div class="relative w-full bg-slate-200 dark:bg-slate-700 rounded-t-lg overflow-hidden" style="min-height: 200px">
              <div
                class="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-300 transition-all duration-700 rounded-t-lg"
                :style="{ height: `${data.height}%` }"
              >
                <div v-if="data.value > 0" class="absolute top-2 w-full text-center text-xs font-bold text-white">
                  {{ data.value }}
                </div>
              </div>
            </div>
            <span class="text-xs text-slate-600 dark:text-slate-400">{{ data.month }}</span>
          </div>
        </div>
      </div>

      <!-- Gráfica de Líneas - Ingresos por Mes -->
      <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 class="text-lg font-bold mb-4">Tendencia de Ingresos</h2>
        <div class="h-64 relative">
          <svg viewBox="0 0 100 100" class="w-full h-full" preserveAspectRatio="none">
            <!-- Grid lines -->
            <line x1="0" y1="25" x2="100" y2="25" stroke="#e2e8f0" stroke-width="0.5" class="dark:stroke-slate-700" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" stroke-width="0.5" class="dark:stroke-slate-700" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="#e2e8f0" stroke-width="0.5" class="dark:stroke-slate-700" />

            <!-- Area under line -->
            <path
              :d="`${linePath} L 100 100 L 0 100 Z`"
              fill="url(#gradient)"
              opacity="0.3"
              class="transition-all duration-700"
            />

            <!-- Line -->
            <path
              :d="linePath"
              fill="none"
              stroke="#10b981"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="transition-all duration-700"
            />

            <!-- Points -->
            <circle
              v-for="(data, index) in monthlyRevenueData"
              :key="data.month"
              :cx="(index / (monthlyRevenueData.length - 1)) * 100"
              :cy="data.y"
              r="2"
              fill="#10b981"
              class="transition-all duration-700"
            />

            <!-- Gradient definition -->
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#10b981;stop-opacity:0" />
              </linearGradient>
            </defs>
          </svg>

          <!-- X-axis labels -->
          <div class="flex justify-between mt-2">
            <span v-for="data in monthlyRevenueData.filter((_, i) => i % 3 === 0)" :key="data.month" class="text-xs text-slate-600 dark:text-slate-400">
              {{ data.month }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de últimas cotizaciones -->
    <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <h2 class="text-xl font-bold mb-4">Últimas Cotizaciones</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700">
              <th class="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Cliente</th>
              <th class="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Código</th>
              <th class="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Fecha</th>
              <th class="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="q in quotesStore.lastQuotes"
              :key="q.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td class="py-3 px-4">{{ q.clientName }}</td>
              <td class="py-3 px-4 font-mono text-xs">{{ q.code }}</td>
              <td class="py-3 px-4 text-slate-600 dark:text-slate-400">
                {{ new Date(q.date).toLocaleDateString() }}
              </td>
              <td class="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                S/. {{ Number(q.total || 0).toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
