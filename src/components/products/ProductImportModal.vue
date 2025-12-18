<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'
import { useProductsStore } from '@/stores/products'
import { alertService } from '@/utils/alertService'
import { logInfo, logError } from '@/utils/logger'

const props = defineProps({
  show: Boolean,
})

const emit = defineEmits(['close', 'imported'])

const productsStore = useProductsStore()
const fileInput = ref(null)
const parsedData = ref([])
const loading = ref(false)
const importProgress = ref(0)
const totalToImport = ref(0)

const downloadTemplate = () => {
  const headers = [
    {
      name: 'Producto Ejemplo',
      sku: 'SKU-001',
      price: 100.50,
      category: 'Cámaras',
      type: 'equipo',
      unit: 'unidad',
      description: 'Descripción del producto',
      active: 'si'
    }
  ]

  const ws = XLSX.utils.json_to_sheet(headers)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Plantilla')
  XLSX.writeFile(wb, 'plantilla_productos.xlsx')
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const json = XLSX.utils.sheet_to_json(worksheet)

      parsedData.value = json.map(row => ({
        name: row.name || row.Name || row.Nombre || '',
        sku: row.sku || row.SKU || '',
        price: row.price || row.Price || row.Precio || 0,
        category: row.category || row.Category || row.Categoria || 'General',
        type: (row.type || row.Type || row.Tipo || 'equipo').toLowerCase(),
        unit: row.unit || row.Unit || row.Unidad || 'unidad',
        description: row.description || row.Description || row.Descripcion || '',
        active: (row.active || row.Active || row.Activo || 'si').toLowerCase() === 'si'
      })).filter(p => p.name) // Filter out empty rows

    } catch (error) {
      console.error('Error parsing Excel:', error)
      alertService.showDanger('Error al leer el archivo Excel. Asegúrese de que sea un formato válido.')
    }
  }
  reader.readAsArrayBuffer(file)
}

const importProducts = async () => {
  if (!parsedData.value.length) return

  loading.value = true
  totalToImport.value = parsedData.value.length
  importProgress.value = 0
  let successCount = 0

  for (const product of parsedData.value) {
    try {
      // Basic validation
      if (!product.name) continue

      // Ensure price is a number
      product.price = Number(product.price) || 0

      await productsStore.createProduct(product)
      successCount++
    } catch (e) {
      logError('Error importing product:', e)
    }
    importProgress.value++
  }

  loading.value = false
  alertService.showSuccess(`Importación completada. ${successCount} productos importados exitosamente.`)
  emit('imported')
  emit('close')
  parsedData.value = []
  if (fileInput.value) fileInput.value.value = ''
}

const close = () => {
  emit('close')
  parsedData.value = []
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">
          Importar Productos desde Excel
        </h3>
        <button @click="close" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 flex-1 overflow-y-auto space-y-6">

        <!-- Step 1: Template -->
        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <h4 class="font-semibold text-blue-800 dark:text-blue-300 mb-2">1. Descargar Plantilla</h4>
          <p class="text-sm text-blue-600 dark:text-blue-400 mb-3">
            Descargue el formato guía para asegurar que los datos se importen correctamente.
          </p>
          <button
            @click="downloadTemplate"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
          >
            <span>📥</span> Descargar Plantilla Excel
          </button>
        </div>

        <!-- Step 2: Upload -->
        <div>
          <h4 class="font-semibold text-slate-900 dark:text-white mb-2">2. Subir Archivo</h4>
          <input
            ref="fileInput"
            type="file"
            accept=".xlsx, .xls"
            @change="handleFileUpload"
            class="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
            "
          />
        </div>

        <!-- Step 3: Preview -->
        <div v-if="parsedData.length > 0">
          <h4 class="font-semibold text-slate-900 dark:text-white mb-2 flex justify-between items-center">
            <span>3. Vista Previa ({{ parsedData.length }} registros)</span>
            <span v-if="loading" class="text-sm text-blue-600">Importando {{ importProgress }} / {{ totalToImport }}...</span>
          </h4>
          <div class="relative overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg max-h-60">
            <table class="w-full text-xs text-left text-slate-500 dark:text-slate-400">
              <thead class="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400 sticky top-0">
                <tr>
                  <th class="px-3 py-2">Nombre</th>
                  <th class="px-3 py-2">SKU</th>
                  <th class="px-3 py-2">Precio</th>
                  <th class="px-3 py-2">Categoría</th>
                  <th class="px-3 py-2">Tipo</th>
                  <th class="px-3 py-2">Activo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in parsedData.slice(0, 10)" :key="i" class="bg-white border-b dark:bg-slate-800 dark:border-slate-700">
                  <td class="px-3 py-2 font-medium text-slate-900 dark:text-white">{{ row.name }}</td>
                  <td class="px-3 py-2">{{ row.sku }}</td>
                  <td class="px-3 py-2">{{ row.price }}</td>
                  <td class="px-3 py-2">{{ row.category }}</td>
                  <td class="px-3 py-2">{{ row.type }}</td>
                  <td class="px-3 py-2">{{ row.active ? 'Sí' : 'No' }}</td>
                </tr>
                <tr v-if="parsedData.length > 10">
                  <td colspan="6" class="px-3 py-2 text-center text-slate-400 italic">
                    ... y {{ parsedData.length - 10 }} más
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
        <button
          @click="close"
          class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 dark:hover:bg-slate-700"
          :disabled="loading"
        >
          Cancelar
        </button>
        <button
          @click="importProducts"
          class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!parsedData.length || loading"
        >
          {{ loading ? 'Importando...' : 'Importar Productos' }}
        </button>
      </div>
    </div>
  </div>
</template>
