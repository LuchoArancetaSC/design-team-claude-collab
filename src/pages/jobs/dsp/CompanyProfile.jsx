import { useState } from 'react'
import { Building2, Check } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import { jobsCompanies } from '../../../data'

const COMPANY_ID = 1
const source     = jobsCompanies.find(c => c.id === COMPANY_ID)

export default function CompanyProfile() {
  const [form, setForm] = useState({
    name:        source?.name        ?? '',
    location:    source?.location    ?? '',
    email:       'hiring@amazon-dsp-de.com',
    phone:       '+49 89 1234 5678',
    website:     'https://amazon-dsp-de.com',
    description: 'Amazon DSP DE is a last-mile delivery partner operating across Germany. We hire experienced van and cargo bike drivers for flexible and full-time roles.',
    vehicle:     source?.vehicle_type ?? 'Van',
  })
  const [saved, setSaved] = useState(false)
  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setSaved(false) }

  return (
    <div className="page-body">
      <PageHeader title="Company Profile" icon={<Building2 size={18} />} banner />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div className="page-title">Company Profile</div>
          <div className="page-subtitle">Your public profile shown to candidates on job listings.</div>
        </div>
        {saved && (
          <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Check size={14} /> Changes saved
          </span>
        )}
      </div>

      <div className="card">
        <div className="section-title" style={{ marginBottom: 14 }}>Company Details</div>

        <div className="form-grid" style={{ marginBottom: 14 }}>
          <div className="form-group">
            <label className="form-label">Company Name</label>
            <input className="input" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="input" value={form.location} placeholder="e.g. Munich, DE" onChange={e => set('location', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Website</label>
            <input className="input" value={form.website} onChange={e => set('website', e.target.value)} />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 14 }}>
          <label className="form-label">Company Description</label>
          <textarea
            className="smp-email-textarea"
            rows={4}
            value={form.description}
            placeholder="Describe your company, culture, and what makes you a great employer…"
            onChange={e => set('description', e.target.value)}
          />
        </div>

        <div className="section-title" style={{ marginBottom: 14, marginTop: 20 }}>Plan & Account</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 24px', fontSize: 13, marginBottom: 24 }}>
          {[
            ['Current Plan',   source?.plan],
            ['Commitment',     source?.commitment],
            ['Vehicle Type',   source?.vehicle_type],
            ['Active Jobs',    source?.active_jobs],
            ['Plan Renews',    source?.plan_renewal_date],
            ['Acc. Balance',   `£${source?.account_balance?.toFixed(2)}`],
          ].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{label}</div>
              <div style={{ fontWeight: 600 }}>{val}</div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-dark"
          style={{ fontSize: 13 }}
          onClick={() => setSaved(true)}
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}
