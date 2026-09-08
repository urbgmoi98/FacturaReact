// Utilitarios compartidos del módulo de facturación.
// Centralizan formateo, cálculos e identificadores para eliminar la
// duplicación entre formulario, listado, vista y exportador.

const currencyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'USD',
})

export function formatCurrency(value) {
  return currencyFormatter.format(value)
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Total de una línea de ítem: cantidad × precio unitario.
export function itemSubtotal(item) {
  return parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)
}

// Cálculo completo de totales de la factura: subtotal, impuesto y total.
export function calculateTotals(items, taxRate) {
  const subtotal = items.reduce((sum, item) => sum + itemSubtotal(item), 0)
  const tax = subtotal * (parseFloat(taxRate || 0) / 100)
  return { subtotal, tax, total: subtotal + tax }
}

// Generador de identificadores UUID (usado por el formulario).
export function createId() {
  return crypto.randomUUID()
}