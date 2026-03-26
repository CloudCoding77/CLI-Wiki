import type { Guide } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import { getGuideProgress } from '../hooks/useGuideProgress'
import DifficultyBadge from './DifficultyBadge'

interface Props {
  guide: Guide
  onClick: () => void
}

export default function GuideCard({ guide, onClick }: Props) {
  const { t } = useLanguage()
  const progress = getGuideProgress(guide.id)
  const progressCount = progress.length
  const totalSteps = guide.steps.length
  const hasProgress = progressCount > 0
  const isDone = progressCount === totalSteps

  return (
    <button
      onClick={onClick}
      className="text-left w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl
                 hover:bg-slate-800 hover:border-emerald-500/30 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
          {guide.title}
        </h3>
        {hasProgress && (
          <span className={`text-xs font-medium shrink-0 ${isDone ? 'text-emerald-400' : 'text-slate-500'}`}>
            {isDone ? '✓' : `${progressCount}/${totalSteps}`}
          </span>
        )}
      </div>
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
      {/* Mini progress bar */}
      {hasProgress && !isDone && (
        <div className="mt-2 h-1 bg-slate-700/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500/50 rounded-full transition-all"
            style={{ width: `${Math.round((progressCount / totalSteps) * 100)}%` }}
          />
        </div>
      )}
    </button>
  )
}
