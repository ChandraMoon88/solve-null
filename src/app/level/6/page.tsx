'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Book, Eye, Sparkles, Check, Infinity as InfinityIcon } from 'lucide-react'

export default function Level6() {
  const [phase, setPhase] = useState<'intro' | 'library' | 'discovery' | 'complete'>('intro')
  const [step, setStep] = useState(0)
  const [observerCount, setObserverCount] = useState(1)
  const [discoveryRealized, setDiscoveryRealized] = useState(false)

  const introTexts = [
    "An infinite library. Every book ever written. Every book that could be written.",
    "Your task: catalog it. Organize it. Make sense of infinity.",
    "But there's a problem.",
    "Every time you observe a section, it branches into new possibilities.",
    "The Observer changes the observed.",
    "You are not alone here. Multiple versions of you exist simultaneously.",
    "And they're all cataloging different infinities."
  ]

  useEffect(() => {
    if (phase === 'intro' && step < introTexts.length) {
      const timer = setTimeout(() => setStep(prev => prev + 1), 2500)
      return () => clearTimeout(timer)
    } else if (phase === 'intro' && step >= introTexts.length) {
      setTimeout(() => setPhase('library'), 1000)
    }
  }, [phase, step])

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-void-950 via-purple-950/30 to-void-950">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto mb-8">
        <Link href="/levels">
          <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-void-400 hover:text-void-300 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-mono">EXIT LEVEL</span>
          </motion.button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
            <Book className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Level 6: The Archive</h1>
        </div>
        <p className="text-void-400 font-mono">OBSERVER PROLIFERATION CHALLENGE</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto mt-20">
            <div className="glass rounded-2xl p-10">
              <div className="space-y-6 font-mono text-lg">
                {introTexts.slice(0, step).map((text, idx) => (
                  <motion.p key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={idx === step - 1 ? 'text-purple-400' : 'text-void-200'}>
                    {text}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'library' && (
          <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
            <div className="glass rounded-xl p-8 mb-8 text-center">
              <InfinityIcon className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-spin" style={{ animationDuration: '8s' }} />
              <div className="text-4xl font-display font-bold text-white mb-2">{observerCount} Observers</div>
              <p className="text-void-400">Each cataloging a different infinity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div whileHover={{ scale: 1.02 }} onClick={() => setObserverCount(prev => prev * 2)} className="glass rounded-xl p-6 cursor-pointer hover:border-purple-500 border border-void-500/20">
                <Eye className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="font-display font-bold text-white mb-2">Observe Section A</h3>
                <p className="text-void-300 text-sm">Branches create new possibilities</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} onClick={() => setObserverCount(prev => prev * 2)} className="glass rounded-xl p-6 cursor-pointer hover:border-purple-500 border border-void-500/20">
                <Eye className="w-8 h-8 text-indigo-400 mb-3" />
                <h3 className="font-display font-bold text-white mb-2">Observe Section B</h3>
                <p className="text-void-300 text-sm">Each observation multiplies reality</p>
              </motion.div>
            </div>

            {observerCount >= 8 && !discoveryRealized && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-8 border-2 border-purple-500/50 text-center">
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h2 className="font-display font-bold text-2xl text-white mb-4">The Realization</h2>
                <p className="text-void-300 mb-6">You cannot catalog infinity. You can only become part of it.</p>
                <button onClick={() => { setDiscoveryRealized(true); setPhase('complete'); }} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-display font-bold text-white">
                  Merge With The Archive
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto text-center">
            <Check className="w-24 h-24 text-purple-400 mx-auto mb-8" />
            <h2 className="font-display font-bold text-4xl text-white mb-4">Archive Integrated</h2>
            <p className="text-void-300 mb-8">You are now one of the infinite observers, cataloging one of infinite realities.</p>
            <Link href="/level/7">
              <motion.button whileHover={{ scale: 1.05 }} className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-display font-bold text-white">
                Continue to Level 7
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
