import categories from '../data/categories.json'

interface Props {
  selected: string | null
  onChange: (id: string | null) => void
}

export default function CategoryBar({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onChange(null)}
        className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          selected === null
            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(selected === cat.id ? null : cat.id)}
          className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selected === cat.id
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  )
}
