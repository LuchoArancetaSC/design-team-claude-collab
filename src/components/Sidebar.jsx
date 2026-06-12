import { NavLink, useLocation } from 'react-router-dom'
import {
  Home, CalendarDays, FileText, Users, Zap, ChevronLeft, ChevronRight,
  CreditCard, HelpCircle, List, Building2,
} from 'lucide-react'
import VerticalRoleSwitcher from './VerticalRoleSwitcher'
import logoSC from '../assets/logo-sc.svg'

function AcademyNav({ collapsed }) {
  return (
    <>
      {!collapsed && <div className="nav-section-label">Academy</div>}
      <NavLink to="/academy/" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><Home size={16} /></span>
        {!collapsed && <span className="nav-text">Home</span>}
      </NavLink>
      <NavLink to="/academy/sessions" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><CalendarDays size={16} /></span>
        {!collapsed && <span className="nav-text">Sessions</span>}
        <span className="nav-dot" />
      </NavLink>
      <NavLink to="/academy/learners" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><Users size={16} /></span>
        {!collapsed && <span className="nav-text">Learners</span>}
      </NavLink>
      <NavLink to="/academy/invoices" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><FileText size={16} /></span>
        {!collapsed && <span className="nav-text">Invoices</span>}
      </NavLink>
    </>
  )
}

function PerksNav({ collapsed }) {
  return (
    <>
      {!collapsed && <div className="nav-section-label">Perks</div>}
      <NavLink to="/perks" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><Home size={16} /></span>
        {!collapsed && <span className="nav-text">Home</span>}
      </NavLink>
      <NavLink to="/perks/employees" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><Users size={16} /></span>
        {!collapsed && <span className="nav-text">Employees</span>}
      </NavLink>
      <NavLink to="/perks/billing" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><CreditCard size={16} /></span>
        {!collapsed && <span className="nav-text">Billing</span>}
      </NavLink>
      <NavLink to="/perks/help" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><HelpCircle size={16} /></span>
        {!collapsed && <span className="nav-text">Help</span>}
      </NavLink>
    </>
  )
}

function JobsNav({ collapsed }) {
  return (
    <>
      {!collapsed && <div className="nav-section-label">Jobs</div>}
      <NavLink to="/jobs" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><Home size={16} /></span>
        {!collapsed && <span className="nav-text">Home</span>}
      </NavLink>
      <NavLink to="/jobs/listings" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><List size={16} /></span>
        {!collapsed && <span className="nav-text">Job Listings</span>}
      </NavLink>
      <NavLink to="/jobs/billing" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><CreditCard size={16} /></span>
        {!collapsed && <span className="nav-text">Billing</span>}
      </NavLink>
      <NavLink to="/jobs/profile" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><Building2 size={16} /></span>
        {!collapsed && <span className="nav-text">Company Profile</span>}
      </NavLink>
    </>
  )
}

export default function Sidebar({ collapsed, onToggle }) {
  const { pathname } = useLocation()
  const isPerks = pathname.startsWith('/perks') && !pathname.startsWith('/perks/admin')
  const isJobs  = pathname.startsWith('/jobs')  && !pathname.startsWith('/jobs/admin')

  function activeNav() {
    if (isPerks) return <PerksNav collapsed={collapsed} />
    if (isJobs)  return <JobsNav  collapsed={collapsed} />
    return              <AcademyNav collapsed={collapsed} />
  }

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
        {activeNav()}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <VerticalRoleSwitcher collapsed={collapsed} initials="AM" />
      </div>
    </aside>
  )
}
