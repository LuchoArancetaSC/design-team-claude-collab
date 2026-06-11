import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, ChevronLeft } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'

const AVAILABLE_PATHS = ['Safety IT All', 'Information IT', 'Onboarding Basics']

export default function NewSubOrg() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', paths: [] })

  const togglePath = p =>
    setForm(f => ({
      ...f,
      paths: f.paths.includes(p) ? f.paths.filter(x => x !== p) : [...f.paths, p],
    }))

  const canSubmit = form.name.trim() && form.email.trim()

  const handleSubmit = () => {
    navigate('/academy/admin/tenants')
  }

  return (
    <div className="page-body">
      <PageHeader title="New Sub-Organisation" icon={<Building2 size={18} color="white" />} banner />

      <button className="back-link" onClick={() => navigate('/academy/admin/tenants')}>
        <ChevronLeft size={15} /> Tenants & Sub-Orgs
      </button>

      <div style={{ marginBottom: 28 }}>
        <div className="page-title">New Sub-Organisation</div>
        <div className="page-subtitle">Create a new sub-org under your tenant and assign learning paths.</div>
      </div>

      <div className="card" style={{ maxWidth: 480, padding: 24 }}>
        <div className="form-group">
          <label className="form-label">Sub-Org Name *</label>
          <input
            className="input"
            placeholder="e.g. Amazon DSP Alemania"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Org Admin Email *</label>
          <input
            className="input"
            type="email"
            placeholder="admin@company.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4 }}>
            An invitation will be sent to this address.
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <div className="form-label" style={{ marginBottom: 10 }}>Assign Paths</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {AVAILABLE_PATHS.map(p => (
              <label key={p} className="driver-row" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.paths.includes(p)}
                  onChange={() => togglePath(p)}
                />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{p}</span>
              </label>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 8 }}>
            You can assign or remove paths at any time from the sub-org settings.
          </div>
        </div>

        <div style={{
          display: 'flex', gap: 10, justifyContent: 'flex-end',
          marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-border)',
        }}>
          <button className="btn btn-outline" onClick={() => navigate('/academy/admin/tenants')}>Cancel</button>
          <button
            className="btn btn-dark"
            disabled={!canSubmit}
            style={{ opacity: canSubmit ? 1 : 0.45 }}
            onClick={handleSubmit}
          >
            Create Sub-Org
          </button>
        </div>
      </div>
    </div>
  )
}
