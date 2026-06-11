'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Calendar, CheckSquare, Target, Plane,
  BookOpen, Briefcase, GraduationCap, Rss, User, BarChart2,
  Settings, ChevronLeft, Search, LogOut,
  CalendarDays, Clock, Grid3x3, Trophy
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { useT } from '@/lib/i18n'
import { PRIORITY_CONFIG } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface NavItemProps {
  href: string
  label: string
  icon: React.ElementType
  priority?: keyof typeof PRIORITY_CONFIG
  collapsed: boolean
  active: boolean
  isRtl: boolean
}

function NavItem({ href, label, icon: Icon, priority, collapsed, active, isRtl }: NavItemProps) {
  const dotColor = priority ? PRIORITY_CONFIG[priority].color : null

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ x: collapsed ? 0 : (isRtl ? -2 : 2) }}
        transition={{ duration: 0.15 }}
        className={cn(
          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors duration-150 cursor-pointer select-none',
          collapsed ? 'justify-center px-2' : '',
          active
            ? 'bg-cream-200 text-ink-200 font-medium'
            : 'text-[#8A8078] hover:text-[#C8C3BE] hover:bg-[#141414]'
        )}
        title={collapsed ? label : undefined}
      >
        <div className="relative flex-shrink-0">
          <Icon size={15} strokeWidth={active ? 2 : 1.75} />
          {dotColor && !collapsed && (
            <span className="absolute -top-0.5 -end-0.5 w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
          )}
        </div>
        {!collapsed && <span className="truncate">{label}</span>}
        {dotColor && collapsed && (
          <span className="absolute end-1.5 top-1.5 w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
        )}
      </motion.div>
    </Link>
  )
}

