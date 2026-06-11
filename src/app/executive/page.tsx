'use client'
import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { PRIORITY_CONFIG } from '@/lib/utils'
import { AppShell } from '@/components/layout/AppShell'
import { getTodayBoth, getLocalToday } from '@/lib/jalali'
import Link from 'next/link'
import {
  Trophy, Plane, BookOpen, Briefcase, GraduationCap,
  Rss, TrendingUp, TrendingDown, Minus, Star
} from 'lucide-react'
import { useT } from '@/lib/i18n'

function ScoreRing({ score, color, label }: { score: number; color: string; label: string }) {
  const r = 28
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#F0EAE2" strokeWidth="5" />
          <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold text-ink-200">{score}</span>
      </div>
      <p className="text-[10px] text-[#A09388] text-center leading-tight">{label}</p>
    </div>
  )
}

function MetricRow({ label, value, trend, color }: { label: string; value: string; trend: 'up' | 'down' | 'flat'; color?: string }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? '#22C55E' : trend === 'down' ? '#EF4444' : '#A09388'
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#F0EAE2] last:border-0">
      <span className="text-[12px] text-[#6B6259]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold" style={color ? { color } : { color: '#1A1410' }}>{value}</span>
        <TrendIcon size={12} style={{ color: trendColor }} />
      </div>
    </div>
  )
}

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } },
}

