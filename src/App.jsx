import { useState, useEffect } from 'react'
import InvoiceForm from './Components/InvoiceForm'
import InvoiceList from './Components/InvoiceList'
import InvoiceView from './Components/InvoiceView'
import InvoiceExporter from './components/InvoiceExporter'

function App() {
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('invoices')
    return saved ? JSON.parse(saved) : []
  })
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [printMode, setPrintMode] = useState(false)

  // Persistencia en localStorage
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices))
  }, [invoices])

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

  const handleSaveInvoice = (invoice) => {
    setInvoices((prev) => [invoice, ...prev])
  }

  const handleSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setPrintMode(false)
  }

  const handleBackToList = () => {
    setSelectedInvoice(null)
    setPrintMode(false)
  }

  const handlePrint = () => {
    setPrintMode(true)
  }

  const handleDeleteInvoice = (id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id))
    if (selectedInvoice?.id === id) {
      setSelectedInvoice(null)
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