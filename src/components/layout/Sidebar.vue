<script setup>
import { computed, ref, watch, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { logInfo, logDebug } from '@/utils/logger'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const collapsed = ref(false)
const productsExpanded = ref(false)

// Inject mobile menu state from AppLayout
const mobileMenuOpen = inject('mobileMenuOpen', ref(false))

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// Menú dinámico según rol
const menuItems = computed(() => {
  const role = String(authStore.profile?.role || 'trabajador').toLowerCase()
  logDebug('Sidebar: reconstruyendo menú para role =', role)

  const items = [
    { name: 'Dashboard', icon: '📊', to: { name: 'app.dashboard' } },
    { name: 'Cotizaciones', icon: '📄', to: { name: 'app.quotes.index' } },
    { name: 'Clientes', icon: '📇', to: { name: 'app.clients.index' } },
  ]

  // Productos: admin y superadmin (con submenú)
  if (role === 'admin' || role === 'superadmin') {
    items.push({
      name: 'Productos',
      icon: '📦',
      submenu: [
        { name: 'Productos', to: { name: 'app.products.index' } },
        { name: 'Categorías', to: { name: 'app.categories.index' } },
        { name: 'Unidades', to: { name: 'app.units.index' } }
      ]
    })
    logDebug('Sidebar: añadido item Productos con submenú')
  }

  // Servicios: admin y superadmin
  if (role === 'admin' || role === 'superadmin') {
    items.push({ name: 'Servicios', icon: '🛠️', to: { name: 'app.services.index' } })
    logDebug('Sidebar: añadido item Servicios')
  }

  // Usuarios: solo superadmin
  if (role === 'superadmin') {
    items.push({ name: 'Usuarios', icon: '👥', to: { name: 'app.users.index' } })
    logDebug('Sidebar: añadido item Usuarios')
  }

  logDebug(
    'Sidebar: menú final ->',
    items.map((i) => i.name).join(', ')
  )
  return items
})

// Solo para mostrar en el footer
const userRole = computed(() => authStore.profile?.role || 'Trabajador')

const isActive = (item) => route.name === item.to.name

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
}

const logout = async () => {
  logInfo('Sidebar: cerrando sesión')
  await authStore.logout()
  router.push({ name: 'app.login' })
}

// Si el perfil cambia (por ejemplo, después de init), logueamos el nuevo rol
watch(
  () => authStore.profile?.role,
  (role) => {
    if (role) logInfo('Sidebar: role actualizado ->', role)
  }
)
</script>

<template>
  <!-- Mobile Menu Overlay -->
  <div
    v-if="mobileMenuOpen"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    @click="closeMobileMenu"
  ></div>

  <!-- Sidebar -->
  <aside
    :class="[
      'h-screen bg-gradient-to-b from-blue-600 to-blue-700 dark:from-slate-900 dark:to-slate-950 border-r border-blue-500 dark:border-slate-800 flex flex-col transition-all duration-300 shadow-xl',
      // Mobile: fixed position, slide in from left
      'fixed inset-y-0 left-0 z-50 w-64',
      // Desktop: sticky position at top, collapsible width
      'lg:sticky lg:top-0',
      collapsed ? 'lg:w-20' : 'lg:w-64',
      // Visibility
      mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Header -->
    <div class="h-14 flex items-center justify-between px-4 border-b border-blue-500 dark:border-slate-800 bg-blue-700 dark:bg-slate-900">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🎥</span>
        <span v-if="!collapsed" class="font-bold text-sm leading-tight text-white">
          CCTV Cotizador
        </span>
      </div>
      <div class="flex items-center gap-1">
        <ThemeToggle v-if="!collapsed" />
        <!-- Toggle collapse button (desktop only) -->
        <button
          class="hidden lg:block p-1.5 rounded hover:bg-blue-800 dark:hover:bg-slate-800 text-white dark:text-slate-400 transition"
          @click="toggleSidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <!-- Close button (mobile only) -->
        <button
          class="lg:hidden p-1.5 rounded hover:bg-blue-800 dark:hover:bg-slate-800 text-white transition"
          @click="closeMobileMenu"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Menú -->
    <nav class="flex-1 px-2 py-4 space-y-1">
      <template v-for="item in menuItems" :key="item.name">
        <!-- Item con submenú -->
        <div v-if="item.submenu">
          <!-- Botón principal -->
          <button
            class="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition hover:bg-blue-700 dark:hover:bg-slate-800 text-blue-50 dark:text-slate-300"
            @click="productsExpanded = !productsExpanded"
          >
            <div class="flex items-center gap-2">
              <span class="text-lg">{{ item.icon }}</span>
              <span v-if="!collapsed">{{ item.name }}</span>
            </div>
            <svg
              v-if="!collapsed"
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': productsExpanded }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Submenú -->
          <div
            v-if="!collapsed && productsExpanded"
            class="ml-4 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 pl-2"
          >
            <button
              v-for="subitem in item.submenu"
              :key="subitem.name"
              class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition hover:bg-blue-700 dark:hover:bg-slate-800"
              :class="route.name === subitem.to.name ? 'bg-blue-800 dark:bg-slate-800 text-white font-semibold' : 'text-blue-100 dark:text-slate-400'"
              @click="router.push(subitem.to)"
            >
              {{ subitem.name }}
            </button>
          </div>
        </div>

        <!-- Item normal (sin submenú) -->
        <button
          v-else
          class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition hover:bg-blue-700 dark:hover:bg-slate-800"
          :class="isActive(item) ? 'bg-blue-800 dark:bg-slate-800 text-white font-semibold' : 'text-blue-50 dark:text-slate-300'"
          @click="router.push(item.to)"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span v-if="!collapsed">{{ item.name }}</span>
        </button>
      </template>
    </nav>

    <!-- Usuario + logout -->
    <div class="border-t border-blue-500 dark:border-slate-800 px-3 py-4 bg-blue-700 dark:bg-slate-900">
      <div v-if="!collapsed" class="mb-3">
        <!-- User Avatar & Info -->
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-blue-500 dark:bg-slate-700 flex items-center justify-center text-white font-bold text-lg">
            {{ (authStore.profile?.displayName || authStore.user?.email || 'U')[0].toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold truncate text-white text-sm">
              {{ authStore.profile?.displayName || authStore.user?.email || 'Usuario' }}
            </p>
            <p class="text-xs text-blue-200 dark:text-slate-400 capitalize">
              {{ userRole }}
            </p>
          </div>
        </div>
      </div>

      <button
        class="w-full text-sm bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-700 dark:text-white rounded-lg py-2.5 px-3 flex items-center justify-center gap-2 font-medium transition-all shadow-sm hover:shadow-md"
        @click="logout"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span v-if="!collapsed">Cerrar Sesión</span>
      </button>
    </div>
  </aside>
</template>
