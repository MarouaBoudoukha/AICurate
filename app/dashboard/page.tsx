'use client'

import { useState, Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Clock, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrendingApp {
  id: string
  name: string
  category: string
  rating: {
    human: number
    ai: number
  }
  reviews: number
  location: string
  icon: string
  description: string
}

export default function UserDashboard() {
  const [selectedTab, setSelectedTab] = useState('analytics')
  const [isLoading, setIsLoading] = useState(false)
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'location'>('rating')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  // Sample trending apps data
  const trendingApps: TrendingApp[] = [
    {
      id: '1',
      name: 'Midjourney',
      category: 'Image Generation',
      rating: {
        human: 4.8,
        ai: 4.9
      },
      reviews: 1250,
      location: 'Global',
      icon: '🎨',
      description: 'Advanced AI image generation platform'
    },
    {
      id: '2',
      name: 'ChatGPT',
      category: 'Text Generation',
      rating: {
        human: 4.9,
        ai: 4.8
      },
      reviews: 2500,
      location: 'Global',
      icon: '💬',
      description: 'Leading conversational AI model'
    }
  ]

  const categories = [
    'All',
    'Image Generation',
    'Text Generation',
    'Audio Processing',
    'Video Creation',
    'Code Generation'
  ]

  const sortApps = (apps: TrendingApp[]) => {
    return [...apps].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating.human + b.rating.ai) / 2 - (a.rating.human + a.rating.ai) / 2
        case 'reviews':
          return b.reviews - a.reviews
        case 'location':
          return a.location.localeCompare(b.location)
        default:
          return 0
      }
    })
  }

  const filterApps = (apps: TrendingApp[]) => {
    if (filterCategory === 'all') return apps
    return apps.filter(app => app.category === filterCategory)
  }

  const renderTrendingApps = () => {
    const filteredApps = filterApps(trendingApps)
    const sortedApps = sortApps(filteredApps)

    return (
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'reviews' | 'location')}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="rating">Sort by Rating</option>
            <option value="reviews">Sort by Reviews</option>
            <option value="location">Sort by Location</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sortedApps.map((app) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{app.icon}</span>
                  <div>
                    <h4 className="font-semibold text-black">{app.name}</h4>
                    <p className="text-sm text-gray-600">{app.category}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {app.location}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{app.description}</p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Human Rating</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span className="font-medium">{app.rating.human}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">AI Rating</span>
                  <div className="flex items-center">
                    <span className="text-purple-400 mr-1">★</span>
                    <span className="font-medium">{app.rating.ai}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reviews</span>
                  <span className="font-medium">{app.reviews}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  const renderAnalytics = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-lg mb-2">Reviews</h3>
            <div className="text-3xl font-bold text-blue-600">24</div>
            <p className="text-sm text-gray-600">Total reviews submitted</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-lg mb-2">Rating</h3>
            <div className="text-3xl font-bold text-blue-600">4.5</div>
            <p className="text-sm text-gray-600">Average review rating</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-lg mb-2">Influence</h3>
            <div className="text-3xl font-bold text-blue-600">78</div>
            <p className="text-sm text-gray-600">Community impact score</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-lg mb-2">Performance</h3>
            <div className="text-3xl font-bold text-blue-600">85</div>
            <p className="text-sm text-gray-600">Overall performance score</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-lg mb-4">Activity Timeline</h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
              <div>
                <p className="font-medium">Reviewed AI Art Generator App</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
              <div>
                <p className="font-medium">Earned Review Champion NFT</p>
                <p className="text-sm text-gray-600">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
              <div>
                <p className="font-medium">Completed AI Explorer Challenge</p>
                <p className="text-sm text-gray-600">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderChallenges = () => {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">AI Art Explorer</h3>
              <p className="text-sm text-gray-600">Review 5 different AI art generation apps</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Active
            </span>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Participants: 156</p>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full w-3/5"></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">3/5 completed</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Reward: Miss Artsy NFT</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">
              Join Challenge
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Image Generation Master</h3>
              <p className="text-sm text-gray-600">Compare Midjourney, DALL-E, and Stable Diffusion</p>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Upcoming
            </span>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Participants: 89</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Reward: Exclusive AI Artist Badge</p>
            <button className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md text-sm font-medium">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderLeaderboard = () => {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow divide-y">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 text-yellow-800 rounded-full font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold">AI Explorer</h4>
                <p className="text-xs text-gray-600">Top Contributor</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">950</p>
              <p className="text-xs text-gray-600">42 reviews</p>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-800 rounded-full font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold">Tech Guru</h4>
                <p className="text-xs text-gray-600">Thought Leader</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">920</p>
              <p className="text-xs text-gray-600">38 reviews</p>
            </div>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-800 rounded-full font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold">Digital Artist</h4>
                <p className="text-xs text-gray-600">Creative Master</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">890</p>
              <p className="text-xs text-gray-600">35 reviews</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <header className="mb-6 border-b pb-4 -mx-4 px-4">
        <h1 className="text-xl font-semibold">User Dashboard</h1>
        <p className="text-sm text-gray-600">Track your progress and explore trending AI apps</p>
      </header>

      <div className="mb-4">
        <nav className="grid grid-cols-2 gap-2">
          {['analytics', 'challenges', 'leaderboard', 'trending'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={cn(
                "px-3 py-2 rounded-md text-sm transition-all touch-manipulation",
                selectedTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-[0.98]'
              )}
            >
              {tab === 'analytics' && <Trophy className="w-4 h-4 inline-block mr-1" />}
              {tab === 'challenges' && <Users className="w-4 h-4 inline-block mr-1" />}
              {tab === 'leaderboard' && <Trophy className="w-4 h-4 inline-block mr-1" />}
              {tab === 'trending' && <Clock className="w-4 h-4 inline-block mr-1" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {selectedTab === 'analytics' && renderAnalytics()}
      {selectedTab === 'challenges' && renderChallenges()}
      {selectedTab === 'leaderboard' && renderLeaderboard()}
      {selectedTab === 'trending' && renderTrendingApps()}
    </div>
  )
} 