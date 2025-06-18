"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Gift, Award, Rocket, ArrowLeft, Users, Clock, Star, X } from 'lucide-react';
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
        className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-400 transition flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <ArrowLeft className="w-5 h-5" /> Go Back
      </motion.button>

      {/* Balance Widget */}
      <motion.div
        className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow px-5 py-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-yellow-500" />
              <div>
                <div className="text-xs text-gray-500">Credits</div>
                <div className="text-lg font-bold text-indigo-700">{credits}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-6 h-6 text-purple-500" />
          <div>
                <div className="text-xs text-gray-500">ProofPoints™</div>
                <div className="text-lg font-bold text-purple-700">{proofPoints}</div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg font-semibold shadow hover:bg-green-600 focus:ring-2 focus:ring-green-300 transition">
              convert to credits
            </button>
            <button className="px-3 py-1 bg-purple-500 text-white text-sm rounded-lg font-semibold shadow hover:bg-purple-600 focus:ring-2 focus:ring-purple-300 transition">
              stake coins
            </button>
          </div>
        </div>
        <button className="w-full px-4 py-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-yellow-500 hover:to-pink-600 focus:ring-2 focus:ring-pink-300 transition">
          Buy more widget with tokens/FIAT
        </button>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Challenge Cards */}
      <div className="space-y-4">
        {challenges[activeTab].map((challenge, index) => (
          <motion.div
            key={challenge.title}
            className={`bg-white rounded-xl shadow-lg overflow-hidden ${
              challenge.featured ? 'border-2 border-indigo-500' : ''
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                  {isDetailedChallenge(challenge) && (
                    <div className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                      {challenge.blurb}
                    </div>
                  )}
                </div>
                {challenge.featured && (
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full ml-2 flex-shrink-0">
                    Featured
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{challenge.reward}</span>
                </div>
                {isDetailedChallenge(challenge) && (
                  <>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm text-gray-600">{challenge.requiredCredits} credits</span>
                    </div>
                    {challenge.badge && (
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-purple-500" />
                        <span className="text-sm text-gray-600">{challenge.badge}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-gray-600">{challenge.participants} participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{challenge.duration}</span>
                    </div>
                  </>
                )}
              </div>

              {isDetailedChallenge(challenge) && challenge.endsIn && (
                <div className="text-sm text-gray-500 mb-4">
                  Ends in: <span className="font-medium text-indigo-600">{challenge.endsIn}</span>
                </div>
              )}

              <div className="flex gap-2">
              <button
                onClick={() => handleJoinChallenge(challenge)}
                  className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition"
              >
                  Join
                </button>
                <button
                  onClick={() => {/* Add view functionality if needed */}}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition"
                >
                  View
              </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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