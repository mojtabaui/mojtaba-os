'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { User, Heart, Moon, Zap, Smile, Dumbbell, Gamepad2, Brain } from 'lucide-react'
import { useT } from '@/lib/i18n'

const today = new Date().toISOString().split('T')[0]

export default function PersonalPage() {
  const t = useT()
  const [mood, setMood] = useState(4)
  const [energy, setEnergy] = useState(3)
  const [stress, setStress] = useState(2)
  const [sleep, setSleep] = useState(7)
  const [reflection, setReflection] = useState('')

  const MOOD_OPTIONS = [
    { value: 1, label: t.personal.rough, emoji: '😔' },
    { value: 2, label: t.personal.low, emoji: '😕' },
    { value: 3, label: t.personal.okay, emoji: '😐' },
    { value: 4, label: t.personal.good, emoji: '😊' },
    { value: 5, label: t.personal.great, emoji: '😄' },
  ]

  return (
    <AppShell>
      <div className="min-h-full">
        <div className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur-sm border-b border-[#E4DDD3] px-6 py-4">
          <div className="flex items-center gap-2">
            <User size={16} className="text-[#6B6259]" />
            <div>
              <h1 className="text-lg font-semibold text-ink-200">{t.personal.title}</h1>
              <p className="text-[12px] text-[#A09388]">{t.personal.subtitle}</p>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-3xl">
          {/* Today's check-in */}
          <div className="bg-[#0A0A0A] rounded-2xl p-6 mb-6">
            <h2 className="text-[13px] font-semibold text-cream-300 mb-4 uppercase tracking-wider">{t.personal.checkIn}</h2>
            <div className="grid grid-cols-2 gap-6">
              {/* Mood */}
              <div>
                <p className="text-[11px] text-[#5A5550] mb-2 flex items-center gap-1.5"><Smile size={11} /> {t.personal.mood}</p>
                <div className="flex gap-2">
                  {MOOD_OPTIONS.map(m => (
                    <button key={m.value} onClick={() => setMood(m.value)}
                      className={`flex flex-col items-center p-2 rounded-xl transition-all ${mood === m.value ? 'bg-cream-200 scale-110' : 'opacity-50 hover:opacity-80'}`}>
                      <span className="text-xl">{m.emoji}</span>
                      <span className="text-[9px] text-[#8A8078] mt-0.5">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy */}
              <div>
                <p className="text-[11px] text-[#5A5550] mb-2 flex items-center gap-1.5"><Zap size={11} /> {t.personal.energy}</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => setEnergy(v)}
                      className={`flex-1 h-7 rounded-lg transition-all ${v <= energy ? 'bg-[#F97316]' : 'bg-[#1E1E1E]'}`} />
                  ))}
                </div>
                <p className="text-[10px] text-[#5A5550] mt-1">{energy}/5</p>
              </div>

              {/* Stress */}
              <div>
                <p className="text-[11px] text-[#5A5550] mb-2 flex items-center gap-1.5"><Brain size={11} /> {t.personal.stress}</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => setStress(v)}
                      className={`flex-1 h-7 rounded-lg transition-all ${v <= stress ? 'bg-[#EF4444]' : 'bg-[#1E1E1E]'}`} />
                  ))}
                </div>
                <p className="text-[10px] text-[#5A5550] mt-1">{stress}/5</p>
              </div>

              {/* Sleep */}
              <div>
                <p className="text-[11px] text-[#5A5550] mb-2 flex items-center gap-1.5"><Moon size={11} /> {t.personal.sleep} {t.personal.hours}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSleep(Math.max(0, sleep - 0.5))}
                    className="w-7 h-7 rounded-lg bg-[#1E1E1E] text-cream-300 flex items-center justify-center hover:bg-[#2A2A2A] transition-colors">−</button>
                  <span className="text-cream-200 font-semibold text-lg w-12 text-center">{sleep}h</span>
                  <button onClick={() => setSleep(Math.min(12, sleep + 0.5))}
                    className="w-7 h-7 rounded-lg bg-[#1E1E1E] text-cream-300 flex items-center justify-center hover:bg-[#2A2A2A] transition-colors">+</button>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly reflection */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 mb-4">
            <h2 className="text-[13px] font-semibold text-ink-200 mb-3 flex items-center gap-2">
              <Heart size={13} className="text-[#EF4444]" /> {t.personal.reflection}
            </h2>
            <div className="space-y-3">
              {['What went well this week?', 'What was challenging?', 'What will you do differently?'].map(q => (
                <div key={q}>
                  <p className="text-[11px] text-[#6B6259] mb-1">{q}</p>
                  <textarea rows={2} placeholder={t.personal.reflectionPlaceholder}
                    className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200 resize-none placeholder:text-[#C4B9AD]" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Therapy */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <h3 className="text-[12px] font-semibold text-ink-200 mb-3 flex items-center gap-1.5">
                <Brain size={13} className="text-[#A855F7]" /> {t.personal.therapy}
              </h3>
              <div className="space-y-2">
                <div className="p-2.5 bg-cream-50 rounded-xl border border-[#F0EAE2]">
                  <p className="text-[12px] font-medium text-ink-200">{t.personal.nextSession}</p>
                  <p className="text-[11px] text-[#A09388]">Friday, June 15 · 18:00</p>
                </div>
                <div className="p-2.5 bg-cream-50 rounded-xl border border-[#F0EAE2]">
                  <p className="text-[12px] font-medium text-ink-200">Last session</p>
                  <p className="text-[11px] text-[#A09388]">Friday, June 5 · Discussed work stress</p>
                </div>
              </div>
            </div>

            {/* Gaming */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <h3 className="text-[12px] font-semibold text-ink-200 mb-3 flex items-center gap-1.5">
                <Gamepad2 size={13} className="text-[#22C55E]" /> Gaming Rewards
              </h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[11px] text-[#6B6259]">Tasks completed today</span>
                    <span className="text-[11px] font-medium text-ink-200">3/5</span>
                  </div>
                  <div className="h-1.5 bg-cream-200 rounded-full">
                    <div className="h-full bg-[#22C55E] rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
                <p className="text-[11px] text-[#A09388]">Complete 5 tasks → unlock 2h gaming</p>
                <div className="flex items-center gap-2 p-2 bg-[#F0FDF4] rounded-lg border border-[#BBF7D0]">
                  <Gamepad2 size={12} className="text-[#22C55E]" />
                  <span className="text-[11px] text-[#16A34A] font-medium">1.2h earned this week</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
