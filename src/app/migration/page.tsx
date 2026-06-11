'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { formatDate } from '@/lib/utils'
import type { MigrationApp } from '@/lib/store'
import { AppShell } from '@/components/layout/AppShell'
import { Plane, Plus, X, ExternalLink, FileText, CheckCircle2, Clock, AlertCircle, Trophy } from 'lucide-react'
import { useT } from '@/lib/i18n'

type AppStatus = MigrationApp['status']

type Stage = { status: AppStatus; label: string; color: string; bg: string }

function AppCard({ app, onUpdate, onDelete, stages }: {
  app: MigrationApp
  onUpdate: (u: Partial<MigrationApp>) => void
  onDelete: () => void
  stages: Stage[]
}) {
  const stage = stages.find(s => s.status === app.status)!
  const _now = new Date(); const isOverdue = app.deadline < `${_now.getFullYear()}-${String(_now.getMonth()+1).padStart(2,'0')}-${String(_now.getDate()).padStart(2,'0')}`

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="bg-white border border-[#E8E2D8] rounded-xl p-4 hover:border-[#D4C9B8] hover:shadow-card transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-ink-200 truncate">{app.universityName}</p>
          <p className="text-[11px] text-[#A09388] mt-0.5">{app.program}</p>
        </div>
        <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 text-[#D4C9B8] hover:text-[#EF4444] transition-all flex-shrink-0">
          <X size={12} />
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: stage.bg, color: stage.color }}>
          {stage.label}
        </span>
        <span className="text-[10px] text-[#A09388]">🌍 {app.country}</span>
        {app.deadline && (
          <span className={`text-[10px] flex items-center gap-0.5 ${isOverdue ? 'text-[#EF4444]' : 'text-[#A09388]'}`}>
            {isOverdue ? <AlertCircle size={9} /> : <Clock size={9} />}
            {formatDate(app.deadline, 'relative')}
          </span>
        )}
        {app.link && (
          <a href={app.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="text-[10px] text-[#3B82F6] flex items-center gap-0.5 hover:underline">
            <ExternalLink size={9} /> Link
          </a>
        )}
      </div>

      {app.notes && (
        <p className="text-[11px] text-[#6B6259] mt-2 bg-cream-50 rounded-lg px-2.5 py-1.5 border border-[#F0EAE2]">{app.notes}</p>
      )}

      {/* Stage progression */}
      <div className="flex items-center gap-0.5 mt-3">
        {stages.slice(0, 5).map((s) => {
          const stageIdx = stages.findIndex(st => st.status === app.status)
          const thisIdx = stages.findIndex(st => st.status === s.status)
          const isPast = thisIdx < stageIdx
          const isCurrent = s.status === app.status
          return (
            <button
              key={s.status}
              onClick={() => onUpdate({ status: s.status })}
              className="flex-1 h-1 rounded-full transition-all hover:opacity-80"
              style={{ background: (isCurrent || isPast) ? s.color : '#E4DDD3' }}
            />
          )
        })}
      </div>
    </motion.div>
  )
}

