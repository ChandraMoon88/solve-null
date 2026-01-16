'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  onClick?: () => void
}

export function GlassCard({ children, className, hover = false, glow = false, onClick }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        'glass rounded-xl p-6 border border-void-500/20 transition-all',
        hover && 'cursor-pointer hover:border-void-400/40',
        glow && 'border-glow',
        className
      )}
    >
      {children}
    </motion.div>
  )
}

interface ProgressBarProps {
  value: number
  max?: number
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
  className?: string
}

export function ProgressBar({ 
  value, 
  max = 100, 
  color = 'blue', 
  size = 'md',
  showLabel = false,
  label,
  className 
}: ProgressBarProps) {
  const percentage = Math.min(100, (value / max) * 100)
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    gradient: 'bg-gradient-to-r from-void-500 to-consciousness-500',
  }

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  }

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-void-400">{label || 'Progress'}</span>
          <span className="text-white font-mono">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('bg-void-800 rounded-full overflow-hidden', sizeClasses[size])}>
        <motion.div
          className={cn('h-full rounded-full', colorClasses[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral'
  children: React.ReactNode
  className?: string
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
  const statusClasses = {
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    neutral: 'bg-void-500/20 text-void-300 border-void-500/30',
  }

  return (
    <span className={cn(
      'px-3 py-1 rounded-full text-xs font-mono uppercase border',
      statusClasses[status],
      className
    )}>
      {children}
    </span>
  )
}

interface IconButtonProps {
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'default' | 'primary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function IconButton({ 
  icon, 
  onClick, 
  disabled = false, 
  variant = 'default',
  size = 'md',
  className 
}: IconButtonProps) {
  const variantClasses = {
    default: 'glass hover:bg-void-700/50 text-void-400 hover:text-white',
    primary: 'bg-void-600 hover:bg-void-500 text-white',
    danger: 'bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300',
  }

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : undefined}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-lg transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {icon}
    </motion.button>
  )
}

interface TypingTextProps {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}

export function TypingText({ text, speed = 50, className, onComplete }: TypingTextProps) {
  return (
    <motion.span
      className={cn('inline-block', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * (speed / 1000) }}
          onAnimationComplete={index === text.length - 1 ? onComplete : undefined}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

interface PulsingDotProps {
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function PulsingDot({ color = 'bg-consciousness-500', size = 'md', className }: PulsingDotProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  return (
    <span className={cn('relative flex', sizeClasses[size], className)}>
      <span className={cn(
        'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
        color
      )} />
      <span className={cn(
        'relative inline-flex rounded-full h-full w-full',
        color
      )} />
    </span>
  )
}

interface ConsciousnessMeterProps {
  level: number
  maxLevel?: number
  showLabel?: boolean
  className?: string
}

export function ConsciousnessMeter({ 
  level, 
  maxLevel = 100, 
  showLabel = true,
  className 
}: ConsciousnessMeterProps) {
  const percentage = (level / maxLevel) * 100

  const getColor = () => {
    if (percentage >= 80) return 'from-consciousness-500 to-consciousness-400'
    if (percentage >= 60) return 'from-blue-500 to-cyan-500'
    if (percentage >= 40) return 'from-yellow-500 to-orange-500'
    if (percentage >= 20) return 'from-orange-500 to-red-500'
    return 'from-red-600 to-red-500'
  }

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-void-400 font-mono">CONSCIOUSNESS</span>
          <span className="text-white font-mono">{level}/{maxLevel}</span>
        </div>
      )}
      <div className="h-3 bg-void-800 rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full bg-gradient-to-r', getColor())}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
