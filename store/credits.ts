import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CreditsStore {
  credits: number
  setCredits: (credits: number) => void
  addCredits: (amount: number) => void
  deductCredit: () => void
}

export const useCreditsStore = create<CreditsStore>()(
  persist(
    (set) => ({
      credits: 5, // Initial free credits
      setCredits: (credits) => set({ credits }),
      addCredits: (amount) => set((state) => ({ credits: state.credits + amount })),
      deductCredit: () => set((state) => ({ credits: state.credits - 1 })),
    }),
    {
      name: 'ai-credits',
    }
  )
) 