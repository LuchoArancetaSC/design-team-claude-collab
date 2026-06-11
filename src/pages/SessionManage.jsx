import { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Search, Trash2, Upload, ArrowLeft, ArrowRight,
  Check, CreditCard, Building2, CheckCircle2, Plus, UserPlus,
} from 'lucide-react'

/* ── Data ──────────────────────────────────────────────────────────── */
const SESSION = {
  title: 'Safety DE ALL 2026 SC Session',
  date: '19 Apr 2026  ·  11:00 AM  ·  35 seats total',
  capacity: 35,
  pricePerDriver: 30,
}

const INITIAL_ENROLLED = [
  { id: 1, name: 'John Doe',     email: 'john.doe@dsp.com' },
  { id: 2, name: 'Mike Romano',  email: 'm.romano@dsp.com' },
  { id: 3, name: 'Sara Alvarez', email: 's.alvarez@dsp.com' },
  { id: 4, name: 'Paul Klein',   email: 'p.klein@dsp.com' },
  { id: 5, name: 'Lena Tran',    email: 'l.tran@dsp.com' },
]

const ROSTER_POOL = [
  { id: 101, name: 'Ana Torres',      email: 'a.torres@dsp.com' },
  { id: 102, name: 'Carlos Ruiz',     email: 'c.ruiz@dsp.com' },
  { id: 103, name: 'Sofia Martinez',  email: 's.martinez@dsp.com' },
  { id: 104, name: 'Luis Fernandez',  email: 'l.fernandez@dsp.com' },
  { id: 105, name: 'Pedro Gomez',     email: 'p.gomez@dsp.com' },
  { id: 106, name: 'Laura Sánchez',   email: 'l.sanchez@dsp.com' },
  { id: 107, name: 'David Kim',       email: 'd.kim@dsp.com' },
  { id: 108, name: 'Maria López',     email: 'm.lopez@dsp.com' },
]

const STEPS = [
  { n: 1, label: 'Manage drivers' },
  { n: 2, label: 'Billing' },
  { n: 3, label: 'Company info' },
  { n: 4, label: 'Complete' },
]

const inputStyle = {
  width: '100%', height: 40,
  background: '#f4f4f5', border: '1px solid #e4e4e6',
  borderRadius: 8, padding: '0 12px',
  fontFamily: 'Poppins, sans-serif', fontSize: 13,
  color: '#032f4f', outline: 'none', boxSizing: 'border-box',
}

