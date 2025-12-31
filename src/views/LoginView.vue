<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { logDebug, logInfo, logError } from '@/utils/logger'
import ThemeToggle from '@/components/ThemeToggle.vue'

const router = useRouter()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

// Inicializar tema al montar el componente
onMounted(() => {
  themeStore.initTheme()
})

const onLogin = async () => {
  error.value = ''
  loading.value = true

  logDebug("Intentando login...", { email: email.value })

  try {
    logInfo("Enviando credenciales a Firebase...")
    await authStore.login(email.value, password.value)
    logInfo("Login correcto desde Firebase")
    logDebug("Usuario autenticado, navegando al dashboard")
    router.push({ name: 'app.dashboard' })
  } catch (e) {
    logError("ERROR LOGIN FIREBASE", e)
    error.value = 'Correo o contraseña incorrectos.'
  } finally {
    loading.value = false
    logDebug("Proceso de login finalizado")
  }
}
</script>

<template>
  <div class="min-h-screen flex relative">
    <!-- Theme Toggle - Top Right Corner -->
    <div class="absolute top-4 right-4 z-50">
      <ThemeToggle />
    </div>

    <!-- Left Panel - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-900 relative">
      <!-- 3D Security Camera 1 - Top Right Corner -->
      <div class="absolute top-0 right-0 z-30 camera-container camera-right">
        <!-- Camera Mount/Bracket -->
        <div class="camera-mount">
          <!-- Camera Body -->
          <div class="camera-body group">
            <!-- Camera Image with Effects -->
            <div class="relative">
              <img
                src="/camara1.png"
                alt="Security Camera"
                class="camera-image"
              />

              <!-- Light Effects (visible only in dark mode) -->
              <div class="light-effects dark:opacity-100 opacity-0">
                <!-- White Light Rays (More rays for better illumination) -->
                <div class="white-ray white-ray-1"></div>
                <div class="white-ray white-ray-2"></div>
                <div class="white-ray white-ray-3"></div>
                <div class="white-ray white-ray-4"></div>
                <div class="white-ray white-ray-5"></div>

                <!-- Infrared Rays -->
                <div class="ir-ray ir-ray-1"></div>
                <div class="ir-ray ir-ray-2"></div>
              </div>

              <!-- Status LED Indicator -->
              <div class="status-led"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3D Security Camera 2 - Top Left Corner -->
      <div class="absolute top-0 left-0 z-30 camera-container camera-left">
        <!-- Camera Mount/Bracket -->
        <div class="camera-mount-left">
          <!-- Camera Body -->
          <div class="camera-body group">
            <!-- Camera Image with Effects -->
            <div class="relative">
              <img
                src="/camara2.png"
                alt="Security Camera 2"
                class="camera-image"
              />

              <!-- Light Effects (visible only in dark mode) -->
              <div class="light-effects-left dark:opacity-100 opacity-0">
                <!-- White Light Rays -->
                <div class="white-ray-left white-ray-left-1"></div>
                <div class="white-ray-left white-ray-left-2"></div>
                <div class="white-ray-left white-ray-left-3"></div>
                <div class="white-ray-left white-ray-left-4"></div>
                <div class="white-ray-left white-ray-left-5"></div>

                <!-- Infrared Rays -->
                <div class="ir-ray-left ir-ray-left-1"></div>
                <div class="ir-ray-left ir-ray-left-2"></div>
              </div>

              <!-- Status LED Indicator -->
              <div class="status-led"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full max-w-md relative">
        <!-- Mobile Camera - Above Logo (visible only on mobile) -->
        <div class="lg:hidden absolute -top-24 left-1/2 transform -translate-x-1/2 z-30">
          <div class="camera-body-mobile">
            <img
              src="/camara3.png"
              alt="Security Camera Mobile"
              class="w-20 h-20 object-contain"
            />

            <!-- Mobile Light Effects (visible only in dark mode) -->
            <div class="light-effects-mobile dark:opacity-100 opacity-0">
              <!-- Mobile Flashlight Cone -->
            </div>

            <!-- Status LED -->
            <div class="status-led-mobile"></div>
          </div>
        </div>

        <!-- Logo y Branding - Centered -->
        <div class="mb-8 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 mb-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-2">
            <img src="/logo.png" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Bienvenido
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="onLogin" class="space-y-5">
          <!-- Email Field -->
          <div>
            <label class="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
              Correo Electrónico
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                v-model="email"
                type="email"
                placeholder="usuario@ejemplo.com"
                required
                class="w-full pl-12 pr-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label class="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
              Contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                required
                class="w-full pl-12 pr-12 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white bg-white dark:bg-slate-800 placeholder:text-slate-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <svg v-if="!showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-red-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm font-medium text-red-800 dark:text-red-200">
                {{ error }}
              </p>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}</span>
          </button>
        </form>

        <!-- Footer Info -->
        <div class="mt-8 text-center">
          <p class="text-sm text-slate-500 dark:text-slate-400">
            Sistema de Gestión de Cámaras y Seguridad
          </p>
          <div class="flex items-center justify-center gap-2 mt-2 text-xs text-slate-400">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Conexión segura</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Background Image & Branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-900 relative overflow-hidden">
      <!-- Background Pattern Overlay -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: url('/login-bg.png'); background-size: cover; background-position: center;"></div>
      </div>

      <!-- Geometric Patterns -->
      <div class="absolute inset-0">
        <div class="absolute top-20 right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center px-16 text-white">
        <div class="mb-8">
          <div class="inline-flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold">Sistema de Seguridad</h2>
          </div>

          <h3 class="text-4xl font-bold mb-4 leading-tight">
            Gestión Profesional de<br />Cámaras y Vigilancia
          </h3>

          <p class="text-lg text-blue-100 mb-8 max-w-md">
            Plataforma integral para administración de sistemas de seguridad, cotizaciones y gestión de clientes.
          </p>
        </div>

        <!-- Featured Image Card with instalador.png -->
        <div class="mb-8 group">
          <div class="relative rounded-2xl p-6 transition-all duration-300">
            <!-- Image Container -->
            <div class="relative overflow-hidden rounded-xl mb-4">
              <img
                src="/instalador.png"
                alt="Instalador Profesional"
                class="w-full h-64 object-contain transform group-hover:scale-105 transition-transform duration-500"
              />

              <!-- Badge -->
              <div class="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Profesional
              </div>
            </div>

            <!-- Card Content -->

          </div>
        </div>

        <!-- Version Info -->
        <div class="mt-4 text-sm text-blue-200/60">
          © 2024 Sistema de Gestión de Seguridad
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== 3D Security Camera Styles ===== */

