'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useStore } from '@/lib/store'
import { useT } from '@/lib/i18n'
import { getTodayBoth } from '@/lib/jalali'
import { Search, Wifi, Volume2, BatteryMedium } from 'lucide-react'

export function MenuBar() {
  const pathname = usePathname()
  const { setCommandPaletteOpen, language, setLanguage } = useStore()
  const t = useT()
  const [clock, setClock] = useState('')
  const [dateLabel, setDateLabel] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const h = String(now.getHours()).padStart(2, '0')
      const m = String(now.getMinutes()).padStart(2, '0')
      setClock(`${h}:${m}`)
      const { jalaliShort, gregorian } = getTodayBoth()
      setDateLabel(language === 'fa' ? jalaliShort : gregorian)
    }
    update()
    const id = setInterval(update, 15000)
    return () => clearInterval(id)
  }, [language])

  const key = pathname.split('/')[1] || 'dashboard'
  const navT = t.nav as Record<string, string>
  const appName = navT[key] || 'Mojtaba OS'

  return (
    <div
      className="absolute top-0 left-0 right-0 h-7 z-40 flex items-center px-4 text-white/80 text-[12.5px] select-none"
      style={{ background: 'rgba(8,6,16,0.6)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Left */}
      <div className="flex items-center gap-4 min-w-0">
        <span className="text-white font-semibold text-[14px] leading-none">⌘</span>
        <span className="font-semibold text-white">Mojtaba OS</span>
        <span className="text-white/40 truncate hidden sm:block">{appName}</span>
      </div>

      <div className="flex-1" />

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Language toggle */}
        <div className="flex items-center gap-1 bg-white/10 rounded px-1 py-0.5">
          <button onClick={() => setLanguage('fa')} className={`text-[10px] px-1 py-0.5 rounded transition-colors ${language === 'fa' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/60'}`}>فا</button>
          <button onClick={() => setLanguage('en')} className={`text-[10px] px-1 py-0.5 rounded transition-colors ${language === 'en' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/60'}`}>EN</button>
        </div>

        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hover:bg-white/10 rounded p-0.5 transition-colors"
          title={t.common.search}
        >
          <Search size={13} />
        </button>

        <Wifi size={13} className="opacity-70" />
        <Volume2 size={12} className="opacity-70" />
        <BatteryMedium size={14} className="opacity-70" />

        <span className="text-white/60 hidden md:block">{dateLabel}</span>
        <span className="text-white font-medium">{clock}</span>
      </div>
    </div>
  )
}
