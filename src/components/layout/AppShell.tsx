'use client'
import { useState, useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { QuickCapture } from '@/components/shared/QuickCapture'
import { CommandPalette } from '@/components/shared/CommandPalette'
import { useStore } from '@/lib/store'
import { useT } from '@/lib/i18n'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, CheckSquare, Target, Menu } from 'lucide-react'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { setCommandPaletteOpen, setQuickCaptureOpen } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const t = useT()
  const pathname = usePathname()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      if (!isInput && e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setQuickCaptureOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setCommandPaletteOpen, setQuickCaptureOpen])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const MOBILE_NAV = [
    { href: '/dashboard', icon: LayoutDashboard, label: t.nav.dashboard },
    { href: '/calendar',  icon: Calendar,         label: t.nav.calendar  },
    { href: '/tasks',     icon: CheckSquare,       label: t.nav.tasks     },
    { href: '/goals',     icon: Target,            label: t.nav.goals     },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-cream-200">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto animate-slide-up pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 h-14 bg-white border-t border-[#E8E2D8] z-30 flex items-stretch safe-area-bottom">
        {MOBILE_NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[9px] transition-colors ${active ? 'text-ink-200' : 'text-[#A09388]'}`}
            >
              <Icon size={19} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </Link>
          )
        })}
        <button
          onClick={() => setMobileOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[9px] text-[#A09388] active:text-ink-200"
        >
          <Menu size={19} strokeWidth={1.8} />
          <span>{t.common.more}</span>
        </button>
      </nav>

      <QuickCapture />
      <CommandPalette />
    </div>
  )
}
