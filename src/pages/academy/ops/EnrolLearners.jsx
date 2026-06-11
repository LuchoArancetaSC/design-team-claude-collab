import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Users, UserPlus, ChevronLeft, X, Upload, Link2, Copy, Check,
  CalendarDays, MapPin, Clock, ArrowRight,
} from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import SessionTypeBadge from '../../../components/SessionTypeBadge'
import { sessions } from '../../../data'

const availableSessions = sessions.filter(s => s.status !== 'Past')

/* ── Step indicator ─────────────────────────────────────────────── */
function StepIndicator({ step }) {
  const steps = [
    { n: 1, label: 'Session' },
    { n: 2, label: 'Learners' },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 28 }}>
      {steps.map((s, i) => (
        <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700,
              background: step > s.n ? 'var(--color-secondary)' : step === s.n ? 'var(--color-dark)' : '#e4e4e7',
              color: step >= s.n ? 'white' : 'var(--color-muted)',
              transition: 'background 0.2s',
            }}>
              {step > s.n ? <Check size={13} strokeWidth={3} /> : s.n}
            </div>
            <span style={{
              fontSize: 13, fontWeight: step === s.n ? 600 : 400,
              color: step >= s.n ? 'var(--color-text)' : 'var(--color-muted)',
            }}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              width: 40, height: 1, margin: '0 12px',
              background: step > s.n ? 'var(--color-secondary)' : 'var(--color-border)',
              transition: 'background 0.2s',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

/* ── Main page ──────────────────────────────────────────────────── */
export default function EnrolLearners() {
  const navigate = useNavigate()
  const location = useLocation()
  const learnersBase  = location.pathname.startsWith('/academy/admin') ? '/academy/admin/learners' : '/academy/learners'
  const sessionsBase  = location.pathname.startsWith('/academy/admin') ? '/academy/admin/sessions' : '/academy/sessions'

  // Pre-selected session when coming from the Sessions section
  const preSession    = location.state?.selectedSession ?? null
  const fromSession   = !!preSession

  const cancelDest = fromSession ? `${sessionsBase}/${preSession.id}` : learnersBase

  const [step, setStep]             = useState(preSession ? 2 : 1)
  const [selectedSession, setSelectedSession] = useState(preSession)
  const [tab, setTab]               = useState('manual')
  const [emailInput, setEmailInput] = useState('')
  const [emails, setEmails]         = useState([])
  const [magicLink, setMagicLink]   = useState(null)
  const [copied, setCopied]         = useState(false)
  const [done, setDone]             = useState(false)

  const addEmail = () => {
    const val = emailInput.trim()
    if (val && !emails.includes(val)) setEmails(p => [...p, val])
    setEmailInput('')
  }
  const removeEmail = email => setEmails(p => p.filter(e => e !== email))
  const generateLink = () => setMagicLink('https://academy.serviceclub.com/join/token_xK9mP2')
  const copyLink = () => {
    navigator.clipboard.writeText(magicLink).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { id: 'manual', label: 'Manual / Email' },
    { id: 'csv',    label: 'CSV Import'      },
    { id: 'magic',  label: 'Magic Link'      },
  ]

  /* ── Success screen ── */
  if (done) {
    return (
      <div className="page-body">
        <PageHeader title="Enrol Learners" icon={<Users size={18} color="white" />} banner />
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '64px 24px', textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(5,150,105,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Check size={26} color="var(--color-success)" />
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, fontFamily: "'Poppins', sans-serif" }}>
            Learners enrolled!
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 6, maxWidth: 360, lineHeight: 1.65 }}>
            {emails.length > 0
              ? `${emails.length} learner${emails.length > 1 ? 's' : ''} added to`
              : 'Magic link generated for'}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 24 }}>
            {selectedSession?.name}
          </div>
          <button className="btn btn-dark" onClick={() => navigate(fromSession ? `${sessionsBase}/${preSession.id}` : learnersBase)}>
            {fromSession ? 'Back to Session' : 'Back to Learners'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-body">
      <PageHeader title="Enrol Learners" icon={<Users size={18} color="white" />} banner />

      <button
        className="back-link"
        onClick={() => {
          if (step === 1) navigate(learnersBase)
          else if (fromSession) navigate(`${sessionsBase}/${preSession.id}`)
          else setStep(1)
        }}
      >
        <ChevronLeft size={15} />
        {step === 1 ? 'Learners' : fromSession ? 'Back to Session' : 'Select Session'}
      </button>

      <div style={{ marginBottom: 24 }}>
        <div className="page-title">Enrol Learners</div>
        <div className="page-subtitle">Assign learners to a training session.</div>
      </div>

      <StepIndicator step={step} />

      {/* ── Step 1: Select session ── */}
      {step === 1 && (
        <div>
          <div className="section-title" style={{ marginBottom: 16, textAlign: 'center' }}>
            Select a session
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: 12,
            marginBottom: 28,
          }}>
            {availableSessions.map(session => {
              const isSelected = selectedSession?.id === session.id
              return (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  style={{
                    border: `1.5px solid ${isSelected ? 'var(--color-dark)' : 'var(--color-border)'}`,
                    borderRadius: 10,
                    padding: '16px 20px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(9,9,11,0.03)' : 'white',
                    display: 'flex', alignItems: 'center', gap: 16,
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  {/* Radio dot */}
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${isSelected ? 'var(--color-dark)' : '#d1d5db'}`,
                    background: isSelected ? 'var(--color-dark)' : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}>
                    {isSelected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'white' }} />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
                        {session.name}
                      </span>
                      <SessionTypeBadge type={session.type} />
                      <Badge variant={session.status}>{session.status}</Badge>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-muted)' }}>
                        <CalendarDays size={12} /> {session.date}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-muted)' }}>
                        <Clock size={12} /> {session.time}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--color-muted)' }}>
                        <MapPin size={12} /> {session.location}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                      {session.learners.length} enrolled
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <button className="btn btn-outline" onClick={() => navigate(cancelDest)}>Cancel</button>
            <button
              className="btn btn-dark"
              disabled={!selectedSession}
              style={{ opacity: selectedSession ? 1 : 0.45 }}
              onClick={() => setStep(2)}
            >
              Continue <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Add learners ── */}
      {step === 2 && (
        <div style={{ maxWidth: 560 }}>

          {/* Selected session summary */}
          <div style={{
            background: '#f4f4f5', borderRadius: 8, padding: '12px 16px',
            marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <CalendarDays size={16} color="var(--color-muted)" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{selectedSession.name}</div>
              <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 1 }}>
                {selectedSession.date} · {selectedSession.time} · {selectedSession.location}
              </div>
            </div>
            {!fromSession && (
              <button
                className="btn btn-ghost btn-sm"
                style={{ fontSize: 11, color: 'var(--color-muted)', flexShrink: 0 }}
                onClick={() => setStep(1)}
              >
                Change
              </button>
            )}
          </div>

          <div className="card" style={{ padding: 24 }}>
            {/* Tab bar */}
            <div className="tabs" style={{ marginBottom: 20 }}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  className={`tab-btn${tab === t.id ? ' active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Manual / Email */}
            {tab === 'manual' && (
              <div>
                <div className="form-label" style={{ marginBottom: 8 }}>Add learner emails</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input
                    className="input"
                    type="email"
                    placeholder="learner@company.com"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addEmail()}
                    style={{ flex: 1 }}
                    autoFocus
                  />
                  <button className="btn btn-dark btn-sm" onClick={addEmail}>Add</button>
                </div>

                {emails.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                    {emails.map(email => (
                      <div key={email} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 12px', background: '#f4f4f5', borderRadius: 6, fontSize: 13,
                      }}>
                        <span>{email}</span>
                        <button
                          className="btn btn-ghost btn-icon"
                          style={{ width: 20, height: 20 }}
                          onClick={() => removeEmail(email)}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 16 }}>
                    No emails added yet. Type an email and press Enter or click Add.
                  </div>
                )}

                <div style={{
                  display: 'flex', gap: 10, justifyContent: 'flex-end',
                  paddingTop: 16, borderTop: '1px solid var(--color-border)',
                }}>
                  <button className="btn btn-outline" onClick={() => navigate(cancelDest)}>Cancel</button>
                  <button
                    className="btn btn-dark"
                    disabled={emails.length === 0}
                    style={{ opacity: emails.length > 0 ? 1 : 0.45 }}
                    onClick={() => setDone(true)}
                  >
                    <UserPlus size={14} /> Enrol {emails.length > 0 ? `${emails.length} learner${emails.length > 1 ? 's' : ''}` : 'learners'}
                  </button>
                </div>
              </div>
            )}

            {/* CSV Import */}
            {tab === 'csv' && (
              <div>
                <div
                  style={{
                    border: '2px dashed var(--color-border)',
                    borderRadius: 8, padding: '40px 24px',
                    textAlign: 'center', background: '#fafafa',
                    marginBottom: 16, cursor: 'pointer',
                  }}
                  onDragOver={e => e.preventDefault()}
                >
                  <Upload size={28} color="var(--color-muted)" style={{ marginBottom: 10 }} />
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Drop CSV file here</div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 12 }}>or click to browse</div>
                  <button className="btn btn-outline btn-sm">Browse file</button>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', textAlign: 'center', marginBottom: 16 }}>
                  Need a template?{' '}
                  <button style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                    Download template
                  </button>
                </div>
                <div style={{
                  display: 'flex', gap: 10, justifyContent: 'flex-end',
                  paddingTop: 16, borderTop: '1px solid var(--color-border)',
                }}>
                  <button className="btn btn-outline" onClick={() => navigate(cancelDest)}>Cancel</button>
                  <button className="btn btn-dark" style={{ opacity: 0.45 }} disabled>Import learners</button>
                </div>
              </div>
            )}

            {/* Magic Link */}
            {tab === 'magic' && (
              <div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
                  Generate a shareable magic link. Anyone with the link can register as a learner for this session.
                  The link expires automatically after <strong>7 days</strong>.
                </div>

                {!magicLink ? (
                  <button className="btn btn-dark" style={{ width: '100%' }} onClick={generateLink}>
                    <Link2 size={14} /> Generate Magic Link
                  </button>
                ) : (
                  <div>
                    <div style={{ background: '#f4f4f5', borderRadius: 8, padding: '12px 14px', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 12, fontFamily: 'monospace', wordBreak: 'break-all', color: 'var(--color-text)' }}>
                          {magicLink}
                        </span>
                        <button className="btn btn-dark btn-sm btn-pill" style={{ flexShrink: 0 }} onClick={copyLink}>
                          {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
                      Active · Expires in 7 days
                    </div>
                  </div>
                )}

                <div style={{
                  display: 'flex', justifyContent: 'flex-end',
                  paddingTop: 20, marginTop: 4, borderTop: '1px solid var(--color-border)',
                }}>
                  <button
                    className="btn btn-dark"
                    style={{ opacity: magicLink ? 1 : 0.45 }}
                    disabled={!magicLink}
                    onClick={() => setDone(true)}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
