const variantMap = {
  confirmed:   'badge-confirmed',
  assigned:    'badge-assigned',
  past:        'badge-past',
  pending:     'badge-pending',
  paid:        'badge-paid',
  overdue:     'badge-overdue',
  safety:      'badge-safety',
  information: 'badge-information',
  pass:        'badge-pass',
  fail:        'badge-fail',
  // admin LMS variants
  active:      'badge-confirmed',
  invited:     'badge-pending',
  registered:  'badge-registered',
  stalled:     'badge-overdue',
  completed:   'badge-paid',
  inprogress:  'badge-inprogress',
  draft:       'badge-past',
  published:   'badge-confirmed',
  archived:    'badge-past',
}

export default function Badge({ variant, children }) {
  const cls = variantMap[variant?.toLowerCase()] || 'badge-gray'
  return <span className={`badge ${cls}`}>{children}</span>
}
