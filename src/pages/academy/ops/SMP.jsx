import { useState, useRef } from 'react'
import { Users2, Upload, Plus, Send, Check, X, Search, Mail } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'

/* ── Mock data ───────────────────────────────────────────────────── */
const INITIAL_SMPS = [
  { id: 1,  name: 'Hans Müller',    email: 'hans@amazon-de.com',    station: 'Amazon DSP DE – Munich',    status: 'active',   invitedAt: '10 Apr 2026' },
  { id: 2,  name: 'Klaus Weber',    email: 'klaus@amazon-de.com',   station: 'Amazon DSP DE – Berlin',    status: 'invited',  invitedAt: '14 Apr 2026' },
  { id: 3,  name: 'Anna Schmidt',   email: 'anna@amazon-de.com',    station: 'Amazon DSP DE – Hamburg',   status: 'pending',  invitedAt: '—' },
  { id: 4,  name: 'Franz Bauer',    email: 'franz@amazon-de.com',   station: 'Amazon DSP DE – Munich',    status: 'active',   invitedAt: '10 Apr 2026' },
  { id: 5,  name: 'Maria Klein',    email: 'maria@amazon-de.com',   station: 'Amazon DSP IT – Milan',     status: 'invited',  invitedAt: '15 Apr 2026' },
  { id: 6,  name: 'Thomas Braun',   email: 'thomas@amazon-it.com',  station: 'Amazon DSP IT – Rome',      status: 'pending',  invitedAt: '—' },
  { id: 7,  name: 'Laura Rossi',    email: 'laura@amazon-it.com',   station: 'Amazon DSP IT – Turin',     status: 'active',   invitedAt: '09 Apr 2026' },
]

const IMPORT_PREVIEW = [
  { name: 'Rudi Hartmann',  email: 'rudi@amazon-de.com',    station: 'Amazon DSP DE – Stuttgart' },
  { name: 'Sophie Becker',  email: 'sophie@amazon-de.com',  station: 'Amazon DSP DE – Frankfurt' },
  { name: 'Marco Ferrari',  email: 'marco@amazon-it.com',   station: 'Amazon DSP IT – Naples' },
]

const STATUS_MAP = {
  active:  { label: 'Active',  cls: 'badge badge-confirmed' },
  invited: { label: 'Invited', cls: 'badge badge-assigned' },
  pending: { label: 'Pending', cls: 'badge smp-badge-pending' },
}

let nextId = 20

