import { NavLink } from 'react-router-dom'
import {
  Zap, ChevronLeft, ChevronRight,
  LayoutDashboard, Building2, BookOpen, CalendarDays, Users, FileText, BarChart2,
} from 'lucide-react'
import VerticalRoleSwitcher from './VerticalRoleSwitcher'
import logoSC from '../assets/logo-sc.svg'

export default function AdminSidebar({ collapsed, onToggle }) {
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
        {!collapsed && <div className="nav-section-label">ADMIN</div>}

        <NavLink to="/academy/admin" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><LayoutDashboard size={16} /></span>
          {!collapsed && <span className="nav-text">Dashboard</span>}
        </NavLink>

        <NavLink to="/academy/admin/tenants" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><Building2 size={16} /></span>
          {!collapsed && <span className="nav-text">Tenants &amp; Sub-Orgs</span>}
        </NavLink>

        <NavLink to="/academy/admin/paths" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><BookOpen size={16} /></span>
          {!collapsed && <span className="nav-text">Learning Paths</span>}
        </NavLink>

        <NavLink to="/academy/admin/sessions" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><CalendarDays size={16} /></span>
          {!collapsed && <span className="nav-text">Sessions</span>}
        </NavLink>

        <NavLink to="/academy/admin/learners" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><Users size={16} /></span>
          {!collapsed && <span className="nav-text">Learners</span>}
        </NavLink>

        <NavLink to="/academy/admin/invoices" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><FileText size={16} /></span>
          {!collapsed && <span className="nav-text">Invoices</span>}
        </NavLink>

        <NavLink to="/academy/admin/reports" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><BarChart2 size={16} /></span>
          {!collapsed && <span className="nav-text">Reports</span>}
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <VerticalRoleSwitcher collapsed={collapsed} initials="LG" />
      </div>
    </aside>
  )
}
