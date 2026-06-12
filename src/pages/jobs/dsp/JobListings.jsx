import { useNavigate } from 'react-router-dom'
import { List, Plus, Edit2, Pause, Play } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import { jobsListings } from '../../../data'

const statusVariant = s => s === 'active' ? 'active' : s === 'paused' ? 'pending' : 'archived'
const statusLabel   = s => s.charAt(0).toUpperCase() + s.slice(1)

export default function JobListings() {
  const navigate = useNavigate()

  return (
    <div className="page-body">
      <PageHeader title="Job Listings" icon={<List size={18} />} banner />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div className="page-title">Job Listings</div>
          <div className="page-subtitle">Manage your active job postings and drafts.</div>
        </div>
        <button
          className="btn btn-dark"
          style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={() => navigate('/jobs/listings/new')}
        >
          <Plus size={14} /> Post New Job
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Vehicle</th>
              <th>Spots Left</th>
              <th>Status</th>
              <th>Plan</th>
              <th>Posted</th>
              <th>Views</th>
              <th>Applications</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobsListings.map(job => (
              <tr key={job.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs/listings/${job.id}`)}>
                <td>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{job.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{job.contract_type}</div>
                </td>
                <td style={{ fontSize: 13 }}>{job.location}</td>
                <td style={{ fontSize: 13 }}>{job.vehicle_required}</td>
                <td style={{ fontSize: 13, fontWeight: 700, color: job.spots_left <= 2 ? 'var(--color-primary)' : 'var(--color-text)' }}>
                  {job.spots_left}
                </td>
                <td><Badge variant={statusVariant(job.status)}>{statusLabel(job.status)}</Badge></td>
                <td>
                  <span style={{ fontSize: 12, fontWeight: 700, background: job.plan === 'PRO' ? '#032F4F' : '#f4f4f5', color: job.plan === 'PRO' ? 'white' : 'var(--color-text)', padding: '2px 8px', borderRadius: 6 }}>
                    {job.plan}
                  </span>
                </td>
                <td style={{ fontSize: 12, color: 'var(--color-muted)' }}>{job.posted_date}</td>
                <td style={{ fontSize: 13 }}>{job.views}</td>
                <td style={{ fontSize: 13 }}>{job.applications_count}</td>
                <td onClick={e => e.stopPropagation()}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button
                      className="btn btn-ghost btn-icon"
                      title="Edit"
                      onClick={() => navigate(`/jobs/listings/${job.id}`)}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      title={job.status === 'active' ? 'Pause' : 'Activate'}
                    >
                      {job.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
