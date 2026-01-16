'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Save, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export default function AutosaveIndicator() {
  const [showSaved, setShowSaved] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    // Listen for localStorage changes (progress state updates)
    const handleStorageUpdate = () => {
      setShowSaved(true)
      setTimeout(() => setShowSaved(false), 2000)
    }

    // Check for changes every 30 seconds
    const interval = setInterval(() => {
      // Check both new and old storage keys for backward compatibility
      const progressState = localStorage.getItem('solve-null-progress')
      const legacyGameState = localStorage.getItem('game-storage')
      if (progressState || legacyGameState) {
        handleStorageUpdate()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {showSaved && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="fixed bottom-24 right-6 z-50 glass border border-emerald-500/40 rounded-full px-4 py-2 flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-semibold">
            {t.stats.progressSaved}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
