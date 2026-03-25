import { useState, useMemo } from 'react'
import { commands } from '../data/commands'
import type { OS, Command } from '../types'

export function useCommands() {
  const [search, setSearch] = useState('')
  const [selectedOS, setSelectedOS] = useState<OS | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null)

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
  }
}
