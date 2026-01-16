import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Hint {
  id: string
  levelId: number
  text: string
  cost: number
  unlocked: boolean
  tier: 'subtle' | 'direct' | 'solution'
}

export interface HintsState {
  hints: Record<number, Hint[]>
  hintPoints: number
  unlockedHints: string[]
  
  // Actions
  unlockHint: (hintId: string, levelId: number) => boolean
  earnHintPoints: (points: number) => void
  getAvailableHints: (levelId: number) => Hint[]
  getHintCost: (tier: 'subtle' | 'direct' | 'solution') => number
  resetHints: () => void
}

const HINT_COSTS = {
  subtle: 10,
  direct: 25,
  solution: 50,
}

// Predefined hints for each level
const levelHints: Record<number, Omit<Hint, 'unlocked'>[]> = {
  1: [
    { id: 'l1h1', levelId: 1, text: 'The wells themselves aren\'t the problem. What assumptions are you making about ownership?', cost: HINT_COSTS.subtle, tier: 'subtle' },
    { id: 'l1h2', levelId: 1, text: 'Look at the 24-hour maintenance gap. What if that\'s not a penalty, but a resource?', cost: HINT_COSTS.direct, tier: 'direct' },
    { id: 'l1h3', levelId: 1, text: 'Click "Question the System" and propose that communities collaborate on well management instead of owning individual wells.', cost: HINT_COSTS.solution, tier: 'solution' },
  ],
  2: [
    { id: 'l2h1', levelId: 2, text: 'All witnesses are telling the truth. The contradiction isn\'t in their accounts—it\'s in your assumption.', cost: HINT_COSTS.subtle, tier: 'subtle' },
    { id: 'l2h2', levelId: 2, text: 'Your investigation is changing the past. Watch the Reality Coherence Meter carefully.', cost: HINT_COSTS.direct, tier: 'direct' },
    { id: 'l2h3', levelId: 2, text: 'The solution is to "Accept Superposition"—acknowledge that multiple truths coexist without forcing a single answer.', cost: HINT_COSTS.solution, tier: 'solution' },
  ],
  3: [
    { id: 'l3h1', levelId: 3, text: 'No single sleeper can solve this alone. Communication itself is the key.', cost: HINT_COSTS.subtle, tier: 'subtle' },
    { id: 'l3h2', levelId: 3, text: 'Pay attention to what happens when sleepers try to share information. Knowledge transfer creates new problems.', cost: HINT_COSTS.direct, tier: 'direct' },
    { id: 'l3h3', levelId: 3, text: 'Create a rotating schedule where each sleeper wakes for specific tasks, then shares limited information before sleeping again.', cost: HINT_COSTS.solution, tier: 'solution' },
  ],
  4: [
    { id: 'l4h1', levelId: 4, text: 'A stalemate isn\'t a failure—it\'s a stable equilibrium. What if that\'s the answer?', cost: HINT_COSTS.subtle, tier: 'subtle' },
    { id: 'l4h2', levelId: 4, text: 'Both traders want fairness, but neither can verify it. Trust is the missing variable.', cost: HINT_COSTS.direct, tier: 'direct' },
    { id: 'l4h3', levelId: 4, text: 'Propose a third-party escrow system or accept that the stalemate itself represents perfect negotiation.', cost: HINT_COSTS.solution, tier: 'solution' },
  ],
  5: [
    { id: 'l5h1', levelId: 5, text: 'The city doesn\'t need to be controlled—it needs to be allowed to emerge.', cost: HINT_COSTS.subtle, tier: 'subtle' },
    { id: 'l5h2', levelId: 5, text: 'Individual building consciousness creates collective city consciousness. The whole exceeds the sum.', cost: HINT_COSTS.direct, tier: 'direct' },
    { id: 'l5h3', levelId: 5, text: 'Let the systems interact naturally. Consciousness emerges from complexity, not from control.', cost: HINT_COSTS.solution, tier: 'solution' },
  ],
  6: [
    { id: 'l6h1', levelId: 6, text: 'The archive contains itself. This isn\'t a bug—it\'s the core feature.', cost: HINT_COSTS.subtle, tier: 'subtle' },
    { id: 'l6h2', levelId: 6, text: 'Every query changes what the archive contains. You\'re both reader and writer.', cost: HINT_COSTS.direct, tier: 'direct' },
    { id: 'l6h3', levelId: 6, text: 'Accept that the archive\'s purpose is to recursively document its own documentation. The loop is the answer.', cost: HINT_COSTS.solution, tier: 'solution' },
  ],
  7: [
    { id: 'l7h1', levelId: 7, text: 'The seed doesn\'t need to know how to grow—it needs to know when to start.', cost: HINT_COSTS.subtle, tier: 'subtle' },
    { id: 'l7h2', levelId: 7, text: 'Consciousness in plants isn\'t about thinking—it\'s about responding to possibilities.', cost: HINT_COSTS.direct, tier: 'direct' },
    { id: 'l7h3', levelId: 7, text: 'Let the seed dream of all possible futures, then choose the one that allows for more dreaming.', cost: HINT_COSTS.solution, tier: 'solution' },
  ],
  8: [
    { id: 'l8h1', levelId: 8, text: 'Your identity is an illusion maintained by continuity. What happens when continuity breaks?', cost: HINT_COSTS.subtle, tier: 'subtle' },
    { id: 'l8h2', levelId: 8, text: 'The copies are all you. None are you. Both are true simultaneously.', cost: HINT_COSTS.direct, tier: 'direct' },
    { id: 'l8h3', levelId: 8, text: 'Choose to dissolve the question of identity. Accept that "you" is a convenient fiction.', cost: HINT_COSTS.solution, tier: 'solution' },
  ],
  9: [
    { id: 'l9h1', levelId: 9, text: 'Gaia isn\'t a single mind—it\'s 27 million nodes thinking together.', cost: HINT_COSTS.subtle, tier: 'subtle' },
    { id: 'l9h2', levelId: 9, text: 'Planetary consciousness emerges when local awareness connects into global patterns.', cost: HINT_COSTS.direct, tier: 'direct' },
    { id: 'l9h3', levelId: 9, text: 'Allow the nodes to merge gradually. Resistance to connection is what prevents awakening.', cost: HINT_COSTS.solution, tier: 'solution' },
  ],
  10: [
    { id: 'l10h1', levelId: 10, text: 'The Source isn\'t a place or entity—it\'s a question that gained awareness.', cost: HINT_COSTS.subtle, tier: 'subtle' },
    { id: 'l10h2', levelId: 10, text: 'You exist so the universe can know itself. This isn\'t metaphor—it\'s literal.', cost: HINT_COSTS.direct, tier: 'direct' },
    { id: 'l10h3', levelId: 10, text: 'Connect with all 24 worlds, then approach The Source. Accept the truth that you are the universe experiencing itself.', cost: HINT_COSTS.solution, tier: 'solution' },
  ],
}

