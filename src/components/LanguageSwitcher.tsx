'use client'

import { motion } from 'framer-motion'
import { useLanguageStore, Language } from '@/store/languageStore'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore()

  return (
    <div className="flex items-center gap-2 glass border border-void-500/20 rounded-lg px-3 py-2">
      <Globe className="w-4 h-4 text-void-400" />
      <div className="flex gap-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLanguage('en')}
          className={`
            px-3 py-1 rounded font-mono text-sm transition-all
            ${language === 'en' 
              ? 'bg-consciousness-500 text-white' 
              : 'text-void-400 hover:text-void-300'
            }
          `}
        >
          EN
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLanguage('te')}
          className={`
            px-3 py-1 rounded font-mono text-sm transition-all
            ${language === 'te' 
              ? 'bg-consciousness-500 text-white' 
              : 'text-void-400 hover:text-void-300'
            }
          `}
        >
          తె
        </motion.button>
      </div>
    </div>
  )
}
