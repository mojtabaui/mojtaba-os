'use client'
import { useStore } from '@/lib/store'
import { useT } from '@/lib/i18n'
import { getTodayBoth, getLocalToday } from '@/lib/jalali'
import { Search, Plus, Menu } from 'lucide-react'
import { motion } from 'framer-motion'

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { setCommandPaletteOpen, setQuickCaptureOpen, tasks, language } = useStore()
  const t = useT()
  const { jalaliShort, gregorian } = getTodayBoth()
  const today = getLocalToday()
  const isRtl = language === 'fa'

  const todayCount = tasks.filter(t => t.dueDate === today && t.status !== 'done' && t.status !== 'cancelled').length
  const p1Count = tasks.filter(t => t.priority === 'p1' && t.status !== 'done' && t.status !== 'cancelled').length
  const dateDisplay = isRtl ? jalaliShort : gregorian

  return (
    <div className="h-12 flex items-center justify-between px-5 border-b border-[#E8E2D8] bg-cream-50/80 backdrop-blur-sm sticky top-0 z-10 flex-shrink-0">
      <div className="flex items-center gap-2">
        <button onClick={onMenuClick} className="md:hidden p-1.5 text-[#A09388] hover:text-ink-200 transition-colors">
          <Menu size={18} />
        </button>
        {p1Count > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#EF4444]"
          >
            🚨 {p1Count} {t.topbar.p1Pending}
          </motion.span>
        )}
        {todayCount > 0 && (
          <span className="text-[11px] text-[#A09388]">
            {todayCount} {t.topbar.dueToday}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-[#C4B9AD] hidden lg:block">{dateDisplay}</span>

        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-[#A09388] bg-white border border-[#E4DDD3] hover:border-[#D4C9B8] transition-all"
        >
          <Search size={11} />
          <span className="hidden md:inline">{t.topbar.search}</span>
          <kbd className="hidden md:inline text-[9px] bg-cream-200 rounded px-1">⌘K</kbd>
        </button>

        <button
          onClick={() => setQuickCaptureOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] bg-ink-200 text-cream-200 hover:bg-ink-300 transition-all"
        >
          <Plus size={11} />
          <span className="hidden md:inline">{t.topbar.new}</span>
          <kbd className="hidden md:inline text-[9px] bg-[#2A2A2A] text-[#8A8078] rounded px-1">N</kbd>
        </button>
      </div>
    </div>
  )
}
