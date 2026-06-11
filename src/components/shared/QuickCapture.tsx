'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Zap } from 'lucide-react'
import { useStore } from '@/lib/store'
import { useT, useDir } from '@/lib/i18n'
import { PRIORITY_CONFIG } from '@/lib/utils'
import type { Priority } from '@/lib/utils'

export function QuickCapture() {
  const { quickCaptureOpen, setQuickCaptureOpen, addTask } = useStore()
  const t = useT()
  useDir()

  const TYPES = [
    { key: 'task', label: t.capture.task },
    { key: 'note', label: t.capture.note },
    { key: 'idea', label: t.capture.idea },
    { key: 'content', label: t.capture.content },
    { key: 'migration', label: t.capture.migration },
  ]
  const TYPE_PRIORITY: Record<string, Priority> = {
    task: 'p3', note: 'p4', idea: 'p5', content: 'p5', migration: 'p1',
  }

  const [typeKey, setTypeKey] = useState('task')
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('p3')

  const open = () => {
    setQuickCaptureOpen(true)
    setPriority(TYPE_PRIORITY['task'])
  }

  const close = () => {
    setQuickCaptureOpen(false)
    setTitle('')
    setTypeKey('task')
  }

  const handleTypeChange = (key: string) => {
    setTypeKey(key)
    setPriority(TYPE_PRIORITY[key])
  }

  const submit = () => {
    if (!title.trim()) return
    addTask({
      title: title.trim(),
      priority,
      category: typeKey,
      status: 'backlog',
      tags: [typeKey],
      subtasks: [],
    })
    close()
  }

  const currentType = TYPES.find(tp => tp.key === typeKey)

  return (
    <>
      {/* FAB — bottom-start corner */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={open}
        className="fixed bottom-[110px] start-6 w-12 h-12 bg-ink-200 text-cream-200 rounded-full shadow-modal flex items-center justify-center z-40 hover:bg-ink-300 transition-colors"
      >
        <Plus size={20} />
      </motion.button>

      {/* Modal — appears above FAB */}
      <AnimatePresence>
        {quickCaptureOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              onClick={close}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              className="fixed bottom-[160px] start-6 w-[360px] bg-white border border-[#E4DDD3] rounded-2xl shadow-modal z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0EAE2]">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-ink-200" />
                  <span className="text-[13px] font-medium text-ink-200">{t.capture.title}</span>
                </div>
                <button onClick={close} className="text-[#A09388] hover:text-ink-200 transition-colors">
                  <X size={14} />
                </button>
              </div>

              {/* Type selector */}
              <div className="flex gap-1 px-4 pt-3">
                {TYPES.map(tp => (
                  <button
                    key={tp.key}
                    onClick={() => handleTypeChange(tp.key)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                      typeKey === tp.key ? 'bg-ink-200 text-cream-200' : 'bg-cream-200 text-[#6B6259] hover:bg-cream-300'
                    }`}
                  >
                    {tp.label}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="px-4 pt-3 pb-2">
                <input
                  autoFocus
                  type="text"
                  placeholder={`${currentType?.label}...`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') close() }}
                  className="w-full text-[13px] text-ink-200 placeholder:text-[#C4B9AD] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2.5 focus:outline-none focus:border-ink-200 transition-colors"
                />
              </div>

              {/* Priority */}
              <div className="flex items-center gap-1.5 px-4 pb-3">
                <span className="text-[11px] text-[#A09388]">{t.capture.priority}:</span>
                {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG[Priority]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setPriority(key)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                      priority === key ? 'ring-2 ring-offset-1 ring-current' : 'opacity-60 hover:opacity-90'
                    }`}
                    style={{ background: cfg.bg, color: cfg.text }}
                  >
                    {cfg.short}
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 pb-4 flex items-center justify-between">
                <span className="text-[11px] text-[#C4B9AD]">{t.capture.hint}</span>
                <button
                  onClick={submit}
                  disabled={!title.trim()}
                  className="px-3 py-1.5 bg-ink-200 text-cream-200 text-[12px] font-medium rounded-lg hover:bg-ink-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {t.capture.save}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
