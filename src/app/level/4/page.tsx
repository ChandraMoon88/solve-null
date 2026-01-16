'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Users, Check, Lock, Unlock, Eye } from 'lucide-react'

const protocols = [
  { id: 7, name: 'Trust Protocol', benefit: 'Shared knowledge', cost: 'Vulnerability', discovered: true },
  { id: 8, name: 'Hidden Protocol', benefit: 'True collaboration', cost: 'Ego', discovered: false },
  { id: 9, name: 'Unity Protocol', benefit: 'Transcendence', cost: 'Individual control', discovered: false }
]

export default function Level4() {
  const [phase, setPhase] = useState<'intro' | 'active' | 'discovery' | 'complete'>('intro')
  const [step, setStep] = useState(0)
  const [selectedProtocol, setSelectedProtocol] = useState<number | null>(null)
  const [foundOption5, setFoundOption5] = useState(false)

  const introTexts = [
    "Five traders compete for market supremacy.",
    "Four protocols govern their interactions.",
    "Protocols 1-4 create winners and losers.",
    "But there's always been a Protocol 5.",
    "Hidden. Unlisted. Requiring all five to choose simultaneously.",
    "It doesn't maximize individual gain. It transcends the competition entirely."
  ]

  useEffect(() => {
    if (phase === 'intro' && step < introTexts.length) {
      const timer = setTimeout(() => setStep(prev => prev + 1), 2500)
      return () => clearTimeout(timer)
    } else if (phase === 'intro' && step >= introTexts.length) {
      setTimeout(() => setPhase('active'), 1000)
    }
  }, [phase, step])

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-void-950 via-orange-950/20 to-void-950">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto mb-8">
        <Link href="/levels">
          <motion.button whileHover={{ x: -5 }} className="flex items-center gap-2 text-void-400 hover:text-void-300 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-mono">EXIT LEVEL</span>
          </motion.button>
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">Level 4: The Five Traders</h1>
        </div>
        <p className="text-void-400 font-mono">PROTOCOL DISCOVERY CHALLENGE</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto mt-20">
            <div className="glass rounded-2xl p-10">
              <div className="space-y-6 font-mono text-lg">
                {introTexts.slice(0, step).map((text, idx) => (
                  <motion.p key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={idx === step - 1 ? 'text-orange-400' : 'text-void-200'}>
                    {text}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'active' && (
          <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {protocols.map(p => (
                <motion.div key={p.id} whileHover={{ scale: 1.02 }} onClick={() => { setSelectedProtocol(p.id); if (p.id === 8) setFoundOption5(true); }} className={`glass rounded-xl p-6 cursor-pointer border ${selectedProtocol === p.id ? 'border-orange-500' : p.discovered ? 'border-void-500/20' : 'border-dashed border-void-700'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-bold text-white">Protocol {p.id}</h3>
                    {p.discovered ? <Unlock className="w-5 h-5 text-green-400" /> : <Lock className="w-5 h-5 text-void-600" />}
                  </div>
                  {p.discovered && (
                    <>
                      <p className="text-void-300 text-sm mb-2">{p.name}</p>
                      <div className="flex justify-between text-xs">
                        <span className="text-green-400">+{p.benefit}</span>
                        <span className="text-red-400">-{p.cost}</span>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>

            {foundOption5 && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-8 border-2 border-orange-500/50 text-center">
                <Check className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h2 className="font-display font-bold text-3xl text-white mb-4">Protocol 8 Discovered</h2>
                <p className="text-void-300 mb-6">The hidden option that requires unanimous choice. Not competition, but collaboration.</p>
                <Link href="/level/5">
                  <motion.button whileHover={{ scale: 1.05 }} className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-display font-bold text-white">
                    Continue to Level 5
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
