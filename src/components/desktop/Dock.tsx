'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState } from 'react'
import {
  LayoutDashboard, Calendar, CheckSquare, Target, Plane,
  BookOpen, Briefcase, GraduationCap, Rss, User, BarChart2,
  Trophy, CalendarDays, Grid3x3, Clock, Settings,
} from 'lucide-react'
import { useT } from '@/lib/i18n'

const DOCK_ITEMS = [
  { id: 'dashboard', href: '/dashboard', icon: LayoutDashboard, grad: ['#60A5FA', '#2563EB'] },
  { id: 'executive', href: '/executive', icon: Trophy,          grad: ['#FCD34D', '#D97706'] },
  { id: 'calendar',  href: '/calendar',  icon: Calendar,        grad: ['#F87171', '#DC2626'] },
  { id: 'tasks',     href: '/tasks',     icon: CheckSquare,     grad: ['#4ADE80', '#16A34A'] },
  { id: 'goals',     href: '/goals',     icon: Target,          grad: ['#A78BFA', '#7C3AED'] },
  { id: 'weekly',    href: '/weekly',    icon: CalendarDays,    grad: ['#22D3EE', '#0891B2'] },
  { id: 'matrix',    href: '/matrix',    icon: Grid3x3,         grad: ['#A3E635', '#65A30D'] },
  { id: 'SEP' },
  { id: 'migration', href: '/migration', icon: Plane,           grad: ['#FB7185', '#E11D48'] },
  { id: 'ielts',     href: '/ielts',     icon: BookOpen,        grad: ['#FB923C', '#EA580C'] },
  { id: 'balinex',   href: '/balinex',   icon: Briefcase,       grad: ['#818CF8', '#4338CA'] },
  { id: 'academy',   href: '/academy',   icon: GraduationCap,   grad: ['#34D399', '#059669'] },
  { id: 'content',   href: '/content',   icon: Rss,             grad: ['#C084FC', '#9333EA'] },
  { id: 'personal',  href: '/personal',  icon: User,            grad: ['#F472B6', '#DB2777'] },
  { id: 'SEP2' },
  { id: 'analytics', href: '/analytics', icon: BarChart2,       grad: ['#818CF8', '#4F46E5'] },
  { id: 'budget',    href: '/budget',    icon: Clock,           grad: ['#FB923C', '#C2410C'] },
  { id: 'settings',  href: '/settings',  icon: Settings,        grad: ['#94A3B8', '#475569'] },
] as const

export function Dock() {
  const pathname = usePathname()
  const t = useT()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', damping: 20 }}
        className="pointer-events-auto flex items-end gap-1 px-3 py-2 rounded-2xl border border-white/15"
        style={{ background: 'rgba(20,16,30,0.55)', backdropFilter: 'blur(24px)', boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)' }}
      >
        {DOCK_ITEMS.map((item) => {
          if (item.id.startsWith('SEP')) {
            return <div key={item.id} className="w-px h-10 bg-white/10 mx-1 self-center" />
          }

          const app = item as { id: string; href: string; icon: React.ElementType; grad: readonly [string, string] }
          const isActive = pathname === app.href || pathname.startsWith(app.href + '/')
          const isHovered = hovered === app.id
          const navT = t.nav as Record<string, string>
          const label = navT[app.id] || app.id

          return (
            <div key={app.id} className="relative flex flex-col items-center" style={{ minWidth: 48 }}>
              {/* Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-medium text-white/90 px-2.5 py-1 rounded-lg pointer-events-none"
                  style={{ background: 'rgba(10,8,20,0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {label}
                </motion.div>
              )}

              <motion.div
                animate={{ scale: isHovered ? 1.45 : isActive ? 1.12 : 1, y: isHovered ? -6 : isActive ? -2 : 0 }}
                transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                style={{ transformOrigin: 'bottom center' }}
              >
                <Link
                  href={app.href}
                  onMouseEnter={() => setHovered(app.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="block"
                >
                  <div
                    className="w-11 h-11 rounded-[11px] flex items-center justify-center relative overflow-hidden shadow-lg"
                    style={{ background: `linear-gradient(145deg, ${app.grad[0]}, ${app.grad[1]})` }}
                  >
                    <app.icon size={22} className="text-white drop-shadow-sm relative z-10" />
                    {/* Gloss overlay */}
                    <div
                      className="absolute top-0 left-0 right-0 rounded-t-[11px] pointer-events-none"
                      style={{ height: '48%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.06))' }}
                    />
                  </div>
                </Link>
              </motion.div>

              {/* Active dot */}
              <div className="h-1 mt-1 flex justify-center">
                {isActive && <div className="w-1 h-1 rounded-full bg-white/50" />}
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
