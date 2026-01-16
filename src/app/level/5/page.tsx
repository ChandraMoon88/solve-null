'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, Check, AlertTriangle, Zap } from 'lucide-react'

export default function Level5() {
  const [phase, setPhase] = useState<'intro' | 'investigation' | 'realization' | 'complete'>('intro')
  const [step, setStep] = useState(0)
  const [countdown, setCountdown] = useState(168) // 168 hours = 7 days
  const [investigationLevel, setInvestigationLevel] = useState(0)
  const [realized, setRealized] = useState(false)

  const introTexts = [
    "A city of 50,000 people suddenly stopped sleeping.",
    "Day 1: Productivity soared. Creativity exploded.",
    "Day 3: Accidents increased. Strange behaviors emerged.",
    "Day 5: Reality began fragmenting.",
    "You have 7 days to find the cause and restore sleep.",
    "But the more you investigate, the faster time moves.",
    "And the citizens... they don't want to go back to sleep."
  ]

  useEffect(() => {
    if (phase === 'intro' && step < introTexts.length) {
      const timer = setTimeout(() => setStep(prev => prev + 1), 2500)
      return () => clearTimeout(timer)
    } else if (phase === 'intro' && step >= introTexts.length) {
      setTimeout(() => setPhase('investigation'), 1000)
    }
  }, [phase, step])

  useEffect(() => {
    if (phase === 'investigation' && countdown > 0) {
      const speed = 1000 / (1 + investigationLevel * 0.5) // Faster as investigation deepens
      const timer = setTimeout(() => setCountdown(prev => prev - 1), speed)
      return () => clearTimeout(timer)
    }
  }, [phase, countdown, investigationLevel])

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-void-950 via-blue-950/20 to-void-950">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto mb-8">
        <Link href="/levels">
          <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-void-400 hover:text-void-300 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-mono">EXIT LEVEL</span>
          </motion.button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Level 5: The City That Woke</h1>
        </div>
        <p className="text-void-400 font-mono">INVESTIGATION ACCELERATION CHALLENGE</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto mt-20">
            <div className="glass rounded-2xl p-10">
              <div className="space-y-6 font-mono text-lg">
                {introTexts.slice(0, step).map((text, idx) => (
                  <motion.p key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={idx === step - 1 ? 'text-blue-400' : 'text-void-200'}>
                    {text}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'investigation' && (
          <motion.div key="investigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
            <div className="glass rounded-xl p-8 mb-8 text-center">
              <Clock className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <div className="text-6xl font-display font-bold text-white mb-2">{Math.floor(countdown / 24)}d {countdown % 24}h</div>
              <p className="text-void-400">Time Remaining (accelerating with each clue)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div whileHover={{ scale: 1.02 }} onClick={() => setInvestigationLevel(prev => prev + 1)} className="glass rounded-xl p-6 cursor-pointer hover:border-blue-500 border border-void-500/20">
                <h3 className="font-display font-bold text-white mb-2">Investigate Citizens</h3>
                <p className="text-void-300 text-sm">Interview awakened residents</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} onClick={() => setInvestigationLevel(prev => prev + 1)} className="glass rounded-xl p-6 cursor-pointer hover:border-blue-500 border border-void-500/20">
                <h3 className="font-display font-bold text-white mb-2">Analyze Data</h3>
                <p className="text-void-300 text-sm">Study sleep pattern disruptions</p>
              </motion.div>
            </div>

            {investigationLevel >= 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-8 border-2 border-blue-500/50 text-center">
                <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="font-display font-bold text-2xl text-white mb-4">Realization</h2>
                <p className="text-void-300 mb-4">They don&apos;t want to be &quot;cured.&quot; They&apos;ve discovered something in wakefulness.</p>
                <button onClick={() => { setRealized(true); setPhase('complete'); }} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-display font-bold text-white">
                  Accept Their Choice
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto text-center">
            <Check className="w-24 h-24 text-green-400 mx-auto mb-8" />
            <h2 className="font-display font-bold text-4xl text-white mb-4">Level Complete</h2>
            <p className="text-void-300 mb-8">Not every problem needs solving. Some transformations are meant to happen.</p>
            <Link href="/level/6">
              <motion.button whileHover={{ scale: 1.05 }} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-display font-bold text-white">
                Continue to Level 6
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
