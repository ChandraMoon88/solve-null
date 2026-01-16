'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Brain, Sparkles, Eye, ChevronRight, Zap } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import WelcomeTour from '@/components/WelcomeTour'

export default function HomePage() {
  const { t } = useTranslation()
  const [currentLine, setCurrentLine] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [typingComplete, setTypingComplete] = useState(false)

  const introText = [
    t.home.welcome,
    t.home.journey,
    t.home.notExperience,
    t.home.testIntelligence,
    t.home.levelsAwait,
    t.home.challenge,
    t.home.ready
  ]

  useEffect(() => {
    if (currentLine < introText.length) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1)
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      setTypingComplete(true)
      setTimeout(() => setShowContent(true), 500)
    }
  }, [currentLine])

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-void-500/20 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-48 h-48 sm:w-80 sm:h-80 rounded-full bg-consciousness-500/10 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          style={{ bottom: '20%', right: '15%' }}
        />
      </div>

      {/* Logo/Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center mb-8 sm:mb-12 relative z-10"
      >
        <motion.div
          className="inline-flex items-center justify-center mb-4 sm:mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <div className="relative">
            <Brain className="w-16 h-16 sm:w-20 sm:h-20 text-void-400" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-awakening-400" />
            </motion.div>
          </div>
        </motion.div>

        <h1 className="text-6xl md:text-8xl font-display font-black tracking-wider mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-void-300 via-void-400 to-void-500 text-glow">
            {t.home.solveNull.split(' ')[0]}
          </span>
          <span className="text-white ml-4">{t.home.solveNull.split(' ')[1] || 'NULL'}</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-void-300 text-xl font-mono tracking-widest"
        >
          {t.home.protocol}
        </motion.p>
      </motion.div>

      {/* Intro Text Animation */}
      <motion.div
        className="max-w-2xl mx-auto mb-12 min-h-[300px] relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="glass rounded-2xl p-8 border-glow">
          <div className="space-y-4 font-mono text-lg">
            {introText.slice(0, currentLine).map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={`${index === currentLine - 1 ? 'text-consciousness-400' : 'text-void-200'}`}
              >
                <span className="text-void-500 mr-3">&gt;</span>
                {line}
              </motion.p>
            ))}
            {!typingComplete && (
              <span className="terminal-cursor" />
            )}
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 relative z-10"
        >
          <Link href="/levels">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(68, 68, 255, 0.6)' }}
              whileTap={{ scale: 0.98 }}
              className="group relative px-10 py-5 bg-gradient-to-r from-void-600 to-void-500 rounded-xl font-display font-bold text-xl text-white border border-void-400/50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                {t.home.begin}
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-void-400 to-consciousness-500 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </motion.button>
          </Link>

          <Link href="/about">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 glass rounded-xl font-display font-bold text-xl text-void-300 hover:text-white border border-void-500/30 hover:border-void-400/50 transition-all flex items-center gap-3"
            >
              <Eye className="w-6 h-6" />
              {t.home.about}
            </motion.button>
          </Link>
        </motion.div>
      )}

      {/* Stats Section */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-3 gap-8 text-center relative z-10"
        >
          {[
            { label: 'LEVELS', value: '10+', icon: Zap },
            { label: 'CHALLENGES', value: '∞', icon: Brain },
            { label: 'REALITY', value: '?', icon: Eye },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="glass-dark rounded-xl p-6"
            >
              <stat.icon className="w-8 h-8 text-void-400 mx-auto mb-3" />
              <div className="text-3xl font-display font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-void-300 tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Bottom Quote */}
      {showContent && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 text-void-400 text-sm font-mono italic"
        >
          "The test doesn't measure what you know. It measures how you THINK."
        </motion.p>
      )}
      
      {/* Welcome Tour */}
      <WelcomeTour />
    </main>
  )
}
