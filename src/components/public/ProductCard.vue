<script setup>
import { computed, ref } from 'vue'
import { FileText, Package, Sparkles } from 'lucide-vue-next'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cardRef = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)

const fallbackImage = 'https://via.placeholder.com/400x300/e2e8f0/64748b?text=Sin+Imagen'

const productImage = computed(() => props.product.imageUrl || fallbackImage)

const truncatedDescription = computed(() => {
  if (!props.product.description) return 'Sin descripción disponible'
  return props.product.description.length > 120
    ? props.product.description.substring(0, 120) + '...'
    : props.product.description
})

const typeLabel = computed(() => {
  const types = {
    equipo: 'Equipo',
    mano_obra: 'Mano de Obra',
    servicio: 'Servicio'
  }
  return types[props.product.type] || props.product.type
})

const typeGradient = computed(() => {
  const gradients = {
    equipo: 'from-blue-500 to-cyan-500',
    mano_obra: 'from-purple-500 to-pink-500',
    servicio: 'from-green-500 to-emerald-500'
  }
  return gradients[props.product.type] || 'from-blue-500 to-cyan-500'
})

const handleMouseMove = (e) => {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  mouseX.value = ((e.clientX - rect.left) / rect.width) * 100
  mouseY.value = ((e.clientY - rect.top) / rect.height) * 100
}

const downloadPdf = () => {
  if (props.product.pdfUrl) {
    window.open(props.product.pdfUrl, '_blank')
  }
}
</script>

<template>
  <div
    ref="cardRef"
    @mousemove="handleMouseMove"
    class="product-card group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:border-transparent"
    :style="{
      transform: `perspective(1000px) rotateX(${(mouseY - 50) * 0.1}deg) rotateY(${(mouseX - 50) * 0.1}deg)`,
    }"
  >
    <!-- Animated gradient border -->
    <div class="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl p-[2px] -z-10" :class="typeGradient">
      <div class="absolute inset-[2px] bg-white dark:bg-slate-800 rounded-2xl"></div>
    </div>

    <!-- Shine effect -->
    <div
      class="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
      :style="{
        background: `radial-gradient(circle at ${mouseX}% ${mouseY}%, rgba(255,255,255,0.8), transparent 50%)`
      }"
    ></div>

    <!-- Image Container -->
    <div class="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
      <img
        :src="productImage"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        @error="(e) => e.target.src = fallbackImage"
      />

      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>


      <!-- Brand Badge with glassmorphism -->
      <div v-if="product.brand" class="absolute top-4 right-4 animate-fade-in">
        <div class="px-4 py-2 text-xs font-bold bg-slate-900/80 dark:bg-slate-100/90 backdrop-blur-md text-white dark:text-slate-900 rounded-full shadow-xl border border-white/20 dark:border-slate-900/20 flex items-center gap-2">
          <Sparkles :size="14" class="animate-pulse" />
          {{ product.brand }}
        </div>
      </div>


      <!-- Type badge -->
      <div class="absolute top-4 left-4">
        <div class="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r text-white rounded-full shadow-lg backdrop-blur-sm" :class="typeGradient">
          {{ typeLabel }}
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-6 space-y-4 relative">
      <!-- Name with icon -->
      <div class="flex items-start gap-3">
        <div class="mt-1 p-2 rounded-lg bg-gradient-to-br shrink-0" :class="typeGradient">
          <Package :size="20" class="text-white" />
        </div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-all duration-300" :class="typeGradient">
          {{ product.name }}
        </h3>
      </div>

      <!-- Category Badge -->
      <div v-if="product.category" class="flex items-center gap-2">
        <span class="px-3 py-1.5 text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800">
          {{ product.category }}
        </span>
      </div>

      <!-- Description -->
      <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
        {{ truncatedDescription }}
      </p>

      <!-- PDF Download Button -->
      <button
        v-if="product.pdfUrl"
        @click="downloadPdf"
        class="w-full group/btn relative overflow-hidden flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-red-600 via-red-700 to-red-600 rounded-xl hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
        <FileText :size="18" class="relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" />
        <span class="relative z-10">Descargar Especificaciones</span>
      </button>
      <div
        v-else
        class="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/50 rounded-xl cursor-not-allowed border border-slate-200 dark:border-slate-600"
      >
        <FileText :size="18" class="opacity-50" />
        <span>Sin especificaciones</span>
      </div>
    </div>

    <!-- Floating particles effect (subtle) -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
      <div class="particle particle-1"></div>
      <div class="particle particle-2"></div>
      <div class="particle particle-3"></div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  transform-style: preserve-3d;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.product-card:hover {
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 10px 20px -5px rgba(0, 0, 0, 0.1);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

/* Floating particles */
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, rgba(255,255,255,0.8), transparent);
  border-radius: 50%;
  animation: float 3s infinite ease-in-out;
}

.particle-1 {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.particle-2 {
  top: 60%;
  right: 30%;
  animation-delay: 1s;
}

.particle-3 {
  bottom: 30%;
  left: 50%;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  50% {
    transform: translateY(-20px) translateX(10px);
    opacity: 1;
  }
}
</style>
