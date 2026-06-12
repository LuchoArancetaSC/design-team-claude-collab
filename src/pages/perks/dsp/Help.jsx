import { useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, Mail } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'

const FAQ = [
  {
    category: 'Getting Started',
    items: [
      {
        q: 'What is the Perks platform?',
        a: 'The Perks platform gives your employees exclusive discounts and benefits from our network of partner companies. Once enrolled, employees can browse and redeem deals instantly.',
      },
      {
        q: 'How do I enroll my company?',
        a: 'Your account is already active! You can start adding employees immediately from the Employee Management section. Each employee will receive an email invitation to activate their personal perks account.',
      },
      {
        q: 'How do employees access their perks?',
        a: 'After receiving their invitation email, employees click the link to create an account. They then log in at perks.serviceclub.com to browse and redeem available deals.',
      },
    ],
  },
  {
    category: 'Managing Employees',
    items: [
      {
        q: 'How do I add a new employee?',
        a: 'Go to Employee Management and click "Add Employee". Enter their name, email, and role, then click "Send Invite". They will receive an email with activation instructions within a few minutes.',
      },
      {
        q: 'What happens when I deactivate an employee?',
        a: 'Deactivated employees immediately lose access to all perks and deals. Their usage history is preserved in the system. You can contact support to reactivate a deactivated account.',
      },
      {
        q: 'Can I bulk import employees?',
        a: 'Yes — in the Employee Management page you can upload a CSV file with columns: name, email, role. All listed employees will receive invitations automatically.',
      },
    ],
  },
  {
    category: 'Deals & Benefits',
    items: [
      {
        q: 'How do employees redeem a deal?',
        a: "Employees log into their perks portal, browse the available deals, and click Redeem. Depending on the partner, they will receive a discount code or a direct link to the partner's website.",
      },
      {
        q: 'How often are new deals added?',
        a: 'We add new partner deals every month. You will receive an email notification whenever new deals are available in your region.',
      },
      {
        q: 'Are deals available in all countries?',
        a: "Deal availability depends on the partner's coverage area. Deals are tagged by country so employees only see offers available in their location.",
      },
    ],
  },
  {
    category: 'Billing',
    items: [
      {
        q: 'What does the Perks Pro plan include?',
        a: 'The Perks Pro plan includes up to 50 active employees, unlimited deal access, and priority support. The subscription is billed monthly at €249/month.',
      },
      {
        q: 'How do I update my payment method?',
        a: 'Go to Billing & Settings and contact our support team to update your payment details. Self-service payment management is coming soon.',
      },
      {
        q: 'Can I get an invoice for tax purposes?',
        a: 'Yes — all invoices are available for download in the Billing & Settings page. Each invoice includes your VAT number and a full breakdown of the charges.',
      },
    ],
  },
]

function AccordionItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: open ? 0 : 0,
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '14px 0', background: 'none',
          border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
          textAlign: 'left', gap: 12,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.4 }}>
          {question}
        </span>
        {open ? <ChevronUp size={16} color="var(--color-muted)" /> : <ChevronDown size={16} color="var(--color-muted)" />}
      </button>
      {open && (
        <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.7, paddingBottom: 16 }}>
          {answer}
        </div>
      )}
    </div>
  )
}

export default function Help() {
  return (
    <div className="page-body">
      <PageHeader title="Help &amp; FAQ" icon={<HelpCircle size={18} />} banner />

      <div style={{ marginBottom: 24 }}>
        <div className="page-title">Frequently Asked Questions</div>
        <div className="page-subtitle">Find answers to the most common questions about the Perks platform.</div>
      </div>

      {FAQ.map(section => (
        <div key={section.category} className="card" style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: 'var(--color-muted)',
            textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4,
          }}>
            {section.category}
          </div>
          {section.items.map((item, i) => (
            <AccordionItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>
      ))}

      {/* Support CTA */}
      <div className="card" style={{ textAlign: 'center', padding: '32px 24px', background: '#f9fafb' }}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Need more help?</div>
        <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Our support team is available Monday–Friday, 9:00–18:00 CET.<br />
          We typically respond within 4 business hours.
        </div>
        <a
          href="mailto:perks-support@serviceclub.com"
          className="btn btn-dark"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, textDecoration: 'none' }}
        >
          <Mail size={14} /> Contact Support
        </a>
      </div>
    </div>
  )
}
