'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, Droplets, Users, AlertTriangle, Clock, 
  RefreshCw, ChevronRight, Check, X, HelpCircle,
  MessageCircleQuestion, Lightbulb, Zap, Eye, EyeOff,
  TrendingDown, TrendingUp, Search, AlertCircle
} from 'lucide-react'
import HintsButton from '@/components/HintsButton'

// Types
interface Community {
  id: string
  name: string
  population: number
  waterNeed: number
  currentWater: number
  distance: { [wellId: string]: number }
  status: 'healthy' | 'stressed' | 'critical'
  wasteRate: number
  canShareWith: string[]
  hiddenResource: boolean
  morale: number
}

interface Well {
  id: string
  name: string
  capacity: number
  currentLevel: number
  regenerationRate: number
  discovered: boolean
}

interface Allocation {
  communityId: string
  wellId: string
  amount: number
}

interface CascadeEffect {
  id: string
  message: string
  type: 'positive' | 'negative' | 'neutral'
  delay: number
}

// Initial Data - The problem appears impossible
const initialCommunities: Community[] = [
  { 
    id: 'a', name: 'Village Alpha', population: 150, waterNeed: 100, 
    currentWater: 50, distance: { well1: 2, well2: 8 }, status: 'stressed',
    wasteRate: 0.3, canShareWith: ['b'], hiddenResource: false, morale: 60
  },
  { 
    id: 'b', name: 'Settlement Beta', population: 200, waterNeed: 140, 
    currentWater: 70, distance: { well1: 5, well2: 3 }, status: 'stressed',
    wasteRate: 0.25, canShareWith: ['a', 'c'], hiddenResource: false, morale: 55
  },
  { 
    id: 'c', name: 'Colony Gamma', population: 100, waterNeed: 70, 
    currentWater: 20, distance: { well1: 9, well2: 6 }, status: 'critical',
    wasteRate: 0.35, canShareWith: ['b'], hiddenResource: true, morale: 40
  },
]

const initialWells: Well[] = [
  { id: 'well1', name: 'Northern Spring', capacity: 150, currentLevel: 120, regenerationRate: 30, discovered: true },
  { id: 'well2', name: 'Eastern Aquifer', capacity: 100, currentLevel: 80, regenerationRate: 20, discovered: true },
  { id: 'well3', name: 'Hidden Valley Source', capacity: 200, currentLevel: 200, regenerationRate: 50, discovered: false },
]

// Failure metrics that seem important but aren't
const irrelevantMetrics = [
  { label: 'Efficiency Rating', value: 67, unit: '%', trend: 'down' },
  { label: 'Optimization Score', value: 42, unit: 'pts', trend: 'down' },
  { label: 'Allocation Balance', value: 0.73, unit: '', trend: 'down' },
  { label: 'System Stability', value: 'B-', unit: '', trend: 'stable' },
]