export default function ExecutivePage() {
  const t = useT()
  const { tasks, migrations, ieltsSessions, students, content, goals, events } = useStore()
  const { gregorian, jalaliShort } = getTodayBoth()
  const today = getLocalToday()

  // Scores
  const doneTasks = tasks.filter(task => task.status === 'done').length
  const totalTasks = tasks.length
  const productivityScore = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const appliedMigrations = migrations.filter(m => ['applied', 'interview', 'waiting', 'accepted'].includes(m.status)).length
  const migrationScore = migrations.length > 0 ? Math.round((appliedMigrations / migrations.length) * 100) : 0

  const last7 = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]
  const recentIELTS = ieltsSessions.filter(s => s.date >= last7)
  const ieltsScore = Math.min(Math.round((recentIELTS.length / 7) * 100), 100)

  const pendingStudents = students.filter(s => s.pendingResponse).length
  const academyScore = students.length > 0 ? Math.round(((students.length - pendingStudents) / students.length) * 100) : 100

  const publishedContent = content.filter(c => c.status === 'published').length
  const contentScore = Math.min(publishedContent * 5, 100)

  const balinexDone = tasks.filter(task => task.priority === 'p3' && task.status === 'done').length
  const balinexTotal = tasks.filter(task => task.priority === 'p3').length
  const balinexScore = balinexTotal > 0 ? Math.round((balinexDone / balinexTotal) * 100) : 0

  const avgGoalProgress = goals.length > 0
    ? Math.round(goals.reduce((a, g) => a + Math.min(g.current / g.target, 1), 0) / goals.length * 100)
    : 0

  const lifeScore = Math.round((productivityScore + migrationScore + ieltsScore + academyScore + contentScore + balinexScore) / 6)

  const todayEvents = events.filter(e => e.date === today)

  const scoreLabel =
    lifeScore >= 80 ? t.executive.scoreExceptional :
    lifeScore >= 60 ? t.executive.scoreOnTrack :
    lifeScore >= 40 ? t.executive.scoreGrow :
    t.executive.scoreFocus

  const scoreData = [
    { score: migrationScore,  color: '#EF4444', label: t.executive.migrationScore },
    { score: ieltsScore,      color: '#F97316', label: t.executive.ieltsScore },
    { score: balinexScore,    color: '#3B82F6', label: t.executive.balinexScore },
    { score: academyScore,    color: '#22C55E', label: t.executive.academyScore },
    { score: contentScore,    color: '#A855F7', label: t.executive.contentScore },
    { score: productivityScore, color: '#6B6259', label: t.executive.tasksScore },
  ]

  return (
    <AppShell>
      <div className="min-h-full">
        <div className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur-sm border-b border-[#E4DDD3] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-[#EAB308]" />
              <div>
                <h1 className="text-lg font-semibold text-ink-200">{t.executive.title}</h1>
                <p className="text-[12px] text-[#A09388]">{gregorian} · {jalaliShort}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#A09388]">{t.executive.overallScore}</span>
              <span className="text-2xl font-bold text-ink-200">{lifeScore}</span>
              <span className="text-[11px] text-[#A09388]">/ 100</span>
            </div>
          </div>
        </div>

        <motion.div variants={stagger.container} initial="hidden" animate="show" className="p-6 max-w-[1100px]">

          {/* Life Score Banner */}
          <motion.div variants={stagger.item} className="bg-[#0A0A0A] rounded-2xl p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px] text-[#3A3A3A] uppercase tracking-wider mb-1">{t.executive.overallScore}</p>
                <p className="text-5xl font-bold text-cream-200">{lifeScore}<span className="text-2xl text-[#5A5550]">/100</span></p>
                <p className="text-[12px] text-[#5A5550] mt-1">{scoreLabel}</p>
              </div>
              <div className="flex gap-6">
                {scoreData.map(s => <ScoreRing key={s.label} {...s} />)}
              </div>
            </div>
            <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${lifeScore}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, #EF4444, #F97316, #EAB308, #22C55E)` }}
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-12 gap-4">

            {/* Goals Overview */}
            <motion.div variants={stagger.item} className="col-span-4">
              <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 h-full">
                <h2 className="text-[12px] font-semibold text-ink-200 mb-4 flex items-center gap-1.5">
                  <Star size={13} className="text-[#EAB308]" /> {t.executive.goalsOverview}
                </h2>
                <div className="space-y-3">
                  {goals.map(g => {
                    const pct = Math.min(Math.round((g.current / g.target) * 100), 100)
                    const cfg = PRIORITY_CONFIG[g.priority]
                    return (
                      <div key={g.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-[11px] text-ink-200 truncate flex-1 mr-2">{g.title}</span>
                          <span className="text-[10px] font-semibold" style={{ color: cfg.color }}>{pct}%</span>
                        </div>
                        <div className="h-1 bg-cream-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cfg.color }} />
                        </div>
                      </div>
                    )
                  })}
                  {goals.length === 0 && <p className="text-[12px] text-[#C4B9AD]">{t.executive.noGoals}</p>}
                </div>
                <div className="mt-4 pt-3 border-t border-[#F0EAE2]">
                  <div className="flex justify-between">
                    <span className="text-[11px] text-[#A09388]">{t.executive.avgProgress}</span>
                    <span className="text-[12px] font-bold text-ink-200">{avgGoalProgress}%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Workspace Metrics */}
            <motion.div variants={stagger.item} className="col-span-4">
              <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 h-full">
                <h2 className="text-[12px] font-semibold text-ink-200 mb-4 flex items-center gap-1.5">
                  <TrendingUp size={13} /> {t.executive.workspaceMetrics}
                </h2>
                <MetricRow label={`${t.executive.migrationScore} — ${t.executive.appsInProgress}`} value={`${appliedMigrations}/${migrations.length}`} trend="up" color="#EF4444" />
                <MetricRow label={`${t.executive.ieltsScore} (۷ روز)`} value={`${recentIELTS.length} جلسه`} trend={recentIELTS.length >= 5 ? 'up' : 'down'} color="#F97316" />
                <MetricRow label={`${t.executive.balinexScore} — ${t.executive.tasksScore}`} value={`${balinexDone}/${balinexTotal} ${t.executive.done}`} trend="flat" color="#3B82F6" />
                <MetricRow label={`${t.executive.academyScore} — ${t.executive.pending}`} value={`${pendingStudents}`} trend={pendingStudents === 0 ? 'up' : 'down'} color="#22C55E" />
                <MetricRow label={t.executive.contentScore} value={`${publishedContent}`} trend="up" color="#A855F7" />
                <MetricRow label={t.executive.tasksScore} value={`${doneTasks}/${totalTasks}`} trend={productivityScore >= 50 ? 'up' : 'down'} />
              </div>
            </motion.div>

            {/* Today's Schedule */}
            <motion.div variants={stagger.item} className="col-span-4">
              <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 h-full">
                <h2 className="text-[12px] font-semibold text-ink-200 mb-4">{t.executive.todaySchedule}</h2>
                <div className="space-y-2 overflow-y-auto max-h-52">
                  {todayEvents.length === 0 ? (
                    <p className="text-[12px] text-[#C4B9AD] py-6 text-center">{t.executive.noSchedule}</p>
                  ) : (
                    [...todayEvents].sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99')).map(ev => (
                      <div key={ev.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-cream-50 border border-[#F0EAE2]">
                        <div className="w-0.5 h-8 rounded-full" style={{ background: ev.color }} />
                        <div>
                          <p className="text-[12px] font-medium text-ink-200">{ev.title}</p>
                          <p className="text-[10px] text-[#A09388]">{ev.time || '—'}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-[#F0EAE2] grid grid-cols-2 gap-2">
                  <Link href="/tasks">
                    <div className="text-center p-2 bg-cream-50 rounded-xl hover:bg-cream-200 transition-colors cursor-pointer">
                      <p className="text-lg font-bold text-ink-200">{tasks.filter(task => task.status === 'in-progress').length}</p>
                      <p className="text-[9px] text-[#A09388]">{t.executive.inProgress}</p>
                    </div>
                  </Link>
                  <Link href="/tasks">
                    <div className="text-center p-2 bg-cream-50 rounded-xl hover:bg-cream-200 transition-colors cursor-pointer">
                      <p className="text-lg font-bold text-[#22C55E]">{doneTasks}</p>
                      <p className="text-[9px] text-[#A09388]">{t.executive.completed}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Priority Breakdown */}
            <motion.div variants={stagger.item} className="col-span-12">
              <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
                <h2 className="text-[12px] font-semibold text-ink-200 mb-4">{t.executive.priorityBreakdown}</h2>
                <div className="grid grid-cols-5 gap-4">
                  {(Object.entries(PRIORITY_CONFIG) as [string, typeof PRIORITY_CONFIG[keyof typeof PRIORITY_CONFIG]][]).map(([key, cfg]) => {
                    const pTasks = tasks.filter(task => task.priority === key)
                    const pDone = pTasks.filter(task => task.status === 'done').length
                    const pct = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0
                    const WorkspaceIcon = { p1: Plane, p2: BookOpen, p3: Briefcase, p4: GraduationCap, p5: Rss }[key] || Star
                    return (
                      <div key={key} className="text-center p-4 rounded-2xl border border-[#F0EAE2] hover:border-[#E4DDD3] transition-colors">
                        <div className="w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ background: cfg.bg }}>
                          <WorkspaceIcon size={15} style={{ color: cfg.color }} />
                        </div>
                        <p className="text-[11px] font-semibold text-ink-200">{cfg.label}</p>
                        <p className="text-2xl font-bold mt-1" style={{ color: cfg.color }}>{pct}%</p>
                        <p className="text-[10px] text-[#A09388]">{pDone}/{pTasks.length} {t.executive.tasksSuffix}</p>
                        <div className="h-1 bg-cream-200 rounded-full overflow-hidden mt-2">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cfg.color }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </AppShell>
  )
}
