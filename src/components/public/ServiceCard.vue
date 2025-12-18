<script setup>
defineProps({
  service: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group">
    <!-- Image -->
    <div class="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden">
      <img
        v-if="service.image_url"
        :src="service.image_url"
        :alt="service.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="w-20 h-20 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-xl font-semibold text-slate-900 dark:text-white">
          {{ service.name }}
        </h3>
        <span
          v-if="service.category"
          class="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
        >
          {{ service.category }}
        </span>
      </div>

      <p class="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
        {{ service.description }}
      </p>

      <button class="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1 group">
        Más información
        <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
