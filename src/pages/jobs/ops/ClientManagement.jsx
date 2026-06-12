import { useState } from 'react'
import { Building2, X } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import Modal from '../../../components/Modal'
import { jobsCompanies, jobsListings, jobsCandidates, jobsBilling } from '../../../data'

const billingVariant = s => ({ Charged: 'completed', Overdue: 'overdue', Included: 'inprogress' }[s] ?? 'draft')

export default function ClientManagement() {
  const [panel,         setPanel]         = useState(null)
  const [suspended,     setSuspended]     = useState([])
  const [suspendTarget, setSuspendTarget] = useState(null)

  const selectedCompany    = panel ? jobsCompanies.find(c => c.id === panel) : null
  const companyJobs        = panel ? jobsListings.filter(j => j.company_id === panel) : []
  const companyCandidates  = panel ? jobsCandidates.filter(c => c.company_id === panel) : []
  const companyHired       = companyCandidates.filter(c => c.funnel_stage === 'hired').length
  const companyCities      = companyJobs.map(j => j.location.split(',')[0].trim())
  const companyInvoices    = panel ? jobsBilling.filter(inv => companyCities.includes(inv.city)) : []

  const isSuspended = id => suspended.includes(id)

  const handleSuspendConfirm = () => {
    setSuspended(s => s.includes(suspendTarget) ? s.filter(x => x !== suspendTarget) : [...s, suspendTarget])
    setSuspendTarget(null)
  }

  return (
    <div className="page-body">
      <PageHeader title="Client Management" icon={<Building2 size={18} color="white" />} banner />

      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Client Management</div>
        <div className="page-subtitle">Manage DSP client accounts, plans, and billing status.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: panel ? '1fr 380px' : '1fr', gap: 20 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Plan</th>
                <th>Commitment</th>
                <th>Active Jobs</th>
                <th>Candidates</th>
                <th>Hired</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobsCompanies.map(c => {
                const candidates = jobsCandidates.filter(cd => cd.company_id === c.id)
                const hired      = candidates.filter(cd => cd.funnel_stage === 'hired').length
                const susp       = isSuspended(c.id)
                return (
                  <tr
                    key={c.id}
                    style={{ cursor: 'pointer', background: panel === c.id ? 'var(--color-bg)' : undefined }}
                    onClick={() => setPanel(p => p === c.id ? null : c.id)}
                  >
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{c.location}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, fontWeight: 700, background: c.plan === 'PRO' ? '#032F4F' : '#f4f4f5', color: c.plan === 'PRO' ? 'white' : 'var(--color-text)', padding: '2px 8px', borderRadius: 6 }}>
                        {c.plan}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>{c.commitment}</td>
                    <td style={{ fontSize: 13 }}>{c.active_jobs}</td>
                    <td style={{ fontSize: 13 }}>{candidates.length}</td>
                    <td style={{ fontSize: 13, fontWeight: 700 }}>{hired}</td>
                    <td><Badge variant={susp ? 'archived' : 'active'}>{susp ? 'Suspended' : 'Active'}</Badge></td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }} onClick={() => setPanel(p => p === c.id ? null : c.id)}>
                          View
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: 11 }}
                          onClick={() => setSuspendTarget(c.id)}
                        >
                          {susp ? 'Reinstate' : 'Suspend'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {selectedCompany && (
          <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Client Summary</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setPanel(null)}><X size={14} /></button>
            </div>

            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{selectedCompany.name}</div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 16 }}>{selectedCompany.location}</div>

            {[
              ['Plan',         selectedCompany.plan],
              ['Commitment',   selectedCompany.commitment],
              ['Vehicle Type', selectedCompany.vehicle_type],
              ['Active Jobs',  selectedCompany.active_jobs],
              ['Candidates',   companyCandidates.length],
              ['Hired',        companyHired],
              ['Balance',      `£${selectedCompany.account_balance?.toFixed(2)}`],
              ['Renews',       selectedCompany.plan_renewal_date],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--color-border)', fontSize: 12 }}>
                <span style={{ color: 'var(--color-muted)' }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{val}</span>
              </div>
            ))}

            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                Recent Invoices
              </div>
              {companyInvoices.length === 0
                ? <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>No invoices found.</div>
                : companyInvoices.map(inv => (
                    <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: 12 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 11 }}>{inv.id}</div>
                        <div style={{ color: 'var(--color-muted)', fontSize: 11 }}>{inv.date}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, marginBottom: 2 }}>{inv.amount === 0 ? '—' : `£${inv.amount.toFixed(2)}`}</div>
                        <Badge variant={billingVariant(inv.status)}>{inv.status}</Badge>
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>
        )}
      </div>

      {suspendTarget !== null && (
        <Modal
          title={isSuspended(suspendTarget) ? 'Reinstate Client' : 'Suspend Client'}
          onClose={() => setSuspendTarget(null)}
        >
          <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            {isSuspended(suspendTarget)
              ? `Reinstate ${jobsCompanies.find(c => c.id === suspendTarget)?.name}? They will regain full platform access.`
              : `Suspend ${jobsCompanies.find(c => c.id === suspendTarget)?.name}? They will lose access to the platform immediately.`
            }
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-dark" style={{ flex: 1 }} onClick={handleSuspendConfirm}>Confirm</button>
            <button className="btn btn-outline" onClick={() => setSuspendTarget(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
