import { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const { t } = useLanguage()

  const copy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={copy}
      className="text-xs text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
      title={t('detail.copyToClipboard')}
    >
      {copied ? t('detail.copied') : t('detail.copy')}
    </button>
  )
}
