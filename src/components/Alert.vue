<script setup>
import { defineProps, defineEmits } from 'vue'

defineOptions({
  name: 'AlertNotification'
})

const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'danger', 'success', 'warning', 'dark'].includes(value)
  }
})

const emit = defineEmits(['dismiss'])

const handleDismiss = () => {
  emit('dismiss', props.id)
}

const typeClasses = {
  info: 'text-blue-800 bg-blue-100 dark:text-blue-200 dark:bg-blue-900/70 border border-blue-200 dark:border-blue-800',
  danger: 'text-red-800 bg-red-100 dark:text-red-200 dark:bg-red-900/70 border border-red-200 dark:border-red-800',
  success: 'text-green-800 bg-green-100 dark:text-green-200 dark:bg-green-900/70 border border-green-200 dark:border-green-800',
  warning: 'text-yellow-800 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-900/70 border border-yellow-200 dark:border-yellow-800',
  dark: 'text-slate-100 bg-slate-800 dark:text-slate-900 dark:bg-slate-200 border border-slate-700 dark:border-slate-300'
}

const buttonClasses = {
  info: 'hover:bg-blue-200 dark:hover:bg-blue-800 focus:ring-blue-300 dark:focus:ring-blue-700',
  danger: 'hover:bg-red-200 dark:hover:bg-red-800 focus:ring-red-300 dark:focus:ring-red-700',
  success: 'hover:bg-green-200 dark:hover:bg-green-800 focus:ring-green-300 dark:focus:ring-green-700',
  warning: 'hover:bg-yellow-200 dark:hover:bg-yellow-800 focus:ring-yellow-300 dark:focus:ring-yellow-700',
  dark: 'hover:bg-slate-700 dark:hover:bg-slate-300 focus:ring-slate-600 dark:focus:ring-slate-400'
}
</script>

<template>
  <div
    :class="[
      'flex sm:items-center p-4 mb-4 text-sm rounded-base transition-all duration-300 ease-in-out',
      typeClasses[type]
    ]"
    role="alert"
  >
    <svg
      class="w-4 h-4 shrink-0 mt-0.5 md:mt-0"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
    <span class="sr-only">{{ type === 'danger' ? 'Error' : type.charAt(0).toUpperCase() + type.slice(1) }}</span>
    <div class="ms-2 text-sm">
      {{ message }}
    </div>
    <button
      type="button"
      :class="[
        'ms-auto -mx-1.5 -my-1.5 rounded focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 shrink-0',
        buttonClasses[type]
      ]"
      @click="handleDismiss"
      aria-label="Close"
    >
      <span class="sr-only">Close</span>
      <svg
        class="w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18 17.94 6M18 18 6.06 6"
        />
      </svg>
    </button>
  </div>
</template>
