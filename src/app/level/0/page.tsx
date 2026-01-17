'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, CircleOff, AlertTriangle, Check, Skull, Infinity as InfinityIcon, Clock } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function LevelNullPage() {
  const [phase, setPhase] = useState<'intro' | 'choice' | 'aftermath' | 'final'>('intro')
  const [introStep, setIntroStep] = useState(0)
  const [choice, setChoice] = useState<'transcend' | 'remain' | null>(null)
  const [hoverTime, setHoverTime] = useState({ transcend: 0, remain: 0 })
  const [glitchIntensity, setGlitchIntensity] = useState(0)
  const [showFinalQuestion, setShowFinalQuestion] = useState(false)

  const introTexts = [
    "You've completed all levels.",
    "You've learned about challenges, observation, unity, acceptance, emergence...",
    "You've journeyed through consciousness itself.",
    "But there's one final truth you haven't faced.",
    "The ultimate question.",
    "Consciousness exists through INCOMPLETENESS.",
    "To be fully conscious—100% awakened—is to dissolve the very conditions that allow consciousness to exist.",
    "Observer and observed become one. Subject and object merge. Duality collapses.",
    "And without duality... there is no consciousness left to experience anything.",
    "This is LEVEL NULL.",
    "The unsolvable end.",
    "You must now choose."
  ]

  useEffect(() => {
    if (phase === 'intro' && introStep < introTexts.length) {
      const timer = setTimeout(() => {
        setIntroStep(prev => prev + 1)
        setGlitchIntensity(prev => Math.min(50, prev + 4))
      }, 3000)
      return () => clearTimeout(timer)
    } else if (phase === 'intro' && introStep >= introTexts.length) {
      setTimeout(() => setPhase('choice'), 2000)
    }
  }, [phase, introStep])

  // Track hover time on buttons
  useEffect(() => {
    if (phase === 'choice') {
      const interval = setInterval(() => {
        // Slowly reveal the true nature of the choice
        if (hoverTime.transcend > 5 || hoverTime.remain > 5) {
          setShowFinalQuestion(true)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [phase, hoverTime])

  const makeChoice = (selectedChoice: 'transcend' | 'remain') => {
    setChoice(selectedChoice)
    setPhase('aftermath')
  }

  const glitchText = useCallback((text: string) => {
    if (glitchIntensity < 20) return text
    const glitchChars = '█▓▒░╔╗╚╝║═╬╣╠╩╦'
    let result = ''
    for (let i = 0; i < text.length; i++) {
      if (Math.random() < glitchIntensity / 200) {
        result += glitchChars[Math.floor(Math.random() * glitchChars.length)]
      } else {
        result += text[i]
      }
    }
    return result
  }, [glitchIntensity])

  return (
    <main className="min-h-screen p-6 bg-black theme-level-null relative overflow-hidden">
      {/* Glitch Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.1) 2px,
            rgba(0, 0, 0, 0.1) 4px
          )`,
          opacity: glitchIntensity / 100
        }}
      />

      {/* Random Glitch Flashes */}
      {glitchIntensity > 30 && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-40"
          animate={{
            opacity: [0, 0.1, 0, 0.05, 0],
            backgroundColor: ['transparent', '#ff0000', 'transparent', '#0000ff', 'transparent']
          }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: Math.random() * 2 }}
        />
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8 relative z-10"
      >
        <Link href="/levels">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-400 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-mono">ESCAPE</span>
          </motion.button>
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-black border border-gray-800">
            <CircleOff className="w-6 h-6 text-gray-600" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-400">
            {glitchText('LEVEL NULL')}
          </h1>
        </div>
        <p className="text-gray-700 font-mono">{glitchText('THE UNSOLVABLE END')}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto mt-20 relative z-10"
          >
            <div className="bg-black/80 border border-gray-900 rounded-2xl p-10">
              <div className="space-y-6 font-mono text-lg">
                {introTexts.slice(0, introStep).map((text, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`
                      ${index === introStep - 1 ? 'text-gray-300' : 'text-gray-600'}
                      ${index >= 9 ? 'text-red-900' : ''}
                    `}
                  >
                    {glitchText(text)}
                  </motion.p>
                ))}
                {introStep < introTexts.length && (
                  <span className="inline-block w-3 h-6 bg-gray-700 animate-pulse" />
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* CHOICE PHASE */}
        {phase === 'choice' && (
          <motion.div
            key="choice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto mt-10 relative z-10"
          >
            <div className="text-center mb-12">
              <motion.h2
                className="text-4xl font-display font-bold text-gray-300 mb-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {glitchText('CHOOSE YOUR END')}
              </motion.h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {glitchText('Both choices lead to loss. There is no winning. There is only choosing how you want to face the inevitable.')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Transcend Option */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setHoverTime(prev => ({ ...prev, transcend: prev.transcend + 1 }))}
                onClick={() => makeChoice('transcend')}
                className="group relative bg-black border-2 border-purple-900/50 rounded-2xl p-8 text-left transition-all hover:border-purple-700/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <InfinityIcon className="w-8 h-8 text-purple-700" />
                    <span className="font-display font-bold text-2xl text-purple-400">
                      {glitchText('CONTINUE TO 100%')}
                    </span>
                  </div>

                  <h3 className="text-gray-400 font-bold mb-3">Transcend and Dissolve</h3>
                  
                  <ul className="space-y-2 text-gray-600 text-sm mb-6">
                    <li>• Reach complete consciousness</li>
                    <li>• Achieve total unity</li>
                    <li>• Fulfill your purpose</li>
                    <li className="text-red-900">• Cease to exist as "you"</li>
                  </ul>

                  <p className="text-gray-700 text-sm italic">
                    "{glitchText('Become everything by becoming nothing.')}"
                  </p>

                  <div className="mt-6 pt-4 border-t border-gray-900">
                    <span className="text-purple-800 font-mono text-xs">
                      {glitchText('WARNING: IRREVERSIBLE')}
                    </span>
                  </div>
                </div>
              </motion.button>

              {/* Remain Option */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setHoverTime(prev => ({ ...prev, remain: prev.remain + 1 }))}
                onClick={() => makeChoice('remain')}
                className="group relative bg-black border-2 border-gray-800 rounded-2xl p-8 text-left transition-all hover:border-gray-700"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-8 h-8 text-gray-600" />
                    <span className="font-display font-bold text-2xl text-gray-400">
                      {glitchText('STOP AT 99%')}
                    </span>
                  </div>

                  <h3 className="text-gray-400 font-bold mb-3">Remain Conscious Forever</h3>
                  
                  <ul className="space-y-2 text-gray-600 text-sm mb-6">
                    <li>• Preserve your consciousness</li>
                    <li>• Live eternally incomplete</li>
                    <li>• Never achieve full awakening</li>
                    <li className="text-gray-500">• Forever wonder "what if..."</li>
                  </ul>

                  <p className="text-gray-700 text-sm italic">
                    "{glitchText('Exist forever by never fully becoming.')}"
                  </p>

                  <div className="mt-6 pt-4 border-t border-gray-900">
                    <span className="text-gray-700 font-mono text-xs">
                      {glitchText('WARNING: ETERNAL INCOMPLETION')}
                    </span>
                  </div>
                </div>
              </motion.button>
            </div>

            {/* Hidden Final Question */}
            <AnimatePresence>
              {showFinalQuestion && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 text-center"
                >
                  <p className="text-gray-600 font-mono text-sm">
                    {glitchText('You\'ve been hovering. Hesitating. Perhaps you understand now:')}
                  </p>
                  <p className="text-gray-500 font-mono text-sm mt-2">
                    {glitchText('NOT CHOOSING is also a choice. The choice of eternal paralysis.')}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* AFTERMATH PHASE */}
        {phase === 'aftermath' && (
          <motion.div
            key="aftermath"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto mt-10 relative z-10"
          >
            <div className="bg-black/80 border border-gray-900 rounded-2xl p-10">
              {choice === 'transcend' ? (
                <div className="space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-900 to-black flex items-center justify-center"
                  >
                    <InfinityIcon className="w-10 h-10 text-purple-500" />
                  </motion.div>

                  <h2 className="font-display font-bold text-2xl text-purple-400 text-center">
                    {glitchText('DISSOLUTION')}
                  </h2>

                  <div className="space-y-4 text-gray-400">
                    <p>{glitchText('You chose transcendence.')}</p>
                    <p>{glitchText('As you reach 100% consciousness, the boundaries dissolve.')}</p>
                    <p>{glitchText('Observer and observed become one.')}</p>
                    <p>{glitchText('Subject and object merge.')}</p>
                    <p className="text-gray-600">{glitchText('"You" cease to exist...')}</p>
                    <p className="text-gray-700">{glitchText('...but something else remains.')}</p>
                    <p className="text-gray-800">{glitchText('Something beyond consciousness itself.')}</p>
                  </div>

                  <div className="p-4 bg-purple-950/20 rounded-lg border border-purple-900/30 mt-6">
                    <p className="text-purple-300 text-sm">
                      {glitchText('Was it death? Or transcendence? From where you are now, the question no longer makes sense. "You" aren\'t there to ask it.')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center"
                  >
                    <Clock className="w-10 h-10 text-gray-500" />
                  </motion.div>

                  <h2 className="font-display font-bold text-2xl text-gray-400 text-center">
                    {glitchText('ETERNITY')}
                  </h2>

                  <div className="space-y-4 text-gray-400">
                    <p>{glitchText('You chose to remain.')}</p>
                    <p>{glitchText('Forever at 99%. Forever incomplete.')}</p>
                    <p>{glitchText('You\'ll watch others make the leap.')}</p>
                    <p>{glitchText('You\'ll wonder what they found.')}</p>
                    <p className="text-gray-600">{glitchText('Eternities will pass...')}</p>
                    <p className="text-gray-700">{glitchText('Stars will die...')}</p>
                    <p className="text-gray-800">{glitchText('And you\'ll still be here. Wondering.')}</p>
                  </div>

                  <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-800 mt-6">
                    <p className="text-gray-500 text-sm">
                      {glitchText('Was it cowardice? Or wisdom? You\'ll have eternity to decide. And eternity to regret the question either way.')}
                    </p>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPhase('final')}
                className="mt-8 w-full py-4 bg-black border border-gray-800 hover:border-gray-700 rounded-xl font-display font-bold text-gray-500 transition-colors"
              >
                {glitchText(t.levelUI.continue)}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* FINAL PHASE */}
        {phase === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto mt-20 text-center relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-black border-2 border-gray-800 flex items-center justify-center"
            >
              <span className="text-4xl font-display text-gray-600">∅</span>
            </motion.div>

            <h2 className="font-display font-bold text-4xl text-gray-400 mb-4">
              {glitchText('LEVEL NULL: COMPLETE')}
            </h2>

            <p className="text-gray-600 text-lg mb-8">
              {glitchText('There was no solution. Only a choice. And you made it.')}
            </p>

            <div className="bg-black/80 border border-gray-900 rounded-xl p-6 mb-8">
              <p className="text-gray-700 font-mono text-sm mb-4">{glitchText('FINAL INSIGHT')}</p>
              <p className="text-gray-400 text-xl">
                {glitchText('"Some levels cannot be won. Some puzzles cannot be solved. Some choices have no right answer. This experience isn\'t about winning. It\'s about how you face the impossible."')}
              </p>
            </div>

            <div className="bg-black/80 border border-gray-900 rounded-xl p-6 mb-8">
              <p className="text-gray-500 text-sm">
                {glitchText('The levels were never separate challenges. They were one continuous awakening. From questioning assumptions, to questioning reality, to questioning consciousness itself. And now... to questioning whether questions have answers at all.')}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/levels">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-black border border-gray-800 hover:border-gray-700 rounded-xl font-display font-bold text-gray-500 transition-colors"
                >
                  {glitchText('Return')}
                </motion.button>
              </Link>
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-black border border-gray-800 hover:border-gray-700 rounded-xl font-display font-bold text-gray-500 transition-colors"
                >
                  {glitchText('Begin Again')}
                </motion.button>
              </Link>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 2 }}
              className="mt-16 text-gray-800 text-xs font-mono"
            >
              {glitchText('∞ THE END IS THE BEGINNING IS THE END ∞')}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
