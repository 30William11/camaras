<!-- src/components/layout/AppLayout.vue -->
<script setup>
import Sidebar from './Sidebar.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { RouterView } from 'vue-router'
import { provide, ref } from 'vue'

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Provide to Sidebar
provide('mobileMenuOpen', mobileMenuOpen)
provide('toggleMobileMenu', toggleMobileMenu)
</script>

<template>
  <div class="min-h-screen flex bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Topbar - sticky en móvil -->
      <header class="sticky top-0 z-30 h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 sm:px-4 md:px-6 bg-white dark:bg-slate-900 shadow-sm">
        <!-- Hamburger Menu (solo visible en móvil/tablet) -->
        <button
          @click="toggleMobileMenu"
          class="lg:hidden p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors text-blue-600 dark:text-slate-300"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 class="text-sm sm:text-base md:text-lg font-semibold truncate text-slate-800 dark:text-white">
          Sistema de Cotizaciones CCTV
        </h1>

        <div class="flex items-center gap-2 sm:gap-4">
          <span class="hidden sm:inline text-xs text-slate-600 dark:text-slate-400">
            Panel de gestión
          </span>
          <ThemeToggle />
        </div>
      </header>

      <!-- Contenido de vistas -->
      <main class="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-slate-50 dark:bg-slate-900">
        <RouterView />
      </main>
    </div>
  </div>
</template>
