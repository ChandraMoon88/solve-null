'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useProgressStore } from '@/store/progressStore'
import { motion } from 'framer-motion'
import { Lock, Shield } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

interface LevelGuardProps {
  levelId: number
  children: React.ReactNode
}

export default function LevelGuard({ levelId, children }: LevelGuardProps) {
  const router = useRouter()
  const { isLevelUnlocked, isAdmin } = useProgressStore()
  const { t } = useTranslation()
  
  useEffect(() => {
    if (!isLevelUnlocked(levelId) && !isAdmin) {
      router.push('/levels')
    }
  }, [levelId, isLevelUnlocked, isAdmin, router])

  if (!isLevelUnlocked(levelId) && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass border border-void-500/40 rounded-2xl p-12 text-center max-w-md"
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1.1, 1.1, 1]
            }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-void-900 border-2 border-void-600 mb-6"
          >
            <Lock className="w-10 h-10 text-void-500" />
          </motion.div>
          
          <h2 className="text-2xl font-display font-bold text-white mb-3">
            {t.levelGuard.levelLocked}
          </h2>
          
          <p className="text-void-300 mb-6">
            {t.levelGuard.notAccessible}
          </p>
          
          <button
            onClick={() => router.push('/levels')}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-consciousness-500 to-consciousness-600 text-white font-semibold hover:from-consciousness-600 hover:to-consciousness-700 transition-all"
          >
            {t.levelGuard.returnToLevels}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 glass border border-consciousness-500/40 rounded-lg px-4 py-2 flex items-center gap-2"
        >
          <Shield className="w-4 h-4 text-consciousness-400" />
          <span className="text-consciousness-400 font-mono text-sm">{t.common.adminMode}</span>
        </motion.div>
      )}
      {children}
    </>
  )
}
