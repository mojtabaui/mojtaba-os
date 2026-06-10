'use client'
import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import {
  LayoutDashboard, Calendar, CheckSquare, Target, Plane,
  BookOpen, Briefcase, GraduationCap, Rss, User, BarChart2, Settings
} from 'lucide-react'
import { PRIORITY_CONFIG } from '@/lib/utils'
import { Command } from 'cmdk'

const PAGES = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Pages' },
  { href: '/calendar', label: 'Calendar', icon: Calendar, group: 'Pages' },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare, group: 'Pages' },
  { href: '/goals', label: 'Goals', icon: Target, group: 'Pages' },
  { href: '/migration', label: 'Migration', icon: Plane, group: 'Workspaces' },
  { href: '/ielts', label: 'IELTS', icon: BookOpen, group: 'Workspaces' },
  { href: '/balinex', label: 'Balinex', icon: Briefcase, group: 'Workspaces' },
  { href: '/academy', label: 'Academy', icon: GraduationCap, group: 'Workspaces' },
  { href: '/content', label: 'Content', icon: Rss, group: 'Workspaces' },
  { href: '/personal', label: 'Personal', icon: User, group: 'Workspaces' },
  { href: '/analytics', label: 'Analytics', icon: BarChart2, group: 'Pages' },
  { href: '/settings', label: 'Settings', icon: Settings, group: 'Pages' },
]

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, tasks, setQuickCaptureOpen } = useStore()
  const router = useRouter()

  const close = useCallback(() => setCommandPaletteOpen(false), [setCommandPaletteOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [close])

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[560px] max-h-[400px] bg-white border border-[#E4DDD3] rounded-2xl shadow-modal z-[61] overflow-hidden"
          >
            <Command className="w-full">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#F0EAE2]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#A09388]">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <Command.Input
                  placeholder="Search pages, tasks, workspaces..."
                  className="flex-1 text-[13px] text-ink-200 placeholder:text-[#C4B9AD] bg-transparent focus:outline-none"
                  autoFocus
                />
                <span className="text-[11px] text-[#C4B9AD] bg-cream-200 rounded px-1.5 py-0.5">Esc</span>
              </div>

              <Command.List className="overflow-y-auto max-h-[320px] p-2">
                <Command.Empty className="py-8 text-center text-[13px] text-[#A09388]">
                  No results found
                </Command.Empty>

                {/* Quick Actions */}
                <Command.Group heading="" className="">
                  <div className="px-2 py-1">
                    <p className="text-[10px] text-[#C4B9AD] uppercase tracking-wider font-medium mb-1">Quick Actions</p>
                  </div>
                  <Command.Item
                    onSelect={() => { setQuickCaptureOpen(true); close() }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#6B6259] hover:bg-cream-200 hover:text-ink-200 cursor-pointer transition-colors"
                  >
                    <span className="text-[16px]">+</span>
                    <span>New Task</span>
                    <span className="ml-auto text-[11px] text-[#C4B9AD]">Quick Add</span>
                  </Command.Item>
                </Command.Group>

                {/* Pages */}
                <div className="px-2 py-1 mt-1">
                  <p className="text-[10px] text-[#C4B9AD] uppercase tracking-wider font-medium mb-1">Navigation</p>
                </div>
                {PAGES.map(page => (
                  <Command.Item
                    key={page.href}
                    value={page.label}
                    onSelect={() => { router.push(page.href); close() }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#6B6259] hover:bg-cream-200 hover:text-ink-200 cursor-pointer transition-colors"
                  >
                    <page.icon size={14} />
                    <span>{page.label}</span>
                    <span className="ml-auto text-[11px] text-[#C4B9AD]">{page.group}</span>
                  </Command.Item>
                ))}

                {/* Tasks */}
                {tasks.slice(0, 5).map(task => {
                  const p = PRIORITY_CONFIG[task.priority]
                  return (
                    <Command.Item
                      key={task.id}
                      value={task.title}
                      onSelect={() => { router.push('/tasks'); close() }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[#6B6259] hover:bg-cream-200 hover:text-ink-200 cursor-pointer transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                      <span className="truncate">{task.title}</span>
                      <span className="ml-auto text-[11px] px-1.5 py-0.5 rounded" style={{ background: p.bg, color: p.text }}>{p.short}</span>
                    </Command.Item>
                  )
                })}
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
