'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { PRIORITY_CONFIG } from '@/lib/utils'
import type { Priority } from '@/lib/utils'
import { AppShell } from '@/components/layout/AppShell'
import { Clock, AlertTriangle, TrendingUp, Edit2, Check, X } from 'lucide-react'
import { useT } from '@/lib/i18n'

const DEFAULT_BUDGET: Record<Priority, number> = {
  p1: 10,
  p2: 7,
  p3: 40,
  p4: 12,
  p5: 6,
}

export default function BudgetPage() {
  const t = useT()
  const { tasks, ieltsSessions } = useStore()
  const [budgets, setBudgets] = useState<Record<Priority, number>>(DEFAULT_BUDGET)
  const [editingKey, setEditingKey] = useState<Priority | null>(null)
  const [editVal, setEditVal] = useState('')

  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const weekStartStr = `${weekStart.getFullYear()}-${String(weekStart.getMonth()+1).padStart(2,'0')}-${String(weekStart.getDate()).padStart(2,'0')}`

  // Calculate spent hours per priority (from estimated time of tasks due this week)
  const spent: Record<Priority, number> = { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0 }
  tasks.filter(task => task.dueDate && task.dueDate >= weekStartStr && task.status !== 'cancelled').forEach(task => {
    if (task.estimatedTime) {
      spent[task.priority] = (spent[task.priority] || 0) + task.estimatedTime / 60
    }
  })
  // Add IELTS actual hours
  const ieltsHours = ieltsSessions.filter(s => s.date >= weekStartStr).reduce((a, s) => a + s.duration, 0) / 60
  spent.p2 = Math.max(spent.p2, ieltsHours)

  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0)
  const totalSpent = Object.values(spent).reduce((a, b) => a + b, 0)

  const startEdit = (key: Priority) => {
    setEditingKey(key)
    setEditVal(String(budgets[key]))
  }

  const saveEdit = (key: Priority) => {
    const val = parseFloat(editVal)
    if (!isNaN(val) && val > 0) setBudgets(b => ({ ...b, [key]: val }))
    setEditingKey(null)
  }

  return (
    <AppShell>
      <div className="min-h-full">
        <div className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur-sm border-b border-[#E4DDD3] px-6 py-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[#6B6259]" />
            <div>
              <h1 className="text-lg font-semibold text-ink-200">{t.budget.title}</h1>
              <p className="text-[12px] text-[#A09388]">{t.budget.weekBudget}</p>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-3xl xl:max-w-[1200px] 2xl:max-w-[1800px] 3xl:max-w-[2400px]">
          {/* Overview card */}
          <div className="bg-[#0A0A0A] rounded-2xl p-6 mb-5">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-[11px] text-[#3A3A3A] uppercase tracking-wider mb-1">Weekly Capacity</p>
                <p className="text-4xl font-bold text-cream-200">{totalSpent.toFixed(1)}<span className="text-2xl text-[#5A5550]">h</span></p>
                <p className="text-[12px] text-[#5A5550] mt-1">of {totalBudget}h budgeted</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] text-[#5A5550]">{(totalBudget - totalSpent).toFixed(1)}h remaining</p>
                <p className="text-[11px] text-[#3A3A3A]">
                  {totalSpent > totalBudget ? '⚠️ Over budget' : totalSpent / totalBudget > 0.8 ? '🔶 Near limit' : '✅ On track'}
                </p>
              </div>
            </div>
            <div className="h-3 bg-[#1A1A1A] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: totalSpent > totalBudget ? '#EF4444' : 'linear-gradient(90deg, #22C55E, #3B82F6)' }}
              />
            </div>
          </div>

          {/* Per-priority breakdown */}
          <div className="space-y-3">
            {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG[Priority]][]).map(([key, cfg]) => {
              const budget = budgets[key]
              const use = spent[key] || 0
              const pct = Math.min(Math.round((use / budget) * 100), 100)
              const isOver = use > budget
              const isNear = !isOver && use / budget > 0.8

              return (
                <motion.div key={key} layout
                  className={`bg-white border rounded-2xl p-5 transition-all ${isOver ? 'border-[#FECACA]' : 'border-[#E8E2D8]'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: cfg.bg, color: cfg.text }}>{cfg.short}</span>
                        <h3 className="text-[14px] font-semibold text-ink-200">{cfg.label}</h3>
                        {isOver && <AlertTriangle size={13} className="text-[#EF4444]" />}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingKey === key ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editVal}
                            onChange={e => setEditVal(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') saveEdit(key); if (e.key === 'Escape') setEditingKey(null) }}
                            autoFocus
                            className="w-16 text-[12px] text-center bg-cream-100 border border-[#D4C9B8] rounded-lg px-2 py-1 focus:outline-none"
                          />
                          <span className="text-[11px] text-[#A09388]">h/week</span>
                          <button onClick={() => saveEdit(key)} className="text-[#22C55E] hover:text-[#16A34A]"><Check size={13} /></button>
                          <button onClick={() => setEditingKey(null)} className="text-[#D4C9B8] hover:text-[#EF4444]"><X size={13} /></button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(key)} className="flex items-center gap-1 text-[#A09388] hover:text-ink-200 transition-colors">
                          <span className="text-[12px]">{budget}h/week</span>
                          <Edit2 size={11} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 h-2.5 bg-cream-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: isOver ? '#EF4444' : isNear ? '#F97316' : cfg.color }}
                      />
                    </div>
                    <span className={`text-[12px] font-semibold w-10 text-right ${isOver ? 'text-[#EF4444]' : 'text-ink-200'}`}>{pct}%</span>
                  </div>

                  <div className="flex justify-between text-[11px]">
                    <span style={{ color: isOver ? '#EF4444' : cfg.color }}>
                      {use.toFixed(1)}h used
                    </span>
                    <span className="text-[#A09388]">{Math.max(0, budget - use).toFixed(1)}h remaining</span>
                    <span className="text-[#A09388]">{budget}h budget</span>
                  </div>

                  {isOver && (
                    <div className="mt-2 p-2 bg-[#FEF2F2] border border-[#FECACA] rounded-lg">
                      <p className="text-[11px] text-[#DC2626] flex items-center gap-1.5">
                        <AlertTriangle size={11} />
                        {(use - budget).toFixed(1)}h over budget — consider redistributing tasks
                      </p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Tips */}
          <div className="mt-5 bg-white border border-[#E8E2D8] rounded-2xl p-4">
            <h3 className="text-[12px] font-semibold text-ink-200 mb-3 flex items-center gap-1.5">
              <TrendingUp size={13} /> Budget Tips
            </h3>
            <div className="space-y-2">
              {[
                'Balinex takes the largest chunk (40h) — protect deep work blocks',
                'Reserve morning hours for P1 Migration and P2 IELTS',
                'Keep P5 Content to evenings — avoid context switching during work',
                'Academy sessions work best in fixed weekly time slots',
              ].map((tip, i) => (
                <p key={i} className="text-[11px] text-[#6B6259] flex items-start gap-2">
                  <span className="text-[#D4C9B8] flex-shrink-0 mt-0.5">→</span>
                  {tip}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
