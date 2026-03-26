import type { Guide } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import DifficultyBadge from './DifficultyBadge'
import GuideStepComponent from './GuideStep'

interface Props {
  guide: Guide
  onClose: () => void
  onNavigateGuide: (id: string) => void
  onNavigateCommand: (id: string) => void
}

export default function GuideDetail({ guide, onClose, onNavigateGuide, onNavigateCommand }: Props) {
  const { t } = useLanguage()

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={onClose}
            className="text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('guide.back')}
          </button>
          <h1 className="text-lg font-bold text-slate-100 truncate">{guide.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Meta */}
        <div>
          <p className="text-slate-300 mb-3">{guide.description}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <DifficultyBadge difficulty={guide.difficulty} />
            <span className="text-sm text-slate-500">
              ⏱ {guide.estimatedMinutes} {t('guide.estimatedTime')}
            </span>
            <span className="text-sm text-slate-500">
              {guide.steps.length} {t('guide.steps')}
            </span>
          </div>
        </div>

        {/* Prerequisites */}
        {guide.prerequisites && guide.prerequisites.length > 0 && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {t('guide.prerequisites')}
            </h3>
            <ul className="space-y-1">
              {guide.prerequisites.map((p, i) => (
                <li key={i} className="text-sm text-slate-300 flex gap-2">
                  <span className="text-slate-500 shrink-0">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Steps */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            {t('guide.steps')}
          </h3>
          <div className="border-l-2 border-slate-700 ml-4 pl-0">
            {guide.steps.map((step, i) => (
              <GuideStepComponent key={i} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* Related Commands */}
        {guide.relatedCommands && guide.relatedCommands.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {t('guide.relatedCommands')}
            </h3>
            <div className="flex gap-2 flex-wrap">
              {guide.relatedCommands.map((id) => (
                <button
                  key={id}
                  onClick={() => onNavigateCommand(id)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400
                             font-mono text-sm rounded-lg transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Related Guides */}
        {guide.relatedGuides && guide.relatedGuides.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {t('guide.relatedGuides')}
            </h3>
            <div className="flex gap-2 flex-wrap">
              {guide.relatedGuides.map((id) => (
                <button
                  key={id}
                  onClick={() => onNavigateGuide(id)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400
                             text-sm rounded-lg transition-colors"
                >
                  {id}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
