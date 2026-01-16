'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, X, Star, Sparkles, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAchievementsStore } from '@/store/achievementsStore'
import { useProgressStore } from '@/store/progressStore'
import { soundManager } from '@/lib/sounds'
import { useTranslation } from '@/hooks/useTranslation'

export default function AchievementsPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [newAchievement, setNewAchievement] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { t } = useTranslation()
  
  const { achievements, checkAchievements, getProgress } = useAchievementsStore()
  const progressState = useProgressStore()
  const progress = getProgress()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const newlyUnlocked = checkAchievements(progressState)
    if (newlyUnlocked.length > 0) {
      soundManager?.achievementUnlocked()
      setNewAchievement(newlyUnlocked[0])
      setTimeout(() => setNewAchievement(null), 5000)
    }
  }, [progressState.completedLevels, progressState.consciousnessScore, checkAchievements, progressState])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 via-orange-500 to-red-500'
      case 'epic': return 'from-purple-500 to-pink-500'
      case 'rare': return 'from-blue-500 to-cyan-500'
      case 'common': return 'from-gray-500 to-gray-600'
      default: return 'from-void-500 to-void-600'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'all': return t.achievements.all
      case 'unlocked': return t.achievements.unlocked
      case 'progress': return t.achievements.categoryProgress
      case 'mastery': return t.achievements.categoryMastery
      case 'exploration': return t.achievements.categoryExploration
      case 'speed': return t.achievements.categorySpeed
      case 'special': return t.achievements.special
      default: return t.achievements.other
    }
  }

  const filteredAchievements = filter === 'all'
    ? achievements
    : achievements.filter(a => a.category === filter || (filter === 'unlocked' && a.unlocked))

  return (
    <>
      {/* Floating Achievements Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 glass border border-void-500/40 rounded-full p-3 sm:p-4 hover:border-amber-500/60 transition-all group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 group-hover:text-amber-300" />
        {isMounted && progress.unlocked > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-amber-500 rounded-full flex items-center justify-center text-xs font-bold"
          >
            {progress.unlocked}
          </motion.div>
        )}
      </motion.button>

      {/* New Achievement Notification */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[300] glass border border-amber-500/60 rounded-2xl p-6 max-w-md shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.2, 1.2, 1.2, 1],
                }}
                transition={{ duration: 0.5 }}
                className="text-5xl"
              >
                {achievements.find(a => a.id === newAchievement)?.icon}
              </motion.div>
              <div>
                <p className="text-amber-400 text-sm font-semibold mb-1">
                  {t.achievements.unlocked}!
                </p>
                <h3 className="text-white font-display font-bold text-xl">
                  {achievements.find(a => a.id === newAchievement)?.title}
                </h3>
                <p className="text-void-300 text-sm">
                  {achievements.find(a => a.id === newAchievement)?.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass border border-void-500/40 rounded-2xl p-6 max-w-4xl w-full max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <Trophy className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">
                      {t.achievements.title}
                    </h2>
                    <p className="text-void-400 text-sm">
                      {progress.unlocked} of {progress.total} {t.achievements.unlocked.toLowerCase()} ({progress.percentage}%)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-void-800/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-void-400" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full h-3 bg-void-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percentage}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'unlocked', 'progress', 'mastery', 'exploration', 'speed', 'special'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                      filter === cat
                        ? 'bg-amber-500 text-white'
                        : 'bg-void-800/50 text-void-400 hover:bg-void-800 hover:text-white'
                    }`}
                  >
                    {getCategoryLabel(cat)}
                  </button>
                ))}
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-xl border ${
                      achievement.unlocked
                        ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} p-[2px]`
                        : 'border-void-500/20 bg-void-900/30'
                    }`}
                  >
                    <div className={achievement.unlocked ? 'bg-void-950 rounded-xl p-4' : ''}>
                      <div className="flex items-start gap-4">
                        <motion.div
                          animate={achievement.unlocked ? {
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          className={`text-4xl ${!achievement.unlocked && 'grayscale opacity-30'}`}
                        >
                          {achievement.unlocked ? achievement.icon : '🔒'}
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-display font-bold ${achievement.unlocked ? 'text-white' : 'text-void-600'}`}>
                              {achievement.unlocked ? achievement.title : '???'}
                            </h3>
                            {achievement.unlocked && (
                              <span className={`text-xs px-2 py-0.5 rounded bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white font-semibold`}>
                                {achievement.rarity}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm mb-2 ${achievement.unlocked ? 'text-void-300' : 'text-void-700'}`}>
                            {achievement.unlocked ? achievement.description : 'Hidden achievement - keep playing to discover!'}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-void-500 font-mono">
                              {getCategoryLabel(achievement.category)}
                            </span>
                            {achievement.unlocked && achievement.unlockedAt && (
                              <span className="text-xs text-void-600">
                                • {new Date(achievement.unlockedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredAchievements.length === 0 && (
                <div className="text-center py-12">
                  <Lock className="w-12 h-12 text-void-600 mx-auto mb-4" />
                  <p className="text-void-400">
                    No achievements found in this category yet.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