/* ── Component ───────────────────────────────────────────────────── */
export default function SMP() {
  const [smps, setSmps]         = useState(INITIAL_SMPS)
  const [search, setSearch]     = useState('')
  const [panel, setPanel]       = useState(null) // 'upload' | 'emails' | 'send' | null
  const [dragOver, setDragOver] = useState(false)
  const [imported, setImported] = useState(null)
  const [emailText, setEmailText] = useState('')
  const [sentIds, setSentIds]   = useState({})
  const fileRef = useRef(null)

  const filtered     = smps.filter(s =>
    `${s.name} ${s.email} ${s.station}`.toLowerCase().includes(search.toLowerCase())
  )
  const pendingSmps  = smps.filter(s => s.status === 'pending')
  const pendingCount = pendingSmps.length

  /* ── Upload CSV ── */
  const simulateImport = () => setImported(IMPORT_PREVIEW)

  const confirmImport = () => {
    setSmps(prev => [
      ...prev,
      ...IMPORT_PREVIEW.map(r => ({ ...r, id: ++nextId, status: 'pending', invitedAt: '—' })),
    ])
    setImported(null)
    setPanel(null)
  }

  /* ── Add emails ── */
  const handleAddEmails = () => {
    const emails = emailText.split(/[\n,;]+/).map(e => e.trim()).filter(Boolean)
    if (!emails.length) return
    setSmps(prev => [
      ...prev,
      ...emails.map(email => ({
        id: ++nextId,
        name: email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        email,
        station: '—',
        status: 'pending',
        invitedAt: '—',
      })),
    ])
    setEmailText('')
    setPanel(null)
  }

  /* ── Send invitations ── */
  const handleSendAll = () => {
    const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    const ids = {}
    pendingSmps.forEach(s => { ids[s.id] = true })
    setSentIds(ids)
    setSmps(prev => prev.map(s =>
      s.status === 'pending' ? { ...s, status: 'invited', invitedAt: now } : s
    ))
    setTimeout(() => { setSentIds({}); setPanel(null) }, 2000)
  }

  const handleSendOne = (id) => {
    setSentIds(p => ({ ...p, [id]: true }))
    setSmps(prev => prev.map(s =>
      s.id === id ? { ...s, status: 'invited', invitedAt: 'Just now' } : s
    ))
    setTimeout(() => setSentIds(p => { const n = { ...p }; delete n[id]; return n }), 2000)
  }

  const togglePanel = (name) => setPanel(p => p === name ? null : name)

  return (
    <div className="page-body">
      <PageHeader title="SMPs" icon={<Users2 size={18} />} banner />

      {/* ── Toolbar ── */}
      <div className="smp-toolbar">
        <div className="search-wrapper" style={{ flex: 1 }}>
          <Search size={14} className="search-icon" />
          <input
            className="search-input"
            placeholder="Search by name, email or station…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <button
          className={`action-btn${panel === 'upload' ? ' smp-btn-active' : ''}`}
          onClick={() => { togglePanel('upload'); setImported(null) }}
        >
          <Upload size={13} /> Upload CSV
        </button>

        <button
          className={`action-btn${panel === 'emails' ? ' smp-btn-active' : ''}`}
          onClick={() => togglePanel('emails')}
        >
          <Plus size={13} /> Add Emails
        </button>

        {pendingCount > 0 && (
          <button
            className={`btn${panel === 'send' ? ' btn-ghost' : ' btn-dark'}`}
            style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => togglePanel('send')}
          >
            <Send size={13} />
            Send Invitations
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 99, padding: '1px 7px', fontSize: 11,
            }}>{pendingCount}</span>
          </button>
        )}
      </div>

      {/* ── Upload CSV panel ── */}
      {panel === 'upload' && (
        <div className="smp-panel">
          <div className="smp-panel-header">
            <span>Upload SMP Roster (CSV)</span>
            <button className="btn btn-ghost btn-icon" onClick={() => { setPanel(null); setImported(null) }}>
              <X size={14} />
            </button>
          </div>

          {!imported ? (
            <div
              className={`smp-dropzone${dragOver ? ' smp-dropzone--over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); simulateImport() }}
              onClick={() => { fileRef.current?.click(); simulateImport() }}
            >
              <Upload size={22} color="#a1a1aa" />
              <p className="smp-drop-hint">
                Drag & drop a CSV file, or <strong style={{ color: 'var(--color-accent)' }}>browse</strong>
              </p>
              <p className="smp-drop-sub">Expected columns: name, email, station</p>
              <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={simulateImport} />
            </div>
          ) : (
            <>
              <p style={{ fontSize: 13, marginBottom: 12 }}>
                <strong>{imported.length} records</strong> found — review before importing:
              </p>
              <table className="admin-table" style={{ marginBottom: 14 }}>
                <thead><tr><th>Name</th><th>Email</th><th>Station</th></tr></thead>
                <tbody>
                  {imported.map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: 13 }}>{r.name}</td>
                      <td style={{ fontSize: 13, color: 'var(--color-muted)' }}>{r.email}</td>
                      <td style={{ fontSize: 13 }}>{r.station}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-dark" style={{ fontSize: 13 }} onClick={confirmImport}>
                  Confirm import
                </button>
                <button className="action-btn muted" onClick={() => setImported(null)}>
                  Re-upload
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Add emails panel ── */}
      {panel === 'emails' && (
        <div className="smp-panel">
          <div className="smp-panel-header">
            <span>Add SMP Emails</span>
            <button className="btn btn-ghost btn-icon" onClick={() => setPanel(null)}><X size={14} /></button>
          </div>
          <p className="smp-panel-desc">
            Paste one email per line, or separate by comma or semicolon.
          </p>
          <textarea
            className="smp-email-textarea"
            placeholder={'jsmith@amazon-de.com\nmjones@amazon-it.com\n…'}
            value={emailText}
            onChange={e => setEmailText(e.target.value)}
            rows={5}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button
              className="btn btn-dark"
              style={{ fontSize: 13 }}
              onClick={handleAddEmails}
              disabled={!emailText.trim()}
            >
              <Mail size={13} style={{ marginRight: 5 }} />
              Add {emailText.split(/[\n,;]+/).filter(e => e.trim()).length || 0} emails
            </button>
            <button className="action-btn muted" onClick={() => setPanel(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Send invitations panel ── */}
      {panel === 'send' && (
        <div className="smp-panel" style={{ borderColor: 'rgba(79,70,229,0.4)' }}>
          <div className="smp-panel-header">
            <span>Send Invitations</span>
            <button className="btn btn-ghost btn-icon" onClick={() => setPanel(null)}><X size={14} /></button>
          </div>
          <p className="smp-panel-desc">
            These <strong>{pendingCount} SMPs</strong> haven't been invited yet and will receive an access link by email:
          </p>
          <div className="smp-pills-row">
            {pendingSmps.map(s => (
              <span key={s.id} className="smp-pill">
                {s.name} <span style={{ color: 'var(--color-muted)' }}>({s.email})</span>
              </span>
            ))}
          </div>
          <button
            className="btn btn-dark"
            style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 7, marginTop: 14 }}
            onClick={handleSendAll}
          >
            {Object.keys(sentIds).length > 0
              ? <><Check size={14} /> All invitations sent!</>
              : <><Send size={14} /> Send to all {pendingCount} SMPs</>
            }
          </button>
        </div>
      )}

      {/* ── Table ── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>SMP</th>
              <th>Station</th>
              <th>Status</th>
              <th>Invited</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-muted)' }}>
                  No SMPs found.
                </td>
              </tr>
            )}
            {filtered.map(s => {
              const st   = STATUS_MAP[s.status]
              const sent = sentIds[s.id]
              return (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{s.email}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{s.station}</td>
                  <td><span className={st.cls}>{st.label}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--color-muted)' }}>{s.invitedAt}</td>
                  <td>
                    {s.status === 'pending' && !sent && (
                      <button
                        className="action-btn muted"
                        style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                        onClick={() => handleSendOne(s.id)}
                      >
                        <Send size={11} /> Invite
                      </button>
                    )}
                    {sent && (
                      <span style={{ fontSize: 11, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Check size={11} /> Sent
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
