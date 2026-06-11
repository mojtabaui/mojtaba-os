'use client'
import { useStore } from '@/lib/store'
import { useT } from '@/lib/i18n'
import { APP_DEFS } from '@/components/desktop/AppRegistry'

export default function DesktopPage() {
  const { openOSWin } = useStore()
  const t = useT()

  return (
    <div className="w-full h-full p-6 overflow-auto">
      <div className="flex flex-wrap gap-3 content-start">
        {APP_DEFS.map(def => {
          const navT = t.nav as Record<string, string>
          const label = navT[def.navKey] || def.id

          return (
            <button
              key={def.id}
              onClick={() => openOSWin(def.id)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl group focus:outline-none"
              style={{ width: 80 }}
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-[18px] flex items-center justify-center relative overflow-hidden shadow-xl transition-transform group-hover:scale-105 group-active:scale-95"
                style={{
                  background: `linear-gradient(145deg, ${def.grad[0]}, ${def.grad[1]})`,
                  boxShadow: `0 8px 24px ${def.grad[1]}55`,
                }}
              >
                <def.icon size={30} color="white" className="relative z-10 drop-shadow" />
                {/* Gloss */}
                <div
                  className="absolute top-0 left-0 right-0 rounded-t-[18px] pointer-events-none"
                  style={{ height: '45%', background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.05))' }}
                />
              </div>
              {/* Label */}
              <span
                className="text-[11px] font-medium text-center leading-tight text-white/80 drop-shadow truncate w-full"
                style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}
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
