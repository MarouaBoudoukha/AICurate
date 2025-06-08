"use client";
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Coins, Clock, Gift, Trophy, Star, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'badge' | 'points' | 'special';
  status: 'available' | 'claimed' | 'expired';
  expiresAt?: string;
  image?: string;
}

const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'AI Explorer Badge',
    description: 'Earned by completing 5 AI tool reviews',
    points: 100,
    type: 'badge',
    status: 'available',
    image: '/badges/explorer.png',
  },
  {
    id: '2',
    title: 'Challenge Completion Points',
    description: 'Reward for completing "The Big AI Hunt" challenge',
    points: 444,
    type: 'points',
    status: 'available',
  },
  {
    id: '3',
    title: 'Top Reviewer Badge',
    description: 'Awarded for being in the top 10 reviewers',
    points: 200,
    type: 'badge',
    status: 'claimed',
    image: '/badges/top-reviewer.png',
  },
  {
    id: '4',
    title: 'Early Adopter Special',
    description: 'Exclusive reward for early platform users',
    points: 500,
    type: 'special',
    status: 'expired',
    expiresAt: '2024-03-01',
  },
];

const mockClaimHistory = [
  {
    id: '1',
    title: 'First Review Reward',
    points: 50,
    claimedAt: '2024-03-15',
    type: 'points',
  },
  {
    id: '2',
    title: 'Social Sharer Badge',
    points: 100,
    claimedAt: '2024-03-10',
    type: 'badge',
  },
  {
    id: '3',
    title: 'Weekly Streak Bonus',
    points: 75,
    claimedAt: '2024-03-05',
    type: 'points',
  },
];

export default function ClaimPage() {
  const router = useRouter();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const handleClaim = (reward: Reward) => {
    setSelectedReward(reward);
    setShowClaimModal(true);
  };

  const confirmClaim = () => {
    // In a real app, this would make an API call to claim the reward
    setShowClaimModal(false);
    setSelectedReward(null);
  };

  return (
    <motion.div
      className="p-4 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.button
        onClick={() => router.push('/challenge')}
        className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-400 transition flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <ArrowLeft className="w-5 h-5" /> Go Back
      </motion.button>

      <motion.h1
        className="text-2xl font-bold mb-2 text-indigo-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        Claim Your Rewards
      </motion.h1>

      {/* Available Rewards */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Gift className="w-5 h-5 text-indigo-500" />
          Available Rewards
        </h2>
        <div className="space-y-4">
          {mockRewards.map((reward) => (
            <motion.div
              key={reward.id}
              className="bg-white rounded-xl shadow-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div className="flex items-start gap-4">
                {reward.image && (
                  <img
                    src={reward.image}
                    alt={reward.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{reward.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-900">{reward.points} pts</span>
                    </div>
                  </div>
                  {reward.status === 'available' && (
                    <button
                      onClick={() => handleClaim(reward)}
                      className="mt-3 w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition"
                    >
                      Claim Reward
                    </button>
                  )}
                  {reward.status === 'claimed' && (
                    <div className="mt-3 flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Claimed</span>
                    </div>
                  )}
                  {reward.status === 'expired' && reward.expiresAt && (
                    <div className="mt-3 flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Expired on {reward.expiresAt}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Claim History */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Claim History
        </h2>
        <div className="space-y-3">
          {mockClaimHistory.map((claim) => (
            <div key={claim.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <h3 className="font-medium text-gray-900">{claim.title}</h3>
                <p className="text-sm text-gray-500">Claimed on {claim.claimedAt}</p>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="font-medium text-gray-900">{claim.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Claim Modal */}
      {showClaimModal && selectedReward && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Claim Reward</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to claim the {selectedReward.title}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClaimModal(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmClaim}
                className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition"
              >
                Confirm Claim
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
} 