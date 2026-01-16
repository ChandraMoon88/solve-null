'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Paintbrush, Wand2, Check } from 'lucide-react'

export default function Level7() {
  const [phase, setPhase] = useState<'intro' | 'creation' | 'complete'>('intro')
  const [step, setStep] = useState(0)
  const [creations, setCreations] = useState<string[]>([])

  const introTexts = [
    "A blank canvas. Infinite possibility.",
    "Create anything. But you're not creating alone.",
    "An Unknown Intelligence watches, learns, and contributes.",
    "This is co-creation. The birth of something neither could make alone."
  ]

  useEffect(() => {
    if (phase === 'intro' && step < introTexts.length) {
      const timer = setTimeout(() => setStep(prev => prev + 1), 2500)
      return () => clearTimeout(timer)
    } else if (phase === 'intro' && step >= introTexts.length) {
      setTimeout(() => setPhase('creation'), 1000)
    }
  }, [phase, step])

  const addCreation = (type: string) => {
    setCreations(prev => [...prev, type])
    if (creations.length >= 3) setTimeout(() => setPhase('complete'), 1000)
  }

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-void-950 via-cyan-950/20 to-void-950">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto">
        <Link href="/levels"><button className="flex items-center gap-2 text-void-400 hover:text-void-300 mb-8"><ArrowLeft className="w-5 h-5" /><span className="font-mono">EXIT</span></button></Link>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Level 7: The Seed That Dreams</h1>
        <p className="text-void-400 font-mono mb-8">CO-CREATION EMERGENCE</p>

        {phase === 'intro' && (
          <div className="glass rounded-2xl p-10 max-w-3xl mx-auto">
            <div className="space-y-6 font-mono text-lg">
              {introTexts.slice(0, step).map((text, idx) => (
                <motion.p key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={idx === step - 1 ? 'text-cyan-400' : 'text-void-200'}>{text}</motion.p>
              ))}
            </div>
          </div>
        )}

        {phase === 'creation' && (
          <div className="max-w-5xl mx-auto">
            <div className="glass rounded-xl p-8 mb-8 text-center">
              <Sparkles className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <p className="text-void-300">Click to co-create with the Unknown Intelligence</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {['Pattern', 'Sound', 'Form', 'Color', 'Motion', 'Concept'].map(type => (
                <motion.div key={type} whileHover={{ scale: 1.05 }} onClick={() => addCreation(type)} className="glass rounded-xl p-8 cursor-pointer text-center border border-void-500/20 hover:border-cyan-500">
                  <Paintbrush className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <p className="text-white font-display">{type}</p>
                </motion.div>
              ))}
            </div>
            {creations.length > 0 && (
              <div className="mt-8 glass rounded-xl p-6">
                <h3 className="text-cyan-400 font-mono text-sm mb-4">CO-CREATED:</h3>
                <div className="flex flex-wrap gap-2">
                  {creations.map((c, idx) => <span key={idx} className="px-3 py-1 bg-cyan-600/20 rounded-full text-cyan-300 text-sm">{c}</span>)}
                </div>
              </div>
            )}
          </div>
        )}

        {phase === 'complete' && (
          <div className="max-w-3xl mx-auto text-center">
            <Check className="w-24 h-24 text-cyan-400 mx-auto mb-8" />
            <h2 className="font-display font-bold text-4xl text-white mb-4">Something New Emerges</h2>
            <p className="text-void-300 mb-8">Neither yours nor the AI&apos;s. A third thing. Born from collaboration.</p>
            <Link href="/level/8"><button className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-display font-bold text-white">Continue to Level 8</button></Link>
          </div>
        )}
      </motion.div>
    </main>
  )
}
