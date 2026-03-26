import type { GuideStep as GuideStepType } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import CopyButton from './CopyButton'

interface Props {
  step: GuideStepType
  index: number
  completed?: boolean
  onToggle?: () => void
}

export default function GuideStep({ step, index, completed, onToggle }: Props) {
  const { t } = useLanguage()

  return (
    <div className="flex gap-4">
      {/* Step number / checkbox */}
      <button
        onClick={onToggle}
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
          completed
            ? 'bg-emerald-500/30 text-emerald-300 ring-2 ring-emerald-500/40'
            : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
        }`}
        title={completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {completed ? '✓' : index + 1}
      </button>

      <div className={`flex-1 min-w-0 pb-6 transition-opacity ${completed ? 'opacity-60' : ''}`}>
        <h4 className={`font-semibold mb-1 ${completed ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
          {step.title}
        </h4>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">{step.description}</p>

        {/* Portal Path */}
        {step.portalPath && (
          <div className="flex items-center gap-2 mb-3 text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-2">
            <span>📂</span>
            <span className="font-mono">{step.portalPath}</span>
          </div>
        )}

        {/* Code Block */}
        {step.code && (
          <div className="bg-slate-800 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-1">
              {step.codeLanguage && (
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">{step.codeLanguage}</span>
              )}
              <CopyButton text={step.code} />
            </div>
            <pre className="text-emerald-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
              {step.code}
            </pre>
          </div>
        )}

        {/* Note */}
        {step.note && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 mb-3">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-blue-400">{t('guide.note')}: </span>
              {step.note}
            </p>
          </div>
        )}

        {/* Warning */}
        {step.warning && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-red-400">{t('guide.warning')}: </span>
              {step.warning}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