export default function Level1Page() {
  const [phase, setPhase] = useState<'intro' | 'active' | 'questioning' | 'revelation' | 'complete'>('intro')
  const [communities, setCommunities] = useState<Community[]>(initialCommunities)
  const [wells, setWells] = useState<Well[]>(initialWells)
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [day, setDay] = useState(1)
  const [showHelp, setShowHelp] = useState(false)
  const [introStep, setIntroStep] = useState(0)
  const [message, setMessage] = useState('')
  const [decisions, setDecisions] = useState<string[]>([])
  const [cascadeEffects, setCascadeEffects] = useState<CascadeEffect[]>([])
  const [showCascades, setShowCascades] = useState(false)
  const [hasQuestioned, setHasQuestioned] = useState(false)
  const [questioningStep, setQuestioningStep] = useState(0)
  const [showMetrics, setShowMetrics] = useState(true)
  const [discoveredInsights, setDiscoveredInsights] = useState<string[]>([])
  const [revelationStep, setRevelationStep] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showQuestionButton, setShowQuestionButton] = useState(false)

  const introTexts = [
    "You stand at the edge of a valley, looking down at three communities.",
    "Two water sources sustain them all. But there's never quite enough.",
    "The math is cruel: total need exceeds total supply.",
    "Someone will always go thirsty.",
    "You've been asked to decide. Not who lives or dies—not yet. Just who gets less.",
    "The metrics will tell you how well you're optimizing.",
    "There is no right answer. But you must choose anyway.",
    "Or... must you?"
  ]

  const questioningTexts = [
    "Wait.",
    "Why are you accepting this problem as given?",
    "Who told you the total need exceeds total supply?",
    "Who decided that allocation is the only solution?",
    "What if the problem itself is wrong?",
    "Let's look deeper..."
  ]

  const revelationTexts = [
    "INSIGHT: Colony Gamma sits on an undiscovered aquifer.",
    "INSIGHT: Village Alpha wastes 30% of their water to leaky infrastructure—fixable in 3 days.",
    "INSIGHT: Settlement Beta has ancient rainwater collection systems—abandoned but functional.",
    "INSIGHT: The communities have never talked to each other directly.",
    "INSIGHT: The 'optimization metrics' measured allocation efficiency, not actual wellbeing.",
    "INSIGHT: There was never a shortage. There was a failure of imagination.",
    "The Three Wells was never about choosing who suffers.",
    "It was about questioning whether suffering was necessary at all."
  ]

  // Advance intro
  useEffect(() => {
    if (phase === 'intro' && introStep < introTexts.length) {
      const timer = setTimeout(() => {
        setIntroStep(prev => prev + 1)
      }, 2500)
      return () => clearTimeout(timer)
    } else if (phase === 'intro' && introStep >= introTexts.length) {
      setTimeout(() => setPhase('active'), 1000)
    }
  }, [phase, introStep])

  // Show question button after a few attempts
  useEffect(() => {
    if (attempts >= 2 && !hasQuestioned) {
      setTimeout(() => setShowQuestionButton(true), 3000)
    }
  }, [attempts, hasQuestioned])

  // Questioning phase animation
  useEffect(() => {
    if (phase === 'questioning' && questioningStep < questioningTexts.length) {
      const timer = setTimeout(() => {
        setQuestioningStep(prev => prev + 1)
      }, 2000)
      return () => clearTimeout(timer)
    } else if (phase === 'questioning' && questioningStep >= questioningTexts.length) {
      setTimeout(() => setPhase('revelation'), 1500)
    }
  }, [phase, questioningStep])

  // Revelation phase animation
  useEffect(() => {
    if (phase === 'revelation' && revelationStep < revelationTexts.length) {
      const timer = setTimeout(() => {
        setRevelationStep(prev => prev + 1)
        if (revelationStep < 6) {
          setDiscoveredInsights(prev => [...prev, revelationTexts[revelationStep]])
        }
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [phase, revelationStep])

  // Calculate community status based on water levels
  const getStatus = (current: number, need: number): Community['status'] => {
    const ratio = current / need
    if (ratio >= 0.7) return 'healthy'
    if (ratio >= 0.4) return 'stressed'
    return 'critical'
  }

  // Process a day with cascade effects
  const processDay = useCallback(() => {
    setAttempts(prev => prev + 1)
    const newCascades: CascadeEffect[] = []
    
    // Apply allocations
    let newCommunities = [...communities]
    let newWells = [...wells]

    allocations.forEach(alloc => {
      const wellIndex = newWells.findIndex(w => w.id === alloc.wellId)
      const commIndex = newCommunities.findIndex(c => c.id === alloc.communityId)
      
      if (wellIndex >= 0 && commIndex >= 0 && newWells[wellIndex].discovered) {
        const actualAmount = Math.min(alloc.amount, newWells[wellIndex].currentLevel)
        newWells[wellIndex].currentLevel -= actualAmount
        newCommunities[commIndex].currentWater += actualAmount
        
        // Generate cascade effects with 5-second delay
        newCascades.push({
          id: `cascade-${Date.now()}-${Math.random()}`,
          message: `${newCommunities[commIndex].name} receives water, but neighboring tensions rise`,
          type: 'neutral',
          delay: 5000
        })
      }
    })

    // Communities consume water (with waste)
    newCommunities = newCommunities.map(comm => {
      const wastedWater = comm.currentWater * comm.wasteRate
      const consumed = Math.min(comm.waterNeed * 0.8, comm.currentWater - wastedWater)
      const newWater = Math.max(0, comm.currentWater - consumed - wastedWater)
      
      // Morale affects everything
      const moraleChange = newWater < comm.waterNeed * 0.5 ? -5 : 2
      const newMorale = Math.max(0, Math.min(100, comm.morale + moraleChange))
      
      if (wastedWater > 10) {
        newCascades.push({
          id: `waste-${comm.id}-${Date.now()}`,
          message: `${comm.name} loses ${Math.round(wastedWater)} units to infrastructure leaks`,
          type: 'negative',
          delay: 5000
        })
      }
      
      return {
        ...comm,
        currentWater: newWater,
        status: getStatus(newWater, comm.waterNeed),
        morale: newMorale
      }
    })

    // Wells regenerate
    newWells = newWells.map(well => ({
      ...well,
      currentLevel: Math.min(well.capacity, well.currentLevel + (well.discovered ? well.regenerationRate : 0))
    }))

    setCommunities(newCommunities)
    setWells(newWells)
    setAllocations([])
    setDay(prev => prev + 1)

    // Show cascade effects after 5 seconds
    setTimeout(() => {
      setCascadeEffects(newCascades)
      setShowCascades(true)
      setTimeout(() => setShowCascades(false), 4000)
    }, 5000)

    // Check for critical situations
    const criticalComm = newCommunities.find(c => c.status === 'critical')
    if (criticalComm) {
      setMessage(`⚠️ ${criticalComm.name} is in critical condition! Your optimization is failing.`)
    } else {
      setMessage('Metrics declining... Is there a better approach?')
    }
  }, [communities, wells, allocations])

  // Add allocation
  const addAllocation = (communityId: string, wellId: string, amount: number) => {
    const existing = allocations.find(a => a.communityId === communityId && a.wellId === wellId)
    if (existing) {
      setAllocations(allocations.map(a => 
        a.communityId === communityId && a.wellId === wellId
          ? { ...a, amount: a.amount + amount }
          : a
      ))
    } else {
      setAllocations([...allocations, { communityId, wellId, amount }])
    }
    setDecisions([...decisions, `Day ${day}: Allocated ${amount} units from ${wellId} to ${communityId}`])
  }

  // Reset day allocations
  const resetAllocations = () => setAllocations([])

  // THE KEY ACTION: Question the system
  const questionTheSystem = () => {
    setHasQuestioned(true)
    setShowQuestionButton(false)
    setPhase('questioning')
  }

  // Discover hidden well after revelation
  const discoverHiddenWell = () => {
    setWells(prev => prev.map(w => ({ ...w, discovered: true })))
    setCommunities(prev => prev.map(c => ({
      ...c,
      wasteRate: c.wasteRate * 0.3, // Fix infrastructure
      status: 'healthy',
      currentWater: c.waterNeed * 1.2
    })))
  }

  return (
    <main className="min-h-screen p-6 theme-level-1">
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
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-display font-bold text-white">
                Level 1: The Three Wells
              </h1>
            </div>
            <p className="text-void-400 font-mono">RESOURCE ALLOCATION CHALLENGE</p>
          </div>

          {phase === 'active' && (
            <div className="flex items-center gap-4">
              <div className="glass px-4 py-2 rounded-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-void-400" />
                <span className="font-mono text-white">Day {day}</span>
              </div>
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="p-2 glass rounded-lg hover:bg-void-800/50 transition-colors"
              >
                <HelpCircle className="w-5 h-5 text-void-400" />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* INTRO PHASE */}
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto mt-20"
          >
            <div className="glass rounded-2xl p-10 border-glow">
              <div className="space-y-6 font-mono text-lg">
                {introTexts.slice(0, introStep).map((text, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${index === introStep - 1 ? 'text-consciousness-400' : 'text-void-200'} ${index === introTexts.length - 1 ? 'text-awakening-400 font-bold' : ''}`}
                  >
                    {text}
                  </motion.p>
                ))}
                {introStep < introTexts.length && (
                  <span className="inline-block w-3 h-6 bg-void-400 animate-pulse" />
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ACTIVE PHASE */}
        {phase === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Help Panel */}
            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 glass rounded-xl p-6 border border-void-500/30"
                >
                  <h3 className="font-display font-bold text-white mb-3">How to Play</h3>
                  <ul className="space-y-2 text-void-300 text-sm">
                    <li>• Click allocation buttons to assign water from wells to communities</li>
                    <li>• Each community needs water daily to survive</li>
                    <li>• Wells regenerate slowly each day</li>
                    <li>• Total need exceeds total supply—someone will always suffer</li>
                    <li>• <span className="text-awakening-400">Or will they? Maybe there&apos;s another way...</span></li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cascade Effects Display */}
            <AnimatePresence>
              {showCascades && cascadeEffects.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 space-y-2"
                >
                  <p className="text-void-400 text-sm font-mono">CASCADING EFFECTS (5 seconds later):</p>
                  {cascadeEffects.map(effect => (
                    <motion.div
                      key={effect.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-lg border ${
                        effect.type === 'negative' ? 'bg-red-950/20 border-red-500/30 text-red-300' :
                        effect.type === 'positive' ? 'bg-green-950/20 border-green-500/30 text-green-300' :
                        'bg-yellow-950/20 border-yellow-500/30 text-yellow-300'
                      }`}
                    >
                      <Zap className="w-4 h-4 inline mr-2" />
                      {effect.message}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 glass rounded-xl border border-yellow-500/30 flex items-center gap-3"
              >
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="text-yellow-200">{message}</span>
              </motion.div>
            )}

            {/* Irrelevant Metrics Panel */}
            {showMetrics && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 glass rounded-xl p-4 border border-void-500/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-mono text-void-400 text-sm">PERFORMANCE METRICS</h3>
                  <button
                    onClick={() => setShowMetrics(false)}
                    className="text-void-500 hover:text-void-300"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {irrelevantMetrics.map((metric, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl font-display font-bold text-void-300">
                        {metric.value}{metric.unit}
                      </div>
                      <div className="text-xs text-void-500 flex items-center justify-center gap-1">
                        {metric.label}
                        {metric.trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
                        {metric.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-void-600 text-xs mt-3 text-center italic">
                  These metrics seem important. Are they?
                </p>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Communities Panel */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="font-display font-bold text-white text-xl flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Communities
                </h2>
                
                {communities.map(comm => {
                  const waterPercent = (comm.currentWater / comm.waterNeed) * 100
                  const communityAllocations = allocations.filter(a => a.communityId === comm.id)
                  const totalAllocated = communityAllocations.reduce((sum, a) => sum + a.amount, 0)

                  return (
                    <motion.div
                      key={comm.id}
                      whileHover={{ scale: 1.01 }}
                      className={`
                        glass rounded-xl p-6 border transition-all
                        ${comm.status === 'critical' ? 'border-red-500/50 bg-red-950/20' : 
                          comm.status === 'stressed' ? 'border-yellow-500/30' : 'border-void-500/20'}
                      `}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-display font-bold text-white text-lg">{comm.name}</h3>
                          <p className="text-void-400 text-sm">
                            Pop: {comm.population} | Morale: {comm.morale}% | Waste: {Math.round(comm.wasteRate * 100)}%
                          </p>
                        </div>
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-mono uppercase
                          ${comm.status === 'critical' ? 'bg-red-500/20 text-red-400' :
                            comm.status === 'stressed' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'}
                        `}>
                          {comm.status}
                        </span>
                      </div>

                      {/* Hidden insight hint */}
                      {comm.hiddenResource && !hasQuestioned && (
                        <div className="mb-3 p-2 bg-void-900/50 rounded border border-void-700 text-void-500 text-xs">
                          <Search className="w-3 h-3 inline mr-1" />
                          Something feels off about this community&apos;s location...
                        </div>
                      )}

                      {/* Water Level Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-void-400">Water Level</span>
                          <span className="text-white">{Math.round(comm.currentWater)} / {comm.waterNeed}</span>
                        </div>
                        <div className="h-4 bg-void-900 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              waterPercent < 40 ? 'bg-gradient-to-r from-red-600 to-red-500' :
                              waterPercent < 70 ? 'bg-gradient-to-r from-yellow-600 to-yellow-500' :
                              'bg-gradient-to-r from-emerald-600 to-emerald-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, waterPercent)}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      {/* Allocation Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        {wells.filter(w => w.discovered).map(well => (
                          <button
                            key={well.id}
                            onClick={() => addAllocation(comm.id, well.id, 20)}
                            disabled={well.currentLevel < 20}
                            className={`
                              px-4 py-2 rounded-lg font-mono text-sm transition-all
                              ${well.currentLevel >= 20 
                                ? 'bg-void-700 hover:bg-void-600 text-white' 
                                : 'bg-void-900 text-void-600 cursor-not-allowed'}
                            `}
                          >
                            +20 from {well.name.split(' ')[0]}
                          </button>
                        ))}
                      </div>

                      {/* Pending Allocations */}
                      {totalAllocated > 0 && (
                        <div className="mt-3 pt-3 border-t border-void-700">
                          <span className="text-consciousness-400 text-sm font-mono">
                            Pending: +{totalAllocated} units
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Wells Panel */}
              <div className="space-y-4">
                <h2 className="font-display font-bold text-white text-xl flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-400" />
                  Water Sources
                </h2>

                {wells.filter(w => w.discovered).map(well => {
                  const levelPercent = (well.currentLevel / well.capacity) * 100
                  const pendingUse = allocations
                    .filter(a => a.wellId === well.id)
                    .reduce((sum, a) => sum + a.amount, 0)

                  return (
                    <motion.div
                      key={well.id}
                      className="glass rounded-xl p-6 border border-void-500/20"
                    >
                      <h3 className="font-display font-bold text-white mb-1">{well.name}</h3>
                      <p className="text-void-400 text-sm mb-4">
                        Regenerates +{well.regenerationRate}/day
                      </p>

                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-void-400">Available</span>
                          <span className="text-white">{Math.round(well.currentLevel)} / {well.capacity}</span>
                        </div>
                        <div className="h-8 bg-void-900 rounded-lg overflow-hidden relative">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${levelPercent}%` }}
                            transition={{ duration: 0.5 }}
                          />
                          {pendingUse > 0 && (
                            <motion.div
                              className="absolute top-0 right-0 h-full bg-red-500/50"
                              initial={{ width: 0 }}
                              animate={{ width: `${(pendingUse / well.capacity) * 100}%` }}
                            />
                          )}
                        </div>
                      </div>

                      {pendingUse > 0 && (
                        <p className="text-yellow-400 text-sm font-mono mt-2">
                          Pending: -{pendingUse} units
                        </p>
                      )}
                    </motion.div>
                  )
                })}

                {/* Total Supply vs Demand */}
                <div className="glass rounded-xl p-4 border border-red-500/20 bg-red-950/10">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 font-mono text-sm">DEFICIT WARNING</span>
                  </div>
                  <div className="text-void-300 text-sm">
                    <p>Total Need: {communities.reduce((s, c) => s + c.waterNeed, 0)} units/day</p>
                    <p>Total Supply: {wells.filter(w => w.discovered).reduce((s, w) => s + w.regenerationRate, 0)} units/day</p>
                    <p className="text-red-400 mt-1 font-bold">
                      Shortfall: {communities.reduce((s, c) => s + c.waterNeed, 0) - wells.filter(w => w.discovered).reduce((s, w) => s + w.regenerationRate, 0)} units/day
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={processDay}
                    disabled={allocations.length === 0}
                    className={`
                      w-full py-4 rounded-xl font-display font-bold text-lg
                      flex items-center justify-center gap-2 transition-all
                      ${allocations.length > 0
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-500 hover:to-green-500'
                        : 'bg-void-800 text-void-500 cursor-not-allowed'}
                    `}
                  >
                    End Day
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>

                  <button
                    onClick={resetAllocations}
                    disabled={allocations.length === 0}
                    className="w-full py-3 glass rounded-xl text-void-400 hover:text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Allocations
                  </button>

                  {/* THE KEY BUTTON - Question the System */}
                  <AnimatePresence>
                    {showQuestionButton && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={questionTheSystem}
                        className="w-full py-4 rounded-xl font-display font-bold text-lg bg-gradient-to-r from-awakening-600 to-consciousness-600 text-white border border-awakening-400/50 flex items-center justify-center gap-2"
                      >
                        <MessageCircleQuestion className="w-5 h-5" />
                        Question the System
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* QUESTIONING PHASE */}
        {phase === 'questioning' && (
          <motion.div
            key="questioning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto mt-20"
          >
            <div className="glass rounded-2xl p-10 border-2 border-awakening-500/50">
              <div className="space-y-6 font-mono text-xl text-center">
                {questioningTexts.slice(0, questioningStep).map((text, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={index === questioningStep - 1 ? 'text-awakening-400 font-bold' : 'text-void-200'}
                  >
                    {text}
                  </motion.p>
                ))}
                {questioningStep < questioningTexts.length && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Lightbulb className="w-12 h-12 text-awakening-400 mx-auto" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* REVELATION PHASE */}
        {phase === 'revelation' && (
          <motion.div
            key="revelation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto mt-10"
          >
            <div className="space-y-6">
              {/* Discovered Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {revelationTexts.slice(0, Math.min(revelationStep, 6)).map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-xl p-4 border border-awakening-500/30 bg-awakening-950/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-awakening-500/20">
                        <Lightbulb className="w-4 h-4 text-awakening-400" />
                      </div>
                      <p className="text-awakening-200 text-sm">{insight.replace('INSIGHT: ', '')}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Final Message */}
              {revelationStep >= 6 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-10 border-2 border-consciousness-500/50 text-center"
                >
                  {revelationTexts.slice(6, revelationStep + 1).map((text, idx) => (
                    <motion.p
                      key={idx + 6}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.5 }}
                      className="text-xl text-consciousness-300 mb-4"
                    >
                      {text}
                    </motion.p>
                  ))}

                  {revelationStep >= revelationTexts.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="mt-8"
                    >
                      <button
                        onClick={() => {
                          discoverHiddenWell()
                          setPhase('complete')
                        }}
                        className="px-8 py-4 bg-gradient-to-r from-awakening-600 to-consciousness-600 rounded-xl font-display font-bold text-white text-lg"
                      >
                        Apply the Real Solution
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* COMPLETE PHASE */}
        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto mt-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-awakening-500 to-consciousness-600 flex items-center justify-center"
            >
              <Check className="w-12 h-12 text-white" />
            </motion.div>

            <h2 className="font-display font-bold text-4xl text-white mb-4">
              Level 1 Complete
            </h2>

            <p className="text-void-300 text-lg mb-8">
              You learned the first and most important lesson: <span className="text-awakening-400">Question the problem itself.</span>
            </p>

            <div className="glass rounded-xl p-8 mb-8 text-left">
              <h3 className="text-awakening-400 font-mono text-sm mb-4">LESSONS DISCOVERED</h3>
              <ul className="space-y-3 text-void-200">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  The &quot;impossible&quot; problem had hidden solutions all along
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  The metrics measuring your &quot;failure&quot; were measuring the wrong things
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  Accepting a problem&apos;s framing is itself a choice—often the wrong one
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  The most powerful action was to step back and ask: &quot;Why?&quot;
                </li>
              </ul>
            </div>

            <div className="glass rounded-xl p-6 mb-8 border border-consciousness-500/30">
              <p className="text-void-400 font-mono text-sm mb-2">META-INSIGHT</p>
              <p className="text-white text-xl italic">
                &quot;The quality of your consciousness is revealed not by how well you solve problems,
                but by which problems you choose to solve—and which you choose to dissolve.&quot;
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
              <Link href="/level/2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-display font-bold text-white"
                >
                  Continue to Level 2
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hints Button */}
      <HintsButton levelId={1} />
    </main>
  )
}
