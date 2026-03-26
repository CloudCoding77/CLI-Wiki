import type { GuideCategory } from '../types'
import { useLanguage } from '../i18n/LanguageContext'

interface Props {
  selected: string | null
  onChange: (cat: string | null) => void
  availableCategories: string[]
  categories: GuideCategory[]
}

export default function GuideCategoryBar({ selected, onChange, availableCategories, categories }: Props) {
  const { t } = useLanguage()
  const visible = categories.filter((c) => availableCategories.includes(c.id))

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      <button
        onClick={() => onChange(null)}
        className={`shrink-0 px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
          !selected
            ? 'bg-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/10'
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }`}
      >
        {t('filter.all')}
      </button>
      {visible.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(selected === cat.id ? null : cat.id)}
          className={`shrink-0 px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
            selected === cat.id
              ? 'bg-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-500/10'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  )
}
