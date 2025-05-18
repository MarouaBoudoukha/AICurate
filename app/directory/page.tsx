'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { AiConsultation } from '@/components/AiConsultation'
import { motion } from 'framer-motion'
import { Search, Bot, Sparkles, Star, ChevronRight } from 'lucide-react'
import { debounce } from 'lodash'
import Image from 'next/image'

interface AppCategory {
  id: string
  name: string
  description: string
  icon: string
}

interface AppDetails {
  id: string
  name: string
  description: string
  logo: string
  website: string
  category: string
  rating: number
  reviewCount: number
  pricing: {
    type: string
    price: string
    features: string[]
  }[]
  features: {
    title: string
    example: string
    scenario: string
  }[]
  userTypes: {
    type: string
    description: string
  }[]
  howToUse: {
    step: number
    title: string
    description: string
  }[]
  stats: AppStats
  reviews: AppReview[]
  alternatives: {
    name: string
    description: string
  }[]
  faq: {
    question: string
    answer: string
  }[]
}

interface AppStats {
  monthlyVisits: number
  avgVisitDuration: string
  pagesPerVisit: number
  bounceRate: number
  geography: {
    country: string
    percentage: number
  }[]
  trafficSources: {
    source: string
    percentage: number
  }[]
}

interface AppReview {
  id: string
  rating: number
  author: string
  date: string
  content: string
  pros: string[]
  cons: string[]
  verified: boolean
}

export default function MadameDappai() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedApp, setSelectedApp] = useState<AppDetails | null>(null)
  const [isSubmittingApp, setIsSubmittingApp] = useState(false)
  const [showConsultation, setShowConsultation] = useState(false)
  const [username, setUsername] = useState<string>('Explorer')

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem('username')
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  // Debounce search input
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value)
    }, 300),
    []
  )

  // Cleanup function for debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }, [debouncedSearch])

  // Memoize the featured apps data
  const featuredApps = useMemo(() => [
    {
      name: 'ChatGPT',
      description: 'Leading conversational AI model',
      rating: 4.9,
      reviews: 2500,
      icon: '💬',
      category: 'Text Generation'
    },
    {
      name: 'Midjourney',
      description: 'Advanced AI image generation',
      rating: 4.8,
      reviews: 1800,
      icon: '🎨',
      category: 'Image Generation'
    },
    {
      name: 'Claude',
      description: 'Intelligent AI assistant',
      rating: 4.7,
      reviews: 1200,
      icon: '🤖',
      category: 'Text Generation'
    }
  ], []) // Empty dependency array since this data is static

  // Filter apps based on search query and category
  const filteredApps = useMemo(() => {
    return featuredApps.filter(app => {
      const matchesSearch = searchQuery === '' || 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = !selectedCategory || 
        app.category.toLowerCase() === selectedCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, featuredApps])

  const categories: AppCategory[] = [
    {
      id: 'image',
      name: 'Image Generation',
      description: 'Create, edit, and enhance images with AI',
      icon: '🎨'
    },
    {
      id: 'video',
      name: 'Video Creation',
      description: 'Generate and edit videos using AI',
      icon: '🎥'
    },
    {
      id: 'audio',
      name: 'Audio & Voice',
      description: 'Voice synthesis and audio processing',
      icon: '🎵'
    },
    {
      id: 'writing',
      name: 'Writing & Content',
      description: 'Content generation and writing assistance',
      icon: '✍️'
    },
    {
      id: 'productivity',
      name: 'Productivity',
      description: 'AI-powered tools to boost productivity',
      icon: '⚡'
    }
  ]

  return (
    <div className="h-full flex flex-col">
      <header className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-4 mb-3">
          <div className="relative w-16 h-16">
            <Image
              src="/madamdappai.jpg"
              alt="Madame DAPP.AI"
              fill
              className="object-cover rounded-full"
              sizes="64px"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold">AI Guide</h1>
            <p className="text-sm text-gray-600">
              Welcome {username}, let me help you discover the perfect AI tools
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search AI tools..."
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* AI Consultation Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Ask Madame Dappai</h2>
                <p className="text-sm text-white/80">Get personalized AI tool recommendations</p>
              </div>
            </div>
            <button
              onClick={() => setShowConsultation(prev => !prev)}
              className="w-full py-2.5 bg-white text-blue-600 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              Start Consultation
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          {showConsultation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <AiConsultation />
            </motion.div>
          )}

          {/* Featured Apps */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Featured Apps</h2>
              <button className="text-sm text-blue-600">See all</button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <motion.div
                    key={app.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                        {app.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium truncate">{app.name}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{app.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{app.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{app.reviews.toLocaleString()} reviews</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No apps found matching your search.</p>
                </div>
              )}
            </div>
          </section>

          {/* Categories */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Categories</h2>
              <button className="text-sm text-blue-600">See all</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="p-4 bg-white border border-gray-200 rounded-xl text-left transition-colors hover:border-blue-500"
                >
                  <span className="text-2xl mb-2 block">{category.icon}</span>
                  <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2">{category.description}</p>
                </motion.button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
} 