import { FileText } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'

export default function DriverJobDetail() {
  return (
    <div className="page-body">
      <PageHeader title="Job Detail" icon={<FileText size={18} />} banner />
      <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>Coming soon.</p>
    </div>
  )
}
