import type { Command } from '../types'

interface Props {
  command: Command
  onClick: () => void
}

const osBadgeColors: Record<string, string> = {
  linux: 'bg-amber-500/20 text-amber-400',
  macos: 'bg-blue-500/20 text-blue-400',
  windows: 'bg-cyan-500/20 text-cyan-400',
}

export default function CommandCard({ command, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl
                 hover:bg-slate-800 hover:border-emerald-500/30 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-mono font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
          {command.name}
        </h3>
        <div className="flex gap-1 shrink-0">
          {command.os.map((os) => (
            <span
              key={os}
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${osBadgeColors[os]}`}
            >
              {os}
            </span>
          ))}
        </div>
      </div>
      <p className="text-sm text-slate-400 line-clamp-2">{command.description}</p>
    </button>
  )
}
