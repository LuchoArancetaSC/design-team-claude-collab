import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Search, Plus, CheckCircle2 } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import Modal from '../../../components/Modal'
import { perksEmployees } from '../../../data'

const ROLES = ['Driver', 'Warehouse', 'Manager', 'Admin']

function AddEmployeeModal({ onClose }) {
  const [form, setForm]     = useState({ name: '', email: '', role: '' })
  const [success, setSuccess] = useState(false)

  const canSubmit = form.name.trim() && form.email.trim() && form.role

  if (success) {
    return (
      <div className="success-screen">
        <div className="success-icon"><CheckCircle2 size={28} /></div>
        <div className="success-title">Invitation Sent!</div>
        <div className="success-subtitle">
          An access link has been sent to <strong>{form.email}</strong>.<br />
          They'll appear as Pending until they activate their account.
        </div>
        <button className="btn btn-dark btn-lg" onClick={onClose} style={{ marginTop: 8 }}>
          Done
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <input
          className="input"
          placeholder="e.g. John Smith"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          className="input"
          type="email"
          placeholder="e.g. jsmith@company.com"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Role</label>
        <select
          className="input select"
          value={form.role}
          onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
        >
          <option value="">Select a role…</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button
          className="btn btn-dark"
          style={{ flex: 1, opacity: canSubmit ? 1 : 0.45 }}
          disabled={!canSubmit}
          onClick={() => setSuccess(true)}
        >
          Send Invite
        </button>
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
      </div>
    </>
  )
}

function DeactivateModal({ employee, onConfirm, onClose }) {
  return (
    <>
      <p style={{ fontSize: 14, color: 'var(--color-text)', marginBottom: 20, lineHeight: 1.6 }}>
        Are you sure you want to deactivate <strong>{employee.name}</strong>?
        They will lose access to all perks immediately.
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          className="btn btn-dark"
          style={{ background: 'var(--color-primary)', flex: 1 }}
          onClick={onConfirm}
        >
          Deactivate
        </button>
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
      </div>
    </>
  )
}

export default function Employees() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState(perksEmployees)
  const [search, setSearch]       = useState('')
  const [showAdd, setShowAdd]     = useState(false)
  const [deactivating, setDeactivating] = useState(null)

  const filtered = employees.filter(e =>
    `${e.name} ${e.email} ${e.company}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleDeactivate = (id) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, status: 'deactivated' } : e))
    setDeactivating(null)
  }

  const statusVariant = (s) => s === 'active' ? 'active' : s === 'pending' ? 'pending' : 'archived'
  const statusLabel   = (s) => s === 'active' ? 'Active' : s === 'pending' ? 'Pending' : 'Deactivated'

  return (
    <div className="page-body">
      <PageHeader title="Employee Management" icon={<Users size={18} />} banner />

      {/* Toolbar */}
      <div className="smp-toolbar">
        <div className="search-wrapper" style={{ flex: 1 }}>
          <Search size={14} className="search-icon" />
          <input
            className="search-input"
            placeholder="Search by name, email or company…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-dark" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setShowAdd(true)}>
          <Plus size={14} /> Add Employee
        </button>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Deals Used</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-muted)', fontSize: 13 }}>
                  No employees found.
                </td>
              </tr>
            )}
            {filtered.map(e => (
              <tr key={e.id}>
                <td>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{e.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{e.company}</div>
                </td>
                <td style={{ fontSize: 13, color: 'var(--color-muted)' }}>{e.email}</td>
                <td><Badge variant={statusVariant(e.status)}>{statusLabel(e.status)}</Badge></td>
                <td style={{ fontSize: 13 }}>{e.activeDeal ? 1 : 0}</td>
                <td style={{ fontSize: 12, color: 'var(--color-muted)' }}>{e.enrolled}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      className="action-btn"
                      style={{ fontSize: 11 }}
                      onClick={() => navigate(`/perks/employees/${e.id}`)}
                    >
                      View
                    </button>
                    {e.status !== 'deactivated' && (
                      <button
                        className="action-btn muted"
                        style={{ fontSize: 11 }}
                        onClick={() => setDeactivating(e)}
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title="Add Employee" onClose={() => setShowAdd(false)}>
          <AddEmployeeModal onClose={() => setShowAdd(false)} />
        </Modal>
      )}

      {deactivating && (
        <Modal title="Deactivate Employee" onClose={() => setDeactivating(null)}>
          <DeactivateModal
            employee={deactivating}
            onConfirm={() => handleDeactivate(deactivating.id)}
            onClose={() => setDeactivating(null)}
          />
        </Modal>
      )}
    </div>
  )
}
