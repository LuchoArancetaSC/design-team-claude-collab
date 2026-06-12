import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Download, ArrowRight } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import { jobsBilling, jobsCompanies } from '../../../data'

const COMPANY_ID     = 1
const company        = jobsCompanies.find(c => c.id === COMPANY_ID)
const billingVariant = s => ({ Charged: 'completed', Overdue: 'overdue', Included: 'inprogress' }[s] ?? 'draft')

export default function JobsBilling() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('')

  const list    = filter ? jobsBilling.filter(i => i.status === filter) : jobsBilling
  const paid    = jobsBilling.filter(i => i.status === 'Charged').reduce((a, b) => a + b.amount, 0)
  const overdue = jobsBilling.filter(i => i.status === 'Overdue').reduce((a, b)  => a + b.amount, 0)

  return (
    <div className="page-body">
      <PageHeader title="Billing &amp; Invoices" icon={<CreditCard size={18} />} banner />

      {/* Top bar */}
      <div className="page-top-bar" style={{ marginBottom: 20 }}>
        <div>
          <div className="page-title">Billing &amp; Invoices</div>
          <div className="page-subtitle">Track charges and manage your payment history.</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="credit-widget">
            <div className="credit-widget-label">Available Credit</div>
            <div className="credit-widget-amount">£{company?.account_balance?.toFixed(2)}</div>
            <div className="credit-widget-sub">{company?.name}</div>
          </div>
          <button
            className="btn btn-outline btn-sm"
            style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
            onClick={() => navigate('/jobs/billing/plans')}
          >
            View Plans <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[['', 'All'], ['Charged', 'Charged'], ['Overdue', 'Overdue'], ['Included', 'Included']].map(([val, label]) => (
          <button
            key={val}
            className={`action-btn${filter === val ? ' smp-btn-active' : ''}`}
            style={{ fontSize: 12 }}
            onClick={() => setFilter(val)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Details</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(inv => (
              <tr key={inv.id}>
                <td><span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700 }}>{inv.id}</span></td>
                <td>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>
                    {inv.type === 'hired'   ? `Hire – ${inv.driver_name}` :
                     inv.type === 'reveal'  ? `Reveal – ${inv.driver_name}` :
                     `Plan Renewal – ${inv.plan}`}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>
                    {inv.commitment} · {inv.vehicle_type} · {inv.city}
                  </div>
                </td>
                <td style={{ fontSize: 12, color: 'var(--color-muted)' }}>{inv.date}</td>
                <td style={{ fontWeight: 700, fontSize: 14 }}>
                  {inv.amount === 0
                    ? <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>—</span>
                    : `£${inv.amount.toFixed(2)}`
                  }
                </td>
                <td><Badge variant={billingVariant(inv.status)}>{inv.status}</Badge></td>
                <td>
                  <button className="btn btn-ghost btn-icon" title="Download"><Download size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <div className="card" style={{ minWidth: 280 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
            <span style={{ color: 'var(--color-muted)' }}>Total Paid</span>
            <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>£{paid.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--color-border)', fontSize: 14 }}>
            <span style={{ fontWeight: 700 }}>Total Overdue</span>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>£{overdue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
