import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  CalendarDays, Clock, MapPin, ChevronsUpDown, FileText, ArrowRight,
  ChevronDown, ChevronUp, X, Plus, Link2, Copy, Check, UserMinus, UserPlus,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import SessionTypeBadge from '../components/SessionTypeBadge'
import { sessions } from '../data'
import bannerSessions from '../assets/banner-sessions.svg'

const TODAY_DATE = '22 Apr 2026'

const todaySessions    = sessions.filter(s => s.date === TODAY_DATE)
const upcomingSessions = sessions.filter(s => s.status !== 'Past' && s.date !== TODAY_DATE)
const pastSessions     = sessions.filter(s => s.status === 'Past')

const AVATAR_COLORS = ['#1d4ed8', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#9333ea']

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function SortIcon() {
  return <ChevronsUpDown size={12} color="var(--color-muted)" />
}

/* ── Expanded learner-management panel ──────────────────────────── */
function ExpandedPanel({ session, learners, onRemove, onEnrolClick, colSpan }) {
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    if (!session.link) return
    navigator.clipboard.writeText(session.link).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <tr>
      <td
        colSpan={colSpan}
        style={{ padding: 0, background: '#f8f9fa', borderBottom: '1px solid var(--color-border)' }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          gap: 0,
          borderTop: '1px solid #eaeaec',
        }}>

          {/* Left: session quick info */}
          <div style={{
            padding: '16px 20px',
            borderRight: '1px solid #eaeaec',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Info
            </div>

            {session.module && (
              <div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 2 }}>Module</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{session.module}</div>
              </div>
            )}

            <div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 2 }}>Trainer</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: session.trainer ? 'var(--color-text)' : 'var(--color-muted)' }}>
                {session.trainer ?? <span style={{ fontStyle: 'italic' }}>Unassigned</span>}
              </div>
            </div>

            {session.link ? (
              <div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 4 }}>Join Link</div>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ gap: 4, fontSize: 11 }}
                  onClick={copyLink}
                >
                  {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy link</>}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 2 }}>Link</div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', fontStyle: 'italic' }}>Not assigned yet</div>
              </div>
            )}
          </div>

          {/* Right: learner management */}
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Enrolled Learners
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: '#e4e4e7', color: 'var(--color-muted)',
                  padding: '1px 8px', borderRadius: 99,
                }}>
                  {learners.length}
                </span>
                <button
                  className="btn btn-dark btn-sm"
                  style={{ gap: 4 }}
                  onClick={onEnrolClick}
                >
                  <UserPlus size={12} /> Enrol Learners
                </button>
              </div>
            </div>

            {/* Learner list */}
            {learners.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--color-muted)', fontStyle: 'italic' }}>
                No learners enrolled yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {learners.map((l, i) => (
                  <div key={l.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '5px 8px', borderRadius: 6,
                    background: 'white', border: '1px solid var(--color-border)',
                  }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                      background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 700, color: 'white',
                    }}>
                      {getInitials(l.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.email}</div>
                    </div>
                    <button
                      onClick={() => onRemove(l.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--color-muted)', padding: '2px 4px',
                        borderRadius: 4, display: 'flex', alignItems: 'center',
                        flexShrink: 0,
                      }}
                      title="Remove learner"
                    >
                      <UserMinus size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </td>
    </tr>
  )
}

