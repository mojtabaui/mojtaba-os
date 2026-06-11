'use client'
import { useStore } from '@/lib/store'
import { useT } from '@/lib/i18n'
import { APP_DEFS } from './AppRegistry'

export function DesktopIcons() {
  const { openOSWin } = useStore()
  const t = useT()

  return (
    <div className="absolute inset-0 p-4 overflow-auto pointer-events-none">
      <div className="flex flex-wrap gap-2 content-start pointer-events-auto" style={{ maxWidth: 400 }}>
        {APP_DEFS.map(def => {
          const navT = t.nav as Record<string, string>
          const label = navT[def.navKey] || def.id

          return (
            <button
              key={def.id}
              onClick={() => openOSWin(def.id)}
              onDoubleClick={() => openOSWin(def.id)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl group focus:outline-none"
              style={{ width: 76 }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-xl transition-all duration-150 group-hover:scale-105 group-hover:brightness-110 group-active:scale-95"
                style={{ background: `linear-gradient(145deg, ${def.grad[0]}, ${def.grad[1]})`, boxShadow: `0 6px 20px ${def.grad[1]}66` }}
              >
                <def.icon size={26} color="white" className="relative z-10 drop-shadow" />
                <div className="absolute top-0 left-0 right-0 rounded-t-2xl pointer-events-none" style={{ height: '45%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.32), rgba(255,255,255,0.04))' }} />
              </div>
              <span
                className="text-[10.5px] font-medium text-center leading-tight w-full truncate"
                style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
