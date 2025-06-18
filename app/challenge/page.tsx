"use client";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useUnifiedSession } from '@/hooks/useUnifiedSession';
import { 
  Rocket, 
  ThumbsUp, 
  Share2, 
  FlaskConical, 
  Award, 
  BookOpen, 
  PlusCircle, 
  ChevronRight, 
  Coins,
  Users,
  Trophy,
  Star
} from 'lucide-react';

const challengeSections = [
  {
    label: 'Start a Challenge',
    icon: Rocket,
    color: 'text-indigo-600',
    path: '/challenge/start',
  },
  {
    label: 'Vote with Proof',
    icon: ThumbsUp,
    color: 'text-purple-600',
    path: '/challenge/vote',
  },
  {
    label: 'Share on Social',
    icon: Share2,
    color: 'text-pink-500',
    path: '/challenge/share',
  },
  {
    label: 'Test & Review',
    icon: FlaskConical,
    color: 'text-blue-500',
    path: '/challenge/test',
  },
  {
    label: 'Claim Rewards',
    icon: Award,
    color: 'text-yellow-500',
    path: '/challenge/claim',
  },
  {
    label: 'Educate or Write',
    icon: BookOpen,
    color: 'text-green-600',
    path: '/challenge/educate',
  },
  {
    label: 'List Your AI App',
    icon: PlusCircle,
    color: 'text-indigo-500',
    path: '/challenge/list',
  },
  {
    label: 'Join Clan Battle',
    icon: Users,
    color: 'text-red-500',
    path: '/challenge/clan',
  },
];

export default function ChallengePage() {
  const router = useRouter();
  const [credits, setCredits] = useState(3);
  const [proofPoints, setProofPoints] = useState(150);
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
          setProofPoints(data.proofPoints || 150);
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

  return (
    <motion.div
      className="p-4 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.h1
        className="text-2xl font-bold mb-2 text-indigo-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        Join the Top AI Explorers & shape the future of AI
      </motion.h1>

      {/* Stats Widget */}
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
        <div className="flex items-center gap-3">
          <Star className="w-7 h-7 text-purple-500" />
          <div>
            <div className="text-xs text-gray-500">ProofPoints™</div>
            <div className="text-xl font-bold text-purple-700">{proofPoints}</div>
          </div>
        </div>
        <button className="ml-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-yellow-500 hover:to-pink-600 focus:ring-2 focus:ring-pink-300 transition">
          Buy More
        </button>
      </motion.div>

      {/* Challenge Sections */}
      <motion.div
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } }
        }}
      >
        {challengeSections.map((section, i) => (
          <motion.button
            key={section.label}
            className="w-full flex items-center justify-between bg-white rounded-xl shadow-lg px-4 py-4 hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-300 transition group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
            onClick={() => router.push(section.path)}
          >
            <div className="flex items-center gap-4">
              <section.icon className={`w-6 h-6 ${section.color} group-hover:scale-110 transition-transform`} />
              <span className="font-medium text-gray-900 text-base">{section.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition" />
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
} 