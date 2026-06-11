'use client'
import { AppShell } from '@/components/layout/AppShell'
import { useStore } from '@/lib/store'
import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/lib/utils'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { BarChart2 } from 'lucide-react'
import { useT } from '@/lib/i18n'

export default function AnalyticsPage() {
  const t = useT()
  const { tasks, ieltsSessions } = useStore()

  const priorityData = Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => ({
    name: cfg.label,
    value: tasks.filter(task => task.priority === key).length,
    color: cfg.color,
  }))

  const statusData = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    name: cfg.label,
    value: tasks.filter(task => task.status === key).length,
    color: cfg.color,
  }))

  // IELTS sessions per skill
  const skillData = ['reading', 'listening', 'writing', 'speaking', 'vocabulary', 'grammar'].map(skill => ({
    name: skill.charAt(0).toUpperCase() + skill.slice(1),
    sessions: ieltsSessions.filter(s => s.skill === skill).length,
    minutes: ieltsSessions.filter(s => s.skill === skill).reduce((a, s) => a + s.duration, 0),
  }))

  // Last 7 days task creation
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      tasks: tasks.filter(task => task.createdAt.startsWith(dateStr)).length,
    }
  })

  return (
    <AppShell>
      <div className="min-h-full">
        <div className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur-sm border-b border-[#E4DDD3] px-6 py-4">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-[#6B6259]" />
            <div>
              <h1 className="text-lg font-semibold text-ink-200">{t.analytics.title}</h1>
              <p className="text-[12px] text-[#A09388]">Your productivity overview</p>
            </div>
          </div>
        </div>

        <div className="p-6 max-w-[1100px]">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Priority distribution */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <h3 className="text-[13px] font-semibold text-ink-200 mb-4">{t.analytics.tasksByPriority}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={priorityData} barSize={28}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A09388' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#A09388' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E8E2D8', borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {priorityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Status distribution */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <h3 className="text-[13px] font-semibold text-ink-200 mb-4">{t.analytics.tasksByStatus}</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="60%" height={200}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E8E2D8', borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5">
                  {statusData.map(s => (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                      <span className="text-[11px] text-[#6B6259]">{s.name}</span>
                      <span className="text-[11px] font-medium text-ink-200 ml-auto">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* IELTS skill breakdown */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <h3 className="text-[13px] font-semibold text-ink-200 mb-4">{t.analytics.ieltsSkills}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={skillData} barSize={20}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#A09388' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#A09388' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E8E2D8', borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="minutes" fill="#F97316" radius={[4, 4, 0, 0]} name="Minutes" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weekly task activity */}
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5">
              <h3 className="text-[13px] font-semibold text-ink-200 mb-4">{t.analytics.taskActivity}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={last7}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#A09388' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#A09388' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E8E2D8', borderRadius: 12, fontSize: 12 }} />
                  <Line type="monotone" dataKey="tasks" stroke="#0A0A0A" strokeWidth={2} dot={{ fill: '#0A0A0A', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
