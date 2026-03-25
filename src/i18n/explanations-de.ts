import type { CommandExplanation } from '../types'
import { explanationsDeP1 } from './explanations-de-part1'
import { explanationsDeP2 } from './explanations-de-part2'
import { explanationsDeP3 } from './explanations-de-part3'

const explanationsDe: Record<string, CommandExplanation> = {
  ...explanationsDeP1,
  ...explanationsDeP2,
  ...explanationsDeP3,
}

export default explanationsDe
