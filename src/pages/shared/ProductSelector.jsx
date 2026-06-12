import { useNavigate } from 'react-router-dom'
import { GraduationCap, Briefcase, Gift } from 'lucide-react'
import logoSc from '../../assets/logo-sc.svg'

const PRODUCTS = [
  {
    id: 'academy',
    name: 'Academy',
    desc: 'Training, learning paths and session management for your drivers.',
    icon: GraduationCap,
    active: true,
    path: '/academy',
  },
  {
    id: 'jobs',
    name: 'Jobs',
    desc: 'Job board and candidate management for your driver fleet.',
    icon: Briefcase,
    active: true,
    path: '/jobs',
  },
  {
    id: 'perks',
    name: 'Perks',
    desc: 'Exclusive benefits and perks for your company employees.',
    icon: Gift,
    active: true,
    path: '/perks',
  },
]

export default function ProductSelector() {
  const navigate = useNavigate()

  return (
    <div className="product-selector">
      <div className="product-selector-header">
        <img src={logoSc} alt="Service Club" className="product-selector-logo" />
        <div className="product-selector-title">Welcome to SC Marketplace</div>
        <div className="product-selector-subtitle">Select the product you want to access</div>
      </div>

      <div className="product-selector-grid">
        {PRODUCTS.map(product => {
          const Icon = product.icon
          return (
            <div
              key={product.id}
              className={`product-card ${product.active ? 'product-card--active' : 'product-card--disabled'}`}
              onClick={() => product.active && navigate(product.path)}
            >
              <div className={`product-card-icon ${product.active ? 'product-card-icon--active' : 'product-card-icon--muted'}`}>
                <Icon size={22} />
              </div>

              <div className="product-card-name">{product.name}</div>

              <div className="product-card-desc">{product.desc}</div>

              {product.active
                ? <button className="btn btn-dark btn-sm" onClick={e => { e.stopPropagation(); navigate(product.path) }}>Open {product.name}</button>
                : <span className="badge badge-gray">Coming soon</span>
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}