/* ── Stepper ────────────────────────────────────────────────────────── */
function Stepper({ currentStep }) {
  return (
    <div style={{
      background: 'white', height: 72, borderBottom: '1px solid #e4e4e6',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {STEPS.map((step, i) => {
        const isActive = step.n === currentStep
        const isDone   = step.n < currentStep
        return (
          <div key={step.n} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 120 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: isActive || isDone ? '#032f4f' : '#e4e4e6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isDone
                  ? <Check size={12} color="white" strokeWidth={3} />
                  : <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 11, color: isActive ? 'white' : '#717179' }}>{step.n}</span>
                }
              </div>
              <span style={{
                fontFamily: 'Poppins, sans-serif', fontWeight: isActive ? 600 : 400,
                fontSize: 11, color: isActive ? '#032f4f' : '#717179', whiteSpace: 'nowrap',
              }}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 140, height: 2, background: isDone ? '#032f4f' : '#e4e4e6', flexShrink: 0, marginBottom: 20 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Panel shell ────────────────────────────────────────────────────── */
function Panel({ enrolledCount, children, footer }) {
  const pct = Math.min((enrolledCount / SESSION.capacity) * 100, 100)
  return (
    <div style={{ flex: 1, padding: '20px 24px 24px', display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
      <div style={{
        width: '100%', maxWidth: 1020,
        background: '#f6f8fc', border: '1px solid #e4e4e6',
        borderRadius: 16, boxShadow: '0px 2px 6px rgba(0,0,0,0.08)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        {/* Panel header */}
        <div style={{
          background: 'white', borderBottom: '1px solid #e4e4e6', height: 80,
          padding: '0 28px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#032f4f', marginBottom: 4 }}>{SESSION.title}</p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: 12, color: '#717179' }}>{SESSION.date}</p>
          </div>
          <div style={{
            border: '1px solid #e4e4e6', borderRadius: 8, padding: '0 14px',
            height: 40, display: 'flex', alignItems: 'center', gap: 10, background: 'white',
          }}>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 12, color: '#032f4f', whiteSpace: 'nowrap' }}>
              {enrolledCount} / {SESSION.capacity} seats
            </span>
            <div style={{ width: 72, height: 5, background: '#e4e4e6', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: '#032f4f', borderRadius: 99, transition: 'width 0.2s' }} />
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1 }}>{children}</div>

        {/* Footer */}
        <div style={{
          background: '#f4f4f5', borderTop: '1px solid #e4e4e6', height: 72,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '0 24px', gap: 12, flexShrink: 0,
        }}>
          {footer}
        </div>
      </div>
    </div>
  )
}

/* ══ STEP 1 — Manage drivers ════════════════════════════════════════ */
function Step1({ enrolled, setEnrolled, onNext }) {
  const [enrollSearch, setEnrollSearch] = useState('')
  const [firstName, setFirstName]       = useState('')
  const [lastName, setLastName]         = useState('')
  const [email, setEmail]               = useState('')
  const [rosterSearch, setRosterSearch] = useState('')
  const [addError, setAddError]         = useState('')
  const fileInputRef                    = useRef(null)

  const enrolledIds = enrolled.map(d => d.id)

  const filteredEnrolled = enrolled.filter(d =>
    d.name.toLowerCase().includes(enrollSearch.toLowerCase()) ||
    d.email.toLowerCase().includes(enrollSearch.toLowerCase())
  )

  const rosterResults = rosterSearch.trim()
    ? ROSTER_POOL.filter(d =>
        !enrolledIds.includes(d.id) &&
        (d.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
         d.email.toLowerCase().includes(rosterSearch.toLowerCase()))
      )
    : []

  function addManually() {
    if (!firstName.trim()) { setAddError('First name is required.'); return }
    if (!email.trim() || !email.includes('@')) { setAddError('Valid email is required.'); return }
    setAddError('')
    setEnrolled(prev => [...prev, { id: Date.now(), name: `${firstName.trim()} ${lastName.trim()}`.trim(), email: email.trim() }])
    setFirstName(''); setLastName(''); setEmail('')
  }

  function addFromRoster(driver) {
    setEnrolled(prev => [...prev, driver])
    setRosterSearch('')
  }

  function downloadTemplate() {
    const csv = 'First Name,Last Name,Email\nJohn,Doe,john.doe@example.com\n'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href = url; a.download = 'drivers_template.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Panel enrolledCount={enrolled.length} footer={
      <>
        <button
          disabled={enrolled.length === 0}
          onClick={onNext}
          style={{
            height: 40, padding: '0 28px',
            background: enrolled.length === 0 ? '#e4e4e6' : '#032f4f',
            border: 'none', borderRadius: 999, cursor: enrolled.length === 0 ? 'not-allowed' : 'pointer',
            fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 13,
            color: enrolled.length === 0 ? '#a1a1aa' : 'white',
            display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.15s',
          }}
        >
          Next: Billing <ArrowRight size={14} />
        </button>
      </>
    }>
      <div style={{ display: 'flex', minHeight: 560 }}>

        {/* Left col */}
        <div style={{ width: '50%', background: 'white', borderRight: '1px solid #e4e4e6', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '18px 24px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#032f4f' }}>Enrolled drivers</span>
            <div style={{ background: '#f4f4f5', border: '1px solid #e4e4e6', borderRadius: 11, height: 22, minWidth: 26, padding: '0 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 11, color: '#032f4f' }}>{enrolled.length}</span>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ padding: '0 24px 0' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="#717179" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input value={enrollSearch} onChange={e => setEnrollSearch(e.target.value)} placeholder="Search enrolled drivers…"
                style={{ ...inputStyle, paddingLeft: 36, background: '#f4f4f5' }} />
            </div>
          </div>

          {/* Table header */}
          <div style={{ background: '#f4f4f5', height: 34, padding: '0 24px', display: 'flex', alignItems: 'center', marginTop: 12 }}>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 10, color: '#80808c', letterSpacing: '0.04em' }}>NAME / EMAIL</span>
          </div>

          {/* Rows */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredEnrolled.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: '#a1a1aa', fontFamily: 'Poppins, sans-serif', fontSize: 13 }}>
                No drivers enrolled yet
              </div>
            )}
            {filteredEnrolled.map((d, i) => (
              <div key={d.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '0 24px', height: 52,
                background: i % 2 === 1 ? '#fafafb' : 'white',
                borderBottom: '1px solid #e4e4e6',
              }}>
                <div style={{ width: 16, height: 16, background: '#032f4f', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={10} color="white" strokeWidth={3} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 13, color: '#032f4f', lineHeight: 1.3 }}>{d.name}</p>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: 11, color: '#717179', lineHeight: 1.3 }}>{d.email}</p>
                </div>
                <button onClick={() => setEnrolled(prev => prev.filter(x => x.id !== d.id))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }}>
                  <Trash2 size={14} color="#a1a1aa" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary bar */}
          <div style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'white', borderTop: '1px solid #f0f0f0' }}>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 12, color: '#717179' }}>
              {enrolled.length} driver{enrolled.length !== 1 ? 's' : ''}  ·  all selected
            </span>
            <button onClick={() => setEnrolled([])}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 12, color: '#ff4b4b' }}>
              Clear all
            </button>
          </div>
        </div>

        {/* Right col */}
        <div style={{ width: '50%', background: 'white', padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
          <div>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#032f4f', marginBottom: 4 }}>Add drivers</p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: 12, color: '#717179' }}>Enter manually or search your roster</p>
          </div>

          {/* Manual entry */}
          <div style={{ border: '1px solid #e4e4e6', borderRadius: 10, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 12, color: '#032f4f' }}>Manual entry</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={firstName} onChange={e => { setFirstName(e.target.value); setAddError('') }} placeholder="First name" style={{ ...inputStyle, flex: 1 }} />
              <input value={lastName}  onChange={e => setLastName(e.target.value)}  placeholder="Last name"  style={{ ...inputStyle, flex: 1 }} />
            </div>
            <input value={email} onChange={e => { setEmail(e.target.value); setAddError('') }} placeholder="driver@company.com" style={inputStyle} />
            {addError && <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11, color: '#ff4b4b', margin: 0 }}>{addError}</p>}
            <button onClick={addManually} style={{
              width: '100%', height: 40, background: '#032f4f', border: 'none', borderRadius: 999,
              cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 13, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Plus size={14} /> Add driver to list
            </button>
          </div>

          {/* Roster search */}
          <div style={{ border: '1px solid #e4e4e6', borderRadius: 10, padding: '16px' }}>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 12, color: '#032f4f', marginBottom: 10 }}>Search from your roster</p>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="#717179" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input value={rosterSearch} onChange={e => setRosterSearch(e.target.value)} placeholder="Search all DSP drivers…"
                style={{ ...inputStyle, paddingLeft: 36, background: '#f4f4f5' }} />
            </div>
            {rosterResults.length > 0 && (
              <div style={{ marginTop: 8, border: '1px solid #e4e4e6', borderRadius: 8, overflow: 'hidden' }}>
                {rosterResults.map(d => (
                  <button key={d.id} onClick={() => addFromRoster(d)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '10px 12px', background: 'white', border: 'none',
                    borderBottom: '1px solid #f0f0f0', cursor: 'pointer', textAlign: 'left',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f6f8fc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e5edf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 10, color: '#032f4f' }}>
                        {d.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 12, color: '#032f4f' }}>{d.name}</p>
                      <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11, color: '#717179' }}>{d.email}</p>
                    </div>
                    <UserPlus size={13} color="#717179" />
                  </button>
                ))}
              </div>
            )}
            {rosterSearch.trim() && rosterResults.length === 0 && (
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, color: '#a1a1aa', marginTop: 8, textAlign: 'center' }}>No drivers found</p>
            )}
          </div>

          {/* CSV import */}
          <div style={{ background: '#f4f4f5', border: '1px solid #e4e4e6', borderRadius: 10, padding: '16px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 44, height: 44, background: '#e4e4e6', borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, background: 'white', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload size={16} color="#717179" />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 13, color: '#032f4f', marginBottom: 2 }}>Import via CSV</p>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, color: '#717179', marginBottom: 2 }}>Enroll your whole team at once</p>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11, color: '#717179', marginBottom: 10 }}>Drag & drop or:</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={downloadTemplate} style={{
                  height: 30, padding: '0 14px', background: 'white', border: '1px solid #e4e4e6',
                  borderRadius: 999, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 10, color: '#032f4f',
                }}>
                  Download template
                </button>
                <button onClick={() => fileInputRef.current?.click()} style={{
                  height: 30, padding: '0 16px', background: '#032f4f', border: 'none',
                  borderRadius: 999, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 10, color: 'white',
                }}>
                  Choose file
                </button>
                <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const reader = new FileReader()
                    reader.onload = ev => {
                      const lines = ev.target.result.split('\n').slice(1).filter(Boolean)
                      const parsed = lines.map((line, i) => {
                        const [first, last, mail] = line.split(',')
                        return { id: Date.now() + i, name: `${(first || '').trim()} ${(last || '').trim()}`.trim(), email: (mail || '').trim() }
                      }).filter(d => d.email)
                      setEnrolled(prev => [...prev, ...parsed])
                    }
                    reader.readAsText(file)
                    e.target.value = ''
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  )
}

