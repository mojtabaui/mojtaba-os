'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { PRIORITY_CONFIG } from '@/lib/utils'
import type { Task } from '@/lib/store'
import { AppShell } from '@/components/layout/AppShell'
import { Grid3x3, CheckCircle2, Circle, X } from 'lucide-react'
import { useT } from '@/lib/i18n'

type Quadrant = 'do-first' | 'schedule' | 'delegate' | 'eliminate'

interface MatrixTask extends Task {
  quadrant: Quadrant
}

type QuadrantDef = { key: Quadrant; title: string; subtitle: string; urgent: boolean; important: boolean; color: string; bg: string; desc: string }

function classifyTask(task: Task): Quadrant {
  const priorityOrder = { p1: 0, p2: 1, p3: 2, p4: 3, p5: 4 }
  const isHighPriority = priorityOrder[task.priority] <= 1
  const _d = new Date(); const today = `${_d.getFullYear()}-${String(_d.getMonth()+1).padStart(2,'0')}-${String(_d.getDate()).padStart(2,'0')}`
  const _u = new Date(Date.now() + 3*86400000); const urgentCutoff = `${_u.getFullYear()}-${String(_u.getMonth()+1).padStart(2,'0')}-${String(_u.getDate()).padStart(2,'0')}`
  const isUrgent = task.dueDate ? task.dueDate <= urgentCutoff : false

  if (isUrgent && isHighPriority) return 'do-first'
  if (!isUrgent && isHighPriority) return 'schedule'
  if (isUrgent && !isHighPriority) return 'delegate'
  return 'eliminate'
}

