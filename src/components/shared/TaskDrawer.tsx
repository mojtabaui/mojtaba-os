'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { useT, useDir } from '@/lib/i18n'
import { PRIORITY_CONFIG, STATUS_CONFIG, formatDate, formatTime } from '@/lib/utils'
import type { Priority, TaskStatus } from '@/lib/utils'
import type { Task } from '@/lib/store'
import { X, Clock, Calendar, Tag, CheckSquare, Plus, Trash2, Circle, CheckCircle2 } from 'lucide-react'

interface TaskDrawerProps {
  taskId: string | null
  onClose: () => void
}

export function TaskDrawer({ taskId, onClose }: TaskDrawerProps) {
  const { tasks, updateTask, deleteTask } = useStore()
  const t = useT()
  const dir = useDir()
  const isRtl = dir === 'rtl'
  const task = tasks.find(t => t.id === taskId)

  const [form, setForm] = useState<Partial<Task>>({})
  const [newSubtask, setNewSubtask] = useState('')

  useEffect(() => {
    if (task) setForm({ ...task })
  }, [taskId, task])

  if (!task) return null

  const stCfg = STATUS_CONFIG[form.status || task.status]

  const save = (updates: Partial<Task>) => {
    updateTask(task.id, updates)
    setForm(f => ({ ...f, ...updates }))
  }

  const addSubtask = () => {
    if (!newSubtask.trim()) return
    const updated = [...(form.subtasks || []), { id: Date.now().toString(), title: newSubtask.trim(), done: false }]
    save({ subtasks: updated })
    setNewSubtask('')
  }

  const toggleSubtask = (id: string) => {
    const updated = (form.subtasks || []).map(s => s.id === id ? { ...s, done: !s.done } : s)
    save({ subtasks: updated })
  }

  const removeSubtask = (id: string) => {
    const updated = (form.subtasks || []).filter(s => s.id !== id)
    save({ subtasks: updated })
  }

  const doneCount = (form.subtasks || []).filter(s => s.done).length
  const totalSub = (form.subtasks || []).length

  // In RTL the drawer comes from the left side; in LTR from the right
  const drawerSide = isRtl
    ? { initial: { x: '-100%', opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: '-100%', opacity: 0 } }
    : { initial: { x: '100%', opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: '100%', opacity: 0 } }
  const sideClass = isRtl
    ? 'fixed left-0 top-0 h-full w-[420px] bg-white border-r border-[#E4DDD3] z-50 flex flex-col shadow-modal'
    : 'fixed right-0 top-0 h-full w-[420px] bg-white border-l border-[#E4DDD3] z-50 flex flex-col shadow-modal'

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/10 z-40"
        onClick={onClose}
      />

      <motion.div
        {...drawerSide}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className={sideClass}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EAE2]">
          <div className="flex items-center gap-2">
            <button onClick={() => save({ status: form.status === 'done' ? 'planned' : 'done' })}
              className="text-[#D4C9B8] hover:text-[#22C55E] transition-colors">
              {form.status === 'done' ? <CheckCircle2 size={16} className="text-[#22C55E]" /> : <Circle size={16} />}
            </button>
            <span className="text-[12px] font-medium" style={{ color: stCfg.color }}>{stCfg.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { deleteTask(task.id); onClose() }}
              className="p-1.5 rounded-lg text-[#D4C9B8] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-all">
              <Trash2 size={13} />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-[#A09388] hover:text-ink-200 hover:bg-cream-100 transition-all">
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Title */}
          <textarea
            value={form.title || ''}
            onChange={e => save({ title: e.target.value })}
            rows={2}
            className="w-full text-[15px] font-semibold text-ink-200 bg-transparent focus:outline-none resize-none leading-snug"
          />

          {/* Description */}
          <div>
            <label className="text-[10px] text-[#C4B9AD] uppercase tracking-wider font-medium block mb-1">{t.drawer.description}</label>
            <textarea
              value={form.description || ''}
              onChange={e => save({ description: e.target.value })}
              rows={3}
              placeholder={t.drawer.descPlaceholder}
              className="w-full text-[12px] text-[#6B6259] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 transition-colors resize-none placeholder:text-[#D4C9B8]"
            />
          </div>

          {/* Priority + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#C4B9AD] uppercase tracking-wider font-medium block mb-1.5">{t.drawer.priority}</label>
              <div className="flex flex-col gap-1">
                {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG[Priority]][]).map(([key, pcfg]) => (
                  <button key={key} onClick={() => save({ priority: key })}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${form.priority === key ? 'ring-2 ring-offset-1' : 'opacity-50 hover:opacity-80'}`}
                    style={{ background: pcfg.bg, color: pcfg.text }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: pcfg.color }} />
                    {pcfg.short} {pcfg.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] text-[#C4B9AD] uppercase tracking-wider font-medium block mb-1.5">{t.drawer.status}</label>
              <div className="flex flex-col gap-1">
                {(Object.entries(STATUS_CONFIG) as [TaskStatus, typeof STATUS_CONFIG[TaskStatus]][]).map(([key, scfg]) => (
                  <button key={key} onClick={() => save({ status: key })}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${form.status === key ? 'ring-1' : 'opacity-50 hover:opacity-80'}`}
                    style={{ background: scfg.color + '10', color: scfg.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: scfg.color }} />
                    {scfg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Due Date + Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#C4B9AD] uppercase tracking-wider font-medium flex items-center gap-1 mb-1.5">
                <Calendar size={10} /> {t.drawer.dueDate}
              </label>
              <input type="date" value={form.dueDate || ''}
                onChange={e => save({ dueDate: e.target.value })}
                className="w-full text-[12px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200" />
            </div>
            <div>
              <label className="text-[10px] text-[#C4B9AD] uppercase tracking-wider font-medium flex items-center gap-1 mb-1.5">
                <Clock size={10} /> {t.drawer.estTime}
              </label>
              <div className="relative">
                <input type="number" value={form.estimatedTime || ''}
                  onChange={e => save({ estimatedTime: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full text-[12px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200 pe-8 placeholder:text-[#D4C9B8]" />
                <span className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#C4B9AD]">{t.drawer.minutes}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-[10px] text-[#C4B9AD] uppercase tracking-wider font-medium flex items-center gap-1 mb-1.5">
              <Tag size={10} /> {t.drawer.tags}
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(form.tags || []).map(tag => (
                <button key={tag} onClick={() => save({ tags: (form.tags || []).filter(t => t !== tag) })}
                  className="flex items-center gap-1 px-2 py-0.5 bg-cream-200 text-[#6B6259] rounded-full text-[10px] hover:bg-cream-300 transition-colors">
                  #{tag} <X size={9} />
                </button>
              ))}
            </div>
            <input
              placeholder={t.drawer.tagPlaceholder}
              className="w-full text-[12px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200 placeholder:text-[#D4C9B8]"
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                  const tag = (e.target as HTMLInputElement).value.trim().replace(/\s+/g, '-').toLowerCase()
                  if (!(form.tags || []).includes(tag)) save({ tags: [...(form.tags || []), tag] });
                  (e.target as HTMLInputElement).value = ''
                }
              }}
            />
          </div>

          {/* Subtasks */}
          <div>
            <label className="text-[10px] text-[#C4B9AD] uppercase tracking-wider font-medium flex items-center gap-1 mb-1.5">
              <CheckSquare size={10} /> {t.drawer.subtasks}
              {totalSub > 0 && <span className="ms-1 text-[#A09388]">{doneCount}/{totalSub}</span>}
            </label>

            {totalSub > 0 && (
              <div className="mb-2">
                <div className="h-1 bg-cream-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#22C55E] rounded-full transition-all" style={{ width: `${(doneCount / totalSub) * 100}%` }} />
                </div>
              </div>
            )}

            <div className="space-y-1.5 mb-2">
              {(form.subtasks || []).map(st => (
                <div key={st.id} className="flex items-center gap-2 group">
                  <button onClick={() => toggleSubtask(st.id)} className="text-[#D4C9B8] hover:text-[#22C55E] flex-shrink-0 transition-colors">
                    {st.done ? <CheckCircle2 size={13} className="text-[#22C55E]" /> : <Circle size={13} />}
                  </button>
                  <span className={`text-[12px] flex-1 ${st.done ? 'line-through text-[#C4B9AD]' : 'text-[#6B6259]'}`}>{st.title}</span>
                  <button onClick={() => removeSubtask(st.id)} className="opacity-0 group-hover:opacity-100 text-[#D4C9B8] hover:text-[#EF4444] transition-all">
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={newSubtask}
                onChange={e => setNewSubtask(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addSubtask() }}
                placeholder={t.drawer.subtaskPlaceholder}
                className="flex-1 text-[12px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200 placeholder:text-[#D4C9B8]"
              />
              <button onClick={addSubtask} className="px-3 py-2 bg-cream-200 text-[#6B6259] rounded-xl hover:bg-cream-300 transition-colors">
                <Plus size={12} />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[10px] text-[#C4B9AD] uppercase tracking-wider font-medium block mb-1.5">{t.drawer.notes}</label>
            <textarea
              value={form.notes || ''}
              onChange={e => save({ notes: e.target.value })}
              rows={4}
              placeholder={t.drawer.notesPlaceholder}
              className="w-full text-[12px] text-[#6B6259] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 transition-colors resize-none placeholder:text-[#D4C9B8]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#F0EAE2] flex items-center justify-between">
          <p className="text-[10px] text-[#C4B9AD]">
            {t.drawer.created} {form.createdAt ? formatDate(form.createdAt, 'short') : '—'} · {t.drawer.autoSaved}
          </p>
          {form.estimatedTime ? (
            <span className="text-[10px] text-[#A09388] flex items-center gap-1">
              <Clock size={9} /> {formatTime(form.estimatedTime)}
            </span>
          ) : null}
        </div>
      </motion.div>
    </>
  )
}
