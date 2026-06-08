import { Zap } from 'lucide-react'
import scIcon from '../assets/icon-sc.svg'

/* ── Shared dark-navy + blob background (same language as Sessions banner) ── */
function BannerBg() {
  return (
    <svg
      aria-hidden="true"
      width="100%" height="100%"
      viewBox="0 0 1122 70"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, display: 'block' }}
    >
      <rect width="1129" height="100" fill="#032F4F" />

      <g opacity="0.35" filter="url(#ph-f0)">
        <path d="M704 17C704-66 771-133 854-133H1054C1137-133 1204-66 1204 17C1204 100 1137 167 1054 167H854C771 167 704 100 704 17Z" fill="#FF4B4B"/>
      </g>
      <g opacity="0.2" filter="url(#ph-f1)">
        <path d="M287 15C287-54 343-110 412-110H562C631-110 687-54 687 15C687 84 631 140 562 140H412C343 140 287 84 287 15Z" fill="#FDA5A7"/>
      </g>
      <g opacity="0.7" filter="url(#ph-f2)">
        <path d="M-80 100C-80 45-35 0 20 0H170C225 0 270 45 270 100C270 155 225 200 170 200H20C-35 200-80 155-80 100Z" fill="#032F4F"/>
      </g>
      <g opacity="0.7" filter="url(#ph-f3)">
        <path d="M612 63C612 13 653-27 703-27H873C923-27 963 13 963 63C963 112 923 153 873 153H703C653 153 612 112 612 63Z" fill="#FF4B4B"/>
      </g>
      <g opacity="0.5" filter="url(#ph-f4)">
        <path d="M788 36C788-8 824-44 868-44H1008C1052-44 1088-8 1088 36C1088 80 1052 116 1008 116H868C824 116 788 80 788 36Z" fill="#FDA5A7"/>
      </g>
      <g opacity="0.55" filter="url(#ph-f5)">
        <path d="M851 94C851 39 896-6 951-6H1001C1057-6 1101 39 1101 94C1101 149 1057 194 1001 194H951C896 194 851 149 851 94Z" fill="#FF4B4B"/>
      </g>
      <g opacity="0.5" filter="url(#ph-f6)">
        <path d="M367 60C367 32 390 10 417 10H517C545 10 567 32 567 60C567 88 545 110 517 110H417C390 110 367 88 367 60Z" fill="#032F4F"/>
      </g>
      <g opacity="0.65" filter="url(#ph-f7)">
        <path d="M901 48C901 20 923-2 951-2H1011C1039-2 1061 20 1061 48C1061 76 1039 98 1011 98H951C923 98 901 76 901 48Z" fill="#FF4B4B"/>
      </g>

      <defs>
        <filter id="ph-f0" x="504" y="-333" width="900" height="700" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="100"/>
        </filter>
        <filter id="ph-f1" x="47" y="-350" width="880" height="730" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="120"/>
        </filter>
        <filter id="ph-f2" x="-240" y="-160" width="670" height="520" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="80"/>
        </filter>
        <filter id="ph-f3" x="452" y="-187" width="670" height="500" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="80"/>
        </filter>
        <filter id="ph-f4" x="608" y="-224" width="660" height="520" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="90"/>
        </filter>
        <filter id="ph-f5" x="711" y="-146" width="530" height="480" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="70"/>
        </filter>
        <filter id="ph-f6" x="247" y="-110" width="440" height="340" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="60"/>
        </filter>
        <filter id="ph-f7" x="811" y="-92" width="340" height="280" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="45"/>
        </filter>
      </defs>
    </svg>
  )
}

export default function PageHeader({ title, icon, banner }) {
  /* ── Sessions-style image banner (Sessions / SessionDetail) ── */
  if (typeof banner === 'string') {
    return (
      <div className="page-banner" style={{ padding: 0, overflow: 'hidden' }}>
        <img
          src={banner}
          alt={title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    )
  }

  /* ── Inline banner — same visual language, dynamic title + icon ── */
  if (banner) {
    return (
      <div className="page-banner" style={{ position: 'relative', padding: 0, overflow: 'hidden' }}>
        <BannerBg />
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', height: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', color: 'white' }}>{icon}</div>
            <span style={{
              color: 'white',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}>
              {title}
            </span>
          </div>
          <img src={scIcon} alt="" aria-hidden="true" style={{ height: 32, opacity: 0.55 }} />
        </div>
      </div>
    )
  }

  /* ── Default (fallback, no banner) ── */
  return (
    <div className="page-banner">
      <div className="page-banner-left">
        <div className="page-banner-icon">{icon}</div>
        <h1 className="page-banner-title">{title}</h1>
      </div>
      <div className="page-banner-bolt">
        <Zap size={32} strokeWidth={1.5} />
      </div>
    </div>
  )
}
