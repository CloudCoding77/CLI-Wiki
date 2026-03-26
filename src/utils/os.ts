import type { OS } from '../types'

export const osLabels: Record<OS, string> = {
  linux: 'Linux',
  macos: 'macOS',
  windows: 'Windows',
}

export const osBadgeColors: Record<OS, string> = {
  linux: 'bg-amber-500/20 text-amber-400',
  macos: 'bg-blue-500/20 text-blue-400',
  windows: 'bg-cyan-500/20 text-cyan-400',
}

export const osBadgeColorsWithBorder: Record<OS, string> = {
  linux: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  macos: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  windows: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
}
