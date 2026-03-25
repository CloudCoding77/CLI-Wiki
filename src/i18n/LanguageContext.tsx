import { createContext, useContext, type ReactNode } from 'react'
import type { Lang, UIKey } from './ui'
import uiStrings from './ui'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: UIKey) => string
}

const LanguageContext = createContext<LanguageContextValue>(null!)

export function LanguageProvider({
  lang,
  setLang,
  children,
}: {
  lang: Lang
  setLang: (l: Lang) => void
  children: ReactNode
}) {
  const t = (key: UIKey) => uiStrings[lang][key]
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
