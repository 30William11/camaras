<script setup>
import { confirmService } from '@/utils/confirmService'
import { onMounted, onUnmounted } from 'vue'

defineOptions({
  name: 'ConfirmDialog'
})

const handleConfirm = () => {
  confirmService.handleConfirm()
}

const handleCancel = () => {
  confirmService.handleCancel()
}

const handleKeydown = (e) => {
  if (!confirmService.state.isOpen) return

  if (e.key === 'Escape') {
    handleCancel()
  } else if (e.key === 'Enter') {
    handleConfirm()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition name="modal">
    <div
      v-if="confirmService.state.isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="handleCancel"
    >
      <div
        class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-700"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="confirmService.state.title"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="confirmService.state.danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'"
            >
              <svg
                class="w-6 h-6"
                :class="confirmService.state.danger ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  v-if="confirmService.state.danger"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
                <path
                  v-else
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              {{ confirmService.state.title }}
            </h3>
          </div>
        </div>

        <!-- Body -->
        <div class="px-6 py-4">
          <p class="text-slate-600 dark:text-slate-300">
            {{ confirmService.state.message }}
          </p>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button
            type="button"
            @click="handleCancel"
            class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700 transition"
          >
            {{ confirmService.state.cancelText }}
          </button>
          <button
            type="button"
            @click="handleConfirm"
            :class="[
              'px-4 py-2 text-sm font-medium text-white rounded-lg transition',
              confirmService.state.danger
                ? 'bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700'
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
            ]"
          >
            {{ confirmService.state.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white,
.modal-enter-active .dark\:bg-slate-800,
.modal-leave-active .dark\:bg-slate-800 {
  transition: transform 0.2s ease;
}

.modal-enter-from .bg-white,
.modal-enter-from .dark\:bg-slate-800 {
  transform: scale(0.95);
}

.modal-leave-to .bg-white,
.modal-leave-to .dark\:bg-slate-800 {
  transform: scale(0.95);
}
</style>
