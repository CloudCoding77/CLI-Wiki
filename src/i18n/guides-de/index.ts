import type { GuideTranslation } from './intune-guides-de'
import intuneGuidesDe from './intune-guides-de'
import entraGuidesDe from './entra-guides-de'
import m365GuidesDe from './m365-guides-de'
import wsGuidesDe from './ws-guides-de'

const guidesDe: Record<string, GuideTranslation> = {
  ...intuneGuidesDe,
  ...entraGuidesDe,
  ...m365GuidesDe,
  ...wsGuidesDe,
}

export type { GuideTranslation }
export default guidesDe
