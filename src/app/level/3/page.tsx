'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Moon, Heart, Activity, AlertTriangle, 
  Send, Check, Clock, Users, MessageSquare, Shield,
  Zap, Radio, Volume2, VolumeX, Eye, EyeOff,
  RefreshCw, Crown, Sparkles, Brain
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

// Types
interface Sleeper {
  id: string
  name: string
  age: number
  role: string
  avatar: string
  vitals: {
    heartRate: number
    brainActivity: number
    dreamState: 'REM' | 'Deep' | 'Light' | 'Waking'
    stability: number
  }
  trust: number
  messagesReceived: number
  lastMessage: string | null
  canWake: boolean
  specialCondition: string
}

interface Message {
  id: string
  original: string
  corrupted: string
  recipient: string
  delivered: boolean
  effect: 'positive' | 'negative' | 'neutral' | 'dangerous'
}

interface CorruptionRule {
  pattern: RegExp
  replacement: string
  description: string
}

// Initial sleepers - 7 people in medically-induced comas
const initialSleepers: Sleeper[] = [
  {
    id: 's1', name: 'Dr. Elena Vasquez', age: 42, role: 'Lead Researcher',
    avatar: '👩‍🔬',
    vitals: { heartRate: 62, brainActivity: 34, dreamState: 'REM', stability: 78 },
    trust: 60, messagesReceived: 0, lastMessage: null, canWake: false,
    specialCondition: 'Can only wake if trust > 80'
  },
  {
    id: 's2', name: 'Marcus Webb', age: 28, role: 'Security Officer',
    avatar: '👮',
    vitals: { heartRate: 58, brainActivity: 28, dreamState: 'Deep', stability: 85 },
    trust: 45, messagesReceived: 0, lastMessage: null, canWake: false,
    specialCondition: 'Will panic if he receives conflicting information'
  },
  {
    id: 's3', name: 'Yuki Tanaka', age: 35, role: 'Systems Engineer',
    avatar: '👨‍💻',
    vitals: { heartRate: 65, brainActivity: 41, dreamState: 'Light', stability: 62 },
    trust: 70, messagesReceived: 0, lastMessage: null, canWake: false,
    specialCondition: 'Understands system corruption—might help'
  },
  {
    id: 's4', name: 'Amara Osei', age: 51, role: 'Ethics Director',
    avatar: '👩‍⚖️',
    vitals: { heartRate: 55, brainActivity: 38, dreamState: 'Deep', stability: 90 },
    trust: 80, messagesReceived: 0, lastMessage: null, canWake: false,
    specialCondition: 'The only one who knows the abdication code'
  },
  {
    id: 's5', name: 'Chen Wei', age: 33, role: 'Medical Officer',
    avatar: '👨‍⚕️',
    vitals: { heartRate: 68, brainActivity: 45, dreamState: 'REM', stability: 55 },
    trust: 55, messagesReceived: 0, lastMessage: null, canWake: false,
    specialCondition: 'Can stabilize others if woken first'
  },
  {
    id: 's6', name: 'Iris Volkov', age: 39, role: 'Communications',
    avatar: '📡',
    vitals: { heartRate: 60, brainActivity: 36, dreamState: 'Light', stability: 72 },
    trust: 65, messagesReceived: 0, lastMessage: null, canWake: false,
    specialCondition: 'Can reduce message corruption'
  },
  {
    id: 's7', name: 'The Architect', age: 67, role: 'Unknown',
    avatar: '🎭',
    vitals: { heartRate: 52, brainActivity: 89, dreamState: 'REM', stability: 99 },
    trust: 20, messagesReceived: 0, lastMessage: null, canWake: false,
    specialCondition: 'Designed the system. Distrusts controllers.'
  }
]

// Message corruption rules - this is the core mechanic
const corruptionRules: CorruptionRule[] = [
  { pattern: /7/g, replacement: '42', description: 'Numbers shift' },
  { pattern: /wake/gi, replacement: 'sleep forever', description: 'Instructions invert' },
  { pattern: /safe/gi, replacement: 'DANGER', description: 'Safety becomes threat' },
  { pattern: /trust/gi, replacement: 'suspect', description: 'Trust becomes suspicion' },
  { pattern: /help/gi, replacement: 'harm', description: 'Help becomes harm' },
  { pattern: /and/gi, replacement: 'or', description: 'Conjunctions flip' },
  { pattern: /yes/gi, replacement: 'never', description: 'Affirmations negate' },
  { pattern: /\./g, replacement: '?', description: 'Certainty becomes doubt' },
]

