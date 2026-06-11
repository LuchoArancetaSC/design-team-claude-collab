import { useState } from 'react'
import { Calendar, Lightbulb, Info, X, ChevronLeft, ChevronRight, Plus, Clock, Check, Trash2 } from 'lucide-react'
import PageHeader from '../../../components/PageHeader'

/* ── Constants ──────────────────────────────────────────────────── */
const TODAY = new Date(2026, 3, 22) // mock "today" = April 22 2026

const AVAILABILITY_OPTIONS = [
  { id: 'allday',      label: 'All day',         time: '8:00 AM – 17:00 PM' },
  { id: 'morning',     label: 'Morning Shift',   time: '8:00 AM – 12:00 PM' },
  { id: 'afternoon',   label: 'Afternoon Shift', time: '13:00 PM – 17:00 PM' },
  { id: 'custom',      label: 'Custom Hours',    time: 'Set your own time' },
  { id: 'unavailable', label: 'Unavailable',     time: null },
]

const TIMEZONES = [
  { value: 'UTC',                 label: 'UTC (UTC+0)' },
  { value: 'Europe/London',       label: 'London (UTC+0/+1)' },
  { value: 'Europe/Madrid',       label: 'Madrid (UTC+1/+2)' },
  { value: 'Europe/Berlin',       label: 'Berlin (UTC+1/+2)' },
  { value: 'Europe/Rome',         label: 'Rome (UTC+1/+2)' },
  { value: 'Europe/Paris',        label: 'Paris (UTC+1/+2)' },
  { value: 'Europe/Amsterdam',    label: 'Amsterdam (UTC+1/+2)' },
  { value: 'America/New_York',    label: 'New York (UTC−5/−4)' },
  { value: 'America/Chicago',     label: 'Chicago (UTC−6/−5)' },
  { value: 'America/Denver',      label: 'Denver (UTC−7/−6)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (UTC−8/−7)' },
  { value: 'America/Sao_Paulo',   label: 'São Paulo (UTC−3)' },
  { value: 'Asia/Dubai',          label: 'Dubai (UTC+4)' },
  { value: 'Asia/Kolkata',        label: 'India (UTC+5:30)' },
  { value: 'Asia/Singapore',      label: 'Singapore (UTC+8)' },
  { value: 'Asia/Tokyo',          label: 'Tokyo (UTC+9)' },
  { value: 'Australia/Sydney',    label: 'Sydney (UTC+10/+11)' },
]

const INITIAL_RULES = [
  { id: 1, range: 'Apr 17 – Apr 30', type: 'Morning Shift',   cls: 'cal-badge--morning' },
  { id: 2, range: 'May 02 – May 30', type: 'All Day',          cls: 'cal-badge--allday' },
  { id: 3, range: 'Jun 01 – Jun 20', type: 'Afternoon Shift',  cls: 'cal-badge--afternoon' },
]

const BADGE_MAP = {
  allday:      { cls: 'cal-badge--allday',      labelFn: ()  => 'All Day' },
  morning:     { cls: 'cal-badge--morning',     labelFn: ()  => 'Morning Shift' },
  afternoon:   { cls: 'cal-badge--afternoon',   labelFn: ()  => 'Afternoon Shift' },
  custom:      { cls: 'cal-badge--custom',      labelFn: (n) => `Custom (${n} slot${n !== 1 ? 's' : ''})` },
  unavailable: { cls: 'cal-badge--unavailable', labelFn: ()  => 'Unavailable' },
}

/* ── Helpers ─────────────────────────────────────────────────────── */
const toMinutes = (t) => { const [h, m] = (t || '00:00').split(':').map(Number); return h * 60 + m }
const pad2      = (n) => String(n).padStart(2, '0')
let   nextId    = 10

