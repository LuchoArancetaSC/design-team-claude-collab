import { useState, useRef } from 'react'
import { Users, Upload, Link2, Send, Check, Copy, X } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'

/* ── Mock data ───────────────────────────────────────────────────── */
const UPCOMING = [
  { id: 1, name: 'Safety IT All 2026 – Cohort 01',     course: 'Safety IT All Module',  org: 'Amazon DSP DE', size: 15, date: '22 Apr 2026', hasRoster: false },
  { id: 2, name: 'Information IT 2026 – Cohort 02',    course: 'Information IT 2026',   org: 'Amazon DSP IT', size: 8,  date: '24 Apr 2026', hasRoster: true  },
  { id: 3, name: 'Safety DE 2026 – Cohort 03',         course: 'Safety IT All Module',  org: 'Amazon DSP DE', size: 20, date: '01 May 2026', hasRoster: false },
  { id: 4, name: 'Onboarding Basics 2026 – Cohort 01', course: 'Onboarding Basics',     org: 'Amazon DSP UK', size: 11, date: '05 May 2026', hasRoster: false },
]

const PAST = [
  { id: 10, name: 'Safety IT All 2025 – Cohort 01',    course: 'Safety IT All Module', org: 'Amazon DSP DE', size: 12, date: '15 Jan 2026', completion: 91 },
  { id: 11, name: 'Information IT 2025 – Cohort 01',   course: 'Information IT 2026',  org: 'Amazon DSP IT', size: 9,  date: '20 Feb 2026', completion: 88 },
  { id: 12, name: 'Onboarding Basics 2025 – Cohort 01',course: 'Onboarding Basics',    org: 'Amazon DSP DE', size: 25, date: '10 Mar 2026', completion: 76 },
  { id: 13, name: 'Safety DE 2025 – Cohort 02',        course: 'Safety IT All Module', org: 'Amazon DSP UK', size: 18, date: '22 Mar 2026', completion: 95 },
]

const genLink = (id) => {
  const hash = btoa(`cohort-${id}`).replace(/[^A-Z0-9]/gi, '').slice(0, 8).toUpperCase()
  return `https://academy.serviceclub.com/join/${hash}`
}

