'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Wallet, Package, Trophy, Bot } from 'lucide-react'
import { MiniKit, Tokens } from '@worldcoin/minikit-js'
import { AiConsultation } from '@/components/AiConsultation'
import Image from 'next/image'

interface Collectible {
  id: string
  name: string
  type: 'NFT' | 'token' | 'merchandise'
  description: string
  image: string
  rarity?: string
  price?: number
  owned?: boolean
  mintedAt?: string
  avatarType?: string
}

interface UserAvatar {
  id: string
  name: string
  type: string
  level: number
  experience: number
  achievements: string[]
}

export default function RewardsCollectibles() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'store'>('inventory')
  const [selectedItem, setSelectedItem] = useState<Collectible | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [username, setUsername] = useState<string>('Explorer')
  const [showConsultation, setShowConsultation] = useState(false)

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem('username')
    if (storedUsername) {
      setUsername(storedUsername)
    }

    // Get wallet address if already connected
    if (MiniKit.isInstalled() && MiniKit.walletAddress) {
      setWalletAddress(MiniKit.walletAddress)
    }
  }, [])

  // Sample user avatar data
  const userAvatar: UserAvatar = {
    id: '1',
    name: username,
    type: 'Professional',
    level: 3,
    experience: 750,
    achievements: ['First Review', 'AI Expert', 'Community Contributor']
  }

  // Sample collectibles data including the minted NFT
  const inventory: Collectible[] = [
    {
      id: '1',
      name: 'Miss Tech Explorer',
      type: 'NFT',
      description: 'Your unique avatar NFT representing your AI journey',
      image: '/misstechexplorer.jpg',
      rarity: 'Unique',
      owned: true,
      mintedAt: new Date().toISOString(),
      avatarType: 'Tech Explorer'
    },
    {
      id: '2',
      name: 'Review Champion',
      type: 'NFT',
      description: 'Earned for outstanding AI app reviews',
      image: '/missreview.jpg',
      rarity: 'Rare',
      owned: true
    },
    {
      id: '3',
      name: 'AI Pioneer Token',
      type: 'token',
      description: 'Exclusive token for early platform contributors',
      image: '/madamenft2.jpg',
      owned: true
    }
  ]

  const storeItems: Collectible[] = [
    {
      id: '4',
      name: 'Miss Artsy',
      type: 'NFT',
      description: 'Limited edition NFT for art generation enthusiasts',
      image: '/missartsy.jpg',
      rarity: 'Legendary',
      price: 0.5
    },
    {
      id: '5',
      name: 'Madame Goals',
      type: 'NFT',
      description: 'Exclusive NFT celebrating achievement and ambition',
      image: '/madamgoals.jpg',
      rarity: 'Epic',
      price: 0.4
    },
    {
      id: '6',
      name: 'Miss Afro',
      type: 'NFT',
      description: 'Celebrating diversity and cultural heritage in AI',
      image: '/missafro.jpg',
      rarity: 'Legendary',
      price: 0.5
    },
    {
      id: '7',
      name: 'Miss Urban',
      type: 'NFT',
      description: 'Urban lifestyle and city vibes NFT collection',
      image: '/missurban.jpg',
      rarity: 'Epic',
      price: 0.4
    },
    {
      id: '8',
      name: 'Miss Shero',
      type: 'NFT',
      description: 'Empowering superhero-themed NFT collection',
      image: '/shero.jpg',
      rarity: 'Legendary',
      price: 0.5
    },
    {
      id: '9',
      name: 'Miss Perfect',
      type: 'NFT',
      description: 'Precision and excellence in AI performance',
      image: '/missperfect.jpg',
      rarity: 'Legendary',
      price: 0.5
    },
    {
      id: '10',
      name: 'Madame DAPP.AI Hoodie',
      type: 'merchandise',
      description: 'Limited edition black hoodie featuring Madame DAPP.AI artwork',
      image: '/hoodie.jpg',
      price: 75,
      rarity: 'Limited Edition'
    }
  ]

  const handlePurchase = async (item: Collectible) => {
    setIsLoading(true)
    try {
      if (!MiniKit.isInstalled()) {
        throw new Error('Please install World App to continue')
      }

      // Get nonce from backend
      const nonceResponse = await fetch('/api/nonce')
      if (!nonceResponse.ok) {
        throw new Error('Failed to get nonce')
      }
      const { nonce } = await nonceResponse.json()

      // Connect wallet if not connected
      if (!MiniKit.walletAddress) {
        const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
          nonce,
          statement: 'Connect your wallet to purchase items',
          expirationTime: new Date(Date.now() + 1000 * 60 * 60) // 1 hour
        })

        if (finalPayload.status === 'error') {
          throw new Error('Failed to connect wallet')
        }

        // Verify SIWE message
        const verifyResponse = await fetch('/api/complete-siwe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            payload: finalPayload,
            nonce,
          }),
        })

        if (!verifyResponse.ok) {
          throw new Error('Failed to verify wallet connection')
        }

        const { address } = await verifyResponse.json()
        if (!address) {
          throw new Error('No wallet address returned')
        }
      }

      // Initialize payment
      const initResponse = await fetch('/api/initiate-payment', {
        method: 'POST'
      })
      
      if (!initResponse.ok) {
        throw new Error('Failed to initialize payment')
      }
      
      const { id: reference } = await initResponse.json()

      // Send payment transaction
      const response = await MiniKit.commandsAsync.pay({
        to: process.env.NEXT_PUBLIC_WLD_APP_ID as string,
        tokens: [{
          symbol: item.type === 'NFT' ? Tokens.WLD : Tokens.USDCE,
          token_amount: item.price?.toString() || '0'
        }],
        reference,
        description: `Purchase ${item.name}`
      })

      if (!response?.finalPayload || response.finalPayload.status === 'error') {
        throw new Error('Failed to process payment')
      }

      // Verify payment
      const verifyResponse = await fetch('/api/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          payload: response.finalPayload
        })
      })

      if (!verifyResponse.ok) {
        throw new Error('Payment verification failed')
      }

      const { success } = await verifyResponse.json()
      if (!success) {
        throw new Error('Payment verification failed')
      }

      // Add item to inventory
      // TODO: Update backend to reflect purchase

      alert('Purchase successful!')
    } catch (error) {
      console.error('Purchase error:', error)
      alert(error instanceof Error ? error.message : 'Purchase failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="pb-20">
      <header className="p-4 border-b sticky top-0 bg-white z-10">
        <h1 className="text-xl font-semibold">Rewards & Collectibles</h1>
        <p className="text-sm text-gray-600">View your rewards and collect unique items</p>
      </header>

      <div className="p-4">
        {/* AI Consultation Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white mb-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Ask Madame Dappai</h2>
              <p className="text-sm text-white/80">Get personalized NFT recommendations</p>
            </div>
          </div>
          <button
            onClick={() => setShowConsultation(prev => !prev)}
            className="w-full py-2.5 bg-white text-blue-600 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            {showConsultation ? 'Close Consultation' : 'Start Consultation'}
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

        {/* Avatar Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-4 mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-xl font-semibold text-gray-600">
                {userAvatar.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{userAvatar.name}</h3>
              <p className="text-sm text-gray-600">Level {userAvatar.level} {userAvatar.type}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {userAvatar.achievements.map((achievement) => (
                  <span
                    key={achievement}
                    className="inline-flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full"
                  >
                    {achievement}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(userAvatar.experience % 1000) / 10}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-blue-600 h-2 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1.5">
              {userAvatar.experience} / 1000 XP to next level
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setActiveTab('inventory')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all",
              activeTab === 'inventory'
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Package className="w-4 h-4" />
            Collection
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all",
              activeTab === 'store'
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Wallet className="w-4 h-4" />
            Store
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(activeTab === 'inventory' ? inventory : storeItems).map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
            >
              <div className="aspect-[4/3] bg-gray-100 relative">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {item.rarity && (
                  <span className="absolute top-2 right-2 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {item.rarity}
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                {item.mintedAt && (
                  <p className="text-xs text-gray-500 mb-3">
                    Minted on {new Date(item.mintedAt).toLocaleDateString()}
                  </p>
                )}

                {item.avatarType && (
                  <p className="text-xs text-blue-600 mb-3">
                    Avatar Type: {item.avatarType}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {item.type}
                  </span>
                  {item.price && !item.owned && (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={isLoading}
                      className={cn(
                        "py-2 px-4 rounded-lg text-sm font-medium text-white transition-colors",
                        isLoading
                          ? "bg-gray-400"
                          : "bg-blue-600 active:bg-blue-700"
                      )}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <motion.span
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Processing...
                        </span>
                      ) : (
                        `Buy for ${item.price} ${item.type === 'NFT' ? 'ETH' : 'USD'}`
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-white rounded-t-xl sm:rounded-xl p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedItem.name}</h3>
            <button
              onClick={() => setSelectedItem(null)}
              className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
} 