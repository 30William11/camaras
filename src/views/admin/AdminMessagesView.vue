<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContactMessagesStore } from '@/stores/contactMessages'
import { useAlertStore } from '@/stores/alert'

const messagesStore = useContactMessagesStore()
const alertStore = useAlertStore()

const filter = ref('all') // all, unread, read
const selectedMessage = ref(null)
const showDeleteConfirm = ref(false)
const messageToDelete = ref(null)

onMounted(() => {
  messagesStore.loadMessages()
})

const filteredMessages = computed(() => {
  if (filter.value === 'unread') {
    return messagesStore.unreadMessages
  } else if (filter.value === 'read') {
    return messagesStore.messages.filter(m => m.read)
  }
  return messagesStore.sortedMessages
})

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const selectMessage = async (message) => {
  selectedMessage.value = message
  if (!message.read) {
    try {
      await messagesStore.markAsRead(message.id)
    } catch {
      alertStore.error('Error al marcar como leído')
    }
  }
}

const closeMessageDetail = () => {
  selectedMessage.value = null
}

const confirmDelete = (message) => {
  messageToDelete.value = message
  showDeleteConfirm.value = true
}

const cancelDelete = () => {
  messageToDelete.value = null
  showDeleteConfirm.value = false
}

const handleDelete = async () => {
  if (!messageToDelete.value) return

  try {
    await messagesStore.deleteMessage(messageToDelete.value.id)
    alertStore.success('Mensaje eliminado')
    if (selectedMessage.value?.id === messageToDelete.value.id) {
      selectedMessage.value = null
    }
  } catch {
    alertStore.error('Error al eliminar el mensaje')
  } finally {
    cancelDelete()
  }
}

const toggleRead = async (message) => {
  try {
    await messagesStore.markAsRead(message.id, !message.read)
  } catch {
    alertStore.error('Error al actualizar el mensaje')
  }
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-8">
      Mensajes de Contacto
    </h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Messages List -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden">
          <!-- Filter Tabs -->
          <div class="flex border-b border-slate-200 dark:border-slate-700">
            <button
              @click="filter = 'all'"
              class="flex-1 px-4 py-3 text-sm font-medium transition-colors"
              :class="filter === 'all'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'"
            >
              Todos ({{ messagesStore.messages.length }})
            </button>
            <button
              @click="filter = 'unread'"
              class="flex-1 px-4 py-3 text-sm font-medium transition-colors relative"
              :class="filter === 'unread'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'"
            >
              No leídos
              <span v-if="messagesStore.unreadCount > 0" class="ml-1 px-1.5 py-0.5 text-xs bg-orange-600 text-white rounded-full">
                {{ messagesStore.unreadCount }}
              </span>
            </button>
          </div>

          <!-- Messages -->
          <div class="divide-y divide-slate-200 dark:divide-slate-700 max-h-[600px] overflow-y-auto">
            <div
              v-for="message in filteredMessages"
              :key="message.id"
              @click="selectMessage(message)"
              class="p-4 cursor-pointer transition-colors"
              :class="[
                selectedMessage?.id === message.id
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-700',
                !message.read ? 'border-l-4 border-l-blue-600' : ''
              ]"
            >
              <div class="flex items-start justify-between mb-1">
                <p class="font-semibold text-slate-900 dark:text-white">{{ message.name }}</p>
                <span v-if="!message.read" class="w-2 h-2 bg-blue-600 rounded-full"></span>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-400 truncate mb-1">{{ message.email }}</p>
              <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">{{ message.message }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-500">{{ formatDate(message.created_at) }}</p>
            </div>

            <div v-if="filteredMessages.length === 0" class="p-8 text-center text-slate-500 dark:text-slate-400">
              No hay mensajes
            </div>
          </div>
        </div>
      </div>

      <!-- Message Detail -->
      <div class="lg:col-span-2">
        <div v-if="selectedMessage" class="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
          <div class="flex items-start justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {{ selectedMessage.name }}
              </h2>
              <div class="flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-400">
                <a :href="`mailto:${selectedMessage.email}`" class="hover:text-blue-600 dark:hover:text-blue-400">
                  {{ selectedMessage.email }}
                </a>
                <span v-if="selectedMessage.phone">• {{ selectedMessage.phone }}</span>
              </div>
            </div>
            <button
              @click="closeMessageDetail"
              class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors lg:hidden"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mb-6">
            <p class="text-xs text-slate-500 dark:text-slate-500 mb-4">
              Recibido el {{ formatDate(selectedMessage.created_at) }}
            </p>
            <div class="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
              <p class="text-slate-900 dark:text-white whitespace-pre-wrap">{{ selectedMessage.message }}</p>
            </div>
          </div>

          <div class="flex gap-3">
            <a
              :href="`mailto:${selectedMessage.email}?subject=Re: Consulta desde CCTV Pro`"
              class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              Responder por Email
            </a>
            <button
              @click="toggleRead(selectedMessage)"
              class="px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              {{ selectedMessage.read ? 'Marcar como no leído' : 'Marcar como leído' }}
            </button>
            <button
              @click="confirmDelete(selectedMessage)"
              class="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Eliminar
            </button>
          </div>
        </div>

        <div v-else class="bg-white dark:bg-slate-800 rounded-xl shadow-md p-12 text-center">
          <svg class="w-24 h-24 mx-auto text-slate-300 dark:text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Selecciona un mensaje
          </h3>
          <p class="text-slate-600 dark:text-slate-400">
            Elige un mensaje de la lista para ver los detalles
          </p>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="cancelDelete"
    >
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">
          ¿Eliminar mensaje?
        </h3>
        <p class="text-slate-600 dark:text-slate-400 mb-6">
          ¿Estás seguro de que deseas eliminar este mensaje? Esta acción no se puede deshacer.
        </p>
        <div class="flex gap-3">
          <button
            @click="handleDelete"
            class="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Eliminar
          </button>
          <button
            @click="cancelDelete"
            class="flex-1 px-4 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-medium"
          >
            Cancelar
          </button>
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