/* ── Component ──────────────────────────────────────────────────── */
export default function TrainerCalendar() {
  const [showTip,    setShowTip]  = useState(true)
  const [calDate,    setCalDate]  = useState(new Date(2026, 3, 1))
  const [selected,   setSelected] = useState([])
  const [availability, setAvail]  = useState('morning')
  const [customSlots,  setSlots]  = useState([{ from: '09:00', to: '17:00' }])
  const [timezone,   setTimezone] = useState('Europe/Madrid')
  const [savedRules, setRules]    = useState(INITIAL_RULES)
  const [status,     setStatus]   = useState(null) // null | 'success' | { error: string }

  /* ── Calendar calculations ── */
  const year        = calDate.getFullYear()
  const month       = calDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = new Date(year, month, 1).getDay()
  const monthLabel  = calDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const monthShort  = calDate.toLocaleString('en-US', { month: 'short' })

  const isToday    = (d) => TODAY.getFullYear() === year && TODAY.getMonth() === month && TODAY.getDate() === d
  const minSel     = selected.length ? Math.min(...selected) : null
  const maxSel     = selected.length ? Math.max(...selected) : null
  const isEndpoint = (d) => selected.includes(d)
  const isInRange  = (d) => minSel !== null && maxSel !== null && d > minSel && d < maxSel

  const goPrev = () => { setCalDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)); setSelected([]); setStatus(null) }
  const goNext = () => { setCalDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)); setSelected([]); setStatus(null) }

  const handleDay = (day) => {
    setStatus(null)
    setSelected(prev => {
      if (prev.includes(day))  return prev.filter(d => d !== day)
      if (prev.length >= 2)    return [day]
      return [...prev, day].sort((a, b) => a - b)
    })
  }

  /* ── Custom slots validation ── */
  const slotErrors = customSlots.map(s => {
    if (!s.from || !s.to)                        return 'Both times are required'
    if (toMinutes(s.from) >= toMinutes(s.to))    return 'End time must be after start time'
    return null
  })

  const hasOverlap = (() => {
    if (customSlots.length < 2) return false
    const intervals = customSlots
      .map(s => ({ from: toMinutes(s.from), to: toMinutes(s.to) }))
      .sort((a, b) => a.from - b.from)
    for (let i = 0; i < intervals.length - 1; i++) {
      if (intervals[i].to > intervals[i + 1].from) return true
    }
    return false
  })()

  const addSlot    = () => setSlots(s => [...s, { from: '09:00', to: '17:00' }])
  const removeSlot = (i) => setSlots(s => s.filter((_, idx) => idx !== i))
  const updateSlot = (i, field, val) => {
    setStatus(null)
    setSlots(s => s.map((sl, idx) => idx === i ? { ...sl, [field]: val } : sl))
  }

  /* ── Save ── */
  const handleSave = () => {
    if (selected.length === 0) {
      setStatus({ error: 'Select at least one date on the calendar before saving.' })
      return
    }
    if (availability === 'custom') {
      if (slotErrors.some(Boolean)) {
        setStatus({ error: 'Fix the time slot errors before saving.' })
        return
      }
      if (hasOverlap) {
        setStatus({ error: 'Time slots must not overlap. Adjust the times and try again.' })
        return
      }
    }

    const range = selected.length === 1
      ? `${monthShort} ${pad2(selected[0])}`
      : `${monthShort} ${pad2(minSel)} – ${monthShort} ${pad2(maxSel)}`

    const { cls, labelFn } = BADGE_MAP[availability]
    const type = labelFn(customSlots.length)

    setRules(r => [{ id: ++nextId, range, type, cls }, ...r])
    setSelected([])
    setStatus('success')
    setTimeout(() => setStatus(null), 3500)
  }

  const deleteRule = (id) => setRules(r => r.filter(rule => rule.id !== id))

  return (
    <div className="page-body">
      <PageHeader title="Calendar" icon={<Calendar size={18} />} banner />

      <h2 className="cal-section-title">Availability Setup</h2>

      {/* Tip banner */}
      {showTip && (
        <div className="cal-tip-banner">
          <Lightbulb size={15} style={{ flexShrink: 0, color: '#2563eb' }} />
          <span style={{ flex: 1 }}>
            Tip: Click a date to select it, click again to deselect. Select two dates to create a range. You can also save a single-day rule.
          </span>
          <button className="cal-banner-close" onClick={() => setShowTip(false)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Contextual status / error / success banners */}
      {status === 'success' && (
        <div className="cal-success-banner">
          <Check size={15} style={{ flexShrink: 0 }} />
          <span>Availability rule saved. You can see it in the list below.</span>
        </div>
      )}
      {status?.error && (
        <div className="cal-error-banner">
          <X size={15} style={{ flexShrink: 0 }} />
          <span>{status.error}</span>
        </div>
      )}
      {!status && selected.length > 0 && (
        <div className="cal-status-banner">
          <Info size={15} style={{ flexShrink: 0, color: '#0891b2' }} />
          <span>
            {selected.length === 1
              ? `1 date selected (${monthShort} ${pad2(selected[0])}). Add a second date for a range, or save as a single-day rule.`
              : `Range selected: ${monthShort} ${pad2(minSel)} – ${monthShort} ${pad2(maxSel)} (${maxSel - minSel + 1} days). Choose an availability type and save.`}
          </span>
        </div>
      )}

      {/* Two-column layout */}
      <div className="cal-main-grid">

        {/* Left — Pick a Range */}
        <div className="card cal-picker-card">
          <div className="cal-picker-header">
            <div>
              <h3 className="cal-card-title">Pick a Range</h3>
              <p className="cal-card-sub">
                Define a range of dates along with your availability details to set up your calendar quickly.
              </p>
            </div>
            {selected.length > 0 && (
              <button
                className="action-btn muted"
                style={{ fontSize: 12, flexShrink: 0 }}
                onClick={() => { setSelected([]); setStatus(null) }}
              >
                Clear ({selected.length})
              </button>
            )}
          </div>

          {/* Month nav */}
          <div className="cal-month-nav">
            <button className="btn btn-ghost btn-icon" style={{ borderRadius: 5 }} onClick={goPrev}>
              <ChevronLeft size={14} />
            </button>
            <span className="cal-month-label">{monthLabel}</span>
            <button className="btn btn-ghost btn-icon" style={{ borderRadius: 5 }} onClick={goNext}>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="cal-weekdays">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
              <span key={d} className="cal-wday">{d}</span>
            ))}
          </div>

          {/* Days grid */}
          <div className="cal-days-grid">
            {Array.from({ length: startOffset }).map((_, i) => <div key={`off${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day      = i + 1
              const endpoint = isEndpoint(day)
              const inRange  = isInRange(day)
              const today    = isToday(day)
              return (
                <button
                  key={day}
                  className={[
                    'cal-day',
                    endpoint          ? 'cal-day--endpoint' : '',
                    !endpoint && inRange ? 'cal-day--range' : '',
                    today && !endpoint   ? 'cal-day--today'  : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleDay(day)}
                  title={today ? 'Today' : undefined}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* Right — Set Working Availability */}
        <div className="card cal-avail-card">
          <h3 className="cal-card-title" style={{ marginBottom: 4 }}>Set Working Availability</h3>
          <p className="cal-card-sub" style={{ marginBottom: 8 }}>
            Configure your available working hours and capacity
          </p>
          <p className="cal-sessions-hint">
            Sessions typically last <strong>4 or 8 hours</strong>
          </p>

          <div className="cal-options-list">
            {AVAILABILITY_OPTIONS.map(opt => (
              <div key={opt.id}>
                <button
                  className={`cal-option${availability === opt.id ? ' cal-option--active' : ''}`}
                  onClick={() => { setAvail(opt.id); setStatus(null) }}
                >
                  <span className="cal-option-label">{opt.label}</span>
                  {opt.time && <span className="cal-option-time">{opt.time}</span>}
                </button>

                {/* Custom hours — inline accordion below the button */}
                {opt.id === 'custom' && availability === 'custom' && (
                  <div className="cal-custom-section">
                    {customSlots.map((slot, i) => (
                      <div key={i}>
                        <div className="cal-custom-slot">
                          <Clock size={12} color="var(--color-muted)" style={{ flexShrink: 0 }} />
                          <input
                            type="time"
                            className={`cal-time-input${slotErrors[i] ? ' cal-time-input--error' : ''}`}
                            value={slot.from}
                            onChange={e => updateSlot(i, 'from', e.target.value)}
                          />
                          <span className="cal-time-sep">→</span>
                          <input
                            type="time"
                            className={`cal-time-input${slotErrors[i] ? ' cal-time-input--error' : ''}`}
                            value={slot.to}
                            onChange={e => updateSlot(i, 'to', e.target.value)}
                          />
                          {customSlots.length > 1 && (
                            <button
                              className="cal-slot-remove"
                              onClick={() => removeSlot(i)}
                              title="Remove slot"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                        {slotErrors[i] && (
                          <p className="cal-slot-error">{slotErrors[i]}</p>
                        )}
                      </div>
                    ))}
                    {hasOverlap && !slotErrors.some(Boolean) && (
                      <p className="cal-slot-error" style={{ marginTop: 2 }}>
                        Time slots must not overlap.
                      </p>
                    )}
                    <button className="cal-add-slot" onClick={addSlot}>
                      <Plus size={12} />
                      Add time slot
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Timezone selector */}
          <div className="cal-timezone-section">
            <div className="cal-timezone-label">
              <Clock size={12} color="var(--color-muted)" />
              Time Zone
            </div>
            <select
              className="cal-timezone-select"
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
            >
              {TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          <button
            className={`btn btn-dark cal-save-btn${selected.length === 0 ? ' cal-save-btn--idle' : ''}`}
            onClick={handleSave}
          >
            {selected.length === 0 ? 'Select dates to save' : 'Save Availability'}
          </button>
        </div>
      </div>

      {/* Saved Availability Rules */}
      <div className="cal-saved-card">
        <div className="cal-saved-header">
          <h3 className="cal-card-title" style={{ marginBottom: 0 }}>Saved Availability Rules</h3>
          {savedRules.length > 0 && (
            <span className="cal-saved-count">
              {savedRules.length} rule{savedRules.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {savedRules.length === 0 ? (
          <p className="cal-rules-empty">
            No availability rules saved yet. Pick a date range above and save your first rule.
          </p>
        ) : (
          <div className="cal-rules-list">
            {savedRules.map((rule, i) => (
              <div
                key={rule.id}
                className={`cal-rule-row${i < savedRules.length - 1 ? ' cal-rule-row--bordered' : ''}`}
              >
                <span className="cal-rule-range">{rule.range}</span>
                <span className={`cal-rule-badge ${rule.cls}`}>{rule.type}</span>
                <button
                  className="cal-rule-delete"
                  onClick={() => deleteRule(rule.id)}
                  title="Delete rule"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
