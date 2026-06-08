import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Plus, Edit2, Eye, ChevronsUpDown } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Badge from '../../components/Badge'
import { adminPaths } from '../../data'

const STATUS_LABEL = {
  published:  'Published',
  draft:      'Draft',
  inprogress: 'In Progress',
  archived:   'Archived',
}

function SortIcon() {
  return <ChevronsUpDown size={12} color="var(--color-muted)" />
}

function CompletionBar({ pct }) {
  const color = pct === 100 ? 'var(--color-success)' : pct >= 50 ? 'var(--color-warning)' : pct === 0 ? '#e4e4e7' : '#ff4b4b'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 72, height: 6, background: '#f4f4f5', borderRadius: 99, overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', minWidth: 32 }}>{pct}%</span>
    </div>
  )
}

export default function LearningPaths() {
  const navigate = useNavigate()
  const [search, setSearch]             = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterOrg, setFilterOrg]       = useState('')

  const filtered = adminPaths.filter(p => {
    if (filterStatus && p.status !== filterStatus) return false
    if (filterOrg    && p.org    !== filterOrg)    return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="page-body">
      <PageHeader title="Learning Paths" icon={<BookOpen size={18} color="white" />} banner />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <div className="page-title">Learning Paths</div>
          <div className="page-subtitle">Build and manage training paths for your learners.</div>
        </div>
        <button className="btn btn-dark btn-sm" onClick={() => navigate('/admin/paths/new')}>
          <Plus size={13} /> New Path
        </button>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div>
          <div className="filter-field-label">Search</div>
          <input
            className={`filter-control${search ? ' active' : ''}`}
            type="text"
            placeholder="Search paths..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: 200 }}
          />
        </div>
        <div>
          <div className="filter-field-label">Status</div>
          <select
            className={`filter-control${filterStatus ? ' active' : ''}`}
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="inprogress">In Progress</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <div>
          <div className="filter-field-label">Sub-Org</div>
          <select
            className={`filter-control${filterOrg ? ' active' : ''}`}
            value={filterOrg}
            onChange={e => setFilterOrg(e.target.value)}
          >
            <option value="">All</option>
            <option value="Amazon DSP Alemania">Amazon DSP Alemania</option>
          </select>
        </div>
        {(search || filterStatus || filterOrg) && (
          <button className="filter-clear" onClick={() => { setSearch(''); setFilterStatus(''); setFilterOrg('') }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Paths table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Path</th>
              <th>Sub-Org</th>
              <th><span className="th-sortable">Acts <SortIcon /></span></th>
              <th>Microlessons</th>
              <th><span className="th-sortable">Learners <SortIcon /></span></th>
              <th>Completion</th>
              <th><span className="th-sortable">Status <SortIcon /></span></th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', color: 'var(--color-muted)', padding: '32px 16px', fontSize: 13 }}>
                  No paths match the current filters.
                </td>
              </tr>
            ) : (
              filtered.map(path => (
                <tr
                  key={path.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/paths/${path.id}`)}
                >
                  <td>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{path.name}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{path.org}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13 }}>{path.acts} acts</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13 }}>{path.microlessons}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13 }}>{path.learners}</span>
                  </td>
                  <td style={{ minWidth: 130 }}>
                    <CompletionBar pct={path.completion} />
                  </td>
                  <td>
                    <Badge variant={path.status}>{STATUS_LABEL[path.status]}</Badge>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        className="btn btn-ghost btn-icon"
                        title="Edit"
                        onClick={() => navigate(`/admin/paths/${path.id}/edit`)}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="btn btn-ghost btn-icon"
                        title="View"
                        onClick={() => navigate(`/admin/paths/${path.id}`)}
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
