import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { User, ChevronLeft, ChevronDown, ChevronUp, MapPin, Truck, ArrowRight, Check } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import Modal from '../../../components/Modal'
import { jobsCandidates } from '../../../data'

const STAGES     = ['raw', 'activated', 'delivered', 'hired']
const stageBadge = s => ({ raw: 'draft', activated: 'pending', delivered: 'assigned', hired: 'confirmed' }[s] ?? 'draft')
const stageLabel = s => s.charAt(0).toUpperCase() + s.slice(1)
const tagVariant = t => t === 'Top Rated' ? 'active' : t === 'Quick Start' ? 'assigned' : 'inprogress'

const verifyVariant = s => s === 'verified' ? 'active' : s === 'rejected' ? 'overdue' : 'pending'
const verifyLabel   = s => s.charAt(0).toUpperCase() + s.slice(1)

function VerificationAccordion({ title, status, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid var(--color-border)', borderRadius: 10, marginBottom: 8, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', background: 'white', border: 'none', cursor: 'pointer',
          fontFamily: "'Poppins',sans-serif",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Badge variant={verifyVariant(status)}>{verifyLabel(status)}</Badge>
          {open ? <ChevronUp size={15} color="var(--color-muted)" /> : <ChevronDown size={15} color="var(--color-muted)" />}
        </div>
      </button>
      {open && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)', background: '#fafafa', fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.6 }}>
          {children}
        </div>
      )}
    </div>
  )
}

function MoveStageModal({ candidate, nextStage, onConfirm, onClose }) {
  const isHire = nextStage === 'hired'
  return (
    <>
      <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
        {isHire
          ? <>You are about to mark <strong>{candidate.name}</strong> as <strong>Hired</strong>. A hire fee will be charged to your account.</>
          : <>Move <strong>{candidate.name}</strong> from <strong>{stageLabel(candidate.funnel_stage)}</strong> to <strong>{stageLabel(nextStage)}</strong>?</>
        }
      </p>
      {isHire && (
        <div className="invoice-summary" style={{ marginBottom: 20 }}>
          <div className="invoice-summary-row">
            <span style={{ color: 'var(--color-muted)' }}>Hire fee</span>
            <span style={{ fontWeight: 700 }}>£275.00</span>
          </div>
          <div className="invoice-summary-row total">
            <span>Total charged</span>
            <span>£275.00</span>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-dark" style={{ flex: 1 }} onClick={onConfirm}>
          {isHire ? 'Confirm Hire' : 'Move Stage'}
        </button>
        <button className="btn btn-outline" onClick={onClose}>Cancel</button>
      </div>
    </>
  )
}

export default function CandidateProfile() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [candidates, setCandidates] = useState(jobsCandidates)
  const [showMove, setShowMove]     = useState(false)

  const candidate = candidates.find(c => String(c.id) === String(id))

  if (!candidate) {
    return (
      <div className="page-body">
        <PageHeader title="Candidate Profile" icon={<User size={18} />} banner />
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-muted)', fontSize: 14 }}>
          Candidate not found.
        </div>
      </div>
    )
  }

  const currentIdx = STAGES.indexOf(candidate.funnel_stage)
  const nextStage  = currentIdx < STAGES.length - 1 ? STAGES[currentIdx + 1] : null

  const handleMove = () => {
    if (!nextStage) return
    setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, funnel_stage: nextStage } : c))
    setShowMove(false)
  }

  return (
    <div className="page-body">
      <PageHeader title={candidate.name} icon={<User size={18} />} banner />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <button
          className="btn btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 }}
          onClick={() => navigate('/jobs')}
        >
          <ChevronLeft size={15} /> Back to Recruitment Hub
        </button>
        <Badge variant={stageBadge(candidate.funnel_stage)}>{stageLabel(candidate.funnel_stage)}</Badge>
      </div>

      {/* Profile card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6, fontFamily: "'Poppins',sans-serif" }}>{candidate.name}</div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--color-muted)', marginBottom: 10 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} /> {candidate.location} · {candidate.distance_km} km away</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Truck size={13} /> {candidate.vehicle_type}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {candidate.quality_tags.length === 0
                ? <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>No quality tags</span>
                : candidate.quality_tags.map(t => <Badge key={t} variant={tagVariant(t)}>{t}</Badge>)
              }
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: 12 }}>
            {[
              ['Email',        candidate.email],
              ['Phone',        candidate.phone],
              ['Applied',      candidate.applied_date],
              ['Eligibility',  candidate.eligibility_result === 'pass' ? 'Pass' : candidate.eligibility_result === 'fail' ? 'Fail' : 'Pending'],
            ].map(([label, val]) => (
              <div key={label}>
                <div style={{ color: 'var(--color-muted)', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{label}</div>
                <div style={{ fontWeight: 500 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification accordions */}
      <div className="section-title" style={{ marginBottom: 12 }}>Verification Checks</div>
      <div style={{ marginBottom: 24 }}>
        <VerificationAccordion title="Verify Identity (KYC)" status={candidate.kyc_status}>
          Know Your Customer check — confirms the candidate's identity matches their submitted documents.
          {candidate.kyc_status === 'verified' && (
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, color: '#16a34a', fontWeight: 600 }}>
              <Check size={13} /> Identity verified on {candidate.applied_date}
            </div>
          )}
        </VerificationAccordion>

        <VerificationAccordion title="Check Driving Licence (DVLA)" status={candidate.dvla_status}>
          DVLA licence check — verifies the candidate holds a valid driving licence for the required vehicle type ({candidate.vehicle_type}).
          {candidate.dvla_status === 'pending' && (
            <div style={{ marginTop: 8, color: '#ca8a04', fontWeight: 600, fontSize: 12 }}>
              Awaiting DVLA response. Usually takes 1–2 working days.
            </div>
          )}
        </VerificationAccordion>

        <VerificationAccordion title="Right to Work" status={candidate.right_to_work}>
          Confirms the candidate has the legal right to work in the posting country.
          {candidate.right_to_work === 'rejected' && (
            <div style={{ marginTop: 8, color: 'var(--color-primary)', fontWeight: 600, fontSize: 12 }}>
              Right to work could not be verified. This candidate is not eligible for hire.
            </div>
          )}
        </VerificationAccordion>
      </div>

      {/* Stage action */}
      {candidate.funnel_stage !== 'hired' && nextStage && (
        <button
          className="btn btn-dark"
          style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 7 }}
          onClick={() => setShowMove(true)}
          disabled={candidate.eligibility_result === 'fail'}
        >
          {nextStage === 'hired'
            ? <><Check size={14} /> Mark as Hired</>
            : <>Move to {stageLabel(nextStage)} <ArrowRight size={14} /></>
          }
        </button>
      )}
      {candidate.funnel_stage === 'hired' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#16a34a', fontWeight: 600 }}>
          <Check size={16} /> Hired
        </div>
      )}

      {showMove && nextStage && (
        <Modal
          title={nextStage === 'hired' ? 'Confirm Hire' : 'Move Stage'}
          onClose={() => setShowMove(false)}
        >
          <MoveStageModal
            candidate={candidate}
            nextStage={nextStage}
            onConfirm={handleMove}
            onClose={() => setShowMove(false)}
          />
        </Modal>
      )}
    </div>
  )
}
