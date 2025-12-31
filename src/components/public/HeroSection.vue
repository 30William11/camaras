<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Protege lo que más <span class="text-blue-200">importa</span>
            </h1>
            <p class="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Sistemas de videovigilancia CCTV profesionales con tecnología de última generación
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <RouterLink
                to="/contact"
                class="inline-flex items-center justify-center gap-2 px-8 py-4 text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                Solicitar Cotización
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </RouterLink>
              <RouterLink
                to="/services"
                class="inline-flex items-center justify-center gap-2 px-8 py-4 text-white border-2 border-white rounded-lg hover:bg-white/10 transition-all font-semibold"
              >
                Ver Servicios
              </RouterLink>
            </div>
          </div>

          <div class="hidden lg:block">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl transform rotate-3"></div>
              <div class="relative bg-white rounded-2xl p-8 shadow-2xl flex items-center justify-center">
                <img src="/instalador.png" alt="Instalador Profesional" class="w-full h-64 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
