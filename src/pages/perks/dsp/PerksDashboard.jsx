import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gift, Users, Tag, Building2, Check, ArrowRight, Download } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import { perksDeals, perksEmployees, perksEmployers } from '../../../data'

const PENDING_INVOICES = [
  { id: 'PRK-2026-011', description: 'Subscription – May 2026', amount: 249.00 },
  { id: 'PRK-2026-008', description: 'Subscription – Apr 2026', amount: 249.00 },
]

const DEAL_REDEMPTIONS = { 1: 18, 2: 11, 3: 7, 4: 22, 5: 14, 6: 9 }

export default function PerksDashboard() {
  const navigate = useNavigate()
  const activeEmployees = perksEmployees.filter(e => e.status === 'active').length
  const activePartners  = perksEmployers.length

  return (
    <div className="page-body">
      <PageHeader title="Benefit Suite" icon={<Gift size={18} />} banner />

      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Welcome to Perks!</div>
        <div className="page-subtitle">Manage your employee benefits and partner deals.</div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card dark">
          <div className="stat-label">Account Balance</div>
          <div className="stat-value">€2,450.00</div>
          <div className="stat-credit-badge">
            <Check size={11} strokeWidth={3} /> Available Credit
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Active Employees</div>
              <div className="stat-value">{activeEmployees}</div>
            </div>
            <div className="stat-icon green">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Deals Used This Month</div>
              <div className="stat-value">81</div>
            </div>
            <div className="stat-icon blue">
              <Tag size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Active Partners</div>
              <div className="stat-value">{activePartners}</div>
            </div>
            <div className="stat-icon" style={{ background: '#fdf4ff', color: '#a855f7' }}>
              <Building2 size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="bottom-grid">
        {/* Active Deals table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
          <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--color-border)' }}>
            <div className="section-title">Active Deals</div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>All currently active partner offers</div>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Category</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Redemptions</th>
              </tr>
            </thead>
            <tbody>
              {perksDeals.map(d => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{d.employer}</td>
                  <td style={{ fontSize: 12, color: 'var(--color-muted)' }}>{d.category}</td>
                  <td style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-dark)' }}>
                    {d.discount}{typeof d.discount === 'number' && d.discount < 100 ? '%' : ''}
                    {typeof d.discount === 'number' && d.discount >= 50 ? '' : ' off'}
                  </td>
                  <td><Badge variant="active">Active</Badge></td>
                  <td style={{ fontSize: 13 }}>{DEAL_REDEMPTIONS[d.id] ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pending Invoices */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 2 }}>Pending Invoices</div>
          <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 12 }}>Outstanding payments</div>

          {PENDING_INVOICES.map(inv => (
            <div key={inv.id} className="pending-invoice-row">
              <div>
                <div className="pending-invoice-id">{inv.id}</div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>{inv.description}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="pending-invoice-amount">€{inv.amount.toFixed(2)}</div>
                <button className="pay-link" onClick={() => navigate('/perks/billing')}>
                  Pay now <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}

          <div style={{ borderTop: '1px solid #e4e4e7', marginTop: 4 }} />
          <button
            onClick={() => navigate('/perks/billing')}
            style={{
              display: 'block', width: '100%', marginTop: 10,
              padding: '10px', textAlign: 'center', fontSize: 13,
              fontWeight: 500, color: '#09090b', background: '#f4f4f5',
              border: 'none', borderRadius: 6, cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif', transition: 'background 0.13s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e4e4e7'}
            onMouseLeave={e => e.currentTarget.style.background = '#f4f4f5'}
          >
            View all invoices <ArrowRight size={12} style={{ verticalAlign: 'middle', marginLeft: 2 }} />
          </button>
        </div>
      </div>
    </div>
  )
}
