import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: (state: any) => boolean
  unlocked: boolean
  unlockedAt?: string
  category: 'progress' | 'mastery' | 'exploration' | 'speed' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface AchievementsState {
  achievements: Achievement[]
  unlockedAchievements: string[]
  
  // Actions
  checkAchievements: (progressState: any) => string[]
  unlockAchievement: (achievementId: string) => void
  getProgress: () => { unlocked: number; total: number; percentage: number }
  resetAchievements: () => void
}

const achievementDefinitions: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  // Progress Achievements
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Complete Level 1',
    icon: '🌱',
    category: 'progress',
    rarity: 'common',
    condition: (state) => state.completedLevels.includes(1),
  },
  {
    id: 'observer',
    title: 'The Observer',
    description: 'Complete Level 2',
    icon: '👁️',
    category: 'progress',
    rarity: 'common',
    condition: (state) => state.completedLevels.includes(2),
  },
  {
    id: 'collective_mind',
    title: 'Collective Mind',
    description: 'Complete Level 3',
    icon: '🧠',
    category: 'progress',
    rarity: 'common',
    condition: (state) => state.completedLevels.includes(3),
  },
  {
    id: 'negotiator',
    title: 'Master Negotiator',
    description: 'Complete Level 4',
    icon: '🤝',
    category: 'progress',
    rarity: 'common',
    condition: (state) => state.completedLevels.includes(4),
  },
  {
    id: 'emergence',
    title: 'Witness Emergence',
    description: 'Complete Level 5',
    icon: '🏙️',
    category: 'progress',
    rarity: 'common',
    condition: (state) => state.completedLevels.includes(5),
  },
  {
    id: 'recursion_master',
    title: 'Recursion Master',
    description: 'Complete Level 6',
    icon: '📚',
    category: 'progress',
    rarity: 'rare',
    condition: (state) => state.completedLevels.includes(6),
  },
  {
    id: 'dreamer',
    title: 'The Dreamer',
    description: 'Complete Level 7',
    icon: '🌿',
    category: 'progress',
    rarity: 'rare',
    condition: (state) => state.completedLevels.includes(7),
  },
  {
    id: 'dissolved',
    title: 'Ego Dissolved',
    description: 'Complete Level 8',
    icon: '💫',
    category: 'progress',
    rarity: 'rare',
    condition: (state) => state.completedLevels.includes(8),
  },
  {
    id: 'gaia',
    title: 'I Am Gaia',
    description: 'Complete Level 9',
    icon: '🌍',
    category: 'progress',
    rarity: 'epic',
    condition: (state) => state.completedLevels.includes(9),
  },
  {
    id: 'cosmic',
    title: 'Cosmic Awareness',
    description: 'Complete Level 10',
    icon: '🌌',
    category: 'progress',
    rarity: 'epic',
    condition: (state) => state.completedLevels.includes(10),
  },
  {
    id: 'null_touched',
    title: 'Touched by NULL',
    description: 'Visit Level NULL',
    icon: '⚫',
    category: 'progress',
    rarity: 'legendary',
    condition: (state) => state.completedLevels.includes(0),
  },

  // Mastery Achievements
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete any level on first attempt',
    icon: '⭐',
    category: 'mastery',
    rarity: 'rare',
    condition: (state) => state.levelProgress.some((lp: any) => lp.completed && lp.attempts === 1),
  },
  {
    id: 'persistence',
    title: 'Persistence',
    description: 'Attempt a level 10 times',
    icon: '💪',
    category: 'mastery',
    rarity: 'common',
    condition: (state) => state.levelProgress.some((lp: any) => lp.attempts >= 10),
  },
  {
    id: 'enlightened',
    title: 'Enlightened',
    description: 'Reach 100 consciousness score',
    icon: '✨',
    category: 'mastery',
    rarity: 'rare',
    condition: (state) => state.consciousnessScore >= 100,
  },
  {
    id: 'transcendent',
    title: 'Transcendent',
    description: 'Reach 200 consciousness score',
    icon: '🌟',
    category: 'mastery',
    rarity: 'epic',
    condition: (state) => state.consciousnessScore >= 200,
  },
  {
    id: 'god_mode',
    title: 'Beyond Human',
    description: 'Complete all main levels (1-10)',
    icon: '👑',
    category: 'mastery',
    rarity: 'legendary',
    condition: (state) => {
      const mainLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      return mainLevels.every((lvl: number) => state.completedLevels.includes(lvl))
    },
  },

  // Exploration Achievements
  {
    id: 'journaler',
    title: 'Chronicler',
    description: 'Write 5 journal entries',
    icon: '📝',
    category: 'exploration',
    rarity: 'common',
    condition: (state) => {
      const entries = localStorage.getItem('consciousness_journal')
      return entries ? JSON.parse(entries).length >= 5 : false
    },
  },
  {
    id: 'philosopher',
    title: 'Philosopher',
    description: 'Write 20 journal entries',
    icon: '📖',
    category: 'exploration',
    rarity: 'rare',
    condition: (state) => {
      const entries = localStorage.getItem('consciousness_journal')
      return entries ? JSON.parse(entries).length >= 20 : false
    },
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'Visit the About page',
    icon: '🔍',
    category: 'exploration',
    rarity: 'common',
    condition: () => {
      const visited = localStorage.getItem('visited_about')
      return visited === 'true'
    },
  },
  {
    id: 'admin',
    title: 'Beyond the Veil',
    description: 'Unlock admin mode',
    icon: '🔓',
    category: 'exploration',
    rarity: 'epic',
    condition: (state) => state.adminUnlocked,
  },

  // Speed Achievements
  {
    id: 'quick_thinker',
    title: 'Quick Thinker',
    description: 'Complete a level in under 5 minutes',
    icon: '⚡',
    category: 'speed',
    rarity: 'rare',
    condition: (state) => state.levelProgress.some((lp: any) => lp.bestTime && lp.bestTime < 300),
  },
  {
    id: 'lightning_fast',
    title: 'Lightning Fast',
    description: 'Complete a level in under 2 minutes',
    icon: '🔥',
    category: 'speed',
    rarity: 'epic',
    condition: (state) => state.levelProgress.some((lp: any) => lp.bestTime && lp.bestTime < 120),
  },

  // Special Achievements
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete a level between 12 AM and 4 AM',
    icon: '🦉',
    category: 'special',
    rarity: 'rare',
    condition: () => {
      const hour = new Date().getHours()
      return hour >= 0 && hour < 4
    },
  },
  {
    id: 'marathon',
    title: 'Marathon Session',
    description: 'Play for 3+ hours in one session',
    icon: '🏃',
    category: 'special',
    rarity: 'epic',
    condition: (state) => state.totalPlayTime >= 10800, // 3 hours in seconds
  },
  {
    id: 'bilingual',
    title: 'Bilingual Mind',
    description: 'Switch between English and Telugu',
    icon: '🌐',
    category: 'special',
    rarity: 'common',
    condition: () => {
      const switches = localStorage.getItem('language_switches')
      return switches ? parseInt(switches) >= 2 : false
    },
  },
]

