import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Users, ChevronLeft, Award, Download, ShieldOff, Mail, Building2 } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import { adminLearners, certificates } from '../../../data'

const AVATAR_COLORS = ['#1d4ed8', '#7c3aed', '#059669', '#d97706', '#dc2626']

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function CompletionBar({ pct }) {
  const color = pct === 100 ? 'var(--color-success)' : pct >= 50 ? 'var(--color-warning)' : pct === 0 ? '#e4e4e7' : '#ff4b4b'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 8, background: '#f4f4f5', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', minWidth: 36 }}>{pct}%</span>
    </div>
  )
}

const ACCOUNT_LABEL  = { active: 'Active', invited: 'Invited', registered: 'Registered', stalled: 'Stalled' }
const PATH_LABEL     = { completed: 'Completed', inprogress: 'In Progress', stalled: 'Stalled', draft: 'Assigned' }
const CERT_STATUS_LABEL   = { valid: 'Valid', expired: 'Expired', revoked: 'Revoked' }
const CERT_STATUS_VARIANT = { valid: 'confirmed', expired: 'overdue', revoked: 'past' }

const fmtDate = iso => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const fmtMonth = iso => new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })

export default function LearnerDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const learnersBase = location.pathname.startsWith('/academy/admin') ? '/academy/admin/learners' : '/academy/learners'

  const learner = adminLearners.find(l => String(l.id) === String(id))

  if (!learner) {
    return (
      <div className="page-body">
        <PageHeader title="Learners" icon={<Users size={18} color="white" />} banner />
        <button className="back-link" onClick={() => navigate(learnersBase)}>
          <ChevronLeft size={15} /> Learners
        </button>
        <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--color-muted)', fontSize: 14 }}>
          Learner not found.
        </div>
      </div>
    )
  }

  const colorIdx = (learner.id - 1) % AVATAR_COLORS.length
  const learnerCerts = certificates.filter(c => c.learnerEmail === learner.email)

  return (
    <div className="page-body">
      <PageHeader title="Learners" icon={<Users size={18} color="white" />} banner />

      <button className="back-link" onClick={() => navigate(learnersBase)}>
        <ChevronLeft size={15} /> Learners
      </button>

      {/* Profile header */}
      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div
            className="driver-avatar"
            style={{
              background: AVATAR_COLORS[colorIdx],
              width: 56, height: 56, fontSize: 18, flexShrink: 0,
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontFamily: "'Poppins', sans-serif",
            }}
          >
            {getInitials(learner.name)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4, fontFamily: "'Poppins', sans-serif" }}>
              {learner.name}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-muted)' }}>
                <Mail size={13} /> {learner.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-muted)' }}>
                <Building2 size={13} /> {learner.org}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Badge variant={learner.accountStatus}>{ACCOUNT_LABEL[learner.accountStatus]}</Badge>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>

        {/* Path progress */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Learning Path</div>

          <div style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{learner.pathName}</span>
              <Badge variant={learner.pathStatus}>{PATH_LABEL[learner.pathStatus]}</Badge>
            </div>
            <CompletionBar pct={learner.progress} />
          </div>

          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Sub-Org',       value: learner.org },
              { label: 'Path Status',   value: PATH_LABEL[learner.pathStatus] },
              { label: 'Completion',    value: `${learner.progress}%` },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 13, padding: '6px 0',
                borderBottom: '1px solid var(--color-border)',
              }}>
                <span style={{ color: 'var(--color-muted)', fontWeight: 500 }}>{row.label}</span>
                <span style={{ fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
          </div>

          {learner.accountStatus === 'invited' && (
            <button className="btn btn-outline btn-sm" style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}>
              <Mail size={12} /> Resend Invitation
            </button>
          )}
        </div>

        {/* Certificates */}
        <div className="card" style={{ padding: 20 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>
            Certificates
            {learnerCerts.length > 0 && (
              <span style={{
                marginLeft: 8, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(5,150,105,0.1)', color: 'var(--color-success)',
                fontSize: 10, fontWeight: 700,
                width: 20, height: 20, borderRadius: 99,
              }}>
                {learnerCerts.length}
              </span>
            )}
          </div>

          {learnerCerts.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '28px 16px',
              color: 'var(--color-muted)', fontSize: 13, lineHeight: 1.6,
            }}>
              <Award size={28} color="#e4e4e7" style={{ marginBottom: 8 }} />
              <div>No certificates issued yet.</div>
              {learner.pathStatus !== 'completed' && (
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  Issued automatically upon path completion.
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {learnerCerts.map(cert => (
                <div key={cert.id} style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 8, padding: '14px 16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{cert.pathName}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{cert.id}</div>
                    </div>
                    <Badge variant={CERT_STATUS_VARIANT[cert.status]}>{CERT_STATUS_LABEL[cert.status]}</Badge>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--color-muted)', marginBottom: 10 }}>
                    <span>Issued: {fmtDate(cert.issuedAt)}</span>
                    <span>Expires: {fmtMonth(cert.expiresAt)}</span>
                    <span style={{ color: cert.score >= 80 ? 'var(--color-success)' : 'var(--color-destructive)', fontWeight: 600 }}>
                      Score: {cert.score}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline btn-sm" style={{ gap: 4 }}>
                      <Download size={12} /> Download
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-destructive)', gap: 4 }}>
                      <ShieldOff size={12} /> Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
