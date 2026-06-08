import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="app-layout">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}