export function Sidebar({ mobileOpen = false, onMobileClose }: { mobileOpen?: boolean; onMobileClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarCollapsed, toggleSidebar, setCommandPaletteOpen, tasks, language, setLanguage } = useStore()
  const t = useT()
  const isRtl = language === 'fa'

  const NAV_MAIN = [
    { href: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { href: '/executive', label: t.nav.executive, icon: Trophy },
    { href: '/calendar', label: t.nav.calendar, icon: Calendar },
    { href: '/tasks', label: t.nav.tasks, icon: CheckSquare },
    { href: '/goals', label: t.nav.goals, icon: Target },
    { href: '/weekly', label: t.nav.weekly, icon: CalendarDays },
    { href: '/matrix', label: t.nav.matrix, icon: Grid3x3 },
    { href: '/budget', label: t.nav.budget, icon: Clock },
  ]

  const NAV_WORKSPACES = [
    { href: '/migration', label: t.nav.migration, icon: Plane, priority: 'p1' as const },
    { href: '/ielts', label: t.nav.ielts, icon: BookOpen, priority: 'p2' as const },
    { href: '/balinex', label: t.nav.balinex, icon: Briefcase, priority: 'p3' as const },
    { href: '/academy', label: t.nav.academy, icon: GraduationCap, priority: 'p4' as const },
    { href: '/content', label: t.nav.content, icon: Rss, priority: 'p5' as const },
    { href: '/personal', label: t.nav.personal, icon: User },
  ]

  const NAV_BOTTOM = [
    { href: '/analytics', label: t.nav.analytics, icon: BarChart2 },
    { href: '/settings', label: t.nav.settings, icon: Settings },
  ]

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }
  const c = sidebarCollapsed

  const _ld = new Date()
  const localToday = `${_ld.getFullYear()}-${String(_ld.getMonth()+1).padStart(2,'0')}-${String(_ld.getDate()).padStart(2,'0')}`
  const todayTasks = tasks.filter(t =>
    t.dueDate === localToday &&
    t.status !== 'done' && t.status !== 'cancelled'
  ).length

  const sidebarContent = (
    <motion.aside
      initial={false}
      animate={{ width: c ? 60 : 220 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="flex-shrink-0 bg-[#0A0A0A] border-e border-[#1E1E1E] flex flex-col h-full overflow-hidden relative z-10"
    >
      {/* Logo */}
      <div className={cn('flex items-center border-b border-[#1E1E1E] h-14 px-4', c ? 'justify-center' : 'justify-between')}>
        {!c && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <span className="text-[#F2EDE4] font-semibold text-[13px] tracking-[0.04em]">Mojtaba OS</span>
          </motion.div>
        )}
        <button
          onClick={toggleSidebar}
          className="w-6 h-6 rounded-md flex items-center justify-center text-[#5A5550] hover:text-[#C8C3BE] hover:bg-[#1E1E1E] transition-colors"
        >
          <span className={isRtl ? (c ? '' : 'rotate-180') : (c ? 'rotate-180' : '')} style={{ display: 'inline-flex', transition: 'transform 0.2s' }}>
            <ChevronLeft size={13} />
          </span>
        </button>
      </div>

      {/* Search */}
      {!c && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-3 pt-3"
        >
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141414] border border-[#1E1E1E] text-[#5A5550] text-[12px] hover:border-[#2A2A2A] hover:text-[#8A8078] transition-all"
          >
            <Search size={12} />
            <span>{t.common.search}...</span>
            <span className="ms-auto text-[10px] bg-[#1E1E1E] rounded px-1 py-0.5">⌘K</span>
          </button>
        </motion.div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll px-2 py-3 space-y-0.5">
        <div className="space-y-0.5">
          {NAV_MAIN.map(item => (
            <NavItem key={item.href} {...item} collapsed={c} active={pathname === item.href || pathname.startsWith(item.href + '/')} isRtl={isRtl} />
          ))}
        </div>

        <div className="pt-3">
          {!c && <p className="text-[10px] text-[#3A3A3A] uppercase tracking-[0.1em] px-3 mb-1.5 font-medium">{t.nav.workspaces}</p>}
          {c && <div className="border-t border-[#1E1E1E] mb-2 mx-1" />}
          <div className="space-y-0.5">
            {NAV_WORKSPACES.map(item => (
              <NavItem key={item.href} {...item} collapsed={c} active={pathname === item.href || pathname.startsWith(item.href + '/')} isRtl={isRtl} />
            ))}
          </div>
        </div>
      </nav>

      {/* Today counter */}
      {!c && todayTasks > 0 && (
        <div className="px-4 py-2">
          <div className="text-[11px] text-[#5A5550]">
            <span className="text-[#F2EDE4] font-medium">{todayTasks}</span>{' '}
            {isRtl ? 'وظیفه امروز' : 'tasks today'}
          </div>
        </div>
      )}

      {/* Language toggle */}
      {!c && (
        <div className="px-3 py-2">
          <div className="flex bg-[#141414] border border-[#1E1E1E] rounded-lg p-0.5">
            <button
              onClick={() => setLanguage('fa')}
              className={`flex-1 text-[10px] py-1 rounded-md font-medium transition-colors ${language === 'fa' ? 'bg-cream-200 text-ink-200' : 'text-[#5A5550] hover:text-[#8A8078]'}`}
            >
              فا
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`flex-1 text-[10px] py-1 rounded-md font-medium transition-colors ${language === 'en' ? 'bg-cream-200 text-ink-200' : 'text-[#5A5550] hover:text-[#8A8078]'}`}
            >
              EN
            </button>
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="px-2 pb-3 border-t border-[#1E1E1E] pt-2 space-y-0.5">
        {NAV_BOTTOM.map(item => (
          <NavItem key={item.href} {...item} collapsed={c} active={pathname === item.href} isRtl={isRtl} />
        ))}
      </div>

      {/* Avatar + Logout */}
      <div className={cn('px-3 pb-4 flex items-center gap-2.5', c ? 'justify-center' : '')}>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cream-300 to-cream-500 flex-shrink-0 flex items-center justify-center text-[11px] font-semibold text-ink-200">
          م
        </div>
        {!c && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 min-w-0">
            <p className="text-[12px] text-[#C8C3BE] font-medium truncate">مجتبا</p>
            <p className="text-[10px] text-[#5A5550] truncate">Senior UI/UX</p>
          </motion.div>
        )}
        <button
          onClick={handleLogout}
          title={isRtl ? 'خروج' : 'Sign out'}
          className="text-[#3A3A3A] hover:text-[#C8C3BE] transition-colors flex-shrink-0"
        >
          <LogOut size={13} />
        </button>
      </div>
    </motion.aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block h-full flex-shrink-0">{sidebarContent}</div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={onMobileClose}
            />
            <motion.div
              initial={{ x: isRtl ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '-100%' : '100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className={`md:hidden fixed top-0 bottom-0 z-50 ${isRtl ? 'left-0' : 'right-0'}`}
              style={{ width: 220 }}
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
