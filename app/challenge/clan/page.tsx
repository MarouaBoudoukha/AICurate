"use client";
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Trophy, Star, Shield, Target, Calendar, Clock, Crown, Sword } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Clan {
  id: string;
  name: string;
  description: string;
  members: number;
  maxMembers: number;
  level: number;
  points: number;
  leader: string;
  image: string;
  tags: string[];
}

interface Battle {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  prize: string;
  participants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  type: 'team' | 'individual';
  difficulty: 'easy' | 'medium' | 'hard';
}

const mockClans: Clan[] = [
  {
    id: '1',
    name: 'AI Warriors',
    description: 'Elite team of AI enthusiasts focused on machine learning challenges',
    members: 8,
    maxMembers: 10,
    level: 5,
    points: 2500,
    leader: 'Alex Chen',
    image: '/clans/ai-warriors.png',
    tags: ['ML', 'Deep Learning', 'Competitive']
  },
  {
    id: '2',
    name: 'Neural Knights',
    description: 'Innovative team specializing in neural networks and AI research',
    members: 6,
    maxMembers: 10,
    level: 4,
    points: 1800,
    leader: 'Sarah Park',
    image: '/clans/neural-knights.png',
    tags: ['Research', 'Neural Networks', 'Innovation']
  },
  {
    id: '3',
    name: 'Data Dragons',
    description: 'Data science experts tackling complex AI challenges',
    members: 10,
    maxMembers: 10,
    level: 6,
    points: 3200,
    leader: 'Mike Johnson',
    image: '/clans/data-dragons.png',
    tags: ['Data Science', 'Analytics', 'Expert']
  }
];

const mockBattles: Battle[] = [
  {
    id: '1',
    title: 'AI Model Optimization Challenge',
    description: 'Optimize and fine-tune AI models for maximum performance',
    startDate: '2024-04-01',
    endDate: '2024-04-15',
    prize: '1000 Points + Special Badge',
    participants: 24,
    status: 'upcoming',
    type: 'team',
    difficulty: 'hard'
  },
  {
    id: '2',
    title: 'Neural Network Architecture Design',
    description: 'Design innovative neural network architectures for specific tasks',
    startDate: '2024-03-20',
    endDate: '2024-04-05',
    prize: '800 Points',
    participants: 18,
    status: 'ongoing',
    type: 'team',
    difficulty: 'medium'
  },
  {
    id: '3',
    title: 'AI Ethics Debate',
    description: 'Participate in discussions and debates about AI ethics',
    startDate: '2024-03-15',
    endDate: '2024-03-30',
    prize: '500 Points',
    participants: 32,
    status: 'completed',
    type: 'team',
    difficulty: 'easy'
  }
];

export default function ClanBattlePage() {
  const router = useRouter();
  const [selectedClan, setSelectedClan] = useState<Clan | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'clans' | 'battles'>('clans');

  const handleJoinClan = (clan: Clan) => {
    setSelectedClan(clan);
    setShowJoinModal(true);
  };

  const confirmJoin = () => {
    // In a real app, this would make an API call to join the clan
    setShowJoinModal(false);
    setSelectedClan(null);
  };

  const getDifficultyColor = (difficulty: Battle['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusColor = (status: Battle['status']) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-500';
      case 'ongoing':
        return 'text-green-500';
      case 'completed':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
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
        Join Clan Battle
      </motion.h1>

      {/* Stats Widget */}
      <motion.div
        className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow px-5 py-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <Users className="w-7 h-7 text-indigo-500" />
          <div>
            <div className="text-xs text-gray-500">Active Clans</div>
            <div className="text-xl font-bold text-indigo-700">{mockClans.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Trophy className="w-7 h-7 text-purple-500" />
          <div>
            <div className="text-xs text-gray-500">Active Battles</div>
            <div className="text-xl font-bold text-purple-700">{mockBattles.length}</div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('clans')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'clans'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-5 h-5 inline-block mr-2" />
            Clans
          </button>
          <button
            onClick={() => setActiveTab('battles')}
            className={`pb-2 px-4 font-medium ${
              activeTab === 'battles'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Sword className="w-5 h-5 inline-block mr-2" />
            Battles
          </button>
        </div>
      </motion.div>

      {/* Clans List */}
      {activeTab === 'clans' && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {mockClans.map((clan) => (
            <motion.div
              key={clan.id}
              className="bg-white rounded-xl shadow-lg p-4 hover:bg-indigo-50 transition"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-indigo-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{clan.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{clan.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-900">{clan.points} pts</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {clan.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {clan.members}/{clan.maxMembers} members
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Crown className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">Level {clan.level}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleJoinClan(clan)}
                      disabled={clan.members >= clan.maxMembers}
                      className={`px-4 py-2 rounded-lg transition ${
                        clan.members >= clan.maxMembers
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300'
                      }`}
                    >
                      {clan.members >= clan.maxMembers ? 'Full' : 'Join Clan'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Battles List */}
      {activeTab === 'battles' && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {mockBattles.map((battle) => (
            <motion.div
              key={battle.id}
              className="bg-white rounded-xl shadow-lg p-4 hover:bg-indigo-50 transition"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <Target className="w-8 h-8 text-indigo-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{battle.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{battle.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-900">{battle.prize}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(battle.status)}`}>
                      {battle.status.charAt(0).toUpperCase() + battle.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(battle.difficulty)}`}>
                      {battle.difficulty.charAt(0).toUpperCase() + battle.difficulty.slice(1)}
                    </span>
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs">
                      {battle.type.charAt(0).toUpperCase() + battle.type.slice(1)}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {battle.startDate} - {battle.endDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{battle.participants} participants</span>
                      </div>
                    </div>
                    <button
                      className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Join Clan Modal */}
      {showJoinModal && selectedClan && (
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
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Join Clan</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to join {selectedClan.name}? You&apos;ll be able to participate in clan battles and earn rewards together.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinModal(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmJoin}
                className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition"
              >
                Join Clan
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
} 