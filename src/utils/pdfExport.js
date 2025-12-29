import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Export a quote to PDF
 * @param {Object} quote - The quote object with all necessary data
 * @param {Array} products - Products list for category lookup
 */
export function exportQuoteToPDF(quote, products = []) {
  try {
    const doc = new jsPDF()

    // Colors
    const primaryColor = [41, 128, 185] // Blue
    const grayColor = [100, 100, 100]
    const yellowHighlight = [255, 255, 153] // Light yellow for highlighting

    // Header
    doc.setFontSize(22)
    doc.setTextColor(...primaryColor)
    doc.setFont('helvetica', 'bold')
    doc.text('COTIZACIÓN', 105, 20, { align: 'center' })

    // Company Info
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text('DUOLINK S.A.C.', 14, 30)
    doc.text('RUC: 10734666314', 14, 35)
    doc.text('Dirección: Nueva Cajamarca', 14, 40)

    // Client Info Box
    doc.setDrawColor(...grayColor)
    doc.rect(120, 25, 80, 25)
    doc.setFontSize(9)
    doc.text(`Código: ${quote.code}`, 125, 32)
    doc.text(`Fecha: ${quote.date}`, 125, 38)
    doc.text(`Cliente: ${quote.clientName}`, 125, 44)

    // Table
    const tableColumn = ["N°", "Producto", "Descripción", "Cant.", "Unidad", "Precio", "Subtotal"]
    const tableRows = []

    let rowIndex = 1

    // Separate items by type and category
    const equipos = quote.items?.filter(i => i.type === 'equipo') || []
    const servicios = quote.items?.filter(i => i.type === 'servicio') || []

    const materialesAdicionales = []
    const otrosEquipos = []

    equipos.forEach(item => {
      // Check category from item first, then lookup in products store
      const category = item.category || (item.productId ? products.find(p => p.id === item.productId)?.category : null)

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
      tableRows.push([{ content: 'EQUIPOS', colSpan: 7, styles: { fillColor: [240, 240, 240], fontStyle: 'bold', textColor: [0, 0, 0] } }])
      otrosEquipos.forEach(item => {
        tableRows.push([
          rowIndex++,
          item.name,
          item.description || '',
          item.qty,
          item.unit,
          `S/. ${Number(item.price).toFixed(2)}`,
          `S/. ${(item.qty * item.price).toFixed(2)}`
        ])
      })
    }

    // Servicios
    if (servicios.length) {
      tableRows.push([{ content: 'SERVICIOS', colSpan: 7, styles: { fillColor: [240, 240, 240], fontStyle: 'bold', textColor: [0, 0, 0] } }])
      servicios.forEach(item => {
        tableRows.push([
          rowIndex++,
          item.name,
          item.description || '',
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
          textColor: [0, 0, 0]
        }
      }])

      materialesAdicionales.forEach(item => {
        tableRows.push([
          { content: rowIndex++, styles: {} },
          { content: item.name, styles: {} },
          { content: item.description || '', styles: {} },
          { content: item.qty, styles: { fillColor: yellowHighlight, fontStyle: 'bold' } }, // Yellow highlight
          { content: item.unit, styles: {} },
          { content: `S/. ${Number(item.price).toFixed(2)}`, styles: {} },
          { content: `S/. ${(item.qty * item.price).toFixed(2)}`, styles: {} }
        ])
      })
    }

    // Total
    const total = quote.total || quote.items?.reduce((acc, item) => acc + (item.qty * item.price), 0) || 0
    tableRows.push([
      { content: 'TOTAL', colSpan: 6, styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 } },
      { content: `S/. ${total.toFixed(2)}`, styles: { fontStyle: 'bold', fontSize: 12, textColor: primaryColor } }
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
    if (quote.notes) {
      doc.setFontSize(10)
      doc.setTextColor(...primaryColor)
      doc.text('Notas:', 14, finalY)
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.text(quote.notes, 14, finalY + 5, { maxWidth: 180 })
    }

    doc.save(`cotizacion-${quote.code}.pdf`)
    return { success: true }
  } catch (error) {
    console.error('Error generating PDF:', error)
    return { success: false, error: error.message }
  }
}
