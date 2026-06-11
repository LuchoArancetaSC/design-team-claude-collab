import { useState } from 'react'
import { Home, ChevronLeft, ChevronRight, Calendar, Clock, Link2, Check, X } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import { sessions } from '../../../data'

/* ── Mock data ──────────────────────────────────────────────────── */
const pendingActions = sessions.filter(s => s.status === 'Assigned')

// Day-view timeline: John Doe's sessions on Wed Apr 22
const DAY_EVENTS = [
  { time: '09:00', name: 'Safety IT ALL 2026-02-26 SC Session', date: '26 Mar 2026', ongoing: false },
  { time: '15:30', name: 'Safety IT ALL 2026-02-26 SC Session', date: '26 Mar 2026', ongoing: true },
  { time: '11:00', name: 'Safety DE ALL 2026-02-26 SC Session', date: '26 Mar 2026', ongoing: false },
]

// Week-view data
const WEEK_DAYS = [
  { label: 'Mon',  date: '19 Apr', sessions: [{ name: 'Safety DE ALL', time: '11:00 AM', type: 'safety' }] },
  { label: 'Tue',  date: '20 Apr', sessions: [{ name: 'Information IT', time: '09:00 AM', type: 'info' }] },
  { label: 'Wed',  date: '21 Apr', sessions: [] },
  { label: 'Thu',  date: '22 Apr', sessions: [{ name: 'Safety IT ALL', time: '15:30 PM', type: 'safety' }] },
  { label: 'Fri',  date: '23 Apr', sessions: [] },
]

// Month-view: days with sessions marked
const MONTH_DAYS = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  hasSessions: [19, 20, 22].includes(i + 1),
  isToday: i + 1 === 22,
}))

const TYPE_COLORS = {
  safety: { bg: 'rgba(255,75,75,0.08)', border: 'rgba(255,75,75,0.25)', text: '#ff4b4b' },
  info:   { bg: 'rgba(79,70,229,0.08)', border: 'rgba(79,70,229,0.25)', text: '#4f46e5' },
}

