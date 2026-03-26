export type OS = 'windows' | 'macos' | 'linux'

export interface CommandExample {
  description: string
  code: string
}

export interface CommandFlag {
  flag: string
  description: string
  os?: OS[]
}

export interface CommandExplanation {
  useCases: string[]
  internals?: string
  mistakes?: string[]
  bestPractices?: string[]
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
  flags?: CommandFlag[]
  explanation?: CommandExplanation
}

export interface Category {
  id: string
  name: string
  icon: string
  description: string
}

// --- Guides ---

export type GuideDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface GuideStep {
  title: string
  description: string
  code?: string
  codeLanguage?: string
  note?: string
  warning?: string
  portalPath?: string
}

export interface Guide {
  id: string
  title: string
  description: string
  category: string
  difficulty: GuideDifficulty
  estimatedMinutes: number
  prerequisites?: string[]
  steps: GuideStep[]
  relatedCommands?: string[]
  relatedGuides?: string[]
  tags?: string[]
}

export interface GuideCategory {
  id: string
  name: string
  icon: string
  description: string
}
