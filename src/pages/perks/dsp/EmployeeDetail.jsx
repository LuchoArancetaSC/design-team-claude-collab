import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { User, ChevronLeft, Tag, Clock, CalendarDays } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import Modal from '../../../components/Modal'
import { perksEmployees, perksDeals } from '../../../data'

function DeactivateModal({ name, onConfirm, onClose }) {
  return (
    <>
      <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
        Are you sure you want to deactivate <strong>{name}</strong>?
        They will immediately lose access to all perks and deals.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="btn btn-dark"
          style={{ background: 'var(--color-primary)', flex: 1 }}
          onClick={onConfirm}
        >
          Confirm Deactivation
        </button>
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
      </div>
    </>
  )
}

const DEAL_HISTORY = {
  1: [
    { deal: 'Hotel discount 20%', provider: 'Globalia Travel', usedOn: '02 May 2026', savings: '€48.00' },
    { deal: '15% off flights',    provider: 'Globalia Travel', usedOn: '18 Mar 2026', savings: '€62.00' },
  ],
  2: [
    { deal: '15% off flights', provider: 'Globalia Travel', usedOn: '10 Apr 2026', savings: '€55.00' },
  ],
  5: [
    { deal: '€50 off laptops', provider: 'Mediamarkt', usedOn: '05 Apr 2026', savings: '€50.00' },
  ],
  6: [
    { deal: '25% off new collection', provider: 'Mango', usedOn: '22 Apr 2026', savings: '€37.00' },
  ],
  8: [
    { deal: '10% off all appliances', provider: 'Mediamarkt', usedOn: '15 Apr 2026', savings: '€28.00' },
  ],
}

export default function EmployeeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [employees, setEmployees] = useState(perksEmployees)
  const [showDeactivate, setShowDeactivate] = useState(false)

  const employee = employees.find(e => String(e.id) === String(id))

  if (!employee) {
    return (
      <div className="page-body">
        <PageHeader title="Employee Detail" icon={<User size={18} />} banner />
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-muted)', fontSize: 14 }}>
          Employee not found.
        </div>
      </div>
    )
  }

  const history = DEAL_HISTORY[employee.id] || []
  const statusVariant = employee.status === 'active' ? 'active' : employee.status === 'pending' ? 'pending' : 'archived'
  const statusLabel   = employee.status === 'active' ? 'Active' : employee.status === 'pending' ? 'Pending' : 'Deactivated'

  const handleDeactivate = () => {
    setEmployees(prev => prev.map(e => e.id === employee.id ? { ...e, status: 'deactivated' } : e))
    setShowDeactivate(false)
  }

  return (
    <div className="page-body">
      <PageHeader title={employee.name} icon={<User size={18} />} banner />

      {/* Back + status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button
          className="btn btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}
          onClick={() => navigate('/perks/employees')}
        >
          <ChevronLeft size={15} /> Back to Employees
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
          {employee.status !== 'deactivated' && (
            <button
              className="action-btn muted"
              style={{ fontSize: 12 }}
              onClick={() => setShowDeactivate(true)}
            >
              Deactivate
            </button>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="stats-row" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Deals Used</div>
              <div className="stat-value">{history.length}</div>
            </div>
            <div className="stat-icon blue"><Tag size={20} /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Last Active</div>
              <div className="stat-value" style={{ fontSize: 16 }}>
                {history.length ? history[0].usedOn : '—'}
              </div>
            </div>
            <div className="stat-icon green"><Clock size={20} /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Member Since</div>
              <div className="stat-value" style={{ fontSize: 16 }}>{employee.enrolled}</div>
            </div>
            <div className="stat-icon" style={{ background: '#fdf4ff', color: '#a855f7' }}>
              <CalendarDays size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Employee info card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Profile</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: 13 }}>
          {[
            ['Name',    employee.name],
            ['Email',   employee.email],
            ['Company', employee.company],
            ['Active Deal', employee.activeDeal || 'None'],
          ].map(([label, val]) => (
            <div key={label}>
              <span style={{ color: 'var(--color-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {label}
              </span>
              <div style={{ fontWeight: 500, marginTop: 2 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Deals used table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
        <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--color-border)' }}>
          <div className="section-title">Deal History</div>
          <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>All deals redeemed by this employee</div>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Deal</th>
              <th>Provider</th>
              <th>Used On</th>
              <th>Savings</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-muted)', fontSize: 13 }}>
                  No deals redeemed yet.
                </td>
              </tr>
            ) : history.map((h, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, fontSize: 13 }}>{h.deal}</td>
                <td style={{ fontSize: 13, color: 'var(--color-muted)' }}>{h.provider}</td>
                <td style={{ fontSize: 13 }}>{h.usedOn}</td>
                <td style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>{h.savings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeactivate && (
        <Modal title="Deactivate Employee" onClose={() => setShowDeactivate(false)}>
          <DeactivateModal
            name={employee.name}
            onConfirm={handleDeactivate}
            onClose={() => setShowDeactivate(false)}
          />
        </Modal>
      )}
    </div>
  )
}
