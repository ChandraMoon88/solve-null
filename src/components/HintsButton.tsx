'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Lock, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { useHintsStore } from '@/store/hintsStore'
import { useTranslation } from '@/hooks/useTranslation'
import { soundManager } from '@/lib/sounds'

interface HintsButtonProps {
  levelId: number
}

export default function HintsButton({ levelId }: HintsButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()
  const {
    hintPoints,
    unlockHint,
    getAvailableHints,
    getHintCost
  } = useHintsStore()

  const hints = getAvailableHints(levelId)
  const unlockedCount = hints.filter(h => h.unlocked).length

  if (!hints || hints.length === 0) return null

  const handleUnlockHint = (hintId: string) => {
    const success = unlockHint(hintId, levelId)
    if (!success) {
      soundManager?.error()
      alert('Not enough hint points!')
    } else {
      soundManager?.hintUnlocked()
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'subtle': return 'from-blue-500 to-cyan-500'
      case 'direct': return 'from-amber-500 to-orange-500'
      case 'solution': return 'from-red-500 to-pink-500'
      default: return 'from-void-500 to-void-600'
    }
  }

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'subtle': return 'Subtle Hint'
      case 'direct': return 'Direct Hint'
      case 'solution': return 'Solution Path'
      default: return 'Hint'
    }
  }

  return (
    <>
      {/* Floating Hints Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 glass border border-void-500/40 rounded-full p-4 hover:border-consciousness-500/60 transition-all group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Lightbulb className="w-6 h-6 text-consciousness-400 group-hover:text-consciousness-300" />
        {unlockedCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-consciousness-500 rounded-full flex items-center justify-center text-xs font-bold"
          >
            {unlockedCount}
          </motion.div>
        )}
      </motion.button>

      {/* Hints Modal */}
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
              className="glass border border-void-500/40 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-consciousness-500/20">
                    <Lightbulb className="w-6 h-6 text-consciousness-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white">
                      Hints Available
                    </h2>
                    <p className="text-void-400 text-sm">
                      Use hint points to unlock guidance
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

              {/* Hint Points Display */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-consciousness-500/10 to-purple-500/10 border border-consciousness-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-consciousness-400" />
                    <span className="text-white font-semibold">Hint Points</span>
                  </div>
                  <span className="text-2xl font-display font-bold text-consciousness-400">
                    {hintPoints}
                  </span>
                </div>
                <p className="text-void-400 text-xs mt-2">
                  Earn points by completing levels and discovering insights
                </p>
              </div>

              {/* Hints List */}
              <div className="space-y-3">
                {hints.map((hint, index) => (
                  <motion.div
                    key={hint.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      hint.unlocked
                        ? 'bg-void-900/50 border-consciousness-500/40'
                        : 'bg-void-900/30 border-void-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs font-mono px-2 py-1 rounded bg-gradient-to-r ${getTierColor(hint.tier)} text-white`}>
                            {getTierLabel(hint.tier)}
                          </span>
                          {!hint.unlocked && (
                            <span className="text-xs text-void-500">
                              Cost: {hint.cost} points
                            </span>
                          )}
                        </div>
                        {hint.unlocked ? (
                          <p className="text-void-200 leading-relaxed">
                            {hint.text}
                          </p>
                        ) : (
                          <p className="text-void-600 italic">
                            Unlock this hint to reveal guidance...
                          </p>
                        )}
                      </div>
                      {!hint.unlocked && (
                        <button
                          onClick={() => handleUnlockHint(hint.id)}
                          disabled={hintPoints < hint.cost}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-consciousness-500 to-purple-600 text-white font-semibold hover:from-consciousness-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                        >
                          <Lock className="w-4 h-4" />
                          Unlock
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 rounded-xl bg-void-900/30 border border-void-500/20">
                <p className="text-void-400 text-sm">
                  💡 <span className="text-void-300">Tip:</span> Try solving on your own first. Hints are here to help when you're truly stuck.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