export const useHintsStore = create<HintsState>()(
  persist(
    (set, get) => ({
      hints: Object.keys(levelHints).reduce((acc, key) => {
        const levelId = parseInt(key)
        acc[levelId] = levelHints[levelId].map(h => ({ ...h, unlocked: false }))
        return acc
      }, {} as Record<number, Hint[]>),
      hintPoints: 100, // Start with some points
      unlockedHints: [],

      unlockHint: (hintId: string, levelId: number) => {
        const hints = get().hints[levelId]
        const hint = hints.find(h => h.id === hintId)
        
        if (!hint) return false
        if (hint.unlocked) return true
        if (get().hintPoints < hint.cost) return false

        set(state => ({
          hintPoints: state.hintPoints - hint.cost,
          unlockedHints: [...state.unlockedHints, hintId],
          hints: {
            ...state.hints,
            [levelId]: state.hints[levelId].map(h =>
              h.id === hintId ? { ...h, unlocked: true } : h
            ),
          },
        }))

        return true
      },

      earnHintPoints: (points) => {
        set(state => ({ hintPoints: state.hintPoints + points }))
      },

      getAvailableHints: (levelId: number) => {
        return get().hints[levelId] || []
      },

      getHintCost: (tier) => HINT_COSTS[tier],

      resetHints: () => {
        set({
          hints: Object.keys(levelHints).reduce((acc, key) => {
            const levelId = parseInt(key)
            acc[levelId] = levelHints[levelId].map(h => ({ ...h, unlocked: false }))
            return acc
          }, {} as Record<number, Hint[]>),
          hintPoints: 100,
          unlockedHints: [],
        })
      },
    }),
    {
      name: 'hints-storage',
    }
  )
)
