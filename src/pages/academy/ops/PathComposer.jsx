import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronLeft, ChevronDown, GripVertical, Plus, Search, Pencil, Award, Upload,
  X, Check, Trash2, FileText,
} from 'lucide-react'
import Badge from '../../../components/Badge'

/* ── Mock data ────────────────────────────────────────────────────── */
const INITIAL_ACT_NAMES = ['Welcome aboard', 'On the Road', 'Final Assessment']

const INITIAL_ACTS_DATA = [
  {
    id: 1,
    elements: [
      { id: 'e1', type: 'M',  title: 'Intro to Service Club', meta: '4 min',       label: 'Microlesson'     },
      { id: 'e2', type: 'M',  title: 'Meet your station',     meta: '6 min',       label: 'Microlesson'     },
      { id: 'e3', type: 'KC', title: 'Knowledge Check 1',     meta: '5 questions', label: 'Knowledge Check' },
    ],
  },
  {
    id: 2,
    elements: [],
  },
  {
    id: 3,
    elements: [
      { id: 'e4', type: 'KC', title: 'Final Knowledge Check', meta: '20 questions', label: 'Knowledge Check'  },
      { id: 'e5', type: 'CC', title: 'ID Verification',       meta: null,           label: 'Compliance Check' },
    ],
  },
]

const CATALOGUE_ITEMS = [
  { title: 'Pre-flight Safety Check', duration: '8 min' },
  { title: 'Load Out Procedures',     duration: '5 min' },
  { title: 'Back to Base',            duration: '4 min' },
  { title: 'PPE Basics',              duration: '3 min' },
  { title: 'Emergency Procedures',    duration: '6 min' },
]

const TYPE_CONFIG = {
  M:  { bg: 'rgba(3,47,79,0.09)',   color: '#032f4f', label: 'Microlesson'      },
  KC: { bg: 'rgba(99,102,241,0.1)', color: '#4f46e5', label: 'Knowledge Check'  },
  CC: { bg: 'rgba(217,119,6,0.1)',  color: '#d97706', label: 'Compliance Check' },
}

/* ── Type pill ────────────────────────────────────────────────────── */
function TypePill({ type }) {
  const s = TYPE_CONFIG[type] || { bg: '#f4f4f5', color: '#71717a' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: s.bg, color: s.color,
      padding: '2px 8px', borderRadius: 99,
      fontSize: 11, fontWeight: 700, flexShrink: 0,
    }}>
      {type}
    </span>
  )
}

