'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '@/lib/store'
import type { ContentItem } from '@/lib/store'
import { AppShell } from '@/components/layout/AppShell'
import { Rss, Plus, X, Image, Film, FileText, LayoutGrid, Star, Zap } from 'lucide-react'
import { useT } from '@/lib/i18n'

type ContentStatus = ContentItem['status']
type ContentType = ContentItem['type']

type PipelineStage = { status: ContentStatus; label: string; color: string; bg: string }

const TYPE_ICONS: Record<ContentType, React.ElementType> = {
  post: FileText,
  carousel: LayoutGrid,
  story: Zap,
  reel: Film,
  workshop: Star,
  educational: FileText,
}

const TYPE_COLORS: Record<ContentType, string> = {
  post: '#3B82F6',
  carousel: '#F97316',
  story: '#A855F7',
  reel: '#EF4444',
  workshop: '#22C55E',
  educational: '#EAB308',
}

function ContentCard({ item, onUpdate, onDelete, pipeline }: { item: ContentItem; onUpdate: (u: Partial<ContentItem>) => void; onDelete: () => void; pipeline: PipelineStage[] }) {
  const stage = pipeline.find(s => s.status === item.status)!
  const TypeIcon = TYPE_ICONS[item.type]
  const typeColor = TYPE_COLORS[item.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-white border border-[#E8E2D8] rounded-xl p-3.5 hover:border-[#D4C9B8] hover:shadow-card transition-all group"
    >
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: typeColor + '15' }}>
          <TypeIcon size={13} style={{ color: typeColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-ink-200 leading-snug">{item.title}</p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: typeColor + '15', color: typeColor }}>
              {item.type}
            </span>
            {item.tags.slice(0, 2).map(tag => (
              <span key={tag} className="text-[9px] text-[#A09388] bg-cream-200 rounded px-1.5 py-0.5">#{tag}</span>
            ))}
          </div>
        </div>
        <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 text-[#D4C9B8] hover:text-[#EF4444] transition-all">
          <X size={12} />
        </button>
      </div>

      {item.scheduledDate && (
        <p className="text-[10px] text-[#A855F7] mt-2 flex items-center gap-1">
          📅 {new Date(item.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      )}

      {/* Status progression */}
      <div className="flex gap-0.5 mt-3">
        {pipeline.map(s => (
          <button
            key={s.status}
            onClick={() => onUpdate({ status: s.status })}
            title={s.label}
            className="flex-1 h-1 rounded-full transition-all hover:opacity-80"
            style={{ background: s.status === item.status ? s.color : pipeline.indexOf(s) < pipeline.findIndex(p => p.status === item.status) ? s.color + '60' : '#E4DDD3' }}
          />
        ))}
      </div>
      <p className="text-[9px] mt-1" style={{ color: stage.color }}>{stage.label}</p>
    </motion.div>
  )
}

function AddContentModal({ onClose, pipeline, t }: { onClose: () => void; pipeline: PipelineStage[]; t: ReturnType<typeof useT> }) {
  const { addContent } = useStore()
  const [form, setForm] = useState({ title: '', type: 'post' as ContentType, status: 'idea' as ContentStatus, tags: '', scheduledDate: '', notes: '' })

  const submit = () => {
    if (!form.title) return
    addContent({ ...form, tags: form.tags ? form.tags.split(',').map(tag => tag.trim()) : [] })
    onClose()
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] bg-white border border-[#E4DDD3] rounded-2xl shadow-modal z-[51]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EAE2]">
          <h3 className="text-[14px] font-semibold text-ink-200">{t.content.addContent}</h3>
          <button onClick={onClose} className="text-[#A09388] hover:text-ink-200"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-3">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={t.content.contentTitle} autoFocus
            className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2.5 focus:outline-none focus:border-ink-200 text-ink-200 placeholder:text-[#C4B9AD]" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as ContentType })}
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200">
                {Object.keys(TYPE_ICONS).map(typeKey => <option key={typeKey} value={typeKey}>{typeKey.charAt(0).toUpperCase() + typeKey.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-medium text-[#6B6259] block mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ContentStatus })}
                className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200">
                {pipeline.map(s => <option key={s.status} value={s.status}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#6B6259] block mb-1">Tags (comma separated)</label>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="ux, design, tips"
              className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200 placeholder:text-[#C4B9AD]" />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#6B6259] block mb-1">Scheduled Date</label>
            <input type="date" value={form.scheduledDate} onChange={e => setForm({ ...form, scheduledDate: e.target.value })}
              className="w-full text-[13px] bg-cream-50 border border-[#E8E2D8] rounded-xl px-3 py-2 focus:outline-none focus:border-ink-200 text-ink-200" />
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

export default function ContentPage() {
  const t = useT()
  const { content, updateContent, deleteContent } = useStore()
  const [showAdd, setShowAdd] = useState(false)
  const [view, setView] = useState<'pipeline' | 'grid'>('pipeline')
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all')

  const PIPELINE: PipelineStage[] = [
    { status: 'idea', label: t.content.idea, color: '#A09388', bg: '#F8F5EF' },
    { status: 'draft', label: t.content.draft, color: '#3B82F6', bg: '#EFF6FF' },
    { status: 'design', label: t.content.design, color: '#F97316', bg: '#FFF7ED' },
    { status: 'ready', label: t.content.ready, color: '#EAB308', bg: '#FEFCE8' },
    { status: 'scheduled', label: t.content.scheduled, color: '#A855F7', bg: '#FAF5FF' },
    { status: 'published', label: t.content.published, color: '#22C55E', bg: '#F0FDF4' },
  ]

  const filtered = filterType === 'all' ? content : content.filter(c => c.type === filterType)

  const published = content.filter(c => c.status === 'published').length
  const scheduled = content.filter(c => c.status === 'scheduled').length
  const inPipeline = content.filter(c => !['published', 'cancelled'].includes(c.status)).length

  return (
    <AppShell>
      <div className="min-h-full">
        <div className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur-sm border-b border-[#E4DDD3] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rss size={16} className="text-[#A855F7]" />
              <div>
                <h1 className="text-lg font-semibold text-ink-200">{t.content.title}</h1>
                <p className="text-[12px] text-[#A09388]">{t.content.subtitle}</p>
              </div>
            </div>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-ink-200 text-cream-200 rounded-xl text-[12px] font-medium hover:bg-ink-300 transition-colors">
              <Plus size={13} /> {t.content.addContent}
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-[#0A0A0A] rounded-2xl p-4">
              <p className="text-[11px] text-[#5A5550] uppercase tracking-wider mb-2">{t.content.inPipeline}</p>
              <p className="text-3xl font-bold text-cream-200">{inPipeline}</p>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <p className="text-[11px] text-[#A09388] uppercase tracking-wider mb-2">{t.content.scheduled}</p>
              <p className="text-3xl font-bold text-[#A855F7]">{scheduled}</p>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <p className="text-[11px] text-[#A09388] uppercase tracking-wider mb-2">{t.content.published}</p>
              <p className="text-3xl font-bold text-[#22C55E]">{published}</p>
            </div>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-4">
              <p className="text-[11px] text-[#A09388] uppercase tracking-wider mb-2">{t.content.totalPosts}</p>
              <p className="text-3xl font-bold text-ink-200">{content.length}</p>
            </div>
          </div>

          {/* Type filter */}
          <div className="flex gap-1.5 mb-5 flex-wrap">
            <button onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${filterType === 'all' ? 'bg-ink-200 text-cream-200' : 'bg-white border border-[#E4DDD3] text-[#6B6259]'}`}>
              {t.content.all} ({content.length})
            </button>
            {(Object.keys(TYPE_ICONS) as ContentType[]).map(type => {
              const count = content.filter(c => c.type === type).length
              if (count === 0) return null
              const color = TYPE_COLORS[type]
              return (
                <button key={type} onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all ${filterType === type ? 'ring-2 ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                  style={{ background: color + '15', color }}>
                  {type} ({count})
                </button>
              )
            })}
          </div>

          {/* Pipeline view */}
          {view === 'pipeline' && (
            <div className="overflow-x-auto">
              <div className="flex gap-4 min-w-max">
                {PIPELINE.map(stage => {
                  const stageItems = filtered.filter(c => c.status === stage.status)
                  return (
                    <div key={stage.status} className="w-[240px]">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                        <span className="text-[12px] font-semibold text-ink-200">{stage.label}</span>
                        <span className="text-[10px] text-[#A09388] bg-cream-200 rounded-full px-1.5">{stageItems.length}</span>
                      </div>
                      <div className="space-y-2 min-h-[80px]">
                        <AnimatePresence>
                          {stageItems.map(item => (
                            <ContentCard key={item.id} item={item}
                              pipeline={PIPELINE}
                              onUpdate={(u) => updateContent(item.id, u)}
                              onDelete={() => deleteContent(item.id)} />
                          ))}
                        </AnimatePresence>
                        {stageItems.length === 0 && (
                          <div className="border border-dashed border-[#E4DDD3] rounded-xl h-16 flex items-center justify-center">
                            <span className="text-[11px] text-[#D4C9B8]">{t.content.noContent}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showAdd && <AddContentModal onClose={() => setShowAdd(false)} pipeline={PIPELINE} t={t} />}
      </AnimatePresence>
    </AppShell>
  )
}
