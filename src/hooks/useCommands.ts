import { useState, useMemo } from 'react'
import { commands } from '../data/commands'
import type { OS, Command } from '../types'

export function useCommands() {
  const [search, setSearch] = useState('')
  const [selectedOS, setSelectedOS] = useState<OS | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null)

  // Category IDs that have at least one command matching OS + search (ignoring category filter)
  const availableCategories = useMemo(() => {
    const cats = new Set<string>()
    for (const cmd of commands) {
      const matchesOS = selectedOS === 'all' || cmd.os.includes(selectedOS)
      const matchesSearch =
        !search ||
        cmd.name.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description.toLowerCase().includes(search.toLowerCase()) ||
        cmd.id.toLowerCase().includes(search.toLowerCase())
      if (matchesOS && matchesSearch) cats.add(cmd.category)
    }
    return Array.from(cats)
  }, [search, selectedOS])

  const filtered = useMemo(() => {
    return commands.filter((cmd) => {
      const matchesOS = selectedOS === 'all' || cmd.os.includes(selectedOS)
      const matchesCategory = !selectedCategory || cmd.category === selectedCategory
      const matchesSearch =
        !search ||
        cmd.name.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description.toLowerCase().includes(search.toLowerCase()) ||
        cmd.id.toLowerCase().includes(search.toLowerCase())
      return matchesOS && matchesCategory && matchesSearch
    })
  }, [search, selectedOS, selectedCategory])

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
  }
}
