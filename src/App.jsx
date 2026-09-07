import { useEffect, useState } from 'react'
import InvoiceForm from './Components/InvoiceForm'
import InvoiceList from './Components/InvoiceList'
import InvoiceView from './Components/InvoiceView'

// URL de la API (json-server) que usa db.json como base de datos.

const API_URL = 'http://localhost:3001/invoices'

function App() {
  const [invoices, setInvoices] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [loading, setLoading] = useState(true)

  // Cargar las facturas guardadas en db.json al iniciar la app.

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) throw new Error('Error al cargar las facturas')

        const data = await response.json()
        setInvoices(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('No se pudieron cargar las facturas:', error)
        alert('No se pudieron cargar las facturas. Asegúrate de que la API esté en ejecución: npm run server')
      } finally {
        setLoading(false)
      }
    }

    loadInvoices()
  }, [])

  // Guardar la factura en la base de datos (db.json) vía la API.





  const handleSaveInvoice = async (invoice) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice),
      })

      if (!response.ok) throw new Error('Error al guardar la factura')

      const savedInvoice = await response.json()
      setInvoices((prev) => [savedInvoice, ...prev])
      alert('✅ Factura guardada correctamente en la base de datos')
    } catch (error) {
      console.error('No se pudo guardar la factura:', error)
      alert('❌ No se pudo guardar la factura. Asegúrate de que la API esté en ejecución: npm run server')
    }
  }

  const handleSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice)
  }

  const handleBackToList = () => {
    setSelectedInvoice(null)
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>App de Facturación</h1>
      </header>

      {selectedInvoice ? (
        <div>
          <InvoiceView invoice={selectedInvoice} />
          <div className="back-btn-wrapper">
            <button className="btn btn-gray" onClick={handleBackToList}>
              ← Volver al listado
            </button>
          </div>
        </div>
      ) : (
        <div className="app-layout">
          <InvoiceForm onSave={handleSaveInvoice} />
          <InvoiceList
            invoices={invoices}
            onSelect={handleSelectInvoice}
            loading={loading}
          />
        </div>
      )}
    </div>
  )
}

export default App