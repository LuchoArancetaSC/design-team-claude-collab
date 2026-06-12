import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase, Users, AlertTriangle, CreditCard, Check,
  ArrowRight, Eye, EyeOff, Download, Gift, GraduationCap,
} from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import Modal from '../../../components/Modal'
import {
  jobsCandidates, jobsCompanies, jobsBilling, jobsFunnelStats,
} from '../../../data'

/* ── helpers ── */
const COMPANY_ID = 1
const company    = jobsCompanies.find(c => c.id === COMPANY_ID)

const stageBadge  = s => ({ raw: 'draft', activated: 'pending', delivered: 'assigned', hired: 'confirmed' }[s] ?? 'draft')
const stageLabel  = s => s.charAt(0).toUpperCase() + s.slice(1)
const tagVariant  = t => t === 'Top Rated' ? 'active' : t === 'Quick Start' ? 'assigned' : 'inprogress'
const billingVariant = s => ({ Charged: 'completed', Overdue: 'overdue', Included: 'inprogress' }[s] ?? 'draft')

const URGENCY = { 4: 2, 7: 1, 8: 3 }

/* ── Reveal modal ── */
function RevealModal({ candidate, onConfirm, onClose }) {
  return (
    <>
      <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
        You are about to reveal the full contact details of <strong>{candidate.name}</strong>.
      </p>
      <div className="invoice-summary" style={{ marginBottom: 20 }}>
        <div className="invoice-summary-row">
          <span style={{ color: 'var(--color-muted)' }}>Reveal charge</span>
          <span style={{ fontWeight: 700 }}>£100.00</span>
        </div>
        <div className="invoice-summary-row">
          <span style={{ color: 'var(--color-muted)' }}>Billed to</span>
          <span style={{ fontWeight: 500 }}>{company?.name}</span>
        </div>
        <div className="invoice-summary-row total">
          <span>Total due</span>
          <span>£100.00</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-dark" style={{ flex: 1 }} onClick={onConfirm}>
          Confirm Reveal
        </button>
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
      </div>
    </>
  )
}

