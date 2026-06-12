import { useState } from 'react'
import { CreditCard, Download, CheckCircle2, Check } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import Modal from '../../../components/Modal'

const INVOICES = [
  { id: 'PRK-2026-011', date: '01 Jun 2026', description: 'Perks Platform – Jun 2026 Subscription', amount: 249.00, status: 'Pending' },
  { id: 'PRK-2026-010', date: '01 May 2026', description: 'Perks Platform – May 2026 Subscription', amount: 249.00, status: 'Pending' },
  { id: 'PRK-2026-009', date: '01 Apr 2026', description: 'Perks Platform – Apr 2026 Subscription', amount: 249.00, status: 'Paid'    },
  { id: 'PRK-2026-008', date: '01 Mar 2026', description: 'Perks Platform – Mar 2026 Subscription', amount: 249.00, status: 'Paid'    },
  { id: 'PRK-2026-007', date: '01 Feb 2026', description: 'Perks Platform – Feb 2026 Subscription', amount: 199.00, status: 'Paid'    },
  { id: 'PRK-2026-006', date: '01 Jan 2026', description: 'Perks Platform – Jan 2026 Subscription', amount: 199.00, status: 'Paid'    },
]

function PayModal({ invoice, onClose }) {
  const [success, setSuccess] = useState(false)
  const [method, setMethod]   = useState('card')

  if (success) {
    return (
      <div className="success-screen">
        <div className="success-icon"><CheckCircle2 size={28} /></div>
        <div className="success-title">Payment Successful!</div>
        <div className="success-subtitle">
          Invoice <strong>{invoice.id}</strong> has been paid.<br />
          Amount charged: <strong>€{invoice.amount.toFixed(2)}</strong>
        </div>
        <button className="btn btn-dark btn-lg" onClick={onClose} style={{ marginTop: 8 }}>Done</button>
      </div>
    )
  }

  return (
    <>
      <div className="invoice-summary" style={{ marginBottom: 20 }}>
        <div className="invoice-summary-row">
          <span style={{ color: 'var(--color-muted)' }}>Invoice</span>
          <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 13 }}>{invoice.id}</span>
        </div>
        <div className="invoice-summary-row">
          <span style={{ color: 'var(--color-muted)' }}>Description</span>
          <span style={{ fontWeight: 500 }}>{invoice.description}</span>
        </div>
        <div className="invoice-summary-row total">
          <span>Total Due</span>
          <span>€{invoice.amount.toFixed(2)}</span>
        </div>
      </div>
      <div className="form-group" style={{ marginBottom: 20 }}>
        <div className="form-label" style={{ marginBottom: 10 }}>Payment Method</div>
        <div className="payment-methods">
          {[
            { id: 'card', label: 'Visa ending 4242', sub: 'Credit Card' },
            { id: 'bank', label: 'Bank Transfer',    sub: 'SEPA Transfer' },
          ].map(m => (
            <div
              key={m.id}
              className={`payment-method-card${method === m.id ? ' selected' : ''}`}
              onClick={() => setMethod(m.id)}
            >
              <CreditCard size={22} color={method === m.id ? 'var(--color-dark)' : 'var(--color-muted)'} />
              <div style={{ fontSize: 13, fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="btn btn-dark btn-lg" style={{ width: '100%' }} onClick={() => setSuccess(true)}>
        <Check size={15} strokeWidth={2.5} /> Confirm & Pay €{invoice.amount.toFixed(2)}
      </button>
    </>
  )
}

export default function Billing() {
  const [invoiceList, setInvoiceList] = useState(INVOICES)
  const [paying, setPaying]           = useState(null)

  const handlePayClose = () => {
    if (paying) {
      setInvoiceList(prev => prev.map(i => i.id === paying.id ? { ...i, status: 'Paid' } : i))
    }
    setPaying(null)
  }

  const pending = invoiceList.filter(i => i.status === 'Pending')

  return (
    <div className="page-body">
      <PageHeader title="Billing &amp; Settings" icon={<CreditCard size={18} />} banner />

      {/* Plan summary card */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            Current Plan
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>Perks Pro</div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>Up to 50 employees · Unlimited deal access</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            Next Payment
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>€249.00</div>
          <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>Due 01 Jul 2026</div>
        </div>
        {pending.length > 0 && (
          <button
            className="btn btn-dark"
            style={{ fontSize: 13 }}
            onClick={() => setPaying(pending[0])}
          >
            Pay {pending.length} Pending {pending.length === 1 ? 'Invoice' : 'Invoices'}
          </button>
        )}
      </div>

      {/* Invoices table */}
      <div style={{ marginBottom: 8 }}>
        <div className="section-title">Invoice History</div>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 16, marginBottom: 24 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Invoice ID</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoiceList.map(inv => (
              <tr key={inv.id}>
                <td style={{ fontSize: 13, color: 'var(--color-muted)' }}>{inv.date}</td>
                <td>
                  <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700 }}>{inv.id}</span>
                </td>
                <td style={{ fontSize: 13 }}>{inv.description}</td>
                <td style={{ fontSize: 14, fontWeight: 700 }}>€{inv.amount.toFixed(2)}</td>
                <td><Badge variant={inv.status === 'Paid' ? 'completed' : 'pending'}>{inv.status}</Badge></td>
                <td>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <button className="btn btn-ghost btn-icon" title="Download"><Download size={14} /></button>
                    {inv.status === 'Pending' && (
                      <button className="btn btn-dark btn-sm btn-pill" onClick={() => setPaying(inv)}>
                        Pay Now
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Settings section */}
      <div className="section-title" style={{ marginBottom: 12 }}>Settings</div>
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: 13 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
              Company
            </div>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>Amazon DSP DE</div>
            <div style={{ color: 'var(--color-muted)' }}>billing@amazon-dsp-de.com</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
              Payment Method
            </div>
            <div style={{ fontWeight: 600, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CreditCard size={14} /> Visa ending 4242
            </div>
            <div style={{ color: 'var(--color-muted)' }}>Expires 09/2028</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
              Billing Address
            </div>
            <div style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>
              Logistikstr. 14, 80339 Munich, Germany
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>
              VAT Number
            </div>
            <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>DE 123 456 789</div>
          </div>
        </div>
      </div>

      {paying && (
        <Modal title={`Pay ${paying.id}`} onClose={handlePayClose}>
          <PayModal invoice={paying} onClose={handlePayClose} />
        </Modal>
      )}
    </div>
  )
}
