import { useNavigate } from 'react-router-dom'
import { BarChart2, ChevronLeft, TrendingUp, Users, Award, FileText } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'

const COMING_SOON = [
  { icon: TrendingUp, label: 'Completion Rate Report',    desc: 'Track path completion % across all sub-orgs and date ranges.' },
  { icon: Users,      label: 'Learner Progress Report',   desc: 'Per-learner breakdown of progress, stalled, and completed.' },
  { icon: Award,      label: 'Certificates Issued',       desc: 'Summary of certificates issued, expired, and revoked.' },
  { icon: FileText,   label: 'Session Activity Log',      desc: 'Full log of safety and info sessions with attendance data.' },
]

export default function Reports() {
  const navigate = useNavigate()

  return (
    <div className="page-body">
      <PageHeader title="Reports" icon={<BarChart2 size={18} color="white" />} banner />

      <button className="back-link" onClick={() => navigate('/academy/admin')}>
        <ChevronLeft size={15} /> Back to Dashboard
      </button>

      <div style={{ marginBottom: 32 }}>
        <div className="page-title">Reports</div>
        <div className="page-subtitle">Analytics and exports for your training operations.</div>
      </div>

      {/* Placeholder state */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '48px 24px 32px',
        background: 'white',
        border: '1px solid var(--color-border)',
        borderRadius: 16,
        marginBottom: 24,
        textAlign: 'center',
      }}>
        <div style={{
          width: 56, height: 56,
          background: 'rgba(72,68,196,0.08)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16,
        }}>
          <BarChart2 size={26} color="var(--color-accent)" />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8, fontFamily: "'Poppins', sans-serif" }}>
          Reports coming soon
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-muted)', maxWidth: 380, lineHeight: 1.65, marginBottom: 24 }}>
          The reporting module is under development. Below you can see which reports will be available.
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/academy/admin')}>
          <ChevronLeft size={13} /> Back to Dashboard
        </button>
      </div>

      {/* Upcoming reports preview */}
      <div className="section-title" style={{ marginBottom: 12 }}>Upcoming reports</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {COMING_SOON.map(item => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              className="card"
              style={{ padding: '16px 20px', opacity: 0.6, display: 'flex', alignItems: 'flex-start', gap: 14 }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: '#f4f4f5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={17} color="var(--color-muted)" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 3, fontFamily: "'Poppins', sans-serif" }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
