'use client'
import { useStore } from '@/lib/store'
import { useT } from '@/lib/i18n'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import { getLocalToday } from '@/lib/jalali'
import { toLocalDateStr } from '@/lib/utils'

export function BurnoutAlert() {
  const { tasks, ieltsSessions } = useStore()
  const t = useT()
  const [dismissed, setDismissed] = useState(false)

  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())

  const overdueTasks = tasks.filter(t =>
    t.dueDate && t.dueDate < getLocalToday() &&
    t.status !== 'done' && t.status !== 'cancelled'
  ).length

  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length
  const weekIELTS = ieltsSessions.filter(s => s.date >= toLocalDateStr(weekStart)).length
  const totalEstimatedHours = tasks
    .filter(t => t.status !== 'done' && t.status !== 'cancelled' && t.estimatedTime)
    .reduce((a, t) => a + (t.estimatedTime || 0), 0) / 60

  let burnoutScore = 0
  if (overdueTasks > 5) burnoutScore += 30
  else if (overdueTasks > 2) burnoutScore += 15
  if (inProgressCount > 6) burnoutScore += 25
  else if (inProgressCount > 3) burnoutScore += 10
  if (totalEstimatedHours > 80) burnoutScore += 25
  else if (totalEstimatedHours > 60) burnoutScore += 10
  if (weekIELTS > 10) burnoutScore += 20

  const shouldShow = burnoutScore >= 30 && !dismissed
  if (!shouldShow) return null

  const level = burnoutScore >= 60 ? 'high' : 'medium'
  const tb = t.burnout

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className={`mx-6 mt-4 rounded-2xl p-4 border flex items-start gap-3 ${
          level === 'high' ? 'bg-[#FEF2F2] border-[#FECACA]' : 'bg-[#FFFBEB] border-[#FDE68A]'
        }`}
      >
        <AlertTriangle size={16} className={level === 'high' ? 'text-[#EF4444]' : 'text-[#F59E0B]'} />
        <div className="flex-1">
          <p className={`text-[13px] font-semibold ${level === 'high' ? 'text-[#DC2626]' : 'text-[#B45309]'}`}>
            {level === 'high' ? tb.highTitle : tb.mediumTitle}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: level === 'high' ? '#EF4444' : '#F59E0B' }}>
            {overdueTasks > 0 && `${overdueTasks} ${tb.overdue} · `}
            {inProgressCount > 3 && `${inProgressCount} ${tb.inProgress} · `}
            {totalEstimatedHours > 40 && `${Math.round(totalEstimatedHours)} ${tb.estRemaining}`}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <p className="text-[11px]" style={{ color: level === 'high' ? '#DC2626' : '#B45309' }}>
              {tb.suggestions}
            </p>
            {[
              level === 'high' ? tb.s1high : tb.s1medium,
              tb.s2,
              tb.s3,
            ].map(s => (
              <span key={s} className="text-[10px] bg-white rounded-lg px-2 py-0.5 border"
                style={{ borderColor: level === 'high' ? '#FECACA' : '#FDE68A', color: '#6B6259' }}>
                {s}
              </span>
            ))}
          </div>
        </div>
        <button onClick={() => setDismissed(true)}
          className={`flex-shrink-0 transition-colors ${level === 'high' ? 'text-[#FCA5A5] hover:text-[#EF4444]' : 'text-[#FCD34D] hover:text-[#F59E0B]'}`}>
          <X size={13} />
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
