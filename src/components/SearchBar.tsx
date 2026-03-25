import { useEffect, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K → focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      // Esc → clear and blur search
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        onChange('')
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onChange])

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('search.placeholder')}
        aria-label={t('search.ariaLabel')}
        className="w-full pl-10 pr-20 py-3 bg-slate-800 border border-slate-700 rounded-xl
                   text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2
                   focus:ring-emerald-500 focus:border-transparent transition-all"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {value && (
          <button
            onClick={() => onChange('')}
            className="text-slate-400 hover:text-slate-200"
            aria-label={t('search.clear')}
          >
            &times;
          </button>
        )}
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-slate-500 bg-slate-700/50 border border-slate-600/50 rounded">
          <span className="text-[11px]">&#8984;</span>K
        </kbd>
      </div>
    </div>
  )
}
