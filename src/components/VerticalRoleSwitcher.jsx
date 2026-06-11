import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronDown, GraduationCap, Briefcase, Gift } from 'lucide-react'

const VERTICALS = [
  { id: 'academy', label: 'Academy', Icon: GraduationCap },
  { id: 'jobs',    label: 'Jobs',    Icon: Briefcase },
  { id: 'perks',   label: 'Perks',   Icon: Gift },
]

const ROLES = {
  academy: [
    { id: 'dsp',     label: 'DSP / Company' },
    { id: 'ops',     label: 'Ops SC' },
    { id: 'learner', label: 'Learner' },
    { id: 'trainer', label: 'Trainer' },
  ],
  jobs: [
    { id: 'dsp',    label: 'DSP / Company' },
    { id: 'ops',    label: 'Ops SC' },
    { id: 'driver', label: 'Driver' },
  ],
  perks: [
    { id: 'dsp',      label: 'DSP / Company' },
    { id: 'ops',      label: 'Ops SC' },
    { id: 'employee', label: 'Employee' },
  ],
}

function getRoleBase(vertical, role) {
  if (role === 'ops')     return `/${vertical}/admin`
  if (role === 'trainer') return `/${vertical}/trainer`
  if (role === 'learner') return `/${vertical}/learner`
  if (role === 'driver')  return `/${vertical}/driver`
  if (role === 'employee') return `/${vertical}/employee`
  return `/${vertical}`
}

function detectVertical(pathname) {
  if (pathname.startsWith('/academy')) return 'academy'
  if (pathname.startsWith('/jobs'))    return 'jobs'
  if (pathname.startsWith('/perks'))   return 'perks'
  return 'academy'
}

function detectRole(pathname) {
  if (pathname.includes('/admin'))   return 'ops'
  if (pathname.includes('/trainer')) return 'trainer'
  if (pathname.includes('/learner')) return 'learner'
  if (pathname.includes('/driver'))  return 'driver'
  if (pathname.includes('/employee')) return 'employee'
  return 'dsp'
}

export default function VerticalRoleSwitcher({ collapsed, initials = 'AM' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const vertical = detectVertical(location.pathname)
  const role     = detectRole(location.pathname)
  const roles    = ROLES[vertical]
  const activeRole = roles.find(r => r.id === role) ?? roles[0]

  useEffect(() => {
    if (!open) return
    const handle = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const handleVerticalChange = (newVertical) => {
    navigate(getRoleBase(newVertical, role))
  }

  const handleRoleChange = (newRole) => {
    navigate(getRoleBase(vertical, newRole))
    setOpen(false)
  }

  if (collapsed) {
    const { Icon } = VERTICALS.find(v => v.id === vertical) ?? VERTICALS[0]
    return (
      <div className="user-row" style={{ justifyContent: 'center' }}>
        <div className="user-avatar-circle">{initials}</div>
      </div>
    )
  }

  return (
    <div ref={ref} className="vrs" style={{ position: 'relative' }}>

      {/* ── Selector 1: Vertical ── */}
      <div className="vrs-label">Vertical</div>
      <div className="vrs-tabs">
        {VERTICALS.map(v => (
          <button
            key={v.id}
            className={`vrs-tab${vertical === v.id ? ' vrs-tab--active' : ''}`}
            onClick={() => handleVerticalChange(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="vrs-divider" />

      {/* ── Selector 2: Role ── */}
      <div className="vrs-label">Rol</div>

      {open && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: 0, right: 0,
          background: 'white',
          border: '1px solid var(--color-border)',
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.13)',
          padding: 6,
          zIndex: 200,
        }}>
          {roles.map(r => (
            <button
              key={r.id}
              onClick={() => handleRoleChange(r.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '9px 12px',
                borderRadius: 8,
                background: activeRole.id === r.id ? 'rgba(68,99,122,0.10)' : 'transparent',
                border: 'none', cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                fontSize: 13, fontWeight: activeRole.id === r.id ? 600 : 500,
                color: activeRole.id === r.id ? 'var(--color-secondary)' : 'var(--color-text)',
                textAlign: 'left', transition: 'background 0.12s',
              }}
            >
              {r.label}
              {activeRole.id === r.id && (
                <span style={{
                  marginLeft: 'auto', fontSize: 10, fontWeight: 600,
                  color: 'var(--color-secondary)',
                  background: 'rgba(68,99,122,0.12)',
                  padding: '2px 7px', borderRadius: 99,
                }}>
                  Activo
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <div
        className="user-row"
        style={{ position: 'relative' }}
        onClick={() => setOpen(o => !o)}
      >
        <div className="user-avatar-circle">{initials}</div>
        <div className="user-info-text">
          <div className="user-name">{activeRole.label}</div>
          <div className="user-role">{VERTICALS.find(v => v.id === vertical)?.label} · SC</div>
        </div>
        <ChevronDown
          size={14}
          color="var(--color-muted)"
          style={{
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.18s',
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  )
}
