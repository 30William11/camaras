<script setup>
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

const authStore = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)

const adminMenuItems = [
  { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
  { name: 'Contenido Web', path: '/admin/content', icon: 'content' },
  { name: 'Servicios Públicos', path: '/admin/services', icon: 'services' },
  { name: 'Mensajes', path: '/admin/messages', icon: 'messages' },
]

const logout = async () => {
  await authStore.logout()
  router.push('/app/login')
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>

<template>
  <div class="min-h-screen flex bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
    <!-- Sidebar -->
    <aside
      class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800 dark:bg-slate-950 transform transition-transform duration-300 ease-in-out"
      :class="mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="h-full flex flex-col">
        <!-- Logo/Header -->
        <div class="h-14 flex items-center justify-between px-4 border-b border-slate-700">
          <h2 class="text-lg font-bold text-white">Panel Admin</h2>
          <button
            @click="toggleMobileMenu"
            class="lg:hidden p-2 rounded-lg hover:bg-slate-700 text-white"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <RouterLink
            v-for="item in adminMenuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            active-class="bg-blue-600 text-white hover:bg-blue-700"
            @click="mobileMenuOpen = false"
          >
            <span class="text-sm font-medium">{{ item.name }}</span>
          </RouterLink>
        </nav>

        <!-- User Info & Actions -->
        <div class="p-4 border-t border-slate-700">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              {{ authStore.profile?.name?.charAt(0) || 'A' }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ authStore.profile?.name }}</p>
              <p class="text-xs text-slate-400 truncate">{{ authStore.profile?.role }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <RouterLink
              to="/app"
              class="flex-1 px-3 py-2 text-xs font-medium text-center rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
            >
              Sistema
            </RouterLink>
            <button
              @click="logout"
              class="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="mobileMenuOpen"
      @click="toggleMobileMenu"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Topbar -->
      <header class="sticky top-0 z-30 h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-slate-900">
        <!-- Hamburger Menu -->
        <button
          @click="toggleMobileMenu"
          class="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 class="text-lg font-semibold">Panel de Administración</h1>

        <div class="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 dark:bg-slate-900">
        <RouterView />
      </main>
    </div>
  </div>
</template>
