<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  client: Object, // null = create, object = edit
})

const emit = defineEmits(['close', 'save'])

const form = ref({
  name: '',
  documentType: 'DNI',
  documentNumber: '',
  address: '',
  phone: '',
  email: '',
})

const isEdit = computed(() => !!props.client)

watch(
  () => props.client,
  (newVal) => {
    if (newVal) {
      form.value = { ...newVal }
    } else {
      form.value = {
        name: '',
        documentType: 'DNI',
        documentNumber: '',
        address: '',
        phone: '',
        email: '',
      }
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  const payload = { ...form.value }
  if (props.client?.id) {
    payload.id = props.client.id
  }
  emit('save', payload)
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">
          {{ isEdit ? 'Editar Cliente' : 'Nuevo Cliente' }}
        </h3>
        <button @click="$emit('close')" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
          ✕
        </button>
      </div>

      <!-- Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre / Razón Social</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Document -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo Doc.</label>
            <select
              v-model="form.documentType"
              class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
              <option value="CE">CE</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Número Documento</label>
            <input
              v-model="form.documentNumber"
              type="text"
              required
              class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Contact Info -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
            <input
              v-model="form.phone"
              type="text"
              class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Correo</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dirección</label>
          <input
            v-model="form.address"
            type="text"
            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white dark:focus:ring-slate-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {{ isEdit ? 'Guardar Cambios' : 'Crear Cliente' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
