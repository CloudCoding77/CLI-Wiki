import { useState } from 'react'
import type { CommandExplanation } from '../types'
import { useLanguage } from '../i18n/LanguageContext'

interface Props {
  explanation: CommandExplanation
}

export default function ExplanationSection({ explanation }: Props) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-left group"
      >
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          {t('detail.explanation')}
        </h3>
      </button>

      {open && (
        <div className="mt-3 space-y-4">
          {/* Use Cases */}
          <div>
            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <span>🎯</span> {t('detail.useCases')}
            </h4>
            <ul className="space-y-1 ml-1">
              {explanation.useCases.map((uc, i) => (
                <li key={i} className="text-sm text-slate-300 flex gap-2">
                  <span className="text-slate-500 shrink-0">•</span>
                  <span>{uc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Internals */}
          {explanation.internals && (
            <div>
              <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span>⚙️</span> {t('detail.internals')}
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">{explanation.internals}</p>
            </div>
          )}

          {/* Common Mistakes */}
          {explanation.mistakes && explanation.mistakes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span>⚠️</span> {t('detail.mistakes')}
              </h4>
              <ul className="space-y-1 ml-1">
                {explanation.mistakes.map((m, i) => (
                  <li key={i} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-amber-500 shrink-0">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Best Practices */}
          {explanation.bestPractices && explanation.bestPractices.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <span>✅</span> {t('detail.bestPractices')}
              </h4>
              <ul className="space-y-1 ml-1">
                {explanation.bestPractices.map((bp, i) => (
                  <li key={i} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-green-500 shrink-0">•</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
