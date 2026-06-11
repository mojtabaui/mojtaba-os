'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { genId } from './utils'
import type { Priority, TaskStatus } from './utils'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  category: string
  status: TaskStatus
  dueDate?: string
  estimatedTime?: number
  tags: string[]
  subtasks: { id: string; title: string; done: boolean }[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface MigrationApp {
  id: string
  universityName: string
  country: string
  program: string
  status: 'researching' | 'preparing' | 'applied' | 'interview' | 'waiting' | 'accepted' | 'rejected'
  deadline: string
  link?: string
  notes?: string
  createdAt: string
}

export interface IELTSSession {
  id: string
  date: string
  skill: 'reading' | 'listening' | 'writing' | 'speaking' | 'vocabulary' | 'grammar'
  duration: number
  notes?: string
  score?: number
}

export interface CalendarEvent {
  id: string
  title: string
  date: string
  endDate?: string
  time?: string
  duration?: number
  color: string
  category: string
  description?: string
  recurring?: 'daily' | 'weekly' | 'monthly'
}

export interface ContentItem {
  id: string
  title: string
  type: 'post' | 'carousel' | 'story' | 'reel' | 'workshop' | 'educational'
  status: 'idea' | 'draft' | 'design' | 'ready' | 'scheduled' | 'published'
  scheduledDate?: string
  tags: string[]
  notes?: string
  createdAt: string
}

export interface Student {
  id: string
  name: string
  email?: string
  course?: string
  status: 'active' | 'inactive'
  lastContact?: string
  pendingResponse: boolean
  sessions: { id: string; date: string; notes: string; followUp?: string }[]
}

export interface Goal {
  id: string
  title: string
  priority: Priority
  target: number
  current: number
  unit: string
  deadline?: string
  description?: string
  createdAt: string
}

export interface EntertainmentItem {
  id: string
  title: string
  type: 'game' | 'movie' | 'series'
  status: 'completed' | 'in-progress' | 'wishlist'
  rating?: number
  platform?: string
  notes?: string
}

// ─── Initial Data ─────────────────────────────────────────────────────────────

const INITIAL_TASKS: Task[] = []

const INITIAL_MIGRATIONS: MigrationApp[] = []

const INITIAL_IELTS: IELTSSession[] = []

// Generates weekly recurring event instances (daysBack days before today through daysAhead days after)
// Uses UTC midnight arithmetic so dates match toISOString().split('T')[0] everywhere
// IDs are stable: prefix_YYYY-MM-DD
// dow: 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
function genWeekly(prefix: string, title: string, dow: number, time: string | undefined, duration: number, color: string, category: string, daysAhead: number, daysBack = 28): CalendarEvent[] {
  const result: CalendarEvent[] = []
  const now = new Date()
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const startUTC = new Date(todayUTC.getTime() - daysBack * 86400000)
  const end = new Date(todayUTC.getTime() + daysAhead * 86400000)
  const diff = (dow - startUTC.getUTCDay() + 7) % 7
  const d = new Date(startUTC.getTime() + diff * 86400000)
  while (d <= end) {
    const dateStr = d.toISOString().split('T')[0]
    const ev: CalendarEvent = { id: `${prefix}_${dateStr}`, title, date: dateStr, duration, color, category }
    if (time) ev.time = time
    result.push(ev)
    d.setUTCDate(d.getUTCDate() + 7)
  }
  return result
}

const INITIAL_EVENTS: CalendarEvent[] = [
  // ─── منتورینگ ───────────────────────────────────────────────────────────────
  ...genWeekly('fz', 'منتورینگ فائزه',              3, '12:00', 90,  '#8B5CF6', 'mentoring', 62),
  ...genWeekly('sv', 'منتورینگ سیاوش',              1, '16:00', 90,  '#8B5CF6', 'mentoring', 62),
  // ─── کلاس‌های بینهایت ───────────────────────────────────────────────────────
  ...genWeekly('ui', 'کلاس رابط کاربری بینهایت',   0, '18:30', 90,  '#10B981', 'academy',   62),
  ...genWeekly('ux', 'تجربه کاربری بینهایت',        1, '18:30', 90,  '#10B981', 'academy',   62),
  ...genWeekly('bc', 'بوت کمپ بینهایت',             3, '19:00', 120, '#10B981', 'academy',   62),
  // ─── زبان ───────────────────────────────────────────────────────────────────
  ...genWeekly('sd', 'کلاس زبان با صدرا',           6, '17:00', 120, '#F59E0B', 'language',  62),
  // ─── تراپی ──────────────────────────────────────────────────────────────────
  ...genWeekly('th', 'تراپی',                        2, '16:00', 60,  '#EC4899', 'personal',  62),
  // ─── برنامه آیلتس (بدون ساعت مشخص) ─────────────────────────────────────────
  ...genWeekly('il0', 'آیلتس — رایتینگ تسک ۱ و ۲', 0, undefined, 90, '#F97316', 'ielts', 62),
  ...genWeekly('il1', 'آیلتس — اسپیکینگ',           1, undefined, 60, '#F97316', 'ielts', 62),
  ...genWeekly('il2', 'آیلتس — رایتینگ تسک ۲ + لیسنینگ', 2, undefined, 90, '#F97316', 'ielts', 62),
  ...genWeekly('il3', 'آیلتس — اسپیکینگ',           3, undefined, 60, '#F97316', 'ielts', 62),
  ...genWeekly('il4', 'آیلتس — ریدینگ',             4, undefined, 60, '#F97316', 'ielts', 62),
  // ─── بالینکس (شنبه تا چهارشنبه، ۶ ماه) ─────────────────────────────────────
  ...genWeekly('bl6', 'بالینکس',                    6, '09:00', 480, '#3B82F6', 'balinex', 183),
  ...genWeekly('bl0', 'بالینکس',                    0, '09:00', 480, '#3B82F6', 'balinex', 183),
  ...genWeekly('bl1', 'بالینکس',                    1, '09:00', 480, '#3B82F6', 'balinex', 183),
  ...genWeekly('bl2', 'بالینکس',                    2, '09:00', 480, '#3B82F6', 'balinex', 183),
  ...genWeekly('bl3', 'بالینکس',                    3, '09:00', 480, '#3B82F6', 'balinex', 183),
  // ─── محتوا ──────────────────────────────────────────────────────────────────
  ...genWeekly('pt2', 'طراحی پست',                  2, undefined, 60, '#A855F7', 'content', 62),
  ...genWeekly('pt4', 'طراحی پست',                  4, undefined, 60, '#A855F7', 'content', 62),
  ...genWeekly('st6', 'استوری',                      6, undefined, 30, '#A855F7', 'content', 62),
  ...genWeekly('st0', 'استوری',                      0, undefined, 30, '#A855F7', 'content', 62),
  ...genWeekly('st1', 'استوری',                      1, undefined, 30, '#A855F7', 'content', 62),
  ...genWeekly('st3', 'استوری',                      3, undefined, 30, '#A855F7', 'content', 62),
  ...genWeekly('st4', 'استوری',                      4, undefined, 30, '#A855F7', 'content', 62),
  // ─── پشتیبانی دوره (شنبه تا پنجشنبه) ───────────────────────────────────────
  ...genWeekly('sp6', 'پشتیبانی دوره',              6, undefined, 60, '#22C55E', 'academy', 62),
  ...genWeekly('sp0', 'پشتیبانی دوره',              0, undefined, 60, '#22C55E', 'academy', 62),
  ...genWeekly('sp1', 'پشتیبانی دوره',              1, undefined, 60, '#22C55E', 'academy', 62),
  ...genWeekly('sp2', 'پشتیبانی دوره',              2, undefined, 60, '#22C55E', 'academy', 62),
  ...genWeekly('sp3', 'پشتیبانی دوره',              3, undefined, 60, '#22C55E', 'academy', 62),
  ...genWeekly('sp4', 'پشتیبانی دوره',              4, undefined, 60, '#22C55E', 'academy', 62),
]

const INITIAL_CONTENT: ContentItem[] = []

const INITIAL_STUDENTS: Student[] = []

const INITIAL_GOALS: Goal[] = []

const INITIAL_ENTERTAINMENT: EntertainmentItem[] = []

// ─── Store ────────────────────────────────────────────────────────────────────

interface AppStore {
  tasks: Task[]
  addTask: (t: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateTask: (id: string, u: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, status: TaskStatus) => void

  migrations: MigrationApp[]
  addMigration: (m: Omit<MigrationApp, 'id' | 'createdAt'>) => void
  updateMigration: (id: string, u: Partial<MigrationApp>) => void
  deleteMigration: (id: string) => void

  ieltsSessions: IELTSSession[]
  ieltsTarget: number
  addIELTSSession: (s: Omit<IELTSSession, 'id'>) => void
  setIELTSTarget: (t: number) => void

  events: CalendarEvent[]
  addEvent: (e: Omit<CalendarEvent, 'id'>) => void
  updateEvent: (id: string, u: Partial<CalendarEvent>) => void
  deleteEvent: (id: string) => void
  completedEventIds: string[]
  toggleEventComplete: (id: string) => void

  content: ContentItem[]
  addContent: (c: Omit<ContentItem, 'id' | 'createdAt'>) => void
  updateContent: (id: string, u: Partial<ContentItem>) => void
  deleteContent: (id: string) => void

  students: Student[]
  addStudent: (s: Omit<Student, 'id'>) => void
  updateStudent: (id: string, u: Partial<Student>) => void

  goals: Goal[]
  addGoal: (g: Omit<Goal, 'id' | 'createdAt'>) => void
  updateGoal: (id: string, u: Partial<Goal>) => void
  deleteGoal: (id: string) => void

  entertainment: EntertainmentItem[]
  addEntertainment: (e: Omit<EntertainmentItem, 'id'>) => void
  updateEntertainment: (id: string, u: Partial<EntertainmentItem>) => void
  deleteEntertainment: (id: string) => void

  sidebarCollapsed: boolean
  toggleSidebar: () => void
  quickCaptureOpen: boolean
  setQuickCaptureOpen: (v: boolean) => void
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (v: boolean) => void
  language: 'fa' | 'en'
  setLanguage: (lang: 'fa' | 'en') => void
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      tasks: INITIAL_TASKS,
      addTask: (t) => set((s) => ({ tasks: [{ ...t, id: genId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...s.tasks] })),
      updateTask: (id, u) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, ...u, updatedAt: new Date().toISOString() } : t) })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      moveTask: (id, status) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t) })),

      migrations: INITIAL_MIGRATIONS,
      addMigration: (m) => set((s) => ({ migrations: [{ ...m, id: genId(), createdAt: new Date().toISOString() }, ...s.migrations] })),
      updateMigration: (id, u) => set((s) => ({ migrations: s.migrations.map((m) => m.id === id ? { ...m, ...u } : m) })),
      deleteMigration: (id) => set((s) => ({ migrations: s.migrations.filter((m) => m.id !== id) })),

      ieltsSessions: INITIAL_IELTS,
      ieltsTarget: 7.5,
      addIELTSSession: (s) => set((st) => ({ ieltsSessions: [{ ...s, id: genId() }, ...st.ieltsSessions] })),
      setIELTSTarget: (t) => set({ ieltsTarget: t }),

      events: INITIAL_EVENTS,
      addEvent: (e) => set((s) => ({ events: [{ ...e, id: genId() }, ...s.events] })),
      updateEvent: (id, u) => set((s) => ({ events: s.events.map((e) => e.id === id ? { ...e, ...u } : e) })),
      deleteEvent: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
      completedEventIds: [],
      toggleEventComplete: (id) => set((s) => ({
        completedEventIds: s.completedEventIds.includes(id)
          ? s.completedEventIds.filter(x => x !== id)
          : [...s.completedEventIds, id]
      })),

      content: INITIAL_CONTENT,
      addContent: (c) => set((s) => ({ content: [{ ...c, id: genId(), createdAt: new Date().toISOString() }, ...s.content] })),
      updateContent: (id, u) => set((s) => ({ content: s.content.map((c) => c.id === id ? { ...c, ...u } : c) })),
      deleteContent: (id) => set((s) => ({ content: s.content.filter((c) => c.id !== id) })),

      students: INITIAL_STUDENTS,
      addStudent: (s) => set((st) => ({ students: [{ ...s, id: genId() }, ...st.students] })),
      updateStudent: (id, u) => set((s) => ({ students: s.students.map((st) => st.id === id ? { ...st, ...u } : st) })),

      goals: INITIAL_GOALS,
      addGoal: (g) => set((s) => ({ goals: [{ ...g, id: genId(), createdAt: new Date().toISOString() }, ...s.goals] })),
      updateGoal: (id, u) => set((s) => ({ goals: s.goals.map((g) => g.id === id ? { ...g, ...u } : g) })),
      deleteGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      entertainment: INITIAL_ENTERTAINMENT,
      addEntertainment: (e) => set((s) => ({ entertainment: [{ ...e, id: genId() }, ...s.entertainment] })),
      updateEntertainment: (id, u) => set((s) => ({ entertainment: s.entertainment.map((e) => e.id === id ? { ...e, ...u } : e) })),
      deleteEntertainment: (id) => set((s) => ({ entertainment: s.entertainment.filter((e) => e.id !== id) })),

      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      quickCaptureOpen: false,
      setQuickCaptureOpen: (v) => set({ quickCaptureOpen: v }),
      commandPaletteOpen: false,
      setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
      language: 'fa',
      setLanguage: (lang) => set({ language: lang }),
    }),
    { name: 'mojtaba-os-v5' }
  )
)