/* Camera Container - 3D Positioning */
.camera-container {
  transform-style: preserve-3d;
  perspective: 1000px;
}

/* Camera Mount */
.camera-mount {
  position: relative;
  padding: 0; /* No padding to stick to corner */
  margin: 0;
  transform: rotateX(-15deg) rotateY(-15deg); /* Negative Y for right side */
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.camera-mount:hover {
  transform: rotateX(-10deg) rotateY(-20deg) scale(1.05);
}

/* Camera Body */
.camera-body {
  position: relative;
  width: 120px;
  height: 120px;
  transform-style: preserve-3d;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))
          drop-shadow(0 6px 6px rgba(0, 0, 0, 0.2));
}

/* Camera Image */
.camera-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transform: translateZ(20px);
  transition: all 0.3s ease;
}

/* ===== Infrared Effects (Dark Mode) ===== */

/* Infrared LEDs Ring */
.infrared-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%) translateZ(25px);
  pointer-events: none;
  transition: opacity 0.5s ease;
}

/* Individual IR LED */
.ir-led {
  position: absolute;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #ff0040 0%, #cc0033 50%, transparent 70%);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform:
    translate(-50%, -50%)
    rotate(var(--angle))
    translateY(-40px);
  box-shadow:
    0 0 4px #ff0040,
    0 0 8px #ff0040,
    0 0 12px #cc0033;
  animation: ir-pulse 2s ease-in-out infinite;
  animation-delay: calc(var(--angle) / 360deg * 2s);
}

@keyframes ir-pulse {
  0%, 100% {
    opacity: 0.6;
    box-shadow:
      0 0 4px #ff0040,
      0 0 8px #ff0040,
      0 0 12px #cc0033;
  }
  50% {
    opacity: 1;
    box-shadow:
      0 0 6px #ff0040,
      0 0 12px #ff0040,
      0 0 18px #cc0033,
      0 0 24px #cc0033;
  }
}

/* ===== Light Effects (Dark Mode Only) ===== */

.light-effects {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: opacity 0.5s ease;
  transform: translateZ(10px);
  overflow: visible;
}

/* Triangular Lamp Cone Effect - Aligned with Camera */
.light-effects::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-left: 300px solid transparent;
  border-right: 300px solid transparent;
  border-top: 700px solid rgba(255, 255, 255, 0.35);
  transform: translate(250px, 95px) rotate(25deg);
  transform-origin: top center;
  filter: blur(30px);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  animation: lamp-glow 4s ease-in-out infinite;
  z-index: 1; /* Behind the rays */
}

@keyframes lamp-glow {
  0%, 100% {
    opacity: 0.85;
  }
  50% {
    opacity: 1;
  }
}

/* White Light Rays - Diagonal Down-Right */


.white-ray-1 {
  transform: rotate(25deg); /* Far left */
  animation-delay: 0s;
  width: 2px;
  opacity: 0.75;
}

.white-ray-2 {
  transform: rotate(30deg); /* Left */
  width: 3px;
  animation-delay: 0.2s;
  opacity: 0.85;
}

.white-ray-3 {
  transform: rotate(35deg); /* Center */
  width: 4px;
  animation-delay: 0.4s;
  opacity: 1;
}

.white-ray-4 {
  transform: rotate(40deg); /* Right */
  width: 3px;
  animation-delay: 0.6s;
  opacity: 0.85;
}

.white-ray-5 {
  transform: rotate(45deg); /* Far right */
  width: 2px;
  animation-delay: 0.8s;
  opacity: 0.75;
}

