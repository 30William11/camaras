<!-- src/components/users/UsersTable.vue -->
<script setup>
import { ref, computed } from 'vue'
import { useUsersStore } from '@/stores/users'

const usersStore = useUsersStore()

const searchQuery = ref('')
const selectedUsers = ref([])
const selectAll = ref(false)
const showActionsDropdown = ref(false)

const emit = defineEmits([
  'edit-user',
  'toggle-status',
  'delete-user',      // 👈 nuevo
  'reset-password',   // 👈 nuevo
  'bulk-activate',
  'bulk-deactivate',
  'bulk-delete',
])

// Usuarios filtrados por búsqueda
const filteredUsers = computed(() => {
  if (!searchQuery.value) return usersStore.list

  const query = searchQuery.value.toLowerCase()
  return usersStore.list.filter(
    (user) =>
      user.displayName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query),
  )
})

// Seleccionar todos
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedUsers.value = filteredUsers.value.map((u) => u.id)
  } else {
    selectedUsers.value = []
  }
}

// Iniciales para avatar
const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Rol legible
const getRoleDisplay = (role) => {
  const roles = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    trabajador: 'Trabajador',
  }
  return roles[role] || role
}

// Editar
const handleEdit = (user) => {
  emit('edit-user', user)
}

// Acciones masivas
const handleBulkActivate = () => {
  emit('bulk-activate', selectedUsers.value)
  showActionsDropdown.value = false
}

const handleBulkDeactivate = () => {
  emit('bulk-deactivate', selectedUsers.value)
  showActionsDropdown.value = false
}

const handleBulkDelete = () => {
  emit('bulk-delete', selectedUsers.value)
  showActionsDropdown.value = false
}
</script>

<template>
  <div
    class="relative overflow-x-auto bg-white dark:bg-slate-900 shadow-sm rounded-lg border border-slate-200 dark:border-slate-800"
  >
    <!-- Header con acciones y buscador -->
    <div class="flex items-center justify-between flex-wrap md:flex-row gap-4 p-4">
      <div class="relative">
        <button
          v-show="selectedUsers.length > 0"
          type="button"
          class="inline-flex items-center justify-center text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-700 font-medium rounded-lg text-sm px-3 py-2"
          @click="showActionsDropdown = !showActionsDropdown"
        >
          Acciones ({{ selectedUsers.length }})
          <svg
            class="w-4 h-4 ms-1.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
          </svg>
        </button>

        <!-- Dropdown acciones masivas -->
        <div
          v-show="showActionsDropdown && selectedUsers.length > 0"
          class="absolute left-0 top-full mt-2 z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg w-48"
        >
          <ul class="p-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
            <li>
              <button
                type="button"
                class="inline-flex items-center w-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-left"
                @click="handleBulkActivate"
              >
                Activar seleccionados
              </button>
            </li>
            <li>
              <button
                type="button"
                class="inline-flex items-center w-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-left"
                @click="handleBulkDeactivate"
              >
                Desactivar seleccionados
              </button>
            </li>
            <li>
              <button
                type="button"
                class="inline-flex items-center w-full p-2 text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-left"
                @click="handleBulkDelete"
              >
                Eliminar seleccionados
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Buscador -->
      <div class="relative w-full md:w-auto">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            class="w-4 h-4 text-slate-500 dark:text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <input
          id="search-users"
          v-model="searchQuery"
          type="text"
          class="block w-full md:w-96 pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500 dark:placeholder:text-slate-400"
          placeholder="Buscar"
        >
      </div>
    </div>

    <!-- Tabla -->
    <table class="w-full text-sm text-left text-slate-700 dark:text-slate-300">
      <thead
        class="text-sm text-slate-700 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-b border-t border-slate-200 dark:border-slate-700"
      >
        <tr>
          <th scope="col" class="p-4">
            <div class="flex items-center">
              <input
                v-model="selectAll"
                type="checkbox"
                class="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded-sm bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                @change="toggleSelectAll"
              >
              <label class="sr-only">Seleccionar todos</label>
            </div>
          </th>
          <th scope="col" class="px-6 py-3 font-medium">
            Nombre
          </th>
          <th scope="col" class="px-6 py-3 font-medium">
            Rol
          </th>
          <th scope="col" class="px-6 py-3 font-medium">
            Estado
          </th>
          <th scope="col" class="px-6 py-3 font-medium">
            Acción
          </th>
        </tr>
      </thead>

      <tbody>
        <!-- Loading -->
        <tr v-if="usersStore.loading" class="bg-white dark:bg-slate-900">
          <td colspan="5" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
            Cargando usuarios...
          </td>
        </tr>

        <!-- Sin resultados -->
        <tr v-else-if="filteredUsers.length === 0" class="bg-white dark:bg-slate-900">
          <td colspan="5" class="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
            No se encontraron usuarios
          </td>
        </tr>

        <!-- Filas -->
        <tr
          v-else
          v-for="user in filteredUsers"
          :key="user.id"
          class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <td class="w-4 p-4">
            <div class="flex items-center">
              <input
                v-model="selectedUsers"
                :value="user.id"
                type="checkbox"
                class="w-4 h-4 border border-slate-300 dark:border-slate-600 rounded-sm bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
              <label class="sr-only">Seleccionar usuario</label>
            </div>
          </td>

          <th
            scope="row"
            class="flex items-center px-6 py-4 text-slate-900 dark:text-slate-100 whitespace-nowrap"
          >
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm"
            >
              {{ getInitials(user.displayName) }}
            </div>
            <div class="ps-3">
              <div class="text-base font-semibold">
                {{ user.displayName || 'Sin nombre' }}
              </div>
              <div class="font-normal text-slate-500 dark:text-slate-400">
                {{ user.email }}
              </div>
            </div>
          </th>

          <td class="px-6 py-4">
            <span
              class="px-2.5 py-1 rounded-full text-xs font-medium"
              :class="{
                'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300': user.role === 'superadmin',
                'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300': user.role === 'admin',
                'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300': user.role === 'trabajador'
              }"
            >
              {{ getRoleDisplay(user.role) }}
            </span>
          </td>

          <td class="px-6 py-4">
            <div class="flex items-center">
              <div
                :class="user.active ? 'bg-green-500' : 'bg-red-500'"
                class="h-2.5 w-2.5 rounded-full me-2"
              />
              {{ user.active ? 'Activo' : 'Inactivo' }}
            </div>
          </td>

  <td class="px-6 py-4">
  <div class="flex items-center gap-4">

    <!-- Reset Password -->
    <button
      type="button"
      class="p-1 hover:bg-slate-700 rounded transition"
      @click="emit('reset-password', user)"
      title="Enviar correo de restablecimiento de contraseña"
    >
      <svg class="w-4 h-4 text-amber-500 hover:text-amber-400"
           fill="none" stroke="currentColor" stroke-width="2"
           viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    </button>

    <!-- Editar -->
    <button
      type="button"
      class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
      @click="handleEdit(user)"
      title="Editar usuario"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </button>

    <!-- Activar / Desactivar -->
    <button
      type="button"
      :class="user.active ? 'text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300' : 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'"
      class="transition-colors"
      @click="emit('toggle-status', user)"
      :title="user.active ? 'Desactivar usuario' : 'Activar usuario'"
    >
      <svg v-if="user.active" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>

    <!-- Eliminar -->
    <button
      type="button"
      class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
      @click="emit('delete-user', user)"
      title="Eliminar usuario"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>

  </div>
</td>

        </tr>
      </tbody>
    </table>
  </div>
</template>
