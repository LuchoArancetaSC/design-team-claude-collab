import { useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import {
  CalendarDays, ChevronLeft, Clock, MapPin, Link2, Download,
  Trash2, Shield, Check, Plus, Award, Info,
  Smartphone, Copy, RefreshCw,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import SessionTypeBadge from '../components/SessionTypeBadge'
import { sessions, certificates } from '../data'
import bannerSessions from '../assets/banner-sessions.svg'

const AVATAR_COLORS = ['#1d4ed8','#7c3aed','#059669','#d97706','#dc2626','#0891b2','#9333ea','#16a34a']

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

const SMP_LEARNERS = [
  { id: 'sl1', name: 'Hans Müller',  email: 'hans@amazon-de.com',  accountStatus: 'registered' },
  { id: 'sl2', name: 'Klaus Weber',  email: 'klaus@amazon-de.com', accountStatus: 'registered' },
  { id: 'sl3', name: 'Anna Schmidt', email: 'anna@amazon-de.com',  accountStatus: 'invited'    },
]

/* ── Enroll Drawer ─────────────────────────────────────────────────── */
function EnrollDrawer({ session, onClose, onEnroll }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const enrolledIds = session.learners.map(l => l.id)

  const available = learnersPool.filter(l =>
    !enrolledIds.includes(l.id) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) ||
     l.email.toLowerCase().includes(search.toLowerCase()))
  )

  const toggle = id => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-header">
          <span className="drawer-title">Enroll Learners</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="drawer-body">
          <div className="search-wrapper" style={{ marginBottom: 14 }}>
            <Search size={14} />
            <input
              className="input"
              placeholder="Search learners..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 8, letterSpacing: '0.04em' }}>
            {selected.length} selected · {available.length} available
          </div>
          {available.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-muted)', fontSize: 13 }}>
              No available learners found.
            </div>
          ) : (
            available.map((l, i) => (
              <label key={l.id} className="driver-row">
                <input type="checkbox" checked={selected.includes(l.id)} onChange={() => toggle(l.id)} />
                <div className="driver-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                  {getInitials(l.name)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{l.email}</div>
                </div>
              </label>
            ))
          )}
        </div>

        <div className="drawer-footer">
          <button
            className="btn btn-dark"
            style={{ flex: 1 }}
            disabled={selected.length === 0}
            onClick={() => { onEnroll(selected); onClose() }}
          >
            Enroll {selected.length > 0 ? `${selected.length} learner${selected.length > 1 ? 's' : ''}` : 'learners'}
          </button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </>
  )
}

/* ── SMP Magic Link Panel ──────────────────────────────────────────── */
function SMPPanel() {
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied]       = useState(false)
  const magicUrl = 'https://app.serviceclub.io/join/amazon-de-smp-2026'

  const copyLink = () => {
    navigator.clipboard.writeText(magicUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const ACCOUNT_LABEL   = { registered: 'Registered', invited: 'Invited' }
  const ACCOUNT_VARIANT = { registered: 'confirmed',  invited: 'pending'  }

  return (
    <div>
      {/* Magic Link Card */}
      <div style={{
        background: 'rgba(255,75,75,0.04)',
        border: '1.5px solid rgba(255,75,75,0.25)',
        borderRadius: 12,
        padding: 20,
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Smartphone size={16} color="var(--color-primary)" />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', fontFamily: "'Poppins', sans-serif" }}>
            Invitación por Magic Link
          </span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 16 }}>
          Los learners se registran directamente en la app con este enlace.
          Se crea un perfil de learner automáticamente.
        </div>

        {!generated ? (
          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', gap: 6 }}
            onClick={() => setGenerated(true)}
          >
            <Link2 size={14} /> Generar Magic Link
          </button>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                className="input"
                readOnly
                value={magicUrl}
                style={{ flex: 1, fontSize: 12, fontFamily: 'monospace' }}
              />
              <button
                className="btn btn-dark btn-sm btn-pill"
                style={{ flexShrink: 0 }}
                onClick={copyLink}
              >
                {copied ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
              </button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 12 }}>
              · Expira en 7 días (01 Jul 2026) &nbsp;·&nbsp; {SMP_LEARNERS.length} learners registrados
            </div>
            <button
              className="btn btn-ghost btn-sm"
              style={{ gap: 4 }}
              onClick={() => { setGenerated(false); setTimeout(() => setGenerated(true), 80) }}
            >
              <RefreshCw size={12} /> Regenerar link
            </button>
          </div>
        )}
      </div>

      {/* Registered learners divider */}
      <div className="today-label" style={{ marginBottom: 12 }}>
        <div className="today-label-line" />
        <span className="today-label-text">Learners registrados via link</span>
        <div className="today-label-line" />
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Learner</th>
              <th>Account Status</th>
              <th>App Access</th>
            </tr>
          </thead>
          <tbody>
            {SMP_LEARNERS.map((learner, i) => (
              <tr key={learner.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      className="driver-avatar"
                      style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 28, height: 28, fontSize: 10 }}
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
                  <Badge variant={ACCOUNT_VARIANT[learner.accountStatus]}>
                    {ACCOUNT_LABEL[learner.accountStatus]}
                  </Badge>
                </td>
                <td>
                  {learner.accountStatus === 'registered'
                    ? <span style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: 14 }}>✓</span>
                    : <span style={{ color: 'var(--color-muted)', fontSize: 13 }}>—</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: 12, color: 'var(--color-muted)', textAlign: 'center', marginTop: 16, fontStyle: 'italic' }}>
        Las sesiones SMP no admiten inscripción manual ni CSV
      </div>
    </div>
  )
}

