import { useNavigate } from 'react-router-dom'
import { Building2, Plus, Edit2, Eye, FileText } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Badge from '../../components/Badge'

export default function Tenants() {
  const navigate = useNavigate()

  return (
    <div className="page-body">
      <PageHeader title="Tenants & Sub-Orgs" icon={<Building2 size={18} color="white" />} banner />

      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Tenants & Sub-Orgs</div>
        <div className="page-subtitle">Manage your tenant organisations and sub-org structure.</div>
      </div>

      {/* Active tenant card */}
      <div className="card" style={{ marginBottom: 24, border: '2px solid var(--color-dark)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>Amazon DE</span>
              <Badge variant="active">Active</Badge>
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 20 }}>
              Enterprise Client &nbsp;·&nbsp; Created 01 Jan 2026
            </div>
            <div style={{ display: 'flex', gap: 40 }}>
              {[
                { label: 'Sub-Orgs',        value: 1   },
                { label: 'Learners',         value: 247 },
                { label: 'Paths asignados',  value: 3   },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.1 }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 500, marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost btn-sm" style={{ gap: 4 }} onClick={() => navigate('/admin/invoices')}>
              <FileText size={13} /> Invoices
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/tenants/1')}>
              Manage Tenant
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Orgs section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="section-title">Sub-Organisations</div>
        <button className="btn btn-dark btn-sm" onClick={() => navigate('/admin/tenants/new')}>
          <Plus size={13} /> New Sub-Org
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Sub-Org</th>
              <th>Org Admin</th>
              <th>Learners</th>
              <th>Paths asignados</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span style={{ fontWeight: 600, fontSize: 13 }}>Amazon DSP Alemania</span>
              </td>
              <td>
                <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>admin@amazon-de.com</span>
              </td>
              <td>
                <span style={{ fontSize: 13 }}>247 learners</span>
              </td>
              <td>
                <span style={{ fontSize: 13 }}>3 paths</span>
              </td>
              <td>
                <Badge variant="active">Active</Badge>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button className="btn btn-ghost btn-icon" title="Edit">
                    <Edit2 size={14} />
                  </button>
                  <button
                    className="btn btn-ghost btn-icon"
                    title="View"
                    onClick={() => navigate('/admin/tenants/1')}
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '24px 16px', fontSize: 13 }}>
                No more sub-orgs
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
