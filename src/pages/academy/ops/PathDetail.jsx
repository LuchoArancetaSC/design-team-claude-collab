import { useNavigate, useParams } from 'react-router-dom'
import { BookOpen, ChevronLeft, Edit2, Users, CheckCircle2, Clock } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import { adminPaths, adminLearners } from '../../../data'

const AVATAR_COLORS = ['#1d4ed8', '#7c3aed', '#059669', '#d97706', '#dc2626']

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function CompletionBar({ pct }) {
  const color = pct === 100 ? 'var(--color-success)' : pct >= 50 ? 'var(--color-warning)' : pct === 0 ? '#e4e4e7' : '#ff4b4b'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 80, height: 6, background: '#f4f4f5', borderRadius: 99, overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', minWidth: 32 }}>{pct}%</span>
    </div>
  )
}

const STATUS_LABEL = { published: 'Published', draft: 'Draft', inprogress: 'In Progress', archived: 'Archived' }
const PATH_LABEL   = { completed: 'Completed', inprogress: 'In Progress', stalled: 'Stalled', draft: 'Assigned' }
const ACCOUNT_LABEL = { active: 'Active', invited: 'Invited', registered: 'Registered', stalled: 'Stalled' }

export default function PathDetail() {
  const navigate = useNavigate()
  const { id } = useParams()

  const path = adminPaths.find(p => String(p.id) === String(id))

  if (!path) {
    return (
      <div className="page-body">
        <PageHeader title="Learning Paths" icon={<BookOpen size={18} color="white" />} banner />
        <button className="back-link" onClick={() => navigate('/academy/admin/paths')}>
          <ChevronLeft size={15} /> Learning Paths
        </button>
        <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--color-muted)', fontSize: 14 }}>
          Path not found.
        </div>
      </div>
    )
  }

  const enrolled = adminLearners.filter(l => l.pathId === path.id)

  return (
    <div className="page-body">
      <PageHeader title="Learning Paths" icon={<BookOpen size={18} color="white" />} banner />

      <button className="back-link" onClick={() => navigate('/academy/admin/paths')}>
        <ChevronLeft size={15} /> Learning Paths
      </button>

      {/* Path header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div className="page-title" style={{ marginBottom: 0 }}>{path.name}</div>
            <Badge variant={path.status}>{STATUS_LABEL[path.status]}</Badge>
          </div>
          <div className="page-subtitle">{path.org} · Profile: {path.profile}</div>
        </div>
        <button className="btn btn-dark btn-sm" onClick={() => navigate(`/admin/paths/${path.id}/edit`)}>
          <Edit2 size={13} /> Edit Path
        </button>
      </div>

      {/* Stats row */}
      <div className="stats-row" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Acts</div>
              <div className="stat-value">{path.acts}</div>
            </div>
            <div className="stat-icon blue">
              <BookOpen size={20} />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Microlessons</div>
              <div className="stat-value">{path.microlessons}</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.1)' }}>
              <Clock size={20} color="var(--color-accent)" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Learners Enrolled</div>
              <div className="stat-value">{path.learners}</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(5,150,105,0.1)' }}>
              <Users size={20} color="var(--color-success)" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Avg. Completion</div>
              <div className="stat-value">{path.completion}%</div>
            </div>
            <div className="stat-icon green">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>

        {/* Enrolled learners */}
        <div>
          <div className="section-title" style={{ marginBottom: 12 }}>Enrolled Learners</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Learner</th>
                  <th>Account</th>
                  <th>Path Status</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrolled.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '32px 16px', fontSize: 13 }}>
                      No learners enrolled yet.
                    </td>
                  </tr>
                ) : (
                  enrolled.map((learner, i) => (
                    <tr
                      key={learner.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/admin/learners/${learner.id}`)}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            className="driver-avatar"
                            style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 28, height: 28, fontSize: 10, flexShrink: 0 }}
                          >
                            {getInitials(learner.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{learner.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{learner.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><Badge variant={learner.accountStatus}>{ACCOUNT_LABEL[learner.accountStatus]}</Badge></td>
                      <td><Badge variant={learner.pathStatus}>{PATH_LABEL[learner.pathStatus]}</Badge></td>
                      <td style={{ minWidth: 120 }}><CompletionBar pct={learner.progress} /></td>
                      <td>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={e => { e.stopPropagation(); navigate(`/admin/learners/${learner.id}`) }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Path settings summary */}
        <div className="card" style={{ padding: 16 }}>
          <div className="section-title" style={{ fontSize: 13, marginBottom: 14 }}>Path Settings</div>

          {[
            { label: 'Sub-Org',            value: path.org },
            { label: 'Profile flag',       value: path.profile },
            { label: 'Stalled threshold',  value: `${path.stalledDays} days` },
            { label: 'Status',             value: STATUS_LABEL[path.status] },
          ].map(row => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '9px 0', borderBottom: '1px solid var(--color-border)',
              fontSize: 13,
            }}>
              <span style={{ color: 'var(--color-muted)', fontWeight: 500 }}>{row.label}</span>
              <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{row.value}</span>
            </div>
          ))}

          <button
            className="btn btn-outline btn-sm"
            style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}
            onClick={() => navigate(`/admin/paths/${path.id}/edit`)}
          >
            <Edit2 size={12} /> Edit in Composer
          </button>
        </div>
      </div>
    </div>
  )
}