/* ── Session Detail page ──────────────────────────────────────────── */
export default function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const sessionsBase = location.pathname.startsWith('/admin') ? '/admin/sessions' : '/sessions'

  const learnersBase = location.pathname.startsWith('/admin') ? '/admin/learners' : '/learners'

  const [sessionData, setSessionData] = useState(() => {
    const found = sessions.find(s => s.id === id)
    return found ? { ...found, learners: [...found.learners] } : null
  })
  const [activeTab, setActiveTab] = useState('overview')

  if (!sessionData) {
    return (
      <div className="page-body">
        <PageHeader title="Session Details" icon={<CalendarDays size={18} color="white" />} banner={bannerSessions} />
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-muted)' }}>
          Session not found.
        </div>
      </div>
    )
  }

  const isPast  = sessionData.status === 'Past'
  const isSMP   = sessionData.type === 'smp'

  const handleUnenroll = lid => {
    setSessionData(prev => ({ ...prev, learners: prev.learners.filter(l => l.id !== lid) }))
  }

  return (
    <div className="page-body">
      <PageHeader title="Session Details" icon={<CalendarDays size={18} color="white" />} banner={bannerSessions} />

      <button className="back-link" onClick={() => navigate(sessionsBase)}>
        <ChevronLeft size={15} /> Back to Sessions
      </button>

      {/* Detail header */}
      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <SessionTypeBadge type={sessionData.type} />
            <Badge variant={sessionData.status}>{sessionData.status}</Badge>
          </div>
          <div className="detail-title">{sessionData.name}</div>
        </div>
        {!isPast && !isSMP && (
          <div className="detail-actions">
            <button className="action-btn muted">
              <X size={13} strokeWidth={2.5} /> Reject
            </button>
            <button className="action-btn">
              <Check size={13} strokeWidth={2.5} /> Accept
            </button>
          </div>
        )}
      </div>

      {/* Meta row */}
      <div className="meta-row">
        {sessionData.module && (
          <div className="meta-item"><Shield size={14} /><span>{sessionData.module}</span></div>
        )}
        <div className="meta-item"><CalendarDays size={14} /><span>{sessionData.date}</span></div>
        <div className="meta-item"><Clock size={14} /><span>{sessionData.time}</span></div>
        <div className="meta-item"><MapPin size={14} /><span>{sessionData.location}</span></div>
        {sessionData.link && (
          <div className="meta-item">
            <Link2 size={14} />
            <a
              href={sessionData.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 500 }}
            >
              Join Link
            </a>
          </div>
        )}
        <div style={{ marginLeft: 'auto' }}>
          <button className="btn btn-outline btn-sm">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn${activeTab === 'overview' ? ' active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn${activeTab === 'certificates' ? ' active' : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          <Award size={13} style={{ marginRight: 4 }} />
          Certificates
        </button>
      </div>

      {/* Certificates tab */}
      {activeTab === 'certificates' && (
        <div>
          <div className="info-banner">
            <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              Los certificados se generan automáticamente cuando el learner completa el path con una puntuación ≥ 80%.
            </span>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Learner</th>
                  <th>Issued</th>
                  <th>Score</th>
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
                          style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 28, height: 28, fontSize: 10 }}
                        >
                          {getInitials(cert.learnerName)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{cert.learnerName}</div>
                          <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{cert.learnerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>
                      {new Date(cert.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <span style={{ fontSize: 13, fontWeight: 600, color: cert.score >= 80 ? 'var(--color-success)' : 'var(--color-destructive)' }}>
                        {cert.score}%
                      </span>
                    </td>
                    <td><Badge variant="confirmed">Valid</Badge></td>
                    <td>
                      <button className="btn btn-outline btn-sm" style={{ gap: 4 }}>
                        <Download size={12} /> Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <>
          {/* Info banner for safety/info sessions */}
          {(sessionData.type === 'safety' || sessionData.type === 'info') && (
            <div className="info-banner">
              <Info size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>
                Las inscripciones {sessionData.type === 'info' ? 'Info' : 'Safety'} no generan perfil de learner
                en la app. El learner solo queda registrado en la sesión.
              </span>
            </div>
          )}

          {/* SMP: Magic Link panel */}
          {isSMP && <SMPPanel />}

          {/* Safety/Info: normal enrollment */}
          {!isSMP && (
            <>
              <div className="section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="section-title">Enrolled Learners</span>
                  <span className="badge badge-gray">{sessionData.learners.length}</span>
                </div>
                {!isPast && (
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={() => navigate(`${learnersBase}/enrol`, { state: { selectedSession: sessionData } })}
                  >
                    <Plus size={13} /> Enrol Learners
                  </button>
                )}
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Learner</th>
                      <th>Email</th>
                      {isPast  && <th>Result</th>}
                      {!isPast && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {sessionData.learners.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '32px 16px' }}>
                          No learners enrolled yet.
                        </td>
                      </tr>
                    ) : (
                      sessionData.learners.map((learner, i) => (
                        <tr key={learner.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div
                                className="driver-avatar"
                                style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 28, height: 28, fontSize: 10 }}
                              >
                                {getInitials(learner.name)}
                              </div>
                              <span style={{ fontWeight: 600, fontSize: 13 }}>{learner.name}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>{learner.email}</td>
                          {isPast && (
                            <td>
                              {learner.result
                                ? <Badge variant={learner.result?.toLowerCase()}>{learner.result}</Badge>
                                : <span style={{ color: 'var(--color-muted)', fontSize: 12 }}>—</span>
                              }
                            </td>
                          )}
                          {!isPast && (
                            <td>
                              <button
                                className="btn btn-ghost btn-icon"
                                style={{ color: 'var(--color-muted)' }}
                                title="Unenroll learner"
                                onClick={() => handleUnenroll(learner.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </>
          )}
        </>
      )}
    </div>
  )
}
