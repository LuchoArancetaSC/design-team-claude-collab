import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Tag, ChevronLeft, MousePointerClick, RefreshCw, TrendingUp, Check } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import Modal from '../../../components/Modal'
import { perksDeals, perksEmployers } from '../../../data'

const DEAL_STATS = {
  1: { clicks: 89,  redemptions: 18 },
  2: { clicks: 54,  redemptions: 11 },
  3: { clicks: 32,  redemptions: 7  },
  4: { clicks: 110, redemptions: 22 },
  5: { clicks: 67,  redemptions: 14 },
  6: { clicks: 41,  redemptions: 9  },
}

const CATEGORIES = ['Travel', 'Electronics', 'Fashion', 'Food', 'Sport', 'Health']

export default function DealDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const source     = perksDeals.find(d => String(d.id) === String(id))

  const [deal, setDeal]         = useState(source || null)
  const [saved, setSaved]       = useState(false)
  const [showExpire, setExpire] = useState(false)
  const [expired, setExpired]   = useState(false)

  if (!deal) {
    return (
      <div className="page-body">
        <PageHeader title="Deal Detail" icon={<Tag size={18} />} banner />
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-muted)', fontSize: 14 }}>
          Deal not found.
        </div>
      </div>
    )
  }

  const stats = DEAL_STATS[deal.id] || { clicks: 0, redemptions: 0 }
  const convRate = stats.clicks > 0 ? ((stats.redemptions / stats.clicks) * 100).toFixed(1) : '0.0'
  const set = (k, v) => { setDeal(d => ({ ...d, [k]: v })); setSaved(false) }
  const statusVariant = expired ? 'archived' : deal.status === 'active' ? 'active' : 'draft'
  const statusLabel   = expired ? 'Expired'  : deal.status === 'active' ? 'Active'  : 'Draft'

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }
  const handleExpire = () => { setExpired(true); setExpire(false) }

  return (
    <div className="page-body">
      <PageHeader title={deal.title} icon={<Tag size={18} />} banner />

      {/* Nav bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button
          className="btn btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}
          onClick={() => navigate('/perks/admin/deals')}
        >
          <ChevronLeft size={15} /> Back to Deals
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
          {!expired && (
            <button className="action-btn muted" style={{ fontSize: 12 }} onClick={() => setExpire(true)}>
              Expire Deal
            </button>
          )}
        </div>
      </div>

      {/* Metric cards */}
      <div className="stats-row" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Total Clicks</div>
              <div className="stat-value">{stats.clicks}</div>
            </div>
            <div className="stat-icon blue"><MousePointerClick size={20} /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Redemptions</div>
              <div className="stat-value">{stats.redemptions}</div>
            </div>
            <div className="stat-icon green"><RefreshCw size={20} /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Conversion Rate</div>
              <div className="stat-value">{convRate}%</div>
            </div>
            <div className="stat-icon" style={{ background: '#fdf4ff', color: '#a855f7' }}>
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="card">
        <div className="section-title" style={{ marginBottom: 16 }}>Deal Details</div>

        <div className="form-grid" style={{ marginBottom: 14 }}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="input"
              value={deal.title}
              disabled={expired}
              onChange={e => set('title', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Provider</label>
            <select
              className="input select"
              value={deal.employer}
              disabled={expired}
              onChange={e => set('employer', e.target.value)}
            >
              {perksEmployers.map(emp => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="input select"
              value={deal.category}
              disabled={expired}
              onChange={e => set('category', e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Discount (%)</label>
            <input
              className="input"
              type="number"
              min={1}
              max={100}
              value={deal.discount}
              disabled={expired}
              onChange={e => set('discount', Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Valid Until</label>
            <input
              className="input"
              value={deal.validUntil}
              disabled={expired}
              onChange={e => set('validUntil', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="input select"
              value={deal.status}
              disabled={expired}
              onChange={e => set('status', e.target.value)}
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label className="form-label">Description</label>
          <textarea
            className="smp-email-textarea"
            rows={3}
            disabled={expired}
            value={deal.description || ''}
            placeholder="Deal description and conditions…"
            onChange={e => set('description', e.target.value)}
          />
        </div>

        {!expired && (
          <button
            className="btn btn-dark"
            style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
            onClick={handleSave}
          >
            {saved ? <><Check size={14} /> Saved!</> : 'Save Changes'}
          </button>
        )}
      </div>

      {showExpire && (
        <Modal title="Expire Deal" onClose={() => setExpire(false)}>
          <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            Expiring <strong>{deal.title}</strong> will remove it from the employee portal immediately.
            This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-dark"
              style={{ background: 'var(--color-primary)', flex: 1 }}
              onClick={handleExpire}
            >
              Confirm Expiry
            </button>
            <button className="btn btn-outline" onClick={() => setExpire(false)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
