"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Gift, Award, Rocket, ArrowLeft, Users, Clock, Star, X, Timer, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUnifiedSession } from '@/hooks/useUnifiedSession';

interface BaseChallenge {
  title: string;
  reward: string;
  featured: boolean;
}

interface DetailedChallenge extends BaseChallenge {
  blurb: string;
  requiredCredits: number;
  badge: string | null;
  participants: number;
  duration: string;
  endsIn: string | null;
}

type Challenge = BaseChallenge | DetailedChallenge;

const tabs = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'ongoing', label: 'On-going' },
  { id: 'previous', label: 'Previous' },
  { id: 'irl', label: 'IRL Challenges' },
];

const challenges: Record<string, Challenge[]> = {
  upcoming: [
    {
      title: 'Edge Esmeralda World Meme Hunt — 44 pts + Edge Badge',
      blurb: 'Welcome to the Meme AI Hunt\nYour mission: Complete 3 levels. Win rewards. Become a ProofHunter.\n\n🧩 Level 1: Spot a PoPCard, snap a pic, post on X, share here.\n🎨 Level 2: Make a meme using #ProofHunter culture (see ideas in thread)\n🧘‍♀️ Level 3: Try Clarity Coach GPT, or another AI Tool and share feedback, claim reward\n\nHashtags:\n#JoinTheAIHunt | #ProofHunter | #EdgeEsmeralda | #AICURATE',
      reward: '44 proofpoints™ + Badge + Top 3 get memes win a MindBubble® Art piece 🎨 delivered to your home',
      requiredCredits: 1,
      badge: 'Edge Esmeralda',
      participants: 1000,
      duration: '1 month',
      endsIn: '11:15:40',
      featured: true,
    },
  ],
  ongoing: [
    {
      title: 'The Big AI Hunt',
      blurb: 'Test and Review 10 new AI tools',
      reward: '444 proofpoints + Badge',
      requiredCredits: 1,
      badge: 'AICurate Hunter Badge',
      participants: 1000,
      duration: '1 month',
      endsIn: '11:15:40',
      featured: true,
    },
    {
      title: 'Feedback Provider',
      blurb: 'Give feedback on a new app',
      reward: '10 proofpoints',
      requiredCredits: 0,
      participants: 1000,
      duration: 'Permanent',
      endsIn: null,
      badge: null,
      featured: false,
    },
    {
      title: 'Turn your knowledge into wealth — create your own AI-powered ETF',
      blurb: 'We let AIcurators create AI Tool ETFs:\nExample: "Top AI Marketing Tools ETF by @GrowthGuru"\nUsers can buy into that tool bundle or subscribe',
      reward: '55 proofpoints + Badge',
      requiredCredits: 1,
      badge: 'Top ETF curators badge',
      participants: 14,
      duration: 'Permanent',
      endsIn: null,
      featured: false,
    },
  ],
  previous: [
    {
      title: 'First Review challenge',
      reward: 'Earn 5 ProofPoints™ + Rookie Reviewer Badge',
      featured: false,
    },
    {
      title: 'Daily Curator',
      reward: '20 ProofPoints™ + Daily Streak Multiplier',
      featured: false,
    },
    {
      title: 'Tool Explorer',
      reward: '50 ProofPoints™ + Explorer Badge',
      featured: false,
    },
  ],
  irl: [
    {
      title: 'Verification Pro',
      reward: '75 ProofPoints™ + Verified Voice Badge',
      featured: false,
    },
    {
      title: 'Social Sharer',
      reward: '15 ProofPoints™ per share (daily limit)',
      featured: false,
    },
    {
      title: 'Friend Referral',
      reward: '100 ProofPoints™ per verified friend',
      featured: false,
    },
  ],
};