/* ══ STEP 2 — Billing ═══════════════════════════════════════════════ */
function Step2({ enrolled, onBack, onNext }) {
  const [payMethod, setPayMethod] = useState('card')
  const [cardNum, setCardNum]     = useState('')
  const [cardName, setCardName]   = useState('')
  const [expiry, setExpiry]       = useState('')
  const [cvv, setCvv]             = useState('')
  const total = enrolled.length * SESSION.pricePerDriver

  return (
    <Panel enrolledCount={enrolled.length} footer={
      <>
        <button onClick={onBack} style={{
          height: 40, padding: '0 20px', background: 'white', border: '1px solid #e4e4e6',
          borderRadius: 999, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 13, color: '#032f4f',
        }}>
          ← Back
        </button>
        <button onClick={onNext} style={{
          height: 40, padding: '0 28px', background: '#032f4f', border: 'none',
          borderRadius: 999, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 13, color: 'white',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          Next: Company info <ArrowRight size={14} />
        </button>
      </>
    }>
      <div style={{ display: 'flex', gap: 0, minHeight: 500 }}>
        {/* Left: summary */}
        <div style={{ width: '40%', background: 'white', borderRight: '1px solid #e4e4e6', padding: '28px 28px' }}>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#032f4f', marginBottom: 20 }}>Order summary</p>
          <div style={{ background: '#f6f8fc', border: '1px solid #e4e4e6', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 13, color: '#032f4f', marginBottom: 12 }}>{SESSION.title}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, color: '#717179' }}>Drivers enrolled</span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 12, color: '#032f4f' }}>{enrolled.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, color: '#717179' }}>Price per driver</span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 12, color: '#032f4f' }}>€{SESSION.pricePerDriver}.00</span>
            </div>
            <div style={{ height: 1, background: '#e4e4e6', margin: '12px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 14, color: '#032f4f' }}>Total</span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 18, color: '#032f4f' }}>€{total}.00</span>
            </div>
          </div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <CheckCircle2 size={14} color="#16a34a" />
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 12, color: '#16a34a' }}>Invoice generated</span>
            </div>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11, color: '#166534' }}>A PDF invoice will be sent to your billing email after payment.</p>
          </div>
        </div>

        {/* Right: payment */}
        <div style={{ flex: 1, background: 'white', padding: '28px 28px' }}>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#032f4f', marginBottom: 20 }}>Payment method</p>

          {/* Method tabs */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            {[
              { id: 'card', label: 'Credit / Debit Card', Icon: CreditCard },
              { id: 'bank', label: 'Bank Transfer', Icon: Building2 },
            ].map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setPayMethod(id)} style={{
                flex: 1, height: 52, border: `2px solid ${payMethod === id ? '#032f4f' : '#e4e4e6'}`,
                borderRadius: 10, background: payMethod === id ? '#f6f8fc' : 'white',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'all 0.15s',
              }}>
                <Icon size={16} color={payMethod === id ? '#032f4f' : '#a1a1aa'} />
                <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: payMethod === id ? 600 : 400, fontSize: 13, color: payMethod === id ? '#032f4f' : '#717179' }}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          {payMethod === 'card' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={labelStyle}>Card number</label>
                <input value={cardNum} onChange={e => setCardNum(e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim())}
                  placeholder="1234 5678 9012 3456" maxLength={19} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Name on card</label>
                <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="John Doe" style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Expiry date</label>
                  <input value={expiry} onChange={e => {
                    let v = e.target.value.replace(/\D/g,'')
                    if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2,4)
                    setExpiry(v)
                  }} placeholder="MM/YY" maxLength={5} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>CVV</label>
                  <input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g,'').slice(0,4))}
                    placeholder="···" type="password" maxLength={4} style={inputStyle} />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: '#f6f8fc', border: '1px solid #e4e4e6', borderRadius: 12, padding: '20px' }}>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 13, color: '#032f4f', marginBottom: 14 }}>Bank transfer details</p>
              {[
                ['Beneficiary', 'Service Club Academy SL'],
                ['IBAN', 'ES76 0049 1234 5678 9012 3456'],
                ['BIC/SWIFT', 'BSCHESMMXXX'],
                ['Reference', `INV-${Date.now().toString().slice(-6)}`],
                ['Amount', `€${total}.00`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, color: '#717179' }}>{k}</span>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 12, color: '#032f4f' }}>{v}</span>
                </div>
              ))}
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11, color: '#717179', marginTop: 14 }}>
                Please use the reference above. Payment must be received within 7 days.
              </p>
            </div>
          )}
        </div>
      </div>
    </Panel>
  )
}

