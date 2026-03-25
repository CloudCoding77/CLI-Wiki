import { useState } from 'react'
import type { Command, OS } from '../types'
import { commands } from '../data/commands'
import { useLanguage } from '../i18n/LanguageContext'

interface Props {
  command: Command
  onClose: () => void
  onNavigate: (cmd: Command) => void
}

const osLabels: Record<OS, string> = {
  linux: 'Linux',
  macos: 'macOS',
  windows: 'Windows',
}

const osBadgeColors: Record<string, string> = {
  linux: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  macos: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  windows: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const { t } = useLanguage()

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={copy}
      className="text-xs text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
      title={t('detail.copyToClipboard')}
    >
      {copied ? t('detail.copied') : t('detail.copy')}
    </button>
  )
}

export default function CommandDetail({ command, onClose, onNavigate }: Props) {
  const { t } = useLanguage()

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700
                      rounded-t-2xl sm:rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-700 p-4 flex items-center justify-between">
          <h2 className="font-mono text-xl font-bold text-emerald-400">{command.name}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Description */}
          <p className="text-slate-300">{command.description}</p>

          {/* OS Badges */}
          <div className="flex gap-2 flex-wrap">
            {command.os.map((os) => (
              <span
                key={os}
                className={`text-sm px-3 py-1 rounded-full border font-medium ${osBadgeColors[os]}`}
              >
                {osLabels[os]}
              </span>
            ))}
          </div>

          {/* Syntax */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {t('detail.syntax')}
            </h3>
            <div className="space-y-2">
              {(Object.entries(command.syntax) as [OS, string][]).map(([os, syn]) => (
                <div key={os} className="flex items-center gap-3 bg-slate-800 rounded-lg p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${osBadgeColors[os]}`}>
                    {osLabels[os]}
                  </span>
                  <code className="flex-1 !bg-transparent !px-0">{syn}</code>
                  <CopyButton text={syn} />
                </div>
              ))}
            </div>
          </div>

          {/* Examples */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {t('detail.examples')}
            </h3>
            <div className="space-y-3">
              {command.examples.map((ex, i) => (
                <div key={i} className="bg-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-400">{ex.description}</span>
                    <CopyButton text={ex.code} />
                  </div>
                  <pre className="text-emerald-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
                    {ex.code}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          {command.tips && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-emerald-400 mb-1">{t('detail.tip')}</h3>
              <p className="text-sm text-slate-300">{command.tips}</p>
            </div>
          )}

          {/* Related Commands */}
          {command.relatedCommands && command.relatedCommands.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {t('detail.relatedCommands')}
              </h3>
              <div className="flex gap-2 flex-wrap">
                {command.relatedCommands.map((id) => {
                  const related = commands.find((c) => c.id === id)
                  if (!related) return null
                  return (
                    <button
                      key={id}
                      onClick={() => onNavigate(related)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400
                                 font-mono text-sm rounded-lg transition-colors"
                    >
                      {related.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
