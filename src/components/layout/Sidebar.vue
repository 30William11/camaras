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
      'h-screen bg-slate-100 dark:bg-slate-950 border-r border-slate-300 dark:border-slate-800 flex flex-col transition-all duration-300',
      // Mobile: fixed position, slide in from left
      'fixed inset-y-0 left-0 z-50 w-64',
      // Desktop: relative position, collapsible width
      'lg:relative',
      collapsed ? 'lg:w-20' : 'lg:w-64',
      // Visibility
      mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Header -->
    <div class="h-14 flex items-center justify-between px-4 border-b border-slate-300 dark:border-slate-800">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🎥</span>
        <span v-if="!collapsed" class="font-semibold text-sm leading-tight text-slate-900 dark:text-white">
          CCTV Cotizador
        </span>
      </div>
      <div class="flex items-center gap-1">
        <ThemeToggle v-if="!collapsed" />
        <button
          class="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          @click="toggleSidebar"
          :title="collapsed ? 'Expandir sidebar' : 'Contraer sidebar'"
        >
          <!-- Hamburger Icon (cuando está expandido) -->
          <svg
            v-if="!collapsed"
            class="w-5 h-5 text-slate-600 dark:text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>

          <!-- Hamburger Icon (cuando está colapsado) -->
          <svg
            v-else
            class="w-5 h-5 text-slate-600 dark:text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
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
            class="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
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
              class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition hover:bg-slate-200 dark:hover:bg-slate-800"
              :class="route.name === subitem.to.name ? 'bg-slate-200 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'"
              @click="router.push(subitem.to)"
            >
              {{ subitem.name }}
            </button>
          </div>
        </div>

        <!-- Item normal (sin submenú) -->
        <button
          v-else
          class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition hover:bg-slate-200 dark:hover:bg-slate-800"
          :class="isActive(item) ? 'bg-slate-200 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'"
          @click="router.push(item.to)"
        >
          <span class="text-lg">{{ item.icon }}</span>
          <span v-if="!collapsed">{{ item.name }}</span>
        </button>
      </template>
    </nav>

    <!-- Usuario + logout -->
    <div class="border-t border-slate-300 dark:border-slate-800 px-3 py-3 text-xs">
      <div v-if="!collapsed" class="mb-2">
        <p class="font-semibold truncate text-slate-900 dark:text-white">
          {{ authStore.profile?.displayName || authStore.user?.email || 'Usuario' }}
        </p>
        <p class="capitalize text-slate-600 dark:text-slate-400">
          Rol: {{ userRole }}
        </p>
      </div>

      <button
        class="w-full text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 flex items-center justify-center gap-1"
        @click="logout"
      >
        <span>⏏</span>
        <span v-if="!collapsed">Cerrar sesión</span>
      </button>
    </div>
  </aside>
</template>
