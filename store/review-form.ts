import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ReviewFormData {
  appName?: string
  appCategory?: string
  ratings?: {
    [key: string]: number
  }
  pros?: string[]
  cons?: string[]
  missingFeatures?: string
  recommendation?: string
  consultAI?: boolean
  createSimilar?: boolean
}

interface ReviewFormStore {
  formData: ReviewFormData
  setFormData: (data: Partial<ReviewFormData>) => void
  clearForm: () => void
}

export const useReviewFormStore = create<ReviewFormStore>()(
  persist(
    (set) => ({
      formData: {},
      setFormData: (data) => set((state) => ({
        formData: { ...state.formData, ...data }
      })),
      clearForm: () => set({ formData: {} })
    }),
    {
      name: 'review-form-data'
    }
  )
) 