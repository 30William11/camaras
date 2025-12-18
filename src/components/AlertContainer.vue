<script setup>
import { alertService } from '@/utils/alertService'
import Alert from './Alert.vue'

const handleDismiss = (id) => {
  alertService.dismiss(id)
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 max-w-md w-full space-y-2">
    <TransitionGroup name="alert">
      <Alert
        v-for="alert in alertService.state.alerts"
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
