'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MenuBar } from './MenuBar'
import { Dock } from './Dock'
import { OSWindow } from './OSWindow'
import { APP_COMPONENTS } from './AppRegistry'
import { QuickCapture } from '@/components/shared/QuickCapture'
import { CommandPalette } from '@/components/shared/CommandPalette'
import { useStore } from '@/lib/store'

const WALLPAPER = {
  background: `
    radial-gradient(ellipse 90% 70% at 5% 50%, rgba(76,29,149,0.7) 0%, transparent 55%),
    radial-gradient(ellipse 70% 60% at 85% 75%, rgba(17,24,83,0.65) 0%, transparent 60%),
    radial-gradient(ellipse 55% 50% at 45% 15%, rgba(109,40,217,0.35) 0%, transparent 55%),
    radial-gradient(ellipse 45% 35% at 75% 25%, rgba(6,95,70,0.3) 0%, transparent 50%),
    radial-gradient(ellipse 50% 40% at 30% 80%, rgba(30,58,138,0.4) 0%, transparent 55%),
    linear-gradient(145deg, #0c0818 0%, #080614 45%, #050410 100%)
  `,
}

export function DesktopFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { osWins, openOSWin, setCommandPaletteOpen, setQuickCaptureOpen } = useStore()
  const isLogin = pathname === '/login'

  // Auto-open window when navigating directly to a route
  useEffect(() => {
    if (isLogin || pathname === '/') return
    const appId = pathname.split('/')[1]
    if (appId && appId in APP_COMPONENTS) openOSWin(appId)
  }, [pathname, isLogin, openOSWin])

  // Global keyboard shortcuts
  useEffect(() => {
    if (isLogin) return
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCommandPaletteOpen(true) }
      if (!isInput && e.key === 'n' && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setQuickCaptureOpen(true) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isLogin, setCommandPaletteOpen, setQuickCaptureOpen])

  if (isLogin) return <>{children}</>

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Wallpaper */}
      <div className="absolute inset-0" style={WALLPAPER} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }}
      />

      {/* Menu bar */}
      <MenuBar />

      {/* Desktop workspace */}
      <div className="absolute inset-0 top-7 bottom-[88px]">
        {/* Desktop icons (only on root with no windows open) */}
        {pathname === '/' && Object.keys(osWins).length === 0 && (
          <div className="absolute inset-0">{children}</div>
        )}

        {/* Open windows */}
        <AnimatePresence>
          {Object.keys(osWins).map(appId => (
            <OSWindow key={appId} appId={appId} />
          ))}
        </AnimatePresence>
      </div>

      {/* Dock */}
      <Dock />

      {/* Global overlays (rendered once) */}
      <QuickCapture />
      <CommandPalette />
    </div>
  )
}
