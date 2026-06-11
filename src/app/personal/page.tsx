'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { useStore } from '@/lib/store'
import type { EntertainmentItem } from '@/lib/store'
import { User, Heart, Moon, Zap, Smile, Brain, Gamepad2, Film, Tv, Star, Plus, X, Trash2 } from 'lucide-react'
import { useT } from '@/lib/i18n'

type EntType = EntertainmentItem['type']
type EntStatus = EntertainmentItem['status']

const TYPE_ICONS: Record<EntType, React.ElementType> = { game: Gamepad2, movie: Film, series: Tv }
const TYPE_COLORS: Record<EntType, string> = { game: '#22C55E', movie: '#3B82F6', series: '#A855F7' }

function StarRating({ value, onChange }: { value?: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} onClick={() => onChange(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}>
          <Star size={14} fill={(hover || value || 0) >= i ? '#EAB308' : 'none'} stroke={(hover || value || 0) >= i ? '#EAB308' : '#D4C9B8'} />
        </button>
      ))}
    </div>
  )
}

function EntCard({ item, onUpdate, onDelete }: { item: EntertainmentItem; onUpdate: (u: Partial<EntertainmentItem>) => void; onDelete: () => void }) {
  const TypeIcon = TYPE_ICONS[item.type]
  const color = TYPE_COLORS[item.type]
  const STATUS_COLORS: Record<EntStatus, string> = { completed: '#22C55E', 'in-progress': '#F97316', wishlist: '#A09388' }

  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
      className="bg-white border border-[#E8E2D8] rounded-xl p-3 hover:border-[#D4C9B8] hover:shadow-sm transition-all group">
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + '15' }}>
          <TypeIcon size={15} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-ink-200 truncate">{item.title}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[item.status] }} />
            {item.platform && <span className="text-[10px] text-[#A09388]">{item.platform}</span>}
          </div>
        </div>
        <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 text-[#D4C9B8] hover:text-[#EF4444] transition-all flex-shrink-0">
          <Trash2 size={12} />
        </button>
      </div>
      <div className="flex items-center justify-between mt-2.5">
        <StarRating value={item.rating} onChange={v => onUpdate({ rating: v === item.rating ? undefined : v })} />
        <select value={item.status} onChange={e => onUpdate({ status: e.target.value as EntStatus })}
          className="text-[10px] bg-transparent border-0 text-[#A09388] focus:outline-none cursor-pointer"
          style={{ color: STATUS_COLORS[item.status] }}>
          <option value="completed">تجربه‌شده</option>
          <option value="in-progress">در حال تجربه</option>
          <option value="wishlist">لیست آرزو</option>
        </select>
      </div>
      {item.notes && <p className="text-[11px] text-[#A09388] mt-1.5 leading-relaxed">{item.notes}</p>}
    </motion.div>
  )
}

