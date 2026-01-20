<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Home, Users, Briefcase, Package, Mail, Menu, X, LogIn } from 'lucide-vue-next'
import ThemeToggle from '@/components/ThemeToggle.vue'

const mobileMenuOpen = ref(false)

const navItems = [
  { name: 'Inicio', path: '/', icon: Home },
  { name: 'Nosotros', path: '/about', icon: Users },
  { name: 'Servicios', path: '/services', icon: Briefcase },
  { name: 'Productos', path: '/productos', icon: Package },
  { name: 'Contacto', path: '/contact', icon: Mail },
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 p-1">
            <img src="/logo.png" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <span class="text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 bg-clip-text text-transparent">
            CCTV Pro
          </span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center gap-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative group"
            active-class="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
          >
            <span class="flex items-center gap-2">
              <component :is="item.icon" :size="18" :stroke-width="2" />
              {{ item.name }}
            </span>
            <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-3/4 transition-all duration-300"></span>
          </RouterLink>
        </div>

        <!-- Actions -->
        <div class="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <RouterLink
            to="/app/login"
            class="group relative overflow-hidden flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <LogIn :size="18" class="relative z-10" />
            <span class="relative z-10">Acceder al Sistema</span>
          </RouterLink>
        </div>

        <!-- Mobile Menu Button -->
        <div class="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            @click="toggleMobileMenu"
            class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 active:scale-95"
            aria-label="Toggle menu"
          >
            <Menu v-if="!mobileMenuOpen" :size="24" :stroke-width="2" class="text-slate-700 dark:text-slate-300" />
            <X v-else :size="24" :stroke-width="2" class="text-slate-700 dark:text-slate-300" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md"
      >
        <div class="px-4 py-4 space-y-2">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="closeMobileMenu"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
            active-class="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
          >
            <component :is="item.icon" :size="20" :stroke-width="2" class="group-hover:scale-110 transition-transform" />
            {{ item.name }}
          </RouterLink>
          <RouterLink
            to="/app/login"
            @click="closeMobileMenu"
            class="flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 mt-4"
          >
            <LogIn :size="20" />
            Acceder al Sistema
          </RouterLink>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.nav-link {
  position: relative;
}

.nav-link::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 0.5rem;
  padding: 1px;
  background: linear-gradient(135deg, transparent, transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s;
}

.nav-link:hover::before {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  opacity: 0.3;
}
</style>
