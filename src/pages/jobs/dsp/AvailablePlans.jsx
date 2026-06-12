import { useNavigate } from 'react-router-dom'
import { Layers, ChevronLeft, Check, X } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'
import Badge from '../../../components/Badge'
import { jobsCompanies } from '../../../data'

const COMPANY_ID = 1
const company    = jobsCompanies.find(c => c.id === COMPANY_ID)

const PRO_FEATURES = [
  { label: 'Hired / Onboarded Leads',     included: true  },
  { label: 'Unlimited candidate reveals',  included: true  },
  { label: 'Full background checks (KYC, DVLA, RTW)', included: true },
  { label: 'Priority queue placement',     included: true  },
  { label: 'Dedicated account manager',    included: true  },
  { label: 'HSM WhatsApp outreach',        included: true  },
  { label: 'Funnel analytics dashboard',   included: true  },
]

const STD_FEATURES = [
  { label: 'Filtered Leads (CV preview)',  included: true  },
  { label: 'Unlimited candidate reveals',  included: false },
  { label: 'Full background checks (KYC, DVLA, RTW)', included: false },
  { label: 'Priority queue placement',     included: false },
  { label: 'Dedicated account manager',    included: false },
  { label: 'HSM WhatsApp outreach',        included: false },
  { label: 'Funnel analytics dashboard',   included: true  },
]

function FeatureRow({ label, included }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--color-border)', fontSize: 13 }}>
      {included
        ? <Check size={14} color="#16a34a" style={{ flexShrink: 0 }} />
        : <X     size={14} color="#d4d4d8" style={{ flexShrink: 0 }} />
      }
      <span style={{ color: included ? 'var(--color-text)' : 'var(--color-muted)' }}>{label}</span>
    </div>
  )
}

export default function AvailablePlans() {
  const navigate = useNavigate()

  return (
    <div className="page-body">
      <PageHeader title="Available Plans" icon={<Layers size={18} />} banner />

      <button
        className="btn btn-ghost"
        style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, marginBottom: 20 }}
        onClick={() => navigate('/jobs/billing')}
      >
        <ChevronLeft size={15} /> Back to Billing
      </button>

      {/* Current plan */}
      <div className="card" style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            Current Plan
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, fontFamily: "'Poppins',sans-serif" }}>
            {company?.plan} · {company?.commitment}
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
            Vehicle: {company?.vehicle_type} · Renews {company?.plan_renewal_date}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Badge variant="active">Active</Badge>
          <button className="btn btn-outline btn-sm" style={{ fontSize: 12 }}>Change Plan</button>
        </div>
      </div>

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* PRO */}
        <div className="card" style={{ border: '2px solid #032F4F' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Best value
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Poppins',sans-serif" }}>PRO Plan</div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>Hired & Onboarded Leads</div>
            </div>
            <span style={{ background: '#032F4F', color: 'white', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6 }}>PRO</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Poppins',sans-serif" }}>£275</span>
            <span style={{ fontSize: 13, color: 'var(--color-muted)' }}> per hire</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 14, lineHeight: 1.6 }}>
            You only pay when we successfully onboard a driver. Includes full compliance checks, unlimited reveals, and priority support.
          </div>
          {PRO_FEATURES.map(f => <FeatureRow key={f.label} {...f} />)}
          <button
            className="btn btn-dark"
            style={{ width: '100%', marginTop: 16, fontSize: 13 }}
            disabled={company?.plan === 'PRO'}
          >
            {company?.plan === 'PRO' ? 'Current Plan' : 'Upgrade to PRO'}
          </button>
        </div>

        {/* Standard */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                Entry level
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Poppins',sans-serif" }}>Standard Plan</div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 2 }}>Filtered Leads</div>
            </div>
            <span style={{ background: '#f4f4f5', color: 'var(--color-text)', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6 }}>STD</span>
          </div>
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Poppins',sans-serif" }}>£149</span>
            <span style={{ fontSize: 13, color: 'var(--color-muted)' }}> per hire</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-muted)', marginBottom: 14, lineHeight: 1.6 }}>
            Access to a curated pool of filtered candidates. Reveals and compliance checks charged separately at standard rates.
          </div>
          {STD_FEATURES.map(f => <FeatureRow key={f.label} {...f} />)}
          <button
            className="btn btn-outline"
            style={{ width: '100%', marginTop: 16, fontSize: 13 }}
            disabled={company?.plan === 'Standard'}
          >
            {company?.plan === 'Standard' ? 'Current Plan' : 'Switch to Standard'}
          </button>
        </div>
      </div>
    </div>
  )
}