/* ══ STEP 3 — Company info ══════════════════════════════════════════ */
function Step3({ onBack, onNext }) {
  const [form, setForm] = useState({ company: '', vat: '', address: '', city: '', country: '', zip: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const valid = form.company.trim() && form.vat.trim() && form.address.trim()

  return (
    <Panel enrolledCount={0} footer={
      <>
        <button onClick={onBack} style={{
          height: 40, padding: '0 20px', background: 'white', border: '1px solid #e4e4e6',
          borderRadius: 999, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 13, color: '#032f4f',
        }}>
          ← Back
        </button>
        <button onClick={onNext} disabled={!valid} style={{
          height: 40, padding: '0 28px', background: valid ? '#032f4f' : '#e4e4e6', border: 'none',
          borderRadius: 999, cursor: valid ? 'pointer' : 'not-allowed', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 13,
          color: valid ? 'white' : '#a1a1aa', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          Confirm & Submit <ArrowRight size={14} />
        </button>
      </>
    }>
      <div style={{ background: 'white', padding: '32px 40px', maxWidth: 600, margin: '0 auto', minHeight: 480 }}>
        <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 15, color: '#032f4f', marginBottom: 4 }}>Company information</p>
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, color: '#717179', marginBottom: 24 }}>Used for invoicing and legal compliance</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Company name <span style={{ color: '#ff4b4b' }}>*</span></label>
            <input value={form.company} onChange={set('company')} placeholder="Acme Deliveries SL" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>VAT number <span style={{ color: '#ff4b4b' }}>*</span></label>
            <input value={form.vat} onChange={set('vat')} placeholder="ESB12345678" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Billing address <span style={{ color: '#ff4b4b' }}>*</span></label>
            <input value={form.address} onChange={set('address')} placeholder="Calle Mayor 14" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>City</label>
              <input value={form.city} onChange={set('city')} placeholder="Madrid" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>ZIP code</label>
              <input value={form.zip} onChange={set('zip')} placeholder="28001" style={inputStyle} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Country</label>
            <select value={form.country} onChange={set('country')} style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Select country…</option>
              {['Spain', 'Italy', 'Germany', 'France', 'UK', 'Netherlands', 'Belgium'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </Panel>
  )
}

/* ══ STEP 4 — Complete ══════════════════════════════════════════════ */
function Step4({ enrolled, onDone }) {
  const total = enrolled.length * SESSION.pricePerDriver
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: '#f0fdf4',
          border: '2px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <CheckCircle2 size={36} color="#16a34a" strokeWidth={1.5} />
        </div>
        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 22, color: '#032f4f', marginBottom: 8 }}>
          Session booked!
        </h2>
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 14, color: '#717179', marginBottom: 28, lineHeight: 1.6 }}>
          {enrolled.length} driver{enrolled.length !== 1 ? 's' : ''} enrolled in <strong style={{ color: '#032f4f' }}>{SESSION.title}</strong>.
          A confirmation email and invoice for <strong style={{ color: '#032f4f' }}>€{total}.00</strong> has been sent.
        </p>
        <div style={{ background: '#f6f8fc', border: '1px solid #e4e4e6', borderRadius: 12, padding: '16px 20px', marginBottom: 28, textAlign: 'left' }}>
          {[
            ['Session', SESSION.title],
            ['Date', '19 Apr 2026 · 11:00 AM'],
            ['Drivers', `${enrolled.length} enrolled`],
            ['Amount', `€${total}.00`],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, color: '#717179' }}>{k}</span>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 12, color: '#032f4f' }}>{v}</span>
            </div>
          ))}
        </div>
        <button onClick={onDone} style={{
          height: 44, padding: '0 32px', background: '#032f4f', border: 'none',
          borderRadius: 999, cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 14, color: 'white',
        }}>
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

