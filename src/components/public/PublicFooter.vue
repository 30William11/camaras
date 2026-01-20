<script setup>
import { RouterLink } from 'vue-router'
import { onMounted, computed } from 'vue'
import { useWebsiteStore } from '@/stores/website'
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-vue-next'

const websiteStore = useWebsiteStore()
const currentYear = new Date().getFullYear()

onMounted(async () => {
  await websiteStore.loadContent()
})

const quickLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Nosotros', path: '/about' },
  { name: 'Servicios', path: '/services' },
  { name: 'Contacto', path: '/contact' },
]

const socialLinks = computed(() => {
  const links = []

  if (websiteStore.content.social?.facebook) {
    links.push({
      name: 'Facebook',
      icon: 'facebook',
      url: websiteStore.content.social.facebook,
      component: Facebook
    })
  }

  if (websiteStore.content.social?.instagram) {
    links.push({
      name: 'Instagram',
      icon: 'instagram',
      url: websiteStore.content.social.instagram,
      component: Instagram
    })
  }

  if (websiteStore.content.social?.linkedin) {
    links.push({
      name: 'LinkedIn',
      icon: 'linkedin',
      url: websiteStore.content.social.linkedin,
      component: Linkedin
    })
  }

  return links
})

const contactInfo = computed(() => websiteStore.content.contact || {})
</script>

<template>
  <footer class="bg-slate-900 dark:bg-slate-950 text-slate-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Company Info -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-xl font-bold text-white">CCTV Pro</span>
          </div>
          <p class="text-sm text-slate-400 mb-4">
            Soluciones profesionales en sistemas de seguridad y videovigilancia CCTV.
          </p>

          <!-- Social Links with Lucide Icons -->
          <div v-if="socialLinks.length > 0" class="flex gap-3">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="social.name"
              class="group w-10 h-10 rounded-lg bg-slate-800 hover:bg-gradient-to-br transition-all duration-300 flex items-center justify-center"
              :class="{
                'hover:from-blue-600 hover:to-blue-700': social.icon === 'facebook',
                'hover:from-pink-600 hover:to-purple-700': social.icon === 'instagram',
                'hover:from-blue-700 hover:to-blue-800': social.icon === 'linkedin'
              }"
            >
              <component
                :is="social.component"
                :size="20"
                :stroke-width="2"
                class="text-slate-300 group-hover:text-white group-hover:scale-110 transition-all duration-300"
              />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white font-bold mb-4 text-lg">Enlaces Rápidos</h3>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.path">
              <RouterLink
                :to="link.path"
                class="text-sm hover:text-blue-400 transition-colors flex items-center gap-2 group"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {{ link.name }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-white font-bold mb-4 text-lg">Contacto</h3>
          <ul class="space-y-3 text-sm">
            <li v-if="contactInfo.address" class="flex items-start gap-3">
              <MapPin :size="20" class="text-blue-400 mt-0.5 flex-shrink-0" />
              <span>{{ contactInfo.address }}</span>
            </li>
            <li v-if="contactInfo.email" class="flex items-center gap-3">
              <Mail :size="20" class="text-blue-400 flex-shrink-0" />
              <a :href="`mailto:${contactInfo.email}`" class="hover:text-blue-400 transition-colors">
                {{ contactInfo.email }}
              </a>
            </li>
            <li v-if="contactInfo.phone" class="flex items-center gap-3">
              <Phone :size="20" class="text-blue-400 flex-shrink-0" />
              <a :href="`tel:${contactInfo.phone}`" class="hover:text-blue-400 transition-colors">
                {{ contactInfo.phone }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 pt-8 border-t border-slate-800">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-slate-400">
            © {{ currentYear }} CCTV Pro. Todos los derechos reservados.
          </p>
          <div class="flex gap-6 text-sm">
            <a href="#" class="text-slate-400 hover:text-blue-400 transition-colors">
              Política de Privacidad
            </a>
            <a href="#" class="text-slate-400 hover:text-blue-400 transition-colors">
              Términos de Servicio
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
