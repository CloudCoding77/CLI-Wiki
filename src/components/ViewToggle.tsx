import type { View } from '../hooks/useHashRouter'
import { useLanguage } from '../i18n/LanguageContext'

interface Props {
  view: View
  onChange: (view: View) => void
}

export default function ViewToggle({ view, onChange }: Props) {
  const { t } = useLanguage()

  const tabs: { key: View; label: string; icon: string }[] = [
    { key: 'commands', label: t('view.commands'), icon: '⚡' },
    { key: 'guides', label: t('view.guides'), icon: '📋' },
  ]

  return (
    <div className="flex gap-1 bg-slate-800/50 rounded-lg p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            view === tab.key
              ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
          }`}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
