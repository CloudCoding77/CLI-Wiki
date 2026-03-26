import { useState, useEffect, useCallback, useRef } from 'react'
import type { OS } from '../types'
import type { Lang } from '../i18n/ui'

export type View = 'commands' | 'guides'

interface HashState {
  commandId: string | null
  guideId: string | null
  view: View
  os: OS | 'all'
  cat: string | null
  q: string
  lang: Lang
}

const VALID_OS: ReadonlySet<string> = new Set(['linux', 'macos', 'windows', 'all'])
const VALID_LANG: ReadonlySet<string> = new Set(['en', 'de'])
const VALID_VIEW: ReadonlySet<string> = new Set(['commands', 'guides'])

function getInitialLang(): Lang {
  const stored = localStorage.getItem('lang')
  if (stored && VALID_LANG.has(stored)) return stored as Lang
  return 'en'
}

function parseHash(hash: string): HashState {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  const [path = '/', queryString = ''] = raw.split('?', 2)

  let commandId: string | null = null
  let guideId: string | null = null
  let view: View = 'commands'

  const commandMatch = path.match(/^\/command\/(.+)$/)
  if (commandMatch) {
    commandId = decodeURIComponent(commandMatch[1])
  }

  const guideMatch = path.match(/^\/guide\/(.+)$/)
  if (guideMatch) {
    guideId = decodeURIComponent(guideMatch[1])
    view = 'guides'
  }

  const params = new URLSearchParams(queryString)

  const osParam = params.get('os') ?? 'all'
  const os: OS | 'all' = VALID_OS.has(osParam) ? (osParam as OS | 'all') : 'all'

  const cat = params.get('cat') || null
  const q = params.get('q') ?? ''

  const langParam = params.get('lang') ?? ''
  const lang: Lang = VALID_LANG.has(langParam) ? (langParam as Lang) : getInitialLang()

  const viewParam = params.get('view') ?? ''
  if (!guideId && VALID_VIEW.has(viewParam)) {
    view = viewParam as View
  }

  return { commandId, guideId, view, os, cat, q, lang }
}

function buildHash(state: HashState): string {
  let path = '/'
  if (state.commandId) {
    path = `/command/${encodeURIComponent(state.commandId)}`
  } else if (state.guideId) {
    path = `/guide/${encodeURIComponent(state.guideId)}`
  }

  const params = new URLSearchParams()
  if (state.os && state.os !== 'all') params.set('os', state.os)
  if (state.cat) params.set('cat', state.cat)
  if (state.q) params.set('q', state.q)
  if (state.lang && state.lang !== 'en') params.set('lang', state.lang)
  if (state.view === 'guides' && !state.guideId) params.set('view', 'guides')

  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}

export function useHashRouter() {
  const initial = parseHash(window.location.hash)

  const [search, setSearchState] = useState(initial.q)
  const [selectedOS, setSelectedOSState] = useState<OS | 'all'>(initial.os)
  const [selectedCategory, setSelectedCategoryState] = useState<string | null>(initial.cat)
  const [selectedCommandId, setSelectedCommandIdState] = useState<string | null>(initial.commandId)
  const [selectedGuideId, setSelectedGuideIdState] = useState<string | null>(initial.guideId)
  const [view, setViewState] = useState<View>(initial.view)
  const [lang, setLangState] = useState<Lang>(initial.lang)

  const isFromHashChange = useRef(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stateRef = useRef<HashState>({
    commandId: initial.commandId,
    guideId: initial.guideId,
    view: initial.view,
    os: initial.os,
    cat: initial.cat,
    q: initial.q,
    lang: initial.lang,
  })

  const updateHash = useCallback((newState: Partial<HashState>, push: boolean) => {
    stateRef.current = { ...stateRef.current, ...newState }
    const hash = '#' + buildHash(stateRef.current)
    if (push) {
      window.history.pushState(null, '', hash)
    } else {
      window.history.replaceState(null, '', hash)
    }
  }, [])

  const setSelectedCommandId = useCallback((id: string | null) => {
    setSelectedCommandIdState(id)
    if (!isFromHashChange.current) {
      updateHash({ commandId: id }, true)
    }
  }, [updateHash])

  const setSelectedGuideId = useCallback((id: string | null) => {
    setSelectedGuideIdState(id)
    if (!isFromHashChange.current) {
      updateHash({ guideId: id }, true)
    }
  }, [updateHash])

  const setView = useCallback((v: View) => {
    setViewState(v)
    setSelectedCategoryState(null)
    setSearchState('')
    if (!isFromHashChange.current) {
      updateHash({ view: v, cat: null, q: '' }, false)
    }
  }, [updateHash])

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

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
    if (!isFromHashChange.current) {
      updateHash({ lang: l }, false)
    }
  }, [updateHash])

  const setSearch = useCallback((q: string) => {
    setSearchState(q)
    if (!isFromHashChange.current) {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        updateHash({ q }, false)
      }, 300)
    }
  }, [updateHash])

  useEffect(() => {
    const onPopState = () => {
      const parsed = parseHash(window.location.hash)
      isFromHashChange.current = true
      setSearchState(parsed.q)
      setSelectedOSState(parsed.os)
      setSelectedCategoryState(parsed.cat)
      setSelectedCommandIdState(parsed.commandId)
      setSelectedGuideIdState(parsed.guideId)
      setViewState(parsed.view)
      setLangState(parsed.lang)
      stateRef.current = parsed
      setTimeout(() => { isFromHashChange.current = false }, 0)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

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
    selectedGuideId,
    setSelectedGuideId,
    view,
    setView,
    lang,
    setLang,
  }
}
