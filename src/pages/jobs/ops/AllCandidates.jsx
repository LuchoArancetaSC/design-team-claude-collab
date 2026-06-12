import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import { jobsCandidates, jobsListings, jobsCompanies } from '../../../data'

const stageVariant  = s => ({ raw: 'draft', activated: 'pending', delivered: 'assigned', hired: 'confirmed' }[s] ?? 'draft')
const stageLabel    = s => ({ raw: 'New Lead', activated: 'Activated', delivered: 'Delivered', hired: 'Hired' }[s] ?? s)
const verifyVariant = s => ({ verified: 'active', pending: 'pending', rejected: 'overdue' }[s] ?? 'draft')

export default function AllCandidates() {
  const navigate = useNavigate()
  const [companyFilter, setCompanyFilter] = useState('')
  const [stageFilter,   setStageFilter]   = useState('')
  const [kycFilter,     setKycFilter]     = useState('')

  const list = jobsCandidates.filter(c => {
    if (companyFilter && String(c.company_id) !== companyFilter) return false
    if (stageFilter   && c.funnel_stage !== stageFilter)         return false
    if (kycFilter     && c.kyc_status   !== kycFilter)           return false
    return true
  })

  return (
    <div className="page-body">
      <PageHeader title="All Candidates" icon={<Users size={18} color="white" />} banner />

      <div style={{ marginBottom: 20 }}>
        <div className="page-title">All Candidates</div>
        <div className="page-subtitle">Full pipeline view across all companies.</div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <select className="input select" style={{ fontSize: 12, width: 'auto' }} value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}>
          <option value="">All Companies</option>
          {jobsCompanies.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
        </select>
        <select className="input select" style={{ fontSize: 12, width: 'auto' }} value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
          <option value="">All Stages</option>
          <option value="raw">New Lead</option>
          <option value="activated">Activated</option>
          <option value="delivered">Delivered</option>
          <option value="hired">Hired</option>
        </select>
        <select className="input select" style={{ fontSize: 12, width: 'auto' }} value={kycFilter} onChange={e => setKycFilter(e.target.value)}>
          <option value="">All KYC</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Job</th>
              <th>Stage</th>
              <th>KYC</th>
              <th>DVLA</th>
              <th>Right to Work</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {list.map(c => {
              const company = jobsCompanies.find(co => co.id === c.company_id)
              const job     = jobsListings.find(j => j.id === c.job_id)
              return (
                <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs/candidates/${c.id}`)}>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</td>
                  <td style={{ fontSize: 13 }}>{company?.name ?? '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--color-muted)' }}>{job?.title ?? '—'}</td>
                  <td><Badge variant={stageVariant(c.funnel_stage)}>{stageLabel(c.funnel_stage)}</Badge></td>
                  <td><Badge variant={verifyVariant(c.kyc_status)}>{c.kyc_status}</Badge></td>
                  <td><Badge variant={verifyVariant(c.dvla_status)}>{c.dvla_status}</Badge></td>
                  <td><Badge variant={verifyVariant(c.right_to_work)}>{c.right_to_work}</Badge></td>
                  <td style={{ fontSize: 12, color: 'var(--color-muted)' }}>{c.applied_date}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