function TaskChip({ task, onDone, onDelete, onMove, quadrants }: { task: MatrixTask; onDone: () => void; onDelete: () => void; onMove: (q: Quadrant) => void; quadrants: QuadrantDef[] }) {
  const [showMenu, setShowMenu] = useState(false)
  const cfg = PRIORITY_CONFIG[task.priority]

  return (
    <div className="relative group">
      <div className="flex items-center gap-2 px-2.5 py-2 bg-white border border-[#E8E2D8] rounded-xl hover:border-[#D4C9B8] hover:shadow-card transition-all cursor-pointer"
        onClick={() => setShowMenu(!showMenu)}>
        <button onClick={(e) => { e.stopPropagation(); onDone() }} className="text-[#D4C9B8] hover:text-[#22C55E] flex-shrink-0 transition-colors">
          {task.status === 'done' ? <CheckCircle2 size={13} className="text-[#22C55E]" /> : <Circle size={13} />}
        </button>
        <span className={`text-[11px] flex-1 min-w-0 truncate ${task.status === 'done' ? 'line-through text-[#C4B9AD]' : 'text-ink-200'}`}>{task.title}</span>
        <span className="text-[9px] font-bold px-1 rounded flex-shrink-0" style={{ background: cfg.bg, color: cfg.text }}>{cfg.short}</span>
        <button onClick={(e) => { e.stopPropagation(); onDelete() }} className="opacity-0 group-hover:opacity-100 text-[#D4C9B8] hover:text-[#EF4444] transition-all flex-shrink-0">
          <X size={10} />
        </button>
      </div>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full left-0 mt-1 bg-white border border-[#E4DDD3] rounded-xl shadow-modal z-20 py-1 min-w-[160px]"
            onMouseLeave={() => setShowMenu(false)}
          >
            <p className="text-[10px] text-[#C4B9AD] px-3 py-1 uppercase tracking-wider">Move to</p>
            {quadrants.filter(q => q.key !== task.quadrant).map(q => (
              <button key={q.key} onClick={() => { onMove(q.key); setShowMenu(false) }}
                className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-cream-100 transition-colors flex items-center gap-2"
                style={{ color: q.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: q.color }} />
                {q.title}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function MatrixPage() {
  const t = useT()
  const { tasks, moveTask, deleteTask } = useStore()
  const [overrides, setOverrides] = useState<Record<string, Quadrant>>({})

  const QUADRANTS: QuadrantDef[] = [
    {
      key: 'do-first', title: t.matrix.doFirst, subtitle: t.matrix.urgentImportant,
      urgent: true, important: true,
      color: '#EF4444', bg: '#FEF2F2',
      desc: t.matrix.crises
    },
    {
      key: 'schedule', title: t.matrix.schedule, subtitle: t.matrix.importantNotUrgent,
      urgent: false, important: true,
      color: '#3B82F6', bg: '#EFF6FF',
      desc: t.matrix.growth
    },
    {
      key: 'delegate', title: t.matrix.delegate, subtitle: t.matrix.urgentNotImportant,
      urgent: true, important: false,
      color: '#F97316', bg: '#FFF7ED',
      desc: t.matrix.interruptions
    },
    {
      key: 'eliminate', title: t.matrix.eliminate, subtitle: t.matrix.notUrgentNotImportant,
      urgent: false, important: false,
      color: '#A09388', bg: '#F8F5EF',
      desc: t.matrix.timeWasters
    },
  ]

  const classifiedTasks: MatrixTask[] = tasks
    .filter(task => task.status !== 'done' && task.status !== 'cancelled')
    .map(task => ({
      ...task,
      quadrant: overrides[task.id] || classifyTask(task),
    }))

  const getQuadrantTasks = (q: Quadrant) => classifiedTasks.filter(task => task.quadrant === q)

  const handleMove = (taskId: string, quadrant: Quadrant) => {
    setOverrides(prev => ({ ...prev, [taskId]: quadrant }))
  }

  return (
    <AppShell>
      <div className="min-h-full">
        <div className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur-sm border-b border-[#E4DDD3] px-6 py-4">
          <div className="flex items-center gap-2">
            <Grid3x3 size={16} className="text-[#6B6259]" />
            <div>
              <h1 className="text-lg font-semibold text-ink-200">{t.matrix.title}</h1>
              <p className="text-[12px] text-[#A09388]">Prioritize by urgency × importance — auto-classified from your tasks</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Axis labels */}
          <div className="relative mb-2">
            <div className="flex justify-center">
              <div className="flex items-center gap-1 text-[11px] text-[#A09388]">
                <span className="w-16 h-px bg-[#D4C9B8]" />
                <span>NOT URGENT</span>
                <span className="w-16 h-px bg-[#D4C9B8]" />
                <span className="mx-4 font-semibold text-ink-200">← URGENCY →</span>
                <span className="w-16 h-px bg-[#D4C9B8]" />
                <span>URGENT</span>
                <span className="w-16 h-px bg-[#D4C9B8]" />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Importance label */}
            <div className="flex-shrink-0 flex items-center">
              <div className="flex flex-col items-center gap-1 text-[10px] text-[#A09388]" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                <span>NOT IMPORTANT</span>
                <span className="my-2 h-16 w-px bg-[#D4C9B8]" />
                <span className="font-semibold text-ink-200">↑ IMPORTANCE ↑</span>
                <span className="my-2 h-16 w-px bg-[#D4C9B8]" />
                <span>IMPORTANT</span>
              </div>
            </div>

            {/* Matrix grid — important on top, urgent on right */}
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3">
              {[
                /* Row 1: Important */
                QUADRANTS.find(q => q.key === 'schedule')!,   /* Not Urgent + Important */
                QUADRANTS.find(q => q.key === 'do-first')!,   /* Urgent + Important */
                /* Row 2: Not Important */
                QUADRANTS.find(q => q.key === 'eliminate')!,  /* Not Urgent + Not Important */
                QUADRANTS.find(q => q.key === 'delegate')!,   /* Urgent + Not Important */
              ].map(q => {
                const qTasks = getQuadrantTasks(q.key)
                return (
                  <div key={q.key} className="bg-white border border-[#E8E2D8] rounded-2xl p-4 min-h-[220px] flex flex-col"
                    style={{ borderTop: `3px solid ${q.color}` }}>
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[13px] font-bold" style={{ color: q.color }}>{q.title}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: q.bg, color: q.color }}>
                          {qTasks.length}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#A09388] mt-0.5">{q.subtitle}</p>
                      <p className="text-[10px] text-[#C4B9AD] mt-0.5 italic">{q.desc}</p>
                    </div>
                    <div className="flex-1 space-y-1.5 overflow-y-auto">
                      <AnimatePresence>
                        {qTasks.map(task => (
                          <motion.div key={task.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <TaskChip
                              task={task}
                              quadrants={QUADRANTS}
                              onDone={() => moveTask(task.id, task.status === 'done' ? 'planned' : 'done')}
                              onDelete={() => deleteTask(task.id)}
                              onMove={(newQ) => handleMove(task.id, newQ)}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {qTasks.length === 0 && (
                        <p className="text-[11px] text-[#D4C9B8] py-4 text-center">{t.matrix.noTasks}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <p className="text-[11px] text-[#C4B9AD] text-center mt-4">
            Tasks auto-classified by priority (P1-P2 = Important) and due date (≤3 days = Urgent). Click a task to manually move it.
          </p>
        </div>
      </div>
    </AppShell>
  )
}
