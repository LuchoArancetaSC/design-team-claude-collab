import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import AdminLayout from './layouts/AdminLayout'

import ProductSelector from './pages/shared/ProductSelector'
import Login           from './pages/shared/Login'

import Dashboard    from './pages/academy/dsp/Dashboard'
import Sessions     from './pages/academy/dsp/Sessions'
import SessionDetail from './pages/academy/dsp/SessionDetail'
import Invoices     from './pages/academy/dsp/Invoices'

import AdminDashboard from './pages/academy/ops/AdminDashboard'
import Tenants        from './pages/academy/ops/Tenants'
import NewSubOrg      from './pages/academy/ops/NewSubOrg'
import Learners       from './pages/academy/ops/Learners'
import EnrolLearners  from './pages/academy/ops/EnrolLearners'
import LearnerDetail  from './pages/academy/ops/LearnerDetail'
import LearningPaths  from './pages/academy/ops/LearningPaths'
import NewPath        from './pages/academy/ops/NewPath'
import PathDetail     from './pages/academy/ops/PathDetail'
import PathComposer   from './pages/academy/ops/PathComposer'
import Reports        from './pages/academy/ops/Reports'
import TenantDetail   from './pages/academy/ops/TenantDetail'
import AdminInvoices  from './pages/academy/ops/AdminInvoices'
import SMP           from './pages/academy/ops/SMP'
import Cohorts       from './pages/academy/ops/Cohorts'

import RecruitmentHub   from './pages/jobs/dsp/RecruitmentHub'
import CandidateProfile from './pages/jobs/dsp/CandidateProfile'
import JobListings      from './pages/jobs/dsp/JobListings'
import JobEditor        from './pages/jobs/dsp/JobEditor'
import JobsBilling      from './pages/jobs/dsp/JobsBilling'
import AvailablePlans   from './pages/jobs/dsp/AvailablePlans'
import CompanyProfile   from './pages/jobs/dsp/CompanyProfile'

import JobsAdminDashboard from './pages/jobs/ops/JobsAdminDashboard'
import AllCandidates    from './pages/jobs/ops/AllCandidates'
import AllJobs          from './pages/jobs/ops/AllJobs'
import HSMQueue         from './pages/jobs/ops/HSMQueue'
import FunnelAnalytics  from './pages/jobs/ops/FunnelAnalytics'
import ClientManagement from './pages/jobs/ops/ClientManagement'

import PerksDashboard   from './pages/perks/dsp/PerksDashboard'
import Employees        from './pages/perks/dsp/Employees'
import EmployeeDetail   from './pages/perks/dsp/EmployeeDetail'
import Billing          from './pages/perks/dsp/Billing'
import Help             from './pages/perks/dsp/Help'

import PerksAdminDashboard from './pages/perks/ops/PerksAdminDashboard'
import Deals            from './pages/perks/ops/Deals'
import DealDetail       from './pages/perks/ops/DealDetail'
import Employers        from './pages/perks/ops/Employers'
import PerksAnalytics   from './pages/perks/ops/PerksAnalytics'

import TrainerLayout    from './layouts/TrainerLayout'
import TrainerDashboard from './pages/academy/trainer/TrainerDashboard'
import TrainerCalendar  from './pages/academy/trainer/TrainerCalendar'

import DriverHome      from './pages/jobs/user/DriverHome'
import DriverJobDetail from './pages/jobs/user/DriverJobDetail'

function RequireAuth({ children }) {
  if (!sessionStorage.getItem('sc_auth')) {
    return <Navigate to="/login" replace />
  }
  return children
}

function DSPLayout() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Auth ── */}
        <Route path="/login" element={<Login />} />

        {/* ── Entry ── */}
        <Route path="/" element={<RequireAuth><ProductSelector /></RequireAuth>} />

        {/* ── Academy DSP ── */}
        <Route path="/academy" element={<DSPLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="sessions/:id" element={<SessionDetail />} />
          <Route path="learners" element={<Learners />} />
          <Route path="learners/enrol" element={<EnrolLearners />} />
          <Route path="learners/:id" element={<LearnerDetail />} />
          <Route path="invoices" element={<Invoices />} />
        </Route>

        {/* ── Academy Ops ── */}
        <Route path="/academy/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="sessions" element={<Sessions />} />
          <Route path="sessions/:id" element={<SessionDetail />} />

          <Route path="tenants" element={<Tenants />} />
          <Route path="tenants/new" element={<NewSubOrg />} />
          <Route path="tenants/:id" element={<TenantDetail />} />

          <Route path="invoices" element={<AdminInvoices />} />

          <Route path="smp" element={<SMP />} />
          <Route path="cohorts" element={<Cohorts />} />

          <Route path="learners" element={<Learners />} />
          <Route path="learners/enrol" element={<EnrolLearners />} />
          <Route path="learners/:id" element={<LearnerDetail />} />

          <Route path="paths" element={<LearningPaths />} />
          <Route path="paths/new" element={<NewPath />} />
          <Route path="paths/new/edit" element={<PathComposer />} />
          <Route path="paths/:id" element={<PathDetail />} />
          <Route path="paths/:id/edit" element={<PathComposer />} />

          <Route path="reports" element={<Reports />} />
        </Route>

        {/* ── Academy Trainer ── */}
        <Route path="/academy/trainer" element={<TrainerLayout />}>
          <Route index element={<TrainerDashboard />} />
          <Route path="calendar" element={<TrainerCalendar />} />
          <Route path="sessions" element={<Sessions />} />
        </Route>

        {/* ── Jobs DSP + Driver ── */}
        <Route path="/jobs" element={<DSPLayout />}>
          <Route index element={<RecruitmentHub />} />
          <Route path="candidates/:id" element={<CandidateProfile />} />
          <Route path="listings" element={<JobListings />} />
          <Route path="listings/:id" element={<JobEditor />} />
          <Route path="billing" element={<JobsBilling />} />
          <Route path="billing/plans" element={<AvailablePlans />} />
          <Route path="profile" element={<CompanyProfile />} />
          <Route path="driver" element={<DriverHome />} />
          <Route path="driver/jobs/:id" element={<DriverJobDetail />} />
        </Route>

        {/* ── Jobs Admin ── */}
        <Route path="/jobs/admin" element={<AdminLayout />}>
          <Route index element={<JobsAdminDashboard />} />
          <Route path="candidates" element={<AllCandidates />} />
          <Route path="jobs" element={<AllJobs />} />
          <Route path="hsm" element={<HSMQueue />} />
          <Route path="analytics" element={<FunnelAnalytics />} />
          <Route path="clients" element={<ClientManagement />} />
        </Route>

        {/* ── Perks DSP ── */}
        <Route path="/perks" element={<DSPLayout />}>
          <Route index element={<PerksDashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="employees/:id" element={<EmployeeDetail />} />
          <Route path="billing" element={<Billing />} />
          <Route path="help" element={<Help />} />
        </Route>

        {/* ── Perks Admin ── */}
        <Route path="/perks/admin" element={<AdminLayout />}>
          <Route index element={<PerksAdminDashboard />} />
          <Route path="deals" element={<Deals />} />
          <Route path="deals/:id" element={<DealDetail />} />
          <Route path="employers" element={<Employers />} />
          <Route path="analytics" element={<PerksAnalytics />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
