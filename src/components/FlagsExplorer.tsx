import { useState } from 'react'
import type { CommandFlag, OS } from '../types'
import { useLanguage } from '../i18n/LanguageContext'
import CopyButton from './CopyButton'

const osBadgeColors: Record<string, string> = {
  linux: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  macos: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  windows: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
}

const osLabels: Record<OS, string> = {
  linux: 'Linux',
  macos: 'macOS',
  windows: 'Windows',
}

const INITIAL_VISIBLE = 5

interface Props {
  flags: CommandFlag[]
  commandOs: OS[]
  selectedOS: OS | null
}

export default function FlagsExplorer({ flags, commandOs, selectedOS }: Props) {
  const [open, setOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const { t } = useLanguage()

  // Filter flags by selected OS
  const filtered = selectedOS
    ? flags.filter((f) => !f.os || f.os.includes(selectedOS))
    : flags

  if (filtered.length === 0) return null

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE)
  const hasMore = filtered.length > INITIAL_VISIBLE

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
          {t('detail.flags')}
        </h3>
        <span className="text-xs text-slate-500 font-normal">({filtered.length})</span>
      </button>

      {open && (
        <div className="mt-3 space-y-1.5">
          {visible.map((f) => {
            const isOsSpecific = f.os && f.os.length < commandOs.length
            return (
              <div
                key={f.flag}
                className="flex items-center gap-3 bg-slate-800 rounded-lg px-3 py-2"
              >
                <code className="shrink-0 text-sm font-mono text-emerald-400 bg-slate-900 px-2 py-0.5 rounded">
                  {f.flag}
                </code>
                <span className="flex-1 text-sm text-slate-300 min-w-0">{f.description}</span>
                {isOsSpecific &&
                  f.os!.map((os) => (
                    <span
                      key={os}
                      className={`hidden sm:inline text-[10px] px-1.5 py-0.5 rounded-full border font-medium shrink-0 ${osBadgeColors[os]}`}
                    >
                      {osLabels[os]}
                    </span>
                  ))}
                <CopyButton text={f.flag} />
              </div>
            )
          })}

          {hasMore && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors mt-1 ml-1"
            >
              {showAll
                ? t('detail.flagsCollapse')
                : `${t('detail.flagsShowAll')} (${filtered.length})`}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