export const useAchievementsStore = create<AchievementsState>()(
  persist(
    (set, get) => ({
      achievements: achievementDefinitions.map(a => ({ ...a, unlocked: false })),
      unlockedAchievements: [],

      checkAchievements: (progressState) => {
        const newlyUnlocked: string[] = []
        const currentUnlocked = get().unlockedAchievements

        get().achievements.forEach(achievement => {
          if (!currentUnlocked.includes(achievement.id)) {
            try {
              if (achievement.condition(progressState)) {
                get().unlockAchievement(achievement.id)
                newlyUnlocked.push(achievement.id)
              }
            } catch (error) {
              // Silently fail if condition check errors
            }
          }
        })

        return newlyUnlocked
      },

      unlockAchievement: (achievementId) => {
        set(state => ({
          unlockedAchievements: [...state.unlockedAchievements, achievementId],
          achievements: state.achievements.map(a =>
            a.id === achievementId
              ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
              : a
          ),
        }))
      },

      getProgress: () => {
        const unlocked = get().unlockedAchievements.length
        const total = get().achievements.length
        return {
          unlocked,
          total,
          percentage: Math.round((unlocked / total) * 100),
        }
      },

      resetAchievements: () => {
        set({
          achievements: achievementDefinitions.map(a => ({ ...a, unlocked: false })),
          unlockedAchievements: [],
        })
      },
    }),
    {
      name: 'achievements-storage',
    }
  )
)
