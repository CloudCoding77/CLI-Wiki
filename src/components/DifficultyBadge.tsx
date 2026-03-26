import type { GuideDifficulty } from '../types'
import { useLanguage } from '../i18n/LanguageContext'

const colors: Record<GuideDifficulty, string> = {
  beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function DifficultyBadge({ difficulty }: { difficulty: GuideDifficulty }) {
  const { t } = useLanguage()
  const key = `guide.difficulty.${difficulty}` as const

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${colors[difficulty]}`}>
      {t(key)}
    </span>
  )
}
