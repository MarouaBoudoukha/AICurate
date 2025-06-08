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

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

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
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.header
        className="p-4 border-b sticky top-0 bg-white z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
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
            <h1 className="text-xl font-semibold text-indigo-700">AI Guide</h1>
            <p className="text-sm text-gray-600">
              Welcome {username}, let me help you discover the perfect AI tools
            </p>
          </div>
        </div>
      </motion.header>
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Search Bar */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <input
              type="text"
              placeholder="Search AI tools..."
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </motion.div>
          {/* AI Consultation Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white"
            transition={{ delay: 0.3, duration: 0.5 }}
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
              className="w-full py-2.5 bg-white text-blue-600 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 transition"
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
          {/* Categories */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } }
            }}
          >
            {categories.map((cat, i) => (
              <motion.button
                key={cat.id}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow p-4 flex flex-col items-center hover:scale-105 transition-transform focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                onClick={() => setSelectedCategory(cat.name)}
              >
                <span className="text-2xl mb-2">{cat.icon}</span>
                <span className="font-semibold text-indigo-700 text-sm mb-1">{cat.name}</span>
                <span className="text-xs text-gray-500 text-center">{cat.description}</span>
              </motion.button>
            ))}
          </motion.div>
          {/* Featured Apps */}
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } }
            }}
          >
            {filteredApps.map((app, i) => (
              <motion.div
                key={app.name}
                className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
              >
                <span className="text-3xl">{app.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-indigo-700">{app.name}</h4>
                  <p className="text-sm text-gray-600">{app.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-500 text-xs flex items-center gap-1"><Star className="w-3 h-3" /> {app.rating}</span>
                    <span className="text-xs text-gray-400">({app.reviews} reviews)</span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                  {app.category}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </motion.div>
  )
} 