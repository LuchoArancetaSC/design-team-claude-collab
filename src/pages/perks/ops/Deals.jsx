import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tag, Search, Plus, Edit2, Eye, Copy, X, Check } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import Modal from '../../../components/Modal'
import { perksDeals, perksEmployers } from '../../../data'

const CATEGORIES = ['Travel', 'Electronics', 'Fashion', 'Food', 'Sport', 'Health']

const DEAL_STATS = {
  1: { clicks: 89,  redemptions: 18 },
  2: { clicks: 54,  redemptions: 11 },
  3: { clicks: 32,  redemptions: 7  },
  4: { clicks: 110, redemptions: 22 },
  5: { clicks: 67,  redemptions: 14 },
  6: { clicks: 41,  redemptions: 9  },
}

const BLANK_FORM = { title: '', provider: '', category: '', description: '', discount: '', status: 'active' }

let nextDealId = 20

function DealForm({ initial = BLANK_FORM, onSave, onClose, title: modalTitle }) {
  const [form, setForm] = useState({ ...BLANK_FORM, ...initial })
  const [done, setDone] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const canSave = form.title.trim() && form.provider && form.category && form.discount

  if (done) {
    return (
      <div className="success-screen">
        <div className="success-icon"><Check size={28} /></div>
        <div className="success-title">{modalTitle === 'Add Deal' ? 'Deal Created!' : 'Deal Updated!'}</div>
        <div className="success-subtitle">The deal has been saved successfully.</div>
        <button className="btn btn-dark btn-lg" onClick={() => { onSave(form); onClose() }} style={{ marginTop: 8 }}>Done</button>
      </div>
    )
  }

  return (
    <>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="input" value={form.title} placeholder="e.g. 20% off flights" onChange={e => set('title', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Provider</label>
          <select className="input select" value={form.provider} onChange={e => set('provider', e.target.value)}>
            <option value="">Select provider…</option>
            {perksEmployers.map(emp => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="input select" value={form.category} onChange={e => set('category', e.target.value)}>
            <option value="">Select category…</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Discount (%)</label>
          <input className="input" type="number" min={1} max={100} value={form.discount} placeholder="e.g. 20" onChange={e => set('discount', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="smp-email-textarea"
          rows={3}
          value={form.description}
          placeholder="Describe the deal offer and any conditions…"
          onChange={e => set('description', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label" style={{ marginBottom: 8 }}>Status</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {['active', 'draft'].map(s => (
            <button
              key={s}
              type="button"
              className={`action-btn${form.status === s ? ' smp-btn-active' : ''}`}
              onClick={() => set('status', s)}
              style={{ textTransform: 'capitalize', fontSize: 12 }}
            >
              {s === 'active' ? 'Active' : 'Draft'}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button
          className="btn btn-dark"
          style={{ flex: 1, opacity: canSave ? 1 : 0.45 }}
          disabled={!canSave}
          onClick={() => setDone(true)}
        >
          Save Deal
        </button>
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
      </div>
    </>
  )
}

export default function Deals() {
  const navigate = useNavigate()
  const [deals, setDeals]       = useState(perksDeals.map(d => ({ ...d })))
  const [search, setSearch]     = useState('')
  const [catFilter, setCat]     = useState('')
  const [modal, setModal]       = useState(null) // null | { mode: 'add' } | { mode: 'edit', deal }
  const [expireId, setExpireId] = useState(null)

  const filtered = deals.filter(d => {
    const text = `${d.title} ${d.employer} ${d.category}`.toLowerCase()
    if (search && !text.includes(search.toLowerCase())) return false
    if (catFilter && d.category !== catFilter) return false
    return true
  })

  const handleSave = (form) => {
    if (modal?.mode === 'add') {
      setDeals(prev => [...prev, {
        id: ++nextDealId,
        title: form.title,
        employer: form.provider,
        category: form.category,
        discount: Number(form.discount),
        validUntil: '31 Dec 2026',
        status: form.status,
      }])
    } else if (modal?.mode === 'edit') {
      setDeals(prev => prev.map(d => d.id === modal.deal.id
        ? { ...d, title: form.title, employer: form.provider, category: form.category, discount: Number(form.discount), status: form.status }
        : d
      ))
    }
    setModal(null)
  }

  const handleDuplicate = (deal) => {
    setDeals(prev => [...prev, { ...deal, id: ++nextDealId, title: `${deal.title} (copy)`, status: 'draft' }])
  }

  const handleExpire = (id) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, status: 'expired' } : d))
    setExpireId(null)
  }

  const statusVariant = (s) => s === 'active' ? 'active' : s === 'draft' ? 'draft' : 'archived'

  return (
    <div className="page-body">
      <PageHeader title="Deals Management" icon={<Tag size={18} />} banner />

      {/* Toolbar */}
      <div className="smp-toolbar">
        <div className="search-wrapper" style={{ flex: 1 }}>
          <Search size={14} className="search-icon" />
          <input
            className="search-input"
            placeholder="Search deals…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className={`filter-control${catFilter ? ' active' : ''}`}
          value={catFilter}
          onChange={e => setCat(e.target.value)}
          style={{ fontSize: 13 }}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          className="btn btn-dark"
          style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={() => setModal({ mode: 'add' })}
        >
          <Plus size={14} /> Add Deal
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Provider</th>
              <th>Category</th>
              <th>Discount</th>
              <th>Status</th>
              <th>Clicks</th>
              <th>Redemptions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-muted)', fontSize: 13 }}>
                  No deals found.
                </td>
              </tr>
            )}
            {filtered.map(d => {
              const stats = DEAL_STATS[d.id] || { clicks: 0, redemptions: 0 }
              return (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{d.title}</td>
                  <td style={{ fontSize: 13, color: 'var(--color-muted)' }}>{d.employer}</td>
                  <td style={{ fontSize: 12 }}>{d.category}</td>
                  <td style={{ fontSize: 13, fontWeight: 700 }}>{d.discount}%</td>
                  <td><Badge variant={statusVariant(d.status)}>{d.status === 'active' ? 'Active' : d.status === 'draft' ? 'Draft' : 'Expired'}</Badge></td>
                  <td style={{ fontSize: 13 }}>{stats.clicks}</td>
                  <td style={{ fontSize: 13 }}>{stats.redemptions}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <button className="btn btn-ghost btn-icon" title="View" onClick={() => navigate(`/perks/admin/deals/${d.id}`)}>
                        <Eye size={14} />
                      </button>
                      <button className="btn btn-ghost btn-icon" title="Edit" onClick={() => setModal({ mode: 'edit', deal: d })}>
                        <Edit2 size={14} />
                      </button>
                      <button className="btn btn-ghost btn-icon" title="Duplicate" onClick={() => handleDuplicate(d)}>
                        <Copy size={14} />
                      </button>
                      {d.status !== 'expired' && (
                        <button
                          className="action-btn muted"
                          style={{ fontSize: 11 }}
                          onClick={() => setExpireId(d.id)}
                        >
                          Expire
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit modal */}
      {modal && (
        <Modal
          title={modal.mode === 'add' ? 'Add Deal' : 'Edit Deal'}
          onClose={() => setModal(null)}
          size="lg"
        >
          <DealForm
            title={modal.mode === 'add' ? 'Add Deal' : 'Edit Deal'}
            initial={modal.mode === 'edit' ? {
              title: modal.deal.title,
              provider: modal.deal.employer,
              category: modal.deal.category,
              discount: String(modal.deal.discount),
              status: modal.deal.status,
              description: '',
            } : BLANK_FORM}
            onSave={handleSave}
            onClose={() => setModal(null)}
          />
        </Modal>
      )}

      {/* Expire confirmation */}
      {expireId && (
        <Modal title="Expire Deal" onClose={() => setExpireId(null)}>
          <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            This deal will be marked as expired and hidden from employees. This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-dark"
              style={{ background: 'var(--color-primary)', flex: 1 }}
              onClick={() => handleExpire(expireId)}
            >
              Expire Deal
            </button>
            <button className="btn btn-outline" onClick={() => setExpireId(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
