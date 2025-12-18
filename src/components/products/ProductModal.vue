<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { useUnitsStore } from '@/stores/units'

const props = defineProps({
  isOpen: Boolean,
  product: Object, // null = create, object = edit
})

const emit = defineEmits(['close', 'save'])

const categoriesStore = useCategoriesStore()
const unitsStore = useUnitsStore()

const form = ref({
  name: '',
  sku: '',
  qty: 0,
  active: true,
  category: '',
  description: '',
  type: 'equipo',
  unit: 'unidad',
  imageFile: null,
  imageUrl: null,

  // Pricing
  priceUsd: 0,
  exchangeRate: 3.75, // Default default
  profitPercentage: 30, // Default
})

// Calculations
const purchasePrice = computed(() => {
  return (Number(form.value.priceUsd) || 0) * (Number(form.value.exchangeRate) || 1)
})

const salePrice = computed(() => {
  const base = purchasePrice.value
  const margin = Number(form.value.profitPercentage) || 0
  return base * (1 + margin / 100)
})

const profit = computed(() => {
  return salePrice.value - purchasePrice.value
})

const isEdit = computed(() => !!props.product)

onMounted(() => {
  categoriesStore.fetchCategories()
  unitsStore.fetchUnits()
})

// Reset form when modal opens or product changes
watch(
  () => props.product,
  (newVal) => {
    if (newVal) {
      form.value = {
        name: newVal.name,
        sku: newVal.sku,
        qty: newVal.qty,
        active: newVal.active,
        category: newVal.category || '',
        description: newVal.description || '',
        type: newVal.type || 'equipo',
        unit: newVal.unit || 'unidad',
        imageFile: null,
        imageUrl: newVal.imageUrl,

        // Pricing
        priceUsd: newVal.priceUsd || 0,
        exchangeRate: newVal.exchangeRate || 3.75,
        profitPercentage: newVal.profitPercentage || 30,
      }
    } else {
      form.value = {
        name: '',
        sku: '',
        qty: 0,
        active: true,
        category: '',
        description: '',
        type: 'equipo',
        unit: 'unidad',
        imageFile: null,
        imageUrl: null,

        // Pricing Defaults
        priceUsd: 0,
        exchangeRate: 3.75,
        profitPercentage: 30,
      }
    }
  },
  { immediate: true }
)

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.imageFile = file
    form.value.imageUrl = URL.createObjectURL(file)
  }
}

const handleSubmit = () => {
  // Pass calculated values as well
  emit('save', {
    ...form.value,
    purchasePrice: purchasePrice.value,
    profit: profit.value,
    salePrice: salePrice.value,
    id: props.product?.id
  })
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">
          {{ isEdit ? 'Editar Producto' : 'Nuevo Producto' }}
        </h3>
        <button @click="$emit('close')" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
          ✕
        </button>
      </div>

      <!-- Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
          <textarea
            v-model="form.description"
            rows="2"
            class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <!-- SKU & Price -->
        <!-- Pricing Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
          <div class="col-span-2 md:col-span-3 font-semibold text-sm text-slate-900 dark:text-white mb-2">
            Cálculo de Precios
          </div>

          <!-- Row 1: Inputs -->
          <div>
            <label class="block text-xs font-medium text-slate-500 mb-1">Precio USD</label>
            <div class="relative">
              <span class="absolute left-3 top-2 text-slate-400">$</span>
              <input
                v-model.number="form.priceUsd"
                type="number"
                min="0"
                step="0.01"
                class="w-full pl-7 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-500 mb-1">Tipo de Cambio</label>
            <input
              v-model.number="form.exchangeRate"
              type="number"
              min="0"
              step="0.001"
              class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-500 mb-1">Precio Compra (S/)</label>
            <input
              :value="purchasePrice.toFixed(2)"
              disabled
              class="w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-600 text-slate-500 text-sm cursor-not-allowed"
            />
          </div>

          <!-- Row 2: Calculations -->
          <div>
            <label class="block text-xs font-medium text-slate-500 mb-1">% Ganancia</label>
            <div class="relative">
              <input
                v-model.number="form.profitPercentage"
                type="number"
                min="0"
                step="1"
                class="w-full pr-7 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
              />
              <span class="absolute right-3 top-2 text-slate-400">%</span>
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">Precio Venta (S/)</label>
            <input
              :value="salePrice.toFixed(2)"
              disabled
              class="w-full rounded-lg border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm font-bold"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-500 mb-1">Ganancia (S/)</label>
            <input
              :value="profit.toFixed(2)"
              disabled
              class="w-full rounded-lg border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-600 text-slate-500 text-sm"
            />
          </div>
        </div>

        <!-- Inventory & Details -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock Inicial</label>
            <input
              v-model.number="form.qty"
              type="number"
              min="0"
              class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU</label>
            <input
              v-model="form.sku"
              type="text"
              class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Category, Type, Unit -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
            <select
              v-model="form.category"
              class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Seleccionar...</option>
              <option v-for="cat in categoriesStore.list" :key="cat.id" :value="cat.name">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tipo</label>
            <select
              v-model="form.type"
              class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="equipo">Equipo</option>
              <option value="mano_obra">Mano de Obra</option>
              <option value="servicio">Servicio</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Unidad</label>
            <select
              v-model="form.unit"
              class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>Seleccionar...</option>
              <option v-for="unit in unitsStore.list" :key="unit.id" :value="unit.name">
                {{ unit.name }} ({{ unit.abbreviation }})
              </option>
            </select>
          </div>
        </div>

        <!-- Active Checkbox -->
        <div class="flex items-center">
          <input
            v-model="form.active"
            id="active"
            type="checkbox"
            class="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
          />
          <label for="active" class="ml-2 text-sm font-medium text-slate-900 dark:text-slate-300">Producto Activo</label>
        </div>

        <!-- Image -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Imagen</label>
          <div class="flex items-center gap-4">
            <div v-if="form.imageUrl" class="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
              <img :src="form.imageUrl" class="w-full h-full object-cover" />
            </div>
            <input
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="block w-full text-sm text-slate-500 dark:text-slate-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-slate-700 dark:file:text-slate-300
              "
            />
          </div>
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
            {{ isEdit ? 'Guardar Cambios' : 'Crear Producto' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
