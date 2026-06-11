import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import TrainerSidebar from '../components/TrainerSidebar'

export default function TrainerLayout() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="app-layout">
      <TrainerSidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  )
}
