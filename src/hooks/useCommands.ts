import { useMemo, useCallback } from 'react'
import { useHashRouter } from './useHashRouter'
import { getLocalizedCommands } from '../i18n/localizedData'
import type { Command } from '../types'

function commandMatchesSearch(cmd: Command, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    cmd.name.toLowerCase().includes(q) ||
    cmd.description.toLowerCase().includes(q) ||
    cmd.id.toLowerCase().includes(q) ||
    (cmd.tips != null && cmd.tips.toLowerCase().includes(q)) ||
    cmd.examples.some(
      (ex) => ex.description.toLowerCase().includes(q) || ex.code.toLowerCase().includes(q)
    )
  )
}

export function useCommands() {
  const {
    search,
    setSearch,
    selectedOS,
    setSelectedOS,
    selectedCategory,
    setSelectedCategory,
    selectedCommandId,
    setSelectedCommandId,
    lang,
    setLang,
  } = useHashRouter()

  const commands = useMemo(() => getLocalizedCommands(lang), [lang])

  // Resolve commandId → Command object
  const selectedCommand = useMemo(
    () => (selectedCommandId ? commands.find((c) => c.id === selectedCommandId) ?? null : null),
    [selectedCommandId, commands]
  )

  // Wrapper: accepts Command | null, stores only ID
  const setSelectedCommand = useCallback(
    (cmd: Command | null) => setSelectedCommandId(cmd?.id ?? null),
    [setSelectedCommandId]
  )

  // Category IDs that have at least one command matching OS + search (ignoring category filter)
  const availableCategories = useMemo(() => {
    const cats = new Set<string>()
    for (const cmd of commands) {
      const matchesOS = selectedOS === 'all' || cmd.os.includes(selectedOS)
      if (matchesOS && commandMatchesSearch(cmd, search)) cats.add(cmd.category)
    }
    return Array.from(cats)
  }, [commands, search, selectedOS])

  const filtered = useMemo(() => {
    return commands.filter((cmd) => {
      const matchesOS = selectedOS === 'all' || cmd.os.includes(selectedOS)
      const matchesCategory = !selectedCategory || cmd.category === selectedCategory
      return matchesOS && matchesCategory && commandMatchesSearch(cmd, search)
    })
  }, [commands, search, selectedOS, selectedCategory])

  // Reset selected category when it becomes unavailable
  if (selectedCategory && !availableCategories.includes(selectedCategory)) {
    setSelectedCategory(null)
  }

  return {
    search,
    setSearch,
    selectedOS,
    setSelectedOS,
    selectedCategory,
    setSelectedCategory,
    selectedCommand,
    setSelectedCommand,
    filtered,
    availableCategories,
    lang,
    setLang,
  }
}