/* ══ Main export ════════════════════════════════════════════════════ */
export default function SessionManage() {
  const navigate = useNavigate()
  const [step, setStep]         = useState(1)
  const [enrolled, setEnrolled] = useState(INITIAL_ENROLLED)

  return (
    <div style={{ background: '#f6f8fc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Top bar */}
      <div style={{
        background: 'white', height: 64, borderBottom: '1px solid #e4e4e6',
        display: 'flex', alignItems: 'center', padding: '0 24px', flexShrink: 0,
      }}>
        <button onClick={() => navigate('/dashboard')} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: 13, color: '#717179',
        }}>
          <ArrowLeft size={14} color="#717179" />
          Dashboard
        </button>
      </div>

      {/* Stepper */}
      {step < 4 && <Stepper currentStep={step} />}

      {/* Step content */}
      {step === 1 && <Step1 enrolled={enrolled} setEnrolled={setEnrolled} onNext={() => setStep(2)} />}
      {step === 2 && <Step2 enrolled={enrolled} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
      {step === 3 && <Step3 onBack={() => setStep(2)} onNext={() => setStep(4)} />}
      {step === 4 && <Step4 enrolled={enrolled} onDone={() => navigate('/dashboard')} />}
    </div>
  )
}

const labelStyle = {
  display: 'block', fontFamily: 'Poppins, sans-serif',
  fontWeight: 500, fontSize: 12, color: '#032f4f', marginBottom: 6,
}
