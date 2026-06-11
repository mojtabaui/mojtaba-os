'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import { formatDate } from '@/lib/utils'
import { AppShell } from '@/components/layout/AppShell'
import type { Student } from '@/lib/store'
import { GraduationCap, Users, Plus, AlertCircle } from 'lucide-react'
import { useT } from '@/lib/i18n'

const COURSE_STAGES = ['Idea', 'Research', 'Outline', 'Recording', 'Editing', 'Uploading', 'Published']

const COURSES = [
  { id: 'course1', title: 'UI/UX Bootcamp', stage: 4, progress: 60, students: 24 },
  { id: 'course2', title: 'Figma Masterclass', stage: 6, progress: 90, students: 18 },
  { id: 'course3', title: 'Design Systems', stage: 2, progress: 25, students: 0 },
]

function StudentCard({ student, onUpdate }: { student: Student; onUpdate: (u: Partial<Student>) => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      layout
      className="bg-white border border-[#E8E2D8] rounded-xl p-4 hover:border-[#D4C9B8] transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cream-300 to-cream-500 flex items-center justify-center text-[12px] font-bold text-ink-200 flex-shrink-0">
          {student.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-medium text-ink-200">{student.name}</p>
            {student.pendingResponse && (
              <span className="text-[9px] bg-[#FEF2F2] text-[#EF4444] px-1.5 py-0.5 rounded-full font-medium">Needs response</span>
            )}
          </div>
          <p className="text-[11px] text-[#A09388] mt-0.5">{student.course}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${student.status === 'active' ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-cream-200 text-[#A09388]'}`}>
            {student.status}
          </span>
        </div>
      </div>

      {student.lastContact && (
        <p className="text-[10px] text-[#C4B9AD] mt-2 ml-11">Last contact: {formatDate(student.lastContact, 'relative')}</p>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mt-3 ml-11" onClick={e => e.stopPropagation()}>
            <div className="space-y-2">
              {student.sessions.map(session => (
                <div key={session.id} className="p-2.5 bg-cream-50 rounded-lg border border-[#F0EAE2]">
                  <p className="text-[11px] font-medium text-ink-200">{formatDate(session.date)}</p>
                  <p className="text-[11px] text-[#6B6259] mt-0.5">{session.notes}</p>
                  {session.followUp && (
                    <p className="text-[10px] text-[#3B82F6] mt-1">↳ Follow up: {session.followUp}</p>
                  )}
                </div>
              ))}
              {student.sessions.length === 0 && (
                <p className="text-[11px] text-[#C4B9AD]">No sessions logged yet</p>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onUpdate({ pendingResponse: !student.pendingResponse })}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${student.pendingResponse ? 'bg-[#22C55E] text-white' : 'bg-cream-200 text-[#6B6259]'}`}
              >
                {student.pendingResponse ? 'Mark Responded' : 'Mark Pending'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function CourseCard({ course }: { course: typeof COURSES[0] }) {
  const currentStage = COURSE_STAGES[course.stage - 1]
  return (
    <div className="bg-white border border-[#E8E2D8] rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[13px] font-semibold text-ink-200">{course.title}</p>
          <p className="text-[11px] text-[#A09388] mt-0.5">{course.students > 0 ? `${course.students} students` : 'In production'}</p>
        </div>
        <span className="text-[10px] bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded-full font-medium">{currentStage}</span>
      </div>
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-[#A09388]">Progress</span>
          <span className="text-[10px] font-medium text-ink-200">{course.progress}%</span>
        </div>
        <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${course.progress}%` }} />
        </div>
      </div>
      <div className="flex gap-1 mt-3">
        {COURSE_STAGES.map((stage, i) => (
          <div key={stage} title={stage}
            className={`flex-1 h-1 rounded-full ${i < course.stage ? 'bg-[#22C55E]' : i === course.stage - 1 ? 'bg-[#F97316]' : 'bg-cream-200'}`} />
        ))}
      </div>
      <div className="flex gap-1 mt-0.5">
        {COURSE_STAGES.map((stage, i) => (
          i === course.stage - 1 && <p key={stage} className="text-[9px] text-[#F97316]">{stage}</p>
        ))}
      </div>
    </div>
  )
}

export default function AcademyPage() {
  const t = useT()
  const { students, updateStudent, addStudent } = useStore()
  const [activeTab, setActiveTab] = useState('students')
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [newStudentName, setNewStudentName] = useState('')
  const [newStudentCourse, setNewStudentCourse] = useState('')

  const pending = students.filter(s => s.pendingResponse)
  const active = students.filter(s => s.status === 'active')

  const addNewStudent = () => {
    if (!newStudentName) return
    addStudent({ name: newStudentName, course: newStudentCourse, status: 'active', pendingResponse: false, sessions: [] })
    setNewStudentName('')
    setNewStudentCourse('')
    setShowAddStudent(false)
  }

  return (
    <AppShell>
      <div className="min-h-full">
        <div className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur-sm border-b border-[#E4DDD3] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap size={16} className="text-[#22C55E]" />
              <div>
                <h1 className="text-lg font-semibold text-ink-200">{t.academy.title}</h1>
                <p className="text-[12px] text-[#A09388]">{t.academy.subtitle}</p>
              </div>
            </div>
            {activeTab === 'students' && (
              <button onClick={() => setShowAddStudent(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-ink-200 text-cream-200 rounded-xl text-[12px] font-medium hover:bg-ink-300 transition-colors">
                <Plus size={13} /> {t.academy.addStudent}
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-[#0A0A0A] rounded-2xl p-4">
              <p className="text-[11px] text-[#5A5550] uppercase tracking-wider mb-2">{t.academy.students}</p>
              <p className="text-3xl font-bold text-cream-200">{active.length}</p>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle size={12} className="text-[#EF4444]" />
                <p className="text-[11px] text-[#A09388]">{t.academy.pendingResponse}</p>
              </div>
              <p className="text-3xl font-bold text-[#EF4444]">{pending.length}</p>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <p className="text-[11px] text-[#A09388] uppercase tracking-wider mb-2">{t.academy.courses}</p>
              <p className="text-3xl font-bold text-ink-200">{COURSES.length}</p>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <p className="text-[11px] text-[#A09388] uppercase tracking-wider mb-2">{t.academy.totalSessions}</p>
              <p className="text-3xl font-bold text-ink-200">{students.reduce((a, s) => a + s.sessions.length, 0)}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4">
            {[
              { key: 'students', label: `${t.academy.students} (${students.length})` },
              { key: 'courses', label: t.academy.courses },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-[12px] font-medium capitalize transition-colors ${activeTab === tab.key ? 'bg-ink-200 text-cream-200' : 'bg-white border border-[#E4DDD3] text-[#6B6259] hover:border-[#D4C9B8]'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'students' && (
            <div>
              {pending.length > 0 && (
                <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl">
                  <p className="text-[12px] font-medium text-[#DC2626] flex items-center gap-1.5">
                    <AlertCircle size={13} /> {pending.length} student{pending.length > 1 ? 's' : ''} need a response today
                  </p>
                </div>
              )}

              {/* Add student inline form */}
              <AnimatePresence>
                {showAddStudent && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="bg-white border border-[#D4C9B8] rounded-xl p-4 mb-3 shadow-card">
                    <div className="flex gap-3 mb-3">
                      <input value={newStudentName} onChange={e => setNewStudentName(e.target.value)} autoFocus
                        placeholder="Student name" onKeyDown={e => { if (e.key === 'Enter') addNewStudent(); if (e.key === 'Escape') setShowAddStudent(false) }}
                        className="flex-1 text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200 placeholder:text-[#C4B9AD]" />
                      <input value={newStudentCourse} onChange={e => setNewStudentCourse(e.target.value)}
                        placeholder="Course"
                        className="flex-1 text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200 placeholder:text-[#C4B9AD]" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setShowAddStudent(false)} className="text-[11px] text-[#A09388]">Cancel</button>
                      <button onClick={addNewStudent} className="px-3 py-1.5 bg-ink-200 text-cream-200 rounded-lg text-[11px]">Add</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-3">
                {students.map(s => (
                  <StudentCard key={s.id} student={s} onUpdate={(u) => updateStudent(s.id, u)} />
                ))}
                {students.length === 0 && (
                  <div className="col-span-2 text-center py-16">
                    <Users size={32} className="mx-auto text-[#D4C9B8] mb-3" />
                    <p className="text-[13px] text-[#A09388]">{t.academy.noStudents}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="grid grid-cols-3 gap-3">
              {COURSES.map(course => <CourseCard key={course.id} course={course} />)}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
