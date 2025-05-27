"use client";
import { useRouter } from 'next/navigation';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const trophyData = [
  { color: 'text-yellow-500', bg: 'from-yellow-100 to-white', label: 'Level 5 — Seasoned Explorer' },
  { color: 'text-blue-500', bg: 'from-blue-100 to-white', label: 'Top Curator — 100 ProofPoints™ in the Vault' },
  { color: 'text-green-500', bg: 'from-green-100 to-white', label: 'OG Status — Fearless Tester' },
  { color: 'text-orange-500', bg: 'from-orange-100 to-white', label: '3 Trophies Earned — Bronze Cup' },
  { color: 'text-purple-500', bg: 'from-purple-100 to-white', label: 'Top 3 Clan Rank — Wisdom Clan' },
  { color: 'text-pink-500', bg: 'from-pink-100 to-white', label: '7 Badges Collected — On a roll!' },
];

export default function TrophyPage() {
  const router = useRouter();
  return (
    <motion.div
      className="p-4 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.button
        onClick={() => router.push('/dashboard')}
        className="mb-4 px-4 py-2 bg-gradient-to-r from-yellow-100 to-pink-100 text-yellow-700 rounded hover:bg-yellow-200 focus:ring-2 focus:ring-yellow-400 transition"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        ← Back to Dashboard
      </motion.button>
      <motion.h2
        className="text-2xl font-bold mb-4 text-yellow-600"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Trophy Wall
      </motion.h2>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } }
        }}
      >
        {trophyData.map((trophy, i) => (
          <motion.div
            key={trophy.label}
            className={`bg-gradient-to-br ${trophy.bg} rounded-xl shadow-lg p-4 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
          >
            <Trophy className={`w-8 h-8 mb-2 ${trophy.color}`} />
            <div className="font-semibold text-center text-gray-800 text-sm">{trophy.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
} 