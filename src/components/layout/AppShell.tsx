'use client'
import { useEffect } from 'react'
import { QuickCapture } from '@/components/shared/QuickCapture'
import { CommandPalette } from '@/components/shared/CommandPalette'
import { useStore } from '@/lib/store'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { setCommandPaletteOpen, setQuickCaptureOpen } = useStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      if (!isInput && e.key === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setQuickCaptureOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setCommandPaletteOpen, setQuickCaptureOpen])

  return (
    <>
      {children}
      <QuickCapture />
      <CommandPalette />
    </>
  )
}
