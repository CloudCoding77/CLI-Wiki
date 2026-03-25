import { commands as rawCommands } from '../data/commands'
import { commandFlags } from '../data/flags'
import categoriesJson from '../data/categories.json'
import commandsDe from './commands-de'
import flagsDe from './flags-de'
import { categoryTranslations } from './categories'
import type { Command, Category } from '../types'
import type { Lang } from './ui'

export function getLocalizedCommands(lang: Lang): Command[] {
  if (lang === 'en') {
    return rawCommands.map((cmd) => {
      const flags = commandFlags[cmd.id]
      if (!flags) return cmd
      return { ...cmd, flags }
    })
  }
  return rawCommands.map((cmd) => {
    const tr = commandsDe[cmd.id]
    const flags = commandFlags[cmd.id]
    const deFlags = flagsDe[cmd.id]
    const localizedFlags = flags
      ? flags.map((f) => ({
          ...f,
          description: deFlags?.[f.flag] ?? f.description,
        }))
      : undefined
    const base = tr
      ? {
          ...cmd,
          description: tr.description,
          examples: cmd.examples.map((ex, i) => ({
            ...ex,
            description: tr.examples[i] ?? ex.description,
          })),
          tips: tr.tips ?? cmd.tips,
        }
      : cmd
    return localizedFlags ? { ...base, flags: localizedFlags } : base
  })
}

export function getLocalizedCategories(lang: Lang): Category[] {
  if (lang === 'en') return categoriesJson
  return categoriesJson.map((cat) => {
    const tr = categoryTranslations[cat.id]
    if (!tr) return cat
    return { ...cat, name: tr.name, description: tr.description }
  })
}
