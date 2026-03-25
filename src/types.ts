export type OS = 'windows' | 'macos' | 'linux'

export interface CommandExample {
  description: string
  code: string
}

export interface Command {
  id: string
  name: string
  category: string
  os: OS[]
  syntax: Partial<Record<OS, string>>
  description: string
  examples: CommandExample[]
  tips?: string
  relatedCommands?: string[]
}

export interface Category {
  id: string
  name: string
  icon: string
  description: string
}
