import { useState } from 'react'
import { Building2, Eye, X, AlertTriangle, Check } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import Modal from '../../../components/Modal'
import { perksEmployers, perksEmployees, perksDeals } from '../../../data'

const EMPLOYER_META = {
  1: { plan: 'Perks Pro',     billing: 'paid',    fee: 249, contact: 'travel@globalia.com',    since: '01 Jan 2026' },
  2: { plan: 'Perks Starter', billing: 'pending', fee:  99, contact: 'partners@mediamarkt.de', since: '15 Feb 2026' },
  3: { plan: 'Perks Starter', billing: 'paid',    fee:  99, contact: 'business@mango.com',     since: '01 Mar 2026' },
}

const EMPLOYER_INVOICES = {
  1: [
    { id: 'EMP-001-006', date: '01 Jun 2026', amount: 249, status: 'paid'    },
    { id: 'EMP-001-005', date: '01 May 2026', amount: 249, status: 'paid'    },
  ],
  2: [
    { id: 'EMP-002-006', date: '01 Jun 2026', amount: 99,  status: 'pending' },
    { id: 'EMP-002-005', date: '01 May 2026', amount: 99,  status: 'paid'    },
  ],
  3: [
    { id: 'EMP-003-006', date: '01 Jun 2026', amount: 99,  status: 'paid'    },
    { id: 'EMP-003-005', date: '01 May 2026', amount: 99,  status: 'paid'    },
  ],
}

function SuspendModal({ name, onConfirm, onClose }) {
  return (
    <>
      <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
        Suspending <strong>{name}</strong> will deactivate their account and hide all their deals from employees.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="btn btn-dark"
          style={{ background: 'var(--color-primary)', flex: 1 }}
          onClick={onConfirm}
        >
          Suspend Account
        </button>
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
      </div>
    </>
  )
}

export default function Employers() {
  const [employers, setEmployers] = useState(perksEmployers.map(e => ({ ...e })))
  const [panel, setPanel]         = useState(null)
  const [suspending, setSuspend]  = useState(null)

  const handleSuspend = (id) => {
    setEmployers(prev => prev.map(e => e.id === id ? { ...e, status: 'suspended' } : e))
    if (panel?.id === id) setPanel(null)
    setSuspend(null)
  }

  const getEmployeeCount = (employerName) => {
    const dealTitles = perksDeals
      .filter(d => d.employer === employerName)
      .map(d => d.title)
    return perksEmployees.filter(e => e.activeDeal && dealTitles.includes(e.activeDeal)).length
  }

  const statusVariant = (s) => s === 'active' ? 'active' : 'archived'
  const billingVariant = (b) => b === 'paid' ? 'completed' : 'pending'

  return (
    <div className="page-body">
      <PageHeader title="Employer Management" icon={<Building2 size={18} />} banner />

      <div style={{ display: 'grid', gridTemplateColumns: panel ? '1fr 360px' : '1fr', gap: 20, alignItems: 'start' }}>
        {/* Table */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Employees</th>
                <th>Plan</th>
                <th>Billing Status</th>
                <th>Monthly Fee</th>
                <th>Account</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employers.map(emp => {
                const meta = EMPLOYER_META[emp.id] || {}
                const empCount = getEmployeeCount(emp.name)
                return (
                  <tr key={emp.id} style={{ background: panel?.id === emp.id ? 'var(--color-bg)' : '' }}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{emp.category}</div>
                    </td>
                    <td style={{ fontSize: 13 }}>{empCount}</td>
                    <td style={{ fontSize: 13 }}>{meta.plan}</td>
                    <td>
                      <Badge variant={billingVariant(meta.billing)}>
                        {meta.billing === 'paid' ? 'Paid' : 'Pending'}
                      </Badge>
                    </td>
                    <td style={{ fontSize: 13, fontWeight: 700 }}>€{meta.fee}/mo</td>
                    <td><Badge variant={statusVariant(emp.status)}>{emp.status === 'active' ? 'Active' : 'Suspended'}</Badge></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button
                          className={`btn btn-ghost btn-icon${panel?.id === emp.id ? ' smp-btn-active' : ''}`}
                          title="View"
                          onClick={() => setPanel(p => p?.id === emp.id ? null : { ...emp, meta, empCount })}
                        >
                          <Eye size={14} />
                        </button>
                        {emp.status === 'active' && (
                          <button
                            className="action-btn muted"
                            style={{ fontSize: 11 }}
                            onClick={() => setSuspend(emp)}
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Side panel */}
        {panel && (
          <div className="card" style={{ position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{panel.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{panel.category}</div>
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setPanel(null)}>
                <X size={14} />
              </button>
            </div>

            {/* Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', fontSize: 12, marginBottom: 16 }}>
              {[
                ['Plan',        panel.meta.plan],
                ['Monthly Fee', `€${panel.meta.fee}/mo`],
                ['Contact',     panel.meta.contact],
                ['Member Since', panel.meta.since],
                ['Deals',       `${panel.deals} active`],
                ['Users',       `${panel.empCount} employees`],
              ].map(([label, val]) => (
                <div key={label}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontWeight: 500 }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Deals list */}
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Deals
            </div>
            {perksDeals.filter(d => d.employer === panel.name).map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: 12 }}>
                <span style={{ fontWeight: 500 }}>{d.title}</span>
                <Badge variant={d.status === 'active' ? 'active' : 'archived'}>
                  {d.status === 'active' ? 'Active' : 'Expired'}
                </Badge>
              </div>
            ))}

            {/* Invoices */}
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 16, marginBottom: 8 }}>
              Recent Invoices
            </div>
            {(EMPLOYER_INVOICES[panel.id] || []).map(inv => (
              <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: 12 }}>
                <div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 11 }}>{inv.id}</div>
                  <div style={{ color: 'var(--color-muted)', fontSize: 11 }}>{inv.date}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 700 }}>€{inv.amount}</span>
                  <Badge variant={inv.status === 'paid' ? 'completed' : 'pending'}>
                    {inv.status === 'paid' ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {suspending && (
        <Modal title="Suspend Employer" onClose={() => setSuspend(null)}>
          <SuspendModal
            name={suspending.name}
            onConfirm={() => handleSuspend(suspending.id)}
            onClose={() => setSuspend(null)}
          />
        </Modal>
      )}
    </div>
  )
}
