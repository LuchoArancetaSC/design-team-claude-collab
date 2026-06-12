import { useState } from 'react'
import { Briefcase, X } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import { jobsListings, jobsCompanies } from '../../../data'

const statusVariant = s => s === 'active' ? 'active' : s === 'paused' ? 'pending' : 'archived'
const cap = s => s.charAt(0).toUpperCase() + s.slice(1)

export default function AllJobs() {
  const [companyFilter, setCompanyFilter] = useState('')
  const [statusFilter,  setStatusFilter]  = useState('')
  const [vehicleFilter, setVehicleFilter] = useState('')
  const [panel, setPanel] = useState(null)

  const list = jobsListings.filter(j => {
    if (companyFilter && String(j.company_id) !== companyFilter) return false
    if (statusFilter  && j.status             !== statusFilter)  return false
    if (vehicleFilter && j.vehicle_required   !== vehicleFilter) return false
    return true
  })

  const selectedJob     = panel ? jobsListings.find(j => j.id === panel) : null
  const selectedCompany = selectedJob ? jobsCompanies.find(c => c.id === selectedJob.company_id) : null

  return (
    <div className="page-body">
      <PageHeader title="All Jobs" icon={<Briefcase size={18} color="white" />} banner />

      <div style={{ marginBottom: 20 }}>
        <div className="page-title">All Jobs</div>
        <div className="page-subtitle">All active, paused, and draft listings across all clients.</div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <select className="input select" style={{ fontSize: 12, width: 'auto' }} value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}>
          <option value="">All Companies</option>
          {jobsCompanies.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
        </select>
        <select className="input select" style={{ fontSize: 12, width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="draft">Draft</option>
        </select>
        <select className="input select" style={{ fontSize: 12, width: 'auto' }} value={vehicleFilter} onChange={e => setVehicleFilter(e.target.value)}>
          <option value="">All Vehicles</option>
          <option value="Van">Van</option>
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: panel ? '1fr 360px' : '1fr', gap: 20 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Vehicle</th>
                <th>Spots</th>
                <th>Status</th>
                <th>Applications</th>
                <th>Plan</th>
              </tr>
            </thead>
            <tbody>
              {list.map(job => {
                const company = jobsCompanies.find(c => c.id === job.company_id)
                return (
                  <tr
                    key={job.id}
                    style={{ cursor: 'pointer', background: panel === job.id ? 'var(--color-bg)' : undefined }}
                    onClick={() => setPanel(p => p === job.id ? null : job.id)}
                  >
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{job.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{job.contract_type}</div>
                    </td>
                    <td style={{ fontSize: 13 }}>{company?.name ?? '—'}</td>
                    <td style={{ fontSize: 13 }}>{job.location}</td>
                    <td style={{ fontSize: 13 }}>{job.vehicle_required}</td>
                    <td style={{ fontSize: 13, fontWeight: 700, color: job.spots_left <= 2 ? 'var(--color-primary)' : 'var(--color-text)' }}>{job.spots_left}</td>
                    <td><Badge variant={statusVariant(job.status)}>{cap(job.status)}</Badge></td>
                    <td style={{ fontSize: 13 }}>{job.applications_count}</td>
                    <td>
                      <span style={{ fontSize: 12, fontWeight: 700, background: job.plan === 'PRO' ? '#032F4F' : '#f4f4f5', color: job.plan === 'PRO' ? 'white' : 'var(--color-text)', padding: '2px 8px', borderRadius: 6 }}>
                        {job.plan}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {selectedJob && (
          <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Job Summary</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setPanel(null)}><X size={14} /></button>
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{selectedJob.title}</div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 16 }}>{selectedCompany?.name} · {selectedJob.location}</div>

            {[
              ['Status',       <Badge variant={statusVariant(selectedJob.status)}>{cap(selectedJob.status)}</Badge>],
              ['Vehicle',      selectedJob.vehicle_required],
              ['Contract',     selectedJob.contract_type],
              ['Commitment',   selectedJob.commitment],
              ['Salary',       `£${selectedJob.salary_range[0]}–£${selectedJob.salary_range[1]} / ${selectedJob.salary_period}`],
              ['Spots Left',   selectedJob.spots_left],
              ['Applications', selectedJob.applications_count],
              ['Views',        selectedJob.views],
              ['Plan',         selectedJob.plan],
              ['Posted',       selectedJob.posted_date],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--color-border)', fontSize: 12 }}>
                <span style={{ color: 'var(--color-muted)' }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{val}</span>
              </div>
            ))}

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Highlights</div>
              {selectedJob.highlights.map(h => (
                <div key={h} style={{ fontSize: 12, padding: '3px 0' }}>• {h}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
