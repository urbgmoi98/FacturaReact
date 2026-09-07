export default function InvoiceView({ invoice }) {
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
    <div className="invoice-paper">
      <div className="invoice-header">
        <div className="invoice-company">
          <h2>{invoice.emitterName}</h2>
          <p>RUC/NIT: {invoice.emitterRuc}</p>
          {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
        </div>
        <div className="invoice-badge">
          <div className="invoice-badge-box">
            <h3>FACTURA</h3>
            <p>N° {invoice.invoiceNumber}</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--aero-text-muted)', marginTop: '0.375rem' }}>
              {formatDate(invoice.date)}
            </p>
          </div>
        </div>
      </div>

      <div className="invoice-client">
        <h4>Cliente</h4>
        <p>{invoice.clientName}</p>
        {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
      </div>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Cant.</th>
            <th>P. Unit.</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id}>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>{formatCurrency(parseFloat(item.unitPrice))}</td>
              <td>
                {formatCurrency(parseFloat(item.quantity) * parseFloat(item.unitPrice))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-totals">
        <div className="invoice-totals-box">
          <div className="totals-row">
            <span>Subtotal:</span>
            <span>{formatCurrency(invoice.subtotal)}</span>
          </div>
          <div className="totals-row">
            <span>Impuesto ({invoice.taxRate}%):</span>
            <span>{formatCurrency(invoice.tax)}</span>
          </div>
          <div className="totals-row total">
            <span>TOTAL:</span>
            <span>{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      <div className="invoice-footer">
        <p>Gracias por su preferencia</p>
        <p style={{ marginTop: '0.5rem' }}>
          Este documento es una representación digital de su factura.
        </p>
      </div>
    </div>
  )
}