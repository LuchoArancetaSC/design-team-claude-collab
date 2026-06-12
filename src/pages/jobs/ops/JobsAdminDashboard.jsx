import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Briefcase, UserCheck, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import { jobsCandidates, jobsListings, jobsHSMQueue } from '../../../data'

const ACTIVITY = [
  { company: 'Amazon DSP DE',  job: 'Van Driver – Amazon DSP Munich',         candidate: 'Tobias Kern',   stage: 'hired',     date: '10 Jun 2026' },
  { company: 'Amazon DSP DE',  job: 'Cargo Bike Courier – City Centre Berlin', candidate: 'Jan Nowak',     stage: 'hired',     date: '08 Jun 2026' },
  { company: 'Amazon DSP DE',  job: 'Van Driver – Amazon DSP Munich',         candidate: 'Lena Fischer',  stage: 'delivered', date: '07 Jun 2026' },
  { company: 'Amazon Flex ES', job: 'Car Courier – Amazon Flex Madrid',        candidate: 'Carlos Vega',   stage: 'activated', date: '05 Jun 2026' },
  { company: 'Amazon DSP DE',  job: 'Van Driver – Amazon DSP Munich',         candidate: 'Marco Ricci',   stage: 'activated', date: '04 Jun 2026' },
]

const stageVariant = s => ({ raw: 'draft', activated: 'pending', delivered: 'assigned', hired: 'confirmed' }[s] ?? 'draft')
const stageLabel   = s => ({ raw: 'New Lead', activated: 'Activated', delivered: 'Delivered', hired: 'Hired' }[s] ?? s)

const QUICK_ACCESS = [
  { label: 'All Candidates', icon: Users,        color: 'var(--color-secondary)', subtitle: 'Browse and filter all pipeline candidates',     btnLabel: 'Open Candidates', path: '/jobs/admin/candidates' },
  { label: 'HSM Queue',      icon: MessageSquare, color: 'var(--color-primary)',   subtitle: 'Manage open support cases and escalations',      btnLabel: 'Open HSM Queue',  path: '/jobs/admin/hsm'        },
  { label: 'Analytics',      icon: TrendingUp,    color: '#7c3aed',               subtitle: 'Funnel metrics and hiring performance',          btnLabel: 'Open Analytics',  path: '/jobs/admin/analytics'  },
]

export default function JobsAdminDashboard() {
  const navigate   = useNavigate()
  const hsmOpen    = jobsHSMQueue.filter(h => h.status === 'Open').length
  const hired      = jobsCandidates.filter(c => c.funnel_stage === 'hired').length
  const activeJobs = jobsListings.filter(j => j.status === 'active').length

  return (
    <div className="page-body">
      <PageHeader title="Jobs Ops — Overview" icon={<LayoutDashboard size={18} color="white" />} banner />

      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Jobs Ops — Overview</div>
        <div className="page-subtitle">Monitor active jobs, candidates, and hiring activity across all clients.</div>
      </div>

      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="stat-card dark">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label" style={{ color: '#a1a1aa' }}>Total Active Jobs</div>
              <div className="stat-value" style={{ color: 'white' }}>{activeJobs}</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
              <Briefcase size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Total in Pipeline</div>
              <div className="stat-value">{jobsCandidates.length}</div>
            </div>
            <div className="stat-icon blue"><Users size={20} /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Hired This Month</div>
              <div className="stat-value">{hired}</div>
            </div>
            <div className="stat-icon green"><UserCheck size={20} /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">
                HSM Queue Open
                {hsmOpen > 0 && (
                  <span style={{ marginLeft: 6, background: 'var(--color-primary)', color: 'white', fontSize: 10, fontWeight: 700, borderRadius: 99, padding: '1px 7px' }}>
                    {hsmOpen}
                  </span>
                )}
              </div>
              <div className="stat-value">{hsmOpen}</div>
            </div>
            <div className="stat-icon" style={{ background: hsmOpen > 0 ? 'rgba(255,75,75,0.1)' : '#f4f4f5', color: hsmOpen > 0 ? 'var(--color-primary)' : 'var(--color-muted)' }}>
              <MessageSquare size={20} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Quick Access</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {QUICK_ACCESS.map(item => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                style={{ background: 'white', border: `1.5px solid ${item.color}`, borderRadius: 12, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', minHeight: 100 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={16} color={item.color} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', fontFamily: "'Poppins', sans-serif" }}>{item.label}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', flex: 1 }}>{item.subtitle}</div>
                <button
                  onClick={() => navigate(item.path)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: item.color, padding: 0, marginTop: 2, fontFamily: "'Poppins', sans-serif", width: 'fit-content' }}
                >
                  {item.btnLabel} <ArrowRight size={12} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="section-title" style={{ marginBottom: 12 }}>Recent Activity</div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Job</th>
              <th>Candidate</th>
              <th>Stage</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVITY.map((row, i) => (
              <tr key={i}>
                <td style={{ fontSize: 13 }}>{row.company}</td>
                <td style={{ fontSize: 13 }}>{row.job}</td>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{row.candidate}</td>
                <td><Badge variant={stageVariant(row.stage)}>{stageLabel(row.stage)}</Badge></td>
                <td style={{ fontSize: 12, color: 'var(--color-muted)' }}>{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
