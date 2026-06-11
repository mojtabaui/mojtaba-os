'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { PRIORITY_CONFIG, STATUS_CONFIG, formatDate, toLocalDateStr } from '@/lib/utils'
import type { Priority } from '@/lib/utils'
import { AppShell } from '@/components/layout/AppShell'
import { CalendarDays, CheckCircle2, Circle, ChevronLeft, ChevronRight, Flame, AlertCircle } from 'lucide-react'
import { useT } from '@/lib/i18n'

const WEEKDAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeekRange(offset = 0) {
  const now = new Date()
  const start = new Date(now)
  start.setDate(now.getDate() - now.getDay() + offset * 7)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return { start, end }
}

const WEEKLY_TIME_BUDGET: Record<Priority, { hours: number; color: string; label: string }> = {
  p1: { hours: 10, color: '#EF4444', label: 'Migration' },
  p2: { hours: 7, color: '#F97316', label: 'IELTS' },
  p3: { hours: 40, color: '#3B82F6', label: 'Balinex' },
  p4: { hours: 12, color: '#22C55E', label: 'Academy' },
  p5: { hours: 6, color: '#A855F7', label: 'Content' },
}

export default function WeeklyPage() {
  const t = useT()
  const { tasks, moveTask, ieltsSessions } = useStore()
  const [weekOffset, setWeekOffset] = useState(0)
  const [reflections, setReflections] = useState({ well: '', blocked: '', improve: '' })

  const { start, end } = getWeekRange(weekOffset)
  const startStr = toLocalDateStr(start)
  const endStr = toLocalDateStr(end)
  const isCurrentWeek = weekOffset === 0

  const weekLabel = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

  // Tasks due this week
  const weekTasks = tasks.filter(task => task.dueDate && task.dueDate >= startStr && task.dueDate <= endStr)
  const completedThisWeek = weekTasks.filter(task => task.status === 'done').length
  const completionRate = weekTasks.length > 0 ? Math.round((completedThisWeek / weekTasks.length) * 100) : 0

  // IELTS sessions this week
  const weekIELTS = ieltsSessions.filter(s => s.date >= startStr && s.date <= endStr)
  const ieltsMinutes = weekIELTS.reduce((a, s) => a + s.duration, 0)

  // Estimated hours used per priority
  const hoursUsed: Partial<Record<Priority, number>> = {}
  ;(['p1', 'p2', 'p3', 'p4', 'p5'] as Priority[]).forEach(p => {
    const pTasks = weekTasks.filter(task => task.priority === p)
    hoursUsed[p] = Math.round(pTasks.reduce((a, task) => a + (task.estimatedTime || 0), 0) / 60 * 10) / 10
  })

  // Days of the week grid
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    return d
  })

  const today = toLocalDateStr(new Date())

  return (
    <AppShell>
      <div className="min-h-full">
        <div className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur-sm border-b border-[#E4DDD3] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-[#3B82F6]" />
              <div>
                <h1 className="text-lg font-semibold text-ink-200">{t.weekly.title}</h1>
                <p className="text-[12px] text-[#A09388]">{weekLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setWeekOffset(w => w - 1)} className="p-1.5 rounded-lg hover:bg-white transition-colors text-[#6B6259]">
                <ChevronLeft size={14} />
              </button>
              <button onClick={() => setWeekOffset(0)}
                className={`px-3 py-1.5 text-[11px] rounded-lg transition-colors ${isCurrentWeek ? 'bg-ink-200 text-cream-200' : 'bg-white border border-[#E4DDD3] text-[#6B6259]'}`}>
                This Week
              </button>
              <button onClick={() => setWeekOffset(w => w + 1)} className="p-1.5 rounded-lg hover:bg-white transition-colors text-[#6B6259]">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-[1100px] xl:max-w-[1600px] 2xl:max-w-[2000px] 3xl:max-w-[2800px]">
          {/* Week Stats */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <div className="bg-[#0A0A0A] rounded-2xl p-4">
              <p className="text-[11px] text-[#5A5550] uppercase tracking-wider mb-2">Completion</p>
              <p className="text-3xl font-bold text-cream-200">{completionRate}%</p>
              <p className="text-[11px] text-[#5A5550] mt-1">{completedThisWeek}/{weekTasks.length} tasks</p>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <p className="text-[11px] text-[#A09388] uppercase tracking-wider mb-2">{t.weekly.ieltsHours}</p>
              <p className="text-3xl font-bold text-[#F97316]">{Math.round(ieltsMinutes / 60)}h</p>
              <p className="text-[11px] text-[#A09388] mt-1">{weekIELTS.length} sessions</p>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <p className="text-[11px] text-[#A09388] uppercase tracking-wider mb-2">Overdue</p>
              <p className="text-3xl font-bold text-[#EF4444]">{weekTasks.filter(task => task.dueDate && task.dueDate < today && task.status !== 'done').length}</p>
              <p className="text-[11px] text-[#A09388] mt-1">tasks past due</p>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <p className="text-[11px] text-[#A09388] uppercase tracking-wider mb-2">In Progress</p>
              <p className="text-3xl font-bold text-ink-200">{weekTasks.filter(task => task.status === 'in-progress').length}</p>
              <p className="text-[11px] text-[#A09388] mt-1">active tasks</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Day-by-day breakdown */}
            <div className="col-span-2 bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <h2 className="text-[13px] font-semibold text-ink-200 mb-4">Week Grid</h2>
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, i) => {
                  const dateStr = toLocalDateStr(day)
                  const dayTasks = tasks.filter(task => task.dueDate === dateStr)
                  const isToday = dateStr === today
                  const isPast = dateStr < today
                  const hasMigration = dayTasks.some(task => task.priority === 'p1')
                  const hasIELTS = ieltsSessions.some(s => s.date === dateStr)

                  return (
                    <div key={dateStr}
                      className={`rounded-xl p-2 text-center transition-all ${isToday ? 'bg-ink-200 ring-2 ring-ink-200' : isPast ? 'bg-cream-100 opacity-70' : 'bg-cream-50 border border-[#F0EAE2]'}`}>
                      <p className={`text-[9px] font-medium mb-1 ${isToday ? 'text-cream-400' : 'text-[#A09388]'}`}>{WEEKDAYS_SHORT[i]}</p>
                      <p className={`text-[14px] font-bold ${isToday ? 'text-cream-200' : 'text-ink-200'}`}>{day.getDate()}</p>
                      <div className="flex justify-center gap-0.5 mt-1.5">
                        {dayTasks.slice(0, 3).map((task, ti) => (
                          <div key={ti} className="w-1.5 h-1.5 rounded-full"
                            style={{ background: PRIORITY_CONFIG[task.priority].color }} />
                        ))}
                        {dayTasks.length > 3 && <div className="w-1.5 h-1.5 rounded-full bg-[#D4C9B8]" />}
                      </div>
                      {hasIELTS && <div className="w-1.5 h-1.5 rounded-full bg-[#F97316] mx-auto mt-0.5" title="IELTS study" />}
                      <p className={`text-[9px] mt-1 ${isToday ? 'text-cream-400' : 'text-[#C4B9AD]'}`}>{dayTasks.length}t</p>
                    </div>
                  )
                })}
              </div>
              <p className="text-[10px] text-[#C4B9AD] mt-3">Colored dots = task priorities · Orange = IELTS study</p>
            </div>

            {/* Time Budget */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <h2 className="text-[13px] font-semibold text-ink-200 mb-4">{t.weekly.timeBudget}</h2>
              <div className="space-y-3">
                {(Object.entries(WEEKLY_TIME_BUDGET) as [Priority, typeof WEEKLY_TIME_BUDGET[Priority]][]).map(([key, budget]) => {
                  const used = hoursUsed[key] || 0
                  const pct = Math.min(Math.round((used / budget.hours) * 100), 100)
                  const over = used > budget.hours
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-medium text-ink-200">{budget.label}</span>
                        <span className={`text-[10px] font-semibold ${over ? 'text-[#EF4444]' : 'text-[#A09388]'}`}>
                          {used}h / {budget.hours}h {over && '⚠️'}
                        </span>
                      </div>
                      <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: over ? '#EF4444' : budget.color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Tasks this week */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 mb-4">
            <h2 className="text-[13px] font-semibold text-ink-200 mb-3">Tasks This Week ({weekTasks.length})</h2>
            {weekTasks.length === 0 ? (
              <p className="text-[12px] text-[#C4B9AD] py-6 text-center">{t.weekly.noTasks}</p>
            ) : (
              <div className="space-y-1.5">
                {weekTasks.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || '')).map(task => {
                  const cfg = PRIORITY_CONFIG[task.priority]
                  const stCfg = STATUS_CONFIG[task.status]
                  const isOverdue = task.dueDate && task.dueDate < today && task.status !== 'done'
                  return (
                    <div key={task.id} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream-50 transition-colors group">
                      <button onClick={() => moveTask(task.id, task.status === 'done' ? 'planned' : 'done')} className="text-[#D4C9B8] hover:text-[#22C55E] flex-shrink-0 transition-colors">
                        {task.status === 'done' ? <CheckCircle2 size={14} className="text-[#22C55E]" /> : <Circle size={14} />}
                      </button>
                      <span className={`text-[12px] flex-1 ${task.status === 'done' ? 'line-through text-[#C4B9AD]' : 'text-ink-200'}`}>{task.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: cfg.bg, color: cfg.text }}>{cfg.short}</span>
                      <span className="text-[10px]" style={{ color: stCfg.color }}>{stCfg.label}</span>
                      {task.dueDate && (
                        <span className={`text-[10px] flex items-center gap-0.5 ${isOverdue ? 'text-[#EF4444]' : 'text-[#A09388]'}`}>
                          {isOverdue && <AlertCircle size={9} />}
                          {WEEKDAYS_SHORT[new Date(task.dueDate + 'T00:00:00').getDay()]}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Weekly Review */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
            <h2 className="text-[13px] font-semibold text-ink-200 mb-1 flex items-center gap-1.5">
              <Flame size={13} className="text-[#F97316]" /> {t.weekly.weeklyReview}
            </h2>
            <p className="text-[11px] text-[#A09388] mb-4">Reflect on your week to improve next one</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'well' as const, label: t.weekly.wellLabel, placeholder: 'Victories, progress, good habits...' },
                { key: 'blocked' as const, label: t.weekly.blockedLabel, placeholder: 'Obstacles, distractions, delays...' },
                { key: 'improve' as const, label: t.weekly.improveLabel, placeholder: 'Changes, adjustments, focus...' },
              ].map(q => (
                <div key={q.key}>
                  <label className="text-[11px] font-medium text-[#6B6259] block mb-1.5">{q.label}</label>
                  <textarea
                    rows={4}
                    value={reflections[q.key]}
                    onChange={e => setReflections(r => ({ ...r, [q.key]: e.target.value }))}
                    placeholder={q.placeholder}
                    className="w-full text-[12px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2.5 focus:outline-none focus:border-ink-200 transition-colors text-ink-200 resize-none placeholder:text-[#C4B9AD]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
