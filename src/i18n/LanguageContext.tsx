'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Lang, UIStrings } from './types'
import { UI } from './ui'

const STORAGE_KEY = 'hasla_lang'

interface Ctx {
  lang: Lang
  setLang: (l: Lang) => void
  t: UIStrings
}

const LanguageContext = createContext<Ctx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ko')

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'ko' || stored === 'en') {
        setLangState(stored)
        return
      }
      // Fallback: detect from navigator
      const nav = navigator.language?.toLowerCase() ?? ''
      if (nav.startsWith('en')) setLangState('en')
    } catch {
      /* localStorage unavailable */
    }
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* ignore */
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: UI[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang(): Ctx {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
