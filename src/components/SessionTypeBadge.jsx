import { Smartphone } from 'lucide-react'

export default function SessionTypeBadge({ type }) {
  if (type === 'smp') {
    return (
      <span className="badge badge-stype-smp">
        <Smartphone size={11} /> SMP · App
      </span>
    )
  }
  if (type === 'safety') {
    return <span className="badge badge-stype-safety">Safety</span>
  }
  if (type === 'info') {
    return <span className="badge badge-stype-info">Info</span>
  }
  return <span className="badge badge-gray">{type}</span>
}
