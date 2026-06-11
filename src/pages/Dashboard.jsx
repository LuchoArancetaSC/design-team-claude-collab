import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, ArrowRight, ChevronRight } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import iconSC from '../assets/icon-sc.svg'

const SESSIONS = [
  {
    id: 1,
    title: 'Safety DE ALL 2026 SC Session',
    date: '19 Apr 2026 · 11:00 AM',
    drivers: 5,
    capacity: 35,
    enrolled: true,
  },
  {
    id: 2,
    title: 'Information IT 2026 SC Session',
    date: '20 Apr 2026 · 09:00 AM',
    drivers: 0,
    capacity: 35,
    enrolled: false,
  },
  {
    id: 3,
    title: 'Safety IT ALL 2026 SC Session',
    date: '22 Apr 2026 · 14:00',
    drivers: 0,
    capacity: 35,
    enrolled: false,
  },
  {
    id: 4,
    title: 'Information IT 2026 SC Session',
    date: '24 Apr 2026 · 09:00 AM',
    drivers: 0,
    capacity: 35,
    enrolled: false,
  },
]

const INVOICES = [
  {
    id: 'INV-2026-038C',
    amount: '€150',
    desc: '5 drivers · Safety Refresher',
    status: 'overdue',
    statusLabel: 'Overdue by 7 days',
  },
  {
    id: 'INV-2026-041A',
    amount: '€360',
    desc: '12 drivers · Safety IT ALL',
    status: 'due',
    statusLabel: 'Due in 4 days',
  },
  {
    id: 'INV-2026-041A',
    amount: '€360',
    desc: '12 drivers · Safety IT ALL',
    status: 'due',
    statusLabel: 'Due in 4 days',
  },
]

function OccupancyWidget({ drivers, capacity }) {
  const pct = capacity > 0 ? (drivers / capacity) * 100 : 0
  return (
    <div style={{
      border: '0.626px solid rgba(4,47,78,0.15)',
      borderRadius: 7.5,
      padding: '5.6px 8px',
      background: 'white',
      minWidth: 148,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 7.5, color: '#2d2f34', fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
          Your drivers
        </span>
        <div style={{
          border: '0.626px solid rgba(4,47,78,0.2)',
          borderRadius: 3.75,
          background: 'rgba(255,255,255,0.9)',
          padding: '1.9px 5.6px',
          fontSize: 7.5,
          fontFamily: 'Poppins, sans-serif',
          color: '#042f4e',
          fontWeight: 500,
        }}>
          {drivers}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 7.5, color: '#737373', fontFamily: 'Poppins, sans-serif' }}>Occupancy</span>
        <span style={{ fontSize: 7.5, color: '#2d2f34', fontFamily: 'Poppins, sans-serif' }}>{drivers}/{capacity}</span>
      </div>
      <div style={{
        height: 3.75,
        borderRadius: 999,
        background: 'rgba(4,47,78,0.15)',
        overflow: 'hidden',
        width: '100%',
      }}>
        {pct > 0 && (
          <div style={{
            width: `${pct}%`,
            height: '100%',
            background: '#032f4f',
            borderRadius: 999,
          }} />
        )}
      </div>
    </div>
  )
}

