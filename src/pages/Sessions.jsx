import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronsUpDown, Copy, Check, UserMinus, UserPlus,
  ChevronDown, ChevronUp,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { sessions } from '../data'
import iconSC from '../assets/icon-sc.svg'

const TODAY_DATE = '22 Apr 2026'

const todaySessions    = sessions.filter(s => s.date === TODAY_DATE)
const upcomingSessions = sessions.filter(s => s.status !== 'Past' && s.date !== TODAY_DATE)
const pastSessions     = sessions.filter(s => s.status === 'Past')

const AVATAR_COLORS = ['#1d4ed8', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#9333ea']

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function SortIcon() {
  return (
    <ChevronsUpDown size={12} color="#032f4f" style={{ flexShrink: 0 }} />
  )
}

function TypeBadge({ type }) {
  return (
    <div style={{
      border: '1px solid #032f4f',
      borderRadius: 6,
      padding: '2px 10px',
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 600,
        fontSize: 12,
        color: '#032f4f',
        whiteSpace: 'nowrap',
      }}>
        {type}
      </span>
    </div>
  )
}

function StatusBadge({ status }) {
  const isConfirmed = status === 'Confirmed'
  const borderColor = isConfirmed ? 'rgba(237,108,0,0.55)' : '#e4e4e7'
  const textColor   = isConfirmed ? '#22af4d' : '#71717a'
  return (
    <div style={{
      border: `1px solid ${borderColor}`,
      borderRadius: 6,
      padding: '2px 10px',
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 600,
        fontSize: 12,
        color: textColor,
        whiteSpace: 'nowrap',
      }}>
        {status}
      </span>
    </div>
  )
}

function LocationCell({ location, link }) {
  const [copied, setCopied] = useState(false)
  const copyLink = () => {
    if (!link) return
    navigator.clipboard.writeText(link).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copyLink}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: 'none',
        border: 'none',
        cursor: link ? 'pointer' : 'default',
        padding: '2px 0',
      }}
    >
      {copied ? <Check size={14} color="#032f4f" /> : <Copy size={14} color="#032f4f" />}
      <span style={{
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 500,
        fontSize: 12,
        color: '#032f4f',
      }}>
        {location}
      </span>
    </button>
  )
}

