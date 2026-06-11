'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { formatDate, formatTime } from '@/lib/utils'
import { AppShell } from '@/components/layout/AppShell'
import { BookOpen, Flame, Clock, Target, Plus, X, TrendingUp, Mic, Headphones, PenLine, Eye, BookMarked } from 'lucide-react'
import { useT } from '@/lib/i18n'

type Skill = 'reading' | 'listening' | 'writing' | 'speaking' | 'vocabulary' | 'grammar'

const SKILL_ICONS: Record<Skill, React.ElementType> = {
  reading: Eye,
  listening: Headphones,
  writing: PenLine,
  speaking: Mic,
  vocabulary: BookMarked,
  grammar: BookOpen,
}

const SKILL_COLORS: Record<Skill, string> = {
  reading: '#3B82F6',
  listening: '#A855F7',
  writing: '#F97316',
  speaking: '#22C55E',
  vocabulary: '#EAB308',
  grammar: '#EF4444',
}

function StreakCalendar({ sessions }: { sessions: { date: string }[] }) {
  const today = new Date()
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (27 - i))
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  })
  const studiedDays = new Set(sessions.map(s => s.date))
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`

  return (
    <div className="grid grid-cols-7 gap-1">
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
        <div key={i} className="text-[9px] text-[#C4B9AD] text-center font-medium mb-0.5">{d}</div>
      ))}
      {days.map(day => (
        <div
          key={day}
          title={day}
          className={`h-5 w-full rounded transition-all ${studiedDays.has(day) ? 'bg-[#F97316]' : day === todayStr ? 'bg-cream-300 ring-1 ring-[#F97316]' : 'bg-cream-200'}`}
        />
      ))}
    </div>
  )
}

function AddSessionModal({ onClose, t, skills }: { onClose: () => void; t: ReturnType<typeof useT>; skills: { key: Skill; label: string; color: string; icon: React.ElementType }[] }) {
  const { addIELTSSession } = useStore()
  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` })()
  const [form, setForm] = useState({ date: today, skill: 'reading' as Skill, duration: 60, notes: '', score: '' })

  const submit = () => {
    addIELTSSession({ ...form, duration: Number(form.duration), score: form.score ? Number(form.score) : undefined })
    onClose()
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white border border-[#E4DDD3] rounded-2xl shadow-modal z-[51]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EAE2]">
          <h3 className="text-[14px] font-semibold text-ink-200">{t.ielts.addSession}</h3>
          <button onClick={onClose} className="text-[#A09388] hover:text-ink-200"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.ielts.date}</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.ielts.skill}</label>
              <select value={form.skill} onChange={e => setForm({ ...form, skill: e.target.value as Skill })}
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200">
                {skills.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.ielts.duration}</label>
              <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })}
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.ielts.score}</label>
              <input type="number" step="0.5" min="0" max="9" value={form.score} onChange={e => setForm({ ...form, score: e.target.value })}
                placeholder="e.g. 7.5"
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200 placeholder:text-[#C4B9AD]" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.ielts.notes}</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
              className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200 resize-none" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="px-4 py-2 text-[12px] text-[#6B6259]">{t.common.cancel}</button>
            <button onClick={submit} className="px-4 py-2 text-[12px] bg-ink-200 text-cream-200 rounded-xl">{t.ielts.addSession}</button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default function IELTSPage() {
  const t = useT()
  const { ieltsSessions, ieltsTarget } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const today = (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` })()

  const SKILLS: { key: Skill; label: string; color: string; icon: React.ElementType }[] = [
    { key: 'reading', label: t.ielts.reading, color: '#3B82F6', icon: Eye },
    { key: 'listening', label: t.ielts.listening, color: '#A855F7', icon: Headphones },
    { key: 'writing', label: t.ielts.writing, color: '#F97316', icon: PenLine },
    { key: 'speaking', label: t.ielts.speaking, color: '#22C55E', icon: Mic },
    { key: 'vocabulary', label: t.ielts.vocabulary, color: '#EAB308', icon: BookMarked },
    { key: 'grammar', label: t.ielts.grammar, color: '#EF4444', icon: BookOpen },
  ]

  // Streak calculation
  let streak = 0
  const checkDate = new Date()
  const sorted = [...ieltsSessions].sort((a, b) => b.date.localeCompare(a.date))
  const visited = new Set<string>()
  for (const s of sorted) {
    if (!visited.has(s.date)) {
      const cd = `${checkDate.getFullYear()}-${String(checkDate.getMonth()+1).padStart(2,'0')}-${String(checkDate.getDate()).padStart(2,'0')}`
      if (s.date === cd) { streak++; visited.add(s.date); checkDate.setDate(checkDate.getDate() - 1) }
      else break
    }
  }

  // This week's hours
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekSessions = ieltsSessions.filter(s => s.date >= `${weekStart.getFullYear()}-${String(weekStart.getMonth()+1).padStart(2,'0')}-${String(weekStart.getDate()).padStart(2,'0')}`)
  const weekMinutes = weekSessions.reduce((acc, s) => acc + s.duration, 0)

  // Today's sessions
  const todaySessions = ieltsSessions.filter(s => s.date === today)
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0)

  // Per-skill stats
  const skillStats = SKILLS.map(skill => {
    const skillSessions = ieltsSessions.filter(s => s.skill === skill.key)
    const scored = skillSessions.filter(s => s.score !== undefined)
    const avgScore = scored.length > 0 ? scored.reduce((a, s) => a + (s.score || 0), 0) / scored.length : null
    const totalMins = skillSessions.reduce((a, s) => a + s.duration, 0)
    return { ...skill, count: skillSessions.length, avgScore, totalMins }
  })

  // Band prediction (simple average of last scored sessions)
  const recentScored = ieltsSessions.filter(s => s.score).slice(0, 10)
  const bandPrediction = recentScored.length > 0
    ? (recentScored.reduce((a, s) => a + (s.score || 0), 0) / recentScored.length).toFixed(1)
    : null

  return (
    <AppShell>
      <div className="min-h-full">
        <div className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur-sm border-b border-[#E4DDD3] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#F97316]" />
              <div>
                <h1 className="text-lg font-semibold text-ink-200">{t.ielts.title}</h1>
                <p className="text-[12px] text-[#A09388]">{t.ielts.subtitle}</p>
              </div>
            </div>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-ink-200 text-cream-200 rounded-xl text-[12px] font-medium hover:bg-ink-300 transition-colors">
              <Plus size={13} /> {t.ielts.addSession}
            </button>
          </div>
        </div>

        <div className="p-6 max-w-[900px] xl:max-w-[1400px] 2xl:max-w-[1800px] 3xl:max-w-[2400px]">
          {/* Top stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-[#0A0A0A] rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Flame size={13} className="text-[#F97316]" />
                <p className="text-[11px] text-[#5A5550] uppercase tracking-wider">{t.ielts.streak}</p>
              </div>
              <p className="text-3xl font-bold text-cream-200">{streak}</p>
              <p className="text-[11px] text-[#5A5550] mt-1">consecutive days</p>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Target size={13} className="text-[#3B82F6]" />
                <p className="text-[11px] text-[#A09388] uppercase tracking-wider">{t.ielts.target}</p>
              </div>
              <p className="text-3xl font-bold text-ink-200">{ieltsTarget}</p>
              <p className="text-[11px] text-[#A09388] mt-1">band score goal</p>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp size={13} className="text-[#22C55E]" />
                <p className="text-[11px] text-[#A09388] uppercase tracking-wider">Prediction</p>
              </div>
              <p className="text-3xl font-bold text-ink-200">{bandPrediction ?? '—'}</p>
              <p className="text-[11px] text-[#A09388] mt-1">based on practice</p>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={13} className="text-[#A855F7]" />
                <p className="text-[11px] text-[#A09388] uppercase tracking-wider">{t.ielts.totalHours}</p>
              </div>
              <p className="text-3xl font-bold text-ink-200">{Math.round(weekMinutes / 60)}h</p>
              <p className="text-[11px] text-[#A09388] mt-1">{weekMinutes}min total</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Streak Calendar */}
            <div className="col-span-2 bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <h2 className="text-[13px] font-semibold text-ink-200 mb-4">Study Calendar (last 4 weeks)</h2>
              <StreakCalendar sessions={ieltsSessions} />
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-[#F97316]" />
                  <span className="text-[10px] text-[#A09388]">Studied</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-cream-200" />
                  <span className="text-[10px] text-[#A09388]">Missed</span>
                </div>
              </div>
            </div>

            {/* Today */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <h2 className="text-[13px] font-semibold text-ink-200 mb-3">Today</h2>
              {todaySessions.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-[12px] text-[#C4B9AD]">No study yet today</p>
                  <button onClick={() => setShowAdd(true)}
                    className="mt-2 text-[11px] text-[#F97316] hover:underline">Log a session →</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {todaySessions.map(s => {
                    const skill = SKILLS.find(sk => sk.key === s.skill)!
                    return (
                      <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg bg-cream-50 border border-[#F0EAE2]">
                        <skill.icon size={12} style={{ color: skill.color }} />
                        <span className="text-[12px] font-medium text-ink-200">{skill.label}</span>
                        <span className="ml-auto text-[11px] text-[#A09388]">{formatTime(s.duration)}</span>
                        {s.score && <span className="text-[11px] font-medium" style={{ color: skill.color }}>{s.score}</span>}
                      </div>
                    )
                  })}
                  <p className="text-[11px] text-[#A09388] text-right">{formatTime(todayMinutes)} total</p>
                </div>
              )}
            </div>
          </div>

          {/* Skill breakdown */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 mb-6">
            <h2 className="text-[13px] font-semibold text-ink-200 mb-4">Skill Breakdown</h2>
            <div className="grid grid-cols-3 gap-4">
              {skillStats.map(skill => {
                const maxMins = Math.max(...skillStats.map(s => s.totalMins), 1)
                return (
                  <div key={skill.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <skill.icon size={12} style={{ color: skill.color }} />
                        <span className="text-[12px] font-medium text-ink-200">{skill.label}</span>
                      </div>
                      {skill.avgScore && (
                        <span className="text-[11px] font-semibold" style={{ color: skill.color }}>{skill.avgScore.toFixed(1)}</span>
                      )}
                    </div>
                    <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(skill.totalMins / maxMins) * 100}%`, background: skill.color }} />
                    </div>
                    <p className="text-[10px] text-[#A09388] mt-1">{skill.count} sessions · {formatTime(skill.totalMins)}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent sessions */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
            <h2 className="text-[13px] font-semibold text-ink-200 mb-3">{t.ielts.recentSessions}</h2>
            <div className="space-y-1.5">
              {[...ieltsSessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8).map(s => {
                const skill = SKILLS.find(sk => sk.key === s.skill)!
                return (
                  <div key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-cream-50 transition-colors">
                    <skill.icon size={13} style={{ color: skill.color }} />
                    <span className="text-[12px] font-medium text-ink-200 w-24">{skill.label}</span>
                    <span className="text-[11px] text-[#A09388]">{formatDate(s.date, 'short')}</span>
                    <span className="text-[11px] text-[#A09388]">{formatTime(s.duration)}</span>
                    {s.score && <span className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded" style={{ background: skill.color + '20', color: skill.color }}>{s.score}</span>}
                    {s.notes && <span className="text-[10px] text-[#C4B9AD] truncate max-w-[120px]">{s.notes}</span>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {showAdd && <AddSessionModal onClose={() => setShowAdd(false)} t={t} skills={SKILLS} />}
    </AppShell>
  )
}
