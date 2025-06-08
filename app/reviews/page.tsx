'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Plus, X, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ShareMenu } from '@/components/ShareMenu'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useReviewFormStore } from '@/store/review-form'
import { MiniKit, VerifyCommandInput, VerificationLevel } from '@worldcoin/minikit-js'

interface ReviewFormData {
  appName: string
  appCategory: string
  ratings: {
    [key: string]: number
  }
  pros: string[]
  cons: string[]
  missingFeatures: string
  recommendation: string
  consultAI: boolean
  createSimilar: boolean
}

const ratingCategories = [
  { id: 'performance', label: 'App Speed and Stability' },
  { id: 'security', label: 'Data Privacy and Safety' },
  { id: 'aiSpecific', label: 'AI Features and Intelligence' },
  { id: 'community', label: 'Community Support' },
  { id: 'economic', label: 'Value for Money' },
  { id: 'useCase', label: 'Real-Life Usefulness' },
  { id: 'innovation', label: 'Originality and Creativity' },
]

const categories = [
  'Image Generation',
  'Text Generation',
  'Audio & Speech',
  'Video Creation',
  'Code Generation',
  'Data Analysis',
  'Productivity Tools',
  'Business Tools'
]

export default function ReviewPage() {
  const router = useRouter()
  const [currentPro, setCurrentPro] = useState('')
  const [currentCon, setCurrentCon] = useState('')
  const [showAIOpinion, setShowAIOpinion] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{type: 'pro'|'con', index: number}|null>(null)

  const { formData, setFormData, clearForm } = useReviewFormStore()

  const {
    register,
    handleSubmit,
    formState: { isDirty, isSubmitting: formIsSubmitting, errors },
    setValue,
    watch
  } = useForm<ReviewFormData>({
    defaultValues: formData
  })

  // Memoized star rating component
  const StarRating = useMemo(() => {
    const StarRatingComponent = ({ categoryId, value }: { categoryId: string, value: number }) => (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(categoryId, star)}
            className={cn(
              "focus:outline-none transition-colors",
              errors?.ratings?.[categoryId] && "animate-shake"
            )}
          >
            <Star
              className={cn(
                'w-6 h-6',
                star <= (value || 0)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              )}
            />
          </button>
        ))}
      </div>
    );
    StarRatingComponent.displayName = 'StarRating';
    return StarRatingComponent;
  }, []);

  const handleAddItem = useCallback((type: 'pro' | 'con') => {
    const current = type === 'pro' ? currentPro : currentCon
    if (current.trim()) {
      const items = watch(type === 'pro' ? 'pros' : 'cons') || []
      if (items.length >= 5) {
        toast.error(`Maximum ${type}s reached`)
        return
      }
      setValue(type === 'pro' ? 'pros' : 'cons', [...items, current.trim()])
      type === 'pro' ? setCurrentPro('') : setCurrentCon('')
    }
  }, [currentPro, currentCon, setValue, watch])

  const handleRemoveItem = useCallback((type: 'pro' | 'con', index: number) => {
    setShowDeleteConfirm({type, index})
  }, [])

  const confirmDelete = useCallback((type: 'pro' | 'con', index: number) => {
    const items = watch(type === 'pro' ? 'pros' : 'cons') || []
    setValue(
      type === 'pro' ? 'pros' : 'cons',
      items.filter((_: string, i: number) => i !== index)
    )
    setShowDeleteConfirm(null)
  }, [setValue, watch])

  // Save form data on change
  const currentFormData = watch()
  useEffect(() => {
    const debouncedSave = setTimeout(() => {
      if (isDirty) {
        setFormData(currentFormData)
      }
    }, 500)
    return () => clearTimeout(debouncedSave)
  }, [currentFormData, isDirty, setFormData])

  const handleRatingChange = (categoryId: string, value: number) => {
    setValue(`ratings.${categoryId}`, value, { shouldDirty: true });
  }

  const handleShare = async (platform: 'twitter' | 'linkedin' | 'facebook' | 'world' | 'warpcast' | 'bluesky' | 'copy') => {
    const shareText = `Check out my review of ${formData.appName} on AICurate!`
    const shareUrl = window.location.href

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        )
        break
      case 'warpcast':
        window.open(
          `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(shareUrl)}`,
          '_blank'
        )
        break
      case 'bluesky':
        window.open(
          `https://bsky.app/intent/compose?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        )
        break
      case 'world':
        // Implement World App sharing logic here
        console.log('Sharing to World App:', { shareText, shareUrl })
        break
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl)
          toast.success('Link copied to clipboard!')
        } catch (error) {
          console.error('Error copying to clipboard:', error)
          toast.error('Failed to copy link')
        }
        break
    }
  }

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitting) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty, isSubmitting])

  // Handle navigation with unsaved changes
  const handleNavigation = useCallback((path: string) => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        clearForm()  // Clear saved data if user confirms leaving
        router.push(path)
      }
    } else {
      router.push(path)
    }
  }, [isDirty, router, clearForm])

  // Clear saved data on successful submit
  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      if (!MiniKit.isInstalled()) {
        throw new Error('Please install World App to continue');
      }

      // Verify with World ID
      const verifyPayload: VerifyCommandInput = {
        action: "submit-review",
        verification_level: VerificationLevel.Orb
      };

      const response = await MiniKit.commandsAsync.verify(verifyPayload);
      
      if (!response || !response.finalPayload) {
        throw new Error("Invalid response from World App");
      }

      const { finalPayload } = response;
      if (finalPayload.status === "error") {
        throw new Error("Verification failed");
      }

      // Verify the proof in the backend
      const verifyResponse = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload,
          action: "submit-review",
          reviewData: data
        }),
      });

      if (!verifyResponse.ok) {
        throw new Error("Backend verification failed");
      }

      // Clear saved data on success
      clearForm();
      toast.success('Review submitted successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = useMemo(() => {
    if (!errors?.ratings) return 0;
    const ratingValues = Object.values(errors.ratings).map(val => Number(val) || 0);
    if (ratingValues.length === 0) return 0;
    const totalSum = ratingValues.reduce((acc, val) => acc + val, 0);
    return totalSum / ratingValues.length;
  }, [errors?.ratings]);

  return (
    <div className="pb-20">
      <header className="p-4 border-b sticky top-0 bg-white z-10 backdrop-blur-lg bg-white/80">
        <h1 className="text-xl font-semibold">AI App Review</h1>
        <p className="text-sm text-gray-600">Rate and review AI tools to help the community</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-6 snap-y snap-mandatory">
        {/* Basic Info */}
        <div className="space-y-4 snap-start">
          <div>
            <label className="block font-medium mb-1">App Name</label>
            <input
              {...register('appName', {
                required: 'App name is required',
                minLength: { value: 2, message: 'App name must be at least 2 characters' },
                maxLength: { value: 50, message: 'App name must be less than 50 characters' }
              })}
              className={cn(
                "w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 touch-manipulation",
                errors.appName && "border-red-500"
              )}
              placeholder="Enter app name"
            />
            {errors.appName && (
              <p className="mt-1 text-sm text-red-500">{errors.appName.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              {...register('appCategory', { required: 'Please select a category' })}
              className={cn(
                "w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 touch-manipulation",
                errors.appCategory && "border-red-500"
              )}
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.appCategory && (
              <p className="mt-1 text-sm text-red-500">{errors.appCategory.message}</p>
            )}
          </div>
        </div>

        {/* AI Consultation */}
        <div className="bg-white rounded-lg border p-4 snap-start">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={showAIOpinion}
              onChange={(e) => setShowAIOpinion(e.target.checked)}
              className="mt-1"
            />
            <div>
              <span className="font-medium">Would you like to consult Madame Dappai&apos;s AI opinion?</span>
              <p className="text-sm text-gray-600">Get AI-powered insights about this app</p>
            </div>
          </label>

          {showAIOpinion && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-blue-50 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  🤖
                </div>
                <h3 className="font-medium">Madame Dappai&apos;s Analysis</h3>
              </div>
              <p className="text-sm text-blue-800">
                Based on my analysis of thousands of reviews and usage patterns, this app shows strong potential with notable strengths in [features]. Users particularly appreciate [specific aspect], though there&apos;s room for improvement in [area].
              </p>
              <button className="text-sm text-blue-600 mt-2 hover:underline">
                Read full analysis →
              </button>
            </motion.div>
          )}
        </div>

        {/* Ratings */}
        <div className="space-y-6 snap-start">
          <h3 className="font-medium">Ratings</h3>
          {ratingCategories.map(category => (
            <div key={category.id} className="flex flex-col gap-2">
              <label className="text-sm">{category.label} (1-5 stars)</label>
              <StarRating
                categoryId={category.id}
                value={(formData?.ratings?.[category.id] || 0)}
              />
            </div>
          ))}
        </div>

        {/* Pros & Cons */}
        <div className="space-y-4 snap-start">
          <div>
            <label className="block font-medium mb-2">Pros</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentPro}
                onChange={(e) => setCurrentPro(e.target.value)}
                className="flex-1 p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                placeholder="Add a pro"
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem('pro')}
              />
              <button
                type="button"
                onClick={() => handleAddItem('pro')}
                className="p-3 text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {(formData.pros || []).map((pro: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                  <span className="flex-1 text-sm">{pro}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('pro', index)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Cons</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentCon}
                onChange={(e) => setCurrentCon(e.target.value)}
                className="flex-1 p-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                placeholder="Add a con"
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem('con')}
              />
              <button
                type="button"
                onClick={() => handleAddItem('con')}
                className="p-3 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {(formData.cons || []).map((con: string, index: number) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                  <span className="flex-1 text-sm">{con}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('con', index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Feedback */}
        <div className="space-y-4 snap-start">
          <div>
            <label className="block font-medium mb-2">Would you recommend it?</label>
            <textarea
              {...register('recommendation', {
                required: 'Recommendation is required',
                minLength: { value: 10, message: 'Recommendation must be at least 10 characters' },
                maxLength: { value: 500, message: 'Recommendation must be less than 500 characters' }
              })}
              className={cn(
                "w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500",
                errors.recommendation && "border-red-500"
              )}
              rows={3}
              placeholder="Share your recommendation..."
              required
            />
            {errors.recommendation && (
              <p className="mt-1 text-sm text-red-500">{errors.recommendation.message}</p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-2">What features would you add or are missing?</label>
            <textarea
              {...register('missingFeatures', {
                minLength: { value: 10, message: 'Missing features must be at least 10 characters' },
                maxLength: { value: 500, message: 'Missing features must be less than 500 characters' }
              })}
              className={cn(
                "w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500",
                errors.missingFeatures && "border-red-500"
              )}
              rows={3}
              placeholder="Suggest missing features..."
            />
            {errors.missingFeatures && (
              <p className="mt-1 text-sm text-red-500">{errors.missingFeatures.message}</p>
            )}
          </div>
        </div>

        {/* Create Similar App */}
        <div className="bg-purple-50 rounded-lg p-4 snap-start">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.createSimilar}
              onChange={(e) => setValue('createSimilar', e.target.checked)}
              className="mt-1"
            />
            <div>
              <span className="font-medium">Would you like to create a similar app?</span>
              <p className="text-sm text-gray-600">Get started with your own AI app</p>
            </div>
          </label>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-sm w-full mx-4">
              <h3 className="text-lg font-medium mb-2">Delete {showDeleteConfirm.type}?</h3>
              <p className="text-gray-600 mb-4">Are you sure you want to delete this item?</p>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => confirmDelete(showDeleteConfirm.type, showDeleteConfirm.index)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-white/80 border-t backdrop-blur-lg">
          <div className="flex gap-2 max-w-screen-sm mx-auto">
            <button
              type="submit"
              disabled={formIsSubmitting}
              className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 active:scale-[0.98] transition-transform touch-manipulation"
            >
              {formIsSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Submitting...
                </span>
              ) : (
                'Submit Review'
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowShareOptions(prev => !prev)}
              className="p-3 bg-green-600 text-white rounded-lg active:scale-[0.98] transition-transform touch-manipulation"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
      
      <ShareMenu
        isOpen={showShareOptions}
        onClose={() => setShowShareOptions(false)}
        onShare={handleShare}
      />
    </div>
  )
} 