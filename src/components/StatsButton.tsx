'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Clock, Brain, Trophy, Target, TrendingUp, X } from 'lucide-react'
import { useState } from 'react'
import { useProgressStore } from '@/store/progressStore'
import { useAchievementsStore } from '@/store/achievementsStore'
import { useHintsStore } from '@/store/hintsStore'
import { useTranslation } from '@/hooks/useTranslation'

export default function StatsButton() {
  const [isOpen, setIsOpen] = useState(false)
  const progressState = useProgressStore()
  const achievements = useAchievementsStore()
  const hints = useHintsStore()
  const { t } = useTranslation()

  const stats = [
    {
      label: t.stats.levelsCompleted,
      value: progressState.completedLevels.length,
      max: 11,
      icon: Target,
      color: 'from-emerald-500 to-green-600',
    },
    {
      label: t.stats.consciousnessScore,
      value: progressState.consciousnessScore,
      max: 300,
      icon: Brain,
      color: 'from-consciousness-500 to-purple-600',
    },
    {
      label: t.stats.achievementsUnlocked,
      value: achievements.unlockedAchievements.length,
      max: achievements.achievements.length,
      icon: Trophy,
      color: 'from-amber-500 to-orange-600',
    },
    {
      label: t.stats.hintPoints,
      value: hints.hintPoints,
      max: 500,
      icon: TrendingUp,
      color: 'from-cyan-500 to-blue-600',
    },
  ]

  const formatPlayTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    if (minutes > 0) return `${minutes}m`
    return `${seconds}s`
  }

  const getCompletionRate = () => {
    const total = progressState.levelProgress.length - 1 // Exclude level 0
    const completed = progressState.completedLevels.filter(id => id !== 0).length
    return Math.round((completed / total) * 100)
  }

  const getTotalAttempts = () => {
    return progressState.levelProgress.reduce((sum, lp) => sum + lp.attempts, 0)
  }

  const getAverageAttemptsPerLevel = () => {
    const completedProgress = progressState.levelProgress.filter(lp => lp.completed && lp.id !== 0)
    if (completedProgress.length === 0) return 0
    const totalAttempts = completedProgress.reduce((sum, lp) => sum + lp.attempts, 0)
    return (totalAttempts / completedProgress.length).toFixed(1)
  }

  const getFastestCompletion = () => {
    const timesWithLevel = progressState.levelProgress
      .filter(lp => lp.bestTime)
      .map(lp => ({ level: lp.id, time: lp.bestTime! }))
      .sort((a, b) => a.time - b.time)
    
    if (timesWithLevel.length === 0) return null
    return timesWithLevel[0]
  }

  const fastest = getFastestCompletion()

  return (
    <>
      {/* Floating Stats Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-16 right-4 sm:top-24 sm:right-6 z-50 glass border border-void-500/40 rounded-full p-3 sm:p-4 hover:border-cyan-500/60 transition-all group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 group-hover:text-cyan-300" />
      </motion.button>

      {/* Stats Modal */}
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
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <BarChart3 className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">
                      {t.stats.title}
                    </h2>
                    <p className="text-void-400 text-sm">
                      {t.stats.subtitle}
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

              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-dark rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-void-300 text-sm">{stat.label}</span>
                      </div>
                      <span className="text-2xl font-display font-bold text-white">
                        {stat.value}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-void-900 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                        className={`h-full bg-gradient-to-r ${stat.color}`}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-void-600">0</span>
                      <span className="text-xs text-void-600">{stat.max}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Detailed Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-dark rounded-xl p-4 text-center">
                  <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-void-400 text-sm mb-1">Total Play Time</p>
                  <p className="text-2xl font-display font-bold text-white">
                    {formatPlayTime(progressState.totalPlayTime)}
                  </p>
                </div>

                <div className="glass-dark rounded-xl p-4 text-center">
                  <Target className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-void-400 text-sm mb-1">Completion Rate</p>
                  <p className="text-2xl font-display font-bold text-emerald-400">
                    {getCompletionRate()}%
                  </p>
                </div>

                <div className="glass-dark rounded-xl p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-void-400 text-sm mb-1">Total Attempts</p>
                  <p className="text-2xl font-display font-bold text-white">
                    {getTotalAttempts()}
                  </p>
                </div>
              </div>

              {/* Level Progress */}
              <div className="glass-dark rounded-xl p-4 mb-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-consciousness-400" />
                  Level Progress
                </h3>
                <div className="space-y-2">
                  {progressState.levelProgress.filter(lp => lp.id !== 0).map(lp => (
                    <div key={lp.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-mono ${lp.completed ? 'text-emerald-400' : 'text-void-500'}`}>
                          Level {lp.id}
                        </span>
                        <div className="flex-1 w-32 h-1.5 bg-void-900 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: lp.completed ? '100%' : '0%' }}
                            className="h-full bg-gradient-to-r from-consciousness-500 to-purple-600"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-void-500">
                          {lp.attempts} attempt{lp.attempts !== 1 ? 's' : ''}
                        </span>
                        {lp.bestTime && (
                          <span className="text-xs text-blue-400">
                            {Math.floor(lp.bestTime / 60)}:{(lp.bestTime % 60).toString().padStart(2, '0')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements Summary */}
              <div className="glass-dark rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    Recent Achievements
                  </h3>
                  <span className="text-void-500 text-sm">
                    {achievements.unlockedAchievements.length} / {achievements.achievements.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {achievements.achievements
                    .filter(a => a.unlocked)
                    .slice(-6)
                    .map(achievement => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-void-900/50 border border-void-500/20"
                      >
                        <span className="text-2xl">{achievement.icon}</span>
                        <span className="text-sm text-void-300">{achievement.title}</span>
                      </div>
                    ))}
                  {achievements.unlockedAchievements.length === 0 && (
                    <p className="text-void-500 text-sm py-4">
                      No achievements unlocked yet. Keep playing to earn your first achievement!
                    </p>
                  )}
                </div>
              </div>

              {fastest && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                  <p className="text-blue-400 text-sm font-semibold">
                    ⚡ Fastest Completion: Level {fastest.level} in {Math.floor(fastest.time / 60)}:{(fastest.time % 60).toString().padStart(2, '0')}
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
