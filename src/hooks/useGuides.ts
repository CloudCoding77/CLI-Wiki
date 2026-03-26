import { useMemo } from 'react'
import { getLocalizedGuides } from '../i18n/localizedData'
import type { Guide } from '../types'
import type { Lang } from '../i18n/ui'

function guideMatchesSearch(guide: Guide, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    guide.title.toLowerCase().includes(q) ||
    guide.description.toLowerCase().includes(q) ||
    guide.id.toLowerCase().includes(q) ||
    (guide.tags?.some((t) => t.toLowerCase().includes(q)) ?? false) ||
    (guide.prerequisites?.some((p) => p.toLowerCase().includes(q)) ?? false) ||
    guide.steps.some(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        (s.code?.toLowerCase().includes(q) ?? false)
    )
  )
}

export function useGuides(lang: Lang, search: string, selectedCategory: string | null) {
  const guides = useMemo(() => getLocalizedGuides(lang), [lang])

  const availableGuideCategories = useMemo(() => {
    const cats = new Set<string>()
    for (const guide of guides) {
      if (guideMatchesSearch(guide, search)) cats.add(guide.category)
    }
    return Array.from(cats)
  }, [guides, search])

  const filtered = useMemo(() => {
    return guides.filter((guide) => {
      const matchesCategory = !selectedCategory || guide.category === selectedCategory
      return matchesCategory && guideMatchesSearch(guide, search)
    })
  }, [guides, search, selectedCategory])

  const selectedGuideById = useMemo(
    () => (id: string | null) => (id ? guides.find((g) => g.id === id) ?? null : null),
    [guides]
  )

  return {
    guides,
    filtered,
    availableGuideCategories,
    selectedGuideById,
  }
}