/* ── Inline billing table ── */
function BillingTab() {
  const [filter, setFilter] = useState('')
  const list = filter ? jobsBilling.filter(i => i.status === filter) : jobsBilling
  const paid    = jobsBilling.filter(i => i.status === 'Charged').reduce((a, b) => a + b.amount, 0)
  const overdue = jobsBilling.filter(i => i.status === 'Overdue').reduce((a, b) => a + b.amount, 0)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        {['', 'Charged', 'Overdue', 'Included'].map(s => (
          <button
            key={s}
            className={`action-btn${filter === s ? ' smp-btn-active' : ''}`}
            style={{ fontSize: 12 }}
            onClick={() => setFilter(s)}
          >
            {s || 'All'}
          </button>
        ))}
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Details</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(inv => (
              <tr key={inv.id}>
                <td><span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700 }}>{inv.id}</span></td>
                <td>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {inv.type === 'hired'   ? `Hire – ${inv.driver_name}` :
                     inv.type === 'reveal'  ? `Reveal – ${inv.driver_name}` :
                     `Plan Renewal – ${inv.plan}`}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>
                    {inv.commitment} · {inv.vehicle_type} · {inv.city}
                  </div>
                </td>
                <td style={{ fontSize: 12, color: 'var(--color-muted)' }}>{inv.date}</td>
                <td style={{ fontWeight: 700 }}>
                  {inv.amount === 0 ? <span style={{ color: 'var(--color-muted)' }}>—</span> : `£${inv.amount.toFixed(2)}`}
                </td>
                <td><Badge variant={billingVariant(inv.status)}>{inv.status}</Badge></td>
                <td>
                  <button className="btn btn-ghost btn-icon" title="Download"><Download size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
        <div className="card" style={{ minWidth: 260 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
            <span style={{ color: 'var(--color-muted)' }}>Total Charged</span>
            <span style={{ fontWeight: 600, color: 'var(--color-success)' }}>£{paid.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingTop: 10, borderTop: '1px solid var(--color-border)' }}>
            <span style={{ fontWeight: 700 }}>Total Overdue</span>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>£{overdue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main component ── */
export default function RecruitmentHub() {
  const navigate = useNavigate()
  const [tab, setTab]         = useState('drivers')
  const [subTab, setSubTab]   = useState('all')
  const [revealing, setReveal] = useState(null)
  const [candidates, setCandidates] = useState(jobsCandidates)

  const myCandidates = candidates.filter(c => c.company_id === COMPANY_ID)
  const hired        = myCandidates.filter(c => c.funnel_stage === 'hired')
  const inPipeline   = myCandidates.filter(c => c.funnel_stage !== 'hired')
  const urgentList   = myCandidates.filter(c => URGENCY[c.id])

  const driversFiltered = subTab === 'revealed'
    ? myCandidates.filter(c => c.revealed)
    : subTab === 'unrevealed'
    ? myCandidates.filter(c => !c.revealed)
    : myCandidates

  const STAGES = ['raw', 'activated', 'delivered', 'hired']

  const confirmReveal = () => {
    setCandidates(prev => prev.map(c => c.id === revealing.id ? { ...c, revealed: true } : c))
    setReveal(null)
  }

  return (
    <div className="page-body">
      <PageHeader title="Recruitment Hub" icon={<Briefcase size={18} />} banner />

      {/* Stat cards */}
      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card dark">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label" style={{ color: '#a1a1aa' }}>Total Drivers</div>
              <div className="stat-value" style={{ color: 'white' }}>{myCandidates.length}</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(255,255,255,0.12)', color: 'white' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#a1a1aa', marginTop: 6 }}>+3 this month</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Urgent Leads</div>
              <div className="stat-value">{jobsFunnelStats.urgent_leads}</div>
            </div>
            <div className="stat-icon" style={{ background: 'rgba(255,75,75,0.1)', color: 'var(--color-primary)' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-primary)', marginTop: 6 }}>Expiring soon</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">Pending Charges</div>
              <div className="stat-value">£{company?.pending_charges?.toFixed(2)}</div>
            </div>
            <div className="stat-icon blue"><CreditCard size={20} /></div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 6 }}>1 transaction</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-row">
            <div>
              <div className="stat-label">In Pipeline</div>
              <div className="stat-value">{inPipeline.length}</div>
            </div>
            <div className="stat-icon green"><Briefcase size={20} /></div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 6 }}>{hired.length} hired</div>
        </div>
      </div>

      {/* Cross-sell banners */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ background: '#032F4F', color: 'white', borderColor: '#032F4F', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Employee benefits
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Unlock Perks for Your Team</div>
            <div style={{ fontSize: 12, color: '#a1a1aa', lineHeight: 1.5 }}>Give your drivers exclusive discounts and benefits.</div>
          </div>
          <button
            onClick={() => navigate('/perks')}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, color: 'white', padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <Gift size={13} /> Learn more <ArrowRight size={12} />
          </button>
        </div>

        <div className="card" style={{ border: '1.5px solid var(--color-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Academy
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Free Driver Training</div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', lineHeight: 1.5 }}>Safety and onboarding sessions included with your plan.</div>
          </div>
          <button
            onClick={() => navigate('/academy')}
            style={{ background: 'var(--color-primary)', border: 'none', borderRadius: 8, color: 'white', padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Poppins',sans-serif", whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <GraduationCap size={13} /> Get training <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Main tabs */}
      <div className="trainer-view-tabs" style={{ marginBottom: 20, display: 'inline-flex' }}>
        {[
          ['drivers',  'Drivers Directory'],
          ['urgent',   `Urgent Leads`],
          ['pipeline', 'Pipeline'],
          ['billing',  'Billing'],
        ].map(([val, label]) => (
          <button
            key={val}
            className={`trainer-view-tab${tab === val ? ' active' : ''}`}
            onClick={() => setTab(val)}
          >
            {label}
            {val === 'urgent' && urgentList.length > 0 && (
              <span style={{ marginLeft: 6, background: 'var(--color-primary)', color: 'white', borderRadius: 99, fontSize: 10, fontWeight: 700, padding: '1px 6px' }}>
                {urgentList.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Drivers Directory ── */}
      {tab === 'drivers' && (
        <>
          <div className="card" style={{ marginBottom: 16, background: '#fefce8', border: '1px solid #fde68a', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
            <EyeOff size={16} color="#ca8a04" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#854d0e' }}>
              Unrevealed candidates are anonymised. <strong>Revealing costs £100</strong> and gives you full contact details.
              Reveals are <strong>included free</strong> on the PRO plan (No-brainer model).
            </span>
          </div>

          {/* Sub-tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[['all', 'All'], ['revealed', 'Revealed'], ['unrevealed', 'Unrevealed']].map(([v, l]) => (
              <button
                key={v}
                className={`action-btn${subTab === v ? ' smp-btn-active' : ''}`}
                style={{ fontSize: 12 }}
                onClick={() => setSubTab(v)}
              >
                {l}
                <span style={{ marginLeft: 5, fontSize: 11, color: 'var(--color-muted)' }}>
                  {v === 'all' ? myCandidates.length : v === 'revealed' ? myCandidates.filter(c => c.revealed).length : myCandidates.filter(c => !c.revealed).length}
                </span>
              </button>
            ))}
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Quality Tags</th>
                  <th>Details</th>
                  <th>Requirements</th>
                  <th>Stage</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {driversFiltered.map(c => (
                  <tr
                    key={c.id}
                    style={{ cursor: c.revealed ? 'pointer' : 'default' }}
                    onClick={() => c.revealed && navigate(`/jobs/candidates/${c.id}`)}
                  >
                    <td>
                      {c.revealed ? (
                        <>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{c.email}</div>
                        </>
                      ) : (
                        <>
                          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-muted)', letterSpacing: '0.05em' }}>
                            ● ● ● ● ●
                          </div>
                          <div style={{ fontSize: 11, color: '#d4d4d8' }}>Hidden</div>
                        </>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {c.quality_tags.length === 0
                          ? <span style={{ fontSize: 11, color: '#d4d4d8' }}>—</span>
                          : c.quality_tags.map(t => (
                            <Badge key={t} variant={tagVariant(t)}>{t}</Badge>
                          ))
                        }
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>
                      <div>{c.location} · {c.distance_km} km</div>
                      <div style={{ color: 'var(--color-muted)' }}>{c.vehicle_type}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {[
                          ['KYC',    c.kyc_status],
                          ['DVLA',   c.dvla_status],
                          ['RTW',    c.right_to_work],
                        ].map(([label, status]) => (
                          <span
                            key={label}
                            style={{
                              fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6,
                              background: status === 'verified' ? '#f0fdf4' : status === 'rejected' ? '#fff1f1' : '#fafafa',
                              color:      status === 'verified' ? '#16a34a' : status === 'rejected' ? 'var(--color-primary)' : '#a1a1aa',
                              border:     `1px solid ${status === 'verified' ? '#bbf7d0' : status === 'rejected' ? '#fecaca' : '#e4e4e7'}`,
                            }}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td><Badge variant={stageBadge(c.funnel_stage)}>{stageLabel(c.funnel_stage)}</Badge></td>
                    <td onClick={e => e.stopPropagation()}>
                      {c.revealed ? (
                        <button
                          className="action-btn"
                          style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                          onClick={() => navigate(`/jobs/candidates/${c.id}`)}
                        >
                          <Eye size={11} /> View
                        </button>
                      ) : (
                        <button
                          className="btn btn-dark btn-sm btn-pill"
                          style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                          onClick={() => setReveal(c)}
                        >
                          <Eye size={11} /> Reveal
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Urgent Leads ── */}
      {tab === 'urgent' && (
        <div>
          {urgentList.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-muted)', fontSize: 14 }}>
              No urgent leads at this time.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {urgentList.map(c => {
                const days = URGENCY[c.id]
                return (
                  <div
                    key={c.id}
                    className="card"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderLeft: '4px solid var(--color-primary)' }}
                    onClick={() => c.revealed && navigate(`/jobs/candidates/${c.id}`)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{c.revealed ? c.name : '● ● ● ●'}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{c.location} · {c.vehicle_type} · {c.distance_km} km away</div>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {c.quality_tags.map(t => <Badge key={t} variant={tagVariant(t)}>{t}</Badge>)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>{days} day{days !== 1 ? 's' : ''} left</div>
                        <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>Expires from pool</div>
                      </div>
                      {!c.revealed && (
                        <button
                          className="btn btn-dark btn-sm btn-pill"
                          style={{ fontSize: 11 }}
                          onClick={e => { e.stopPropagation(); setReveal(c) }}
                        >
                          <Eye size={11} /> Reveal
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Pipeline Kanban ── */}
      {tab === 'pipeline' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'start' }}>
          {STAGES.map(stage => {
            const cols = myCandidates.filter(c => c.funnel_stage === stage)
            return (
              <div key={stage}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-muted)' }}>
                    {stageLabel(stage)}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, background: '#f4f4f5', borderRadius: 99, padding: '1px 8px', color: 'var(--color-text)' }}>
                    {cols.length}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cols.length === 0 && (
                    <div style={{ fontSize: 12, color: '#d4d4d8', textAlign: 'center', padding: '20px 0', border: '1.5px dashed #e4e4e7', borderRadius: 10 }}>
                      No candidates
                    </div>
                  )}
                  {cols.map(c => (
                    <div
                      key={c.id}
                      className="card"
                      style={{ padding: '12px 14px', cursor: c.revealed ? 'pointer' : 'default' }}
                      onClick={() => c.revealed && navigate(`/jobs/candidates/${c.id}`)}
                    >
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>
                        {c.revealed ? c.name : '● ● ● ●'}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 6 }}>
                        {c.vehicle_type} · {c.applied_date}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {c.quality_tags.map(t => <Badge key={t} variant={tagVariant(t)}>{t}</Badge>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Billing ── */}
      {tab === 'billing' && <BillingTab />}

      {revealing && (
        <Modal title="Reveal Candidate" onClose={() => setReveal(null)}>
          <RevealModal candidate={revealing} onConfirm={confirmReveal} onClose={() => setReveal(null)} />
        </Modal>
      )}
    </div>
  )
}
