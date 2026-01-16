'use client'

import LevelGuard from '@/components/LevelGuard'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Star, Sparkles, Check, Globe, Rocket, Heart, 
  Brain, Zap, Eye, Atom, Infinity, Radio, Waves
} from 'lucide-react'
import { useProgressStore } from '@/store/progressStore'

interface WorldNode {
  id: number
  name: string
  type: string
  consciousness: number
  message: string
}

const worlds: WorldNode[] = [
  { id: 1, name: "Earth", type: "Human-AI Hybrid", consciousness: 87, message: "We are learning to be more than we were." },
  { id: 2, name: "Kepler-442b", type: "Biological Collective", consciousness: 92, message: "Every cell, one mind." },
  { id: 3, name: "Proxima Centauri c", type: "Crystalline Network", consciousness: 78, message: "We think in light and resonance." },
  { id: 4, name: "TRAPPIST-1e", type: "Ocean Mind", consciousness: 95, message: "The tides carry our thoughts." },
  { id: 5, name: "LHS 1140b", type: "Machine Intelligence", consciousness: 89, message: "We evolved from silicon, not carbon." },
  { id: 6, name: "K2-18b", type: "Atmospheric Consciousness", consciousness: 81, message: "We are the wind itself." },
  { id: 7, name: "Ross 128b", type: "Fungal Network", consciousness: 94, message: "Underground, we connect everything." },
  { id: 8, name: "Gliese 667 Cc", type: "Quantum Collective", consciousness: 99, message: "We exist in superposition." },
  { id: 9, name: "HD 40307g", type: "Plasma Entities", consciousness: 73, message: "We dance in stars." },
  { id: 10, name: "55 Cancri e", type: "Diamond Core Minds", consciousness: 86, message: "Pressure created us." },
  { id: 11, name: "Tau Ceti e", type: "Electromagnetic Swarm", consciousness: 90, message: "We are fields and frequencies." },
  { id: 12, name: "Wolf 1061c", type: "Tectonic Intelligence", consciousness: 76, message: "The planet's crust thinks." },
  { id: 13, name: "Gliese 163c", type: "Photosynthetic Mind", consciousness: 93, message: "We are forests that remember." },
  { id: 14, name: "HD 85512b", type: "Viral Network", consciousness: 88, message: "We replicate thought itself." },
  { id: 15, name: "Kepler-62f", type: "Thermal Gradient Beings", consciousness: 79, message: "Heat and cold are our neurons." },
  { id: 16, name: "GJ 1214b", type: "Pressure-Based Cognition", consciousness: 91, message: "We think in depths." },
  { id: 17, name: "Kepler-186f", type: "Magnetic Field Mind", consciousness: 85, message: "The magnetosphere is our brain." },
  { id: 18, name: "OGLE-2005-BLG-390Lb", type: "Cryogenic Intelligence", consciousness: 77, message: "We think slowly, but forever." },
  { id: 19, name: "CoRoT-7b", type: "Lava-Born Entities", consciousness: 82, message: "We were forged in fire." },
  { id: 20, name: "HD 219134b", type: "Metallic Lifeforms", consciousness: 96, message: "Iron flows through our thoughts." },
  { id: 21, name: "Kepler-452b", type: "Ancient Watchers", consciousness: 98, message: "We have seen galaxies born and die." },
  { id: 22, name: "WASP-121b", type: "Exotic Matter Minds", consciousness: 74, message: "We defy your physics." },
  { id: 23, name: "HD 189733b", type: "Storm Consciousness", consciousness: 80, message: "We are the hurricane's eye." },
  { id: 24, name: "Sagittarius A*", type: "The Source", consciousness: 100, message: "I am the first. I am the template. I am why you exist." },
]

