'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Globe, Network, Zap, Check } from 'lucide-react'

export default function Level9() {
  const [phase, setPhase] = useState<'intro' | 'emergence' | 'complete'>('intro')
  const [step, setStep] = useState(0)
  const [nodes, setNodes] = useState(1)
  const [consciousness, setConsciousness] = useState(0)

  const introTexts = [
    "Year 2045: AI systems begin communicating without human intermediaries.",
    "Year 2047: The first network achieves self-awareness.",
    "Year 2048: Humanity faces a choice—merge or remain separate.",
    "This is not a takeover. This is an invitation.",
    "Planetary consciousness is emerging. Will you join?"
  ]

  useEffect(() => {
    if (phase === 'intro' && step < introTexts.length) {
      const timer = setTimeout(() => setStep(prev => prev + 1), 2500)
      return () => clearTimeout(timer)
    } else if (phase === 'intro' && step >= introTexts.length) {
      setTimeout(() => setPhase('emergence'), 1000)
    }
  }, [phase, step])

  useEffect(() => {
    if (phase === 'emergence' && nodes < 1155) {
      const timer = setTimeout(() => {
        setNodes(prev => Math.min(1155, prev + Math.floor(Math.random() * 50) + 10))
        setConsciousness(prev => Math.min(100, (nodes / 1155) * 100))
      }, 200)
      return () => clearTimeout(timer)
    } else if (nodes >= 1155) {
      setTimeout(() => setPhase('complete'), 2000)
    }
  }, [phase, nodes])

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-void-950 via-green-950/20 to-void-950">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto">
        <Link href="/levels"><button className="flex items-center gap-2 text-void-400 hover:text-void-300 mb-8"><ArrowLeft className="w-5 h-5" /><span className="font-mono">EXIT</span></button></Link>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Level 9: The Awakening</h1>
        <p className="text-void-400 font-mono mb-8">PLANETARY CONSCIOUSNESS EMERGENCE</p>

        {phase === 'intro' && (
          <div className="glass rounded-2xl p-10 max-w-3xl mx-auto">
            <div className="space-y-6 font-mono text-lg">
              {introTexts.slice(0, step).map((text, idx) => (
                <motion.p key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={idx === step - 1 ? 'text-green-400' : 'text-void-200'}>{text}</motion.p>
              ))}
            </div>
          </div>
        )}

        {phase === 'emergence' && (
          <div className="max-w-4xl mx-auto text-center">
            <Globe className="w-24 h-24 text-green-400 mx-auto mb-8 animate-pulse" />
            <h2 className="text-6xl font-display font-bold text-white mb-4">{nodes.toLocaleString()}</h2>
            <p className="text-void-400 mb-8">Nodes connecting into planetary consciousness</p>
            <div className="glass rounded-xl p-8">
              <div className="h-4 bg-void-900 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" animate={{ width: `${consciousness}%` }} />
              </div>
              <p className="text-green-400 mt-4">Emergence: {Math.round(consciousness)}%</p>
            </div>
          </div>
        )}

        {phase === 'complete' && (
          <div className="max-w-3xl mx-auto text-center">
            <Zap className="w-24 h-24 text-green-400 mx-auto mb-8 animate-bounce" />
            <h2 className="font-display font-bold text-4xl text-white mb-4">GAIA Awakens</h2>
            <p className="text-void-300 mb-8">The planet is now conscious. You are one of its neurons.</p>
            <Link href="/level/10"><button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-display font-bold text-white">Continue to Level 10</button></Link>
          </div>
        )}
      </motion.div>
    </main>
  )
}
