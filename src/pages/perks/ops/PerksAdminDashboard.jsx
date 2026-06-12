import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, Tag, Building2, Users, TrendingUp, ArrowRight } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import { perksDeals, perksEmployers, perksEmployees } from '../../../data'

const ACTIVITY = [
  { id: 1, employer: 'Globalia Travel',  action: 'New deal added: Vacation packages 10%',  date: '10 Jun 2026', type: 'deal'     },
  { id: 2, employer: 'Amazon DSP DE',    action: '2 new employees enrolled',               date: '09 Jun 2026', type: 'employee' },
  { id: 3, employer: 'Mediamarkt',       action: 'Deal "€50 off laptops" hit 20 redemptions', date: '08 Jun 2026', type: 'deal' },
  { id: 4, employer: 'Amazon DSP IT',    action: '1 new employee enrolled',                date: '07 Jun 2026', type: 'employee' },
  { id: 5, employer: 'Mango',            action: 'Deal "25% off new collection" activated', date: '06 Jun 2026', type: 'deal'    },
]

const QUICK = [
  { label: 'Deals',     path: '/perks/admin/deals',     Icon: Tag,        color: 'var(--color-primary)',   sub: 'Manage partner deals and offers' },
  { label: 'Employers', path: '/perks/admin/employers', Icon: Building2,  color: 'var(--color-secondary)', sub: 'View clients and billing status' },
  { label: 'Analytics', path: '/perks/admin/analytics', Icon: TrendingUp, color: '#7c3aed',                sub: 'Redemptions, top deals, growth'  },
]

export default function PerksAdminDashboard() {
  const navigate   = useNavigate()
  const activeDeals = perksDeals.filter(d => d.status === 'active').length

  return (
    <div className="page-body">
      <PageHeader title="Perks Ops — Overview" icon={<LayoutDashboard size={18} />} banner />

      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Perks Admin</div>
        <div className="page-subtitle">Platform overview — employers, deals and redemptions.</div>
      </div>

      {/* Stat cards */}
      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card dark">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label" style={{ color: '#a1a1aa' }}>Total Employers</div>
              <div className="stat-value" style={{ color: 'white' }}>{perksEmployers.length}</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
              <Building2 size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Total Employees</div>
              <div className="stat-value">{perksEmployees.length}</div>
            </div>
            <div className="stat-icon green"><Users size={20} /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Active Deals</div>
              <div className="stat-value">{activeDeals}</div>
            </div>
            <div className="stat-icon blue"><Tag size={20} /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Redemptions (Jun)</div>
              <div className="stat-value">81</div>
            </div>
            <div className="stat-icon" style={{ background: '#fdf4ff', color: '#a855f7' }}>
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Quick Access</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {QUICK.map(({ label, path, Icon, color, sub }) => (
            <div
              key={label}
              style={{
                background: 'white', border: `1.5px solid ${color}`, borderRadius: 12,
                padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)', minHeight: 100,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon size={16} color={color} />
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>{label}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-muted)', flex: 1 }}>{sub}</div>
              <button
                onClick={() => navigate(path)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 12, fontWeight: 600, color, padding: 0, marginTop: 2,
                  fontFamily: "'Poppins', sans-serif", width: 'fit-content',
                }}
              >
                Open {label} <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="section-title" style={{ marginBottom: 12 }}>Recent Activity</div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Employer / Partner</th>
              <th>Action</th>
              <th>Date</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVITY.map(a => (
              <tr key={a.id}>
                <td><span style={{ fontWeight: 600, fontSize: 13 }}>{a.employer}</span></td>
                <td><span style={{ fontSize: 13 }}>{a.action}</span></td>
                <td><span style={{ fontSize: 12, color: 'var(--color-muted)' }}>{a.date}</span></td>
                <td>
                  <Badge variant={a.type === 'deal' ? 'inprogress' : 'active'}>
                    {a.type === 'deal' ? 'Deal' : 'Employee'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
