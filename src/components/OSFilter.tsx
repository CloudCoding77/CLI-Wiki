import type { OS } from '../types'
import { useLanguage } from '../i18n/LanguageContext'

const options: { value: OS | 'all'; labelKey: string | null }[] = [
  { value: 'all', labelKey: null },
  { value: 'linux', labelKey: 'Linux' },
  { value: 'macos', labelKey: 'macOS' },
  { value: 'windows', labelKey: 'Windows' },
]

interface Props {
  selected: OS | 'all'
  onChange: (v: OS | 'all') => void
}

export default function OSFilter({ selected, onChange }: Props) {
  const { t } = useLanguage()

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selected === opt.value
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {opt.labelKey ?? t('filter.all')}
        </button>
      ))}
    </div>
  )
}
