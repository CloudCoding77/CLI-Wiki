import type { Guide } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import DifficultyBadge from './DifficultyBadge'

interface Props {
  guide: Guide
  onClick: () => void
}

export default function GuideCard({ guide, onClick }: Props) {
  const { t } = useLanguage()

  return (
    <button
      onClick={onClick}
      className="text-left w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl
                 hover:bg-slate-800 hover:border-emerald-500/30 transition-all group"
    >
      <h3 className="font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors mb-1.5 line-clamp-1">
        {guide.title}
      </h3>
      <p className="text-sm text-slate-400 line-clamp-2 mb-3">{guide.description}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <DifficultyBadge difficulty={guide.difficulty} />
        <span className="text-xs text-slate-500">
          ⏱ {guide.estimatedMinutes} {t('guide.estimatedTime')}
        </span>
        <span className="text-xs text-slate-500">
          {guide.steps.length} {t('guide.steps')}
        </span>
      </div>
    </button>
  )
}
