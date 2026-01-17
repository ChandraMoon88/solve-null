'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Eye, Clock, AlertTriangle, Check, 
  ChevronRight, HelpCircle, User, Play, Pause,
  Rewind, FastForward, Shuffle, Layers, Brain,
  Sparkles, Split, Merge, Activity, Zap
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

// Types
interface Witness {
  id: string
  name: string
  avatar: string
  testimony: string[]
  certainty: number
  memoryState: 'stable' | 'shifting' | 'conflicting'
  currentVersion: number
  perception: 'visual' | 'auditory' | 'emotional' | 'temporal'
}

interface TimelineEvent {
  time: string
  description: string
  witnesses: string[]
  conflictLevel: number
}

// The Four Witnesses - each with shifting memories
const initialWitnesses: Witness[] = [
  {
    id: 'w1',
    name: 'Marcus Chen',
    avatar: '👨‍💼',
    testimony: [
      "I saw a man in a blue jacket run past at exactly 3:47 PM.",
      "Actually, I think it was closer to 3:50... and the jacket might have been green.",
      "Wait, there were two people. Or was it just their reflection?",
      "The more I focus, the less certain I become..."
    ],
    certainty: 85,
    memoryState: 'stable',
    currentVersion: 0,
    perception: 'visual'
  },
  {
    id: 'w2', 
    name: 'Sarah Okonkwo',
    avatar: '👩‍🔬',
    testimony: [
      "I heard a loud crash at 3:52 PM. Glass breaking.",
      "Or was it 3:45? The more I think about it...",
      "There was definitely shouting. Or maybe it was just the wind.",
      "Memory is a reconstruction, not a recording..."
    ],
    certainty: 78,
    memoryState: 'stable',
    currentVersion: 0,
    perception: 'auditory'
  },
  {
    id: 'w3',
    name: 'James Rivera',
    avatar: '👨‍🎨',
    testimony: [
      "I felt something was wrong before anything happened. A chill.",
      "Time seemed to slow down. Or speed up. Both?",
      "The emotions in that moment... they don't match any single narrative.",
      "Every possibility felt equally real..."
    ],
    certainty: 62,
    memoryState: 'stable',
    currentVersion: 0,
    perception: 'emotional'
  },
  {
    id: 'w4',
    name: 'Dr. Yuki Tanaka',
    avatar: '👩‍⚕️',
    testimony: [
      "According to my watch, the sequence took exactly 4 minutes 32 seconds.",
      "But reviewing the timestamps... there's a gap. Missing time.",
      "The chronology contradicts itself. Every timeline is internally consistent but mutually exclusive.",
      "Time isn't a line. It's a superposition..."
    ],
    certainty: 45,
    memoryState: 'stable',
    currentVersion: 0,
    perception: 'temporal'
  }
]

const timelineEvents: TimelineEvent[] = [
  { time: '3:45:00', description: 'Ambient noise recorded. Nothing notable.', witnesses: [], conflictLevel: 0 },
  { time: '3:45:30', description: 'W3 reports premonitory feeling.', witnesses: ['w3'], conflictLevel: 10 },
  { time: '3:46:15', description: 'W1 reports seeing figure approach.', witnesses: ['w1'], conflictLevel: 15 },
  { time: '3:47:00', description: 'W1 claims incident begins. W4 disagrees.', witnesses: ['w1', 'w4'], conflictLevel: 45 },
  { time: '3:48:30', description: 'All witnesses report something happened here.', witnesses: ['w1', 'w2', 'w3', 'w4'], conflictLevel: 30 },
  { time: '3:50:00', description: 'W2 hears glass break. Others hear nothing.', witnesses: ['w2'], conflictLevel: 55 },
  { time: '3:52:00', description: 'W4 notes timeline anomaly. W2 confirms sound.', witnesses: ['w2', 'w4'], conflictLevel: 70 },
  { time: '3:55:00', description: 'CONFLICT: All accounts diverge completely.', witnesses: ['w1', 'w2', 'w3', 'w4'], conflictLevel: 95 },
  { time: '3:58:00', description: 'W3 reports feeling resolution. W1 sees departure.', witnesses: ['w1', 'w3'], conflictLevel: 40 },
  { time: '4:00:00', description: 'Silence. All witnesses uncertain if event concluded.', witnesses: ['w1', 'w2', 'w3', 'w4'], conflictLevel: 60 },
]

