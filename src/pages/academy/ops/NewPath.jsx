import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ChevronLeft, Plus } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'

export default function NewPath() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    org: 'Amazon DSP Alemania',
    profile: 'All',
    stalledDays: 14,
    status: 'draft',
  })

  const canSubmit = form.name.trim().length > 0

  const handleSubmit = () => {
    navigate('/academy/admin/paths/new/edit', { state: { pathForm: form } })
  }

  return (
    <div className="page-body">
      <PageHeader title="New Learning Path" icon={<BookOpen size={18} color="white" />} banner />

      <button className="back-link" onClick={() => navigate('/academy/admin/paths')}>
        <ChevronLeft size={15} /> Learning Paths
      </button>

      <div style={{ marginBottom: 28 }}>
        <div className="page-title">New Learning Path</div>
        <div className="page-subtitle">Set up the basic details before composing your path content.</div>
      </div>

      <div className="card" style={{ maxWidth: 480, padding: 24 }}>
        <div className="form-group">
          <label className="form-label">Path Name *</label>
          <input
            className="input"
            placeholder="e.g. Safety IT All Module"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Sub-Org</label>
          <select
            className="input select"
            value={form.org}
            onChange={e => setForm(f => ({ ...f, org: e.target.value }))}
          >
            <option value="Amazon DSP Alemania">Amazon DSP Alemania</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Profile flag</label>
          <select
            className="input select"
            value={form.profile}
            onChange={e => setForm(f => ({ ...f, profile: e.target.value }))}
          >
            {['All', 'Van', 'MM', 'Hybrid'].map(v => <option key={v}>{v}</option>)}
          </select>
          <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4 }}>
            Determines which learner profiles this path is assigned to.
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Stalled threshold (days)</label>
          <input
            className="input"
            type="number"
            min={1}
            value={form.stalledDays}
            onChange={e => setForm(f => ({ ...f, stalledDays: Number(e.target.value) }))}
            style={{ width: 100 }}
          />
          <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4 }}>
            Mark a learner as stalled if no activity after this many days.
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Initial Status</label>
          <select
            className="input select"
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
          >
            <option value="draft">Draft — not visible to learners</option>
            <option value="published">Published — live immediately</option>
          </select>
        </div>

        <div style={{
          display: 'flex', gap: 10, justifyContent: 'flex-end',
          marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--color-border)',
        }}>
          <button className="btn btn-outline" onClick={() => navigate('/academy/admin/paths')}>Cancel</button>
          <button
            className="btn btn-dark"
            disabled={!canSubmit}
            style={{ opacity: canSubmit ? 1 : 0.45 }}
            onClick={handleSubmit}
          >
            <Plus size={13} /> Create & Compose
          </button>
        </div>
      </div>
    </div>
  )
}
