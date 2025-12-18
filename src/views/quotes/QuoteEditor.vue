<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuotesStore } from '@/stores/quotes'
import { useProductsStore } from '@/stores/products'
import { useServicesStore } from '@/stores/services'
import { useClientsStore } from '@/stores/clients'
import { alertService } from '@/utils/alertService'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Components
// We will reuse ProductModal but purely for selection if possible,
// or we might need a simpler "ProductSelectorModal".
// For now, let's implement a simple modal within this file or assume we can pick from a list.
// To keep it clean, I'll create a simple "AddProductModal" inline or separate.
// Let's try to use a simple selector for now.

const route = useRoute()
const router = useRouter()
const quotesStore = useQuotesStore()
const productsStore = useProductsStore()
const servicesStore = useServicesStore()
const clientsStore = useClientsStore()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)

const form = ref({
  code: `COT-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
  date: new Date().toISOString().split('T')[0],
  clientName: '',
  clientRuc: '',
  clientAddress: '',
  items: [], // Array of { id, name, description, qty, unit, price, type: 'equipo' | 'mano_obra' }
  notes: '',
})

// Modal state for adding products
const showProductSelector = ref(false)
const showServiceSelector = ref(false)
const selectedTypeToAdd = ref('equipo')

onMounted(async () => {
  await Promise.all([
    productsStore.fetchProducts(),
    servicesStore.fetchServices(),
    clientsStore.fetchClients()
  ])

  if (isEdit.value) {
    const quote = quotesStore.list.find(q => q.id === route.params.id)
    if (quote) {
      form.value = JSON.parse(JSON.stringify(quote))
    }
  }
})

// Computed for grouped items
const equipos = computed(() => form.value.items.filter(i => i.type === 'equipo'))
const servicios = computed(() => form.value.items.filter(i => i.type === 'servicio'))

const subtotal = computed(() => {
  return form.value.items.reduce((acc, item) => acc + (item.qty * item.price), 0)
})

const total = computed(() => subtotal.value) // Add tax logic if needed

// Actions
const addItem = (type) => {
  selectedTypeToAdd.value = type
  showProductSelector.value = true
}

const addService = () => {
  showServiceSelector.value = true
}

const addManualItem = (type) => {
  form.value.items.push({
    id: Date.now(),
    name: '',
    description: '',
    qty: 1,
    unit: 'unidad',
    price: 0,
    type
  })
}

const selectProduct = (product) => {
  form.value.items.push({
    id: Date.now(), // unique id for the row
    productId: product.id,
    name: product.name,
    description: product.description || '',
    qty: 1,
    unit: product.unit || 'unidad',
    price: product.price || 0,
    type: selectedTypeToAdd.value,
    category: product.category // Store category for PDF export
  })
  showProductSelector.value = false
}

const selectService = (service) => {
  form.value.items.push({
    id: Date.now(),
    serviceId: service.id,
    name: service.name,
    description: service.description || '',
    qty: 1,
    unit: 'servicio',
    price: service.price || 0,
    type: 'servicio'
  })
  showServiceSelector.value = false
}

const removeItem = (index) => {
  // We need to find the actual index in the main array
  // But since we iterate over filtered lists in template, we pass the item itself
  const idx = form.value.items.indexOf(index)
  if (idx !== -1) form.value.items.splice(idx, 1)
}

const saveQuote = async () => {
  loading.value = true
  const payload = {
    ...form.value,
    total: total.value
  }

  let res
  if (isEdit.value) {
    res = await quotesStore.updateQuote(route.params.id, payload)
  } else {
    res = await quotesStore.createQuote(payload)
  }

  loading.value = false
  if (res.success) {
    router.push({ name: 'app.quotes.index' })
  } else {
    alertService.showDanger('Error al guardar: ' + res.error)
  }
}

const handleClientSelect = (e) => {
  const name = e.target.value
  const client = clientsStore.list.find((c) => c.name === name)
  if (client) {
    form.value.clientName = client.name
    form.value.clientRuc = client.documentNumber || ''
    form.value.clientAddress = client.address || ''
  }
}

const exportPDF = () => {
  try {
    const doc = new jsPDF()

    // Colors
    const primaryColor = [41, 128, 185] // Blue
    const grayColor = [100, 100, 100]
    const yellowHighlight = [255, 255, 153] // Light yellow for highlighting

    // Header
    doc.setFontSize(22)
    doc.setTextColor(...primaryColor)
    doc.text('COTIZACIÓN', 105, 20, { align: 'center' })

    // Company Info (Placeholder)
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text('Mi Empresa de Cámaras', 14, 30)
    doc.text('RUC: 20123456789', 14, 35)
    doc.text('Dirección: Av. Principal 123', 14, 40)

    // Client Info Box
    doc.setDrawColor(...grayColor)
    doc.rect(120, 25, 80, 25)
    doc.setFontSize(9)
    doc.text(`Código: ${form.value.code}`, 125, 32)
    doc.text(`Fecha: ${form.value.date}`, 125, 38)
    doc.text(`Cliente: ${form.value.clientName}`, 125, 44)

    // Table
    const tableColumn = ["N°", "Producto", "Descripción", "Cant.", "Unidad", "Precio", "Subtotal"]
    const tableRows = []

    let rowIndex = 1

    // Separate items by category
    const materialesAdicionales = []
    const otrosEquipos = []

    equipos.value.forEach(item => {
      // Check category from item first, then lookup in store
      const category = item.category || (item.productId ? productsStore.list.find(p => p.id === item.productId)?.category : null)

      // Case-insensitive comparison for "Materiales Adicionales"
      const isMaterialesAdicionales = category?.toLowerCase().includes('materiales adicionales')

      if (isMaterialesAdicionales) {
        materialesAdicionales.push(item)
      } else {
        otrosEquipos.push(item)
      }
    })

    // Equipos (excluding Materiales Adicionales)
    if (otrosEquipos.length) {
      tableRows.push([{ content: 'EQUIPOS', colSpan: 7, styles: { fillColor: [240, 240, 240], fontStyle: 'bold', textColor: [0,0,0] } }])
      otrosEquipos.forEach(item => {
        tableRows.push([
          rowIndex++,
          item.name,
          item.description,
          item.qty,
          item.unit,
          `S/. ${Number(item.price).toFixed(2)}`,
          `S/. ${(item.qty * item.price).toFixed(2)}`
        ])
      })
    }

    // Servicios
    if (servicios.value.length) {
      tableRows.push([{ content: 'SERVICIOS', colSpan: 7, styles: { fillColor: [240, 240, 240], fontStyle: 'bold', textColor: [0,0,0] } }])
      servicios.value.forEach(item => {
        tableRows.push([
          rowIndex++,
          item.name,
          item.description,
          item.qty,
          item.unit,
          `S/. ${Number(item.price).toFixed(2)}`,
          `S/. ${(item.qty * item.price).toFixed(2)}`
        ])
      })
    }

    // Materiales Adicionales - Separate section with highlighted quantities
    if (materialesAdicionales.length) {
      tableRows.push([{
        content: 'MATERIALES ADICIONALES (Cantidades Aproximadas)',
        colSpan: 7,
        styles: {
          fillColor: [255, 243, 205], // Light orange/yellow background
          fontStyle: 'bold',
          textColor: [0,0,0]
        }
      }])

      materialesAdicionales.forEach(item => {
        tableRows.push([
          { content: rowIndex++, styles: {} },
          { content: item.name, styles: {} },
          { content: item.description, styles: {} },
          { content: item.qty, styles: { fillColor: yellowHighlight, fontStyle: 'bold' } }, // Yellow highlight
          { content: item.unit, styles: {} },
          { content: `S/. ${Number(item.price).toFixed(2)}`, styles: {} },
          { content: `S/. ${(item.qty * item.price).toFixed(2)}`, styles: {} }
        ])
      })
    }

    // Total
    tableRows.push([
      { content: 'TOTAL', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 } },
      { content: `S/. ${total.value.toFixed(2)}`, styles: { fontStyle: 'bold', fontSize: 12, textColor: primaryColor } }
    ])

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 10 }, // N°
        3: { halign: 'center' }, // Cant
        5: { halign: 'right' }, // Precio
        6: { halign: 'right' } // Subtotal
      }
    })

    // Add note about Materiales Adicionales
    let finalY = doc.lastAutoTable.finalY + 10

    if (materialesAdicionales.length > 0) {
      doc.setFontSize(10)
      doc.setTextColor(...primaryColor)
      doc.text('Nota Importante:', 14, finalY)
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      const noteText = 'Los materiales adicionales resaltados tienen cantidades aproximadas. La cantidad final puede variar según las necesidades de la instalación.'
      doc.text(noteText, 14, finalY + 5, { maxWidth: 180 })
      finalY += 15
    }

    // Notes
    if (form.value.notes) {
      doc.setFontSize(10)
      doc.setTextColor(...primaryColor)
      doc.text('Notas:', 14, finalY)
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.text(form.value.notes, 14, finalY + 5, { maxWidth: 180 })
    }

    doc.save(`cotizacion-${form.value.code}.pdf`)
  } catch (e) {
    console.error('Error generating PDF:', e)
    alertService.showDanger('Hubo un error al generar el PDF. Por favor verifique los datos.')
  }
}
</script>

<template>
  <div class="text-slate-900 dark:text-white pb-20">
    <!-- Header Actions -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">{{ isEdit ? 'Editar Cotización' : 'Nueva Cotización' }}</h2>
      <div class="flex gap-2">
        <button @click="router.back()" class="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700">
          Cancelar
        </button>
        <button @click="exportPDF" class="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-800">
          Exportar PDF
        </button>
        <button @click="saveQuote" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700" :disabled="loading">
          {{ loading ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>

    <!-- Form Header -->
    <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-xs font-medium text-slate-500 uppercase mb-1">Código</label>
        <input v-model="form.code" type="text" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm" />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-500 uppercase mb-1">Fecha</label>
        <input v-model="form.date" type="date" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm" />
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-500 uppercase mb-1">Cliente</label>
        <input
          v-model="form.clientName"
          type="text"
          list="clients-list"
          @input="handleClientSelect"
          placeholder="Nombre del cliente"
          class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm"
        />
        <datalist id="clients-list">
          <option v-for="client in clientsStore.list" :key="client.id" :value="client.name" />
        </datalist>
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-500 uppercase mb-1">RUC/DNI</label>
        <input v-model="form.clientRuc" type="text" placeholder="Documento" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm" />
      </div>
      <div class="md:col-span-2">
        <label class="block text-xs font-medium text-slate-500 uppercase mb-1">Dirección</label>
        <input v-model="form.clientAddress" type="text" placeholder="Dirección del cliente" class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm" />
      </div>
      <div class="md:col-span-3">
        <label class="block text-xs font-medium text-slate-500 uppercase mb-1">Notas</label>
        <textarea v-model="form.notes" rows="2" placeholder="Notas adicionales..." class="w-full rounded-lg border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm"></textarea>
      </div>
    </div>

    <!-- Items Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <table class="w-full text-sm text-left">
        <thead class="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-medium">
          <tr>
            <th class="px-4 py-3 w-10">#</th>
            <th class="px-4 py-3 w-1/4">Producto/Servicio</th>
            <th class="px-4 py-3 w-1/3">Descripción</th>
            <th class="px-4 py-3 w-20">Cant.</th>
            <th class="px-4 py-3 w-24">Unidad</th>
            <th class="px-4 py-3 w-24">Precio</th>
            <th class="px-4 py-3 w-24">Subtotal</th>
            <th class="px-4 py-3 w-10"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">

          <!-- Section: Equipos -->
          <tr class="bg-slate-50 dark:bg-slate-700/50">
            <td colspan="8" class="px-4 py-2 font-bold text-slate-700 dark:text-slate-300 flex justify-between items-center">
              <span>EQUIPOS</span>
              <div class="flex gap-2">
                <button @click="addItem('equipo')" class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">+ Catálogo</button>
                <button @click="addManualItem('equipo')" class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-slate-300">+ Manual</button>
              </div>
            </td>
          </tr>
          <tr v-for="(item, idx) in equipos" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
            <td class="px-4 py-2 text-center text-slate-400">{{ idx + 1 }}</td>
            <td class="px-4 py-2">
              <input v-model="item.name" class="w-full bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 p-0 text-sm" placeholder="Nombre" />
            </td>
            <td class="px-4 py-2">
              <input v-model="item.description" class="w-full bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 p-0 text-sm" placeholder="Descripción" />
            </td>
            <td class="px-4 py-2">
              <input v-model.number="item.qty" type="number" class="w-full bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 p-0 text-sm text-center" />
            </td>
            <td class="px-4 py-2">
              <input v-model="item.unit" class="w-full bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 p-0 text-sm" />
            </td>
            <td class="px-4 py-2">
              <input v-model.number="item.price" type="number" step="0.01" class="w-full bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 p-0 text-sm text-right" />
            </td>
            <td class="px-4 py-2 text-right font-medium">
              S/. {{ (item.qty * item.price).toFixed(2) }}
            </td>
            <td class="px-4 py-2 text-center">
              <button @click="removeItem(item)" class="text-red-400 hover:text-red-600">×</button>
            </td>
          </tr>

          <!-- Section: Servicios -->
          <tr class="bg-slate-50 dark:bg-slate-700/50">
            <td colspan="8" class="px-4 py-2 font-bold text-slate-700 dark:text-slate-300 flex justify-between items-center">
              <span>SERVICIOS</span>
              <div class="flex gap-2">
                <button @click="addService" class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">+ Catálogo</button>
                <button @click="addManualItem('servicio')" class="text-xs bg-slate-200 text-slate-700 px-2 py-1 rounded hover:bg-slate-300">+ Manual</button>
              </div>
            </td>
          </tr>
          <tr v-for="(item, idx) in servicios" :key="item.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/30">
            <td class="px-4 py-2 text-center text-slate-400">{{ idx + 1 }}</td>
            <td class="px-4 py-2">
              <input v-model="item.name" class="w-full bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 p-0 text-sm" placeholder="Nombre" />
            </td>
            <td class="px-4 py-2">
              <input v-model="item.description" class="w-full bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 p-0 text-sm" placeholder="Descripción" />
            </td>
            <td class="px-4 py-2">
              <input v-model.number="item.qty" type="number" class="w-full bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 p-0 text-sm text-center" />
            </td>
            <td class="px-4 py-2">
              <input v-model="item.unit" class="w-full bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 p-0 text-sm" />
            </td>
            <td class="px-4 py-2">
              <input v-model.number="item.price" type="number" step="0.01" class="w-full bg-transparent border-0 border-b border-transparent focus:border-blue-500 focus:ring-0 p-0 text-sm text-right" />
            </td>
            <td class="px-4 py-2 text-right font-medium">
              S/. {{ (item.qty * item.price).toFixed(2) }}
            </td>
            <td class="px-4 py-2 text-center">
              <button @click="removeItem(item)" class="text-red-400 hover:text-red-600">×</button>
            </td>
          </tr>

        </tbody>
        <tfoot class="bg-slate-100 dark:bg-slate-900 font-bold">
          <tr>
            <td colspan="6" class="px-4 py-3 text-right">TOTAL</td>
            <td class="px-4 py-3 text-right text-lg text-emerald-600 dark:text-emerald-400">S/. {{ total.toFixed(2) }}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Product Selector Modal -->
    <div v-if="showProductSelector" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 class="font-bold">Seleccionar Producto</h3>
          <button @click="showProductSelector = false">✕</button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <div class="grid grid-cols-1 gap-2">
            <button
              v-for="prod in productsStore.list"
              :key="prod.id"
              @click="selectProduct(prod)"
              class="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-left"
            >
              <div>
                <div class="font-bold">{{ prod.name }}</div>
                <div class="text-xs text-slate-500">{{ prod.sku }} | {{ prod.category }}</div>
              </div>
              <div class="font-bold text-emerald-600">S/. {{ Number(prod.price).toFixed(2) }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Service Selector Modal -->
    <div v-if="showServiceSelector" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 class="font-bold">Seleccionar Servicio</h3>
          <button @click="showServiceSelector = false">✕</button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <div class="grid grid-cols-1 gap-2">
            <button
              v-for="service in servicesStore.list"
              :key="service.id"
              @click="selectService(service)"
              class="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-left"
            >
              <div class="flex-1">
                <div class="font-bold">{{ service.name }}</div>
                <div class="text-xs text-slate-500">{{ service.description }}</div>
              </div>
              <div class="font-bold text-emerald-600">S/. {{ Number(service.price).toFixed(2) }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
