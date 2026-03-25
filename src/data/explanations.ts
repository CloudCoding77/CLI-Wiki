import type { CommandExplanation } from '../types'
import { explanationsPart1 } from './explanations-part1'
import { explanationsPart2 } from './explanations-part2'
import { explanationsPart3 } from './explanations-part3'

export const commandExplanations: Record<string, CommandExplanation> = {
  ...explanationsPart1,
  ...explanationsPart2,
  ...explanationsPart3,
}
