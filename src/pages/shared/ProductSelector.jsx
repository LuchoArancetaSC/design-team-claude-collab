import { useNavigate } from 'react-router-dom'
import { GraduationCap, Briefcase, Gift } from 'lucide-react'
import logoSc from '../../assets/logo-sc.svg'

const PRODUCTS = [
  {
    id: 'academy',
    name: 'Academy',
    desc: 'Formación, learning paths y gestión de sesiones para tus conductores.',
    icon: GraduationCap,
    active: true,
    path: '/academy',
  },
  {
    id: 'jobs',
    name: 'Jobs',
    desc: 'Bolsa de trabajo y gestión de candidatos para tu flota de conductores.',
    icon: Briefcase,
    active: false,
  },
  {
    id: 'perks',
    name: 'Perks',
    desc: 'Beneficios y ventajas exclusivas para los empleados de tu empresa.',
    icon: Gift,
    active: false,
  },
]

export default function ProductSelector() {
  const navigate = useNavigate()

  return (
    <div className="product-selector">
      <div className="product-selector-header">
        <img src={logoSc} alt="Service Club" className="product-selector-logo" />
        <div className="product-selector-title">Bienvenido al SC Marketplace</div>
        <div className="product-selector-subtitle">Selecciona el producto al que quieres acceder</div>
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
                ? <button className="btn btn-dark btn-sm" onClick={e => { e.stopPropagation(); navigate(product.path) }}>Abrir {product.name}</button>
                : <span className="badge badge-gray">Coming soon</span>
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}
