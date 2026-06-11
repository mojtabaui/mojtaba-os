'use client'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { useT } from '@/lib/i18n'
import { APP_DEFS } from './AppRegistry'

const DOCK_IDS = [
  'dashboard', 'executive', 'calendar', 'tasks', 'goals', 'weekly', 'matrix',
  'SEP',
  'migration', 'ielts', 'balinex', 'academy', 'content', 'personal',
  'SEP2',
  'analytics', 'budget', 'settings',
]

export function Dock() {
  const { openOSWin, osWins } = useStore()
  const t = useT()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', damping: 20 }}
        className="pointer-events-auto flex items-end gap-1 px-3 py-2 rounded-2xl border border-white/[0.12]"
        style={{ background: 'rgba(16,12,24,0.6)', backdropFilter: 'blur(24px)', boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)' }}
      >
        {DOCK_IDS.map((id) => {
          if (id.startsWith('SEP')) {
            return <div key={id} className="w-px h-10 mx-1 self-center" style={{ background: 'rgba(255,255,255,0.1)' }} />
          }

          const def = APP_DEFS.find(a => a.id === id)
          if (!def) return null

          const win = osWins[id]
          const isOpen = !!win
          const isMinimized = win?.minimized ?? false
          const isHovered = hovered === id
          const navT = t.nav as Record<string, string>
          const label = navT[def.navKey] || id

          return (
            <div key={id} className="relative flex flex-col items-center" style={{ minWidth: 48 }}>
              {/* Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute whitespace-nowrap text-[11px] font-medium pointer-events-none px-2.5 py-1 rounded-lg"
                  style={{ bottom: '100%', marginBottom: 8, background: 'rgba(8,6,16,0.88)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                >
                  {label}
                </motion.div>
              )}

              <motion.button
                animate={{ scale: isHovered ? 1.42 : 1, y: isHovered ? -6 : 0 }}
                transition={{ type: 'spring', stiffness: 460, damping: 22 }}
                style={{ transformOrigin: 'bottom center' }}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => openOSWin(id)}
                className="block focus:outline-none"
              >
                <div
                  className="w-11 h-11 rounded-[11px] flex items-center justify-center relative overflow-hidden shadow-lg"
                  style={{ background: `linear-gradient(145deg, ${def.grad[0]}, ${def.grad[1]})` }}
                >
                  <def.icon size={22} color="white" className="relative z-10 drop-shadow-sm" />
                  {/* Gloss */}
                  <div className="absolute top-0 left-0 right-0 rounded-t-[11px] pointer-events-none" style={{ height: '48%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.32), rgba(255,255,255,0.05))' }} />
                  {/* Minimized dimming */}
                  {isMinimized && <div className="absolute inset-0 bg-black/30 rounded-[11px]" />}
                </div>
              </motion.button>

              {/* Open indicator dot */}
              <div className="h-1 mt-0.5 flex justify-center">
                {isOpen && !isMinimized && <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.55)' }} />}
                {isMinimized && <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(255,200,0,0.5)' }} />}
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
