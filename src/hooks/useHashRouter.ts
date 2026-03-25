import { useState, useEffect, useCallback, useRef } from 'react'
import type { OS } from '../types'
import type { Lang } from '../i18n/ui'

interface HashState {
  commandId: string | null
  os: OS | 'all'
  cat: string | null
  q: string
  lang: Lang
}

const VALID_OS: ReadonlySet<string> = new Set(['linux', 'macos', 'windows', 'all'])
const VALID_LANG: ReadonlySet<string> = new Set(['en', 'de'])

function getInitialLang(): Lang {
  const stored = localStorage.getItem('lang')
  if (stored && VALID_LANG.has(stored)) return stored as Lang
  return 'en'
}

function parseHash(hash: string): HashState {
  // Remove leading "#" if present
  const raw = hash.startsWith('#') ? hash.slice(1) : hash

  // Split on "?" to separate path and query
  const [path = '/', queryString = ''] = raw.split('?', 2)

  // Parse path: "/" or "/command/{id}"
  let commandId: string | null = null
  const commandMatch = path.match(/^\/command\/(.+)$/)
  if (commandMatch) {
    commandId = decodeURIComponent(commandMatch[1])
  }

  // Parse query params
  const params = new URLSearchParams(queryString)

  const osParam = params.get('os') ?? 'all'
  const os: OS | 'all' = VALID_OS.has(osParam) ? (osParam as OS | 'all') : 'all'

  const cat = params.get('cat') || null
  const q = params.get('q') ?? ''

  const langParam = params.get('lang') ?? ''
  const lang: Lang = VALID_LANG.has(langParam) ? (langParam as Lang) : getInitialLang()

  return { commandId, os, cat, q, lang }
}

function buildHash(state: HashState): string {
  let path = '/'
  if (state.commandId) {
    path = `/command/${encodeURIComponent(state.commandId)}`
  }

  const params = new URLSearchParams()
  if (state.os && state.os !== 'all') params.set('os', state.os)
  if (state.cat) params.set('cat', state.cat)
  if (state.q) params.set('q', state.q)
  if (state.lang && state.lang !== 'en') params.set('lang', state.lang)

  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}

export function useHashRouter() {
  const initial = parseHash(window.location.hash)

  const [search, setSearchState] = useState(initial.q)
  const [selectedOS, setSelectedOSState] = useState<OS | 'all'>(initial.os)
  const [selectedCategory, setSelectedCategoryState] = useState<string | null>(initial.cat)
  const [selectedCommandId, setSelectedCommandIdState] = useState<string | null>(initial.commandId)
  const [lang, setLangState] = useState<Lang>(initial.lang)

  const isFromHashChange = useRef(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep a ref of current state for building hash without stale closures
  const stateRef = useRef<HashState>({ commandId: initial.commandId, os: initial.os, cat: initial.cat, q: initial.q, lang: initial.lang })

  const updateHash = useCallback((newState: Partial<HashState>, push: boolean) => {
    stateRef.current = { ...stateRef.current, ...newState }
    const hash = '#' + buildHash(stateRef.current)
    if (push) {
      window.history.pushState(null, '', hash)
    } else {
      window.history.replaceState(null, '', hash)
    }
  }, [])

  // Command open/close → pushState (for back button)
  const setSelectedCommandId = useCallback((id: string | null) => {
    setSelectedCommandIdState(id)
    if (!isFromHashChange.current) {
      updateHash({ commandId: id }, true)
    }
  }, [updateHash])

  // Filter changes → replaceState
  const setSelectedOS = useCallback((os: OS | 'all') => {
    setSelectedOSState(os)
    if (!isFromHashChange.current) {
      updateHash({ os }, false)
    }
  }, [updateHash])

  const setSelectedCategory = useCallback((cat: string | null) => {
    setSelectedCategoryState(cat)
    if (!isFromHashChange.current) {
      updateHash({ cat }, false)
    }
  }, [updateHash])

  // Language → replaceState + localStorage
  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
    if (!isFromHashChange.current) {
      updateHash({ lang: l }, false)
    }
  }, [updateHash])

  // Search → replaceState with debounce
  const setSearch = useCallback((q: string) => {
    setSearchState(q)
    if (!isFromHashChange.current) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        updateHash({ q }, false)
      }, 300)
    }
  }, [updateHash])

  // Listen for back/forward
  useEffect(() => {
    const onPopState = () => {
      const parsed = parseHash(window.location.hash)
      isFromHashChange.current = true
      setSearchState(parsed.q)
      setSelectedOSState(parsed.os)
      setSelectedCategoryState(parsed.cat)
      setSelectedCommandIdState(parsed.commandId)
      setLangState(parsed.lang)
      stateRef.current = parsed
      // Reset flag after React processes the state updates
      setTimeout(() => { isFromHashChange.current = false }, 0)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [])

  return {
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
  }
}
