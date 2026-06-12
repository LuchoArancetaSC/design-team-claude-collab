import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Home, CalendarDays, Calendar, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import logoSC from '../assets/logo-sc.svg'

function DriverSidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <>
            <div className="sidebar-logo">
              <img src={logoSC} alt="Service Club" style={{ height: 26, width: 'auto', maxWidth: 148 }} />
            </div>
            <button className="sidebar-collapse-btn" onClick={onToggle} title="Collapse">
              <ChevronLeft size={15} />
            </button>
          </>
        )}
        {collapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: '100%' }}>
            <div className="sidebar-logo-icon">
              <Zap size={15} strokeWidth={2.5} />
            </div>
            <button className="sidebar-collapse-btn" onClick={onToggle} title="Expand">
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>

      {!collapsed && (
        <div style={{ padding: '8px 16px 4px', borderBottom: '1px solid var(--color-border)' }}>
          <div className="sidebar-logo-text">
            <span className="logo-brand">SERVICE CLUB</span>
            <span className="logo-sub">Jobs</span>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {!collapsed && <div className="nav-section-label">Driver</div>}

        <NavLink
          to="/jobs/driver"
          end
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span className="nav-icon"><Home size={16} /></span>
          {!collapsed && <span className="nav-text">Home</span>}
        </NavLink>

        <span className="nav-item" style={{ opacity: 0.45, cursor: 'default' }}>
          <span className="nav-icon"><CalendarDays size={16} /></span>
          {!collapsed && <span className="nav-text">Sessions</span>}
        </span>

        <span className="nav-item" style={{ opacity: 0.45, cursor: 'default' }}>
          <span className="nav-icon"><Calendar size={16} /></span>
          {!collapsed && <span className="nav-text">Calendar</span>}
        </span>
      </nav>

      <div className="sidebar-footer">
        <div className="user-row">
          <div className="user-avatar-circle">AJ</div>
          {!collapsed && (
            <div className="user-info-text">
              <div className="user-name">Alex Johnson</div>
              <div className="user-role">Driver</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

function GuestHeader() {
  const navigate = useNavigate()
  return (
    <div style={{
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      background: 'var(--color-card)',
      borderBottom: '1px solid var(--color-border)',
      flexShrink: 0,
    }}>
      <img src={logoSC} alt="Service Club" style={{ height: 26, width: 'auto' }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-outline btn-sm" style={{ fontSize: 13 }} onClick={() => navigate('/login')}>
          Log in
        </button>
        <button className="btn btn-dark btn-sm" style={{ fontSize: 13 }} onClick={() => navigate('/login')}>
          Sign up
        </button>
      </div>
    </div>
  )
}

export default function DriverLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const isAuth = Boolean(sessionStorage.getItem('sc_auth'))

  if (!isAuth) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--color-bg)' }}>
        <GuestHeader />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <DriverSidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}
