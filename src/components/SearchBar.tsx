import { useEffect, useRef, useState, useMemo } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import SearchAutocomplete from './SearchAutocomplete'
import type { Suggestion } from './SearchAutocomplete'
import type { Command, Guide } from '../types'

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  ariaLabel?: string
  commands?: Command[]
  guides?: Guide[]
  onSelectCommand?: (cmd: Command) => void
  onSelectGuide?: (guideId: string) => void
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

export default function SearchBar({
  value,
  onChange,
  placeholder,
  ariaLabel,
  commands,
  guides,
  onSelectCommand,
  onSelectGuide,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  // Build suggestions from commands + guides
  const suggestions = useMemo<Suggestion[]>(() => {
    if (!value || value.length < 2) return []
    const q = value.toLowerCase()
    const results: Suggestion[] = []

    // Search commands (max 5)
    if (commands) {
      let count = 0
      for (const cmd of commands) {
        if (count >= 5) break
        if (
          cmd.name.toLowerCase().includes(q) ||
          cmd.id.toLowerCase().includes(q) ||
          cmd.description.toLowerCase().includes(q)
        ) {
          results.push({
            type: 'command',
            id: cmd.id,
            label: cmd.name,
            detail: cmd.os.join(', '),
          })
          count++
        }
      }
    }

    // Search guides (max 3)
    if (guides) {
      let count = 0
      for (const guide of guides) {
        if (count >= 3) break
        if (
          guide.title.toLowerCase().includes(q) ||
          guide.id.toLowerCase().includes(q) ||
          guide.description.toLowerCase().includes(q)
        ) {
          results.push({
            type: 'guide',
            id: guide.id,
            label: guide.title,
            detail: `${guide.steps.length} steps`,
          })
          count++
        }
      }
    }

    return results
  }, [value, commands, guides])

  // Reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1)
  }, [suggestions])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K → focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Escape') {
        onChange('')
        inputRef.current?.blur()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSelect(suggestions[activeIndex])
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setActiveIndex(-1)
        break
    }
  }

  const handleSelect = (suggestion: Suggestion) => {
    setShowDropdown(false)
    setActiveIndex(-1)
    onChange('')
    if (suggestion.type === 'command' && onSelectCommand && commands) {
      const cmd = commands.find((c) => c.id === suggestion.id)
      if (cmd) onSelectCommand(cmd)
    } else if (suggestion.type === 'guide' && onSelectGuide) {
      onSelectGuide(suggestion.id)
    }
  }

  const hasAutocomplete = commands || guides
  const shouldShowDropdown = showDropdown && hasAutocomplete && value.length >= 2

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setShowDropdown(true)
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => {
          // Delay to allow click on suggestion
          setTimeout(() => setShowDropdown(false), 150)
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? t('search.placeholder')}
        aria-label={ariaLabel ?? t('search.ariaLabel')}
        autoComplete="off"
        className="w-full pl-10 pr-20 py-3 bg-slate-800 border border-slate-700 rounded-xl
                   text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2
                   focus:ring-emerald-500 focus:border-transparent transition-all"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {value && (
          <button
            onClick={() => onChange('')}
            className="text-slate-400 hover:text-slate-200"
            aria-label={t('search.clear')}
          >
            &times;
          </button>
        )}
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-slate-500 bg-slate-700/50 border border-slate-600/50 rounded">
          {isMac ? <span className="text-[11px]">&#8984;</span> : <span className="text-[11px]">Ctrl+</span>}K
        </kbd>
      </div>

      {/* Autocomplete Dropdown */}
      {shouldShowDropdown && (
        <SearchAutocomplete
          suggestions={suggestions}
          activeIndex={activeIndex}
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}
