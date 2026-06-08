import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Home, CheckCircle2, CalendarDays, ArrowRight,
  Check, X, Search, Upload, CreditCard, Landmark, Shield, Clock,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'

const AVATAR_COLORS = ['#1d4ed8','#7c3aed','#059669','#d97706','#dc2626','#0891b2','#9333ea','#16a34a']

const LEARNERS_POOL = [
  { id: 'd1', name: 'Antonio Garcia',  email: 'antonio.garcia@amazon.dsp' },
  { id: 'd2', name: 'Maria López',     email: 'maria.lopez@amazon.dsp' },
  { id: 'd3', name: 'Carlos Ruiz',     email: 'carlos.ruiz@amazon.dsp' },
  { id: 'd4', name: 'Sofia Martinez',  email: 'sofia.martinez@amazon.dsp' },
  { id: 'd5', name: 'Luis Fernandez',  email: 'luis.fernandez@amazon.dsp' },
  { id: 'd6', name: 'Ana Torres',      email: 'ana.torres@amazon.dsp' },
  { id: 'd7', name: 'Pedro Gomez',     email: 'pedro.gomez@amazon.dsp' },
  { id: 'd8', name: 'Laura Sánchez',   email: 'laura.sanchez@amazon.dsp' },
]

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

/* ── Booking Wizard ───────────────────────────────────────────────── */
function BookingWizard({ onClose }) {
  const [step, setStep] = useState(1)
  const [selectedModule, setSelectedModule] = useState(null)
  const [form, setForm] = useState({ date: '', time: '', location: '' })
  const [search, setSearch] = useState('')
  const [selectedLearners, setSelectedDrivers] = useState([])
  const [paymentMethod, setPaymentMethod] = useState('credit')
  const [done, setDone] = useState(false)

  const filtered = LEARNERS_POOL.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.email.toLowerCase().includes(search.toLowerCase())
  )
  const toggle = id => setSelectedDrivers(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
  const total = selectedLearners.length * 30

  const moduleLabel = selectedModule === 'safety' ? 'Safety IT All Module' : 'Information Session'

  const steps = [
    { n: 1, label: 'Module' },
    { n: 2, label: 'Learners' },
    { n: 3, label: 'Payment' },
  ]

  if (done) {
    return (
      <div className="success-screen">
        <div className="success-icon"><CheckCircle2 size={28} /></div>
        <div className="success-title">Session Created!</div>
        <div className="success-subtitle">
          Training session booked successfully.<br />
          {selectedLearners.length} learner(s) enrolled for <strong>{moduleLabel}</strong>.
        </div>
        <button className="btn btn-dark btn-lg" onClick={onClose} style={{ marginTop: 8 }}>
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Progress */}
      <div className="wizard-steps">
        {steps.map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`wizard-step${step === s.n ? ' active' : step > s.n ? ' done' : ''}`}>
              <div className="wizard-step-dot">
                {step > s.n ? <Check size={12} strokeWidth={3} /> : s.n}
              </div>
              <span className="wizard-step-label">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`wizard-line${step > s.n ? ' done' : ''}`} />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div>
          <div className="form-label" style={{ marginBottom: 10 }}>Select Training Module</div>
          <div className="module-cards">
            {[
              { id: 'safety', label: 'Safety IT All Module', desc: 'Road safety & compliance training for all learners.', icon: Shield },
              { id: 'info',   label: 'Information Session',  desc: 'Operational updates, policies & procedures.',     icon: CalendarDays },
            ].map(m => {
              const Icon = m.icon
              return (
                <div
                  key={m.id}
                  className={`module-card${selectedModule === m.id ? ' selected' : ''}`}
                  onClick={() => setSelectedModule(m.id)}
                >
                  <div className="module-card-icon" style={{ background: selectedModule === m.id ? '#f0f0f0' : '#f4f4f5' }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{m.desc}</div>
                </div>
              )
            })}
          </div>

          <div className="form-label" style={{ marginBottom: 10 }}>Schedule & Location</div>
          <div className="form-grid" style={{ marginBottom: 12 }}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input className="input" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <select className="input select" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}>
              <option value="">Select location...</option>
              <option>Madrid, ES</option>
              <option>Barcelona, ES</option>
              <option>Rome, IT</option>
              <option>Milan, IT</option>
              <option>Munich, DE</option>
              <option>Berlin, DE</option>
              <option>London, UK</option>
              <option>Paris, FR</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div>
          <div className="search-wrapper" style={{ marginBottom: 14 }}>
            <Search size={14} />
            <input className="input" placeholder="Search learners..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.04em' }}>
            {selectedLearners.length} selected
          </div>
          {filtered.map((d, i) => (
            <label key={d.id} className="driver-row">
              <input type="checkbox" checked={selectedLearners.includes(d.id)} onChange={() => toggle(d.id)} />
              <div className="driver-avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                {getInitials(d.name)}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{d.email}</div>
              </div>
            </label>
          ))}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
            <button className="btn btn-outline btn-sm">
              <Upload size={13} /> Upload CSV
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-muted)', marginBottom: 8 }}>
            Summary
          </div>
          <div className="invoice-summary">
            <div className="invoice-summary-row"><span style={{ color: 'var(--color-muted)' }}>Module</span><span style={{ fontWeight: 500 }}>{moduleLabel}</span></div>
            <div className="invoice-summary-row"><span style={{ color: 'var(--color-muted)' }}>Date</span><span style={{ fontWeight: 500 }}>{form.date || '—'}</span></div>
            <div className="invoice-summary-row"><span style={{ color: 'var(--color-muted)' }}>Location</span><span style={{ fontWeight: 500 }}>{form.location || '—'}</span></div>
            <div className="invoice-summary-row"><span style={{ color: 'var(--color-muted)' }}>Enrolled Learners</span><span style={{ fontWeight: 500 }}>{selectedLearners.length}</span></div>
            <div className="invoice-summary-row"><span style={{ color: 'var(--color-muted)' }}>Price per learner</span><span style={{ fontWeight: 500 }}>€30.00</span></div>
            <div className="invoice-summary-row total"><span>Total</span><span>€{total.toFixed(2)}</span></div>
          </div>

          <div className="form-label" style={{ marginBottom: 10 }}>Payment Method</div>
          <div className="payment-methods">
            {[
              { id: 'credit', label: 'Credit Card', sub: 'Visa / Mastercard', Icon: CreditCard },
              { id: 'bank',   label: 'Bank Transfer', sub: 'SEPA Transfer',   Icon: Landmark },
            ].map(pm => (
              <div
                key={pm.id}
                className={`payment-method-card${paymentMethod === pm.id ? ' selected' : ''}`}
                onClick={() => setPaymentMethod(pm.id)}
              >
                <pm.Icon size={22} color={paymentMethod === pm.id ? 'var(--color-dark)' : 'var(--color-muted)'} />
                <div style={{ fontSize: 13, fontWeight: 600 }}>{pm.label}</div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{pm.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wizard footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
        {step > 1 && (
          <button className="btn btn-outline" onClick={() => setStep(s => s - 1)}>Back</button>
        )}
        {step < 3 ? (
          <button
            className="btn btn-dark"
            onClick={() => setStep(s => s + 1)}
            style={{ opacity: step === 1 && !selectedModule ? 0.45 : 1 }}
            disabled={step === 1 && !selectedModule}
          >
            Continue <ArrowRight size={14} />
          </button>
        ) : (
          <button className="btn btn-dark btn-lg" onClick={() => setDone(true)}>
            Confirm & Pay €{total.toFixed(2)}
          </button>
        )}
      </div>
    </>
  )
}

/* ── Dashboard page ───────────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate()
  const [showWizard, setShowWizard] = useState(false)

  return (
    <div className="page-body">
      <PageHeader title="Client Hub" icon={<Home size={18} color="white" />} banner />

      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Welcome, DSP / Courier!</div>
        <div className="page-subtitle">Manage your learners' training sessions and billing.</div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card dark">
          <div className="stat-label">Account Balance</div>
          <div className="stat-value">€3,530.00</div>
          <div className="stat-credit-badge">
            <Check size={11} strokeWidth={3} /> Available Credit
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Learners Certified</div>
              <div className="stat-value">128</div>
            </div>
            <div className="stat-icon green">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Upcoming Sessions</div>
              <div className="stat-value">4</div>
            </div>
            <div className="stat-icon blue">
              <CalendarDays size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="bottom-grid">
        {/* CTA card */}
        <div className="card" style={{ background: 'var(--color-bg)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            Need more certified learners?
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Book a Training Session</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
            Schedule new safety or information sessions for your learners in a few easy steps.
          </div>
          <button className="btn btn-dark" onClick={() => setShowWizard(true)}>
            + Book New Session
          </button>
        </div>

        {/* Pending invoices */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 2 }}>Pending Invoices</div>
          <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 12 }}>Outstanding payments</div>

          <div className="pending-invoice-row">
            <div>
              <div className="pending-invoice-id">INV-2026-041A</div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>Safety IT ALL – Madrid · 12 Learners</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="pending-invoice-amount">€360.00</div>
              <button className="pay-link" onClick={() => navigate('/invoices')}>
                Pay now <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div className="pending-invoice-row">
            <div>
              <div className="pending-invoice-id">INV-2026-038C</div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>Safety Refresher · 5 Learners</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="pending-invoice-amount" style={{ color: 'var(--color-primary)' }}>€150.00</div>
              <button className="pay-link" onClick={() => navigate('/invoices')}>
                Pay now <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div className="pending-invoice-row">
            <div>
              <div className="pending-invoice-id">INV-2026-037B</div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>Information IT – BCN · 8 Learners</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="pending-invoice-amount">€280.00</div>
              <button className="pay-link" onClick={() => navigate('/invoices')}>
                Pay now <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e4e4e7', marginTop: 4 }} />
          <button
            onClick={() => navigate('/invoices')}
            style={{
              display: 'block',
              width: '100%',
              marginTop: 10,
              padding: '10px',
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 500,
              color: '#09090b',
              background: '#f4f4f5',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              transition: 'background 0.13s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#e4e4e7'}
            onMouseLeave={e => e.currentTarget.style.background = '#f4f4f5'}
          >
            View all invoices <ArrowRight size={12} style={{ verticalAlign: 'middle', marginLeft: 2 }} />
          </button>
        </div>
      </div>

      {showWizard && (
        <Modal title="Book New Session" onClose={() => setShowWizard(false)} size="lg">
          <BookingWizard onClose={() => setShowWizard(false)} />
        </Modal>
      )}
    </div>
  )
}
