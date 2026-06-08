import { useState } from 'react'
import { FileText, Download, CreditCard, Landmark, CheckCircle2, Check, ChevronsUpDown } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import Modal from '../components/Modal'
import { invoices } from '../data'

const CLIENT_META = {
  'DSP / Courier':   { initials: 'DSP', bg: '#09090b', color: '#fff' },
  'DHL Express':     { initials: 'DHL', bg: '#FFCC00', color: '#09090b' },
  'Correos Express': { initials: 'COR', bg: '#f97316', color: '#fff' },
  'MRW':             { initials: 'MRW', bg: '#3b82f6', color: '#fff' },
}

const MONTHS = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 }

function parseDMY(str) {
  const [d, m, y] = str.split(' ')
  return new Date(Number(y), MONTHS[m], Number(d))
}

function ClientCell({ name }) {
  const meta = CLIENT_META[name] || { initials: name.slice(0, 3).toUpperCase(), bg: '#71717a', color: '#fff' }
  return (
    <div className="client-chip">
      <div className="client-logo" style={{ background: meta.bg, color: meta.color }}>
        {meta.initials}
      </div>
      <span style={{ fontSize: 13 }}>{name}</span>
    </div>
  )
}

/* ── Pay Modal ─────────────────────────────────────────────────────── */
function PayModal({ invoice, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState('credit')
  const [success, setSuccess] = useState(false)

  if (success) {
    return (
      <div className="success-screen">
        <div className="success-icon"><CheckCircle2 size={28} /></div>
        <div className="success-title">Payment Successful!</div>
        <div className="success-subtitle">
          Invoice <strong>{invoice.id}</strong> has been paid.<br />
          Amount charged: <strong>€{invoice.amount.toFixed(2)}</strong>
        </div>
        <button className="btn btn-dark btn-lg" onClick={onClose} style={{ marginTop: 8 }}>
          Done
        </button>
      </div>
    )
  }

  return (
    <>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 8 }}>
        Invoice Summary
      </div>
      <div className="invoice-summary">
        <div className="invoice-summary-row">
          <span style={{ color: 'var(--color-muted)' }}>Invoice ID</span>
          <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 13 }}>{invoice.id}</span>
        </div>
        <div className="invoice-summary-row">
          <span style={{ color: 'var(--color-muted)' }}>Session</span>
          <span style={{ fontWeight: 500 }}>{invoice.session}</span>
        </div>
        <div className="invoice-summary-row">
          <span style={{ color: 'var(--color-muted)' }}>Details</span>
          <span style={{ fontWeight: 500 }}>{invoice.details}</span>
        </div>
        <div className="invoice-summary-row">
          <span style={{ color: 'var(--color-muted)' }}>Learners</span>
          <span style={{ fontWeight: 500 }}>{invoice.learners}</span>
        </div>
        <div className="invoice-summary-row">
          <span style={{ color: 'var(--color-muted)' }}>Due Date</span>
          <span style={{ fontWeight: 500 }}>{invoice.dueDate}</span>
        </div>
        <div className="invoice-summary-row total">
          <span>Total Due</span>
          <span style={{ color: invoice.status === 'Overdue' ? 'var(--color-primary)' : 'var(--color-text)' }}>
            €{invoice.amount.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 20 }}>
        <div className="form-label" style={{ marginBottom: 10 }}>Payment Method</div>
        <div className="payment-methods">
          {[
            { id: 'credit', label: 'Credit Card', sub: 'Visa / Mastercard', Icon: CreditCard },
            { id: 'bank',   label: 'Bank Transfer', sub: 'SEPA Transfer',   Icon: Landmark },
          ].map(pm => (
            <div
              key={pm.id}
              className={`payment-method-card${paymentMethod === pm.id ? ' selected' : ''}`}
              onClick={() => setPaymentMethod(pm.id)}
            >
              <pm.Icon size={22} color={paymentMethod === pm.id ? 'var(--color-dark)' : 'var(--color-muted)'} />
              <div style={{ fontSize: 13, fontWeight: 600 }}>{pm.label}</div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{pm.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn btn-dark btn-lg"
        style={{ width: '100%' }}
        onClick={() => setSuccess(true)}
      >
        <Check size={15} strokeWidth={2.5} /> Confirm & Pay €{invoice.amount.toFixed(2)}
      </button>
    </>
  )
}

/* ── Invoices page ─────────────────────────────────────────────────── */
export default function Invoices() {
  const [invoiceList, setInvoiceList] = useState(invoices)
  const [payingInvoice, setPayingInvoice] = useState(null)

  const [filterStatus, setFilterStatus] = useState('')
  const [filterClient, setFilterClient] = useState('')
  const [filterFrom,   setFilterFrom]   = useState('')
  const [filterTo,     setFilterTo]     = useState('')

  const filtersActive = filterStatus || filterClient || filterFrom || filterTo

  const filteredList = invoiceList.filter(inv => {
    if (filterStatus && inv.status !== filterStatus) return false
    if (filterClient && inv.client !== filterClient) return false
    if (filterFrom || filterTo) {
      const due = parseDMY(inv.dueDate)
      if (filterFrom && due < new Date(filterFrom)) return false
      if (filterTo   && due > new Date(filterTo))   return false
    }
    return true
  })

  const handlePayClose = () => {
    if (payingInvoice) {
      setInvoiceList(prev =>
        prev.map(inv => inv.id === payingInvoice.id ? { ...inv, status: 'Paid' } : inv)
      )
    }
    setPayingInvoice(null)
  }

  const clearFilters = () => {
    setFilterStatus('')
    setFilterClient('')
    setFilterFrom('')
    setFilterTo('')
  }

  const paid        = filteredList.filter(i => i.status === 'Paid').reduce((a, b) => a + b.amount, 0)
  const pending     = filteredList.filter(i => i.status === 'Pending').reduce((a, b) => a + b.amount, 0)
  const outstanding = filteredList.filter(i => i.status !== 'Paid').reduce((a, b) => a + b.amount, 0)

  return (
    <div className="page-body">
      <PageHeader title="Billing & Invoices" icon={<FileText size={18} color="white" />} banner />

      <div className="page-top-bar">
        <div>
          <div className="page-title">Billing & Invoices</div>
          <div className="page-subtitle">Track your payments and manage outstanding invoices.</div>
        </div>
        <div className="credit-widget">
          <div className="credit-widget-label">Available Credit</div>
          <div className="credit-widget-amount">€3,530.00</div>
          <div className="credit-widget-sub">DSP Account</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div>
          <div className="filter-field-label">Status</div>
          <select
            className={`filter-control${filterStatus ? ' active' : ''}`}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div>
          <div className="filter-field-label">DSP / Client</div>
          <select
            className={`filter-control${filterClient ? ' active' : ''}`}
            value={filterClient}
            onChange={e => setFilterClient(e.target.value)}
          >
            <option value="">All Clients</option>
            <option value="DSP / Courier">DSP / Courier</option>
          </select>
        </div>

        <div>
          <div className="filter-field-label">Date Range</div>
          <div className="filter-date-group">
            <input
              type="date"
              className={`filter-control${filterFrom ? ' active' : ''}`}
              value={filterFrom}
              onChange={e => setFilterFrom(e.target.value)}
              style={{ width: 140 }}
            />
            <span style={{ fontSize: 12, color: '#71717a' }}>to</span>
            <input
              type="date"
              className={`filter-control${filterTo ? ' active' : ''}`}
              value={filterTo}
              onChange={e => setFilterTo(e.target.value)}
              style={{ width: 140 }}
            />
          </div>
        </div>

        {filtersActive && (
          <button className="filter-clear" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th><span className="th-sortable">DSP / Client <ChevronsUpDown size={12} color="var(--color-muted)" /></span></th>
              <th>Details</th>
              <th>Learners</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '32px 16px', fontSize: 13 }}>
                  No invoices match the current filters.
                </td>
              </tr>
            ) : (
              filteredList.map(inv => (
                <tr key={inv.id}>
                  <td>
                    <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 12 }}>{inv.id}</span>
                  </td>
                  <td>
                    <ClientCell name={inv.client} />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{inv.details}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>{inv.session}</div>
                  </td>
                  <td><span style={{ fontSize: 13 }}>{inv.learners} learners</span></td>
                  <td>
                    <span style={{ fontSize: 13, color: inv.status === 'Overdue' ? 'var(--color-primary)' : 'var(--color-text)' }}>
                      {inv.dueDate}
                    </span>
                  </td>
                  <td><span style={{ fontSize: 14, fontWeight: 700 }}>€{inv.amount.toFixed(2)}</span></td>
                  <td><Badge variant={inv.status}>{inv.status}</Badge></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button className="btn btn-ghost btn-icon" title="Download">
                        <Download size={14} />
                      </button>
                      {(inv.status === 'Pending' || inv.status === 'Overdue') && (
                        <button className="btn btn-dark btn-sm btn-pill" onClick={() => setPayingInvoice(inv)}>
                          Pay Now
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary card */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <div className="card" style={{ minWidth: 280 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--color-muted)' }}>Total Paid</span>
            <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>€{paid.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: 'var(--color-muted)' }}>Total Pending</span>
            <span style={{ fontWeight: 600, color: 'var(--color-warning)' }}>€{pending.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--color-border)', fontSize: 14 }}>
            <span style={{ fontWeight: 700 }}>Total Outstanding</span>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>€{outstanding.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {payingInvoice && (
        <Modal title={`Pay ${payingInvoice.id}`} onClose={handlePayClose}>
          <PayModal invoice={payingInvoice} onClose={handlePayClose} />
        </Modal>
      )}
    </div>
  )
}
