import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Shield, Truck, ChevronDown } from 'lucide-react'

export default function RoleSwitcher({ collapsed, initials = 'AM' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const isAdmin = location.pathname.startsWith('/admin')
  const mainLabel = isAdmin ? 'Ops / Admin' : 'DSP / Company'
  const sublabel  = isAdmin ? 'SC Operations · Admin' : 'DSP Manager'

  useEffect(() => {
    if (!open) return
    const handle = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const options = [
    { label: 'Ver como Admin', Icon: Shield, path: '/admin',     active: isAdmin  },
    { label: 'Ver como DSP',   Icon: Truck,  path: '/dashboard', active: !isAdmin },
  ]

  return (
    <div ref={ref} style={{ position: 'relative' }}>
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
          {options.map(({ label, Icon, path, active }) => (
            <button
              key={path}
              onClick={() => { navigate(path); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '9px 12px',
                borderRadius: 8,
                background: active ? 'rgba(68,99,122,0.10)' : 'transparent',
                border: 'none', cursor: 'pointer',
                fontFamily: "'Poppins', sans-serif",
                fontSize: 13, fontWeight: active ? 600 : 500,
                color: active ? 'var(--color-secondary)' : 'var(--color-text)',
                textAlign: 'left', transition: 'background 0.12s',
              }}
            >
              <Icon size={15} color={active ? 'var(--color-secondary)' : 'var(--color-muted)'} />
              {label}
              {active && (
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
        onClick={() => { if (!collapsed) setOpen(o => !o) }}
      >
        <div className="user-avatar-circle">{initials}</div>
        {!collapsed && (
          <>
            <div className="user-info-text">
              <div className="user-name">{mainLabel}</div>
              <div className="user-role">{sublabel}</div>
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
          </>
        )}
      </div>
    </div>
  )
}
