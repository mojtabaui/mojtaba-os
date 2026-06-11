'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useT } from '@/lib/i18n'
import {
  LayoutDashboard, Calendar, CheckSquare, Target, Plane,
  BookOpen, Briefcase, GraduationCap, Rss, User, BarChart2,
  Settings, CalendarDays, Clock, Grid3x3, Trophy,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const PAGE_CFG: Record<string, { icon: LucideIcon; grad: string }> = {
  dashboard:  { icon: LayoutDashboard, grad: 'from-blue-400 to-blue-600' },
  executive:  { icon: Trophy,          grad: 'from-amber-400 to-amber-600' },
  calendar:   { icon: Calendar,        grad: 'from-red-400 to-red-600' },
  tasks:      { icon: CheckSquare,     grad: 'from-green-400 to-green-600' },
  goals:      { icon: Target,          grad: 'from-violet-400 to-violet-600' },
  weekly:     { icon: CalendarDays,    grad: 'from-cyan-400 to-cyan-600' },
  matrix:     { icon: Grid3x3,         grad: 'from-lime-400 to-lime-600' },
  budget:     { icon: Clock,           grad: 'from-orange-400 to-orange-600' },
  migration:  { icon: Plane,           grad: 'from-rose-400 to-rose-600' },
  ielts:      { icon: BookOpen,        grad: 'from-orange-400 to-orange-500' },
  balinex:    { icon: Briefcase,       grad: 'from-blue-500 to-indigo-600' },
  academy:    { icon: GraduationCap,   grad: 'from-emerald-400 to-emerald-600' },
  content:    { icon: Rss,             grad: 'from-purple-400 to-purple-600' },
  personal:   { icon: User,            grad: 'from-pink-400 to-pink-600' },
  analytics:  { icon: BarChart2,       grad: 'from-indigo-400 to-indigo-600' },
  settings:   { icon: Settings,        grad: 'from-gray-400 to-gray-600' },
}

export function AppWindow({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useT()

  const key = pathname.split('/')[1] || 'dashboard'
  const cfg = PAGE_CFG[key] || PAGE_CFG['dashboard']
  const Icon = cfg.icon
  const navT = t.nav as Record<string, string>
  const title = navT[key] || 'Mojtaba OS'

  return (
    <div className="w-full h-full flex flex-col rounded-xl overflow-hidden border border-white/[0.08]"
      style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.06)' }}>

      {/* Title bar */}
      <div
        className="h-11 flex-shrink-0 flex items-center px-4 gap-3 border-b border-black/20"
        style={{ background: 'rgba(30,27,38,0.92)', backdropFilter: 'blur(20px)' }}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-2 group/tl">
          <button
            onClick={() => router.push('/dashboard')}
            className="w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors"
            style={{ background: '#FF5F57' }}
          >
            <span className="hidden group-hover/tl:flex text-[#7a0000] font-black leading-none" style={{ fontSize: 8 }}>✕</span>
          </button>
          <button className="w-3.5 h-3.5 rounded-full transition-colors" style={{ background: '#FFBD2E' }} />
          <button className="w-3.5 h-3.5 rounded-full transition-colors" style={{ background: '#28CA41' }} />
        </div>

        {/* App title */}
        <div className="flex-1 flex items-center justify-center gap-2" style={{ marginRight: 44 }}>
          <div className={`w-5 h-5 rounded-md bg-gradient-to-b ${cfg.grad} flex items-center justify-center shadow-sm`}>
            <Icon size={11} className="text-white" />
          </div>
          <span className="text-[12px] font-medium text-white/50 tracking-wide">{title}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto" style={{ background: '#F2EDE4' }}>
        {children}
      </div>
    </div>
  )
}
