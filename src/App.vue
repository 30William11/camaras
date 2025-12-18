<script setup>
import { RouterView } from 'vue-router'
import AlertContainer from '@/components/AlertContainer.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
</script>

<template>
  <AlertContainer />
  <ConfirmDialog />
  <RouterView />
</template>

<style>
/* Global styles or reset can go here if needed,
   but for now we keep it clean for the login page to take over */
</style>