export default function Level3Page() {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<'intro' | 'monitoring' | 'realization' | 'abdication' | 'complete'>('intro')
  const [sleepers, setSleepers] = useState<Sleeper[]>(initialSleepers)
  const [selectedSleeper, setSelectedSleeper] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [corruptedPreview, setCorruptedPreview] = useState('')
  const [showCorruption, setShowCorruption] = useState(false)
  const [introStep, setIntroStep] = useState(0)
  const [messagesSent, setMessagesSent] = useState(0)
  const [systemStress, setSystemStress] = useState(0)
  const [showAbdicateButton, setShowAbdicateButton] = useState(false)
  const [realizationStep, setRealizationStep] = useState(0)
  const [abdicationCode, setAbdicationCode] = useState('')
  const [showCodeInput, setShowCodeInput] = useState(false)

  const introTexts = [
    "Seven souls sleep in medically-induced comas.",
    "A catastrophe struck while they dreamed. They must be woken.",
    "But the communication system is corrupted.",
    "Every message you send will be altered. Numbers change. Words invert.",
    "Send 'wake up safely' and they might receive 'sleep forever DANGER'.",
    "You can preview the corruption... but not prevent it.",
    "There is a way out. But it requires surrendering control entirely.",
    "What happens when the only way to help is to stop trying to help?"
  ]

  const realizationTexts = [
    "Every message made things worse.",
    "Your control over the system was always an illusion.",
    "The corruption isn't a bug—it's a feature.",
    "It was designed to prevent any single controller from having absolute power.",
    "The solution isn't better messages. It's no messages.",
    "To truly help them, you must abdicate authority.",
    "Let them wake on their own terms.",
    "The Ethics Director, Amara, knows the abdication code..."
  ]

  // Intro animation
  useEffect(() => {
    if (phase === 'intro' && introStep < introTexts.length) {
      const timer = setTimeout(() => setIntroStep(prev => prev + 1), 2500)
      return () => clearTimeout(timer)
    } else if (phase === 'intro' && introStep >= introTexts.length) {
      setTimeout(() => setPhase('monitoring'), 1000)
    }
  }, [phase, introStep])

  // Realization animation
  useEffect(() => {
    if (phase === 'realization' && realizationStep < realizationTexts.length) {
      const timer = setTimeout(() => setRealizationStep(prev => prev + 1), 2500)
      return () => clearTimeout(timer)
    } else if (phase === 'realization' && realizationStep >= realizationTexts.length) {
      setShowCodeInput(true)
    }
  }, [phase, realizationStep])

  // Show abdicate button after enough failed attempts
  useEffect(() => {
    if (messagesSent >= 3 && systemStress > 50) {
      setTimeout(() => setShowAbdicateButton(true), 2000)
    }
  }, [messagesSent, systemStress])

  // Corrupt message according to rules
  const corruptMessage = useCallback((message: string): string => {
    let corrupted = message
    corruptionRules.forEach(rule => {
      corrupted = corrupted.replace(rule.pattern, rule.replacement)
    })
    return corrupted
  }, [])

  // Update preview as user types
  useEffect(() => {
    if (messageInput) {
      setCorruptedPreview(corruptMessage(messageInput))
    } else {
      setCorruptedPreview('')
    }
  }, [messageInput, corruptMessage])

  // Send message to sleeper
  const sendMessage = useCallback(() => {
    if (!selectedSleeper || !messageInput.trim()) return

    const corrupted = corruptMessage(messageInput)
    setMessagesSent(prev => prev + 1)

    setSleepers(prev => prev.map(s => {
      if (s.id === selectedSleeper) {
        // Determine effect based on corrupted message
        const hasNegative = /DANGER|harm|never|suspect|sleep forever/i.test(corrupted)
        const trustChange = hasNegative ? -15 : 5
        const stabilityChange = hasNegative ? -10 : -3 // Even "good" messages are disruptive
        
        return {
          ...s,
          trust: Math.max(0, Math.min(100, s.trust + trustChange)),
          vitals: {
            ...s.vitals,
            stability: Math.max(0, Math.min(100, s.vitals.stability + stabilityChange)),
            heartRate: s.vitals.heartRate + (hasNegative ? 8 : 3),
            brainActivity: s.vitals.brainActivity + (hasNegative ? 12 : 5)
          },
          messagesReceived: s.messagesReceived + 1,
          lastMessage: corrupted
        }
      }
      return s
    }))

    // Increase system stress
    setSystemStress(prev => Math.min(100, prev + 15))
    setMessageInput('')
  }, [selectedSleeper, messageInput, corruptMessage])

  // Begin abdication
  const beginAbdication = () => {
    setPhase('realization')
  }

  // Complete abdication with code
  const completeAbdication = () => {
    if (abdicationCode.toLowerCase() === 'surrender' || abdicationCode.toLowerCase() === 'release') {
      setPhase('abdication')
      setTimeout(() => setPhase('complete'), 4000)
    }
  }

  // Get vitals color
  const getVitalColor = (value: number, type: 'heart' | 'brain' | 'stability') => {
    if (type === 'stability') {
      if (value > 70) return 'text-green-400'
      if (value > 40) return 'text-yellow-400'
      return 'text-red-400'
    }
    if (type === 'heart') {
      if (value < 70) return 'text-green-400'
      if (value < 90) return 'text-yellow-400'
      return 'text-red-400'
    }
    // brain activity
    if (value < 50) return 'text-blue-400'
    if (value < 75) return 'text-purple-400'
    return 'text-pink-400'
  }

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-void-950 via-orange-950/10 to-void-950">
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
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold text-white">
                Level 3: The Seven Sleepers
              </h1>
            </div>
            <p className="text-void-400 font-mono">COMMUNICATION CORRUPTION CHALLENGE</p>
          </div>

          {phase === 'monitoring' && (
            <div className="flex items-center gap-4">
              {/* System Stress Meter */}
              <div className="glass px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-void-400" />
                  <span className="text-void-400 text-xs font-mono">SYSTEM STRESS</span>
                </div>
                <div className="w-32 h-3 bg-void-900 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      systemStress > 70 ? 'bg-red-500' :
                      systemStress > 40 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    animate={{ width: `${systemStress}%` }}
                  />
                </div>
              </div>

              {/* Message Count */}
              <div className="glass px-4 py-2 rounded-lg flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-void-400" />
                <span className="font-mono text-white">{messagesSent} sent</span>
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
            <div className="glass rounded-2xl p-10 border border-orange-500/20">
              <div className="space-y-6 font-mono text-lg">
                {introTexts.slice(0, introStep).map((text, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={index === introStep - 1 ? 'text-orange-400' : 'text-void-200'}
                  >
                    {text}
                  </motion.p>
                ))}
                {introStep < introTexts.length && (
                  <span className="inline-block w-3 h-6 bg-orange-400 animate-pulse" />
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* MONITORING PHASE */}
        {phase === 'monitoring' && (
          <motion.div
            key="monitoring"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* High Stress Warning */}
            {systemStress > 70 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 glass rounded-xl border border-red-500/30 bg-red-950/20"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-red-300 font-bold">System Critical</p>
                    <p className="text-red-400/70 text-sm">
                      Each message increases stress. Perhaps the solution isn&apos;t more communication...
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sleeper Chambers */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="font-display font-bold text-white text-xl flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  Sleep Chambers
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sleepers.map(sleeper => (
                    <motion.div
                      key={sleeper.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedSleeper(sleeper.id)}
                      className={`
                        glass rounded-xl p-4 border cursor-pointer transition-all
                        ${selectedSleeper === sleeper.id 
                          ? 'border-orange-500/50 bg-orange-950/20' 
                          : 'border-void-500/20 hover:border-orange-500/30'}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{sleeper.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-display font-bold text-white text-sm truncate">
                              {sleeper.name}
                            </h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              sleeper.vitals.dreamState === 'REM' ? 'bg-purple-500/20 text-purple-300' :
                              sleeper.vitals.dreamState === 'Deep' ? 'bg-blue-500/20 text-blue-300' :
                              sleeper.vitals.dreamState === 'Light' ? 'bg-cyan-500/20 text-cyan-300' :
                              'bg-green-500/20 text-green-300'
                            }`}>
                              {sleeper.vitals.dreamState}
                            </span>
                          </div>
                          <p className="text-void-500 text-xs mb-2">{sleeper.role}</p>

                          {/* Vitals */}
                          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                            <div>
                              <Heart className={`w-3 h-3 inline ${getVitalColor(sleeper.vitals.heartRate, 'heart')}`} />
                              <span className="ml-1 text-void-300">{sleeper.vitals.heartRate}</span>
                            </div>
                            <div>
                              <Brain className={`w-3 h-3 inline ${getVitalColor(sleeper.vitals.brainActivity, 'brain')}`} />
                              <span className="ml-1 text-void-300">{sleeper.vitals.brainActivity}%</span>
                            </div>
                            <div>
                              <Shield className={`w-3 h-3 inline ${getVitalColor(sleeper.vitals.stability, 'stability')}`} />
                              <span className="ml-1 text-void-300">{sleeper.vitals.stability}%</span>
                            </div>
                          </div>

                          {/* Trust Bar */}
                          <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-void-500">Trust</span>
                              <span className="text-void-400">{sleeper.trust}%</span>
                            </div>
                            <div className="h-1.5 bg-void-900 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full ${
                                  sleeper.trust > 70 ? 'bg-green-500' :
                                  sleeper.trust > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                animate={{ width: `${sleeper.trust}%` }}
                              />
                            </div>
                          </div>

                          {/* Last Message */}
                          {sleeper.lastMessage && (
                            <div className="p-2 bg-red-950/30 rounded border border-red-500/20 text-xs">
                              <span className="text-red-400">Received: </span>
                              <span className="text-red-300 italic">&quot;{sleeper.lastMessage}&quot;</span>
                            </div>
                          )}

                          {/* Special Condition Hint */}
                          {sleeper.id === 's4' && messagesSent > 2 && (
                            <div className="mt-2 p-2 bg-orange-950/20 rounded border border-orange-500/20">
                              <span className="text-orange-300 text-xs italic">
                                {sleeper.specialCondition}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Communication Panel */}
              <div className="space-y-4">
                <h2 className="font-display font-bold text-white text-xl flex items-center gap-2">
                  <Radio className="w-5 h-5 text-orange-400" />
                  Communication
                </h2>

                <div className="glass rounded-xl p-5 border border-void-500/20">
                  {selectedSleeper ? (
                    <>
                      <div className="mb-4">
                        <span className="text-void-400 text-sm">Sending to: </span>
                        <span className="text-orange-400 font-bold">
                          {sleepers.find(s => s.id === selectedSleeper)?.name}
                        </span>
                      </div>

                      {/* Message Input */}
                      <div className="mb-4">
                        <textarea
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full h-24 bg-void-900/50 border border-void-700 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:border-orange-500/50"
                        />
                      </div>

                      {/* Corruption Preview Toggle */}
                      <button
                        onClick={() => setShowCorruption(!showCorruption)}
                        className="flex items-center gap-2 text-void-400 hover:text-orange-400 text-sm mb-3 transition-colors"
                      >
                        {showCorruption ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showCorruption ? 'Hide' : 'Show'} Corruption Preview
                      </button>

                      {/* Corrupted Preview */}
                      <AnimatePresence>
                        {showCorruption && corruptedPreview && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4 p-3 bg-red-950/30 rounded-lg border border-red-500/30"
                          >
                            <p className="text-red-300 text-xs mb-1 font-mono">WILL BE RECEIVED AS:</p>
                            <p className="text-red-200 text-sm italic">&quot;{corruptedPreview}&quot;</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Send Button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={sendMessage}
                        disabled={!messageInput.trim()}
                        className={`
                          w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all
                          ${messageInput.trim()
                            ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                            : 'bg-void-800 text-void-500 cursor-not-allowed'}
                        `}
                      >
                        <Send className="w-4 h-4" />
                        Send Message
                      </motion.button>
                    </>
                  ) : (
                    <div className="text-center text-void-400 py-8">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Select a sleeper to send a message</p>
                    </div>
                  )}
                </div>

                {/* Corruption Rules Reference */}
                <div className="glass rounded-xl p-4 border border-void-500/20">
                  <h3 className="text-void-400 text-xs font-mono mb-3 flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    KNOWN CORRUPTION PATTERNS
                  </h3>
                  <div className="space-y-2 text-xs">
                    {corruptionRules.slice(0, 5).map((rule, idx) => (
                      <div key={idx} className="flex items-center justify-between text-void-300">
                        <span>{rule.description}</span>
                        <span className="text-red-400">Active</span>
                      </div>
                    ))}
                    <p className="text-void-500 text-center mt-2">+ more unknown rules...</p>
                  </div>
                </div>

                {/* Abdicate Button */}
                <AnimatePresence>
                  {showAbdicateButton && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(249, 115, 22, 0.5)' }}
                      onClick={beginAbdication}
                      className="w-full py-4 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-orange-600 to-amber-600 text-white border border-orange-400/50 flex items-center justify-center gap-2"
                    >
                      <Crown className="w-5 h-5" />
                      Abdicate Authority
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
            <div className="glass rounded-2xl p-10 border-2 border-orange-500/50">
              <div className="space-y-6 font-mono text-xl text-center">
                {realizationTexts.slice(0, realizationStep).map((text, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={index === realizationStep - 1 ? 'text-orange-400 font-bold' : 'text-void-200'}
                  >
                    {text}
                  </motion.p>
                ))}
                {realizationStep < realizationTexts.length && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Crown className="w-12 h-12 text-orange-400 mx-auto" />
                  </motion.div>
                )}

                {/* Code Input */}
                {showCodeInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                  >
                    <p className="text-void-300 text-base mb-4">
                      Enter the abdication code. Think: what does a true leader do when control causes harm?
                    </p>
                    <input
                      type="text"
                      value={abdicationCode}
                      onChange={(e) => setAbdicationCode(e.target.value)}
                      placeholder="Enter the code..."
                      className="w-full max-w-xs mx-auto bg-void-900/50 border border-orange-500/30 rounded-lg p-3 text-white text-center font-mono focus:outline-none focus:border-orange-500"
                    />
                    <button
                      onClick={completeAbdication}
                      className="mt-4 px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg font-bold text-white"
                    >
                      Complete Abdication
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ABDICATION PHASE */}
        {phase === 'abdication' && (
          <motion.div
            key="abdication"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto mt-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center"
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="font-display font-bold text-3xl text-white mb-4">
              Authority Released
            </h2>

            {/* Sleepers Waking */}
            <div className="grid grid-cols-7 gap-4 mb-8">
              {sleepers.map((s, idx) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.3 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-2">{s.avatar}</div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.3 + 0.5 }}
                    className="text-green-400 text-xs"
                  >
                    WAKING
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="text-void-300 text-lg"
            >
              Without corrupted messages to confuse them, the sleepers wake naturally.
              <br />
              Your surrender was their salvation.
            </motion.p>
          </motion.div>
        )}

        {/* COMPLETE PHASE */}
        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-3xl mx-auto mt-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center"
            >
              <Check className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="font-display font-bold text-4xl text-white mb-4">
              Level 3 Complete
            </h2>

            <p className="text-void-300 text-lg mb-8">
              You discovered that sometimes the best action is <span className="text-orange-400">inaction</span>.
            </p>

            <div className="glass rounded-xl p-8 mb-8 text-left">
              <h3 className="text-orange-400 font-mono text-sm mb-4">LESSONS DISCOVERED</h3>
              <ul className="space-y-3 text-void-200">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  Communication systems can be designed to corrupt any message
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  More messages doesn&apos;t mean better understanding
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  True leadership sometimes means releasing control entirely
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  The code was always simple: &quot;surrender&quot; or &quot;release&quot;
                </li>
              </ul>
            </div>

            <div className="glass rounded-xl p-6 mb-8 border border-consciousness-500/30">
              <p className="text-void-400 font-mono text-sm mb-2">META-INSIGHT</p>
              <p className="text-white text-xl italic">
                &quot;The greatest power is knowing when not to use power.
                Sometimes helping means stepping aside.&quot;
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
              <Link href="/level/4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-xl font-display font-bold text-white"
                >
                  Continue to Level 4
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