export default function Level2Page() {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<'intro' | 'investigation' | 'realization' | 'superposition' | 'complete'>('intro')
  const [witnesses, setWitnesses] = useState<Witness[]>(initialWitnesses)
  const [selectedWitness, setSelectedWitness] = useState<string | null>(null)
  const [timelinePosition, setTimelinePosition] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [realityCoherence, setRealityCoherence] = useState(100)
  const [introStep, setIntroStep] = useState(0)
  const [investigationAttempts, setInvestigationAttempts] = useState(0)
  const [showSuperpositionButton, setShowSuperpositionButton] = useState(false)
  const [realizationStep, setRealizationStep] = useState(0)
  const [acceptedSuperposition, setAcceptedSuperposition] = useState(false)

  const introTexts = [
    t.level2.intro1,
    t.level2.intro2,
    t.level2.intro3,
    t.level2.intro4,
    t.level2.intro5,
    t.level2.intro6,
    t.level2.intro7
  ]

  const realizationTexts = [
    t.level2.realization1,
    t.level2.realization2,
    t.level2.realization3,
    t.level2.realization4,
    t.level2.realization5,
    t.level2.realization6,
    t.level2.realization7,
    t.level2.realization8
  ]

  // Intro animation
  useEffect(() => {
    if (phase === 'intro' && introStep < introTexts.length) {
      const timer = setTimeout(() => setIntroStep(prev => prev + 1), 2500)
      return () => clearTimeout(timer)
    } else if (phase === 'intro' && introStep >= introTexts.length) {
      setTimeout(() => setPhase('investigation'), 1000)
    }
  }, [phase, introStep])

  // Realization animation
  useEffect(() => {
    if (phase === 'realization' && realizationStep < realizationTexts.length) {
      const timer = setTimeout(() => setRealizationStep(prev => prev + 1), 2500)
      return () => clearTimeout(timer)
    } else if (phase === 'realization' && realizationStep >= realizationTexts.length) {
      setTimeout(() => setPhase('superposition'), 1000)
    }
  }, [phase, realizationStep])

  // Timeline playback
  useEffect(() => {
    if (isPlaying && timelinePosition < timelineEvents.length - 1) {
      const timer = setTimeout(() => {
        setTimelinePosition(prev => prev + 1)
        // Decrease coherence as we progress
        setRealityCoherence(prev => Math.max(0, prev - timelineEvents[timelinePosition].conflictLevel / 10))
      }, 1500)
      return () => clearTimeout(timer)
    } else if (timelinePosition >= timelineEvents.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, timelinePosition])

  // Show superposition button after enough investigation
  useEffect(() => {
    if (investigationAttempts >= 4 && realityCoherence < 50) {
      setTimeout(() => setShowSuperpositionButton(true), 2000)
    }
  }, [investigationAttempts, realityCoherence])

  // Interview witness - causes memory shifts
  const interviewWitness = useCallback((witnessId: string) => {
    setSelectedWitness(witnessId)
    setInvestigationAttempts(prev => prev + 1)
    
    setWitnesses(prev => prev.map(w => {
      if (w.id === witnessId) {
        // Progress through testimony versions
        const newVersion = Math.min(w.currentVersion + 1, w.testimony.length - 1)
        // Certainty decreases as they question their memory
        const newCertainty = Math.max(20, w.certainty - 10 - Math.random() * 10)
        return {
          ...w,
          currentVersion: newVersion,
          certainty: newCertainty,
          memoryState: newCertainty < 50 ? 'conflicting' : newCertainty < 70 ? 'shifting' : 'stable'
        }
      }
      // Other witnesses also become less certain (observer effect)
      return {
        ...w,
        certainty: Math.max(20, w.certainty - 3),
        memoryState: w.certainty < 50 ? 'conflicting' : w.certainty < 70 ? 'shifting' : 'stable'
      }
    }))

    // Reality coherence decreases with each investigation
    setRealityCoherence(prev => Math.max(0, prev - 8))
  }, [])

  // Accept superposition - the real solution
  const acceptSuperposition = () => {
    setAcceptedSuperposition(true)
    setPhase('realization')
  }

  // Get coherence color
  const getCoherenceColor = () => {
    if (realityCoherence > 70) return 'from-green-500 to-emerald-500'
    if (realityCoherence > 40) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  // Get witness status color
  const getMemoryColor = (state: Witness['memoryState']) => {
    if (state === 'stable') return 'text-green-400'
    if (state === 'shifting') return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <main className="min-h-screen p-6 theme-level-2 bg-gradient-to-br from-void-950 via-indigo-950/20 to-void-950">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <Link href="/levels">
          <motion.button
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-void-400 hover:text-void-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-mono">EXIT LEVEL</span>
          </motion.button>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold text-white">
                Level 2: The Four Witnesses
              </h1>
            </div>
            <p className="text-void-400 font-mono">TRUTH COHERENCE CHALLENGE</p>
          </div>

          {phase === 'investigation' && (
            <div className="flex items-center gap-4">
              {/* Reality Coherence Meter */}
              <div className="glass px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-void-400" />
                  <span className="text-void-400 text-xs font-mono">REALITY COHERENCE</span>
                </div>
                <div className="w-32 h-3 bg-void-900 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getCoherenceColor()}`}
                    initial={{ width: '100%' }}
                    animate={{ width: `${realityCoherence}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="text-right text-xs mt-1">
                  <span className={realityCoherence < 30 ? 'text-red-400' : 'text-void-300'}>
                    {Math.round(realityCoherence)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto mt-20"
          >
            <div className="glass rounded-2xl p-10 border border-indigo-500/20">
              <div className="space-y-6 font-mono text-lg">
                {introTexts.slice(0, introStep).map((text, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={index === introStep - 1 ? 'text-indigo-400' : 'text-void-200'}
                  >
                    {text}
                  </motion.p>
                ))}
                {introStep < introTexts.length && (
                  <span className="inline-block w-3 h-6 bg-indigo-400 animate-pulse" />
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* INVESTIGATION PHASE */}
        {phase === 'investigation' && (
          <motion.div
            key="investigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Low Coherence Warning */}
            {realityCoherence < 30 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 glass rounded-xl border border-red-500/30 bg-red-950/20"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-red-300 font-bold">Reality Coherence Critical</p>
                    <p className="text-red-400/70 text-sm">
                      The more you investigate, the less certain truth becomes. Perhaps certainty isn&apos;t the answer...
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Witnesses Panel */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="font-display font-bold text-white text-xl flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" />
                  Witnesses
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {witnesses.map(witness => (
                    <motion.div
                      key={witness.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => interviewWitness(witness.id)}
                      className={`
                        glass rounded-xl p-5 border cursor-pointer transition-all
                        ${selectedWitness === witness.id ? 'border-indigo-500/50 bg-indigo-950/20' : 'border-void-500/20 hover:border-indigo-500/30'}
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{witness.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-display font-bold text-white">{witness.name}</h3>
                            <span className={`text-xs font-mono ${getMemoryColor(witness.memoryState)}`}>
                              {witness.memoryState.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-void-500 text-xs mb-3 uppercase tracking-wide">
                            {witness.perception} perception
                          </p>
                          
                          {/* Current Testimony */}
                          <div className="p-3 bg-void-900/50 rounded-lg border border-void-700/50">
                            <p className="text-void-200 text-sm italic">
                              &quot;{witness.testimony[witness.currentVersion]}&quot;
                            </p>
                          </div>

                          {/* Certainty Bar */}
                          <div className="mt-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-void-500">Certainty</span>
                              <span className={witness.certainty < 50 ? 'text-red-400' : 'text-void-300'}>
                                {Math.round(witness.certainty)}%
                              </span>
                            </div>
                            <div className="h-2 bg-void-900 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full ${
                                  witness.certainty > 70 ? 'bg-green-500' :
                                  witness.certainty > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                animate={{ width: `${witness.certainty}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Timeline Panel */}
              <div className="space-y-4">
                <h2 className="font-display font-bold text-white text-xl flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-400" />
                  Timeline Scrubber
                </h2>

                <div className="glass rounded-xl p-5 border border-void-500/20">
                  {/* Timeline Controls */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <button
                      onClick={() => setTimelinePosition(Math.max(0, timelinePosition - 1))}
                      className="p-2 glass rounded-lg hover:bg-void-700/50 transition-colors"
                    >
                      <Rewind className="w-4 h-4 text-void-300" />
                    </button>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                    </button>
                    <button
                      onClick={() => setTimelinePosition(Math.min(timelineEvents.length - 1, timelinePosition + 1))}
                      className="p-2 glass rounded-lg hover:bg-void-700/50 transition-colors"
                    >
                      <FastForward className="w-4 h-4 text-void-300" />
                    </button>
                  </div>

                  {/* Current Time Display */}
                  <div className="text-center mb-4">
                    <span className="font-mono text-2xl text-indigo-400">
                      {timelineEvents[timelinePosition]?.time || '3:45:00'}
                    </span>
                    <p className="text-void-500 text-xs mt-1">PM</p>
                  </div>

                  {/* Timeline Progress */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max={timelineEvents.length - 1}
                      value={timelinePosition}
                      onChange={(e) => setTimelinePosition(parseInt(e.target.value))}
                      className="w-full h-2 bg-void-800 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #6366f1 ${(timelinePosition / (timelineEvents.length - 1)) * 100}%, #1f2937 ${(timelinePosition / (timelineEvents.length - 1)) * 100}%)`
                      }}
                    />
                  </div>

                  {/* Current Event */}
                  <div className="p-4 bg-void-900/50 rounded-lg border border-void-700">
                    <p className="text-void-200 text-sm mb-2">
                      {timelineEvents[timelinePosition]?.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-void-500 text-xs">Conflict:</span>
                      <div className="flex-1 h-1.5 bg-void-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${
                            timelineEvents[timelinePosition]?.conflictLevel > 70 ? 'bg-red-500' :
                            timelineEvents[timelinePosition]?.conflictLevel > 40 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          animate={{ width: `${timelineEvents[timelinePosition]?.conflictLevel || 0}%` }}
                        />
                      </div>
                      <span className="text-void-400 text-xs">
                        {timelineEvents[timelinePosition]?.conflictLevel}%
                      </span>
                    </div>
                  </div>

                  {/* Witness Presence Indicators */}
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {witnesses.map(w => (
                      <div
                        key={w.id}
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all
                          ${timelineEvents[timelinePosition]?.witnesses.includes(w.id) 
                            ? 'bg-indigo-600' 
                            : 'bg-void-800 opacity-40'}
                        `}
                        title={w.name}
                      >
                        {w.avatar}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Events List */}
                <div className="glass rounded-xl p-4 border border-void-500/20 max-h-60 overflow-y-auto">
                  <h3 className="text-void-400 text-xs font-mono mb-3">EVENT LOG</h3>
                  <div className="space-y-2">
                    {timelineEvents.map((event, idx) => (
                      <motion.div
                        key={idx}
                        onClick={() => setTimelinePosition(idx)}
                        className={`
                          p-2 rounded cursor-pointer transition-all text-xs
                          ${idx === timelinePosition 
                            ? 'bg-indigo-600/20 border border-indigo-500/50' 
                            : 'hover:bg-void-800/50'}
                        `}
                      >
                        <span className="text-indigo-400 font-mono">{event.time}</span>
                        <span className={`ml-2 ${event.conflictLevel > 70 ? 'text-red-400' : 'text-void-300'}`}>
                          {event.description.substring(0, 30)}...
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Accept Superposition Button */}
                <AnimatePresence>
                  {showSuperpositionButton && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)' }}
                      onClick={acceptSuperposition}
                      className="w-full py-4 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-400/50 flex items-center justify-center gap-2"
                    >
                      <Layers className="w-5 h-5" />
                      Accept Superposition
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* REALIZATION PHASE */}
        {phase === 'realization' && (
          <motion.div
            key="realization"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto mt-20"
          >
            <div className="glass rounded-2xl p-10 border-2 border-indigo-500/50">
              <div className="space-y-6 font-mono text-xl text-center">
                {realizationTexts.slice(0, realizationStep).map((text, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={index === realizationStep - 1 ? 'text-indigo-400 font-bold' : 'text-void-200'}
                  >
                    {text}
                  </motion.p>
                ))}
                {realizationStep < realizationTexts.length && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Brain className="w-12 h-12 text-indigo-400 mx-auto" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* SUPERPOSITION PHASE */}
        {phase === 'superposition' && (
          <motion.div
            key="superposition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-5xl mx-auto mt-10"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
              >
                <Layers className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="font-display font-bold text-3xl text-white mb-2">
                Superposition Achieved
              </h2>
              <p className="text-void-300">All truths coexist. All witnesses are correct.</p>
            </div>

            {/* Merged Witnesses */}
            <div className="glass rounded-2xl p-8 border border-indigo-500/30 mb-8">
              <h3 className="text-indigo-400 font-mono text-sm mb-6 text-center">THE UNIFIED TRUTH</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {witnesses.map(w => (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.random() * 0.5 }}
                    className="text-center"
                  >
                    <div className="text-4xl mb-2">{w.avatar}</div>
                    <div className="text-white text-sm font-bold">{w.name.split(' ')[0]}</div>
                    <div className="text-green-400 text-xs">TRUTH: VALID</div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="p-6 bg-indigo-950/30 rounded-xl border border-indigo-500/20"
              >
                <p className="text-void-200 text-center leading-relaxed">
                  At 3:47 PM (and 3:50, and 3:52), an event occurred that was simultaneously a man running, 
                  glass breaking, an emotional shift, and a temporal anomaly. Each witness perceived a different 
                  facet of a multi-dimensional moment. The &quot;truth&quot; was never singular—it was always plural.
                </p>
              </motion.div>
            </div>

            {/* Complete */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="text-center"
            >
              <div className="glass rounded-xl p-6 mb-8 border border-consciousness-500/30">
                <p className="text-void-400 font-mono text-sm mb-2">META-INSIGHT</p>
                <p className="text-white text-xl italic">
                  &quot;Truth is not a point. It is a wave—collapsing only when we insist on choosing.
                  The wisest observers learn to hold multiple truths in superposition.&quot;
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Link href="/levels">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-8 py-4 glass rounded-xl font-display font-bold text-void-300 hover:text-white transition-colors"
                  >
                    Return to Levels
                  </motion.button>
                </Link>
                <Link href="/level/3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-display font-bold text-white"
                  >
                    Continue to Level 3
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
