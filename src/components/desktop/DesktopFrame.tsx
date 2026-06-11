'use client'
import { usePathname } from 'next/navigation'
import { MenuBar } from './MenuBar'
import { Dock } from './Dock'
import { AppWindow } from './AppWindow'

const WALLPAPER_STYLE: React.CSSProperties = {
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
  const isLogin = pathname === '/login'

  if (isLogin) return <>{children}</>

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Wallpaper */}
      <div className="absolute inset-0" style={WALLPAPER_STYLE} />

      {/* Subtle noise grain */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Menu bar */}
      <MenuBar />

      {/* Window */}
      <div className="absolute left-5 right-5 top-8 bottom-[92px] flex">
        <AppWindow>{children}</AppWindow>
      </div>

      {/* Dock */}
      <Dock />
    </div>
  )
}
