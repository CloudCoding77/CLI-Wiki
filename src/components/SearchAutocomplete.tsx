import { useLanguage } from '../i18n/LanguageContext'

interface Suggestion {
  type: 'command' | 'guide'
  id: string
  label: string
  detail: string
}

interface Props {
  suggestions: Suggestion[]
  activeIndex: number
  onSelect: (suggestion: Suggestion) => void
}

export type { Suggestion }

export default function SearchAutocomplete({ suggestions, activeIndex, onSelect }: Props) {
  const { t } = useLanguage()

  if (suggestions.length === 0) {
    return (
      <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3">
        <p className="text-sm text-slate-500 text-center">{t('search.noResults')}</p>
      </div>
    )
  }

  return (
    <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
      {suggestions.map((s, i) => (
        <button
          key={`${s.type}-${s.id}`}
          onMouseDown={(e) => {
            e.preventDefault() // prevent blur before click fires
            onSelect(s)
          }}
          className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${
            i === activeIndex
              ? 'bg-emerald-500/15 text-emerald-400'
              : 'text-slate-200 hover:bg-slate-700/50'
          }`}
        >
          <span className="text-sm shrink-0">{s.type === 'command' ? '⚡' : '📋'}</span>
          <div className="flex-1 min-w-0">
            <span className={`text-sm font-medium ${s.type === 'command' ? 'font-mono' : ''}`}>
              {s.label}
            </span>
          </div>
          <span className="text-xs text-slate-500 shrink-0">{s.detail}</span>
        </button>
      ))}
    </div>
  )
}
