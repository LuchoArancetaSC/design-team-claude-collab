import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Building2, ChevronLeft, Users, BookOpen, CalendarDays, FileText,
  Edit2, Mail, ExternalLink, Download, Plus,
} from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Badge from '../../components/Badge'
import { adminLearners, adminPaths, sessions, invoices } from '../../data'

const AVATAR_COLORS = ['#1d4ed8', '#7c3aed', '#059669', '#d97706', '#dc2626']
function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const ORGS = {
  1: {
    id: 1,
    name: 'Amazon DSP Alemania',
    tenant: 'Amazon DE',
    admin: 'admin@amazon-de.com',
    status: 'active',
    country: 'Germany',
    createdAt: '01 Jan 2026',
  },
}

const ACCOUNT_LABEL = { active: 'Active', invited: 'Invited', registered: 'Registered', stalled: 'Stalled' }
const PATH_LABEL    = { completed: 'Completed', inprogress: 'In Progress', stalled: 'Stalled', draft: 'Assigned' }
const STATUS_LABEL  = { published: 'Published', draft: 'Draft', inprogress: 'In Progress', archived: 'Archived' }

function CompletionBar({ pct }) {
  const color = pct === 100 ? 'var(--color-success)' : pct >= 50 ? 'var(--color-warning)' : pct === 0 ? '#e4e4e7' : '#ff4b4b'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 72, height: 6, background: '#f4f4f5', borderRadius: 99, overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600 }}>{pct}%</span>
    </div>
  )
}

