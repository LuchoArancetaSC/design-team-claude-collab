import { useNavigate } from 'react-router-dom'
import { ChevronRight, Filter, ChevronDown, Flame } from 'lucide-react'
import { driverJobs } from '../../../data'

const HERO_BG      = 'https://www.figma.com/api/mcp/asset/a949bd30-b836-4399-90d8-d698e1a1d528'
const HERO_OVERLAY = 'https://www.figma.com/api/mcp/asset/092d033d-82b8-4c28-954f-fa2d332ba398'
const CARD_PHOTO   = 'https://www.figma.com/api/mcp/asset/14f5e37c-c85d-446e-a92b-9979624e1e32'
const CARD_MASK_1  = 'https://www.figma.com/api/mcp/asset/433ce97f-b99c-405a-8ee1-0994ddb1241d'
const CARD_MASK_2  = 'https://www.figma.com/api/mcp/asset/fd752cab-3960-47ed-88d8-b69356852522'
const COMPANY_LOGO = 'https://www.figma.com/api/mcp/asset/8a5b166f-1541-470b-b0bf-30dcdd75d3fc'
const ELLIPSE1     = 'https://www.figma.com/api/mcp/asset/7aae923b-485e-4f7e-a75b-a9776386262c'
const ICON_SEARCH  = 'https://www.figma.com/api/mcp/asset/ee5f5a61-5373-424b-81ba-017daf81175c'
const ICON_ZAP     = 'https://www.figma.com/api/mcp/asset/e635a089-af88-4629-b857-9d60b92a8736'
const ICON_CHECK   = 'https://www.figma.com/api/mcp/asset/91e55bd6-7bb8-451c-9427-5c693a0dcd58'
const ICON_APPLY   = 'https://www.figma.com/api/mcp/asset/2bee68b2-6e7b-45ad-bf14-5b898c10d3f1'
const ICON_HILITE  = 'https://www.figma.com/api/mcp/asset/4539aaeb-7e50-4cc6-a167-78cf8fa84401'

const PERIOD = { week: '/week', month: '/month', hour: '/hr' }

const STEPS = [
  { icon: ICON_SEARCH, title: 'Search Jobs', sub: 'By location'   },
  { icon: ICON_ZAP,    title: 'Quick Apply', sub: '2 min signup'  },
  { icon: ICON_CHECK,  title: 'Get Hired',   sub: 'Start earning' },
]

