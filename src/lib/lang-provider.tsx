'use client'
import { useEffect } from 'react'
import { useStore } from './store'

export function LangProvider({ children }: { children: React.ReactNode }) {
  const language = useStore(s => s.language)

  useEffect(() => {
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  return <>{children}</>
}
