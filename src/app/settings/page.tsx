'use client'
import { AppShell } from '@/components/layout/AppShell'
import { Settings } from 'lucide-react'
import { useT } from '@/lib/i18n'

export default function SettingsPage() {
  const t = useT()
  return (
    <AppShell>
      <div className="min-h-full p-6 max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <Settings size={16} className="text-[#6B6259]" />
          <h1 className="text-lg font-semibold text-ink-200">{t.settings.title}</h1>
        </div>
        <div className="space-y-3">
          {[
            { label: t.settings.profile, desc: t.settings.profileDesc },
            { label: t.settings.preferences, desc: t.settings.preferencesDesc },
            { label: t.settings.notifications, desc: t.settings.notificationsDesc },
            { label: t.settings.data, desc: t.settings.dataDesc },
          ].map(s => (
            <div key={s.label} className="bg-white border border-[#E8E2D8] rounded-xl p-4 hover:border-[#D4C9B8] transition-colors cursor-pointer">
              <p className="text-[13px] font-medium text-ink-200">{s.label}</p>
              <p className="text-[11px] text-[#A09388] mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
