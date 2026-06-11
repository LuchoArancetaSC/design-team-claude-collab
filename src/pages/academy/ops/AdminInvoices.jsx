import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText, Download, ChevronsUpDown, Building2, ExternalLink,
} from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import { invoices } from '../../../data'

const MONTHS = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 }
function parseDMY(str) {
  const [d, m, y] = str.split(' ')
  return new Date(Number(y), MONTHS[m], Number(d))
}

const ORG_OPTIONS = [
  'Amazon DSP Alemania',
  'DHL Express DE',
  'Correos Express ES',
]

const CLIENT_COLORS = {
  'DSP / Courier':   { bg: '#09090b', color: '#fff' },
  'DHL Express':     { bg: '#FFCC00', color: '#09090b' },
  'Correos Express': { bg: '#f97316', color: '#fff' },
}

function OrgChip({ name, client }) {
  const meta = CLIENT_COLORS[client] || { bg: '#71717a', color: '#fff' }
  const initials = client?.slice(0, 3).toUpperCase() || name?.slice(0, 3).toUpperCase()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 26, height: 26, borderRadius: 6, flexShrink: 0,
        background: meta.bg, color: meta.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 800, letterSpacing: '0.02em',
      }}>
        {initials}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{client}</div>
      </div>
    </div>
  )
}

export default function AdminInvoices() {
  const navigate = useNavigate()
  const [filterStatus, setFilterStatus] = useState('')
  const [filterOrg,    setFilterOrg]    = useState('')
  const [filterFrom,   setFilterFrom]   = useState('')
  const [filterTo,     setFilterTo]     = useState('')

  const filtersActive = filterStatus || filterOrg || filterFrom || filterTo

  const filtered = invoices.filter(inv => {
    if (filterStatus && inv.status !== filterStatus) return false
    if (filterOrg    && inv.org    !== filterOrg)    return false
    if (filterFrom || filterTo) {
      const due = parseDMY(inv.dueDate)
      if (filterFrom && due < new Date(filterFrom)) return false
      if (filterTo   && due > new Date(filterTo))   return false
    }
    return true
  })

  const totalPaid       = filtered.filter(i => i.status === 'Paid').reduce((a, b) => a + b.amount, 0)
  const totalPending    = filtered.filter(i => i.status === 'Pending').reduce((a, b) => a + b.amount, 0)
  const totalOverdue    = filtered.filter(i => i.status === 'Overdue').reduce((a, b) => a + b.amount, 0)
  const totalAll        = filtered.reduce((a, b) => a + b.amount, 0)

  return (
    <div className="page-body">
      <PageHeader title="Invoices" icon={<FileText size={18} color="white" />} banner />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <div className="page-title">Invoices</div>
          <div className="page-subtitle">Global billing overview across all sub-orgs and clients.</div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total Billed',   value: totalAll,     color: 'var(--color-text)',        bg: 'white'                     },
          { label: 'Paid',           value: totalPaid,    color: 'var(--color-success)',     bg: 'rgba(5,150,105,0.05)'      },
          { label: 'Pending',        value: totalPending, color: 'var(--color-warning)',     bg: 'rgba(217,119,6,0.05)'      },
          { label: 'Overdue',        value: totalOverdue, color: 'var(--color-primary)',     bg: 'rgba(255,75,75,0.05)'      },
        ].map(card => (
          <div
            key={card.label}
            className="card"
            style={{ padding: '16px 20px', background: card.bg, border: '1px solid var(--color-border)' }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', letterSpacing: '0.04em', marginBottom: 6 }}>
              {card.label.toUpperCase()}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: card.color, fontFamily: "'Poppins', sans-serif" }}>
              €{card.value.toFixed(2)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>
              {filtered.filter(i =>
                card.label === 'Total Billed' ? true :
                card.label === 'Paid' ? i.status === 'Paid' :
                card.label === 'Pending' ? i.status === 'Pending' :
                i.status === 'Overdue'
              ).length} invoices
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
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
          <div className="filter-field-label">Sub-Org / Company</div>
          <select
            className={`filter-control${filterOrg ? ' active' : ''}`}
            value={filterOrg}
            onChange={e => setFilterOrg(e.target.value)}
          >
            <option value="">All</option>
            {ORG_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div>
          <div className="filter-field-label">Date Range (due)</div>
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
          <button
            className="filter-clear"
            onClick={() => { setFilterStatus(''); setFilterOrg(''); setFilterFrom(''); setFilterTo('') }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th><span className="th-sortable">Sub-Org <ChevronsUpDown size={12} color="var(--color-muted)" /></span></th>
              <th>Details</th>
              <th>Learners</th>
              <th><span className="th-sortable">Due Date <ChevronsUpDown size={12} color="var(--color-muted)" /></span></th>
              <th><span className="th-sortable">Amount <ChevronsUpDown size={12} color="var(--color-muted)" /></span></th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '32px 16px', fontSize: 13 }}>
                  No invoices match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map(inv => (
                <tr key={inv.id}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>{inv.id}</span>
                  </td>
                  <td>
                    <OrgChip name={inv.org} client={inv.client} />
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
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-icon" title="Download PDF">
                        <Download size={14} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon"
                        title="Go to sub-org"
                        onClick={() => navigate('/academy/admin/tenants/1')}
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
