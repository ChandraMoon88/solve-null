import { useLanguageStore } from '@/store/languageStore'
import { translations } from '@/i18n/translations'
import { useEffect, useState } from 'react'

export function useTranslation() {
  const language = useLanguageStore((state) => state.language)
  const [t, setT] = useState(translations[language])
  
  useEffect(() => {
    setT(translations[language])
  }, [language])
  
  return { t, language }
}
