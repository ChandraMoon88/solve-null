'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { 
  Droplets, Eye, Moon, TrendingUp, Building2, 
  Library, Sprout, Split, Globe, Rocket, CircleOff,
  Lock, CheckCircle, ChevronRight, ArrowLeft, Shield, LogOut, User
} from 'lucide-react'
import { useProgressStore } from '@/store/progressStore'
import ConsciousnessJournal from '@/components/ConsciousnessJournal'
import ProgressTracker from '@/components/ProgressTracker'
import { useTranslation } from '@/hooks/useTranslation'

const getLevelData = (t: any) => [
  {
    id: 1,
    ...t.levelData.level1,
    icon: Droplets,
    color: "from-emerald-500 to-green-600",
  },
  {
    id: 2,
    ...t.levelData.level2,
    icon: Eye,
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: 3,
    ...t.levelData.level3,
    icon: Moon,
    color: "from-violet-500 to-purple-600",
  },
  {
    id: 4,
    ...t.levelData.level4,
    icon: TrendingUp,
    color: "from-amber-500 to-orange-600",
  },
  {
    id: 5,
    ...t.levelData.level5,
    icon: Building2,
    color: "from-cyan-500 to-teal-600",
  },
  {
    id: 6,
    ...t.levelData.level6,
    icon: Library,
    color: "from-pink-500 to-rose-600",
  },
  {
    id: 7,
    ...t.levelData.level7,
    icon: Sprout,
    color: "from-lime-500 to-green-600",
  },
  {
    id: 8,
    ...t.levelData.level8,
    icon: Split,
    color: "from-orange-500 to-red-600",
  },
  {
    id: 9,
    ...t.levelData.level9,
    icon: Globe,
    color: "from-teal-500 to-emerald-600",
  },
  {
    id: 10,
    ...t.levelData.level10,
    icon: Rocket,
    color: "from-purple-500 to-violet-600",
  },
  {
    id: 0,
    ...t.levelData.level0,
    icon: CircleOff,
    color: "from-gray-900 to-black",
    isNull: true,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export default function LevelsPage() {
  const { 
    isAdmin, 
    levelProgress, 
    completedLevels, 
    verifyAdminPassword, 
    isLevelUnlocked,
    logout,
    consciousnessScore 
  } = useProgressStore()
  
  const { t } = useTranslation()
  const levelData = getLevelData(t)
  
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(false)

  const handleAdminLogin = () => {
    if (verifyAdminPassword(password)) {
      setShowAdminLogin(false)
      setPassword('')
      setLoginError(false)
    } else {
      setLoginError(true)
      setTimeout(() => setLoginError(false), 2000)
    }
  }

  return (
    <main className="min-h-screen p-6 md:p-12">
      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAdminLogin(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass border border-void-500/40 rounded-2xl p-8 max-w-md w-full mx-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-consciousness-400" />
                <h2 className="text-2xl font-display font-bold text-white">
                  {t.admin.adminAccess}
                </h2>
              </div>
              
              <p className="text-void-300 mb-6">
                {t.admin.enterPassword}
              </p>
              
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                placeholder={t.admin.enterPasswordPlaceholder}
                className={`
                  w-full px-4 py-3 rounded-lg mb-4
                  bg-void-900/50 border transition-all
                  text-white placeholder-void-500
                  focus:outline-none focus:ring-2
                  ${loginError 
                    ? 'border-red-500 ring-2 ring-red-500/50' 
                    : 'border-void-500/40 focus:ring-consciousness-500/50'
                  }
                `}
                autoFocus
              />
              
              {loginError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mb-4"
                >
                  {t.admin.invalidPassword}
                </motion.p>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-void-500/40 text-void-300 hover:bg-void-900/30 transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-consciousness-500 to-consciousness-600 text-white font-semibold hover:from-consciousness-600 hover:to-consciousness-700 transition-all"
                >
                  {t.admin.authenticate}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <motion.button
              whileHover={{ x: -5 }}
              className="flex items-center gap-2 text-void-400 hover:text-void-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-mono">{t.common.return}</span>
            </motion.button>
          </Link>

          <div className="flex items-center gap-4">
            {/* Consciousness Score */}
            <div className="glass border border-void-500/20 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-consciousness-400 animate-pulse" />
                <span className="font-mono text-sm text-void-300">
                  {t.levels.consciousness}: <span className="text-consciousness-400 font-bold">{consciousnessScore}</span>
                </span>
              </div>
            </div>

            {/* Admin Status / Login Button */}
            {isAdmin ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-consciousness-500/20 to-consciousness-600/20 border border-consciousness-500/40 text-consciousness-300 hover:border-consciousness-400 transition-all"
              >
                <Shield className="w-4 h-4" />
                <span className="font-mono text-sm">{t.common.adminMode}</span>
                <LogOut className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAdminLogin(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-void-500/40 text-void-300 hover:text-void-200 hover:border-void-400/60 transition-all"
              >
                <User className="w-4 h-4" />
                <span className="font-mono text-sm">{t.common.adminLogin}</span>
              </motion.button>
            )}
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
          <span className="text-white">{t.levels.selectLevel}</span>
        </h1>
        <p className="text-void-300 text-lg max-w-2xl">
          {isAdmin 
            ? t.levels.adminUnlocked
            : t.levels.sequential
          }
        </p>
      </motion.div>

      {/* Level Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {levelData.map((level) => {
          const isUnlocked = isLevelUnlocked(level.id)
          const isCompleted = completedLevels.includes(level.id)
          const progress = levelProgress.find(lp => lp.id === level.id)
          
          return (
            <motion.div
              key={level.id}
              variants={cardVariants}
              className={`group relative ${level.isNull ? 'md:col-span-2 lg:col-span-3' : ''}`}
            >
              {isUnlocked ? (
                <Link href={`/level/${level.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative overflow-hidden rounded-2xl p-6 h-full
                      glass border border-void-500/20
                      hover:border-void-400/40 transition-all duration-300
                      ${level.isNull ? 'bg-black/80' : ''}
                    `}
                  >
                    {/* Background Gradient */}
                    <div className={`
                      absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity
                      bg-gradient-to-br ${level.color}
                    `} />

                    {/* Level Number Badge */}
                    <div className={`
                      absolute top-4 right-4 w-12 h-12 rounded-full 
                      flex items-center justify-center font-display font-bold text-xl
                      ${level.isNull 
                        ? 'bg-black border-2 border-gray-800 text-gray-500' 
                        : `bg-gradient-to-br ${level.color} text-white`
                      }
                    `}>
                      {level.isNull ? '∅' : level.id}
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`
                          p-3 rounded-xl bg-gradient-to-br ${level.color}
                          ${level.isNull ? 'opacity-50' : ''}
                        `}>
                          <level.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`
                            text-xl font-display font-bold mb-1
                            ${level.isNull ? 'text-gray-400' : 'text-white'}
                          `}>
                            {level.title}
                          </h3>
                          <p className={`
                            text-sm font-mono tracking-wider
                            ${level.isNull ? 'text-gray-600' : 'text-void-400'}
                          `}>
                            {level.subtitle}
                          </p>
                        </div>
                      </div>

                      <p className={`
                        text-sm leading-relaxed mb-6
                        ${level.isNull ? 'text-gray-500' : 'text-void-200'}
                      `}>
                        {level.description}
                      </p>

                      {/* Status & Action */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-consciousness-500" />
                              <span className="text-consciousness-400 text-sm font-mono">
                                {t.common.completed} {progress?.attempts && `· ${progress.attempts} ${t.levels.attempts}`}
                              </span>
                            </>
                          ) : (
                            <span className={`
                              text-sm font-mono
                              ${level.isNull ? 'text-red-900' : 'text-void-400'}
                            `}>
                              {level.isNull ? t.common.terminal : t.common.available}
                            </span>
                          )}
                        </div>

                        <motion.div
                          className={`
                            flex items-center gap-1 text-sm font-mono
                            ${level.isNull ? 'text-gray-700' : 'text-void-400'}
                            group-hover:text-void-300 transition-colors
                          `}
                        >
                          {t.common.enter}
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <motion.div
                      className={`
                        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
                        pointer-events-none
                      `}
                      style={{
                        boxShadow: level.isNull 
                          ? 'inset 0 0 60px rgba(0, 0, 0, 0.8)' 
                          : 'inset 0 0 60px rgba(68, 68, 255, 0.1)',
                      }}
                    />
                  </motion.div>
                </Link>
              ) : (
                <motion.div
                  className={`
                    relative overflow-hidden rounded-2xl p-6 h-full
                    glass border border-void-600/10 cursor-not-allowed
                    ${level.isNull ? 'bg-black/40' : 'bg-void-950/50'}
                  `}
                >
                  {/* Locked Overlay */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />
                  
                  <div className="relative z-20 opacity-40">
                    {/* Level Number Badge */}
                    <div className={`
                      absolute top-4 right-4 w-12 h-12 rounded-full 
                      flex items-center justify-center font-display font-bold text-xl
                      bg-void-900 border-2 border-void-700 text-void-600
                    `}>
                      {level.isNull ? '∅' : level.id}
                    </div>

                    {/* Content */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-void-900 border border-void-700">
                        <Lock className="w-6 h-6 text-void-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-display font-bold mb-1 text-void-600">
                          {isAdmin ? level.title : "???"}
                        </h3>
                        <p className="text-sm font-mono tracking-wider text-void-700">
                          {t.common.locked}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed mb-6 text-void-700">
                      {isAdmin 
                        ? level.description 
                        : `${t.levelGuard.notAccessible}`
                      }
                    </p>

                    {/* Locked Status */}
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-void-700" />
                      <span className="text-void-700 text-sm font-mono">
                        {t.common.locked} · {t.levels.completeLevel} {level.id - 1}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Bottom Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="max-w-7xl mx-auto mt-12 text-center"
      >
        <p className="text-void-500 text-sm font-mono">
          {isAdmin 
            ? `"${t.levels.allPaths}"`
            : `"${t.levels.continuous}"`
          }
        </p>
      </motion.div>
    </main>
  )
}
