<script setup>
import { onMounted, computed } from 'vue'
import { useWebsiteStore } from '@/stores/website'
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin } from 'lucide-vue-next'
import ContactForm from '@/components/public/ContactForm.vue'

const websiteStore = useWebsiteStore()

onMounted(async () => {
  await websiteStore.loadContent()
})

const contactInfo = computed(() => websiteStore.content.contact || {})

const socialLinks = computed(() => {
  const links = []

  if (websiteStore.content.social?.facebook) {
    links.push({
      name: 'Facebook',
      url: websiteStore.content.social.facebook,
      component: Facebook,
      hoverClass: 'hover:bg-blue-600'
    })
  }

  if (websiteStore.content.social?.instagram) {
    links.push({
      name: 'Instagram',
      url: websiteStore.content.social.instagram,
      component: Instagram,
      hoverClass: 'hover:bg-gradient-to-br hover:from-pink-600 hover:to-purple-600'
    })
  }

  if (websiteStore.content.social?.linkedin) {
    links.push({
      name: 'LinkedIn',
      url: websiteStore.content.social.linkedin,
      component: Linkedin,
      hoverClass: 'hover:bg-blue-700'
    })
  }

  return links
})
</script>

<template>
  <div class="min-h-screen py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          Contáctanos
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <div>
          <ContactForm />
        </div>

        <!-- Contact Info -->
        <div>
          <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white h-full">
            <h2 class="text-2xl font-bold mb-8">Información de Contacto</h2>

            <div class="space-y-6">
              <!-- Address -->
              <div v-if="contactInfo.address" class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <MapPin :size="24" :stroke-width="2" />
                </div>
                <div>
                  <h3 class="font-semibold mb-1">Dirección</h3>
                  <p class="text-blue-100">{{ contactInfo.address }}</p>
                </div>
              </div>

              <!-- Phone -->
              <div v-if="contactInfo.phone" class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Phone :size="24" :stroke-width="2" />
                </div>
                <div>
                  <h3 class="font-semibold mb-1">Teléfono</h3>
                  <a :href="`tel:${contactInfo.phone}`" class="text-blue-100 hover:text-white transition-colors">
                    {{ contactInfo.phone }}
                  </a>
                </div>
              </div>

              <!-- Email -->
              <div v-if="contactInfo.email" class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Mail :size="24" :stroke-width="2" />
                </div>
                <div>
                  <h3 class="font-semibold mb-1">Email</h3>
                  <a :href="`mailto:${contactInfo.email}`" class="text-blue-100 hover:text-white transition-colors">
                    {{ contactInfo.email }}
                  </a>
                </div>
              </div>

              <!-- Hours -->
              <div v-if="contactInfo.hours" class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Clock :size="24" :stroke-width="2" />
                </div>
                <div>
                  <h3 class="font-semibold mb-1">Horario de Atención</h3>
                  <p class="text-blue-100 whitespace-pre-line">{{ contactInfo.hours }}</p>
                </div>
              </div>
            </div>

            <!-- Social Media Links -->
            <div v-if="socialLinks.length > 0" class="mt-8 pt-8 border-t border-white/20">
              <h3 class="font-semibold mb-4">Síguenos en Redes Sociales</h3>
              <div class="flex gap-3">
                <a
                  v-for="social in socialLinks"
                  :key="social.name"
                  :href="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="social.name"
                  class="group w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center transition-all duration-300"
                  :class="social.hoverClass"
                >
                  <component
                    :is="social.component"
                    :size="24"
                    :stroke-width="2"
                    class="group-hover:scale-110 transition-transform duration-300"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
