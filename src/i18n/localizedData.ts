import { commands as rawCommands } from '../data/commands'
import categoriesJson from '../data/categories.json'
import commandsDe from './commands-de'
import { categoryTranslations } from './categories'
import type { Command, Category } from '../types'
import type { Lang } from './ui'

export function getLocalizedCommands(lang: Lang): Command[] {
  if (lang === 'en') return rawCommands
  return rawCommands.map((cmd) => {
    const tr = commandsDe[cmd.id]
    if (!tr) return cmd
    return {
      ...cmd,
      description: tr.description,
      examples: cmd.examples.map((ex, i) => ({
        ...ex,
        description: tr.examples[i] ?? ex.description,
      })),
      tips: tr.tips ?? cmd.tips,
    }
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
