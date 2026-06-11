'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MenuBar } from './MenuBar'
import { Dock } from './Dock'
import { OSWindow } from './OSWindow'
import { DesktopIcons } from './DesktopIcons'
import { APP_COMPONENTS } from './AppRegistry'
import { QuickCapture } from '@/components/shared/QuickCapture'
import { CommandPalette } from '@/components/shared/CommandPalette'
import { useStore } from '@/lib/store'

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

  // Keyboard shortcuts
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
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: '#050410' }}
    >
      {/* Wallpaper */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: 'url(/wallpaper/wallpaper.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      {/* Subtle dark overlay so text/UI remains readable */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.18)' }} />

      {/* Menu bar */}
      <MenuBar />

      {/* Desktop workspace (below menubar, above dock) */}
      <div className="absolute left-0 right-0" style={{ top: 28, bottom: 88 }}>

        {/* Desktop icons — always visible in background */}
        <DesktopIcons />

        {/* Floating windows on top */}
        <AnimatePresence>
          {Object.keys(osWins).map(appId => (
            <OSWindow key={appId} appId={appId} />
          ))}
        </AnimatePresence>
      </div>

      {/* Dock */}
      <Dock />

      {/* Global overlays */}
      <QuickCapture />
      <CommandPalette />
    </div>
  )
}
