// Cache to store translations and avoid repeated API calls
const translationCache = new Map<string, string>()

/**
 * Translates text from English to Telugu using Google Translate API
 * @param text - The English text to translate
 * @returns Promise with translated Telugu text
 */
export async function translateToTelugu(text: string): Promise<string> {
  // Return cached translation if available
  const cacheKey = text.trim()
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }

  try {
    // Use Google Translate API through a free endpoint
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=${encodeURIComponent(text)}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    // Extract translated text from response
    // Response format: [[[translated_text, original_text, null, null, null]], ...]
    const translated = data[0]?.map((item: any) => item[0]).join('') || text
    
    // Cache the translation
    translationCache.set(cacheKey, translated)
    
    return translated
  } catch (error) {
    console.error('Translation error:', error)
    // Return original text if translation fails
    return text
  }
}

/**
 * Translates an object's string values recursively
 * @param obj - Object containing English text
 * @returns Promise with object containing translated Telugu text
 */
export async function translateObject(obj: any): Promise<any> {
  if (typeof obj === 'string') {
    return translateToTelugu(obj)
  }
  
  if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => translateObject(item)))
  }
  
  if (obj && typeof obj === 'object') {
    const translated: any = {}
    for (const [key, value] of Object.entries(obj)) {
      translated[key] = await translateObject(value)
    }
    return translated
  }
  
  return obj
}

/**
 * Preloads translations for common text to improve performance
 * @param texts - Array of English texts to preload
 */
export async function preloadTranslations(texts: string[]): Promise<void> {
  await Promise.all(texts.map(text => translateToTelugu(text)))
}

/**
 * Clears the translation cache
 */
export function clearTranslationCache(): void {
  translationCache.clear()
}
