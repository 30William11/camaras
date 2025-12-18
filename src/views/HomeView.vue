<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
  await authStore.logout()
  router.push({ name: 'app.login' })
}
</script>

<template>
  <main class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Dashboard (cotizador)</h1>
      <button
        @click="logout"
        class="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </div>

    <p class="text-sm text-slate-600">
      Aquí luego armamos el panel con productos, cotizaciones, etc.
    </p>
  </main>
</template>
