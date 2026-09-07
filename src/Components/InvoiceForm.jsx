import { useState } from 'react'

const initialItem = () => ({
  id: crypto.randomUUID(),
  description: '',
  quantity: '',
  unitPrice: '',
})

const initialForm = () => ({
  emitterName: '',
  emitterRuc: '',
  clientName: '',
  clientAddress: '',
  invoiceNumber: '',
  date: new Date().toISOString().split('T')[0],
  taxRate: 12,
  items: [initialItem()],
})

export default function InvoiceForm({ onSave }) {
  const [form, setForm] = useState(initialForm())
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validate = (data) => {
    const errs = {}
    if (!data.emitterName.trim()) errs.emitterName = 'El nombre del emisor es obligatorio'
    if (!data.emitterRuc.trim()) errs.emitterRuc = 'El RUC/NIT es obligatorio'
    if (!data.clientName.trim()) errs.clientName = 'El nombre del cliente es obligatorio'
    if (!data.invoiceNumber.trim()) errs.invoiceNumber = 'El número de factura es obligatorio'
    if (!data.date) errs.date = 'La fecha es obligatoria'

    data.items.forEach((item, idx) => {
      if (!item.description.trim()) errs[`item-${idx}-description`] = 'Requerido'
      const qty = parseFloat(item.quantity)
      if (isNaN(qty) || qty <= 0) errs[`item-${idx}-quantity`] = 'Cantidad inválida'
      const price = parseFloat(item.unitPrice)
      if (isNaN(price) || price < 0) errs[`item-${idx}-unitPrice`] = 'Precio inválido'
    })

    return errs
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleItemChange = (index, field, value) => {
    setForm((prev) => {
      const items = [...prev.items]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, items }
    })
    setTouched((prev) => ({ ...prev, [`item-${index}-${field}`]: true }))
  }

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, initialItem()],
    }))
  }

  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)
    setTouched(
      Object.keys(validationErrors).reduce((acc, key) => {
        acc[key] = true
        return acc
      }, {})
    )

    if (Object.keys(validationErrors).length > 0) return

    const subtotal = form.items.reduce((sum, item) => {
      return sum + parseFloat(item.quantity) * parseFloat(item.unitPrice)
    }, 0)

    const tax = subtotal * (parseFloat(form.taxRate) / 100)
    const total = subtotal + tax

    const invoice = {
      id: crypto.randomUUID(),
      ...form,
      subtotal,
      tax,
      total,
      createdAt: new Date().toISOString(),
    }

    onSave(invoice)
    setForm(initialForm())
    setErrors({})
    setTouched({})
  }

  const hasError = (key) => touched[key] && errors[key]

  return (
    <div className="card">
      <h2 className="card-title">✨ Nueva Factura</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label>Emisor</label>
            <input
              type="text"
              placeholder="Nombre de la empresa"
              value={form.emitterName}
              onChange={(e) => handleChange('emitterName', e.target.value)}
              className={hasError('emitterName') ? 'error' : ''}
            />
            {hasError('emitterName') && <span className="error-msg">{errors.emitterName}</span>}
          </div>
          <div className="form-group">
            <label>RUC / NIT</label>
            <input
              type="text"
              placeholder="1234567890001"
              value={form.emitterRuc}
              onChange={(e) => handleChange('emitterRuc', e.target.value)}
              className={hasError('emitterRuc') ? 'error' : ''}
            />
            {hasError('emitterRuc') && <span className="error-msg">{errors.emitterRuc}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Cliente</label>
            <input
              type="text"
              placeholder="Nombre del cliente"
              value={form.clientName}
              onChange={(e) => handleChange('clientName', e.target.value)}
              className={hasError('clientName') ? 'error' : ''}
            />
            {hasError('clientName') && <span className="error-msg">{errors.clientName}</span>}
          </div>
          <div className="form-group">
            <label>Dirección / Correo</label>
            <input
              type="text"
              placeholder="Av. Principal 123"
              value={form.clientAddress}
              onChange={(e) => handleChange('clientAddress', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>N° Factura</label>
            <input
              type="text"
              placeholder="001-001-0000001"
              value={form.invoiceNumber}
              onChange={(e) => handleChange('invoiceNumber', e.target.value)}
              className={hasError('invoiceNumber') ? 'error' : ''}
            />
            {hasError('invoiceNumber') && <span className="error-msg">{errors.invoiceNumber}</span>}
          </div>
          <div className="form-group">
            <label>Fecha de emisión</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={hasError('date') ? 'error' : ''}
            />
            {hasError('date') && <span className="error-msg">{errors.date}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Tasa de impuesto (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.taxRate}
              onChange={(e) => handleChange('taxRate', e.target.value)}
            />
          </div>
        </div>

        <div className="items-section">
          <div className="items-header">
            <h3>📝 Ítems</h3>
            <button type="button" className="btn btn-secondary" onClick={addItem}>
              + Agregar ítem
            </button>
          </div>

          {form.items.map((item, idx) => (
            <div key={item.id} className="item-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input
                  type="text"
                  placeholder="Descripción"
                  value={item.description}
                  onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                  className={hasError(`item-${idx}-description`) ? 'error' : ''}
                />
                {hasError(`item-${idx}-description`) && (
                  <span className="error-msg">{errors[`item-${idx}-description`]}</span>
                )}
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input
                  type="number"
                  placeholder="Cant."
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                  className={hasError(`item-${idx}-quantity`) ? 'error' : ''}
                />
                {hasError(`item-${idx}-quantity`) && (
                  <span className="error-msg">{errors[`item-${idx}-quantity`]}</span>
                )}
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <input
                  type="number"
                  placeholder="P. Unit."
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                  className={hasError(`item-${idx}-unitPrice`) ? 'error' : ''}
                />
                {hasError(`item-${idx}-unitPrice`) && (
                  <span className="error-msg">{errors[`item-${idx}-unitPrice`]}</span>
                )}
              </div>
              <div style={{ paddingTop: '0.5rem', fontWeight: 700, color: 'var(--aero-primary-dark)', fontSize: '0.9375rem' }}>
                ${(parseFloat(item.quantity || 0) * parseFloat(item.unitPrice || 0)).toFixed(2)}
              </div>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeItem(idx)}
                disabled={form.items.length === 1}
                title="Eliminar ítem"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="actions">
          <button type="submit" className="btn btn-primary">
            💾 Guardar Factura
          </button>
        </div>
      </form>
    </div>
  )
}