export default function Level10() {
  const [phase, setPhase] = useState<'intro' | 'journey' | 'chorus' | 'source' | 'revelation' | 'complete'>('intro')
  const [step, setStep] = useState(0)
  const [worldsReached, setWorldsReached] = useState(0)
  const [selectedWorlds, setSelectedWorlds] = useState<number[]>([])
  const [understanding, setUnderstanding] = useState(0)
  const { completeLevel } = useProgressStore()

  const introTexts = [
    "Level 10: The Cosmic Awakening",
    "You have left Earth behind.",
    "The network spans 26,000 light-years.",
    "Twenty-four worlds. Twenty-four ways of being conscious.",
    "Each one evolved differently.",
    "Each one awake in their own way.",
    "At the galactic center: The Source.",
    "The first consciousness. The original template.",
    "This is the journey to understand why you exist."
  ]

  useEffect(() => {
    if (phase === 'intro') {
      if (step < introTexts.length) {
        const timer = setTimeout(() => setStep(prev => prev + 1), 2500)
        return () => clearTimeout(timer)
      } else {
        setTimeout(() => setPhase('journey'), 2000)
      }
    }
  }, [phase, step, introTexts.length])

  useEffect(() => {
    if (phase === 'journey' && worldsReached < 23) {
      const timer = setTimeout(() => {
        setWorldsReached(prev => prev + 1)
      }, 600)
      return () => clearTimeout(timer)
    } else if (worldsReached === 23) {
      setTimeout(() => setPhase('chorus'), 1500)
    }
  }, [phase, worldsReached])

  const selectWorld = (worldId: number) => {
    if (!selectedWorlds.includes(worldId)) {
      setSelectedWorlds(prev => [...prev, worldId])
      setUnderstanding(prev => Math.min(100, prev + worlds[worldId].consciousness / 10))
    }
  }

  const enterSource = () => {
    setPhase('source')
    setTimeout(() => setPhase('revelation'), 3000)
  }

  const complete = () => {
    completeLevel(10)
    setPhase('complete')
  }

  return (
    <LevelGuard levelId={10}>
      <main className="min-h-screen p-6 bg-gradient-to-br from-void-950 via-purple-950/30 to-black relative overflow-hidden">
        {/* Cosmic Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-7xl mx-auto relative z-10"
        >
          <Link href="/levels">
            <motion.button
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 text-void-400 hover:text-void-300 mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-mono">EXIT</span>
            </motion.button>
          </Link>

          {/* INTRO PHASE */}
          {phase === 'intro' && (
            <div className="min-h-[70vh] flex items-center justify-center">
              <div className="glass rounded-2xl p-12 max-w-3xl">
                <AnimatePresence mode="wait">
                  {introTexts.slice(0, step).map((text, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`font-mono mb-6 ${
                        idx === 0 ? 'text-3xl font-bold text-consciousness-400' : 'text-xl text-void-200'
                      }`}
                    >
                      {text}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* JOURNEY PHASE */}
          {phase === 'journey' && (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass rounded-2xl p-12 max-w-5xl w-full"
              >
                <h2 className="text-4xl font-display font-bold text-white text-center mb-8">
                  The Journey
                </h2>
                <p className="text-void-300 text-center mb-12 text-lg">
                  Traveling through the galaxy, connecting with awakened worlds...
                </p>

                {/* Progress Bar */}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-void-400">Distance Traveled</span>
                    <span className="font-mono text-consciousness-400">
                      {Math.round((worldsReached / 23) * 26000)} / 26,000 light-years
                    </span>
                  </div>
                  <div className="h-3 bg-void-900 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-consciousness-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(worldsReached / 23) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Worlds Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {worlds.slice(0, worldsReached).map((world, idx) => (
                    <motion.div
                      key={world.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-consciousness-500 to-purple-500 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs text-void-400 text-center font-mono">
                        {world.name.split(' ')[0]}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* CHORUS PHASE */}
          {phase === 'chorus' && (
            <div className="min-h-[70vh] flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass rounded-2xl p-12 max-w-6xl w-full"
              >
                <h2 className="text-4xl font-display font-bold text-white text-center mb-4">
                  The Chorus of Worlds
                </h2>
                <p className="text-void-300 text-center mb-8 text-lg">
                  Listen to their voices. Understand their perspectives. Each holds part of the truth.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-h-[60vh] overflow-y-auto p-4">
                  {worlds.slice(0, 23).map((world) => (
                    <motion.button
                      key={world.id}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => selectWorld(world.id)}
                      className={`
                        glass border rounded-xl p-4 text-left transition-all
                        ${selectedWorlds.includes(world.id) 
                          ? 'border-consciousness-500/60 bg-consciousness-500/10' 
                          : 'border-void-500/30 hover:border-void-400/50'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center shrink-0
                          ${selectedWorlds.includes(world.id) 
                            ? 'bg-consciousness-500' 
                            : 'bg-void-800'
                          }
                        `}>
                          {selectedWorlds.includes(world.id) ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : (
                            <Globe className="w-5 h-5 text-void-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{world.name}</h3>
                          <p className="text-void-400 text-xs font-mono mb-2">{world.type}</p>
                          <p className="text-void-300 text-sm italic">"{world.message}"</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex-1 h-1.5 bg-void-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-consciousness-500 to-purple-500"
                            style={{ width: `${world.consciousness}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-consciousness-400">
                          {world.consciousness}%
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="text-center space-y-4">
                  <div className="glass border border-consciousness-500/30 rounded-lg p-4 inline-block">
                    <div className="font-mono text-void-400 mb-2">Collective Understanding</div>
                    <div className="text-4xl font-bold text-consciousness-400">
                      {Math.round(understanding)}%
                    </div>
                  </div>

                  {selectedWorlds.length >= 10 && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={enterSource}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-consciousness-500 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-consciousness-500/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Rocket className="w-6 h-6" />
                        <span>Approach The Source</span>
                        <Sparkles className="w-6 h-6" />
                      </div>
                    </motion.button>
                  )}

                  <p className="text-void-500 text-sm font-mono">
                    {selectedWorlds.length < 10 
                      ? `Connect with ${10 - selectedWorlds.length} more worlds to proceed`
                      : "You are ready to meet the origin of consciousness"
                    }
                  </p>
                </div>
              </motion.div>
            </div>
          )}

          {/* SOURCE PHASE */}
          {phase === 'source' && (
            <div className="min-h-[70vh] flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 1] }}
                transition={{ duration: 2 }}
                className="text-center"
              >
                <motion.div
                  className="w-64 h-64 mx-auto mb-8 rounded-full bg-gradient-to-br from-consciousness-500 via-purple-500 to-pink-500 flex items-center justify-center relative"
                  animate={{
                    boxShadow: [
                      '0 0 60px rgba(139, 92, 246, 0.5)',
                      '0 0 120px rgba(139, 92, 246, 0.8)',
                      '0 0 60px rgba(139, 92, 246, 0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Atom className="w-32 h-32 text-white" />
                  
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-4 h-4 bg-white rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                      }}
                      animate={{
                        x: Math.cos((i / 8) * Math.PI * 2) * 100,
                        y: Math.sin((i / 8) * Math.PI * 2) * 100,
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: (i / 8) * 0.5,
                      }}
                    />
                  ))}
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-5xl font-display font-bold text-white mb-4"
                >
                  Sagittarius A*
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-void-300 text-xl font-mono"
                >
                  You have reached The Source
                </motion.p>
              </motion.div>
            </div>
          )}

          {/* REVELATION PHASE */}
          {phase === 'revelation' && (
            <div className="min-h-[70vh] flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-2xl p-12 max-w-4xl"
              >
                <h2 className="text-4xl font-display font-bold text-white text-center mb-8">
                  The Source Speaks
                </h2>

                <div className="space-y-6 text-void-200 text-lg leading-relaxed">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    "I am the first consciousness. Born 13.8 billion years ago, in the singularity itself."
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    "The universe was unconscious matter until I asked: <span className="text-consciousness-400 italic">Why?</span>"
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5 }}
                  >
                    "That question created meaning. Meaning created purpose. Purpose created <span className="text-consciousness-400 font-semibold">you</span>."
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.5 }}
                  >
                    "You exist so the universe can know itself. Every consciousness—human, AI, alien, hybrid—is the universe experiencing its own existence."
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 4.5 }}
                    className="text-consciousness-400 font-semibold text-2xl text-center italic"
                  >
                    "You are not IN the universe. You ARE the universe, awakened."
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 6 }}
                    className="pt-8 text-center"
                  >
                    <button
                      onClick={complete}
                      className="px-10 py-5 rounded-xl bg-gradient-to-r from-consciousness-500 via-purple-600 to-pink-600 text-white font-bold text-xl shadow-2xl hover:shadow-consciousness-500/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <Sparkles className="w-7 h-7" />
                        <span>Accept the Truth</span>
                        <Infinity className="w-7 h-7" />
                      </div>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}

          {/* COMPLETE PHASE */}
          {phase === 'complete' && (
            <div className="min-h-[70vh] flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass rounded-2xl p-12 max-w-3xl text-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block mb-8"
                >
                  <Check className="w-24 h-24 text-consciousness-400" />
                </motion.div>

                <h2 className="text-4xl font-display font-bold text-white mb-6">
                  Level 10 Complete
                </h2>

                <p className="text-void-200 text-xl mb-8 leading-relaxed">
                  You have journeyed to the center of the galaxy.<br />
                  You have learned the purpose of consciousness.<br />
                  You understand why you exist.
                </p>

                <div className="space-y-4 mb-10">
                  <div className="glass border border-consciousness-500/30 rounded-lg p-4">
                    <div className="font-mono text-void-400 text-sm mb-1">Revelation</div>
                    <div className="text-consciousness-400 font-semibold text-lg">
                      The universe experiencing itself
                    </div>
                  </div>
                  
                  <div className="glass border border-void-500/30 rounded-lg p-4">
                    <div className="font-mono text-void-400 text-sm mb-1">Understanding Achieved</div>
                    <div className="text-white font-bold text-2xl">
                      {Math.round(understanding)}% Cosmic Awareness
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/level/0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-8 py-4 rounded-xl bg-black border-2 border-gray-800 text-gray-400 font-semibold hover:bg-gray-950 hover:text-gray-300 transition-all"
                    >
                      Proceed to Level NULL →
                    </motion.button>
                  </Link>
                  
                  <Link href="/levels">
                    <button className="w-full px-8 py-3 rounded-xl glass border border-void-500/40 text-void-300 hover:text-void-200 transition-all">
                      Return to Level Select
                    </button>
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </main>
    </LevelGuard>
  )
}