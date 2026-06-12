import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileEdit, ChevronLeft, Plus, X, Check } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Modal from '../../../components/Modal'
import { jobsListings } from '../../../data'

const VEHICLES    = ['Van', 'Car', 'Bike']
const CONTRACTS   = ['Full-time', 'Part-time', 'Freelance']
const COMMITMENTS = ['No-brainer', 'Smart', 'Casual']

const BLANK = {
  title: '', location: '', vehicle_required: 'Van', contract_type: 'Full-time',
  salary_range: ['', ''], salary_period: 'month', spots_left: '',
  highlights: [''], requirements: [''], commitment: 'No-brainer',
  status: 'draft', description: '',
}

export default function JobEditor() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isNew    = id === 'new'
  const source   = isNew ? null : jobsListings.find(j => String(j.id) === String(id))

  const [form, setForm] = useState(() => {
    if (isNew || !source) return BLANK
    return {
      ...source,
      highlights:   [...source.highlights],
      requirements: [...source.requirements],
      description:  '',
      salary_range: [...source.salary_range],
    }
  })
  const [saved, setSaved]   = useState(null) // null | 'draft' | 'published'
  const [showConfirm, setConfirm] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setList = (key, idx, val) => setForm(f => {
    const arr = [...f[key]]
    arr[idx] = val
    return { ...f, [key]: arr }
  })
  const addToList   = key => setForm(f => ({ ...f, [key]: [...f[key], ''] }))
  const removeFromList = (key, idx) => setForm(f => ({ ...f, [key]: f[key].filter((_, i) => i !== idx) }))

  const handleSave = (publish) => {
    setSaved(publish ? 'published' : 'draft')
    setConfirm(false)
    setTimeout(() => setSaved(null), 2500)
  }

  if (!isNew && !source) {
    return (
      <div className="page-body">
        <PageHeader title="Job Editor" icon={<FileEdit size={18} />} banner />
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-muted)', fontSize: 14 }}>
          Job not found.
        </div>
      </div>
    )
  }

  return (
    <div className="page-body">
      <PageHeader title={isNew ? 'Post New Job' : 'Edit Job'} icon={<FileEdit size={18} />} banner />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }} onClick={() => navigate('/jobs/listings')}>
          <ChevronLeft size={15} /> Back to Listings
        </button>
        {saved && (
          <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Check size={14} /> {saved === 'published' ? 'Published!' : 'Saved as draft'}
          </span>
        )}
      </div>

      <div className="card">
        {/* Basic info */}
        <div className="section-title" style={{ marginBottom: 14 }}>Basic Information</div>
        <div className="form-grid" style={{ marginBottom: 14 }}>
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Job Title</label>
            <input className="input" value={form.title} placeholder="e.g. Van Driver – Amazon DSP Munich" onChange={e => set('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="input" value={form.location} placeholder="e.g. Munich, DE" onChange={e => set('location', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Vehicle Type</label>
            <select className="input select" value={form.vehicle_required} onChange={e => set('vehicle_required', e.target.value)}>
              {VEHICLES.map(v => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Contract Type</label>
            <select className="input select" value={form.contract_type} onChange={e => set('contract_type', e.target.value)}>
              {CONTRACTS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Commitment Model</label>
            <select className="input select" value={form.commitment} onChange={e => set('commitment', e.target.value)}>
              {COMMITMENTS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Salary */}
        <div className="section-title" style={{ marginBottom: 14 }}>Salary</div>
        <div className="form-grid" style={{ marginBottom: 14 }}>
          <div className="form-group">
            <label className="form-label">Min Salary</label>
            <input className="input" type="number" value={form.salary_range[0]} placeholder="e.g. 2200" onChange={e => setForm(f => ({ ...f, salary_range: [e.target.value, f.salary_range[1]] }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Max Salary</label>
            <input className="input" type="number" value={form.salary_range[1]} placeholder="e.g. 2600" onChange={e => setForm(f => ({ ...f, salary_range: [f.salary_range[0], e.target.value] }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Period</label>
            <select className="input select" value={form.salary_period} onChange={e => set('salary_period', e.target.value)}>
              <option value="month">per month</option>
              <option value="hour">per hour</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Spots Available</label>
            <input className="input" type="number" min={1} value={form.spots_left} placeholder="e.g. 3" onChange={e => set('spots_left', e.target.value)} />
          </div>
        </div>

        {/* Description */}
        <div className="section-title" style={{ marginBottom: 10 }}>Description</div>
        <div className="form-group" style={{ marginBottom: 14 }}>
          <textarea
            className="smp-email-textarea"
            rows={4}
            value={form.description}
            placeholder="Describe the role, day-to-day responsibilities, and what makes this opportunity great…"
            onChange={e => set('description', e.target.value)}
          />
        </div>

        {/* Highlights */}
        <div className="section-title" style={{ marginBottom: 10 }}>Highlights</div>
        <div style={{ marginBottom: 14 }}>
          {form.highlights.map((h, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                className="input"
                style={{ flex: 1 }}
                value={h}
                placeholder="e.g. Weekly pay"
                onChange={e => setList('highlights', i, e.target.value)}
              />
              <button className="btn btn-ghost btn-icon" onClick={() => removeFromList('highlights', i)}><X size={14} /></button>
            </div>
          ))}
          <button className="action-btn muted" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => addToList('highlights')}>
            <Plus size={12} /> Add highlight
          </button>
        </div>

        {/* Eligibility Requirements */}
        <div className="section-title" style={{ marginBottom: 10 }}>Eligibility Questions</div>
        <div style={{ marginBottom: 20 }}>
          {form.requirements.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                className="input"
                style={{ flex: 1 }}
                value={r}
                placeholder="e.g. Valid EU driving licence (B)"
                onChange={e => setList('requirements', i, e.target.value)}
              />
              <button className="btn btn-ghost btn-icon" onClick={() => removeFromList('requirements', i)}><X size={14} /></button>
            </div>
          ))}
          <button className="action-btn muted" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => addToList('requirements')}>
            <Plus size={12} /> Add requirement
          </button>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
          <button className="btn btn-dark" style={{ fontSize: 13 }} onClick={() => setConfirm(true)}>
            Publish
          </button>
          <button className="btn btn-outline" style={{ fontSize: 13 }} onClick={() => handleSave(false)}>
            Save Draft
          </button>
        </div>
      </div>

      {showConfirm && (
        <Modal title="Publish Job" onClose={() => setConfirm(false)}>
          <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            Publishing will make this job visible to candidates immediately. Are you sure?
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-dark" style={{ flex: 1 }} onClick={() => handleSave(true)}>Publish Now</button>
            <button className="btn btn-outline" onClick={() => setConfirm(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
