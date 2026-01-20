<script setup>
import { storeToRefs } from 'pinia'
import { useAlertStore } from '@/stores/alert'
import Alert from './Alert.vue'

const alertStore = useAlertStore()
const { alerts } = storeToRefs(alertStore)

const handleDismiss = (id) => {
  alertStore.removeAlert(id)
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 max-w-md w-full space-y-2">
    <TransitionGroup name="alert">
      <Alert
        v-for="alert in alerts"
        :key="alert.id"
        :id="alert.id"
        :message="alert.message"
        :type="alert.type"
        @dismiss="handleDismiss"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.alert-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.alert-move {
  transition: transform 0.3s ease;
}
</style>