/* ── Expanded learner-management panel ──────────────────────────── */
function ExpandedPanel({ session, learners, onRemove, onEnrolClick, colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan} style={{ padding: 0, background: '#f8f9fa', borderBottom: '1px solid #e4e4e7' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px 1fr',
          borderTop: '1px solid #eaeaec',
        }}>
          {/* Left: quick info */}
          <div style={{
            padding: '16px 20px',
            borderRight: '1px solid #eaeaec',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Info
            </div>
            {session.module && (
              <div>
                <div style={{ fontSize: 11, color: '#71717a', marginBottom: 2 }}>Module</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#032f4f' }}>{session.module}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 11, color: '#71717a', marginBottom: 2 }}>Trainer</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: session.trainer ? '#032f4f' : '#71717a' }}>
                {session.trainer ?? <span style={{ fontStyle: 'italic' }}>Unassigned</span>}
              </div>
            </div>
          </div>

          {/* Right: learner management */}
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Enrolled Learners
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: '#e4e4e7', color: '#71717a',
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
            {learners.length === 0 ? (
              <div style={{ fontSize: 13, color: '#71717a', fontStyle: 'italic' }}>No learners enrolled yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {learners.map((l, i) => (
                  <div key={l.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '5px 8px', borderRadius: 6,
                    background: 'white', border: '1px solid #e4e4e7',
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
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#09090b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                      <div style={{ fontSize: 11, color: '#71717a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.email}</div>
                    </div>
                    <button
                      onClick={() => onRemove(l.id)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: '#71717a', padding: '2px 4px',
                        borderRadius: 4, display: 'flex', alignItems: 'center', flexShrink: 0,
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

/* ── Styled table ─────────────────────────────────────────────────── */
function SessionTable({ rows, navigate, sessionBase, learnersBase, localLearners, setLocalLearners, expandedId, setExpandedId, showResults }) {
  const toggleExpand = id => setExpandedId(prev => prev === id ? null : id)
  const removeLearner = (sid, lid) =>
    setLocalLearners(prev => ({ ...prev, [sid]: prev[sid].filter(l => l.id !== lid) }))

  const thStyle = {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 500,
    fontSize: 14,
    color: '#032f4f',
    padding: '0 8px',
    height: 38,
    textAlign: 'left',
    whiteSpace: 'nowrap',
    background: 'transparent',
    border: 'none',
  }

  const colSpan = showResults ? 7 : 6

  return (
    <div style={{
      border: '1px solid #e4e4e7',
      borderRadius: 6,
      overflow: 'hidden',
      width: '100%',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e4e4e7' }}>
            <th style={{ ...thStyle, width: 140 }}>Type</th>
            <th style={{ ...thStyle }}>Session Name</th>
            <th style={{ ...thStyle, width: 130 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                Status <SortIcon />
              </div>
            </th>
            <th style={{ ...thStyle, width: 160 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                Date &amp; Time <SortIcon />
              </div>
            </th>
            <th style={{ ...thStyle, width: 140 }}>Location</th>
            <th style={{ ...thStyle, width: 160 }}>Trainer / Learners</th>
            {showResults && <th style={{ ...thStyle, width: 120 }}>Results</th>}
            <th style={{ ...thStyle, width: 110 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((session, i) => {
            const isExpanded = expandedId === session.id
            const learners   = localLearners[session.id] ?? []
            const isAlt = i % 2 === 1
            const rowBg     = isAlt ? '#f5f5f5' : 'white'
            const rowBorder = isAlt ? '#e6e7ea' : '#e4e4e7'

            return (
              <>
                <tr
                  key={session.id}
                  style={{
                    background: isExpanded ? '#f8f9fa' : rowBg,
                    borderLeft: `1px solid ${rowBorder}`,
                    borderRight: `1px solid ${rowBorder}`,
                    cursor: 'pointer',
                  }}
                  onClick={() => showResults ? navigate(`${sessionBase}/${session.id}`) : toggleExpand(session.id)}
                >
                  {/* Type */}
                  <td style={{ height: 64, padding: '8px' }}>
                    <TypeBadge type={session.type} />
                  </td>
                  {/* Session Name */}
                  <td style={{ padding: '8px' }}>
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 13, color: '#09090b' }}>
                      {session.name}
                    </span>
                  </td>
                  {/* Status */}
                  <td style={{ padding: '8px' }}>
                    <StatusBadge status={session.status} />
                  </td>
                  {/* Date & Time */}
                  <td style={{ padding: '8px' }}>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 13, color: '#09090b', lineHeight: '20px' }}>
                      {session.date}
                    </div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: 11, color: '#71717a', lineHeight: '18px' }}>
                      {session.time}
                    </div>
                  </td>
                  {/* Location */}
                  <td style={{ padding: '8px' }}>
                    <LocationCell location={session.location} link={session.link} />
                  </td>
                  {/* Trainer / Learners */}
                  <td style={{ padding: '8px' }}>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, color: '#3f3f46', fontWeight: 500 }}>
                      {session.trainer
                        ? session.trainer
                        : <span style={{ color: '#71717a', fontStyle: 'italic' }}>Unassigned</span>
                      }
                    </div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11, color: '#71717a', marginTop: 2 }}>
                      {learners.length} learner{learners.length !== 1 ? 's' : ''}
                    </div>
                  </td>
                  {/* Results (past sessions) */}
                  {showResults && (
                    <td style={{ padding: '8px' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {session.learners?.map(l => (
                          <div key={l.id} style={{
                            border: '1px solid rgba(237,108,0,0.55)',
                            borderRadius: 6,
                            padding: '2px 8px',
                            fontSize: 11,
                            fontWeight: 600,
                            color: l.result?.toLowerCase() === 'pass' ? '#22af4d' : '#ef4444',
                            fontFamily: 'Poppins, sans-serif',
                          }}>
                            {l.result}
                          </div>
                        ))}
                      </div>
                    </td>
                  )}
                  {/* Actions */}
                  <td style={{ padding: '8px' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => navigate(`${sessionBase}/${session.id}`)}
                        style={{
                          background: '#032f4f',
                          color: 'white',
                          border: 'none',
                          borderRadius: 12,
                          height: 24,
                          padding: '0 10px',
                          fontFamily: 'Inter, Poppins, sans-serif',
                          fontWeight: 500,
                          fontSize: 12,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Details →
                      </button>
                      {!showResults && (
                        <div
                          style={{ color: '#71717a', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                          onClick={e => { e.stopPropagation(); toggleExpand(session.id) }}
                        >
                          {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>

                {isExpanded && !showResults && (
                  <ExpandedPanel
                    key={`exp-${session.id}`}
                    session={session}
                    learners={learners}
                    onRemove={lid => removeLearner(session.id, lid)}
                    onEnrolClick={() => navigate(`${learnersBase}/enrol`, { state: { selectedSession: session } })}
                    colSpan={colSpan}
                  />
                )}
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────────── */
export default function Sessions() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const sessionBase  = location.pathname.startsWith('/admin') ? '/admin/sessions' : '/sessions'
  const learnersBase = location.pathname.startsWith('/admin') ? '/admin/learners' : '/learners'

  const [activeTab, setActiveTab]   = useState(todaySessions.length > 0 ? 'today' : 'upcoming')
  const [expandedId, setExpandedId] = useState(null)
  const [localLearners, setLocalLearners] = useState(() =>
    Object.fromEntries(sessions.map(s => [s.id, (s.learners ?? []).map(l => ({ ...l }))]))
  )

  const sharedTableProps = { navigate, sessionBase, learnersBase, localLearners, setLocalLearners, expandedId, setExpandedId }

  return (
    <div style={{ background: '#f6f8fc', minHeight: '100vh', padding: 0 }}>
      {/* Banner */}
      <PageHeader
        title="Sessions"
        icon={<img src={iconSC} alt="" style={{ width: 22, height: 22 }} />}
        banner
      />

      <div style={{ padding: '0 24px 24px' }}>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid #e4e4e7',
          marginBottom: 20,
        }}>
          {[
            { id: 'today',    label: 'Today',             count: todaySessions.length },
            { id: 'upcoming', label: 'Upcoming Sessions',  count: upcomingSessions.length },
            { id: 'past',     label: 'Past Sessions',      count: pastSessions.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: 16,
                color: activeTab === tab.id ? '#032f4f' : '#707078',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #032f4f' : '2px solid transparent',
                padding: '12px 20px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {tab.label}
              <span style={{
                background: activeTab === tab.id ? '#032f4f' : '#e4e4e7',
                color: activeTab === tab.id ? 'white' : '#71717a',
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 700,
                padding: '1px 7px',
                lineHeight: '16px',
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Today */}
        {activeTab === 'today' && (
          todaySessions.length === 0
            ? <p style={{ fontFamily: 'Poppins, sans-serif', color: '#71717a', fontSize: 14, fontStyle: 'italic' }}>No sessions today.</p>
            : <SessionTable rows={todaySessions} showResults={false} {...sharedTableProps} />
        )}

        {/* Upcoming */}
        {activeTab === 'upcoming' && (
          <SessionTable rows={upcomingSessions} showResults={false} {...sharedTableProps} />
        )}

        {/* Past */}
        {activeTab === 'past' && (
          <SessionTable rows={pastSessions} showResults={true} {...sharedTableProps} />
        )}
      </div>
    </div>
  )
}