export default function StartChallengePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [proofPoints, setProofPoints] = useState(50);
  const [credits, setCredits] = useState(3);
  const unifiedSession = useUnifiedSession();

  // Load user data like wallet does
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userId = unifiedSession?.user?.id;
        if (!userId) return;

        // Fetch user's real data from database (same as wallet)
        const response = await fetch(`/api/user/badges?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setProofPoints(data.proofPoints || 50);
          // Keep credits as is for now, or set to a default
          setCredits(3);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    if (unifiedSession?.status !== 'loading' && unifiedSession?.user?.id) {
      loadUserData();
    }
  }, [unifiedSession?.status, unifiedSession?.user?.id]);

  const handleJoinChallenge = (challenge: Challenge) => {
    // Only the Edge Esmeralda World Meme Hunt is active
    if (challenge.title === 'Edge Esmeralda World Meme Hunt — 44 pts + Edge Badge') {
      // Redirect to Telegram group
      window.open('https://t.me/+4Zgzupvn9tIxNTA0', '_blank');
    } else {
      // Show coming soon popup for all other challenges
      setShowComingSoon(true);
    }
  };

  const isDetailedChallenge = (challenge: Challenge): challenge is DetailedChallenge => {
    return 'blurb' in challenge;
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
        className="mb-6 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-400 transition flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <ArrowLeft className="w-5 h-5" /> Go Back
      </motion.button>

      {/* Tabs */}
      <motion.div
        className="flex space-x-2 mb-6 overflow-x-auto pb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition transform hover:scale-105 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Challenge Cards - Enhanced with Dynamic Animations */}
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {challenges[activeTab].map((challenge, index) => (
          <motion.div
            key={challenge.title}
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 }
            }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
            className={`group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-2 ${
              challenge.featured ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''
            }`}
          >
            {/* Featured Badge */}
            {challenge.featured && (
              <motion.div
                className="absolute top-4 right-4 z-10"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5, type: 'spring' }}
              >
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Featured
                </div>
              </motion.div>
            )}

            <div className="p-6">
              {/* Header */}
              <motion.div
                className="mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-700 transition-colors">
                  {challenge.title}
                </h3>
                {isDetailedChallenge(challenge) && (
                  <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3 border-l-4 border-indigo-300">
                    {challenge.blurb.split('\n').map((line, i) => (
                      <div key={i} className={line.trim() === '' ? 'h-2' : ''}>
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Stats Grid */}
              {isDetailedChallenge(challenge) && (
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <div>
                      <div className="text-xs text-gray-500">Reward</div>
                      <div className="text-sm font-semibold text-yellow-700">{challenge.reward.split(' ')[0]} pts</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-xs text-gray-500">Cost</div>
                      <div className="text-sm font-semibold text-blue-700">{challenge.requiredCredits} credits</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-xs text-gray-500">Participants</div>
                      <div className="text-sm font-semibold text-green-700">{challenge.participants}</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-xs text-gray-500">Duration</div>
                      <div className="text-sm font-semibold text-purple-700">{challenge.duration}</div>
                    </div>
                  </div>

                  {challenge.badge && (
                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg p-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-pink-600" />
                      <div>
                        <div className="text-xs text-gray-500">Badge</div>
                        <div className="text-sm font-semibold text-pink-700">Included</div>
                      </div>
                    </div>
                  )}

                  {challenge.endsIn && (
                    <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-3 flex items-center gap-2">
                      <Timer className="w-5 h-5 text-red-600" />
                      <div>
                        <div className="text-xs text-gray-500">Ends in</div>
                        <div className="text-sm font-semibold text-red-700">{challenge.endsIn}</div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Simple challenges reward display */}
              {!isDetailedChallenge(challenge) && (
                <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-700">{challenge.reward}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <motion.div
                className="flex gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <motion.button
                  onClick={() => handleJoinChallenge(challenge)}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
                  whileTap={{ scale: 0.95 }}
                >
                  Join Challenge
                </motion.button>
                <motion.button
                  onClick={() => {/* Add view functionality if needed */}}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition-all duration-200 transform hover:scale-105 active:scale-95"
                  whileTap={{ scale: 0.95 }}
                >
                  View
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Coming Soon Popup */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowComingSoon(false)}
          >
            <motion.div
              className="bg-white rounded-xl p-6 m-4 max-w-sm w-full shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Coming Soon</h3>
                <button
                  onClick={() => setShowComingSoon(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                This challenge is coming soon! Stay tuned for updates.
              </p>
              <button
                onClick={() => setShowComingSoon(false)}
                className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 