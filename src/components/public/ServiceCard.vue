<script setup>
import { ref, computed } from 'vue'
import { Video, Settings, Wrench, Globe, Server, Bell, ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  service: {
    type: Object,
    required: true
  }
})

const cardRef = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)

const iconComponent = computed(() => {
  const icons = {
    camera: Video,
    tools: Settings,
    wrench: Wrench,
    network: Globe,
    server: Server,
    alarm: Bell
  }
  return icons[props.service.icon] || Video
})

const categoryGradient = computed(() => {
  const gradients = {
    instalacion: 'from-blue-500 via-blue-600 to-cyan-500',
    mantenimiento: 'from-purple-500 via-purple-600 to-pink-500',
    consultoria: 'from-green-500 via-green-600 to-emerald-500',
    soporte: 'from-orange-500 via-orange-600 to-red-500'
  }
  return gradients[props.service.category?.toLowerCase()] || 'from-blue-500 via-blue-600 to-cyan-500'
})

const handleMouseMove = (e) => {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  mouseX.value = ((e.clientX - rect.left) / rect.width) * 100
  mouseY.value = ((e.clientY - rect.top) / rect.height) * 100
}
</script>

<template>
  <div
    ref="cardRef"
    @mousemove="handleMouseMove"
    class="service-card group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden transition-all duration-500 hover:border-transparent"
    :style="{
      transform: `perspective(1200px) rotateX(${(mouseY - 50) * 0.08}deg) rotateY(${(mouseX - 50) * 0.08}deg)`,
    }"
  >
    <!-- Animated gradient border -->
    <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl p-[2px] -z-10" :class="categoryGradient">
      <div class="absolute inset-[2px] bg-white dark:bg-slate-900 rounded-2xl"></div>
    </div>

    <!-- Shine effect -->
    <div
      class="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none"
      :style="{
        background: `radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.9), transparent 60%)`
      }"
    ></div>

    <!-- Image/Icon Container -->
    <div class="relative h-56 overflow-hidden bg-gradient-to-br" :class="categoryGradient">
      <img
        v-if="service.image_url"
        :src="service.image_url"
        :alt="service.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div v-else class="w-full h-full flex items-center justify-center relative">
        <!-- Animated background pattern -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_50%)]"></div>
        </div>

        <!-- Icon with glow effect -->
        <div class="relative">
          <div class="absolute inset-0 blur-2xl opacity-50 bg-white rounded-full scale-150"></div>
          <component
            :is="iconComponent"
            :size="80"
            :stroke-width="1.5"
            class="relative text-white drop-shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
          />
        </div>
      </div>

      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
    </div>

    <!-- Content -->
    <div class="p-6 space-y-4 relative">
      <!-- Header with category badge -->
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-xl font-bold text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300" :class="categoryGradient">
          {{ service.name }}
        </h3>
        <span
          v-if="service.category"
          class="px-3 py-1.5 text-xs font-bold bg-gradient-to-r text-white rounded-full shadow-lg shrink-0 backdrop-blur-sm"
          :class="categoryGradient"
        >
          {{ service.category }}
        </span>
      </div>

      <!-- Description -->
      <p class="text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
        {{ service.description }}
      </p>

      <!-- CTA Button -->
      <button class="group/btn relative overflow-hidden flex items-center gap-2 text-sm font-bold transition-all duration-300 hover:gap-3">
        <span class="relative z-10 bg-gradient-to-r bg-clip-text text-transparent" :class="categoryGradient">
          Más información
        </span>
        <ArrowRight
          :size="16"
          class="relative z-10 text-blue-600 dark:text-blue-400 group-hover/btn:translate-x-1 transition-transform duration-300"
        />
      </button>
    </div>

    <!-- Floating orbs effect -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
      <div class="orb orb-1" :class="categoryGradient"></div>
      <div class="orb orb-2" :class="categoryGradient"></div>
    </div>
  </div>
</template>

<style scoped>
.service-card {
  transform-style: preserve-3d;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.service-card:hover {
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 10px 20px -5px rgba(0, 0, 0, 0.1);
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Floating orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.3;
  animation: float-orb 4s infinite ease-in-out;
}

.orb-1 {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  right: 15%;
  animation-delay: 2s;
}

@keyframes float-orb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(20px, -20px) scale(1.1);
  }
}
</style>
