<script setup>
</script>

<template>
  <div class="min-h-screen py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          Acerca de Nosotros
        </h1>
        <p class="text-xl text-slate-600 dark:text-slate-400">
          Líderes en soluciones de seguridad y videovigilancia
        </p>
      </div>

      <!-- Mission & Vision -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md">
          <div class="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Nuestra Misión
          </h2>
          <p class="text-slate-600 dark:text-slate-400">
            Proporcionar soluciones de seguridad de alta calidad que protejan a nuestros clientes y les brinden tranquilidad, utilizando la mejor tecnología disponible en el mercado.
          </p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md">
          <div class="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Nuestra Visión
          </h2>
          <p class="text-slate-600 dark:text-slate-400">
            Ser la empresa líder en soluciones de videovigilancia, reconocida por nuestra innovación, calidad de servicio y compromiso con la seguridad de nuestros clientes.
          </p>
        </div>
      </div>

      <!-- About Content -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-md mb-16">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          ¿Quiénes Somos?
        </h2>
        <div class="space-y-4 text-slate-600 dark:text-slate-400">
          <p>
            Somos una empresa especializada en sistemas de videovigilancia CCTV con más de 10 años de experiencia en el mercado. Nos dedicamos a diseñar, instalar y mantener soluciones de seguridad personalizadas para empresas y hogares.
          </p>
          <p>
            Nuestro equipo de profesionales altamente capacitados trabaja con las marcas más reconocidas del sector, garantizando equipos de última generación y un servicio de excelencia.
          </p>
          <p>
            Entendemos que cada cliente tiene necesidades únicas, por eso ofrecemos soluciones a medida que se adaptan perfectamente a sus requerimientos de seguridad y presupuesto.
          </p>
        </div>
      </div>

      <!-- Team Section - Nuestro Equipo -->
      <div class="mb-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Nuestro Equipo
          </h2>
          <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Profesionales comprometidos con la excelencia y la innovación en seguridad
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <!-- William Calderón Card -->
          <div class="group perspective-1000">
            <div class="relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
              <!-- Decorative Background -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-600/10 dark:from-blue-600/20 dark:to-indigo-800/20"></div>
              <div class="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-700"></div>
              <div class="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl transform -translate-x-16 translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>

              <div class="relative p-8">
                <!-- Avatar Container with 3D effect -->
                <div class="relative mb-6 flex justify-center">
                  <div class="relative group-hover:scale-110 transition-transform duration-500">
                    <!-- Animated Ring -->
                    <div class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-spin-slow opacity-75 blur-sm"></div>
                    <div class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse"></div>

                    <!-- Avatar -->
                    <div class="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-4 border-white dark:border-slate-800">
                      WC
                    </div>

                    <!-- Status Badge -->
                    <div class="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 shadow-lg animate-pulse"></div>
                  </div>
                </div>

                <!-- Info -->
                <div class="text-center space-y-3">
                  <h3 class="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    William Calderón
                  </h3>

                  <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                    <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span class="text-sm font-semibold text-blue-700 dark:text-blue-300">
                      Bachiller en Ingeniería de Sistemas
                    </span>
                  </div>

                  <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Especialista en diseño e implementación de sistemas de videovigilancia con enfoque en soluciones innovadoras y tecnología de vanguardia.
                  </p>

                  <!-- Social Links / Contact -->
                  <div class="flex justify-center gap-3 pt-4">
                    <button class="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </button>
                    <button class="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Jorge Manya Card -->
          <div class="group perspective-1000">
            <div class="relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105">
              <!-- Decorative Background -->
              <div class="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-purple-600/10 dark:from-indigo-600/20 dark:to-purple-800/20"></div>
              <div class="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl transform translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-700"></div>
              <div class="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl transform -translate-x-16 translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>

              <div class="relative p-8">
                <!-- Avatar Container with 3D effect -->
                <div class="relative mb-6 flex justify-center">
                  <div class="relative group-hover:scale-110 transition-transform duration-500">
                    <!-- Animated Ring -->
                    <div class="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-spin-slow opacity-75 blur-sm"></div>
                    <div class="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-pulse"></div>

                    <!-- Avatar -->
                    <div class="relative w-32 h-32 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-4 border-white dark:border-slate-800">
                      JM
                    </div>

                    <!-- Status Badge -->
                    <div class="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 shadow-lg animate-pulse"></div>
                  </div>
                </div>

                <!-- Info -->
                <div class="text-center space-y-3">
                  <h3 class="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Jorge Manya
                  </h3>

                  <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                    <svg class="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span class="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                      Ingeniero Colegiado en Ingeniería de Sistemas
                    </span>
                  </div>

                  <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Experto en arquitectura de redes y sistemas de seguridad integral, con amplia experiencia en proyectos empresariales de gran escala.
                  </p>

                  <!-- Social Links / Contact -->
                  <div class="flex justify-center gap-3 pt-4">
                    <button class="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                      </svg>
                    </button>
                    <button class="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-all hover:scale-110 shadow-md">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Values -->
      <div>
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Nuestros Valores
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Confianza
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Construimos relaciones duraderas basadas en la transparencia y honestidad
            </p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Calidad
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Utilizamos solo equipos de las mejores marcas y tecnología de punta
            </p>
          </div>

          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Compromiso
            </h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Estamos dedicados a la satisfacción y seguridad de nuestros clientes
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 3D Perspective */
.perspective-1000 {
  perspective: 1000px;
}

/* Slow Spin Animation for Avatar Rings */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

/* Pulse Animation Override for Smoother Effect */
@keyframes pulse {
  0%, 100% {
    opacity: 0.75;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
