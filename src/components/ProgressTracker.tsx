'use client'

import { motion } from 'framer-motion'
import { useProgressStore } from '@/store/progressStore'
import { CheckCircle, Circle, Lock } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function ProgressTracker() {
  const { levelProgress, completedLevels, consciousnessScore, isAdmin } = useProgressStore()
  const { t } = useTranslation()
  
  const totalLevels = 11
  const completedCount = completedLevels.length
  const progressPercentage = (completedCount / totalLevels) * 100

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass border border-void-500/30 rounded-xl p-6 max-w-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-display font-bold text-lg">{t.levels.yourJourney}</h3>
        {isAdmin && (
          <span className="text-xs font-mono text-consciousness-400 bg-consciousness-500/10 px-2 py-1 rounded">
            {t.common.adminMode.split(' ')[0]}
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-void-400 text-sm font-mono">{t.levels.progress}</span>
          <span className="text-consciousness-400 text-sm font-mono font-bold">
            {completedCount} / {totalLevels}
          </span>
        </div>
        <div className="h-3 bg-void-900 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-consciousness-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Consciousness Score */}
      <div className="glass border border-consciousness-500/20 rounded-lg p-4 mb-6">
        <div className="text-void-400 text-xs font-mono mb-2">{t.levels.consciousnessLevel}</div>
        <div className="text-consciousness-400 text-3xl font-bold font-mono">
          {consciousnessScore}
        </div>
        <div className="text-void-500 text-xs font-mono mt-1">
          {consciousnessScore < 100 && t.levels.awakening}
          {consciousnessScore >= 100 && consciousnessScore < 300 && t.levels.individualEmerging}
          {consciousnessScore >= 300 && consciousnessScore < 600 && t.levels.collectiveForming}
          {consciousnessScore >= 600 && consciousnessScore < 900 && t.levels.cosmicAchieved}
          {consciousnessScore >= 900 && t.levels.transcendent}
        </div>
      </div>

      {/* Level Status Grid */}
      <div className="space-y-2">
        <div className="text-void-400 text-xs font-mono mb-3">{t.levels.levelStatus}</div>
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((levelId) => {
            const isCompleted = completedLevels.includes(levelId)
            const level = levelProgress.find(lp => lp.id === levelId)
            const isUnlocked = level?.unlockedAt !== undefined
            
            return (
              <motion.div
                key={levelId}
                whileHover={{ scale: 1.1 }}
                className={`
                  aspect-square rounded-lg flex items-center justify-center font-mono text-sm font-bold
                  transition-all cursor-pointer
                  ${isCompleted 
                    ? 'bg-consciousness-500 text-white' 
                    : isUnlocked 
                      ? 'bg-void-800 text-void-400 border border-void-600' 
                      : 'bg-void-950 text-void-700 border border-void-800'
                  }
                `}
                title={`${t.levels.completeLevel} ${levelId}: ${
                  isCompleted ? t.common.completed : isUnlocked ? t.common.available : t.common.locked
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : isUnlocked ? (
                  levelId
                ) : (
                  <Lock className="w-3 h-3" />
                )}
              </motion.div>
            )
          })}
        </div>
        
        {/* Level NULL */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`
            w-full rounded-lg flex items-center justify-center font-mono text-sm font-bold py-3
            ${completedLevels.includes(0)
              ? 'bg-black border-2 border-gray-700 text-gray-500'
              : 'bg-black/50 border-2 border-gray-900 text-gray-800'
            }
          `}
          title="Level NULL: Terminal Challenge"
        >
          {completedLevels.includes(0) ? '∅ COMPLETE' : '∅ NULL'}
        </motion.div>
      </div>

      {/* Achievements */}
      {completedCount >= 5 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-6 border-t border-void-700"
        >
          <div className="text-void-400 text-xs font-mono mb-3">{t.levels.milestones}</div>
          <div className="space-y-2">
            {completedCount >= 5 && (
              <div className="flex items-center gap-2 text-consciousness-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>{t.levels.halfwayAwakened}</span>
              </div>
            )}
            {completedCount >= 10 && (
              <div className="flex items-center gap-2 text-purple-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>{t.levels.journeyComplete}</span>
              </div>
            )}
            {completedLevels.includes(0) && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>{t.levels.facedVoid}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