function AddEntModal({ onClose }: { onClose: () => void }) {
  const t = useT()
  const { addEntertainment } = useStore()
  const [form, setForm] = useState<Omit<EntertainmentItem, 'id'>>({ title: '', type: 'movie', status: 'completed', rating: undefined, platform: '', notes: '' })

  const submit = () => {
    if (!form.title.trim()) return
    addEntertainment({ ...form, platform: form.platform || undefined, notes: form.notes || undefined })
    onClose()
  }

  const TYPE_LABELS: Record<EntType, string> = { game: t.entertainment.game, movie: t.entertainment.movie, series: t.entertainment.series }
  const STATUS_LABELS: Record<EntStatus, string> = { completed: t.entertainment.completed, 'in-progress': t.entertainment.inProgress, wishlist: t.entertainment.wishlist }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] bg-white border border-[#E4DDD3] rounded-2xl shadow-modal z-[51]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EAE2]">
          <h3 className="text-[14px] font-semibold text-ink-200">{t.entertainment.addItem}</h3>
          <button onClick={onClose} className="text-[#A09388] hover:text-ink-200"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder={t.entertainment.titlePlaceholder} autoFocus
            className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2.5 focus:outline-none focus:border-ink-200 text-ink-200 placeholder:text-[#C4B9AD]" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.entertainment.type}</label>
              <div className="flex gap-1.5">
                {(['game', 'movie', 'series'] as EntType[]).map(type => {
                  const Icon = TYPE_ICONS[type]
                  return (
                    <button key={type} onClick={() => setForm({ ...form, type })}
                      className={`flex-1 py-2 rounded-xl border text-[11px] flex flex-col items-center gap-1 transition-all ${form.type === type ? 'border-ink-200 bg-cream-200' : 'border-[#E8E2D8]'}`}>
                      <Icon size={13} style={{ color: TYPE_COLORS[type] }} />
                      <span className="text-[9px]">{TYPE_LABELS[type]}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.entertainment.status}</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as EntStatus })}
                className="w-full text-[12px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2.5 focus:outline-none text-ink-200">
                {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.entertainment.platform}</label>
            <input value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}
              placeholder="Steam, Netflix, PS5..."
              className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200 placeholder:text-[#C4B9AD]" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.entertainment.rateIt}</label>
            <StarRating value={form.rating} onChange={v => setForm({ ...form, rating: v === form.rating ? undefined : v })} />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.entertainment.notes}</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
              className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200 resize-none" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="px-4 py-2 text-[12px] text-[#6B6259]">{t.common.cancel}</button>
            <button onClick={submit} className="px-4 py-2 text-[12px] bg-ink-200 text-cream-200 rounded-xl">{t.common.add}</button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default function PersonalPage() {
  const t = useT()
  const { entertainment, updateEntertainment, deleteEntertainment } = useStore()
  const [mood, setMood] = useState(4)
  const [energy, setEnergy] = useState(3)
  const [stress, setStress] = useState(2)
  const [sleep, setSleep] = useState(7)
  const [showAdd, setShowAdd] = useState(false)
  const [typeFilter, setTypeFilter] = useState<EntType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<EntStatus | 'all'>('all')

  const MOOD_OPTIONS = [
    { value: 1, label: t.personal.rough, emoji: '😔' },
    { value: 2, label: t.personal.low, emoji: '😕' },
    { value: 3, label: t.personal.okay, emoji: '😐' },
    { value: 4, label: t.personal.good, emoji: '😊' },
    { value: 5, label: t.personal.great, emoji: '😄' },
  ]

  const filtered = entertainment.filter(e =>
    (typeFilter === 'all' || e.type === typeFilter) &&
    (statusFilter === 'all' || e.status === statusFilter)
  )

  const TYPE_LABELS: Record<EntType, string> = { game: t.entertainment.game, movie: t.entertainment.movie, series: t.entertainment.series }
  const STATUS_LABELS: Record<EntStatus, string> = { completed: t.entertainment.completed, 'in-progress': t.entertainment.inProgress, wishlist: t.entertainment.wishlist }

  return (
    <AppShell>
      <div className="min-h-full">
        <div className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur-sm border-b border-[#E4DDD3] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={16} className="text-[#6B6259]" />
              <div>
                <h1 className="text-lg font-semibold text-ink-200">{t.personal.title}</h1>
                <p className="text-[12px] text-[#A09388]">{t.personal.subtitle}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-4xl xl:max-w-[1400px] 2xl:max-w-[1800px] 3xl:max-w-[2400px] space-y-6">

          {/* Today's check-in */}
          <div className="bg-[#0A0A0A] rounded-2xl p-6">
            <h2 className="text-[13px] font-semibold text-cream-300 mb-4 uppercase tracking-wider">{t.personal.checkIn}</h2>
            <div className="grid grid-cols-2 gap-6">
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
              <div>
                <p className="text-[11px] text-[#5A5550] mb-2 flex items-center gap-1.5"><Zap size={11} /> {t.personal.energy}</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => setEnergy(v)} className={`flex-1 h-7 rounded-lg transition-all ${v <= energy ? 'bg-[#F97316]' : 'bg-[#1E1E1E]'}`} />
                  ))}
                </div>
                <p className="text-[10px] text-[#5A5550] mt-1">{energy}/5</p>
              </div>
              <div>
                <p className="text-[11px] text-[#5A5550] mb-2 flex items-center gap-1.5"><Brain size={11} /> {t.personal.stress}</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => setStress(v)} className={`flex-1 h-7 rounded-lg transition-all ${v <= stress ? 'bg-[#EF4444]' : 'bg-[#1E1E1E]'}`} />
                  ))}
                </div>
                <p className="text-[10px] text-[#5A5550] mt-1">{stress}/5</p>
              </div>
              <div>
                <p className="text-[11px] text-[#5A5550] mb-2 flex items-center gap-1.5"><Moon size={11} /> {t.personal.sleep} ({t.personal.hours})</p>
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
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
            <h2 className="text-[13px] font-semibold text-ink-200 mb-3 flex items-center gap-2">
              <Heart size={13} className="text-[#EF4444]" /> {t.personal.reflection}
            </h2>
            <div className="space-y-3">
              {[t.personal.wellQuestion, t.personal.challengeQuestion, t.personal.improveQuestion].map(q => (
                <div key={q}>
                  <p className="text-[11px] text-[#6B6259] mb-1">{q}</p>
                  <textarea rows={2} placeholder={t.personal.reflectionPlaceholder}
                    className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200 resize-none placeholder:text-[#C4B9AD]" />
                </div>
              ))}
            </div>
          </div>

          {/* Entertainment Tracker */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-semibold text-ink-200 flex items-center gap-2">
                <Gamepad2 size={14} className="text-[#22C55E]" /> {t.entertainment.title}
                <span className="text-[11px] font-normal text-[#A09388]">— {t.entertainment.subtitle}</span>
              </h2>
              <button onClick={() => setShowAdd(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-ink-200 text-cream-200 rounded-xl text-[11px] hover:bg-ink-300 transition-colors">
                <Plus size={11} /> {t.entertainment.addItem}
              </button>
            </div>

            {/* Stats bar */}
            <div className="flex gap-3 mb-4">
              {(['game', 'movie', 'series'] as EntType[]).map(type => {
                const count = entertainment.filter(e => e.type === type).length
                const Icon = TYPE_ICONS[type]
                return (
                  <div key={type} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: TYPE_COLORS[type] + '15' }}>
                    <Icon size={11} style={{ color: TYPE_COLORS[type] }} />
                    <span className="text-[11px] font-medium" style={{ color: TYPE_COLORS[type] }}>{count} {TYPE_LABELS[type]}</span>
                  </div>
                )
              })}
              <span className="ms-auto text-[11px] text-[#A09388]">
                {entertainment.filter(e => e.status === 'completed').length} تجربه‌شده
              </span>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <button onClick={() => setTypeFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${typeFilter === 'all' ? 'bg-ink-200 text-cream-200' : 'bg-cream-50 border border-[#E4DDD3] text-[#6B6259]'}`}>
                {t.entertainment.all}
              </button>
              {(['game', 'movie', 'series'] as EntType[]).map(type => (
                <button key={type} onClick={() => setTypeFilter(type === typeFilter ? 'all' : type)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${typeFilter === type ? 'ring-2 ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                  style={{ background: TYPE_COLORS[type] + '15', color: TYPE_COLORS[type] }}>
                  {TYPE_LABELS[type]}
                </button>
              ))}
              <div className="w-px bg-[#E4DDD3] mx-1" />
              {(['completed', 'in-progress', 'wishlist'] as EntStatus[]).map(s => (
                <button key={s} onClick={() => setStatusFilter(s === statusFilter ? 'all' : s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${statusFilter === s ? 'bg-ink-200 text-cream-200' : 'bg-cream-50 border border-[#E4DDD3] text-[#6B6259]'}`}>
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-[#C4B9AD] text-[13px]">{t.entertainment.noItems}</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <AnimatePresence>
                  {filtered.map(item => (
                    <EntCard key={item.id} item={item}
                      onUpdate={u => updateEntertainment(item.id, u)}
                      onDelete={() => deleteEntertainment(item.id)} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

        </div>
      </div>

      <AnimatePresence>
        {showAdd && <AddEntModal onClose={() => setShowAdd(false)} />}
      </AnimatePresence>
    </AppShell>
  )
}
