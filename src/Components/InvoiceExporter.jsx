import { useEffect, useRef, useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function InvoiceExporter({ invoice, onBack, printMode }) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState('')
  const pdfRef = useRef(null)

  // useEffect: auto-scroll al exportar
  useEffect(() => {
    if (isExporting && pdfRef.current) {
      pdfRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [isExporting])

  // useEffect: limpiar estado después de exportar
  useEffect(() => {
    if (exportStatus === 'success') {
      const timer = setTimeout(() => setExportStatus(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [exportStatus])

  const handleExportPDF = async () => {
    if (!pdfRef.current) return
    setIsExporting(true)
    setExportStatus('generando')

    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)

      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 10

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`Factura_${invoice.invoiceNumber}_${invoice.clientName.replace(/\s+/g, '_')}.pdf`)

      setExportStatus('success')
    } catch (error) {
      console.error('Error al exportar PDF:', error)
      setExportStatus('error')
    } finally {
      setIsExporting(false)
    }
  }

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
    <div className={`no-print${printMode ? ' hidden-print' : ''}`}>
      {/* Botones de acción */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <button className="btn btn-primary" onClick={handleExportPDF} disabled={isExporting}>
          {isExporting ? '⏳ Generando PDF...' : '📄 Descargar PDF'}
        </button>
        <button className="btn btn-secondary" onClick={() => window.print()}>
          🖨️ Imprimir
        </button>
        <button className="btn btn-gray" onClick={onBack}>
          ← Volver al listado
        </button>
      </div>

      {/* Estado de exportación */}
      {exportStatus === 'success' && (
        <div
          style={{
            textAlign: 'center',
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            background: 'rgba(52, 211, 153, 0.15)',
            borderRadius: '16px',
            color: '#059669',
            fontWeight: 700,
            animation: 'fadeInUp 0.4s ease-out',
          }}
        >
          ✅ PDF descargado correctamente
        </div>
      )}
      {exportStatus === 'error' && (
        <div
          style={{
            textAlign: 'center',
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            background: 'rgba(251, 113, 133, 0.15)',
            borderRadius: '16px',
            color: '#e11d48',
            fontWeight: 700,
          }}
        >
          ❌ Error al generar el PDF. Intenta de nuevo.
        </div>
      )}

      {/* Contenedor oculto para capturar el PDF */}
      <div
        ref={pdfRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '800px',
          background: '#ffffff',
          padding: '40px',
          fontFamily: "'Nunito', 'Segoe UI', sans-serif",
          color: '#1e3a4f',
        }}
      >
        {/* Header del PDF */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '32px',
            paddingBottom: '24px',
            borderBottom: '3px solid #38bdf8',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.6rem', color: '#0ea5e9', marginBottom: '4px', fontWeight: 800 }}>
              {invoice.emitterName}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '2px 0' }}>
              RUC/NIT: {invoice.emitterRuc}
            </p>
            {invoice.clientAddress && (
              <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0' }}>
                {invoice.clientAddress}
              </p>
            )}
          </div>
          <div
            style={{
              border: '2px solid #38bdf8',
              padding: '14px 24px',
              textAlign: 'center',
              borderRadius: '12px',
              background: '#f0f9ff',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', color: '#0ea5e9', letterSpacing: '3px', fontWeight: 800, margin: 0 }}>
              FACTURA
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#334155', margin: '4px 0 0', fontWeight: 600 }}>
              N° {invoice.invoiceNumber}
            </p>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '2px 0 0' }}>
              {formatDate(invoice.date)}
            </p>
          </div>
        </div>

        {/* Cliente */}
        <div style={{ marginBottom: '32px' }}>
          <h4
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: '#38bdf8',
              marginBottom: '6px',
              fontWeight: 700,
            }}
          >
            Cliente
          </h4>
          <p style={{ fontSize: '1.1rem', color: '#1e3a4f', fontWeight: 600, margin: 0 }}>
            {invoice.clientName}
          </p>
          {invoice.clientAddress && (
            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '4px 0 0' }}>
              {invoice.clientAddress}
            </p>
          )}
        </div>

        {/* Tabla */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '32px',
            fontSize: '0.92rem',
          }}
        >
          <thead>
            <tr style={{ background: '#f0f9ff' }}>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: 700,
                  color: '#0ea5e9',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                  borderBottom: '2px solid #bae6fd',
                }}
              >
                Descripción
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: 700,
                  color: '#0ea5e9',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                  borderBottom: '2px solid #bae6fd',
                }}
              >
                Cant.
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: 700,
                  color: '#0ea5e9',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                  borderBottom: '2px solid #bae6fd',
                }}
              >
                P. Unit.
              </th>
              <th
                style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  fontWeight: 700,
                  color: '#0ea5e9',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '1px',
                  borderBottom: '2px solid #bae6fd',
                }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '14px 16px', color: '#1e3a4f' }}>{item.description}</td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#475569' }}>
                  {item.quantity}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'center', color: '#475569' }}>
                  {formatCurrency(parseFloat(item.unitPrice))}
                </td>
                <td
                  style={{
                    padding: '14px 16px',
                    textAlign: 'right',
                    color: '#1e3a4f',
                    fontWeight: 600,
                  }}
                >
                  {formatCurrency(parseFloat(item.quantity) * parseFloat(item.unitPrice))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totales */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div
            style={{
              width: '280px',
              background: '#f8fafc',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                fontSize: '0.92rem',
                color: '#64748b',
              }}
            >
              <span>Subtotal:</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                fontSize: '0.92rem',
                color: '#64748b',
              }}
            >
              <span>Impuesto ({invoice.taxRate}%):</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(invoice.tax)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 0 0',
                marginTop: '8px',
                borderTop: '2px solid #38bdf8',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: '#0ea5e9',
              }}
            >
              <span>TOTAL:</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            color: '#94a3b8',
            fontSize: '0.85rem',
            marginTop: '40px',
            paddingTop: '24px',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <p style={{ fontStyle: 'italic', fontSize: '1rem', color: '#64748b', margin: 0 }}>
            Gracias por su preferencia
          </p>
          <p style={{ margin: '8px 0 0' }}>
            Este documento es una representación digital de su factura.
          </p>
        </div>
      </div>
    </div>
  )
}