'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { useT } from '@/lib/i18n'
import { PRIORITY_CONFIG, STATUS_CONFIG, formatDate, formatTime } from '@/lib/utils'
import type { Priority, TaskStatus } from '@/lib/utils'
import type { Task } from '@/lib/store'
import { CheckCircle2, Circle, Clock, Plus, X, LayoutGrid, List } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { TaskDrawer } from '@/components/shared/TaskDrawer'

const STATUSES: TaskStatus[] = ['backlog', 'planned', 'in-progress', 'review', 'done']
const PRIORITIES: Priority[] = ['p1', 'p2', 'p3', 'p4', 'p5']

function TaskCard({ task, onMove, onDelete, onOpen }: { task: Task; onMove: (s: TaskStatus) => void; onDelete: () => void; onOpen: () => void }) {
  const expanded = false
  const { updateTask } = useStore()
  const cfg = PRIORITY_CONFIG[task.priority]
  const doneCount = task.subtasks.filter(s => s.done).length

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-white border border-[#E8E2D8] rounded-xl p-3.5 hover:border-[#D4C9B8] hover:shadow-card transition-all cursor-pointer group"
      onClick={onOpen}
    >
      <div className="flex items-start gap-2.5">
        <button
          onClick={(e) => { e.stopPropagation(); onMove(task.status === 'done' ? 'planned' : 'done') }}
          className="mt-0.5 flex-shrink-0 text-[#D4C9B8] hover:text-[#22C55E] transition-colors"
        >
          {task.status === 'done' ? <CheckCircle2 size={15} className="text-[#22C55E]" /> : <Circle size={15} />}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-medium leading-snug ${task.status === 'done' ? 'line-through text-[#C4B9AD]' : 'text-ink-200'}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.text }}>
              {cfg.short} {cfg.label}
            </span>
            {task.dueDate && (
              <span className="text-[10px] text-[#A09388]">{formatDate(task.dueDate, 'relative')}</span>
            )}
            {task.estimatedTime && (
              <span className="text-[10px] text-[#A09388] flex items-center gap-0.5">
                <Clock size={9} />{formatTime(task.estimatedTime)}
              </span>
            )}
            {task.subtasks.length > 0 && (
              <span className="text-[10px] text-[#A09388]">{doneCount}/{task.subtasks.length} subtasks</span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          className="opacity-0 group-hover:opacity-100 text-[#D4C9B8] hover:text-[#EF4444] transition-all flex-shrink-0"
        >
          <X size={12} />
        </button>
      </div>

      {/* Subtasks progress bar */}
      {task.subtasks.length > 0 && (
        <div className="mt-2 ml-6">
          <div className="h-1 bg-cream-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#22C55E] rounded-full transition-all" style={{ width: `${(doneCount / task.subtasks.length) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Expanded subtasks */}
      <AnimatePresence>
        {expanded && task.subtasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 ml-6 space-y-1.5"
          >
            {task.subtasks.map(st => (
              <label key={st.id} className="flex items-center gap-2 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={st.done}
                  onChange={() => {
                    const updated = task.subtasks.map(s => s.id === st.id ? { ...s, done: !s.done } : s)
                    updateTask(task.id, { subtasks: updated })
                  }}
                  className="w-3 h-3 rounded accent-ink-200"
                />
                <span className={`text-[11px] ${st.done ? 'line-through text-[#C4B9AD]' : 'text-[#6B6259]'}`}>{st.title}</span>
              </label>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function AddTaskForm({ status, onClose }: { status: TaskStatus; onClose: () => void }) {
  const { addTask } = useStore()
  const t = useT()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('p3')

  const submit = () => {
    if (!title.trim()) return
    addTask({ title: title.trim(), priority, category: 'general', status, tags: [], subtasks: [] })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-white border border-[#D4C9B8] rounded-xl p-3 shadow-card"
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onClose() }}
        placeholder={t.tasks.placeholder}
        className="w-full text-[13px] text-ink-200 placeholder:text-[#C4B9AD] bg-transparent focus:outline-none mb-2"
      />
      <div className="flex items-center gap-1">
        {PRIORITIES.map(p => {
          const cfg = PRIORITY_CONFIG[p]
          return (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${priority === p ? 'ring-2 ring-offset-1' : 'opacity-50 hover:opacity-80'}`}
              style={{ background: cfg.bg, color: cfg.text }}
            >
              {cfg.short}
            </button>
          )
        })}
        <div className="flex-1" />
        <button onClick={onClose} className="text-[11px] text-[#A09388] hover:text-ink-200">{t.tasks.cancel}</button>
        <button onClick={submit} className="text-[11px] bg-ink-200 text-cream-200 px-2.5 py-1 rounded-lg ms-1">{t.common.add}</button>
      </div>
    </motion.div>
  )
}