/* ── Main page ──────────────────────────────────────────────────── */
export default function Sessions() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const sessionBase  = location.pathname.startsWith('/admin') ? '/admin/sessions' : '/sessions'
  const learnersBase = location.pathname.startsWith('/admin') ? '/admin/learners' : '/learners'

  const [activeTab, setActiveTab]   = useState('upcoming')
  const [expandedId, setExpandedId] = useState(null)
  const [localLearners, setLocalLearners] = useState(() =>
    Object.fromEntries(sessions.map(s => [s.id, (s.learners ?? []).map(l => ({ ...l }))]))
  )

  const toggleExpand = id =>
    setExpandedId(prev => prev === id ? null : id)

  const removeLearner = (sid, lid) =>
    setLocalLearners(prev => ({ ...prev, [sid]: prev[sid].filter(l => l.id !== lid) }))

  /* ── Reusable active-session row ── */
  const renderActiveRow = (session) => {
    const isExpanded = expandedId === session.id
    const learners   = localLearners[session.id] ?? []

    return (
      <>
        <tr
          key={session.id}
          style={{ cursor: 'pointer', background: isExpanded ? '#f8f9fa' : undefined }}
          onClick={() => toggleExpand(session.id)}
        >
          <td><SessionTypeBadge type={session.type} /></td>
          <td>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{session.name}</span>
          </td>
          <td><Badge variant={session.status}>{session.status}</Badge></td>
          <td>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{session.date}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>
              <Clock size={11} /> {session.time}
            </div>
          </td>
          <td>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
              <MapPin size={12} color="var(--color-muted)" /> {session.location}
            </span>
          </td>
          <td>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              {session.trainer
                ? `${session.trainer} / ${learners.length} learners`
                : <span style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>Unassigned · {learners.length} learners</span>
              }
            </div>
          </td>
          <td onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                className="btn btn-dark btn-sm btn-pill"
                onClick={() => navigate(`${sessionBase}/${session.id}`)}
              >
                Details <ArrowRight size={12} />
              </button>
              <div style={{ color: 'var(--color-muted)', display: 'flex', alignItems: 'center' }}
                onClick={e => { e.stopPropagation(); toggleExpand(session.id) }}
              >
                {isExpanded
                  ? <ChevronUp size={15} style={{ cursor: 'pointer' }} />
                  : <ChevronDown size={15} style={{ cursor: 'pointer' }} />
                }
              </div>
            </div>
          </td>
        </tr>

        {isExpanded && (
          <ExpandedPanel
            session={session}
            learners={learners}
            onRemove={lid => removeLearner(session.id, lid)}
            onEnrolClick={() => navigate(`${learnersBase}/enrol`, { state: { selectedSession: session } })}
            colSpan={7}
          />
        )}
      </>
    )
  }

  const upcomingHeaders = (
    <tr>
      <th>Type</th>
      <th>Session Name</th>
      <th><span className="th-sortable">Status <SortIcon /></span></th>
      <th><span className="th-sortable">Date &amp; Time <SortIcon /></span></th>
      <th>Location</th>
      <th>Trainer / Learners</th>
      <th>Actions</th>
    </tr>
  )

  return (
    <div className="page-body">
      <PageHeader title="Sessions" icon={<CalendarDays size={18} color="white" />} banner={bannerSessions} />

      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Training Sessions</div>
        <div className="page-subtitle">Manage and track your learners' training schedule.</div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab-btn${activeTab === 'today'    ? ' active' : ''}`} onClick={() => setActiveTab('today')}>Today</button>
        <button className={`tab-btn${activeTab === 'upcoming' ? ' active' : ''}`} onClick={() => setActiveTab('upcoming')}>Upcoming Sessions</button>
        <button className={`tab-btn${activeTab === 'past'     ? ' active' : ''}`} onClick={() => setActiveTab('past')}>Past Sessions</button>
      </div>

      {/* Today */}
      {activeTab === 'today' && (
        <>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 16 }}>
            Wednesday, 22 Apr 2026 &mdash; {todaySessions.length} session{todaySessions.length !== 1 ? 's' : ''} today
          </div>
          <div className="table-wrapper">
            <table>
              <thead>{upcomingHeaders}</thead>
              <tbody>{todaySessions.map(s => renderActiveRow(s))}</tbody>
            </table>
          </div>
        </>
      )}

      {/* Upcoming */}
      {activeTab === 'upcoming' && (
        <div className="table-wrapper">
          <table>
            <thead>{upcomingHeaders}</thead>
            <tbody>{upcomingSessions.map(s => renderActiveRow(s))}</tbody>
          </table>
        </div>
      )}

      {/* Past */}
      {activeTab === 'past' && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Session Name</th>
                <th><span className="th-sortable">Date &amp; Time <SortIcon /></span></th>
                <th>Location</th>
                <th>Trainer / Learners</th>
                <th>Results</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pastSessions.map(session => (
                <tr
                  key={session.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`${sessionBase}/${session.id}`)}
                >
                  <td><SessionTypeBadge type={session.type} /></td>
                  <td><span style={{ fontWeight: 600, fontSize: 13 }}>{session.name}</span></td>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{session.date}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>
                      <Clock size={11} /> {session.time}
                    </div>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                      <MapPin size={12} color="var(--color-muted)" /> {session.location}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                      {session.trainer} / {session.learners.length} learners
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {session.learners.map(l => (
                        <Badge key={l.id} variant={l.result?.toLowerCase()}>{l.result}</Badge>
                      ))}
                    </div>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => navigate(`${sessionBase}/${session.id}`)}
                    >
                      <FileText size={12} /> View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
