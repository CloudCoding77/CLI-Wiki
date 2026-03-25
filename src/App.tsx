import SearchBar from './components/SearchBar'
import OSFilter from './components/OSFilter'
import CategoryBar from './components/CategoryBar'
import CommandCard from './components/CommandCard'
import CommandDetail from './components/CommandDetail'
import { useCommands } from './hooks/useCommands'
import { LanguageProvider } from './i18n/LanguageContext'
import { getLocalizedCategories } from './i18n/localizedData'
import uiStrings from './i18n/ui'
import type { UIKey } from './i18n/ui'

export default function App() {
  const {
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
  } = useCommands()

  const t = (key: UIKey) => uiStrings[lang][key]
  const categories = getLocalizedCategories(lang)

  // Group filtered commands by category
  const grouped = categories
    .map((cat) => ({
      ...cat,
      commands: filtered.filter((cmd) => cmd.category === cat.id),
    }))
    .filter((g) => g.commands.length > 0)

  return (
    <LanguageProvider lang={lang} setLang={setLang}>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                <span className="text-emerald-400">CLI</span>{' '}
                <span className="text-slate-100">Wiki</span>
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">{filtered.length} {t('header.commands')}</span>
                <button
                  onClick={() => setLang(lang === 'en' ? 'de' : 'en')}
                  className="px-2 py-1 text-xs font-medium rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  {lang === 'en' ? 'DE' : 'EN'}
                </button>
              </div>
            </div>
            <SearchBar value={search} onChange={setSearch} />
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <OSFilter selected={selectedOS} onChange={setSelectedOS} />
            </div>
            <CategoryBar
              selected={selectedCategory}
              onChange={setSelectedCategory}
              availableCategories={availableCategories}
              categories={categories}
            />
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
          {grouped.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">{t('empty.title')}</p>
              <p className="text-slate-500 text-sm mt-1">{t('empty.subtitle')}</p>
            </div>
          ) : (
            <div className="space-y-8">
              {grouped.map((group) => (
                <section key={group.id}>
                  <h2 className="text-lg font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <span>{group.icon}</span>
                    <span>{group.name}</span>
                    <span className="text-xs text-slate-500 font-normal">
                      ({group.commands.length})
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {group.commands.map((cmd) => (
                      <CommandCard
                        key={cmd.id}
                        command={cmd}
                        onClick={() => setSelectedCommand(cmd)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
          {t('footer.text')}
        </footer>

        {/* Detail Modal */}
        {selectedCommand && (
          <CommandDetail
            command={selectedCommand}
            onClose={() => setSelectedCommand(null)}
            onNavigate={setSelectedCommand}
          />
        )}
      </div>
    </LanguageProvider>
  )
}