export default function DriverHome() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: 24, background: 'var(--color-bg)', minHeight: '100%' }}>

      {/* ── Hero ── */}
      <div style={{
        borderRadius: 20,
        height: 371,
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: '#1a2e3a',
      }}>
        <img
          src={HERO_BG}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        <img
          src={HERO_OVERLAY}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', left: 90, top: '50%', transform: 'translateY(-50%)' }}>
          <div style={{
            fontSize: 36, fontWeight: 800, color: 'white',
            fontFamily: "'Poppins', sans-serif", lineHeight: 1.11, letterSpacing: '-0.02em',
          }}>
            Your next job is
          </div>
          <div style={{
            fontSize: 36, fontWeight: 800, color: 'var(--color-primary)',
            fontFamily: "'Poppins', sans-serif", lineHeight: 1.11, marginBottom: 14, letterSpacing: '-0.02em',
          }}>
            a few clicks away
          </div>
          <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.82)', lineHeight: 1.56, fontFamily: "'Poppins', sans-serif" }}>
            Browse real delivery gigs from<br />
            Top Companies. <strong style={{ fontFamily: "'Poppins', sans-serif" }}>Apply in 2 minutes.</strong>
          </div>
        </div>
      </div>

      {/* ── Steps bar ── */}
      <div style={{
        background: '#f6f8fc',
        borderRadius: 20,
        padding: '28px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
      }}>
        {STEPS.map((step, i) => (
          <div key={step.title} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 128 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                backgroundImage: `url(${ELLIPSE1})`, backgroundSize: 'cover',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
              }}>
                <img src={step.icon} alt="" style={{ width: 22, height: 22 }} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--color-secondary)', fontFamily: "'Poppins', sans-serif", textAlign: 'center', letterSpacing: '-0.03em', lineHeight: 1.25 }}>
                {step.title}
              </div>
              <div style={{ fontSize: 14, color: '#8896a8', fontFamily: "'Poppins', sans-serif", textAlign: 'center' }}>
                {step.sub}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight size={16} color="#8896a8" style={{ flexShrink: 0, margin: '0 4px' }} />
            )}
          </div>
        ))}
      </div>

      {/* ── Section header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-secondary)', fontFamily: "'Poppins', sans-serif", letterSpacing: '-0.03em' }}>
            {driverJobs.length} Jobs Available
          </div>
          <div style={{ fontSize: 16, color: '#8896a8', fontFamily: "'Poppins', sans-serif", marginTop: 2 }}>
            Your next gig in one tap away
          </div>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#f6f8fc', border: '1px solid #c0cbd3', borderRadius: 24,
          padding: '8px 13px', fontSize: 13, cursor: 'pointer',
          color: 'var(--color-secondary)', fontFamily: "'Poppins', sans-serif", fontWeight: 500,
        }}>
          <Filter size={15} />
          Location
          <ChevronDown size={14} />
        </button>
      </div>

      {/* ── Job cards grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {driverJobs.map(job => (
          <div
            key={job.id}
            style={{
              background: '#032f4f',
              borderRadius: 24,
              border: '1px solid #e6e6e6',
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
              height: 412,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Photo with wave mask */}
            <div style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              top: -15,
              width: 396,
              height: 216,
              WebkitMaskImage: `url("${CARD_MASK_1}"), url("${CARD_MASK_2}")`,
              maskImage: `url("${CARD_MASK_1}"), url("${CARD_MASK_2}")`,
              WebkitMaskPosition: '19px 15px, -27px -276px',
              maskPosition: '19px 15px, -27px -276px',
              WebkitMaskRepeat: 'no-repeat, no-repeat',
              maskRepeat: 'no-repeat, no-repeat',
            }}>
              <img
                src={CARD_PHOTO}
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Urgent badge — top left */}
            {job.urgent && (
              <div style={{
                position: 'absolute', top: 12, left: 12,
                background: 'var(--color-primary)', color: 'white',
                fontSize: 11, fontWeight: 700, borderRadius: 99,
                padding: '4px 10px 4px 8px', letterSpacing: '0.02em',
                display: 'flex', alignItems: 'center', gap: 4, zIndex: 4,
              }}>
                <Flame size={11} strokeWidth={2} />
                Urgent
              </div>
            )}

            {/* Company logo */}
            <img
              src={COMPANY_LOGO}
              alt={job.company}
              style={{
                position: 'absolute', top: 93, left: 16,
                width: 58, height: 58, borderRadius: '50%',
                objectFit: 'cover', background: 'white',
                boxShadow: '0 2px 10px rgba(0,0,0,0.25)', zIndex: 3,
              }}
            />

            {/* Job title */}
            <div style={{
              position: 'absolute', top: 175, left: 16, right: 16,
              fontWeight: 700, fontSize: 20, color: 'white',
              fontFamily: "'Poppins', sans-serif", lineHeight: 1.25, letterSpacing: '-0.03em',
            }}>
              {job.title}
            </div>

            {/* Highlight 1 */}
            <div style={{ position: 'absolute', top: 240, left: 15, right: 15, display: 'flex', alignItems: 'center', gap: 8, color: 'white', fontSize: 16, fontFamily: "'Poppins', sans-serif" }}>
              <img src={ICON_HILITE} alt="" style={{ width: 22, height: 22, flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.highlights[0]}</span>
            </div>

            {/* Highlight 2 */}
            <div style={{ position: 'absolute', top: 271, left: 15, right: 15, display: 'flex', alignItems: 'center', gap: 8, color: 'white', fontSize: 16, fontFamily: "'Poppins', sans-serif" }}>
              <img src={ICON_HILITE} alt="" style={{ width: 22, height: 22, flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.highlights[1]}</span>
            </div>

            {/* Divider */}
            <div style={{ position: 'absolute', top: 321, left: 17, right: 18, borderTop: '1px solid rgba(255,255,255,0.5)' }} />

            {/* Salary amount */}
            <div style={{
              position: 'absolute', top: 321, left: 17, height: 51,
              display: 'flex', alignItems: 'center',
            }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: 'white', fontFamily: "'Poppins', sans-serif", lineHeight: 1, letterSpacing: '-0.03em' }}>
                £{job.salary_amount.toLocaleString()}
              </span>
            </div>

            {/* Period */}
            <div style={{
              position: 'absolute', top: 365, left: 17,
              fontSize: 18, color: 'rgba(255,255,255,0.85)', fontFamily: "'Poppins', sans-serif",
            }}>
              {PERIOD[job.salary_period]}
            </div>

            {/* Apply Now button */}
            <button
              onClick={() => navigate(`/jobs/driver/jobs/${job.id}`)}
              style={{
                position: 'absolute', top: 329, right: 18,
                background: 'linear-gradient(180deg, #ff4d4d 0%, #f42525 100%)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
                borderRadius: 32, border: 'none', color: 'white',
                fontSize: 16, fontWeight: 700, width: 156, height: 56,
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 6, fontFamily: "'Poppins', sans-serif",
              }}
            >
              Apply Now
              <img src={ICON_APPLY} alt="" style={{ width: 20, height: 20 }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
