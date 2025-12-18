<script setup>
import HeroSection from '@/components/public/HeroSection.vue'
import ServiceCard from '@/components/public/ServiceCard.vue'
import { ref, onMounted } from 'vue'
import { usePublicServicesStore } from '@/stores/publicServices'

const servicesStore = usePublicServicesStore()

onMounted(() => {
  servicesStore.loadServices()
})

const features = [
  {
    icon: 'shield',
    title: 'Seguridad 24/7',
    description: 'Monitoreo constante de tus instalaciones con tecnología de punta'
  },
  {
    icon: 'quality',
    title: 'Alta Calidad',
    description: 'Equipos de última generación con resolución 4K y visión nocturna'
  },
  {
    icon: 'support',
    title: 'Soporte Técnico',
    description: 'Asistencia profesional y mantenimiento preventivo incluido'
  },
  {
    icon: 'custom',
    title: 'Soluciones Personalizadas',
    description: 'Diseñamos sistemas adaptados a tus necesidades específicas'
  }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HeroSection />

    <!-- Features Section -->
    <section class="py-20 bg-white dark:bg-slate-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Ofrecemos soluciones integrales de videovigilancia con la mejor tecnología del mercado
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="text-center p-6 rounded-xl bg-slate-50 dark:bg-slate-800 hover:shadow-lg transition-shadow"
          >
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="feature.icon === 'shield'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                <path v-else-if="feature.icon === 'quality'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                <path v-else-if="feature.icon === 'support'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-slate-600 dark:text-slate-400">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Preview -->
    <section class="py-20 bg-slate-50 dark:bg-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Nuestros Servicios
          </h2>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Soluciones completas de videovigilancia para todo tipo de instalaciones
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <ServiceCard
            v-for="service in servicesStore.activeServices.slice(0, 3)"
            :key="service.id"
            :service="service"
          />
        </div>

        <div class="text-center">
          <RouterLink
            to="/services"
            class="inline-flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            Ver Todos los Servicios
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
          ¿Listo para proteger tu negocio?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Contáctanos hoy y recibe una cotización personalizada sin compromiso
        </p>
        <RouterLink
          to="/contact"
          class="inline-flex items-center gap-2 px-8 py-4 text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl font-semibold"
        >
          Solicitar Cotización
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
