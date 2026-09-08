// Servicio centralizado de acceso a la API REST de facturación.
// json-server expone el recurso `invoices` de db.json en http://localhost:3001.
const API_BASE_URL = 'http://localhost:3001'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`La petición ${path} falló con estado ${response.status}`)
  }

  return response.json()
}

// Listado completo de facturas (GET /invoices).
export function getInvoices() {
  return request('/invoices')
}

// Consulta directa del recurso por ID (GET /invoices/{id}).
// Reemplaza la obtención de una factura a partir de un listado filtrado.
export function getInvoiceById(id) {
  return request(`/invoices/${encodeURIComponent(id)}`)
}

// Crea una factura (POST /invoices) y devuelve el recurso persistido.
export function createInvoice(invoice) {
  return request('/invoices', {
    method: 'POST',
    body: JSON.stringify(invoice),
  })
}

// Elimina una factura (DELETE /invoices/{id}).
export function deleteInvoice(id) {
  return request(`/invoices/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}