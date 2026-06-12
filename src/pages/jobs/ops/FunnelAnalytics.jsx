import { TrendingUp } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import { jobsFunnelStats, jobsCandidates, jobsCompanies, jobsListings } from '../../../data'

function ProgressBar({ pct, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: '#f4f4f5', borderRadius: 99, overflow: 'hidden', minWidth: 80 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color ?? 'var(--color-secondary)', borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, minWidth: 36 }}>{pct}%</span>
    </div>
  )
}

const FUNNEL_ROWS = [
  { stage: 'New Lead',  key: 'raw',       dropKey: null,                       avgDays: '—'  },
  { stage: 'Activated', key: 'activated', dropKey: 'raw_to_activated',         avgDays: 1.2  },
  { stage: 'Delivered', key: 'delivered', dropKey: 'activated_to_delivered',   avgDays: 2.1  },
  { stage: 'Hired',     key: 'hired',     dropKey: 'delivered_to_hired',       avgDays: 0.9  },
]

export default function FunnelAnalytics() {
  const dropRate   = Math.round((1 - jobsFunnelStats.hired / jobsFunnelStats.raw) * 100)

  const perCompany = jobsCompanies.map(c => {
    const jobs       = jobsListings.filter(j => j.company_id === c.id)
    const candidates = jobsCandidates.filter(cd => cd.company_id === c.id)
    const hired      = candidates.filter(cd => cd.funnel_stage === 'hired').length
    const conv       = candidates.length > 0 ? Math.round((hired / candidates.length) * 100) : 0
    return { ...c, jobCount: jobs.length, candidateCount: candidates.length, hired, conv }
  })

  return (
    <div className="page-body">
      <PageHeader title="Funnel Analytics" icon={<TrendingUp size={18} color="white" />} banner />

      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Funnel Analytics</div>
        <div className="page-subtitle">Hiring pipeline performance and conversion metrics.</div>
      </div>

      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
        <div className="stat-card dark">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label" style={{ color: '#a1a1aa' }}>Hired</div>
              <div className="stat-value" style={{ color: 'white' }}>{jobsFunnelStats.hired}</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Avg Time to Hire</div>
              <div className="stat-value">{jobsFunnelStats.time_to_hire_avg}d</div>
            </div>
            <div className="stat-icon blue"><TrendingUp size={20} /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Cost per Hire</div>
              <div className="stat-value">£{jobsFunnelStats.cost_per_hire}</div>
            </div>
            <div className="stat-icon green"><TrendingUp size={20} /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Drop-off Rate</div>
              <div className="stat-value">{dropRate}%</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(255,75,75,0.1)', color: 'var(--color-primary)' }}>
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="section-title" style={{ marginBottom: 12 }}>Pipeline Funnel</div>
      <div className="table-wrapper" style={{ marginBottom: 28 }}>
        <table>
          <thead>
            <tr>
              <th>Stage</th>
              <th>Count</th>
              <th>Drop-off %</th>
              <th>Avg Days in Stage</th>
            </tr>
          </thead>
          <tbody>
            {FUNNEL_ROWS.map(row => (
              <tr key={row.stage}>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{row.stage}</td>
                <td style={{ fontSize: 13, fontWeight: 700 }}>{jobsFunnelStats[row.key]}</td>
                <td style={{ minWidth: 180 }}>
                  {row.dropKey
                    ? <ProgressBar pct={jobsFunnelStats.drop_off[row.dropKey]} color="var(--color-primary)" />
                    : <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>—</span>
                  }
                </td>
                <td style={{ fontSize: 13, color: 'var(--color-muted)' }}>{row.avgDays}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section-title" style={{ marginBottom: 12 }}>Per-Company Breakdown</div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Jobs</th>
              <th>Candidates</th>
              <th>Hired</th>
              <th>Conversion %</th>
            </tr>
          </thead>
          <tbody>
            {perCompany.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</td>
                <td style={{ fontSize: 13 }}>{c.jobCount}</td>
                <td style={{ fontSize: 13 }}>{c.candidateCount}</td>
                <td style={{ fontSize: 13, fontWeight: 700 }}>{c.hired}</td>
                <td style={{ minWidth: 160 }}><ProgressBar pct={c.conv} color="var(--color-success)" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
