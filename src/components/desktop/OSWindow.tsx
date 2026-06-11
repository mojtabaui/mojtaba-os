'use client'
import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { useT } from '@/lib/i18n'
import { APP_DEFS, APP_COMPONENTS } from './AppRegistry'

const MENU_H = 28
const DOCK_H = 88
const MIN_W = 480
const MIN_H = 320

export function OSWindow({ appId }: { appId: string }) {
  const { osWins, closeOSWin, minimizeOSWin, maximizeOSWin, focusOSWin, moveOSWin, resizeOSWin } = useStore()
  const t = useT()
  const win = osWins[appId]

  if (!win || win.minimized) return null

  const def = APP_DEFS.find(a => a.id === appId)
  if (!def) return null

  const AppComp = APP_COMPONENTS[appId as keyof typeof APP_COMPONENTS]
  const navT = t.nav as Record<string, string>
  const label = navT[def.navKey] || appId

  const onTitleDown = (e: React.MouseEvent) => {
    if (win.maximized) return
    if ((e.target as HTMLElement).closest('[data-nd]')) return
    e.preventDefault()
    focusOSWin(appId)
    const ox = e.clientX - win.x
    const oy = e.clientY - win.y
    const onMove = (ev: MouseEvent) => {
      const nx = Math.max(0, Math.min(ev.clientX - ox, window.innerWidth - win.w))
      const ny = Math.max(MENU_H, Math.min(ev.clientY - oy, window.innerHeight - DOCK_H - 44))
      moveOSWin(appId, nx, ny)
    }
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  const onResizeDown = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    const sw = win.w, sh = win.h, sx = e.clientX, sy = e.clientY
    const onMove = (ev: MouseEvent) => resizeOSWin(appId, Math.max(MIN_W, sw + ev.clientX - sx), Math.max(MIN_H, sh + ev.clientY - sy))
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  const wStyle = win.maximized
    ? { position: 'absolute' as const, top: MENU_H + 4, left: 4, right: 4, bottom: DOCK_H + 4, width: 'auto', height: 'auto', zIndex: win.z }
    : { position: 'absolute' as const, left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }

  return (
    <motion.div
      initial={{ scale: 0.93, opacity: 0, y: 16 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.93, opacity: 0, y: 12, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', damping: 26, stiffness: 300 }}
      style={{ ...wStyle, boxShadow: '0 28px 72px rgba(0,0,0,0.72), 0 0 0 0.5px rgba(255,255,255,0.07)', borderRadius: 12 }}
      className="flex flex-col overflow-hidden"
      onMouseDown={() => focusOSWin(appId)}
    >
      {/* Title bar */}
      <div
        className="flex-shrink-0 flex items-center px-4 gap-3 select-none"
        style={{ height: 44, background: 'rgba(26,22,34,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', cursor: 'default' }}
        onMouseDown={onTitleDown}
        onDoubleClick={() => maximizeOSWin(appId)}
      >
        {/* Traffic lights */}
        <div className="flex items-center gap-2 group/tl" data-nd="true">
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={() => closeOSWin(appId)}
            className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
            style={{ background: '#FF5F57' }}
          >
            <svg className="opacity-0 group-hover/tl:opacity-100" width="6" height="6" viewBox="0 0 8 8">
              <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#7a0000" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={() => minimizeOSWin(appId)}
            className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
            style={{ background: '#FFBD2E' }}
          >
            <svg className="opacity-0 group-hover/tl:opacity-100" width="8" height="2" viewBox="0 0 8 2">
              <path d="M0.5 1h7" stroke="#5a3600" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            onMouseDown={e => e.stopPropagation()}
            onClick={() => maximizeOSWin(appId)}
            className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
            style={{ background: '#28CA41' }}
          >
            <svg className="opacity-0 group-hover/tl:opacity-100" width="8" height="8" viewBox="0 0 8 8">
              <path d="M1 7h6M7 1H1M7 1L1 7" stroke="#004400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Title */}
        <div className="flex-1 flex items-center justify-center gap-2 pointer-events-none" style={{ marginRight: 52 }}>
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center shadow-sm flex-shrink-0"
            style={{ background: `linear-gradient(145deg, ${def.grad[0]}, ${def.grad[1]})` }}
          >
            <def.icon size={11} color="white" />
          </div>
          <span className="text-[12px] font-medium tracking-wide truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto" style={{ background: '#F2EDE4' }}>
        <Suspense fallback={
          <div className="h-full flex items-center justify-center min-h-[200px]">
            <div className="w-7 h-7 border-2 rounded-full animate-spin" style={{ borderColor: '#D4C9B8', borderTopColor: '#6B6259' }} />
          </div>
        }>
          <AppComp />
        </Suspense>
      </div>

      {/* Resize grip */}
      {!win.maximized && (
        <div
          className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-10"
          onMouseDown={onResizeDown}
          style={{ background: 'transparent' }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="absolute bottom-1.5 right-1.5" style={{ opacity: 0.25 }}>
            <path d="M9 1L1 9M9 5L5 9M9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      )}
    </motion.div>
  )
}
