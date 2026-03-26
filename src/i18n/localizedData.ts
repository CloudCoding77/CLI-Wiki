import { commands as rawCommands } from '../data/commands'
import { commandFlags } from '../data/flags'
import { commandExplanations } from '../data/explanations'
import categoriesJson from '../data/categories.json'
import commandsDe from './commands-de'
import flagsDe from './flags-de'
import explanationsDe from './explanations-de'
import { categoryTranslations } from './categories'
import { guides as rawGuides } from '../data/guides'
import guideCategoriesJson from '../data/guide-categories.json'
import guidesDe from './guides-de'
import { guideCategoryTranslations } from './guide-categories-de'
import type { Command, Category, Guide, GuideCategory } from '../types'
import type { Lang } from './ui'

export function getLocalizedCommands(lang: Lang): Command[] {
  if (lang === 'en') {
    return rawCommands.map((cmd) => {
      const flags = commandFlags[cmd.id]
      const explanation = commandExplanations[cmd.id]
      return { ...cmd, ...(flags && { flags }), ...(explanation && { explanation }) }
    })
  }
  return rawCommands.map((cmd) => {
    const tr = commandsDe[cmd.id]
    const flags = commandFlags[cmd.id]
    const deFlags = flagsDe[cmd.id]
    const explanation = commandExplanations[cmd.id]
    const deExplanation = explanationsDe[cmd.id]

    const localizedFlags = flags
      ? flags.map((f) => ({
          ...f,
          description: deFlags?.[f.flag] ?? f.description,
        }))
      : undefined

    const localizedExplanation = explanation
      ? deExplanation ?? explanation
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

    return {
      ...base,
      ...(localizedFlags && { flags: localizedFlags }),
      ...(localizedExplanation && { explanation: localizedExplanation }),
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

export function getLocalizedGuides(lang: Lang): Guide[] {
  if (lang === 'en') return rawGuides
  return rawGuides.map((guide) => {
    const tr = guidesDe[guide.id]
    if (!tr) return guide
    return {
      ...guide,
      title: tr.title,
      description: tr.description,
      prerequisites: tr.prerequisites ?? guide.prerequisites,
      steps: guide.steps.map((step, i) => {
        const stepTr = tr.steps[i]
        if (!stepTr) return step
        return {
          ...step,
          title: stepTr.title,
          description: stepTr.description,
          note: stepTr.note ?? step.note,
          warning: stepTr.warning ?? step.warning,
        }
      }),
    }
  })
}

export function getLocalizedGuideCategories(lang: Lang): GuideCategory[] {
  if (lang === 'en') return guideCategoriesJson
  return guideCategoriesJson.map((cat) => {
    const tr = guideCategoryTranslations[cat.id]
    if (!tr) return cat
    return { ...cat, name: tr.name, description: tr.description }
  })
}