/* ── Component ───────────────────────────────────────────────────── */
export default function Cohorts() {
  const [tab, setTab]           = useState('upcoming')
  const [cohorts, setCohorts]   = useState(UPCOMING)
  const [invitePanel, setPanel] = useState(null) // cohort obj | null
  const [uploadId, setUploadId] = useState(null)
  const [links]                 = useState(() => Object.fromEntries(UPCOMING.map(c => [c.id, genLink(c.id)])))
  const [copied, setCopied]     = useState(null)
  const [sentIds, setSentIds]   = useState({})
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)

  const copyLink = (id) => {
    navigator.clipboard?.writeText(links[id]).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const sendInvitations = (cohortId) => {
    setSentIds(p => ({ ...p, [cohortId]: true }))
    setTimeout(() => {
      setSentIds(p => { const n = { ...p }; delete n[cohortId]; return n })
      setPanel(null)
    }, 2200)
  }

  const confirmRoster = (id) => {
    setCohorts(prev => prev.map(c => c.id === id ? { ...c, hasRoster: true } : c))
    setUploadId(null)
    setDragOver(false)
  }

  return (
    <div className="page-body">
      <PageHeader title="Cohorts" icon={<Users size={18} />} banner />

      {/* ── Tabs ── */}
      <div className="trainer-view-tabs" style={{ marginBottom: 20, display: 'inline-flex' }}>
        {[['upcoming', 'Upcoming'], ['past', 'Past']].map(([val, label]) => (
          <button
            key={val}
            className={`trainer-view-tab${tab === val ? ' active' : ''}`}
            onClick={() => { setTab(val); setPanel(null); setUploadId(null) }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Invitation link panel ── */}
      {invitePanel && tab === 'upcoming' && (
        <div className="smp-panel cohort-invite-panel">
          <div className="smp-panel-header">
            <div>
              <span style={{ fontWeight: 700 }}>Invitation Link</span>
              <span style={{ color: 'var(--color-muted)', fontSize: 13, marginLeft: 8 }}>
                {invitePanel.name}
              </span>
            </div>
            <button className="btn btn-ghost btn-icon" onClick={() => setPanel(null)}>
              <X size={14} />
            </button>
          </div>
          <p className="smp-panel-desc">
            Share this link with learners or send it directly to SMP emails.
          </p>

          {/* Link row */}
          <div className="cohort-link-row">
            <code className="cohort-link-code">{links[invitePanel.id]}</code>
            <button
              className="action-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 84 }}
              onClick={() => copyLink(invitePanel.id)}
            >
              {copied === invitePanel.id
                ? <><Check size={12} /> Copied!</>
                : <><Copy size={12} /> Copy link</>
              }
            </button>
          </div>

          {/* Send button */}
          <button
            className="btn btn-dark"
            style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}
            onClick={() => sendInvitations(invitePanel.id)}
            disabled={!!sentIds[invitePanel.id]}
          >
            {sentIds[invitePanel.id]
              ? <><Check size={14} /> Invitations sent!</>
              : <><Send size={14} /> Send to SMP emails</>
            }
          </button>
        </div>
      )}

      {/* ── Upload roster panel ── */}
      {uploadId && tab === 'upcoming' && (
        <div className="smp-panel" style={{ marginBottom: 20 }}>
          <div className="smp-panel-header">
            <span>Upload Learner Roster</span>
            <button className="btn btn-ghost btn-icon" onClick={() => setUploadId(null)}><X size={14} /></button>
          </div>
          <div
            className={`smp-dropzone${dragOver ? ' smp-dropzone--over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); confirmRoster(uploadId) }}
            onClick={() => { fileRef.current?.click(); confirmRoster(uploadId) }}
          >
            <Upload size={22} color="#a1a1aa" />
            <p className="smp-drop-hint">
              Drag & drop a CSV roster, or <strong style={{ color: 'var(--color-accent)' }}>click to browse</strong>
            </p>
            <p className="smp-drop-sub">Columns: name, email</p>
            <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} />
          </div>
        </div>
      )}

      {/* ── Upcoming table ── */}
      {tab === 'upcoming' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cohort</th>
                <th>Course</th>
                <th>Org</th>
                <th>Learners</th>
                <th>Date</th>
                <th>Roster</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</td>
                  <td style={{ fontSize: 13, color: 'var(--color-muted)' }}>{c.course}</td>
                  <td style={{ fontSize: 13 }}>{c.org}</td>
                  <td style={{ fontSize: 13 }}>{c.size}</td>
                  <td style={{ fontSize: 13 }}>{c.date}</td>
                  <td>
                    {c.hasRoster
                      ? <span className="cohort-roster-ready"><Check size={11} /> Ready</span>
                      : (
                        <button
                          className="action-btn muted"
                          style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                          onClick={() => { setUploadId(c.id); setPanel(null) }}
                        >
                          <Upload size={11} /> Upload
                        </button>
                      )
                    }
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        className={`action-btn${invitePanel?.id === c.id ? ' smp-btn-active' : ''}`}
                        style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                        onClick={() => { setPanel(invitePanel?.id === c.id ? null : c); setUploadId(null) }}
                      >
                        <Link2 size={11} /> Invitation link
                      </button>
                      {sentIds[c.id] && (
                        <span style={{ fontSize: 11, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Check size={11} /> Sent
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Past table ── */}
      {tab === 'past' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cohort</th>
                <th>Course</th>
                <th>Org</th>
                <th>Learners</th>
                <th>Date</th>
                <th>Completion</th>
              </tr>
            </thead>
            <tbody>
              {PAST.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</td>
                  <td style={{ fontSize: 13, color: 'var(--color-muted)' }}>{c.course}</td>
                  <td style={{ fontSize: 13 }}>{c.org}</td>
                  <td style={{ fontSize: 13 }}>{c.size}</td>
                  <td style={{ fontSize: 13 }}>{c.date}</td>
                  <td>
                    <div className="cohort-progress-row">
                      <div className="cohort-progress-bar">
                        <div
                          className="cohort-progress-fill"
                          style={{ width: `${c.completion}%` }}
                        />
                      </div>
                      <span className="cohort-progress-pct">{c.completion}%</span>
                    </div>
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
