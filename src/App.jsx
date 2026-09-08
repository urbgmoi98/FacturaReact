import { useState, useEffect } from 'react'
import InvoiceForm from './Components/InvoiceForm'
import InvoiceList from './Components/InvoiceList'
import InvoiceView from './Components/InvoiceView'
import InvoiceExporter from ' ./Components/InvoiceExporter'
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  deleteInvoice,
} from './services/invoiceService'

function App() {
  const [invoices, setInvoices] = useState([])
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [printMode, setPrintMode] = useState(false)

  // Carga inicial: las facturas se leen de la API (json-server)
  useEffect(() => {
    getInvoices()
      .then(setInvoices)
      .catch((error) => console.error('No se pudo cargar el listado de facturas:', error))
  }, [])

  // Manejar modo impresión
  useEffect(() => {
    if (printMode) {
      const timer = setTimeout(() => {
        window.print()
        setPrintMode(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [printMode])

  const handleSaveInvoice = async (invoice) => {
    try {
      const saved = await createInvoice(invoice)
      setInvoices((prev) => [saved, ...prev])
    } catch (error) {
      console.error('No se pudo guardar la factura:', error)
    }
  }

  // Consulta directa por ID: GET /invoices/{id}, sin filtrar el listado
  const handleSelectInvoice = async (id) => {
    try {
      const invoice = await getInvoiceById(id)
      setSelectedInvoice(invoice)
      setPrintMode(false)
    } catch (error) {
      console.error(`No se pudo obtener la factura ${id}:`, error)
    }
  }

  const handleBackToList = () => {
    setSelectedInvoice(null)
    setPrintMode(false)
  }

  const handlePrint = () => {
    setPrintMode(true)
  }

  const handleDeleteInvoice = async (id) => {
    try {
      await deleteInvoice(id)
      setInvoices((prev) => prev.filter((inv) => inv.id !== id))
      if (selectedInvoice?.id === id) {
        setSelectedInvoice(null)
      }
    } catch (error) {
      console.error(`No se pudo eliminar la factura ${id}:`, error)
    }
  }

  return (
    <div className={`app-container${printMode ? ' print-mode' : ''}`}>
      <header className="app-header no-print">
        <h1>App de Facturación</h1>
      </header>

      {selectedInvoice ? (
        <div>
          <InvoiceView
            invoice={selectedInvoice}
            printMode={printMode}
            onPrint={handlePrint}
            onBack={handleBackToList}
          />
          <InvoiceExporter
            invoice={selectedInvoice}
            onBack={handleBackToList}
            printMode={printMode}
          />
        </div>
      ) : (
        <div className="app-layout no-print">
          <InvoiceForm onSave={handleSaveInvoice} />
          <InvoiceList
            invoices={invoices}
            onSelect={handleSelectInvoice}
            onDelete={handleDeleteInvoice}
          />
        </div>
      )}
    </div>
  )
}

export default App