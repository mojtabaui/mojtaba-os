'use client'
import { lazy } from 'react'
import {
  LayoutDashboard, Calendar, CheckSquare, Target, Plane,
  BookOpen, Briefcase, GraduationCap, Rss, User, BarChart2,
  Trophy, CalendarDays, Grid3x3, Clock, Settings,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface AppDef {
  id: string
  navKey: string
  icon: LucideIcon
  grad: readonly [string, string]
}

export const APP_DEFS: AppDef[] = [
  { id: 'dashboard',  navKey: 'dashboard',  icon: LayoutDashboard, grad: ['#60A5FA', '#2563EB'] },
  { id: 'executive',  navKey: 'executive',  icon: Trophy,          grad: ['#FCD34D', '#D97706'] },
  { id: 'calendar',   navKey: 'calendar',   icon: Calendar,        grad: ['#F87171', '#DC2626'] },
  { id: 'tasks',      navKey: 'tasks',      icon: CheckSquare,     grad: ['#4ADE80', '#16A34A'] },
  { id: 'goals',      navKey: 'goals',      icon: Target,          grad: ['#A78BFA', '#7C3AED'] },
  { id: 'weekly',     navKey: 'weekly',     icon: CalendarDays,    grad: ['#22D3EE', '#0891B2'] },
  { id: 'matrix',     navKey: 'matrix',     icon: Grid3x3,         grad: ['#A3E635', '#65A30D'] },
  { id: 'budget',     navKey: 'budget',     icon: Clock,           grad: ['#FB923C', '#EA580C'] },
  { id: 'migration',  navKey: 'migration',  icon: Plane,           grad: ['#FB7185', '#E11D48'] },
  { id: 'ielts',      navKey: 'ielts',      icon: BookOpen,        grad: ['#FDBA74', '#EA580C'] },
  { id: 'balinex',    navKey: 'balinex',    icon: Briefcase,       grad: ['#818CF8', '#4338CA'] },
  { id: 'academy',    navKey: 'academy',    icon: GraduationCap,   grad: ['#34D399', '#059669'] },
  { id: 'content',    navKey: 'content',    icon: Rss,             grad: ['#C084FC', '#9333EA'] },
  { id: 'personal',   navKey: 'personal',   icon: User,            grad: ['#F472B6', '#DB2777'] },
  { id: 'analytics',  navKey: 'analytics',  icon: BarChart2,       grad: ['#818CF8', '#4F46E5'] },
  { id: 'settings',   navKey: 'settings',   icon: Settings,        grad: ['#94A3B8', '#475569'] },
]

export const APP_COMPONENTS = {
  dashboard:  lazy(() => import('@/app/dashboard/page')),
  executive:  lazy(() => import('@/app/executive/page')),
  calendar:   lazy(() => import('@/app/calendar/page')),
  tasks:      lazy(() => import('@/app/tasks/page')),
  goals:      lazy(() => import('@/app/goals/page')),
  weekly:     lazy(() => import('@/app/weekly/page')),
  matrix:     lazy(() => import('@/app/matrix/page')),
  budget:     lazy(() => import('@/app/budget/page')),
  migration:  lazy(() => import('@/app/migration/page')),
  ielts:      lazy(() => import('@/app/ielts/page')),
  balinex:    lazy(() => import('@/app/balinex/page')),
  academy:    lazy(() => import('@/app/academy/page')),
  content:    lazy(() => import('@/app/content/page')),
  personal:   lazy(() => import('@/app/personal/page')),
  analytics:  lazy(() => import('@/app/analytics/page')),
  settings:   lazy(() => import('@/app/settings/page')),
} as const
