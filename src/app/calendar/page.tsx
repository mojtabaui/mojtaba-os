'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { useT } from '@/lib/i18n'
import { formatTime, getDaysInMonth, getFirstDayOfMonth, isToday, toLocalDateStr } from '@/lib/utils'
import { gregorianToJalali, formatJalali } from '@/lib/jalali'
import { AppShell } from '@/components/layout/AppShell'
import type { CalendarEvent } from '@/lib/store'
import { ChevronLeft, ChevronRight, Plus, X, Calendar } from 'lucide-react'

const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTHS_FA = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']

const CATEGORY_COLORS: Record<string, string> = {
  migration: '#EF4444',
  ielts: '#F97316',
  balinex: '#3B82F6',
  academy: '#22C55E',
  content: '#A855F7',
  personal: '#6B6259',
}

function EventDot({ event }: { event: CalendarEvent }) {
  return (
    <div
      className="text-[9px] px-1.5 py-0.5 rounded font-medium truncate leading-tight"
      style={{ background: event.color + '20', color: event.color, borderLeft: `2px solid ${event.color}` }}
    >
      {event.time && <span className="opacity-70">{event.time} </span>}{event.title}
    </div>
  )
}

function AddEventModal({ defaultDate, onClose }: { defaultDate?: string; onClose: () => void }) {
  const { addEvent } = useStore()
  const t = useT()
  const [form, setForm] = useState({
    title: '', date: defaultDate || toLocalDateStr(new Date()),
    time: '', duration: 60, category: 'balinex', description: '', color: '#3B82F6'
  })

  const submit = () => {
    if (!form.title) return
    addEvent({ ...form, color: CATEGORY_COLORS[form.category] || form.color })
    onClose()
  }

  const CATEGORY_LABELS: Record<string, string> = {
    migration: t.nav.migration, ielts: t.nav.ielts, balinex: t.nav.balinex,
    academy: t.nav.academy, content: t.nav.content, personal: t.nav.personal,
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white border border-[#E4DDD3] rounded-2xl shadow-modal z-[51]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EAE2]">
          <h3 className="text-[14px] font-semibold text-ink-200">{t.calendar.addEvent}</h3>
          <button onClick={onClose} className="text-[#A09388] hover:text-ink-200"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder={t.calendar.eventTitle} autoFocus
            className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2.5 focus:outline-none focus:border-ink-200 text-ink-200 placeholder:text-[#C4B9AD]" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.calendar.date}</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.calendar.startTime}</label>
              <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.calendar.duration}</label>
              <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: Number(e.target.value) })}
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200" />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">{t.calendar.category}</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200">
                {Object.keys(CATEGORY_COLORS).map(c => <option key={c} value={c}>{CATEGORY_LABELS[c] || c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="px-4 py-2 text-[12px] text-[#6B6259]">{t.common.cancel}</button>
            <button onClick={submit} className="px-4 py-2 text-[12px] bg-ink-200 text-cream-200 rounded-xl">{t.calendar.addEvent}</button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default function CalendarPage() {
  const { events, deleteEvent } = useStore()
  const t = useT()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showJalali, setShowJalali] = useState(false)
  const [view, setView] = useState<'month' | 'week' | 'agenda'>('month')
  const [showAdd, setShowAdd] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [hoverDate, setHoverDate] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const today = new Date()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1))
  const goToday = () => setCurrentDate(new Date())

  const getEventsForDate = (d: Date) => {
    return events.filter(e => e.date === toLocalDateStr(d))
  }

  const getJalaliLabel = (d: Date) => {
    const j = gregorianToJalali(d)
    return j.day
  }

  // Build calendar grid
  const cells: (Date | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  // Week view — current week
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const weekDays = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d })

  // Agenda — next 14 days
  const agendaDays = Array.from({ length: 14 }, (_, i) => { const d = new Date(today); d.setDate(today.getDate() + i); return d })

  return (
    <AppShell>
      <div className="min-h-full flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur-sm border-b border-[#E4DDD3] px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-[#3B82F6]" />
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-white transition-colors text-[#6B6259]"><ChevronRight size={14} /></button>
                <h1 className="text-lg font-semibold text-ink-200 w-48 text-center">
                  {showJalali
                    ? `${MONTHS_FA[gregorianToJalali(new Date(year, month)).month - 1]} ${gregorianToJalali(new Date(year, month)).year}`
                    : `${MONTHS_EN[month]} ${year}`}
                </h1>
                <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-white transition-colors text-[#6B6259]"><ChevronLeft size={14} /></button>
              </div>
              <button onClick={goToday} className="px-3 py-1.5 text-[11px] bg-white border border-[#E4DDD3] rounded-lg text-[#6B6259] hover:border-[#D4C9B8]">{t.calendar.today}</button>
            </div>

            <div className="flex items-center gap-2">
              {/* Jalali toggle */}
              <button
                onClick={() => setShowJalali(!showJalali)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${showJalali ? 'bg-ink-200 text-cream-200' : 'bg-white border border-[#E4DDD3] text-[#6B6259]'}`}
              >
                {showJalali ? `🇮🇷 ${t.calendar.jalali}` : `🌐 ${t.calendar.gregorian}`}
              </button>

              {/* View toggle */}
              <div className="flex bg-white border border-[#E4DDD3] rounded-lg overflow-hidden">
                {([
                  { key: 'month', label: t.calendar.month },
                  { key: 'week', label: t.calendar.week },
                  { key: 'agenda', label: t.calendar.agenda },
                ] as const).map(v => (
                  <button key={v.key} onClick={() => setView(v.key as 'month' | 'week' | 'agenda')}
                    className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${view === v.key ? 'bg-ink-200 text-cream-200' : 'text-[#6B6259] hover:bg-cream-200'}`}>
                    {v.label}
                  </button>
                ))}
              </div>

              <button onClick={() => setShowAdd(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-ink-200 text-cream-200 rounded-lg text-[11px] font-medium hover:bg-ink-300 transition-colors">
                <Plus size={12} /> {t.calendar.addEvent}
              </button>
            </div>
          </div>
        </div>

        {/* Month view */}
        {view === 'month' && (
          <div className="flex-1 p-4">
            <div className="grid grid-cols-7 gap-px bg-[#E4DDD3] rounded-xl overflow-hidden border border-[#E4DDD3]">
              {(showJalali ? t.calendar.weekdays : WEEKDAYS_EN).map((d, i) => (
                <div key={i} className="bg-cream-100 px-3 py-2 text-[10px] font-semibold text-[#A09388] uppercase tracking-wider text-center">{d}</div>
              ))}
              {cells.map((date, i) => {
                if (!date) return <div key={`empty-${i}`} className="bg-cream-50 min-h-[100px]" />
                const dayEvents = getEventsForDate(date)
                const dateStr = toLocalDateStr(date)
                const isT = isToday(date)
                const isSelected = selectedDate === dateStr
                const jDay = showJalali ? getJalaliLabel(date) : null

                return (
                  <motion.div
                    key={dateStr}
                    whileHover={{ backgroundColor: '#FDFAF6' }}
                    onClick={() => { setSelectedDate(dateStr); setShowAdd(true) }}
                    className={`bg-white min-h-[100px] p-2 cursor-pointer transition-colors ${isT ? 'ring-1 ring-inset ring-ink-200' : ''}`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] mb-1 ${isT ? 'bg-ink-200 text-cream-200 font-semibold' : 'text-[#6B6259]'}`}>
                      {date.getDate()}
                    </div>
                    {showJalali && jDay && (
                      <div className="text-[9px] text-[#C4B9AD] mb-1">{jDay}</div>
                    )}
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 3).map(ev => <EventDot key={ev.id} event={ev} />)}
                      {dayEvents.length > 3 && (
                        <p className="text-[9px] text-[#A09388] px-1">+{dayEvents.length - 3} more</p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Week view */}
        {view === 'week' && (
          <div className="flex-1 p-4">
            <div className="grid grid-cols-7 gap-3">
              {weekDays.map(d => {
                const dayEvents = getEventsForDate(d)
                const isT = isToday(d)
                return (
                  <div key={d.toISOString()} className="min-h-[400px]">
                    <div className={`text-center mb-2 p-2 rounded-xl ${isT ? 'bg-ink-200' : 'bg-white border border-[#E4DDD3]'}`}>
                      <p className={`text-[10px] font-medium ${isT ? 'text-cream-400' : 'text-[#A09388]'}`}>{(showJalali ? t.calendar.weekdays : WEEKDAYS_EN)[d.getDay()]}</p>
                      <p className={`text-xl font-semibold ${isT ? 'text-cream-200' : 'text-ink-200'}`}>{d.getDate()}</p>
                      {showJalali && <p className={`text-[9px] ${isT ? 'text-cream-500' : 'text-[#C4B9AD]'}`}>{gregorianToJalali(d).day}</p>}
                    </div>
                    <div className="space-y-1.5">
                      {dayEvents.map(ev => (
                        <div key={ev.id} className="p-2 rounded-lg text-[11px]" style={{ background: ev.color + '15', borderLeft: `3px solid ${ev.color}` }}>
                          <p className="font-medium" style={{ color: ev.color }}>{ev.title}</p>
                          {ev.time && <p className="text-[10px] text-[#A09388]">{ev.time} {ev.duration ? `· ${formatTime(ev.duration)}` : ''}</p>}
                        </div>
                      ))}
                      {dayEvents.length === 0 && (
                        <button onClick={() => { setSelectedDate(toLocalDateStr(d)); setShowAdd(true) }}
                          className="w-full text-[10px] text-[#D4C9B8] border border-dashed border-[#E4DDD3] rounded-lg py-3 hover:border-[#C4B9AD] hover:text-[#A09388] transition-all">
                          +
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Agenda view */}
        {view === 'agenda' && (
          <div className="flex-1 p-4 max-w-2xl">
            <div className="space-y-4">
              {agendaDays.map(d => {
                const dayEvents = getEventsForDate(d)
                const isT = isToday(d)
                return (
                  <div key={d.toISOString()}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[13px] font-semibold ${isT ? 'bg-ink-200 text-cream-200' : 'bg-white border border-[#E4DDD3] text-[#6B6259]'}`}>
                        {d.getDate()}
                      </div>
                      <div>
                        <p className={`text-[12px] font-medium ${isT ? 'text-ink-200' : 'text-[#6B6259]'}`}>
                          {isT ? 'Today — ' : ''}{WEEKDAYS_EN[d.getDay()]}, {MONTHS_EN[d.getMonth()]} {d.getDate()}
                        </p>
                        {showJalali && <p className="text-[10px] text-[#C4B9AD]">{formatJalali(d)}</p>}
                      </div>
                    </div>
                    {dayEvents.length === 0 ? (
                      <p className="text-[11px] text-[#D4C9B8] ml-11">No events</p>
                    ) : (
                      <div className="ml-11 space-y-1.5">
                        {dayEvents.map(ev => (
                          <div key={ev.id} className="flex items-center gap-3 p-2.5 bg-white border border-[#E8E2D8] rounded-xl group hover:border-[#D4C9B8] transition-colors">
                            <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ background: ev.color }} />
                            <div className="flex-1">
                              <p className="text-[13px] font-medium text-ink-200">{ev.title}</p>
                              <p className="text-[10px] text-[#A09388]">{ev.time} {ev.duration ? `· ${formatTime(ev.duration)}` : ''} · {ev.category}</p>
                            </div>
                            <button onClick={() => deleteEvent(ev.id)} className="opacity-0 group-hover:opacity-100 text-[#D4C9B8] hover:text-[#EF4444] transition-all">
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && <AddEventModal defaultDate={selectedDate || undefined} onClose={() => { setShowAdd(false); setSelectedDate(null) }} />}
      </AnimatePresence>
    </AppShell>
  )
}