/* ── Inline add-element form ──────────────────────────────────────── */
function AddElementForm({ onConfirm, onCancel }) {
  const [form, setForm] = useState({ title: '', type: 'M', meta: '' })
  const canSave = form.title.trim().length > 0

  const confirm = () => {
    if (!canSave) return
    onConfirm({
      id: `e${Date.now()}`,
      type: form.type,
      title: form.title.trim(),
      meta: form.meta.trim() || null,
      label: TYPE_CONFIG[form.type]?.label || 'Microlesson',
    })
  }

  return (
    <div style={{
      padding: '12px 14px',
      background: 'rgba(3,47,79,0.03)',
      borderTop: '1px solid var(--color-border)',
    }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          autoFocus
          className="input"
          placeholder="Element title..."
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          onKeyDown={e => { if (e.key === 'Enter') confirm(); if (e.key === 'Escape') onCancel() }}
          style={{ flex: 1, height: 32, fontSize: 13 }}
        />
        <select
          className="input select"
          value={form.type}
          onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
          style={{ width: 148, height: 32, fontSize: 12 }}
        >
          <option value="M">Microlesson</option>
          <option value="KC">Knowledge Check</option>
          <option value="CC">Compliance Check</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="input"
          placeholder="Duration or questions count (optional)"
          value={form.meta}
          onChange={e => setForm(f => ({ ...f, meta: e.target.value }))}
          style={{ flex: 1, height: 32, fontSize: 13 }}
        />
        <button
          className="btn btn-dark btn-sm"
          disabled={!canSave}
          style={{ opacity: canSave ? 1 : 0.4, gap: 4 }}
          onClick={confirm}
        >
          <Check size={13} /> Add
        </button>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>
          <X size={13} />
        </button>
      </div>
    </div>
  )
}

/* ── Act block ────────────────────────────────────────────────────── */
function ActBlock({
  actIdx, actData, name, expanded, onToggle,
  dragSource, dropTarget,
  onDragStart, onDragEnd, onDragOver, onDrop,
  isAdding, onOpenAdd, onConfirmAdd, onCancelAdd,
  onDelete,
  isEditing, onEditStart, onEditChange, onEditBlur,
}) {
  const count = actData.elements.length
  const isDragTarget = (beforeElIdx) =>
    dropTarget?.actIdx === actIdx && dropTarget?.beforeElIdx === beforeElIdx

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 8, overflow: 'hidden', marginBottom: 8,
      transition: 'box-shadow 0.15s',
    }}>
      {/* Header */}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', background: 'white', cursor: 'pointer', userSelect: 'none',
        }}
        onClick={onToggle}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isEditing ? (
            <input
              autoFocus
              className="input"
              value={name}
              onChange={e => onEditChange(e.target.value)}
              onBlur={onEditBlur}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') onEditBlur() }}
              onClick={e => e.stopPropagation()}
              style={{ height: 28, fontSize: 13, fontWeight: 600, padding: '0 8px', width: 180 }}
            />
          ) : (
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
              Act {actIdx + 1} · {name}
            </span>
          )}
          <span style={{
            fontSize: 11, color: 'var(--color-muted)', background: '#f4f4f5',
            padding: '2px 8px', borderRadius: 99,
          }}>
            {count} element{count !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            className="btn btn-ghost btn-icon"
            style={{ width: 24, height: 24, padding: 0 }}
            title="Rename act"
            onClick={e => { e.stopPropagation(); onEditStart() }}
          >
            <Pencil size={12} color="var(--color-muted)" />
          </button>
          <ChevronDown
            size={14}
            color="var(--color-muted)"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s', flexShrink: 0 }}
          />
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div
          style={{ borderTop: '1px solid var(--color-border)', background: '#fafafa' }}
          onDragOver={e => { e.preventDefault(); if (!dropTarget || dropTarget.actIdx !== actIdx || dropTarget.beforeElIdx < count) onDragOver(e, actIdx, count) }}
          onDrop={e => onDrop(e, actIdx)}
        >
          {count === 0 && !isAdding && (
            <div
              style={{
                padding: '20px 16px', fontSize: 13, color: 'var(--color-muted)',
                textAlign: 'center',
                background: isDragTarget(0) ? 'rgba(3,47,79,0.05)' : 'transparent',
                border: isDragTarget(0) ? '1.5px dashed var(--color-secondary)' : 'none',
                borderRadius: isDragTarget(0) ? 6 : 0,
                margin: isDragTarget(0) ? 8 : 0,
                transition: 'all 0.1s',
              }}
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragOver(e, actIdx, 0) }}
              onDrop={e => onDrop(e, actIdx)}
            >
              Drop elements here or click Add
            </div>
          )}

          {actData.elements.map((el, i) => {
            const isDragging = dragSource?.actIdx === actIdx && dragSource?.elIdx === i
            return (
              <div key={el.id}>
                {isDragTarget(i) && (
                  <div style={{ height: 3, background: 'var(--color-secondary)', margin: '0 12px', borderRadius: 2 }} />
                )}
                <div
                  draggable
                  onDragStart={e => { e.stopPropagation(); onDragStart(actIdx, i) }}
                  onDragEnd={onDragEnd}
                  onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragOver(e, actIdx, i) }}
                  onDrop={e => { e.stopPropagation(); onDrop(e, actIdx) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px',
                    borderBottom: i < count - 1 ? '1px solid #f0f0f0' : 'none',
                    opacity: isDragging ? 0.35 : 1,
                    background: isDragging ? 'transparent' : 'white',
                    cursor: 'default',
                    transition: 'opacity 0.1s',
                  }}
                >
                  <GripVertical size={14} color="#c4c4c8" style={{ cursor: 'grab', flexShrink: 0 }} />
                  <TypePill type={el.type} />
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>
                    {el.title}
                  </span>
                  {el.meta && (
                    <span style={{ fontSize: 12, color: 'var(--color-muted)', flexShrink: 0 }}>{el.meta}</span>
                  )}
                  <span style={{ fontSize: 11, color: 'var(--color-muted)', flexShrink: 0, marginRight: 4 }}>
                    {el.label}
                  </span>
                  <button
                    className="btn btn-ghost btn-icon"
                    style={{ width: 22, height: 22, padding: 0, color: '#c4c4c8', flexShrink: 0 }}
                    title="Remove"
                    onClick={e => { e.stopPropagation(); onDelete(actIdx, i) }}
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )
          })}

          {isDragTarget(count) && count > 0 && (
            <div style={{ height: 3, background: 'var(--color-secondary)', margin: '0 12px 4px', borderRadius: 2 }} />
          )}

          {isAdding ? (
            <AddElementForm
              onConfirm={onConfirmAdd}
              onCancel={onCancelAdd}
            />
          ) : (
            <div style={{ padding: '8px 12px' }}>
              <button
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', justifyContent: 'center', border: '1px dashed var(--color-border)', borderRadius: 6 }}
                onClick={onOpenAdd}
              >
                <Plus size={12} /> Add element
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── File upload widget ───────────────────────────────────────────── */
function UploadWidget({ progress, filename, onUploadClick }) {
  if (filename) {
    return (
      <div style={{
        background: 'rgba(5,150,105,0.06)',
        border: '1px solid rgba(5,150,105,0.25)',
        borderRadius: 8, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <FileText size={16} color="var(--color-success)" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {filename}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-success)', fontWeight: 500 }}>Uploaded</div>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          style={{ fontSize: 11, color: 'var(--color-muted)', flexShrink: 0, gap: 3 }}
          onClick={onUploadClick}
        >
          <Upload size={11} /> Replace
        </button>
      </div>
    )
  }

  if (progress !== null) {
    return (
      <div style={{ padding: '10px 2px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>Uploading…</span>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{progress}%</span>
        </div>
        <div style={{ height: 4, background: '#e4e4e7', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'var(--color-secondary)',
            borderRadius: 99, transition: 'width 0.1s',
          }} />
        </div>
      </div>
    )
  }

  return (
    <button
      className="btn btn-ghost btn-sm"
      style={{ width: '100%', justifyContent: 'center', border: '1px dashed var(--color-border)', borderRadius: 6 }}
      onClick={onUploadClick}
    >
      <Upload size={12} /> Upload template
    </button>
  )
}

/* ── Main component ───────────────────────────────────────────────── */
export default function PathComposer() {
  const navigate = useNavigate()
  const location = useLocation()

  // Receive path form from NewPath.jsx via router state
  const pathForm = location.state?.pathForm

  const [status, setStatus]     = useState(pathForm?.status || 'draft')
  const [actsData, setActsData] = useState(INITIAL_ACTS_DATA)
  const [expanded, setExpanded] = useState({ 0: true, 1: false, 2: false })
  const [actNames, setActNames] = useState(INITIAL_ACT_NAMES)
  const [editingActIdx, setEditingActIdx] = useState(null)

  const [settings, setSettings] = useState({
    name:        pathForm?.name        || 'Safety IT All Module',
    org:         pathForm?.org         || 'Amazon DSP Alemania',
    profile:     pathForm?.profile     || 'All',
    stalledDays: pathForm?.stalledDays || 14,
  })

  // Catalogue
  const [catalogueOpen, setCatalogueOpen]   = useState(false)
  const [catalogueSearch, setCatalogueSearch] = useState('')

  // Certificate
  const [certEnabled, setCertEnabled]     = useState(true)
  const [certTemplate, setCertTemplate]   = useState('standard')
  const [certValidity, setCertValidity]   = useState(12)
  const [certUnit, setCertUnit]           = useState('meses')
  const [certThreshold, setCertThreshold] = useState(80)

  // File upload
  const [uploadProgress, setUploadProgress] = useState(null)
  const [uploadedFile, setUploadedFile]     = useState(null)
  const fileInputRef = useRef(null)

  // DnD
  const [dragSource, setDragSource] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)

  // Inline add element
  const [addingToAct, setAddingToAct] = useState(null)

  /* ── Handlers ── */
  const toggleAct = i => setExpanded(p => ({ ...p, [i]: !p[i] }))

  const addAct = () => {
    const idx = actsData.length
    setActsData(p => [...p, { id: idx + 1, elements: [] }])
    setActNames(p => [...p, `New Act`])
    setExpanded(p => ({ ...p, [idx]: true }))
    setEditingActIdx(idx)
  }

  const updateActName = (i, val) => {
    setActNames(p => { const n = [...p]; n[i] = val; return n })
  }

  /* DnD */
  const handleDragStart = (actIdx, elIdx) => setDragSource({ actIdx, elIdx })
  const handleDragEnd   = () => { setDragSource(null); setDropTarget(null) }

  const handleDragOver = (e, actIdx, beforeElIdx) => {
    e.preventDefault()
    setDropTarget({ actIdx, beforeElIdx })
  }

  const handleDrop = (e, toAct) => {
    e.preventDefault()
    if (!dragSource || !dropTarget) { setDropTarget(null); return }

    const { actIdx: fromAct, elIdx: fromEl } = dragSource
    const { beforeElIdx } = dropTarget
    const el = actsData[fromAct].elements[fromEl]

    setActsData(prev => {
      const next = prev.map(a => ({ ...a, elements: [...a.elements] }))
      next[fromAct].elements.splice(fromEl, 1)
      let insertAt = beforeElIdx
      if (fromAct === toAct && fromEl < beforeElIdx) insertAt = Math.max(0, insertAt - 1)
      next[toAct].elements.splice(insertAt, 0, el)
      return next
    })

    setDragSource(null)
    setDropTarget(null)
  }

  /* Add element */
  const handleConfirmAdd = (actIdx, el) => {
    setActsData(p => p.map((act, i) =>
      i !== actIdx ? act : { ...act, elements: [...act.elements, el] }
    ))
    setAddingToAct(null)
    if (!expanded[actIdx]) setExpanded(p => ({ ...p, [actIdx]: true }))
  }

  /* Delete element */
  const handleDelete = (actIdx, elIdx) => {
    setActsData(p => p.map((act, i) =>
      i !== actIdx ? act : { ...act, elements: act.elements.filter((_, j) => j !== elIdx) }
    ))
  }

  /* Catalogue add */
  const addFromCatalogue = item => {
    const targetIdx = parseInt(Object.entries(expanded).find(([, v]) => v)?.[0] ?? 0)
    const el = {
      id: `e${Date.now()}`,
      type: 'M',
      title: item.title,
      meta: item.duration,
      label: 'Microlesson',
    }
    setActsData(p => p.map((act, i) =>
      i !== targetIdx ? act : { ...act, elements: [...act.elements, el] }
    ))
  }

  /* File upload simulation */
  const handleUploadClick = () => fileInputRef.current?.click()

  const handleFileChange = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedFile(null)
    setUploadProgress(0)
    let pct = 0
    const iv = setInterval(() => {
      pct += 15 + Math.random() * 20
      if (pct >= 100) {
        clearInterval(iv)
        setUploadProgress(100)
        setTimeout(() => { setUploadedFile(file.name); setUploadProgress(null) }, 400)
      } else {
        setUploadProgress(Math.round(pct))
      }
    }, 130)
    e.target.value = ''
  }

  const catalogueFiltered = CATALOGUE_ITEMS.filter(item =>
    item.title.toLowerCase().includes(catalogueSearch.toLowerCase())
  )

  const STATUS_LABEL = { published: 'Published', draft: 'Draft' }

  return (
    <div className="page-body">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.svg"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* ── Top bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingBottom: 16, marginBottom: 20,
        borderBottom: '1px solid var(--color-border)',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button className="back-link" style={{ marginBottom: 0 }} onClick={() => navigate('/academy/admin/paths')}>
            <ChevronLeft size={14} /> Learning Paths
          </button>
          <span style={{ color: 'var(--color-muted)', fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>
            {settings.name}
          </span>
          <Badge variant={status}>{STATUS_LABEL[status]}</Badge>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button className="btn btn-outline btn-sm" onClick={() => setStatus('draft')}>Save Draft</button>
          <button className="btn btn-dark btn-sm" onClick={() => setStatus('published')}>Publish</button>
        </div>
      </div>

      {/* ── 2-column layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

        {/* LEFT: Path Sequence */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div className="section-title">Path Sequence</div>
            <span style={{ fontSize: 12, color: 'var(--color-muted)' }}>
              Drag elements to reorder or move between acts
            </span>
          </div>

          {actsData.map((act, i) => (
            <ActBlock
              key={act.id}
              actIdx={i}
              actData={act}
              name={actNames[i] ?? `Act ${i + 1}`}
              expanded={!!expanded[i]}
              onToggle={() => toggleAct(i)}
              dragSource={dragSource}
              dropTarget={dropTarget}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isAdding={addingToAct === i}
              onOpenAdd={() => { setAddingToAct(i); setExpanded(p => ({ ...p, [i]: true })) }}
              onConfirmAdd={el => handleConfirmAdd(i, el)}
              onCancelAdd={() => setAddingToAct(null)}
              onDelete={handleDelete}
              isEditing={editingActIdx === i}
              onEditStart={() => setEditingActIdx(i)}
              onEditChange={val => updateActName(i, val)}
              onEditBlur={() => setEditingActIdx(null)}
            />
          ))}

          <button
            className="btn btn-ghost"
            style={{
              width: '100%', justifyContent: 'center', marginTop: 8,
              border: '1px dashed var(--color-border)', borderRadius: 8, padding: '10px 0',
            }}
            onClick={addAct}
          >
            <Plus size={13} /> Add Act
          </button>
        </div>

        {/* RIGHT: Config panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Path Settings */}
          <div className="card" style={{ padding: 16 }}>
            <div className="section-title" style={{ fontSize: 13, marginBottom: 14 }}>Path Settings</div>

            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Path name</label>
              <input
                className="input"
                value={settings.name}
                onChange={e => setSettings(s => ({ ...s, name: e.target.value }))}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Sub-Org assigned</label>
              <select
                className="input select"
                value={settings.org}
                onChange={e => setSettings(s => ({ ...s, org: e.target.value }))}
              >
                <option>Amazon DSP Alemania</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">Profile flag</label>
              <select
                className="input select"
                value={settings.profile}
                onChange={e => setSettings(s => ({ ...s, profile: e.target.value }))}
              >
                {['Van', 'MM', 'Hybrid', 'All'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Stalled threshold</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  className="input"
                  type="number"
                  min={1}
                  value={settings.stalledDays}
                  onChange={e => setSettings(s => ({ ...s, stalledDays: Number(e.target.value) }))}
                  style={{ width: 70 }}
                />
                <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>days</span>
              </div>
            </div>
          </div>

          {/* Acts */}
          <div className="card" style={{ padding: 16 }}>
            <div className="section-title" style={{ fontSize: 13, marginBottom: 14 }}>Acts</div>

            {actNames.map((name, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 0',
                  borderBottom: i < actNames.length - 1 ? '1px solid var(--color-border)' : 'none',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-muted)', width: 36, flexShrink: 0 }}>
                  Act {i + 1}
                </span>
                {editingActIdx === i ? (
                  <input
                    autoFocus
                    className="input"
                    value={name}
                    onChange={e => updateActName(i, e.target.value)}
                    onBlur={() => setEditingActIdx(null)}
                    onKeyDown={e => (e.key === 'Enter' || e.key === 'Escape') && setEditingActIdx(null)}
                    style={{ flex: 1, height: 28, fontSize: 12, padding: '0 8px' }}
                  />
                ) : (
                  <span
                    style={{ flex: 1, fontSize: 13, cursor: 'pointer', color: 'var(--color-text)' }}
                    onClick={() => setEditingActIdx(i)}
                    title="Click to edit"
                  >
                    {name}
                  </span>
                )}
                <button
                  className="btn btn-ghost btn-icon"
                  style={{ width: 24, height: 24, padding: 0 }}
                  onClick={() => setEditingActIdx(i)}
                  title="Rename"
                >
                  <Pencil size={12} />
                </button>
              </div>
            ))}

            <button
              className="btn btn-ghost btn-sm"
              style={{ marginTop: 10, width: '100%', justifyContent: 'center' }}
              onClick={addAct}
            >
              <Plus size={12} /> Add Act
            </button>
          </div>

          {/* Certificate */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: certEnabled ? 14 : 8 }}>
              <div className="section-title" style={{ fontSize: 13 }}>Certificate</div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>Emitir al completar</span>
                <div
                  onClick={() => setCertEnabled(v => !v)}
                  style={{
                    width: 36, height: 20,
                    background: certEnabled ? 'var(--color-secondary)' : '#d1d5db',
                    borderRadius: 999, position: 'relative',
                    cursor: 'pointer', transition: 'background 0.18s', flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 2,
                    left: certEnabled ? 18 : 2,
                    width: 16, height: 16,
                    background: 'white', borderRadius: '50%',
                    transition: 'left 0.18s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </div>
              </label>
            </div>

            {certEnabled ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Plantilla</label>
                  <select
                    className="input select"
                    value={certTemplate}
                    onChange={e => setCertTemplate(e.target.value)}
                  >
                    <option value="standard">Service Club Standard</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Válido por</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      value={certValidity}
                      onChange={e => setCertValidity(Number(e.target.value))}
                      style={{ width: 70 }}
                    />
                    <select
                      className="input select"
                      value={certUnit}
                      onChange={e => setCertUnit(e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option value="meses">meses</option>
                      <option value="años">años</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Umbral mínimo</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      className="input"
                      type="number"
                      min={0} max={100}
                      value={certThreshold}
                      onChange={e => setCertThreshold(Number(e.target.value))}
                      style={{ width: 70 }}
                    />
                    <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>% para aprobar</span>
                  </div>
                </div>

                <div>
                  <div style={{
                    width: '100%', height: 90,
                    background: 'rgba(3,47,79,0.05)',
                    border: '1px dashed var(--color-border)',
                    borderRadius: 8,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 6, marginBottom: 10,
                  }}>
                    <Award size={26} color="var(--color-secondary)" />
                    <span style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 500 }}>
                      {uploadedFile ? uploadedFile : 'Certificate Preview'}
                    </span>
                  </div>
                  <UploadWidget
                    progress={uploadProgress}
                    filename={uploadedFile}
                    onUploadClick={handleUploadClick}
                  />
                </div>
              </div>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--color-muted)', textAlign: 'center', padding: '10px 0' }}>
                Este path no emite certificado
              </div>
            )}
          </div>

          {/* Catalogue */}
          <div className="card" style={{ padding: 16 }}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setCatalogueOpen(o => !o)}
            >
              <div className="section-title" style={{ fontSize: 13 }}>Catalogue</div>
              <ChevronDown
                size={14}
                color="var(--color-muted)"
                style={{ transform: catalogueOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s' }}
              />
            </div>

            {catalogueOpen && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--color-muted)', marginBottom: 8 }}>
                  Adds to the currently expanded act
                </div>
                <div className="search-wrapper" style={{ marginBottom: 10 }}>
                  <Search size={13} />
                  <input
                    className="input"
                    placeholder="Search microlessons..."
                    value={catalogueSearch}
                    onChange={e => setCatalogueSearch(e.target.value)}
                  />
                </div>

                {catalogueFiltered.map((item, i) => (
                  <div
                    key={item.title}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: i < catalogueFiltered.length - 1 ? '1px solid var(--color-border)' : 'none',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 1 }}>{item.duration}</div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ flexShrink: 0, gap: 3 }}
                      onClick={() => addFromCatalogue(item)}
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
