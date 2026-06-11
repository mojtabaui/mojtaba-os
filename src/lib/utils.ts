import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function genId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''

  if (format === 'relative') {
    const now = new Date()
    const diff = Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Tomorrow'
    if (diff === -1) return 'Yesterday'
    if (diff > 0 && diff < 7) return `In ${diff} days`
    if (diff < 0 && diff > -7) return `${Math.abs(diff)} days ago`
  }

  if (format === 'long') {
    return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
}

// Formats a Date as YYYY-MM-DD using LOCAL time (not UTC).
// Critical fix for Iran (UTC+3:30): d.toISOString() gives UTC date
// which can be the previous calendar day before 03:30 AM local time.
export function toLocalDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
}

export const PRIORITY_CONFIG = {
  p1: { label: 'Migration', color: '#EF4444', bg: '#FEF2F2', text: '#DC2626', short: 'P1' },
  p2: { label: 'IELTS', color: '#F97316', bg: '#FFF7ED', text: '#EA580C', short: 'P2' },
  p3: { label: 'Balinex', color: '#3B82F6', bg: '#EFF6FF', text: '#2563EB', short: 'P3' },
  p4: { label: 'Academy', color: '#22C55E', bg: '#F0FDF4', text: '#16A34A', short: 'P4' },
  p5: { label: 'Content', color: '#A855F7', bg: '#FAF5FF', text: '#9333EA', short: 'P5' },
} as const

export const STATUS_CONFIG = {
  backlog: { label: 'Backlog', color: '#A09388' },
  planned: { label: 'Planned', color: '#3B82F6' },
  'in-progress': { label: 'In Progress', color: '#F97316' },
  review: { label: 'Review', color: '#A855F7' },
  done: { label: 'Done', color: '#22C55E' },
  cancelled: { label: 'Cancelled', color: '#EF4444' },
} as const

export type Priority = keyof typeof PRIORITY_CONFIG
export type TaskStatus = keyof typeof STATUS_CONFIG
