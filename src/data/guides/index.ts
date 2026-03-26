import { intuneGuides } from './intune-guides'
import { entraGuides } from './entra-guides'
import { m365Guides } from './m365-guides'
import { wsGuides } from './ws-guides'
import type { Guide } from '../../types'

export const guides: Guide[] = [...intuneGuides, ...entraGuides, ...m365Guides, ...wsGuides]
