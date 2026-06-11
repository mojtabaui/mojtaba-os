'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { PRIORITY_CONFIG, STATUS_CONFIG, formatDate, formatTime } from '@/lib/utils'
import { AppShell } from '@/components/layout/AppShell'
import { Briefcase, CheckCircle2, Clock, Circle, Users, LayoutGrid, List, Plus, Calendar } from 'lucide-react'
import { useT } from '@/lib/i18n'

const CATEGORIES = ['All', 'Design', 'Product', 'Research', 'Meeting', 'Collaboration']

export default function BalinexPage() {
  const t = useT()
  const { tasks, events, moveTask } = useStore()
  const [activeTab, setActiveTab] = useState('tasks')
  const [filterCat, setFilterCat] = useState('All')
  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` })()

  const balinexTasks = tasks.filter(task => task.category === 'balinex' || task.priority === 'p3')
  const filtered = filterCat === 'All' ? balinexTasks : balinexTasks.filter(task => task.tags.some(tag => tag.toLowerCase() === filterCat.toLowerCase()))
  const todayEvents = events.filter(e => e.category === 'balinex' && e.date === today)
  const upcomingEvents = events.filter(e => e.category === 'balinex' && e.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5)

  const done = balinexTasks.filter(task => task.status === 'done').length
  const inProgress = balinexTasks.filter(task => task.status === 'in-progress').length
  const total = balinexTasks.length

  return (
    <AppShell>
      <div className="min-h-full">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur-sm border-b border-[#E4DDD3] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase size={16} className="text-[#3B82F6]" />
              <div>
                <h1 className="text-lg font-semibold text-ink-200">{t.balinex.title}</h1>
                <p className="text-[12px] text-[#A09388]">{t.balinex.subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-[#0A0A0A] rounded-2xl p-4">
              <p className="text-[11px] text-[#5A5550] uppercase tracking-wider mb-2">{t.balinex.totalTasks}</p>
              <p className="text-3xl font-bold text-cream-200">{total}</p>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <p className="text-[11px] text-[#A09388] uppercase tracking-wider mb-2">{t.balinex.inProgress}</p>
              <p className="text-3xl font-bold text-[#3B82F6]">{inProgress}</p>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <p className="text-[11px] text-[#A09388] uppercase tracking-wider mb-2">{t.balinex.completed}</p>
              <p className="text-3xl font-bold text-[#22C55E]">{done}</p>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <p className="text-[11px] text-[#A09388] uppercase tracking-wider mb-2">{t.balinex.todayMeetings}</p>
              <p className="text-3xl font-bold text-ink-200">{todayEvents.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Tasks */}
            <div className="col-span-2">
              {/* Tab bar */}
              <div className="flex gap-1 mb-4">
                {[
                  { key: 'tasks', label: t.balinex.tasks },
                  { key: 'meetings', label: t.balinex.events },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-2 rounded-xl text-[12px] font-medium capitalize transition-colors ${activeTab === tab.key ? 'bg-ink-200 text-cream-200' : 'bg-white border border-[#E4DDD3] text-[#6B6259] hover:border-[#D4C9B8]'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'tasks' && (
                <div>
                  {/* Category filter */}
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {CATEGORIES.map(c => (
                      <button key={c} onClick={() => setFilterCat(c)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${filterCat === c ? 'bg-ink-200 text-cream-200' : 'bg-white border border-[#E4DDD3] text-[#6B6259] hover:border-[#D4C9B8]'}`}>
                        {c}
                      </button>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-[#A09388]">Sprint progress</span>
                      <span className="text-[11px] font-medium text-ink-200">{total > 0 ? Math.round((done / total) * 100) : 0}%</span>
                    </div>
                    <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#3B82F6] rounded-full transition-all duration-700" style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <AnimatePresence>
                      {filtered.map(task => {
                        const stCfg = STATUS_CONFIG[task.status]
                        return (
                          <motion.div
                            key={task.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3 px-4 py-3 bg-white border border-[#E8E2D8] rounded-xl hover:border-[#D4C9B8] transition-all group"
                          >
                            <button onClick={() => moveTask(task.id, task.status === 'done' ? 'in-progress' : 'done')} className="text-[#D4C9B8] hover:text-[#22C55E] flex-shrink-0">
                              {task.status === 'done' ? <CheckCircle2 size={15} className="text-[#22C55E]" /> : <Circle size={15} />}
                            </button>
                            <span className={`text-[13px] flex-1 ${task.status === 'done' ? 'line-through text-[#C4B9AD]' : 'text-ink-200'}`}>{task.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded" style={{ color: stCfg.color, background: stCfg.color + '15' }}>{stCfg.label}</span>
                            {task.dueDate && <span className="text-[10px] text-[#A09388]">{formatDate(task.dueDate, 'relative')}</span>}
                            {task.estimatedTime && (
                              <span className="text-[10px] text-[#A09388] flex items-center gap-0.5">
                                <Clock size={9} />{formatTime(task.estimatedTime)}
                              </span>
                            )}
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                    {filtered.length === 0 && (
                      <div className="text-center py-10">
                        <p className="text-[12px] text-[#C4B9AD]">{t.balinex.noTasks}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'meetings' && (
                <div className="space-y-2">
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-10">
                      <Calendar size={28} className="mx-auto text-[#D4C9B8] mb-2" />
                      <p className="text-[12px] text-[#C4B9AD]">{t.balinex.noEvents}</p>
                    </div>
                  ) : (
                    upcomingEvents.map(ev => (
                      <div key={ev.id} className="flex items-center gap-3 p-3.5 bg-white border border-[#E8E2D8] rounded-xl">
                        <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: ev.color }} />
                        <div className="flex-1">
                          <p className="text-[13px] font-medium text-ink-200">{ev.title}</p>
                          <p className="text-[11px] text-[#A09388]">{ev.date === today ? 'Today' : formatDate(ev.date)} · {ev.time} {ev.duration ? `· ${formatTime(ev.duration)}` : ''}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Today sidebar */}
            <div className="space-y-3">
              <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
                <h3 className="text-[12px] font-semibold text-ink-200 mb-3">Today's Schedule</h3>
                {todayEvents.length === 0 ? (
                  <p className="text-[11px] text-[#C4B9AD] py-4 text-center">No meetings today</p>
                ) : (
                  <div className="space-y-2">
                    {todayEvents.map(ev => (
                      <div key={ev.id} className="flex items-center gap-2">
                        <div className="w-0.5 h-8 rounded-full" style={{ background: ev.color }} />
                        <div>
                          <p className="text-[12px] font-medium text-ink-200">{ev.title}</p>
                          <p className="text-[10px] text-[#A09388]">{ev.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
                <h3 className="text-[12px] font-semibold text-ink-200 mb-3">Status Breakdown</h3>
                {['backlog', 'planned', 'in-progress', 'review', 'done'].map(s => {
                  const count = balinexTasks.filter(task => task.status === s).length
                  const stCfg = STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]
                  return (
                    <div key={s} className="flex items-center justify-between py-1">
                      <span className="text-[11px] text-[#6B6259]">{stCfg.label}</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded" style={{ color: stCfg.color, background: stCfg.color + '15' }}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
