import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Users, UserPlus, Award, Download, ShieldOff } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import { adminLearners, certificates } from '../../../data'

const ACCOUNT_LABEL = { active: 'Active', invited: 'Invited', registered: 'Registered', stalled: 'Stalled' }
const PATH_LABEL    = { completed: 'Completed', inprogress: 'In Progress', stalled: 'Stalled', draft: 'Assigned', fail: 'Failed' }

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

/* ── Certificates table ─────────────────────────────────────────── */
function CertificatesTable() {
  const STATUS_LABEL   = { valid: 'Valid', expired: 'Expired', revoked: 'Revoked' }
  const STATUS_VARIANT = { valid: 'confirmed', expired: 'overdue', revoked: 'past' }

  const fmtDate  = iso => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const fmtMonth = iso => new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Learner</th>
            <th>Path</th>
            <th>Sub-Org</th>
            <th>Issued</th>
            <th>Score</th>
            <th>Expires</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((cert, i) => (
            <tr key={cert.id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    className="driver-avatar"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 28, height: 28, fontSize: 10, flexShrink: 0 }}
                  >
                    {getInitials(cert.learnerName)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{cert.learnerName}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{cert.learnerEmail}</div>
                  </div>
                </div>
              </td>
              <td><span style={{ fontSize: 13 }}>{cert.pathName}</span></td>
              <td><span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{cert.subOrg}</span></td>
              <td><span style={{ fontSize: 13 }}>{fmtDate(cert.issuedAt)}</span></td>
              <td>
                <span style={{ fontSize: 13, fontWeight: 600, color: cert.score >= 80 ? 'var(--color-success)' : 'var(--color-destructive)' }}>
                  {cert.score}%
                </span>
              </td>
              <td><span style={{ fontSize: 13 }}>{fmtMonth(cert.expiresAt)}</span></td>
              <td><Badge variant={STATUS_VARIANT[cert.status]}>{STATUS_LABEL[cert.status]}</Badge></td>
              <td>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-outline btn-sm" style={{ gap: 4 }}>
                    <Download size={12} /> Download
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-destructive)', gap: 4 }}>
                    <ShieldOff size={12} /> Revoke
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── Learners page ──────────────────────────────────────────────── */
export default function Learners() {
  const navigate = useNavigate()
  const location = useLocation()
  const learnersBase = location.pathname.startsWith('/academy/admin') ? '/academy/admin/learners' : '/academy/learners'

  const [activeTab, setActiveTab]       = useState('learners')
  const [search, setSearch]             = useState('')
  const [filterOrg, setFilterOrg]       = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const filtered = adminLearners.filter(l => {
    if (filterOrg    && l.org           !== filterOrg)    return false
    if (filterStatus && l.accountStatus !== filterStatus) return false
    if (search) {
      const q = search.toLowerCase()
      if (!l.name.toLowerCase().includes(q) && !l.email.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div className="page-body">
      <PageHeader title="Learners" icon={<Users size={18} color="white" />} banner />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <div className="page-title">Learners</div>
          <div className="page-subtitle">Manage and monitor all learners across sub-orgs.</div>
        </div>
        <button className="btn btn-dark btn-sm" onClick={() => navigate(`${learnersBase}/enrol`)}>
          <UserPlus size={14} /> Enrol Learners
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn${activeTab === 'learners' ? ' active' : ''}`}
          onClick={() => setActiveTab('learners')}
        >
          All Learners
        </button>
        <button
          className={`tab-btn${activeTab === 'certificates' ? ' active' : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          Certificates
          <span style={{
            marginLeft: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            background: '#f4f4f5', color: 'var(--color-muted)',
            fontSize: 10, fontWeight: 600,
            width: 18, height: 18, borderRadius: 99,
          }}>
            {certificates.length}
          </span>
        </button>
      </div>

      {activeTab === 'certificates' ? (
        <CertificatesTable />
      ) : (
        <>
          {/* Filter bar */}
          <div className="filter-bar">
            <div>
              <div className="filter-field-label">Search</div>
              <input
                className={`filter-control${search ? ' active' : ''}`}
                type="text"
                placeholder="Search learners..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: 200 }}
              />
            </div>

            <div>
              <div className="filter-field-label">Sub-Org</div>
              <select
                className={`filter-control${filterOrg ? ' active' : ''}`}
                value={filterOrg}
                onChange={e => setFilterOrg(e.target.value)}
              >
                <option value="">All</option>
                <option value="Amazon DSP DE">Amazon DSP Alemania</option>
              </select>
            </div>

            <div>
              <div className="filter-field-label">Status</div>
              <select
                className={`filter-control${filterStatus ? ' active' : ''}`}
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="invited">Invited</option>
                <option value="registered">Registered</option>
                <option value="stalled">Stalled</option>
              </select>
            </div>

            {(search || filterOrg || filterStatus) && (
              <button className="filter-clear" onClick={() => { setSearch(''); setFilterOrg(''); setFilterStatus('') }}>
                Clear filters
              </button>
            )}
          </div>

          {/* Learners table */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Learner</th>
                  <th>Sub-Org</th>
                  <th>Account Status</th>
                  <th>Path Status</th>
                  <th>Progress</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '32px 16px', fontSize: 13 }}>
                      No learners match the current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((learner, i) => (
                    <tr
                      key={learner.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`${learnersBase}/${learner.id}`)}
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
                      <td>
                        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{learner.org}</span>
                      </td>
                      <td>
                        <Badge variant={learner.accountStatus}>{ACCOUNT_LABEL[learner.accountStatus]}</Badge>
                      </td>
                      <td>
                        <Badge variant={learner.pathStatus}>{PATH_LABEL[learner.pathStatus]}</Badge>
                      </td>
                      <td style={{ minWidth: 120 }}>
                        <CompletionBar pct={learner.progress} />
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        {learner.accountStatus === 'invited' ? (
                          <button className="btn btn-outline btn-sm">Resend</button>
                        ) : learner.pathStatus === 'completed' ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => navigate(`${learnersBase}/${learner.id}`)}
                            >
                              View
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ color: 'var(--color-success)', gap: 4 }}
                              title="Ver certificado"
                              onClick={() => navigate(`${learnersBase}/${learner.id}`)}
                            >
                              <Award size={13} /> Cert
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => navigate(`${learnersBase}/${learner.id}`)}
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