function AddAppModal({ onClose, stages, t }: { onClose: () => void; stages: Stage[]; t: ReturnType<typeof useT> }) {
  const { addMigration } = useStore()
  const [form, setForm] = useState({ universityName: '', country: '', program: '', deadline: '', status: 'researching' as AppStatus, notes: '', link: '' })

  const submit = () => {
    if (!form.universityName || !form.program) return
    addMigration(form)
    onClose()
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] bg-white border border-[#E4DDD3] rounded-2xl shadow-modal z-[51] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EAE2]">
          <h3 className="text-[14px] font-semibold text-ink-200">{t.migration.addApp}</h3>
          <button onClick={onClose} className="text-[#A09388] hover:text-ink-200"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-3">
          {[
            { label: t.migration.university, key: 'universityName', placeholder: 'e.g. University College London' },
            { label: t.migration.country, key: 'country', placeholder: 'e.g. UK' },
            { label: t.migration.program, key: 'program', placeholder: 'e.g. EngD Design Engineering' },
            { label: 'Link', key: 'link', placeholder: 'https://' },
          ].map(field => (
            <div key={field.key}>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{field.label}</label>
              <input
                value={form[field.key as keyof typeof form]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 transition-colors placeholder:text-[#C4B9AD] text-ink-200"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.migration.deadline}</label>
              <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 transition-colors text-ink-200" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as AppStatus })}
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 transition-colors text-ink-200">
                {stages.map(s => <option key={s.status} value={s.status}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.migration.notes}</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={2} placeholder="Notes about this application..."
              className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 transition-colors placeholder:text-[#C4B9AD] text-ink-200 resize-none" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="px-4 py-2 text-[12px] text-[#6B6259] hover:text-ink-200">{t.common.cancel}</button>
            <button onClick={submit} className="px-4 py-2 text-[12px] bg-ink-200 text-cream-200 rounded-xl hover:bg-ink-300 transition-colors">{t.migration.addApp}</button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default function MigrationPage() {
  const t = useT()
  const { migrations, updateMigration, deleteMigration } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [activeStage, setActiveStage] = useState<AppStatus | 'all'>('all')

  const STAGES: Stage[] = [
    { status: 'researching', label: t.migration.researching, color: '#A09388', bg: '#F8F5EF' },
    { status: 'preparing', label: t.migration.preparing, color: '#3B82F6', bg: '#EFF6FF' },
    { status: 'applied', label: t.migration.applied, color: '#F97316', bg: '#FFF7ED' },
    { status: 'interview', label: t.migration.interview, color: '#A855F7', bg: '#FAF5FF' },
    { status: 'waiting', label: t.migration.waiting, color: '#EAB308', bg: '#FEFCE8' },
    { status: 'accepted', label: t.migration.accepted, color: '#22C55E', bg: '#F0FDF4' },
    { status: 'rejected', label: t.migration.rejected, color: '#EF4444', bg: '#FEF2F2' },
  ]

  const filtered = activeStage === 'all' ? migrations : migrations.filter(m => m.status === activeStage)

  const stats = {
    total: migrations.length,
    applied: migrations.filter(m => ['applied', 'interview', 'waiting', 'accepted'].includes(m.status)).length,
    accepted: migrations.filter(m => m.status === 'accepted').length,
    upcoming: migrations.filter(m => {
      const d = new Date(m.deadline)
      const diff = (d.getTime() - Date.now()) / 86400000
      return diff > 0 && diff <= 30
    }).length,
  }

  return (
    <AppShell>
      <div className="min-h-full">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur-sm border-b border-[#E4DDD3] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane size={16} className="text-[#EF4444]" />
              <div>
                <h1 className="text-lg font-semibold text-ink-200">{t.migration.title}</h1>
                <p className="text-[12px] text-[#A09388]">{t.migration.subtitle}</p>
              </div>
            </div>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-ink-200 text-cream-200 rounded-xl text-[12px] font-medium hover:bg-ink-300 transition-colors">
              <Plus size={13} /> {t.migration.addApp}
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: t.migration.university, value: stats.total, icon: FileText, color: '#6B6259' },
              { label: t.migration.applied, value: stats.applied, icon: CheckCircle2, color: '#F97316' },
              { label: t.migration.accepted, value: stats.accepted, icon: Trophy, color: '#22C55E' },
              { label: 'Due in 30 days', value: stats.upcoming, icon: AlertCircle, color: '#EF4444' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <s.icon size={13} style={{ color: s.color }} />
                  <p className="text-[11px] text-[#A09388]">{s.label}</p>
                </div>
                <p className="text-2xl font-semibold text-ink-200">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Stage filter */}
          <div className="flex gap-1.5 mb-5 flex-wrap">
            <button
              onClick={() => setActiveStage('all')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${activeStage === 'all' ? 'bg-ink-200 text-cream-200' : 'bg-white border border-[#E4DDD3] text-[#6B6259] hover:border-[#D4C9B8]'}`}
            >
              {t.common.all} ({migrations.length})
            </button>
            {STAGES.map(s => {
              const count = migrations.filter(m => m.status === s.status).length
              if (count === 0) return null
              return (
                <button
                  key={s.status}
                  onClick={() => setActiveStage(s.status)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${activeStage === s.status ? 'ring-2 ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.label} ({count})
                </button>
              )
            })}
          </div>

          {/* Pipeline */}
          <div className="grid grid-cols-3 gap-3">
            <AnimatePresence>
              {filtered.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  stages={STAGES}
                  onUpdate={(u) => updateMigration(app.id, u)}
                  onDelete={() => deleteMigration(app.id)}
                />
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Plane size={32} className="mx-auto text-[#D4C9B8] mb-3" />
              <p className="text-[13px] text-[#A09388]">No applications in this stage</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAdd && <AddAppModal onClose={() => setShowAdd(false)} stages={STAGES} t={t} />}
      </AnimatePresence>
    </AppShell>
  )
}
