'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { PRIORITY_CONFIG, formatDate } from '@/lib/utils'
import type { Priority } from '@/lib/utils'
import type { Goal } from '@/lib/store'
import { AppShell } from '@/components/layout/AppShell'
import { Target, Plus, X, TrendingUp, CheckCircle2 } from 'lucide-react'
import { useT } from '@/lib/i18n'

function GoalCard({ goal, onUpdate, onDelete }: { goal: Goal; onUpdate: (u: Partial<Goal>) => void; onDelete: () => void }) {
  const cfg = PRIORITY_CONFIG[goal.priority]
  const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100)
  const done = pct >= 100

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-white border border-[#E8E2D8] rounded-2xl p-5 hover:border-[#D4C9B8] hover:shadow-card transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: cfg.bg, color: cfg.text }}>{cfg.short} {cfg.label}</span>
            {done && <CheckCircle2 size={13} className="text-[#22C55E]" />}
          </div>
          <h3 className="text-[14px] font-semibold text-ink-200">{goal.title}</h3>
          {goal.description && <p className="text-[11px] text-[#A09388] mt-0.5">{goal.description}</p>}
        </div>
        <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 text-[#D4C9B8] hover:text-[#EF4444] transition-all ml-2">
          <X size={13} />
        </button>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[12px] font-medium text-ink-200">{goal.current} <span className="text-[#A09388] font-normal">/ {goal.target} {goal.unit}</span></span>
          <span className="text-[13px] font-bold" style={{ color: done ? '#22C55E' : cfg.color }}>{pct}%</span>
        </div>
        <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: done ? '#22C55E' : cfg.color }}
          />
        </div>
      </div>

      {/* Quick increment */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onUpdate({ current: Math.max(0, goal.current - 1) })}
            className="w-6 h-6 rounded-lg bg-cream-200 text-[#6B6259] hover:bg-cream-300 flex items-center justify-center text-sm font-medium transition-colors"
          >−</button>
          <span className="text-[12px] font-medium text-ink-200 w-8 text-center">{goal.current}</span>
          <button
            onClick={() => onUpdate({ current: Math.min(goal.target, goal.current + 1) })}
            className="w-6 h-6 rounded-lg bg-cream-200 text-[#6B6259] hover:bg-cream-300 flex items-center justify-center text-sm font-medium transition-colors"
          >+</button>
        </div>
        {goal.deadline && (
          <span className="ml-auto text-[10px] text-[#A09388]">Due: {formatDate(goal.deadline, 'relative')}</span>
        )}
      </div>
    </motion.div>
  )
}

function AddGoalModal({ onClose, t }: { onClose: () => void; t: ReturnType<typeof useT> }) {
  const { addGoal } = useStore()
  const [form, setForm] = useState({ title: '', priority: 'p3' as Priority, target: 10, unit: '', deadline: '', description: '' })

  const submit = () => {
    if (!form.title || !form.unit) return
    addGoal({ ...form, current: 0 })
    onClose()
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] bg-white border border-[#E4DDD3] rounded-2xl shadow-modal z-[51]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EAE2]">
          <h3 className="text-[14px] font-semibold text-ink-200">{t.goals.addGoal}</h3>
          <button onClick={onClose} className="text-[#A09388] hover:text-ink-200"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={t.goals.goalTitle} autoFocus
            className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2.5 focus:outline-none focus:border-ink-200 text-ink-200 placeholder:text-[#C4B9AD]" />
          <div>
            <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.goals.description}</label>
            <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200 placeholder:text-[#C4B9AD]" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.goals.target}</label>
              <input type="number" value={form.target} onChange={e => setForm({ ...form, target: Number(e.target.value) })}
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.goals.unit}</label>
              <input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} placeholder="e.g. hours"
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200 placeholder:text-[#C4B9AD]" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.tasks.priority}</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Priority })}
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200">
                {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG[Priority]][]).map(([k, v]) => (
                  <option key={k} value={k}>{v.short} {v.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.goals.deadline}</label>
            <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
              className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="px-4 py-2 text-[12px] text-[#6B6259]">{t.common.cancel}</button>
            <button onClick={submit} className="px-4 py-2 text-[12px] bg-ink-200 text-cream-200 rounded-xl">{t.goals.addGoal}</button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default function GoalsPage() {
  const t = useT()
  const { goals, updateGoal, deleteGoal } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState<Priority | 'all'>('all')

  const filtered = filter === 'all' ? goals : goals.filter(g => g.priority === filter)
  const completed = goals.filter(g => g.current >= g.target).length
  const overallPct = goals.length > 0
    ? Math.round(goals.reduce((a, g) => a + Math.min(g.current / g.target, 1), 0) / goals.length * 100)
    : 0

  return (
    <AppShell>
      <div className="min-h-full">
        <div className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur-sm border-b border-[#E4DDD3] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-[#22C55E]" />
              <div>
                <h1 className="text-lg font-semibold text-ink-200">{t.goals.title}</h1>
                <p className="text-[12px] text-[#A09388]">{completed}/{goals.length} completed · {overallPct}% overall</p>
              </div>
            </div>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-ink-200 text-cream-200 rounded-xl text-[12px] font-medium hover:bg-ink-300 transition-colors">
              <Plus size={13} /> {t.goals.addGoal}
            </button>
          </div>
        </div>

        <div className="p-6 max-w-4xl">
          {/* Overall progress */}
          <div className="bg-[#0A0A0A] rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] text-[#5A5550] uppercase tracking-wider">Overall Progress</p>
                <p className="text-4xl font-bold text-cream-200 mt-1">{overallPct}%</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#5A5550]">{completed} completed</p>
                <p className="text-[11px] text-[#5A5550]">{goals.length - completed} in progress</p>
              </div>
            </div>
            <div className="h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-cream-200 rounded-full"
              />
            </div>
          </div>

          {/* Priority filter */}
          <div className="flex gap-1.5 mb-5">
            <button onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${filter === 'all' ? 'bg-ink-200 text-cream-200' : 'bg-white border border-[#E4DDD3] text-[#6B6259]'}`}>
              All
            </button>
            {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG[Priority]][]).map(([key, cfg]) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${filter === key ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-90'}`}
                style={{ background: cfg.bg, color: cfg.text }}>
                {cfg.short} {cfg.label}
              </button>
            ))}
          </div>

          {/* Goals grid */}
          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence>
              {filtered.map(goal => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onUpdate={(u) => updateGoal(goal.id, u)}
                  onDelete={() => deleteGoal(goal.id)}
                />
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Target size={32} className="mx-auto text-[#D4C9B8] mb-3" />
              <p className="text-[13px] text-[#A09388]">{t.goals.noGoals}</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAdd && <AddGoalModal onClose={() => setShowAdd(false)} t={t} />}
      </AnimatePresence>
    </AppShell>
  )
}
