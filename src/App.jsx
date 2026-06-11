import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Sessions from './pages/Sessions'
import SessionDetail from './pages/SessionDetail'
import SessionManage from './pages/SessionManage'
import Invoices from './pages/Invoices'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import Tenants from './pages/admin/Tenants'
import NewSubOrg from './pages/admin/NewSubOrg'
import Learners from './pages/admin/Learners'
import EnrolLearners from './pages/admin/EnrolLearners'
import LearnerDetail from './pages/admin/LearnerDetail'
import LearningPaths from './pages/admin/LearningPaths'
import NewPath from './pages/admin/NewPath'
import PathDetail from './pages/admin/PathDetail'
import PathComposer from './pages/admin/PathComposer'
import Reports from './pages/admin/Reports'
import TenantDetail from './pages/admin/TenantDetail'
import AdminInvoices from './pages/admin/AdminInvoices'

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
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ── DSP routes ── */}
        <Route element={<DSPLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/sessions/:id" element={<SessionDetail />} />
          <Route path="/sessions/:id/manage" element={<SessionManage />} />
          <Route path="/learners" element={<Learners />} />
          <Route path="/learners/enrol" element={<EnrolLearners />} />
          <Route path="/learners/:id" element={<LearnerDetail />} />
          <Route path="/invoices" element={<Invoices />} />
        </Route>

        {/* ── Admin routes ── */}
        <Route path="/admin" element={<AdminLayout />}>
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
          <Route path="paths/:id" element={<PathDetail />} />
          <Route path="paths/:id/edit" element={<PathComposer />} />

          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
