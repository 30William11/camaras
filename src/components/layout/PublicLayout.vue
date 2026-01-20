<script setup>
import { RouterView } from 'vue-router'
import PublicNavbar from '@/components/public/PublicNavbar.vue'
import PublicFooter from '@/components/public/PublicFooter.vue'
import WhatsAppButton from '@/components/public/WhatsAppButton.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
    <!-- Navbar -->
    <PublicNavbar />

    <!-- Main Content -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <PublicFooter />

    <!-- Floating WhatsApp Button -->
    <WhatsAppButton />
  </div>
</template>
