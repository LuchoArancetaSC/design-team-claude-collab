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

import JobsDashboard    from './pages/jobs/dsp/JobsDashboard'
import PerksDashboard   from './pages/perks/dsp/PerksDashboard'

import TrainerLayout    from './layouts/TrainerLayout'
import TrainerDashboard from './pages/academy/trainer/TrainerDashboard'
import TrainerCalendar  from './pages/academy/trainer/TrainerCalendar'

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

        {/* ── Jobs ── */}
        <Route path="/jobs" element={<DSPLayout />}>
          <Route index element={<JobsDashboard />} />
        </Route>

        {/* ── Perks ── */}
        <Route path="/perks" element={<DSPLayout />}>
          <Route index element={<PerksDashboard />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
