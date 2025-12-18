<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePublicServicesStore } from '@/stores/publicServices'
import ServiceCard from '@/components/public/ServiceCard.vue'

const servicesStore = usePublicServicesStore()
const selectedCategory = ref('all')

onMounted(() => {
  servicesStore.loadServices()
})

const categories = computed(() => {
  const cats = new Set(servicesStore.activeServices.map(s => s.category).filter(Boolean))
  return ['all', ...Array.from(cats)]
})

const filteredServices = computed(() => {
  if (selectedCategory.value === 'all') {
    return servicesStore.activeServices
  }
  return servicesStore.activeServices.filter(s => s.category === selectedCategory.value)
})
</script>

<template>
  <div class="min-h-screen py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          Nuestros Servicios
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Ofrecemos una amplia gama de soluciones de videovigilancia adaptadas a tus necesidades
        </p>
      </div>

      <!-- Category Filter -->
      <div class="flex flex-wrap gap-3 justify-center mb-12">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          class="px-6 py-2 rounded-full font-medium transition-all"
          :class="selectedCategory === category
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'"
        >
          {{ category === 'all' ? 'Todos' : category }}
        </button>
      </div>

      <!-- Services Grid -->
      <div v-if="filteredServices.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ServiceCard
          v-for="service in filteredServices"
          :key="service.id"
          :service="service"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-slate-300 dark:text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
          No hay servicios disponibles
        </h3>
        <p class="text-slate-600 dark:text-slate-400">
          Pronto agregaremos más servicios
        </p>
      </div>

      <!-- CTA Section -->
      <div class="mt-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
        <h2 class="text-3xl font-bold mb-4">
          ¿No encuentras lo que buscas?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Contáctanos y diseñaremos una solución personalizada para ti
        </p>
        <RouterLink
          to="/contact"
          class="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          Contactar Ahora
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
