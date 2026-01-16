'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Sparkles, Target, Trophy, Lightbulb, Languages } from 'lucide-react'

export default function WelcomeTour() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('seen_welcome_tour')
    if (!hasSeenTour) {
      // Show tour after a short delay
      setTimeout(() => setIsOpen(true), 1000)
    }
  }, [])

  const steps = [
    {
      title: 'Welcome to SOLVE NULL',
      description: 'This is not traditional entertainment. It\'s a consciousness evolution protocol—a journey through increasingly complex philosophical challenges designed to transform how you think.',
      icon: Sparkles,
      color: 'from-consciousness-500 to-purple-600',
    },
    {
      title: 'Progressive Challenges',
      description: 'Complete levels sequentially to unlock the next stage. Each level tests different aspects of consciousness, from logical challenges to cosmic awareness.',
      icon: Target,
      color: 'from-emerald-500 to-green-600',
    },
    {
      title: 'Achievements & Progress',
      description: 'Track your journey with achievements, consciousness scores, and detailed statistics. Every level completed brings you closer to understanding.',
      icon: Trophy,
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'Hints System',
      description: 'Stuck on a level? Use hint points to unlock guidance. Earn more points by completing levels and making progress. Use them wisely!',
      icon: Lightbulb,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      title: 'Bilingual Support',
      description: 'Switch between English and Telugu anytime using the language switcher in the top-right corner. Your progress is saved automatically.',
      icon: Languages,
      color: 'from-pink-500 to-rose-600',
    },
  ]

  const handleComplete = () => {
    localStorage.setItem('seen_welcome_tour', 'true')
    setIsOpen(false)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const step = steps[currentStep]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            className="glass border-2 border-consciousness-500/40 rounded-3xl p-8 max-w-2xl w-full"
          >
            {/* Close Button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 p-2 hover:bg-void-800/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-void-400" />
            </button>

            {/* Icon */}
            <motion.div
              key={currentStep}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center`}
            >
              <step.icon className="w-10 h-10 text-white" />
            </motion.div>

            {/* Content */}
            <motion.div
              key={`content-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-display font-bold text-white mb-4">
                {step.title}
              </h2>
              <p className="text-void-300 text-lg leading-relaxed">
                {step.description}
              </p>
            </motion.div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-consciousness-500'
                      : 'w-2 bg-void-600 hover:bg-void-500'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-void-400 hover:text-white hover:bg-void-800/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-semibold">Previous</span>
              </button>

              <button
                onClick={handleSkip}
                className="px-4 py-2 text-void-500 hover:text-void-300 transition-colors"
              >
                Skip Tour
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-consciousness-500 to-purple-600 text-white font-semibold hover:from-consciousness-600 hover:to-purple-700 transition-all"
              >
                <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Step Counter */}
            <p className="text-center mt-4 text-void-600 text-sm font-mono">
              Step {currentStep + 1} of {steps.length}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
