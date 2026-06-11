'use client'
import { useStore } from '@/lib/store'
import { useT } from '@/lib/i18n'
import { PRIORITY_CONFIG, STATUS_CONFIG, formatDate, formatTime } from '@/lib/utils'
import { getTodayBoth, getLocalToday } from '@/lib/jalali'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { BurnoutAlert } from '@/components/shared/BurnoutAlert'
import {
  Clock, TrendingUp, ArrowRight, CheckCircle2, Check,
  Plane, BookOpen, Briefcase, GraduationCap, Rss, Calendar,
  AlertCircle, Star
} from 'lucide-react'

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
      <p className="text-[11px] text-[#A09388] uppercase tracking-wider font-medium mb-2">{label}</p>
      <p className="text-2xl font-semibold text-ink-200" style={color ? { color } : {}}>{value}</p>
      {sub && <p className="text-[11px] text-[#A09388] mt-1">{sub}</p>}
    </div>
  )
}

function PriorityChip({ priority }: { priority: keyof typeof PRIORITY_CONFIG }) {
  const cfg = PRIORITY_CONFIG[priority]
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ background: cfg.bg, color: cfg.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.short} {cfg.label}
    </span>
  )
}

const stagger = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
}

export default function DashboardPage() {
  const { tasks, events, ieltsSessions, migrations, students, language, completedEventIds, toggleEventComplete } = useStore()
  const t = useT()
  const { gregorian, jalaliShort } = getTodayBoth()
  const today = getLocalToday()
  const isRtl = language === 'fa'

  // Today's focus tasks — sorted by priority order
  const priorityOrder = { p1: 0, p2: 1, p3: 2, p4: 3, p5: 4 }
  const todayTasks = tasks
    .filter(t => t.status !== 'done' && t.status !== 'cancelled')
    .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .slice(0, 3)

  // Upcoming deadlines (next 7 days)
  const upcoming = tasks
    .filter(t => t.dueDate && t.dueDate >= today && t.status !== 'done' && t.status !== 'cancelled')
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))
    .slice(0, 4)

  // Today's events
  const todayEvents = events.filter(e => e.date === today)

  // Stats
  const doneTasks = tasks.filter(t => t.status === 'done').length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  // IELTS streak
  const sortedSessions = [...ieltsSessions].sort((a, b) => b.date.localeCompare(a.date))
  let streak = 0
  const checkDate = new Date()
  for (const session of sortedSessions) {
    const d = new Date(session.date).toISOString().split('T')[0]
    const cd = checkDate.toISOString().split('T')[0]
    if (d === cd) { streak++; checkDate.setDate(checkDate.getDate() - 1) }
    else if (d < cd) break
  }

  // Migration progress
  const applied = migrations.filter(m => ['applied', 'interview', 'waiting', 'accepted'].includes(m.status)).length
  const pendingStudents = students.filter(s => s.pendingResponse).length

  const focusLabels = t.dashboard.focusLabels as unknown as string[]

  return (
    <motion.div
      variants={stagger.container}
      initial="hidden"
      animate="show"
      className="min-h-full max-w-[1200px] mx-auto"
    >
    <BurnoutAlert />
    <div className="p-6">
      {/* Header */}
      <motion.div variants={stagger.item} className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink-200">{isRtl ? 'سلام مجتبا 👋' : 'Good morning, Mojtaba'}</h1>
            <p className="text-[13px] text-[#A09388] mt-1">{gregorian}</p>
          </div>
          <div className="flex gap-2">
            {(['p1', 'p2', 'p3', 'p4', 'p5'] as const).map(p => (
              <PriorityChip key={p} priority={p} />
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-12 gap-4">

        {/* Today's Focus — events + tasks merged */}
        <motion.div variants={stagger.item} className="col-span-5">
          <div className="bg-ink-200 rounded-2xl p-5 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Star size={14} className="text-cream-400" />
              <h2 className="text-[12px] font-medium text-cream-300 uppercase tracking-wider">{isRtl ? 'برنامه امروز' : "Today's Plan"}</h2>
            </div>

            {/* Today's events as schedule blocks with completion toggle */}
            {todayEvents.length > 0 && (
              <div className="space-y-2 mb-3">
                {[...todayEvents]
                  .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
                  .map(ev => {
                    const done = completedEventIds.includes(ev.id)
                    return (
                      <div key={ev.id} className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${done ? 'bg-white/3 opacity-60' : 'bg-white/5'}`}>
                        <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: ev.color }} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-[12px] font-medium truncate ${done ? 'line-through text-[#5A5550]' : 'text-cream-200'}`}>{ev.title}</p>
                          <p className="text-[10px] text-[#5A5550]">
                            {ev.time ? `${ev.time}${ev.duration ? ` · ${formatTime(ev.duration)}` : ''}` : (isRtl ? 'بدون ساعت' : 'All day')}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleEventComplete(ev.id)}
                          className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${done ? 'border-transparent' : 'border-white/20 hover:border-white/50'}`}
                          style={done ? { background: ev.color } : {}}
                        >
                          {done && <Check size={10} className="text-white" />}
                        </button>
                      </div>
                    )
                  })}
              </div>
            )}

            {/* Active tasks */}
            {todayTasks.length > 0 && (
              <div className="space-y-2.5">
                {todayTasks.length > 0 && todayEvents.length > 0 && (
                  <div className="border-t border-white/10 pt-2">
                    <p className="text-[10px] text-[#3A3A3A] uppercase tracking-wider mb-2">{isRtl ? 'وظایف' : 'Tasks'}</p>
                  </div>
                )}
                {todayTasks.map((task, i) => {
                  const cfg = PRIORITY_CONFIG[task.priority]
                  return (
                    <div key={task.id} className="flex items-start gap-2.5">
                      <div className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-semibold mt-0.5"
                        style={{ background: cfg.color, color: 'white' }}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-cream-200 leading-snug truncate">{task.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[9px] font-medium px-1 py-0.5 rounded" style={{ background: `${cfg.color}25`, color: cfg.color }}>{cfg.label}</span>
                          {task.estimatedTime && <span className="text-[9px] text-[#5A5550]"><Clock size={8} className="inline" /> {formatTime(task.estimatedTime)}</span>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {todayTasks.length === 0 && todayEvents.length === 0 && (
              <p className="text-[13px] text-[#5A5550]">{t.dashboard.noTasksToday}</p>
            )}

            <div className="mt-auto pt-4 flex gap-3">
              <Link href="/tasks" className="flex items-center gap-1 text-[11px] text-cream-500 hover:text-cream-300 transition-colors">
                {isRtl ? <><ArrowRight size={10} className="rotate-180" /> وظایف</> : <>Tasks <ArrowRight size={10} /></>}
              </Link>
              <Link href="/calendar" className="flex items-center gap-1 text-[11px] text-cream-500 hover:text-cream-300 transition-colors">
                {isRtl ? <><ArrowRight size={10} className="rotate-180" /> تقویم</> : <>Calendar <ArrowRight size={10} /></>}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={stagger.item} className="col-span-7 grid grid-cols-3 gap-3">
          <StatCard label={isRtl ? 'تکمیل' : 'Completion'} value={`${completionRate}%`} sub={isRtl ? `${doneTasks}/${totalTasks} انجام‌شده` : `${doneTasks}/${totalTasks} tasks done`} />
          <StatCard label={isRtl ? 'استریک آیلتس' : 'IELTS Streak'} value={`${streak}d`} sub={isRtl ? 'روز متوالی' : 'consecutive days'} color="#F97316" />
          <StatCard label={isRtl ? 'مهاجرت' : 'Migration'} value={`${applied}/${migrations.length}`} sub={isRtl ? 'دانشگاه درخواست شده' : 'universities applied'} color="#EF4444" />
          <StatCard label={isRtl ? 'رویداد امروز' : "Today's Events"} value={todayEvents.length} sub={isRtl ? 'برنامه‌ریزی شده' : 'scheduled'} />
          <StatCard label={isRtl ? 'دانشجویان' : 'Students'} value={pendingStudents} sub={isRtl ? 'منتظر پاسخ' : 'need response'} color="#22C55E" />
          <StatCard label={isRtl ? 'وظایف فعال' : 'Active Tasks'} value={tasks.filter(t => t.status === 'in-progress').length} sub={isRtl ? 'در جریان' : 'in progress'} />
        </motion.div>

        {/* Calendar Snapshot */}
        <motion.div variants={stagger.item} className="col-span-4">
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4 h-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-semibold text-ink-200 flex items-center gap-1.5">
                <Calendar size={13} /> {t.dashboard.calendarSnapshot}
              </h2>
              <Link href="/calendar" className="text-[11px] text-[#A09388] hover:text-ink-200 transition-colors">{isRtl ? '← مشاهده' : 'View →'}</Link>
            </div>
            <div className="space-y-2">
              {todayEvents.length === 0 && (
                <p className="text-[12px] text-[#C4B9AD] py-4 text-center">{t.dashboard.noEvents}</p>
              )}
              {todayEvents.map(ev => (
                <div key={ev.id} className="flex items-center gap-2.5">
                  <div className="w-0.5 h-8 rounded-full" style={{ background: ev.color }} />
                  <div>
                    <p className="text-[12px] font-medium text-ink-200">{ev.title}</p>
                    <p className="text-[10px] text-[#A09388]">{ev.time} {ev.duration ? `· ${formatTime(ev.duration)}` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div variants={stagger.item} className="col-span-4">
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4 h-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-semibold text-ink-200 flex items-center gap-1.5">
                <AlertCircle size={13} /> {t.dashboard.upcomingDeadlines}
              </h2>
            </div>
            <div className="space-y-2.5">
              {upcoming.map(task => {
                const cfg = PRIORITY_CONFIG[task.priority]
                return (
                  <div key={task.id} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-ink-200 truncate">{task.title}</p>
                    </div>
                    <span className="text-[10px] text-[#A09388] flex-shrink-0">{formatDate(task.dueDate!, 'relative')}</span>
                  </div>
                )
              })}
              {upcoming.length === 0 && (
                <p className="text-[12px] text-[#C4B9AD] py-4 text-center">{t.dashboard.noUpcoming}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Priority Workspace Overview */}
        <motion.div variants={stagger.item} className="col-span-4">
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4 h-full">
            <h2 className="text-[12px] font-semibold text-ink-200 mb-3 flex items-center gap-1.5">
              <TrendingUp size={13} /> {t.dashboard.workspaceProgress}
            </h2>
            <div className="space-y-3">
              {([
                { label: t.nav.migration, priority: 'p1', href: '/migration', icon: Plane, value: `${applied}/${migrations.length}`, pct: migrations.length ? (applied / migrations.length) * 100 : 0 },
                { label: t.nav.ielts, priority: 'p2', href: '/ielts', icon: BookOpen, value: `${ieltsSessions.filter(s => s.date === today).length}`, pct: Math.min((ieltsSessions.filter(s => s.date >= new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]).length / 7) * 100, 100) },
                { label: t.nav.balinex, priority: 'p3', href: '/balinex', icon: Briefcase, value: `${tasks.filter(t => t.category === 'balinex' && t.status === 'done').length}`, pct: tasks.filter(t => t.category === 'balinex').length ? (tasks.filter(t => t.category === 'balinex' && t.status === 'done').length / tasks.filter(t => t.category === 'balinex').length) * 100 : 0 },
                { label: t.nav.academy, priority: 'p4', href: '/academy', icon: GraduationCap, value: `${students.length}`, pct: students.length ? ((students.length - pendingStudents) / students.length) * 100 : 0 },
                { label: t.nav.content, priority: 'p5', href: '/content', icon: Rss, value: '8', pct: 40 },
              ] as const).map(ws => {
                const cfg = PRIORITY_CONFIG[ws.priority as keyof typeof PRIORITY_CONFIG]
                return (
                  <Link key={ws.label} href={ws.href}>
                    <div className="group cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <ws.icon size={11} style={{ color: cfg.color }} />
                          <span className="text-[11px] font-medium text-ink-200">{ws.label}</span>
                        </div>
                        <span className="text-[10px] text-[#A09388]">{ws.value}</span>
                      </div>
                      <div className="h-1 bg-cream-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${ws.pct}%`, background: cfg.color }} />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={stagger.item} className="col-span-12">
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-semibold text-ink-200 flex items-center gap-1.5">
                {t.dashboard.recentTasks}
              </h2>
              <Link href="/tasks" className="text-[11px] text-[#A09388] hover:text-ink-200">{isRtl ? '← همه وظایف' : 'View all →'}</Link>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {tasks.slice(0, 8).map(task => {
                const cfg = PRIORITY_CONFIG[task.priority]
                const stCfg = STATUS_CONFIG[task.status]
                return (
                  <div key={task.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-cream-50 border border-[#F0EAE2] hover:border-[#E4DDD3] transition-colors cursor-pointer">
                    <CheckCircle2 size={13} style={{ color: stCfg.color }} className="flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-ink-200 truncate font-medium">{task.title}</p>
                      <p className="text-[10px]" style={{ color: cfg.color }}>{cfg.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

      </div>
    </div>
    </motion.div>
  )
}
