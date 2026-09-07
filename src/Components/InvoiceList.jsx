export default function InvoiceList({ invoices, onSelect, loading = false }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="card">
      <h2 className="card-title">📋 Facturas Registradas</h2>

      {loading ? (
        <div className="empty-state">
          <div className="empty-state-icon">⏳</div>
          <p>Cargando facturas...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>No hay facturas registradas</p>
          <p>Crea tu primera factura usando el formulario.</p>
        </div>
      ) : (
        <ul className="invoice-list">
          {invoices.map((invoice) => (
            <li
              key={invoice.id}
              className="invoice-item"
              onClick={() => onSelect(invoice)}
            >
              <div>
                <div className="invoice-item-number">#{invoice.invoiceNumber}</div>
                <div className="invoice-item-meta">
                  {invoice.clientName} • {formatDate(invoice.date)}
                </div>
              </div>
              <div className="invoice-item-total">
                {formatCurrency(invoice.total)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}