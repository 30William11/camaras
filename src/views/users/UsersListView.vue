<!-- src/views/users/UsersListView.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useAuthStore } from '@/stores/auth'
import { alertService } from '@/utils/alertService'
import { confirmService } from '@/utils/confirmService'
import UsersTable from '@/components/users/UsersTable.vue'
import UserModal from '@/components/users/UserModal.vue'
import PasswordResetModal from '@/components/users/PasswordResetModal.vue'
import { logInfo, logError } from '@/utils/logger'

const usersStore = useUsersStore()
const authStore = useAuthStore()

const showModal = ref(false)
const editingUser = ref(null)
const showPasswordResetModal = ref(false)
const resettingUser = ref(null)

// Fetch users on mount
onMounted(async () => {
  console.log('UsersListView mounted')
  try {
    await usersStore.fetchUsers()
    console.log('Users fetched:', usersStore.list.length)
  } catch (error) {
    console.error('Error fetching users:', error)
  }
})

// Open modal for creating new user
const openCreateModal = () => {
  editingUser.value = null
  showModal.value = true
}

// Open modal for editing user
const openEditModal = (user) => {
  editingUser.value = user
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  editingUser.value = null
}

// Handle save user (create or update)
const handleSaveUser = async (userData) => {
  try {
    if (userData.id) {
      // Update existing user
      const result = await usersStore.updateUser(userData.id, {
        displayName: userData.displayName,
        role: userData.role
      })

      if (result.success) {
        logInfo('Usuario actualizado exitosamente')
        closeModal()
      } else {
        logError('Error al actualizar usuario:', result.error)
        alertService.showDanger('Error al actualizar usuario: ' + result.error)
      }
    } else {
      // Create new user
      const result = await usersStore.createUser(userData)

      if (result.success) {
        logInfo('Usuario creado exitosamente')
        closeModal()
      } else {
        logError('Error al crear usuario:', result.error)
        alertService.showDanger('Error al crear usuario: ' + result.error)
      }
    }
  } catch (error) {
    logError('Error inesperado:', error)
    alertService.showDanger('Error inesperado al guardar usuario')
  }
}

// Handle toggle user status
const handleToggleStatus = async (user) => {
  const newStatus = !user.active
  const action = newStatus ? 'activar' : 'desactivar'

  const confirmed = await confirmService.confirm(
    `¿Está seguro de ${action} a ${user.displayName}?`,
    { title: 'Confirmar acción' }
  )

  if (!confirmed) return

  const result = await usersStore.toggleUserStatus(user.id, newStatus)

  if (result.success) {
    logInfo(`Usuario ${action}do exitosamente`)
  } else {
    logError(`Error al ${action} usuario:`, result.error)
    alertService.showDanger(`Error al ${action} usuario: ` + result.error)
  }
}

// Handle bulk activate
const handleBulkActivate = async (userIds) => {
  const confirmed = await confirmService.confirm(
    `¿Está seguro de activar ${userIds.length} usuario(s)?`,
    { title: 'Confirmar activación masiva' }
  )

  if (!confirmed) return

  let successCount = 0
  for (const userId of userIds) {
    const result = await usersStore.toggleUserStatus(userId, true)
    if (result.success) successCount++
  }
  logInfo(`${successCount} usuario(s) activado(s) exitosamente`)
}

// Handle bulk deactivate
const handleBulkDeactivate = async (userIds) => {
  const confirmed = await confirmService.confirm(
    `¿Está seguro de desactivar ${userIds.length} usuario(s)?`,
    { title: 'Confirmar desactivación masiva' }
  )

  if (!confirmed) return

  let successCount = 0
  for (const userId of userIds) {
    const result = await usersStore.toggleUserStatus(userId, false)
    if (result.success) successCount++
  }
  logInfo(`${successCount} usuario(s) desactivado(s) exitosamente`)
}

// Handle bulk delete
const handleBulkDelete = async (userIds) => {
  const confirmed = await confirmService.confirm(
    `¿Está seguro de eliminar ${userIds.length} usuario(s)? Esta acción no se puede deshacer.`,
    {
      title: 'Confirmar eliminación masiva',
      danger: true,
      confirmText: 'Eliminar'
    }
  )

  if (!confirmed) return

  // TODO: Implement bulk delete in users store
  alertService.showInfo('Funcionalidad de eliminación masiva pendiente de implementar')
}

// Handle password reset - DIRECT MODAL WITHOUT EMAIL
const handleResetPassword = (user) => {
  // Verificar que solo superadmin puede acceder
  if (authStore.profile?.role !== 'superadmin') {
    alertService.showDanger('Solo el superadministrador puede cambiar contraseñas')
    return
  }

  // Abrir modal directamente sin confirmación
  resettingUser.value = user
  showPasswordResetModal.value = true
}

const closePasswordResetModal = () => {
  showPasswordResetModal.value = false
  resettingUser.value = null
}

const handlePasswordResetSubmit = async (newPassword) => {
  try {
    // Call Cloud Function to update password in Firebase Auth
    const result = await usersStore.resetUserPassword(resettingUser.value.id, newPassword)

    if (result.success) {
      closePasswordResetModal()

      alertService.showSuccess(
        `✓ Contraseña actualizada para ${resettingUser.value.displayName}`,
        5000
      )

      // Show the password
      setTimeout(() => {
        alertService.showInfo(
          `📋 Nueva contraseña para ${resettingUser.value.email}: "${newPassword}". ` +
          `Comparte esta contraseña con el usuario.`,
          15000
        )
      }, 600)

      logInfo('Contraseña actualizada mediante Cloud Function para:', resettingUser.value.email)
    } else {
      alertService.showDanger('Error: ' + result.error)
    }
  } catch (error) {
    logError('Error al establecer contraseña:', error)
    alertService.showDanger('Error inesperado al cambiar contraseña')
  }
}

console.log('UsersListView script loaded')
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Usuarios
        </h2>
        <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Administra superadmins, admins y trabajadores del sistema
        </p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition shadow-sm"
        @click="openCreateModal"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Crear Usuario
      </button>
    </div>

    <!-- Users Table -->
    <UsersTable
      @edit-user="openEditModal"
      @toggle-status="handleToggleStatus"
      @reset-password="handleResetPassword"
      @bulk-activate="handleBulkActivate"
      @bulk-deactivate="handleBulkDeactivate"
      @bulk-delete="handleBulkDelete"
    />

    <!-- User Modal -->
    <UserModal
      :show="showModal"
      :user="editingUser"
      @close="closeModal"
      @save="handleSaveUser"
    />

    <!-- Password Reset Modal -->
    <PasswordResetModal
      :show="showPasswordResetModal"
      :user="resettingUser"
      @close="closePasswordResetModal"
      @reset="handlePasswordResetSubmit"
    />
  </div>
</template>
