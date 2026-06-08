import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, FileText, Users, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import RoleSwitcher from './RoleSwitcher'
import logoSC from '../assets/logo-sc.svg'

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        {!collapsed && (
          <>
            <div className="sidebar-logo">
              <img src={logoSC} alt="Service Club Academy" style={{ height: 26, width: 'auto', maxWidth: 148 }} />
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

      {/* Nav */}
      <nav className="sidebar-nav">
        {!collapsed && <div className="nav-section-label">Menu</div>}

        <NavLink to="/dashboard" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><Home size={16} /></span>
          {!collapsed && <span className="nav-text">Home</span>}
        </NavLink>

        <NavLink to="/sessions" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><CalendarDays size={16} /></span>
          {!collapsed && <span className="nav-text">Sessions</span>}
          <span className="nav-dot" />
        </NavLink>

        <NavLink to="/learners" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><Users size={16} /></span>
          {!collapsed && <span className="nav-text">Learners</span>}
        </NavLink>

        <NavLink to="/invoices" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><FileText size={16} /></span>
          {!collapsed && <span className="nav-text">Invoices</span>}
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <RoleSwitcher collapsed={collapsed} initials="AM" />
      </div>
    </aside>
  )
}
