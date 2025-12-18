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
