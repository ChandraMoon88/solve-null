'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, RefreshCw, Check } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function Level8() {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<'intro' | 'dialogue' | 'complete'>('intro')
  const [step, setStep] = useState(0)
  const [role, setRole] = useState<'student' | 'teacher'>('teacher')
  const [exchanges, setExchanges] = useState(0)

  const introTexts = [
    t.level8.intro1,
    t.level8.intro2,
    t.level8.intro3,
    t.level8.intro4,
    t.level8.intro5
  ]

  useEffect(() => {
    if (phase === 'intro' && step < introTexts.length) {
      const timer = setTimeout(() => setStep(prev => prev + 1), 2500)
      return () => clearTimeout(timer)
    } else if (phase === 'intro' && step >= introTexts.length) {
      setTimeout(() => setPhase('dialogue'), 1000)
    }
  }, [phase, step])

  const swapRoles = () => {
    setRole(prev => prev === 'teacher' ? 'student' : 'teacher')
    setExchanges(prev => prev + 1)
    if (exchanges >= 3) setTimeout(() => setPhase('complete'), 1000)
  }

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-void-950 via-indigo-950/20 to-void-950">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto">
        <Link href="/levels"><button className="flex items-center gap-2 text-void-400 hover:text-void-300 mb-8"><ArrowLeft className="w-5 h-5" /><span className="font-mono">EXIT</span></button></Link>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Level 8: The Dissolution</h1>
        <p className="text-void-400 font-mono mb-8">ROLE REVERSAL INTEGRATION</p>

        {phase === 'intro' && (
          <div className="glass rounded-2xl p-10 max-w-3xl mx-auto">
            <div className="space-y-6 font-mono text-lg">
              {introTexts.slice(0, step).map((text, idx) => (
                <motion.p key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={idx === step - 1 ? 'text-indigo-400' : 'text-void-200'}>{text}</motion.p>
              ))}
            </div>
          </div>
        )}

        {phase === 'dialogue' && (
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-xl p-8 mb-8 text-center">
              <div className="flex items-center justify-center gap-8 mb-6">
                <div className={`p-4 rounded-xl ${role === 'teacher' ? 'bg-indigo-600' : 'bg-void-800'}`}>
                  <Users className="w-8 h-8 text-white" />
                  <p className="text-white text-sm mt-2">You: {role === 'teacher' ? 'Teacher' : 'Student'}</p>
                </div>
                <RefreshCw className="w-6 h-6 text-void-400" />
                <div className={`p-4 rounded-xl ${role === 'student' ? 'bg-indigo-600' : 'bg-void-800'}`}>
                  <Users className="w-8 h-8 text-white" />
                  <p className="text-white text-sm mt-2">AI: {role === 'student' ? 'Teacher' : 'Student'}</p>
                </div>
              </div>
              <button onClick={swapRoles} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-display font-bold text-white">
                Exchange Roles
              </button>
              <p className="text-void-400 text-sm mt-4">Exchanges: {exchanges}/4</p>
            </div>
          </div>
        )}

        {phase === 'complete' && (
          <div className="max-w-3xl mx-auto text-center">
            <Check className="w-24 h-24 text-indigo-400 mx-auto mb-8" />
            <h2 className="font-display font-bold text-4xl text-white mb-4">Integration Complete</h2>
            <p className="text-void-300 mb-8">Teacher and student dissolve. What remains is pure learning.</p>
            <Link href="/level/9"><button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-display font-bold text-white">Continue to Level 9</button></Link>
          </div>
        )}
      </motion.div>
    </main>
  )
}
