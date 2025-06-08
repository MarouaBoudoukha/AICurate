"use client";
import { motion } from 'framer-motion';
import { ArrowLeft, ThumbsUp, ThumbsDown, Star, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  description: string;
  votes: number;
  rating: number;
  voters: number;
}

const mockTools: Tool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'Advanced language model for natural conversations',
    votes: 1200,
    rating: 4.8,
    voters: 1500,
  },
  {
    id: '2',
    name: 'Midjourney',
    description: 'AI-powered image generation tool',
    votes: 980,
    rating: 4.7,
    voters: 1100,
  },
  {
    id: '3',
    name: 'Claude',
    description: 'Anthropic\'s AI assistant',
    votes: 850,
    rating: 4.6,
    voters: 950,
  },
];

const mockTopVoters = [
  { id: '1', name: 'AI Explorer', points: 1500, votes: 45 },
  { id: '2', name: 'Tech Guru', points: 1200, votes: 38 },
  { id: '3', name: 'AI Enthusiast', points: 980, votes: 32 },
];

export default function VotePage() {
  const router = useRouter();
  const [tools, setTools] = useState(mockTools);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [comment, setComment] = useState('');

  const handleVote = (toolId: string, isPositive: boolean) => {
    setTools(tools.map(tool => {
      if (tool.id === toolId) {
        return {
          ...tool,
          votes: tool.votes + (isPositive ? 1 : -1),
          voters: tool.voters + 1,
        };
      }
      return tool;
    }));
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
        Vote for your favorite AI tool!
      </motion.h1>

      {/* Tools List */}
      <motion.div
        className="space-y-4 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            className="bg-white rounded-xl shadow-lg p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-medium text-gray-900">{tool.rating}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleVote(tool.id, true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{tool.votes}</span>
                </button>
                <button
                  onClick={() => handleVote(tool.id, false)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500">{tool.voters} voters</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Top Voters Leaderboard */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top Voters
        </h2>
        <div className="space-y-3">
          {mockTopVoters.map((voter, index) => (
            <div key={voter.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-indigo-600">#{index + 1}</span>
                <span className="font-medium text-gray-900">{voter.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{voter.votes} votes</span>
                <span className="text-sm font-medium text-indigo-600">{voter.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
} 