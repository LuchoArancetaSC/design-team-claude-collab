import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, BookOpen, TrendingUp, AlertTriangle, CalendarDays, Receipt, ArrowRight } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'

const PATHS = [
  { id: 1, name: 'Safety IT All Module',    org: 'Amazon DSP España',  enrolled: 48, total: 52, completion: 92, status: 'published' },
  { id: 2, name: 'Information Session',     org: 'Amazon DSP DE',      enrolled: 31, total: 35, completion: 89, status: 'published' },
  { id: 3, name: 'Safety Refresher',        org: 'Amazon DSP IT',      enrolled: 12, total: 20, completion: 60, status: 'assigned'  },
  { id: 4, name: 'Onboarding Basics',       org: 'Amazon DSP Italia',  enrolled:  0, total: 15, completion:  0, status: 'past'      },
  { id: 5, name: 'Road Safety Advanced',    org: 'Amazon DSP España',  enrolled:  8, total: 10, completion: 80, status: 'published' },
]

const STATUS_LABEL = {
  published: 'Published',
  assigned:  'In Progress',
  past:      'Draft',
}

function CompletionBar({ pct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: '#f4f4f5', borderRadius: 99, overflow: 'hidden', minWidth: 64 }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: pct >= 80 ? 'var(--color-success)' : pct >= 50 ? 'var(--color-warning)' : '#ff4b4b',
          borderRadius: 99,
          transition: 'width 0.3s',
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', minWidth: 32 }}>{pct}%</span>
    </div>
  )
}

const QUICK_ACCESS = [
  {
    label: 'Sessions',
    icon: CalendarDays,
    color: 'var(--color-secondary)',
    subtitle: 'Ver y gestionar todas las sesiones',
    btnLabel: 'Abrir Sessions',
    path: '/academy/admin/sessions',
  },
  {
    label: 'LMS',
    icon: BookOpen,
    color: 'var(--color-primary)',
    subtitle: 'Paths, microlessons y contenido',
    btnLabel: 'Abrir LMS',
    path: '/academy/admin/paths',
  },
  {
    label: 'Invoicing',
    icon: Receipt,
    color: '#7c3aed',
    subtitle: 'Facturas y pagos pendientes',
    btnLabel: 'Abrir Invoicing',
    path: '/academy/admin/invoices',
  },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  return (
    <div className="page-body">
      <PageHeader title="Dashboard" icon={<LayoutDashboard size={18} color="white" />} banner />

      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Admin Overview</div>
        <div className="page-subtitle">Monitor learners, paths and completion across all tenants.</div>
      </div>

      {/* Stat cards */}
      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card dark">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label" style={{ color: '#a1a1aa' }}>Learners activos</div>
              <div className="stat-value" style={{ color: 'white' }}>342</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Paths publicados</div>
              <div className="stat-value">18</div>
            </div>
            <div className="stat-icon green">
              <BookOpen size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Tasa completion</div>
              <div className="stat-value">74%</div>
            </div>
            <div className="stat-icon blue">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Learners en riesgo</div>
              <div className="stat-value">23</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(255,75,75,0.1)', color: 'var(--color-primary)' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Acceso rápido</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {QUICK_ACCESS.map(item => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                style={{
                  background: 'white',
                  border: `1.5px solid ${item.color}`,
                  borderRadius: 12,
                  padding: '16px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                  minHeight: 100,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={16} color={item.color} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', fontFamily: "'Poppins', sans-serif" }}>
                    {item.label}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', flex: 1 }}>
                  {item.subtitle}
                </div>
                <button
                  onClick={() => navigate(item.path)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 12, fontWeight: 600, color: item.color,
                    padding: 0, marginTop: 2, fontFamily: "'Poppins', sans-serif",
                    width: 'fit-content',
                  }}
                >
                  {item.btnLabel} <ArrowRight size={12} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent paths */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="section-title">Learning Paths recientes</div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Path</th>
              <th>Sub-Org</th>
              <th>Learners</th>
              <th>Completion</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {PATHS.map(path => (
              <tr key={path.id}>
                <td>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{path.name}</span>
                </td>
                <td>
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{path.org}</span>
                </td>
                <td>
                  <span style={{ fontSize: 13 }}>{path.enrolled} / {path.total}</span>
                </td>
                <td style={{ minWidth: 140 }}>
                  <CompletionBar pct={path.completion} />
                </td>
                <td>
                  <Badge variant={path.status}>{STATUS_LABEL[path.status]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
