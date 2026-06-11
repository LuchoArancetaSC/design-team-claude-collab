import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, Calendar, Zap, ChevronLeft, ChevronRight } from 'lucide-react'
import VerticalRoleSwitcher from './VerticalRoleSwitcher'
import logoSC from '../assets/logo-sc.svg'

export default function TrainerSidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
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

      <nav className="sidebar-nav">
        {!collapsed && <div className="nav-section-label">Trainer</div>}

        <NavLink to="/academy/trainer" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><Home size={16} /></span>
          {!collapsed && <span className="nav-text">Trainer Hub</span>}
        </NavLink>

        <NavLink to="/academy/trainer/sessions" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><CalendarDays size={16} /></span>
          {!collapsed && <span className="nav-text">Sessions</span>}
        </NavLink>

        <NavLink to="/academy/trainer/calendar" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><Calendar size={16} /></span>
          {!collapsed && <span className="nav-text">Calendar</span>}
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <VerticalRoleSwitcher collapsed={collapsed} initials="JD" />
      </div>
    </aside>
  )
}
