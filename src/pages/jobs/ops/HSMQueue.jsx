import { useState } from 'react'
import { MessageSquare, X } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import Modal from '../../../components/Modal'
import { jobsHSMQueue } from '../../../data'

const issueVariant = t => ({
  'KYC Blocked':       'overdue',
  'Document Rejected': 'pending',
  'Dispute':           'inprogress',
  'Other':             'draft',
}[t] ?? 'draft')

export default function HSMQueue() {
  const [filter,  setFilter]  = useState('Open')
  const [panel,   setPanel]   = useState(null)
  const [queue,   setQueue]   = useState(jobsHSMQueue)
  const [confirm, setConfirm] = useState(null) // 'resolve' | 'escalate'

  const list     = queue.filter(h => filter === 'All' || h.status === filter)
  const selected = panel ? queue.find(h => h.id === panel) : null

  const handleResolve = () => {
    setQueue(q => q.map(h => h.id === panel ? { ...h, status: 'Resolved' } : h))
    setConfirm(null)
    setPanel(null)
  }

  const handleEscalate = () => {
    setQueue(q => q.map(h => h.id === panel ? { ...h, status: 'Escalated' } : h))
    setConfirm(null)
    setPanel(null)
  }

  return (
    <div className="page-body">
      <PageHeader title="HSM Queue" icon={<MessageSquare size={18} color="white" />} banner />

      <div style={{ marginBottom: 20 }}>
        <div className="page-title">HSM Queue</div>
        <div className="page-subtitle">Manage open support cases and candidate escalations.</div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['Open', 'Resolved', 'All'].map(f => (
          <button
            key={f}
            className={`action-btn${filter === f ? ' smp-btn-active' : ''}`}
            style={{ fontSize: 12 }}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: panel ? '1fr 360px' : '1fr', gap: 20 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Candidate</th>
                <th>Company</th>
                <th>Issue Type</th>
                <th>Created</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map(h => (
                <tr
                  key={h.id}
                  style={{ cursor: 'pointer', background: panel === h.id ? 'var(--color-bg)' : undefined }}
                  onClick={() => setPanel(p => p === h.id ? null : h.id)}
                >
                  <td><span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700 }}>{h.id}</span></td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{h.candidate_name}</td>
                  <td style={{ fontSize: 13 }}>{h.company_name}</td>
                  <td><Badge variant={issueVariant(h.issue_type)}>{h.issue_type}</Badge></td>
                  <td style={{ fontSize: 12, color: 'var(--color-muted)' }}>{h.created}</td>
                  <td>
                    <Badge variant={h.status === 'Open' ? 'pending' : h.status === 'Resolved' ? 'active' : 'inprogress'}>
                      {h.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="card" style={{ alignSelf: 'start', position: 'sticky', top: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Case Detail</div>
              <button className="btn btn-ghost btn-icon" onClick={() => setPanel(null)}><X size={14} /></button>
            </div>

            <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: 'var(--color-muted)', marginBottom: 8 }}>{selected.id}</div>

            {[
              ['Candidate',  selected.candidate_name],
              ['Company',    selected.company_name],
              ['Issue Type', selected.issue_type],
              ['Created',    selected.created],
              ['Status',     <Badge variant={selected.status === 'Open' ? 'pending' : 'active'}>{selected.status}</Badge>],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--color-border)', fontSize: 12 }}>
                <span style={{ color: 'var(--color-muted)' }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{val}</span>
              </div>
            ))}

            <div style={{ marginTop: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Notes</div>
              <div style={{ fontSize: 12, lineHeight: 1.6 }}>{selected.notes}</div>
            </div>

            {selected.status === 'Open' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-dark"    style={{ flex: 1, fontSize: 12 }} onClick={() => setConfirm('resolve')}>Mark as Resolved</button>
                <button className="btn btn-outline"          style={{ fontSize: 12 }} onClick={() => setConfirm('escalate')}>Escalate</button>
              </div>
            )}
          </div>
        )}
      </div>

      {confirm === 'resolve' && (
        <Modal title="Mark as Resolved" onClose={() => setConfirm(null)}>
          <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            Mark case <strong>{panel}</strong> as resolved?
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-dark" style={{ flex: 1 }} onClick={handleResolve}>Confirm</button>
            <button className="btn btn-outline" onClick={() => setConfirm(null)}>Cancel</button>
          </div>
        </Modal>
      )}

      {confirm === 'escalate' && (
        <Modal title="Escalate Case" onClose={() => setConfirm(null)}>
          <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
            Escalate case <strong>{panel}</strong> for senior review? This cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-dark" style={{ flex: 1 }} onClick={handleEscalate}>Escalate</button>
            <button className="btn btn-outline" onClick={() => setConfirm(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
