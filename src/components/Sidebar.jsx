import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CalendarDays, FileText, Users, BarChart2,
  ChevronLeft, ChevronRight, ChevronDown,
} from 'lucide-react'
import logoSC from '../assets/logo-sc.svg'
import iconSC from '../assets/icon-sc.svg'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/sessions',  label: 'Sessions',  Icon: CalendarDays },
  { to: '/invoices',  label: 'Invoices',  Icon: FileText },
  { to: '/drivers',   label: 'Drivers',   Icon: Users },
  { to: '/reports',   label: 'Reports',   Icon: BarChart2 },
]

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`} style={{
      width: collapsed ? 'var(--sidebar-collapsed-width)' : 270,
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      height: '100vh',
      position: 'relative',
    }}>
      {/* Header / Logo */}
      <div style={{
        padding: collapsed ? '25px 0 0' : '25px 20px 0',
        height: 69,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        {collapsed ? (
          <img src={iconSC} alt="SC" style={{ width: 24, height: 24 }} />
        ) : (
          <img src={logoSC} alt="Service Club Academy" style={{ height: 35, width: 'auto', maxWidth: 183 }} />
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        title={collapsed ? 'Expand' : 'Collapse'}
        style={{
          position: 'absolute',
          top: 65,
          right: -12,
          width: 24,
          height: 24,
          background: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '50%',
          boxShadow: '0 4px 3px rgba(0,0,0,0.1), 0 10px 7.5px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          color: '#6b7280',
        }}
      >
        {collapsed
          ? <ChevronRight size={12} strokeWidth={2.5} />
          : <ChevronLeft size={12} strokeWidth={2.5} />
        }
      </button>

      {/* Section label */}
      {!collapsed && (
        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          fontSize: 10.7,
          color: '#99a1af',
          letterSpacing: '0.05em',
          padding: '14px 21px 0',
        }}>
          DSP
        </p>
      )}

      {/* Nav */}
      <nav style={{ padding: collapsed ? '8px 0' : '8px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: collapsed ? 0 : 14,
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '10px 0' : '10px 16px',
              borderRadius: 12,
              textDecoration: 'none',
              background: isActive ? 'rgba(68,99,122,0.12)' : 'transparent',
              color: '#032f4f',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: '-0.02em',
              transition: 'background 0.12s',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2 : 1.8} color="#032f4f" style={{ flexShrink: 0 }} />
                {!collapsed && label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      {!collapsed && (
        <div style={{ height: 1, background: '#e5e7eb', margin: '0 21px' }} />
      )}

      {/* User footer */}
      <div style={{
        borderTop: '1px solid #e5e7eb',
        background: '#fafafa',
        height: 73,
        display: 'flex',
        alignItems: 'center',
        padding: collapsed ? '0' : '0 20px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 10,
        flexShrink: 0,
      }}>
        {/* Avatar placeholder */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'rgba(68,99,122,0.15)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          fontSize: 12,
          color: '#032f4f',
        }}>
          JD
        </div>
        {!collapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: 14,
                color: '#101828',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}>
                John Doe
              </p>
              <p style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                fontSize: 12,
                color: '#4a5668',
                whiteSpace: 'nowrap',
              }}>
                DSP Manager
              </p>
            </div>
            <ChevronDown size={16} color="#6b7280" style={{ flexShrink: 0 }} />
          </>
        )}
      </div>
    </aside>
  )
}