export default function TenantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('learners')

  const org = ORGS[id] || ORGS[1]

  const orgLearners = adminLearners
  const orgPaths    = adminPaths
  const orgSessions = sessions.filter(s => s.status !== 'Past')
  const orgInvoices = invoices.filter(i => i.org === org.name)

  const tabs = [
    { id: 'learners', label: 'Learners',       icon: <Users size={13} />,        count: orgLearners.length  },
    { id: 'paths',    label: 'Learning Paths',  icon: <BookOpen size={13} />,     count: orgPaths.length     },
    { id: 'sessions', label: 'Sessions',        icon: <CalendarDays size={13} />, count: orgSessions.length  },
    { id: 'invoices', label: 'Invoices',        icon: <FileText size={13} />,     count: orgInvoices.length  },
  ]

  return (
    <div className="page-body">
      <PageHeader title="Tenants & Sub-Orgs" icon={<Building2 size={18} color="white" />} banner />

      <button className="back-link" onClick={() => navigate('/admin/tenants')}>
        <ChevronLeft size={15} /> Tenants & Sub-Orgs
      </button>

      {/* Header card */}
      <div className="card" style={{ marginBottom: 24, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, background: '#09090b',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Building2 size={18} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
                  {org.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 1 }}>
                  Tenant: {org.tenant} &nbsp;·&nbsp; {org.country} &nbsp;·&nbsp; Since {org.createdAt}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Badge variant={org.status}>Active</Badge>
            <button className="btn btn-outline btn-sm" style={{ gap: 4 }}>
              <Edit2 size={13} /> Edit
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, fontSize: 13, color: 'var(--color-muted)' }}>
          <Mail size={13} />
          <span>{org.admin}</span>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 32, marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
          {[
            { label: 'Learners',       value: orgLearners.length },
            { label: 'Active Paths',   value: orgPaths.filter(p => p.status === 'published').length },
            { label: 'Sessions',       value: orgSessions.length },
            { label: 'Avg Completion', value: `${Math.round(orgPaths.reduce((a, p) => a + p.completion, 0) / orgPaths.length)}%` },
          ].map(m => (
            <div key={m.label}>
              <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1, fontFamily: "'Poppins', sans-serif" }}>{m.value}</div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 500, marginTop: 2 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {t.icon} {t.label}
            <span style={{
              marginLeft: 2, fontSize: 10, fontWeight: 600,
              background: activeTab === t.id ? 'rgba(3,47,79,0.1)' : '#f4f4f5',
              color: activeTab === t.id ? 'var(--color-secondary)' : 'var(--color-muted)',
              padding: '1px 6px', borderRadius: 99,
            }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* ── Learners tab ── */}
      {activeTab === 'learners' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="section-title">{orgLearners.length} Learners</div>
            <button className="btn btn-dark btn-sm" onClick={() => navigate('/admin/learners/enrol')}>
              <Plus size={13} /> Enrol Learners
            </button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Learner</th>
                  <th>Account Status</th>
                  <th>Path</th>
                  <th>Path Status</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {orgLearners.map((l, i) => (
                  <tr
                    key={l.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/admin/learners/${l.id}`)}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="driver-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 28, height: 28, fontSize: 10, flexShrink: 0 }}>
                          {getInitials(l.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{l.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{l.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><Badge variant={l.accountStatus}>{ACCOUNT_LABEL[l.accountStatus]}</Badge></td>
                    <td><span style={{ fontSize: 13 }}>{l.pathName}</span></td>
                    <td><Badge variant={l.pathStatus}>{PATH_LABEL[l.pathStatus]}</Badge></td>
                    <td><CompletionBar pct={l.progress} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Paths tab ── */}
      {activeTab === 'paths' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="section-title">{orgPaths.length} Learning Paths</div>
            <button className="btn btn-dark btn-sm" onClick={() => navigate('/admin/paths/new')}>
              <Plus size={13} /> New Path
            </button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Path</th>
                  <th>Profile</th>
                  <th>Acts</th>
                  <th>Learners</th>
                  <th>Completion</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orgPaths.map(p => (
                  <tr
                    key={p.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/admin/paths/${p.id}`)}
                  >
                    <td><span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span></td>
                    <td><span style={{ fontSize: 12, color: 'var(--color-muted)' }}>{p.profile}</span></td>
                    <td><span style={{ fontSize: 13 }}>{p.acts}</span></td>
                    <td><span style={{ fontSize: 13 }}>{p.learners}</span></td>
                    <td><CompletionBar pct={p.completion} /></td>
                    <td><Badge variant={p.status}>{STATUS_LABEL[p.status]}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Sessions tab ── */}
      {activeTab === 'sessions' && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <div className="section-title">{orgSessions.length} Active Sessions</div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Learners</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orgSessions.map(s => (
                  <tr
                    key={s.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/admin/sessions/${s.id}`)}
                  >
                    <td><span style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</span></td>
                    <td><span style={{ fontSize: 13 }}>{s.date}</span></td>
                    <td><span style={{ fontSize: 13, color: 'var(--color-muted)' }}>{s.location}</span></td>
                    <td><span style={{ fontSize: 13 }}>{s.learners.length}</span></td>
                    <td><Badge variant={s.status}>{s.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Invoices tab ── */}
      {activeTab === 'invoices' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="section-title">{orgInvoices.length} Invoices</div>
            <button
              className="btn btn-outline btn-sm"
              style={{ gap: 4 }}
              onClick={() => navigate('/admin/invoices')}
            >
              <ExternalLink size={13} /> View all invoices
            </button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Details</th>
                  <th>Learners</th>
                  <th>Due Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orgInvoices.map(inv => (
                  <tr key={inv.id}>
                    <td><span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>{inv.id}</span></td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{inv.details}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 1 }}>{inv.session}</div>
                    </td>
                    <td><span style={{ fontSize: 13 }}>{inv.learners}</span></td>
                    <td>
                      <span style={{ fontSize: 13, color: inv.status === 'Overdue' ? 'var(--color-primary)' : 'var(--color-text)' }}>
                        {inv.dueDate}
                      </span>
                    </td>
                    <td><span style={{ fontSize: 14, fontWeight: 700 }}>€{inv.amount.toFixed(2)}</span></td>
                    <td><Badge variant={inv.status}>{inv.status}</Badge></td>
                    <td>
                      <button className="btn btn-ghost btn-icon" title="Download">
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <div className="card" style={{ minWidth: 260, padding: '16px 20px' }}>
              {[
                { label: 'Total Paid',    value: orgInvoices.filter(i => i.status === 'Paid').reduce((a, b) => a + b.amount, 0), color: 'var(--color-success)' },
                { label: 'Pending',       value: orgInvoices.filter(i => i.status === 'Pending').reduce((a, b) => a + b.amount, 0), color: 'var(--color-warning)' },
                { label: 'Overdue',       value: orgInvoices.filter(i => i.status === 'Overdue').reduce((a, b) => a + b.amount, 0), color: 'var(--color-primary)' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: 'var(--color-muted)' }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: row.color }}>€{row.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
