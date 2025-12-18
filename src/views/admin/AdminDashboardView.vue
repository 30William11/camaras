<script setup>
import { computed, onMounted } from 'vue'
import { useContactMessagesStore } from '@/stores/contactMessages'
import { usePublicServicesStore } from '@/stores/publicServices'

const messagesStore = useContactMessagesStore()
const servicesStore = usePublicServicesStore()

onMounted(() => {
  messagesStore.loadMessages()
  servicesStore.loadServices()
})

const stats = computed(() => ({
  totalMessages: messagesStore.messages.length,
  unreadMessages: messagesStore.unreadCount,
  totalServices: servicesStore.services.length,
  activeServices: servicesStore.activeServices.length
}))

const recentMessages = computed(() => {
  return messagesStore.sortedMessages.slice(0, 5)
})
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-8">
      Panel de Administración
    </h1>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">Mensajes Totales</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white">{{ stats.totalMessages }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">No Leídos</p>
            <p class="text-3xl font-bold text-orange-600 dark:text-orange-400">{{ stats.unreadMessages }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">Servicios Totales</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white">{{ stats.totalServices }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">Servicios Activos</p>
            <p class="text-3xl font-bold text-green-600 dark:text-green-400">{{ stats.activeServices }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Accesos Rápidos</h2>
        <div class="space-y-3">
          <RouterLink
            to="/admin/content"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
          >
            <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-slate-900 dark:text-white">Editar Contenido Web</p>
              <p class="text-sm text-slate-600 dark:text-slate-400">Gestionar textos e imágenes</p>
            </div>
          </RouterLink>

          <RouterLink
            to="/admin/services"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
          >
            <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-slate-900 dark:text-white">Gestionar Servicios</p>
              <p class="text-sm text-slate-600 dark:text-slate-400">Agregar o editar servicios públicos</p>
            </div>
          </RouterLink>

          <RouterLink
            to="/admin/messages"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
          >
            <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center group-hover:bg-orange-200 dark:group-hover:bg-orange-800 transition-colors">
              <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="font-medium text-slate-900 dark:text-white">Ver Mensajes</p>
              <p class="text-sm text-slate-600 dark:text-slate-400">Revisar consultas de clientes</p>
            </div>
            <span v-if="stats.unreadMessages > 0" class="px-2 py-1 text-xs font-semibold bg-orange-600 text-white rounded-full">
              {{ stats.unreadMessages }}
            </span>
          </RouterLink>
        </div>
      </div>

      <!-- Recent Messages -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Mensajes Recientes</h2>
          <RouterLink to="/admin/messages" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Ver todos
          </RouterLink>
        </div>

        <div v-if="recentMessages.length > 0" class="space-y-3">
          <div
            v-for="message in recentMessages"
            :key="message.id"
            class="p-3 rounded-lg border border-slate-200 dark:border-slate-700"
            :class="!message.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''"
          >
            <div class="flex items-start justify-between mb-2">
              <p class="font-medium text-slate-900 dark:text-white">{{ message.name }}</p>
              <span v-if="!message.read" class="px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded">
                Nuevo
              </span>
            </div>
            <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{{ message.message }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-500 mt-2">{{ message.email }}</p>
          </div>
        </div>

        <div v-else class="text-center py-8 text-slate-500 dark:text-slate-400">
          No hay mensajes recientes
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
