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

// Cargar usuarios al montar
onMounted(async () => {
  try {
    await usersStore.fetchUsers()
    logInfo('UsersListView: usuarios cargados', usersStore.list.length)
  } catch (error) {
    logError('UsersListView: error al obtener usuarios', error)
  }
})

// Abrir modal para crear
const openCreateModal = () => {
  editingUser.value = null
  showModal.value = true
}

// Abrir modal para editar
const openEditModal = (user) => {
  editingUser.value = user
  showModal.value = true
}

// Cerrar modal
const closeModal = () => {
  showModal.value = false
  editingUser.value = null
}

// Guardar (crear o actualizar)
const handleSaveUser = async (userData) => {
  try {
    if (userData.id) {
      // Actualizar
      const result = await usersStore.updateUser(userData.id, {
        displayName: userData.displayName,
        role: userData.role,
      })

      if (result.success) {
        logInfo('Usuario actualizado exitosamente')
        closeModal()
      } else {
        logError('Error al actualizar usuario:', result.error)
        alertService.showDanger('Error al actualizar usuario: ' + result.error)
      }
    } else {
      // Crear
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
    logError('Error inesperado al guardar usuario:', error)
    alertService.showDanger('Error inesperado al guardar usuario')
  }
}

// Activar / desactivar
const handleToggleStatus = async (user) => {
  const newStatus = !user.active
  const action = newStatus ? 'activar' : 'desactivar'

  const confirmed = await confirmService.confirm(
    `¿Está seguro de ${action} a ${user.displayName || user.email}?`,
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

// Eliminar individual
const handleDeleteUser = async (user) => {
  const confirmed = await confirmService.confirm(
    `¿Eliminar al usuario ${user.displayName || user.email}? Esta acción no se puede deshacer.`,
    {
      title: 'Confirmar eliminación',
      danger: true,
      confirmText: 'Eliminar'
    }
  )

  if (!confirmed) return

  const result = await usersStore.deleteUser(user.id)

  if (result.success) {
    logInfo('Usuario eliminado exitosamente')
  } else {
    logError('Error al eliminar usuario:', result.error)
    alertService.showDanger('Error al eliminar usuario: ' + result.error)
  }
}

// Activar en bloque
const handleBulkActivate = async (userIds) => {
  if (!userIds.length) return

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

// Desactivar en bloque
const handleBulkDeactivate = async (userIds) => {
  if (!userIds.length) return

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

// Eliminar en bloque (pendiente implementar 100% en store si quieres)
const handleBulkDelete = async (userIds) => {
  if (!userIds.length) return

  const confirmed = await confirmService.confirm(
    `¿Está seguro de eliminar ${userIds.length} usuario(s)? Esta acción no se puede deshacer.`,
    {
      title: 'Confirmar eliminación masiva',
      danger: true,
      confirmText: 'Eliminar'
    }
  )

  if (!confirmed) return

  // Ahora mismo no hacemos delete uno a uno; si quieres lo implementamos luego.
  alertService.showInfo('Funcionalidad de eliminación masiva pendiente de implementar')
}

// Cambiar contraseña (solo superadmin)
const handleResetPassword = (user) => {
  // Verificar que solo superadmin puede acceder
  if (authStore.profile?.role !== 'superadmin') {
    alertService.showDanger('Solo el superadministrador puede cambiar contraseñas')
    return
  }

  resettingUser.value = user
  showPasswordResetModal.value = true
}

const closePasswordResetModal = () => {
  showPasswordResetModal.value = false
  resettingUser.value = null
}

const handlePasswordResetSubmit = async (newPassword) => {
  try {
    // Note: Firebase does not allow changing another user's password from client-side.
    // We store this as a temporary password note for the superadmin to share.
    // The user will need to log in with their CURRENT password and change it themselves,
    // OR we provide this as the "new onboarding password" for test accounts.

    const result = await usersStore.updateUser(resettingUser.value.id, {
      temporaryPassword: newPassword,
      passwordSetBy: authStore.profile?.displayName || 'Superadmin',
      passwordSetAt: new Date().toISOString(),
      requiresPasswordChange: true
    })

    if (result.success) {
      // Show a detailed alert explaining the process
      closePasswordResetModal()

      alertService.showSuccess(
        `✓ Contraseña temporal guardada para ${resettingUser.value.displayName}`,
        5000
      )

      // Show the password in a second alert
      setTimeout(() => {
        alertService.showInfo(
          `📋 Contraseña para compartir con ${resettingUser.value.email}: "${newPassword}". ` +
          `El usuario debe usar "Olvidé mi contraseña" en el login con esta contraseña como referencia, ` +
          `o si es cuenta nueva, esta es su contraseña inicial.`,
          15000 // 15 seconds
        )
      }, 600)

      logInfo('Contraseña temporal establecida para:', resettingUser.value.email)
    } else {
      alertService.showDanger('Error al guardar: ' + result.error)
    }
  } catch (error) {
    logError('Error al establecer contraseña:', error)
    alertService.showDanger('Error inesperado')
  }
}

</script>

<template>
  <div class="space-y-6">
    <!-- DEBUG pequeño (lo puedes borrar cuando quieras) -->
    <p class="text-white text-xs">
      DEBUG: UsersListView template rendering
    </p>

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

    <!-- Tabla de usuarios -->
    <UsersTable
      @edit-user="openEditModal"
      @toggle-status="handleToggleStatus"
      @delete-user="handleDeleteUser"
      @reset-password="handleResetPassword"
      @bulk-activate="handleBulkActivate"
      @bulk-deactivate="handleBulkDeactivate"
      @bulk-delete="handleBulkDelete"
    />

    <!-- Modal usuario -->
    <UserModal
      :show="showModal"
      :user="editingUser"
      @close="closeModal"
      @save="handleSaveUser"
    />

    <!-- Modal de cambio de contraseña -->
    <PasswordResetModal
      :show="showPasswordResetModal"
      :user="resettingUser"
      @close="closePasswordResetModal"
      @reset="handlePasswordResetSubmit"
    />
  </div>
</template>
