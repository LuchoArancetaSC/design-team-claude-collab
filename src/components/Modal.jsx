import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ onClose, title, children, size, footer }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={`modal-card${size ? ` ${size}` : ''}`}>
        {title !== undefined && (
          <div className="modal-header">
            <span className="modal-title">{title}</span>
            <button className="btn btn-ghost btn-icon" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}
