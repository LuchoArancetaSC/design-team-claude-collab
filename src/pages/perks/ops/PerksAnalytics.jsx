import { BarChart2, RefreshCw, Users, Tag, TrendingUp } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import { perksDeals, perksEmployers, perksEmployees } from '../../../data'

const DEAL_STATS = [
  { id: 4, title: '€50 off laptops',         employer: 'Mediamarkt',    category: 'Electronics', clicks: 110, redemptions: 22, conv: 20.0 },
  { id: 1, title: '15% off flights',          employer: 'Globalia Travel', category: 'Travel',    clicks: 89,  redemptions: 18, conv: 20.2 },
  { id: 5, title: '10% off all appliances',   employer: 'Mediamarkt',    category: 'Electronics', clicks: 67,  redemptions: 14, conv: 20.9 },
  { id: 2, title: 'Hotel discount 20%',       employer: 'Globalia Travel', category: 'Travel',    clicks: 54,  redemptions: 11, conv: 20.4 },
  { id: 6, title: '25% off new collection',   employer: 'Mango',          category: 'Fashion',   clicks: 41,  redemptions:  9, conv: 22.0 },
  { id: 3, title: 'Vacation packages 10%',    employer: 'Globalia Travel', category: 'Travel',    clicks: 32,  redemptions:  7, conv: 21.9 },
]

const EMPLOYER_ENGAGEMENT = [
  { id: 1, name: 'Globalia Travel',  category: 'Travel',      employees: 2, dealsActive: 3, redemptions: 36, engagement: 91 },
  { id: 4, name: 'Mediamarkt',       category: 'Electronics', employees: 2, dealsActive: 2, redemptions: 36, engagement: 88 },
  { id: 6, name: 'Mango',            category: 'Fashion',     employees: 1, dealsActive: 1, redemptions:  9, engagement: 74 },
]

function CompletionBar({ pct, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: '#f4f4f5', borderRadius: 99, overflow: 'hidden', minWidth: 80 }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: color || (pct >= 80 ? 'var(--color-success)' : pct >= 50 ? 'var(--color-warning)' : 'var(--color-primary)'),
          borderRadius: 99,
        }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, minWidth: 36 }}>{pct}%</span>
    </div>
  )
}

export default function PerksAnalytics() {
  const totalRedemptions = DEAL_STATS.reduce((s, d) => s + d.redemptions, 0)
  const avgPerEmployee   = (totalRedemptions / perksEmployees.filter(e => e.status === 'active').length).toFixed(1)
  const topCategory      = 'Electronics'
  const momGrowth        = '+14%'

  return (
    <div className="page-body">
      <PageHeader title="Analytics" icon={<BarChart2 size={18} />} banner />

      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Platform Analytics</div>
        <div className="page-subtitle">Redemption trends, top deals and employer engagement — June 2026.</div>
      </div>

      {/* Stat cards */}
      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card dark">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label" style={{ color: '#a1a1aa' }}>Total Redemptions</div>
              <div className="stat-value" style={{ color: 'white' }}>{totalRedemptions}</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
              <RefreshCw size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Avg per Employee</div>
              <div className="stat-value">{avgPerEmployee}</div>
            </div>
            <div className="stat-icon green"><Users size={20} /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Top Category</div>
              <div className="stat-value" style={{ fontSize: 18 }}>{topCategory}</div>
            </div>
            <div className="stat-icon blue"><Tag size={20} /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">MoM Growth</div>
              <div className="stat-value" style={{ color: 'var(--color-success)' }}>{momGrowth}</div>
            </div>
            <div className="stat-icon" style={{ background: '#f0fdf4', color: 'var(--color-success)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Deals */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="section-title">Top Deals by Redemptions</div>
        <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>June 2026</span>
      </div>

      <div className="table-wrapper" style={{ marginBottom: 28 }}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Deal</th>
              <th>Provider</th>
              <th>Category</th>
              <th>Clicks</th>
              <th>Redemptions</th>
              <th>Conv. Rate</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {DEAL_STATS.map((d, i) => (
              <tr key={d.id}>
                <td>
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    color: i === 0 ? '#d97706' : i === 1 ? '#71717a' : i === 2 ? '#92400e' : 'var(--color-muted)',
                  }}>
                    #{i + 1}
                  </span>
                </td>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{d.title}</td>
                <td style={{ fontSize: 13, color: 'var(--color-muted)' }}>{d.employer}</td>
                <td><Badge variant="inprogress">{d.category}</Badge></td>
                <td style={{ fontSize: 13 }}>{d.clicks}</td>
                <td style={{ fontSize: 14, fontWeight: 700 }}>{d.redemptions}</td>
                <td style={{ minWidth: 140 }}>
                  <CompletionBar pct={d.conv} color="var(--color-secondary)" />
                </td>
                <td>
                  <span style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 600 }}>↑</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Employer engagement */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="section-title">Employer Engagement</div>
        <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>Sorted by redemptions</span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Employer</th>
              <th>Category</th>
              <th>Active Employees</th>
              <th>Active Deals</th>
              <th>Redemptions</th>
              <th>Engagement</th>
            </tr>
          </thead>
          <tbody>
            {EMPLOYER_ENGAGEMENT.map(emp => (
              <tr key={emp.id}>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</td>
                <td style={{ fontSize: 12, color: 'var(--color-muted)' }}>{emp.category}</td>
                <td style={{ fontSize: 13 }}>{emp.employees}</td>
                <td style={{ fontSize: 13 }}>{emp.dealsActive}</td>
                <td style={{ fontSize: 14, fontWeight: 700 }}>{emp.redemptions}</td>
                <td style={{ minWidth: 160 }}>
                  <CompletionBar pct={emp.engagement} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