/* ── Component ──────────────────────────────────────────────────── */
export default function TrainerDashboard() {
  const [view, setView]           = useState('day')
  const [accepted, setAccepted]   = useState({})
  const [rejected, setRejected]   = useState({})

  const pending = pendingActions.filter(s => !accepted[s.id] && !rejected[s.id])

  return (
    <div className="page-body">
      <PageHeader title="Trainer Hub" icon={<Home size={18} />} banner />

      <div className="trainer-main-grid">

        {/* ── Left column ── */}
        <div className="trainer-left-col">

          {/* Welcome */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <p className="trainer-welcome-name">Welcome, Ricky!</p>
            <p className="trainer-welcome-sub">
              You have <strong>4 training sessions</strong> scheduled for this week.
            </p>
          </div>

          {/* Stats */}
          <div className="trainer-stats-row">
            <div className="stat-card dark" style={{ borderRadius: 20 }}>
              <div className="stat-label">Trainer Quality Score</div>
              <div className="stat-value" style={{ fontSize: 32 }}>
                9.8<span style={{ fontSize: 15, fontWeight: 500, color: '#52525b' }}> /10</span>
              </div>
              <p style={{ marginTop: 8, fontSize: 12, color: '#71717a', lineHeight: 1.6 }}>
                Your score is based on pass rates and feedback. You're in the top 5% of trainers.
              </p>
            </div>
            <div className="stat-card" style={{ borderRadius: 20 }}>
              <div className="stat-label">Trainees Certified</div>
              <div className="stat-value">84</div>
              <p style={{ marginTop: 8, fontSize: 12, color: 'var(--color-muted)' }}>
                Last 30 days &middot; <strong>Total 40</strong>
              </p>
            </div>
            <div className="stat-card" style={{ borderRadius: 20 }}>
              <div className="stat-label">Hours Trained</div>
              <div className="stat-value">120<span style={{ fontSize: 18 }}>h</span></div>
              <p style={{ marginTop: 8, fontSize: 12, color: 'var(--color-muted)' }}>
                Monthly average &middot; <strong>10h / mo</strong>
              </p>
            </div>
          </div>

          {/* Training Schedule card */}
          <div className="card" style={{ borderRadius: 20, padding: 'var(--space-6)' }}>

            {/* Header row */}
            <div className="trainer-schedule-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Calendar size={14} color="var(--color-muted)" />
                <span className="trainer-schedule-title">Training Schedule</span>
              </div>
              {/* Segmented tabs */}
              <div className="trainer-view-tabs">
                {['Day', 'Week', 'Month'].map(v => (
                  <button
                    key={v}
                    className={`trainer-view-tab${view === v.toLowerCase() ? ' active' : ''}`}
                    onClick={() => setView(v.toLowerCase())}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Date navigation */}
            <div className="trainer-date-nav">
              <button className="btn btn-ghost btn-icon"><ChevronLeft size={14} /></button>
              <span className="trainer-date-label">Wednesday, April 22, 2026</span>
              <button className="btn btn-ghost btn-icon"><ChevronRight size={14} /></button>
              <button className="trainer-today-btn">Today</button>
            </div>

            {/* ── Day view ── */}
            {view === 'day' && (
              <div className="trainer-timeline">
                {DAY_EVENTS.map((evt) => (
                  <div key={evt.time + evt.name} className="trainer-timeline-row">
                    {/* Time label */}
                    <span className="trainer-timeline-time">{evt.time}</span>

                    {/* Vertical line + dot + event */}
                    <div className={`trainer-vline${evt.ongoing ? ' active' : ''}`}>
                      <div className={`trainer-vdot${evt.ongoing ? ' active' : ''}`} />
                      <div className={`trainer-tl-event${evt.ongoing ? ' ongoing' : ''}`}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: evt.ongoing ? '#503376' : 'var(--color-text)', lineHeight: 1.35 }}>
                            {evt.name}
                          </span>
                          {evt.ongoing && <span className="trainer-ongoing-chip">ONGOING</span>}
                        </div>
                        <div className="trainer-event-meta">
                          <span className="trainer-event-meta-item"><Calendar size={10} />{evt.date}</span>
                          <span className="trainer-event-meta-item"><Clock size={10} />{evt.time}</span>
                          <span className="trainer-event-meta-item" style={{ color: 'var(--color-accent)' }}>
                            <Link2 size={10} />Link
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Week view ── */}
            {view === 'week' && (
              <div className="trainer-week-grid">
                {WEEK_DAYS.map(d => (
                  <div key={d.label} className="trainer-week-col">
                    <div className="trainer-week-header">
                      <span className="trainer-week-day">{d.label}</span>
                      <span className="trainer-week-date">{d.date}</span>
                    </div>
                    <div className="trainer-week-events">
                      {d.sessions.length === 0
                        ? <div className="trainer-week-empty" />
                        : d.sessions.map((s, i) => {
                            const c = TYPE_COLORS[s.type] || TYPE_COLORS.info
                            return (
                              <div key={i} className="trainer-week-event" style={{ background: c.bg, borderColor: c.border }}>
                                <span style={{ fontSize: 10, fontWeight: 600, color: c.text, lineHeight: 1.3 }}>{s.name}</span>
                                <span style={{ fontSize: 10, color: 'var(--color-muted)', marginTop: 2 }}>{s.time}</span>
                              </div>
                            )
                          })
                      }
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Month view ── */}
            {view === 'month' && (
              <div>
                <div className="trainer-month-weekdays">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                    <span key={d} className="trainer-month-wday">{d}</span>
                  ))}
                </div>
                <div className="trainer-month-grid">
                  {/* Offset: April 2026 starts on Wednesday = 2 empty cells */}
                  {[0, 1].map(i => <div key={`e${i}`} />)}
                  {MONTH_DAYS.map(d => (
                    <div key={d.day} className={`trainer-month-day${d.isToday ? ' today' : ''}${d.hasSessions ? ' has-sessions' : ''}`}>
                      <span className="trainer-month-daynum">{d.day}</span>
                      {d.hasSessions && <span className="trainer-month-dot" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right column: Pending Actions ── */}
        <div className="trainer-right-col">
          <div className="trainer-assigned-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Calendar size={13} color="var(--color-muted)" />
              <span className="trainer-schedule-title">Your pending actions</span>
            </div>
            <button className="action-btn muted" style={{ fontSize: 11 }}>View all sessions</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pending.map(s => (
              <div key={s.id} className="trainer-action-card">
                {/* Title + Details */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.4, flex: 1 }}>
                    {s.name}
                  </span>
                  <button className="trainer-details-btn">Details →</button>
                </div>

                {/* Meta row */}
                <div className="trainer-event-meta" style={{ marginBottom: 10 }}>
                  <span className="trainer-event-meta-item"><Calendar size={10} />{s.date}</span>
                  <span className="trainer-event-meta-item"><Clock size={10} />{s.time}</span>
                  {s.link && (
                    <span className="trainer-event-meta-item" style={{ color: 'var(--color-accent)' }}>
                      <Link2 size={10} />Link
                    </span>
                  )}
                </div>

                {/* Actions row: Assigned badge + Reject pill + Accept pill */}
                <div className="trainer-card-actions">
                  <span className="trainer-badge-assigned">Assigned</span>
                  <button
                    className="trainer-pill-btn"
                    onClick={() => setRejected(r => ({ ...r, [s.id]: true }))}
                  >
                    <X size={10} strokeWidth={2.5} /> Reject
                  </button>
                  <button
                    className="trainer-pill-btn trainer-pill-btn--accept"
                    onClick={() => setAccepted(a => ({ ...a, [s.id]: true }))}
                  >
                    <Check size={10} strokeWidth={2.5} /> Accept
                  </button>
                </div>
              </div>
            ))}

            {Object.keys(accepted).map(id => {
              const s = pendingActions.find(x => x.id === id)
              if (!s) return null
              return (
                <div key={id} className="trainer-action-card" style={{ borderColor: '#bbf7d0', background: '#f0fdf4' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#16a34a' }}>
                    <Check size={12} /> Accepted
                  </div>
                  <div style={{ fontSize: 11, color: '#166534', marginTop: 3 }}>{s.name}</div>
                </div>
              )
            })}

            {pending.length === 0 && Object.keys(accepted).length === 0 && (
              <p style={{ color: 'var(--color-muted)', fontSize: 12, textAlign: 'center', padding: '24px 0' }}>
                No pending actions.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
