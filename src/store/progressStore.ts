import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LevelProgress {
  id: number
  completed: boolean
  attempts: number
  bestTime?: number
  choices: string[]
  unlockedAt?: string
}

export interface ProgressState {
  currentLevel: number
  completedLevels: number[]
  levelProgress: LevelProgress[]
  consciousnessScore: number
  totalPlayTime: number
  startedAt: string | null
  isAdmin: boolean
  adminUnlocked: boolean
  
  // Actions
  setCurrentLevel: (level: number) => void
  completeLevel: (levelId: number, time?: number) => void
  recordChoice: (levelId: number, choice: string) => void
  incrementAttempts: (levelId: number) => void
  updateConsciousnessScore: (delta: number) => void
  resetProgress: () => void
  verifyAdminPassword: (password: string) => boolean
  isLevelUnlocked: (levelId: number) => boolean
  logout: () => void
}

const initialLevelProgress: LevelProgress[] = Array.from({ length: 11 }, (_, i) => ({
  id: i,
  completed: false,
  attempts: 0,
  choices: [],
  unlockedAt: i === 0 || i === 1 ? new Date().toISOString() : undefined, // Level 0 and 1 unlocked by default
}))

const ADMIN_PASSWORD = '9912885974familycomplete'

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      currentLevel: 1,
      completedLevels: [],
      levelProgress: initialLevelProgress,
      consciousnessScore: 0,
      totalPlayTime: 0,
      startedAt: null,
      isAdmin: false,
      adminUnlocked: false,

      setCurrentLevel: (level) => set({ currentLevel: level }),

      completeLevel: (levelId, time) => {
        const { completedLevels, levelProgress } = get()
        
        if (!completedLevels.includes(levelId)) {
          const updatedProgress = levelProgress.map((lp) =>
            lp.id === levelId
              ? { ...lp, completed: true, bestTime: time || lp.bestTime }
              : lp
          )

          // Unlock next level for regular users
          const nextLevelId = levelId + 1
          if (nextLevelId <= 10) {
            updatedProgress[nextLevelId] = {
              ...updatedProgress[nextLevelId],
              unlockedAt: new Date().toISOString()
            }
          }
          
          set({
            completedLevels: [...completedLevels, levelId],
            levelProgress: updatedProgress,
            consciousnessScore: get().consciousnessScore + (levelId === 0 ? 100 : levelId * 10),
          })

          // Award hint points for completion
          if (typeof window !== 'undefined') {
            try {
              const hintsStore = require('./hintsStore').useHintsStore.getState()
              hintsStore.earnHintPoints(30)
            } catch (e) {
              // Store not available
            }
          }
        }
      },

      recordChoice: (levelId, choice) => {
        const { levelProgress } = get()
        set({
          levelProgress: levelProgress.map((lp) =>
            lp.id === levelId
              ? { ...lp, choices: [...lp.choices, choice] }
              : lp
          ),
        })
      },

      incrementAttempts: (levelId) => {
        const { levelProgress } = get()
        set({
          levelProgress: levelProgress.map((lp) =>
            lp.id === levelId
              ? { ...lp, attempts: lp.attempts + 1 }
              : lp
          ),
        })
      },

      updateConsciousnessScore: (delta) => {
        set({ consciousnessScore: Math.max(0, get().consciousnessScore + delta) })
      },

      resetProgress: () => {
        const { adminUnlocked } = get()
        set({
          currentLevel: 1,
          completedLevels: [],
          levelProgress: initialLevelProgress,
          consciousnessScore: 0,
          totalPlayTime: 0,
          startedAt: null,
          isAdmin: adminUnlocked, // Preserve admin status
        })
      },

      verifyAdminPassword: (password) => {
        const isValid = password === ADMIN_PASSWORD
        if (isValid) {
          // Unlock all levels for admin
          const allUnlocked = Array.from({ length: 11 }, (_, i) => ({
            id: i,
            completed: false,
            attempts: 0,
            choices: [],
            unlockedAt: new Date().toISOString(),
          }))
          
          set({ 
            isAdmin: true, 
            adminUnlocked: true,
            levelProgress: allUnlocked 
          })
        }
        return isValid
      },

      isLevelUnlocked: (levelId) => {
        const { isAdmin, levelProgress } = get()
        if (isAdmin) return true
        
        const level = levelProgress.find(lp => lp.id === levelId)
        return level?.unlockedAt !== undefined
      },

      logout: () => {
        set({ isAdmin: false })
      },
    }),
    {
      name: 'solve-null-progress',
    }
  )
)
