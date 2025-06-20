import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CreditsStore {
  credits: number
  maxCredits: number
  setCredits: (credits: number) => void
  addCredits: (amount: number) => void
  deductCredit: () => void
}

export const useCreditsStore = create<CreditsStore>()(
  persist(
    (set) => ({
      credits: 5, // Initial free credits
      maxCredits: 5, // Track highest number of credits ever had
      setCredits: (credits) => set((state) => ({ 
        credits, 
        maxCredits: Math.max(credits, state.maxCredits) 
      })),
      addCredits: (amount) => set((state) => ({ 
        credits: state.credits + amount,
        maxCredits: Math.max(state.credits + amount, state.maxCredits)
      })),
      deductCredit: () => set((state) => ({ 
        credits: state.credits - 1,
        maxCredits: state.maxCredits // Keep max unchanged when deducting
      })),
    }),
    {
      name: 'ai-credits',
    }
  )
) 