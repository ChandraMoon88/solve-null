import { useLanguageStore } from '@/store/languageStore'
import { translations } from '@/i18n/translations'
import { useEffect, useState } from 'react'
import { translateToTelugu } from '@/utils/translator'

export function useTranslation() {
  const language = useLanguageStore((state) => state.language)
  const [t, setT] = useState(translations[language])
  
  useEffect(() => {
    setT(translations[language])
  }, [language])
  
  return { t, language }
}

/**
 * Hook for automatic translation - translates any text to Telugu when Telugu language is selected
 * @param text - The text to translate (in English)
 * @returns Translated text based on current language
 */
export function useAutoTranslate(text: string): string {
  const language = useLanguageStore((state) => state.language)
  const [translatedText, setTranslatedText] = useState(text)
  
  useEffect(() => {
    if (language === 'te' && text) {
      translateToTelugu(text).then(setTranslatedText)
    } else {
      setTranslatedText(text)
    }
  }, [text, language])
  
  return translatedText
}

/**
 * Hook for translating arrays of text automatically
 * @param texts - Array of English texts
 * @returns Array of translated texts based on current language
 */
export function useAutoTranslateArray(texts: string[]): string[] {
  const language = useLanguageStore((state) => state.language)
  const [translatedTexts, setTranslatedTexts] = useState(texts)
  
  useEffect(() => {
    if (language === 'te' && texts.length > 0) {
      Promise.all(texts.map(text => translateToTelugu(text)))
        .then(setTranslatedTexts)
    } else {
      setTranslatedTexts(texts)
    }
  }, [texts, language])
  
  return translatedTexts
}