/* Infrared Rays - Diagonal Down-Right (Orange/Red) */
.ir-ray {
  position: absolute;
  top: 95px; /* Bottom of camera - IR LED area */
  right: 50px; /* Center-bottom of camera */
  width: 2px;
  height: 700px;
  transform-origin: top center;
  filter: blur(3px);
  animation: ir-ray-pulse 3s ease-in-out infinite;
}

.ir-ray-1 {
  background: linear-gradient(
    to bottom,

    rgba(255, 0, 0, 0.932) 0%,
    transparent 90%
  );
  transform: rotate(30deg); /* Orange ray - between white rays */
  animation-delay: 0.3s;
  width: 5px;
}

.ir-ray-2 {
  background: linear-gradient(
    to bottom,

    rgba(255, 0, 0, 0.932) 0%,
    transparent 90%
  );
  transform: rotate(25deg); /* Red ray - between white rays */
  width: 5px;
  animation-delay: 0.7s;
}

@keyframes ray-pulse {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

@keyframes ir-ray-pulse {
  0%, 100% {
    opacity: 0.75;
  }
  50% {
    opacity: 1;
  }
}

/* Status LED Indicator */
.status-led {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background: #00ff00;
  border-radius: 50%;
  box-shadow:
    0 0 4px #00ff00,
    0 0 8px #00ff00,
    0 0 12px #00ff00;
  animation: status-blink 2s ease-in-out infinite;
  transform: translateZ(30px);
}

@keyframes status-blink {
  0%, 100% {
    opacity: 1;
    box-shadow:
      0 0 4px #00ff00,
      0 0 8px #00ff00,
      0 0 12px #00ff00;
  }
  50% {
    opacity: 0.3;
    box-shadow:
      0 0 2px #00ff00,
      0 0 4px #00ff00;
  }
}

/* ===== Input Animations ===== */
input:focus {
  animation: pulse-ring 1.5s ease-in-out;
}

@keyframes pulse-ring {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

/* ===== LEFT CAMERA STYLES (Camera 2) ===== */

/* Camera Mount Left - Mirrored */
.camera-mount-left {
  position: relative;
  padding: 0;
  margin: 0;
  transform: rotateX(-15deg) rotateY(15deg); /* Positive Y for left side */
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
}

.camera-mount-left:hover {
  transform: rotateX(-10deg) rotateY(20deg) scale(1.05);
}

/* Light Effects Left Container */
.light-effects-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: opacity 0.5s ease;
  transform: translateZ(10px);
  overflow: visible;
}

/* Triangular Lamp Cone Effect - Left Camera (Mirrored) */
.light-effects-left::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-left: 300px solid transparent;
  border-right: 300px solid transparent;
  border-top: 700px solid rgba(255, 255, 255, 0.35);
  transform: translate(-250px, 95px) rotate(-25deg); /* Negative rotation for left diagonal */
  transform-origin: top center;
  filter: blur(30px);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  animation: lamp-glow 4s ease-in-out infinite;
  z-index: 1;
}






/* Infrared Rays Left - Diagonal Down-Left */
.ir-ray-left {
  position: absolute;
  top: 95px;
  left: 50px;
  width: 5px;
  height: 700px;
  transform-origin: top center;
  filter: blur(3px);
  animation: ir-ray-pulse 3s ease-in-out infinite;
}

.ir-ray-left-1 {
  background: linear-gradient(
    to bottom,
    rgba(255, 0, 0, 0.932) 0%,

    transparent 90%
  );
  transform: rotate(-30deg);
  animation-delay: 0.3s;
  width: 6px;
}

.ir-ray-left-2 {
  background: linear-gradient(
    to bottom,
   rgba(255, 0, 0, 0.932) 0%,
    transparent 90%
  );
  transform: rotate(-25deg);
  width: 5px;
  animation-delay: 0.7s;
}

/* ===== MOBILE CAMERA STYLES (Camera 3) ===== */

.camera-body-mobile {
  position: relative;
  display: inline-block;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
}

/* Mobile Light Effects Container */
.light-effects-mobile {
  position: absolute;
  top: 80px; /* Below the camera */
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
  transition: opacity 0.5s ease;
  overflow: visible;
}

/* Mobile Flashlight Cone - Pointing Down */
.light-effects-mobile::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 200px solid transparent;
  border-right: 200px solid transparent;
  border-top: 500px solid rgba(255, 255, 255, 0.35);
  transform: translateX(-50%);
  transform-origin: top center;
  filter: blur(30px);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  animation: lamp-glow 4s ease-in-out infinite;
}

/* Mobile Status LED */
.status-led-mobile {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 6px;
  height: 6px;
  background: #00ff00;
  border-radius: 50%;
  box-shadow:
    0 0 4px #00ff00,
    0 0 8px #00ff00;
  animation: status-blink 2s ease-in-out infinite;
}

/* ===== Responsive Adjustments ===== */
@media (max-width: 1024px) {
  /* Hide desktop cameras on mobile */
  .camera-container {
    display: none;
  }
}

@media (min-width: 1025px) {
  /* Hide mobile camera on desktop */
  .camera-body-mobile {
    display: none !important;
  }
}
</style>
