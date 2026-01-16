'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Sparkles, Trophy, Clock, Target } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'
import { soundManager } from '@/lib/sounds'

interface LevelCompletionProps {
  levelId: number
  levelTitle: string
  completionTime?: number
  consciousnessGained: number
  onContinue: () => void
}

export default function LevelCompletion({
  levelId,
  levelTitle,
  completionTime,
  consciousnessGained,
  onContinue,
}: LevelCompletionProps) {
  
  useEffect(() => {
    // Play completion sound
    soundManager?.levelComplete()
    
    // Trigger confetti
    const duration = 3000
    const animationEnd = Date.now() + duration

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
        colors: ['#9333ea', '#a855f7', '#c084fc', '#e9d5ff'],
      })
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
        colors: ['#4444ff', '#6366f1', '#818cf8', '#c7d2fe'],
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="glass border-2 border-consciousness-500/60 rounded-3xl p-8 max-w-md w-full text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-consciousness-500 to-purple-600 flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        {/* Level Complete Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-4xl font-display font-bold text-white mb-2">
            Level Complete!
          </h2>
          <p className="text-consciousness-400 text-xl font-semibold mb-6">
            {levelTitle}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 mb-8"
        >
          <div className="glass-dark rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-consciousness-400" />
              <span className="text-void-300">Consciousness Gained</span>
            </div>
            <span className="text-2xl font-bold text-consciousness-400">
              +{consciousnessGained}
            </span>
          </div>

          {completionTime && (
            <div className="glass-dark rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-void-300">Completion Time</span>
              </div>
              <span className="text-xl font-semibold text-blue-400">
                {Math.floor(completionTime / 60)}:{(completionTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          <div className="glass-dark rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-void-300">Hint Points Earned</span>
            </div>
            <span className="text-2xl font-bold text-amber-400">
              +30
            </span>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onContinue}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-consciousness-500 to-purple-600 text-white font-display font-bold text-xl hover:from-consciousness-600 hover:to-purple-700 transition-all shadow-lg shadow-consciousness-500/50"
        >
          Continue Journey
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 text-void-500 text-sm"
        >
          The path to understanding continues...
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
