import { NavLink, useLocation } from 'react-router-dom'
import {
  Zap, ChevronLeft, ChevronRight,
  LayoutDashboard, Building2, BookOpen, CalendarDays, Users, FileText, BarChart2, Users2, GraduationCap,
  Tag, Briefcase, GitMerge, MessageSquare,
} from 'lucide-react'
import VerticalRoleSwitcher from './VerticalRoleSwitcher'
import logoSC from '../assets/logo-sc.svg'

function AcademyAdminNav({ collapsed }) {
  return (
    <>
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
      <NavLink to="/academy/admin/cohorts" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><GraduationCap size={16} /></span>
        {!collapsed && <span className="nav-text">Cohorts</span>}
      </NavLink>
      <NavLink to="/academy/admin/learners" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><Users size={16} /></span>
        {!collapsed && <span className="nav-text">Learners</span>}
      </NavLink>
      <NavLink to="/academy/admin/smp" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><Users2 size={16} /></span>
        {!collapsed && <span className="nav-text">SMPs</span>}
      </NavLink>
      <NavLink to="/academy/admin/invoices" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><FileText size={16} /></span>
        {!collapsed && <span className="nav-text">Invoices</span>}
      </NavLink>
      <NavLink to="/academy/admin/reports" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><BarChart2 size={16} /></span>
        {!collapsed && <span className="nav-text">Reports</span>}
      </NavLink>
    </>
  )
}

function PerksAdminNav({ collapsed }) {
  return (
    <>
      {!collapsed && <div className="nav-section-label">PERKS ADMIN</div>}
      <NavLink to="/perks/admin" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><LayoutDashboard size={16} /></span>
        {!collapsed && <span className="nav-text">Dashboard</span>}
      </NavLink>
      <NavLink to="/perks/admin/deals" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><Tag size={16} /></span>
        {!collapsed && <span className="nav-text">Deals</span>}
      </NavLink>
      <NavLink to="/perks/admin/employers" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><Building2 size={16} /></span>
        {!collapsed && <span className="nav-text">Employers</span>}
      </NavLink>
      <NavLink to="/perks/admin/analytics" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><BarChart2 size={16} /></span>
        {!collapsed && <span className="nav-text">Analytics</span>}
      </NavLink>
    </>
  )
}

function JobsAdminNav({ collapsed }) {
  return (
    <>
      {!collapsed && <div className="nav-section-label">JOBS ADMIN</div>}
      <NavLink to="/jobs/admin" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><LayoutDashboard size={16} /></span>
        {!collapsed && <span className="nav-text">Overview</span>}
      </NavLink>
      <NavLink to="/jobs/admin/candidates" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><Users size={16} /></span>
        {!collapsed && <span className="nav-text">All Candidates</span>}
      </NavLink>
      <NavLink to="/jobs/admin/jobs" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><Briefcase size={16} /></span>
        {!collapsed && <span className="nav-text">All Jobs</span>}
      </NavLink>
      <NavLink to="/jobs/admin/hsm" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><MessageSquare size={16} /></span>
        {!collapsed && <span className="nav-text">HSM Queue</span>}
      </NavLink>
      <NavLink to="/jobs/admin/analytics" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><BarChart2 size={16} /></span>
        {!collapsed && <span className="nav-text">Analytics</span>}
      </NavLink>
      <NavLink to="/jobs/admin/clients" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
        <span className="nav-icon"><Building2 size={16} /></span>
        {!collapsed && <span className="nav-text">Clients</span>}
      </NavLink>
    </>
  )
}

export default function AdminSidebar({ collapsed, onToggle }) {
  const { pathname } = useLocation()
  const isPerksAdmin = pathname.startsWith('/perks/admin')
  const isJobsAdmin  = pathname.startsWith('/jobs/admin')

  function activeNav() {
    if (isPerksAdmin) return <PerksAdminNav collapsed={collapsed} />
    if (isJobsAdmin)  return <JobsAdminNav  collapsed={collapsed} />
    return                   <AcademyAdminNav collapsed={collapsed} />
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
        <VerticalRoleSwitcher collapsed={collapsed} initials="LG" />
      </div>
    </aside>
  )
}