function SessionRow({ session, first, onManage }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px 20px',
      borderBottom: '1px solid #e4e4e6',
    }}>
      {first && (
        <div style={{ width: 2, height: 48, background: '#16a34a', borderRadius: 99, flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          fontSize: 14,
          color: '#032f4f',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {session.title}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: 12, color: '#3f3f46' }}>
            {session.date}
          </span>
          <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#a1a1aa', flexShrink: 0 }} />
        </div>
      </div>
      <OccupancyWidget drivers={session.drivers} capacity={session.capacity} />
      <button
        onClick={onManage}
        style={{
          background: '#032f4f',
          color: 'white',
          border: 'none',
          borderRadius: 999,
          height: 28,
          padding: '0 12px 0 10px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          fontSize: 11,
          cursor: 'pointer',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}>
        Manage
      </button>
      <div
        onClick={onManage}
        style={{
          width: 28, height: 28, background: '#f4f4f5',
          border: '1px solid #e4e4e6', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}>
        <ChevronRight size={13} color="#3f3f46" strokeWidth={2} />
      </div>
    </div>
  )
}

function InvoiceRow({ invoice, onPay }) {
  const isOverdue = invoice.status === 'overdue'
  return (
    <div style={{
      borderTop: '1px solid #e4e4e6',
      padding: '14px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ flex: 1, fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 13, color: '#032f4f' }}>
          {invoice.id}
        </span>
        <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 16, color: '#032f4f', flexShrink: 0 }}>
          {invoice.amount}
        </span>
      </div>
      <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: 11, color: '#71717a' }}>
        {invoice.desc}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          border: '1px solid #d97706',
          borderRadius: 6,
          height: 22,
          padding: '0 10px 0 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flexShrink: 0,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: isOverdue ? '#ff4b4b' : '#d97706',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: 10,
            color: isOverdue ? '#ff4b4b' : '#d97706',
            whiteSpace: 'nowrap',
          }}>
            {invoice.statusLabel}
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={onPay} style={{
          background: '#032f4f', color: '#f4f4f5', border: 'none', borderRadius: 999,
          height: 28, padding: '0 12px 0 10px', fontFamily: 'Poppins, sans-serif',
          fontWeight: 600, fontSize: 11, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
        }}>
          Pay now <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('today')

  const tabs = [
    { id: 'today', label: 'Today', count: 4 },
    { id: 'upcoming', label: 'Upcoming', count: 8 },
    { id: 'all', label: 'All', count: null },
  ]

  return (
    <div className="page-body" style={{ padding: 0, background: '#f6f8fc', minHeight: '100vh' }}>
      {/* Header banner */}
      <PageHeader title="Dashboard" icon={<img src={iconSC} alt="" style={{ width: 22, height: 22 }} />} banner />

      {/* Welcome */}
      <div style={{ padding: '24px 24px 20px' }}>
        <h1 style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          fontSize: 24,
          color: '#032f4f',
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          marginBottom: 6,
        }}>
          Welcome, Courier!
        </h1>
        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 400,
          fontSize: 14,
          color: '#032f4f',
          letterSpacing: '-0.02em',
        }}>
          You have 4 training sessions scheduled for this week.
        </p>
      </div>

      {/* Two-column grid */}
      <div style={{
        display: 'flex',
        gap: 20,
        padding: '0 24px 24px',
        alignItems: 'flex-start',
      }}>
        {/* Sessions card */}
        <div style={{
          flex: 1,
          background: 'white',
          border: '1px solid #e4e4e6',
          borderRadius: 14,
          boxShadow: '0px 1px 2px 0px rgba(16,24,40,0.04)',
          overflow: 'hidden',
          minWidth: 0,
        }}>
          {/* Card header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '18px 20px 14px',
          }}>
            <span style={{
              flex: 1,
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              color: '#032f4f',
            }}>
              Sessions
            </span>
            <button
              onClick={() => navigate('/sessions')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0 4px',
                borderRadius: 999,
                height: 28,
              }}
            >
              <span style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: 12,
                color: '#032f4f',
              }}>
                View all
              </span>
              <ArrowRight size={12} color="#032f4f" />
            </button>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: 24,
            padding: '0 20px',
            borderBottom: '1px solid #e4e4e6',
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  height: 40,
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #4844c4' : '2px solid transparent',
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <span style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  fontSize: 13,
                  color: activeTab === tab.id ? '#032f4f' : '#71717a',
                }}>
                  {tab.label}
                </span>
                {tab.count !== null && (
                  <div style={{
                    background: '#f4f4f5',
                    borderRadius: 9,
                    height: 18,
                    padding: '0 6px',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                    <span style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: 10,
                      color: '#3f3f46',
                    }}>
                      {tab.count}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Session rows */}
          {SESSIONS.map((session, i) => (
            <SessionRow key={session.id} session={session} first={i === 0} onManage={() => navigate(`/sessions/${session.id}/manage`)} />
          ))}
        </div>

        {/* Invoices card */}
        <div style={{
          width: 380,
          flexShrink: 0,
          background: 'white',
          border: '1px solid #e4e4e6',
          borderRadius: 14,
          boxShadow: '0px 1px 2px 0px rgba(16,24,40,0.04)',
          overflow: 'hidden',
        }}>
          {/* Card header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '18px 20px 12px',
          }}>
            <div style={{
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              flexShrink: 0,
            }}>
              <AlertCircle size={14} color="#16a34a" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 700,
                fontSize: 15,
                color: '#16a34a',
                lineHeight: 1.3,
              }}>
                Ready invoices
              </p>
              <p style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                fontSize: 11,
                color: '#71717a',
                lineHeight: 1.3,
              }}>
                2 invoices · €510 outstanding
              </p>
            </div>
          </div>

          {/* Invoice rows */}
          {INVOICES.map((invoice, i) => (
            <InvoiceRow key={i} invoice={invoice} onPay={() => navigate('/invoices')} />
          ))}

          {/* Footer */}
          <div style={{
            borderTop: '1px solid #e4e4e6',
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            cursor: 'pointer',
            background: 'white',
          }}
            onClick={() => navigate('/invoices')}
          >
            <span style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              fontSize: 12,
              color: '#71717a',
            }}>
              See all invoices
            </span>
            <ArrowRight size={12} color="#71717a" />
          </div>
        </div>
      </div>
    </div>
  )
}
