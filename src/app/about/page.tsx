'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect } from 'react'
import { ArrowLeft, Brain, Sparkles, Infinity, Target, Eye, Zap } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function AboutPage() {
  const { t } = useTranslation()

  useEffect(() => {
    localStorage.setItem('visited_about', 'true')
  }, [])
  
  const concepts = [
    {
      icon: Brain,
      title: t.about.pureIntelligence,
      description: t.about.pureIntelligenceDesc
    },
    {
      icon: Eye,
      title: t.about.observerEffect,
      description: t.about.observerEffectDesc
    },
    {
      icon: Target,
      title: t.about.noRightAnswers,
      description: t.about.noRightAnswersDesc
    },
    {
      icon: Zap,
      title: t.about.consciousnessEvolution,
      description: t.about.consciousnessEvolutionDesc
    },
    {
      icon: Infinity,
      title: t.about.continualEvolution,
      description: t.about.continualEvolutionDesc
    },
    {
      icon: Sparkles,
      title: t.about.transformation,
      description: t.about.transformationDesc
    },
  ]

  return (
    <main className="min-h-screen p-6 md:p-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-12"
      >
        <Link href="/">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-void-400 hover:text-void-300 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-mono">{t.common.return}</span>
          </motion.button>
        </Link>

        <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-void-300 to-void-500">
            {t.about.whatIs}
          </span>
          <span className="text-white ml-3">{t.about.solveNull}</span>
        </h1>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <div className="glass rounded-2xl p-8 border-glow">
          <p className="text-void-200 text-lg leading-relaxed mb-6">
            {t.about.intro1} <span className="text-consciousness-400">{t.about.protocol}</span>{t.about.intro2}
          </p>
          <p className="text-void-200 text-lg leading-relaxed mb-6">
            {t.about.intro3} <span className="text-void-300">{t.about.transform}</span>.
          </p>
          <p className="text-void-300 text-lg leading-relaxed italic">
            "{t.about.quote}"
          </p>
        </div>
      </motion.div>

      {/* Core Concepts */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <h2 className="text-3xl font-display font-bold text-white mb-8">{t.about.corePrinciples}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {concepts.map((concept, index) => (
            <motion.div
              key={concept.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="glass rounded-xl p-6 border border-void-500/20 hover:border-void-400/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-void-700/50">
                  <concept.icon className="w-6 h-6 text-void-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white mb-2">{concept.title}</h3>
                  <p className="text-void-300 text-sm leading-relaxed">{concept.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Level Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <h2 className="text-3xl font-display font-bold text-white mb-8">{t.about.theJourney}</h2>
        
        <div className="glass rounded-2xl p-8 border border-void-500/20">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-display font-bold text-emerald-500">1-4</span>
              <div>
                <p className="text-void-300 text-sm">{t.about.step1}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl font-display font-bold text-cyan-500">5-7</span>
              <div>
                <p className="text-void-300 text-sm">{t.about.step2}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl font-display font-bold text-purple-500">8</span>
              <div>
                <p className="text-void-300 text-sm">{t.about.step3}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl font-display font-bold text-violet-500">9</span>
              <div>
                <p className="text-void-300 text-sm">{t.about.step4}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl font-display font-bold text-pink-500">10</span>
              <div>
                <p className="text-void-300 text-sm">{t.about.step5}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl font-display font-bold text-gray-500">NULL</span>
              <div>
                <p className="text-void-300 text-sm">{t.about.step6}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Warning */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="max-w-4xl mx-auto mb-16"
      >
        <div className="glass-dark rounded-2xl p-8 border border-void-600/30">
          <h2 className="text-2xl font-display font-bold text-void-300 mb-4">{t.about.ready}</h2>
          <p className="text-void-400 leading-relaxed">
            {t.about.readyDesc}
          </p>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="max-w-4xl mx-auto text-center"
      >
        <Link href="/levels">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(68, 68, 255, 0.6)' }}
            whileTap={{ scale: 0.98 }}
            className="px-12 py-5 bg-gradient-to-r from-void-600 to-void-500 rounded-xl font-display font-bold text-xl text-white"
          >
            {t.about.beginJourney}
          </motion.button>
        </Link>
      </motion.div>
    </main>
  )
}
