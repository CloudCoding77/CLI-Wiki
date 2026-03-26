import type { GuideTranslation } from './intune-guides-de'
import intuneGuidesDe from './intune-guides-de'

const guidesDe: Record<string, GuideTranslation> = {
  ...intuneGuidesDe,
}

export type { GuideTranslation }
export default guidesDe
