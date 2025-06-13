"use client";

import { motion } from 'framer-motion';
import { Coins, Gift, Award, Rocket, ArrowLeft, Users, Clock, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
      title: 'Turn your knowledge into wealth',
      blurb: 'Create your own AI-powered ETF',
      reward: '55 proofpoints + Badge',
      requiredCredits: 1,
      badge: 'Top ETF curators badge',
      participants: 14,
      duration: 'Permanent',
      endsIn: null,
      featured: false,
    },
  ],
  ongoing: [
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
      title: 'Edge Community Meme Hunt',
      blurb: 'Create Memes about Edge Esmeralda mimicking our AI Hunt meme',
      reward: '44 pts + Edge Badge',
      requiredCredits: 1,
      badge: 'Edge Esmeralda',
      featured: false,
    },
  ],
};

export default function DraftAIGuidePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');
  const credits = 3; // Replace with real credits logic

  const handleJoinChallenge = (challenge: Challenge) => {
    router.push(`/challenge/join/${encodeURIComponent(challenge.title)}`);
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
        onClick={() => router.push('/guide')}
        className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-400 transition flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <ArrowLeft className="w-5 h-5" /> Go Back
      </motion.button>

      {/* Credits Widget */}
      <motion.div
        className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow px-5 py-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <Coins className="w-7 h-7 text-yellow-500" />
          <div>
            <div className="text-xs text-gray-500">Credits Available</div>
            <div className="text-xl font-bold text-indigo-700">{credits}</div>
          </div>
        </div>
        <button className="ml-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-yellow-500 hover:to-pink-600 focus:ring-2 focus:ring-pink-300 transition">
          Buy More
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
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                  {isDetailedChallenge(challenge) && (
                    <p className="text-sm text-gray-600 mt-1">{challenge.blurb}</p>
                  )}
                </div>
                {challenge.featured && (
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
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

              <button
                onClick={() => handleJoinChallenge(challenge)}
                className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition"
              >
                Join Challenge
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 