function KanbanColumn({ status, tasks: columnTasks, onMove, onDelete, onOpen }: {
  status: TaskStatus
  tasks: Task[]
  onMove: (id: string, s: TaskStatus) => void
  onDelete: (id: string) => void
  onOpen: (id: string) => void
}) {
  const t = useT()
  const [adding, setAdding] = useState(false)
  const cfg = STATUS_CONFIG[status]

  return (
    <div className="flex flex-col min-w-[260px] max-w-[300px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
          <span className="text-[12px] font-semibold text-ink-200">{cfg.label}</span>
          <span className="text-[10px] text-[#A09388] bg-cream-200 rounded-full px-1.5 py-0.5">{columnTasks.length}</span>
        </div>
        <button onClick={() => setAdding(true)} className="text-[#C4B9AD] hover:text-ink-200 transition-colors">
          <Plus size={14} />
        </button>
      </div>

      <div className="flex-1 space-y-2 min-h-[100px]">
        <AnimatePresence>
          {adding && <AddTaskForm key="add-form" status={status} onClose={() => setAdding(false)} />}
          {columnTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onMove={(s) => onMove(task.id, s)}
              onDelete={() => onDelete(task.id)}
              onOpen={() => onOpen(task.id)}
            />
          ))}
        </AnimatePresence>
        {columnTasks.length === 0 && !adding && (
          <button
            onClick={() => setAdding(true)}
            className="w-full text-[12px] text-[#C4B9AD] border border-dashed border-[#E4DDD3] rounded-xl py-4 hover:border-[#C4B9AD] hover:text-[#A09388] transition-all"
          >
            {t.tasks.addHere}
          </button>
        )}
      </div>
    </div>
  )
}

export default function TasksPage() {
  const { tasks, moveTask, deleteTask } = useStore()
  const t = useT()
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all')
  const [openTaskId, setOpenTaskId] = useState<string | null>(null)

  const filtered = filterPriority === 'all' ? tasks : tasks.filter(task => task.priority === filterPriority)

  return (
    <AppShell>
      <div className="min-h-full">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur-sm border-b border-[#E4DDD3] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-ink-200">{t.tasks.title}</h1>
              <p className="text-[12px] text-[#A09388]">{tasks.filter(task => task.status !== 'done' && task.status !== 'cancelled').length} {t.tasks.active} · {tasks.filter(task => task.status === 'done').length} {t.tasks.done}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Priority filter */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFilterPriority('all')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${filterPriority === 'all' ? 'bg-ink-200 text-cream-200' : 'text-[#A09388] hover:bg-cream-300'}`}
                >
                  {t.common.all}
                </button>
                {PRIORITIES.map(p => {
                  const cfg = PRIORITY_CONFIG[p]
                  return (
                    <button
                      key={p}
                      onClick={() => setFilterPriority(p)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${filterPriority === p ? 'ring-2' : 'opacity-60 hover:opacity-90'}`}
                      style={{ background: cfg.bg, color: cfg.text }}
                    >
                      {cfg.short}
                    </button>
                  )
                })}
              </div>

              {/* View toggle */}
              <div className="flex bg-white border border-[#E4DDD3] rounded-lg p-0.5">
                <button onClick={() => setView('kanban')} className={`p-1.5 rounded ${view === 'kanban' ? 'bg-ink-200 text-cream-200' : 'text-[#A09388]'}`}>
                  <LayoutGrid size={13} />
                </button>
                <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-ink-200 text-cream-200' : 'text-[#A09388]'}`}>
                  <List size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban */}
        {view === 'kanban' && (
          <div className="p-6 overflow-x-auto">
            <div className="flex gap-4 min-w-max">
              {STATUSES.map(status => (
                <KanbanColumn
                  key={status}
                  status={status}
                  tasks={filtered.filter(t => t.status === status)}
                  onMove={moveTask}
                  onDelete={deleteTask}
                  onOpen={setOpenTaskId}
                />
              ))}
            </div>
          </div>
        )}

        {/* List */}
        {view === 'list' && (
          <div className="p-6 max-w-3xl xl:max-w-[1200px] 2xl:max-w-[1600px] 3xl:max-w-[2200px]">
            <div className="space-y-1.5">
              <AnimatePresence>
                {filtered.map(task => {
                  const cfg = PRIORITY_CONFIG[task.priority]
                  const stCfg = STATUS_CONFIG[task.status]
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      onClick={() => setOpenTaskId(task.id)}
                      className="flex items-center gap-3 px-4 py-2.5 bg-white border border-[#E8E2D8] rounded-xl hover:border-[#D4C9B8] transition-all group cursor-pointer"
                    >
                      <button onClick={() => moveTask(task.id, task.status === 'done' ? 'planned' : 'done')} className="text-[#D4C9B8] hover:text-[#22C55E] flex-shrink-0">
                        {task.status === 'done' ? <CheckCircle2 size={15} className="text-[#22C55E]" /> : <Circle size={15} />}
                      </button>
                      <span className={`text-[13px] flex-1 ${task.status === 'done' ? 'line-through text-[#C4B9AD]' : 'text-ink-200'}`}>{task.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: cfg.bg, color: cfg.text }}>{cfg.short} {cfg.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded" style={{ color: stCfg.color }}>{stCfg.label}</span>
                      {task.dueDate && <span className="text-[10px] text-[#A09388]">{formatDate(task.dueDate, 'relative')}</span>}
                      <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-[#D4C9B8] hover:text-[#EF4444] transition-all">
                        <X size={12} />
                      </button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {openTaskId && (
          <TaskDrawer taskId={openTaskId} onClose={() => setOpenTaskId(null)} />
        )}
      </AnimatePresence>
    </AppShell>
  )
}
