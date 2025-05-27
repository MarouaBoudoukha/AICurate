"use client";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
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
        className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded hover:bg-purple-200 focus:ring-2 focus:ring-purple-400 transition"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        ← Back to Dashboard
      </motion.button>
      <motion.h2
        className="text-2xl font-bold mb-4 text-purple-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Leaderboard
      </motion.h2>
      <motion.div
        className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="text-lg font-semibold text-indigo-700">Rank Breakdown of all hunters:</div>
        <div>
          <label className="text-xs text-gray-500 mr-2">Sort by:</label>
          <select className="px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-300">
            <option value="tribe">Tribe</option>
            <option value="continent">Continent</option>
            <option value="country">Country</option>
          </select>
        </div>
      </motion.div>
      <motion.div
        className="grid gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } }
        }}
      >
        {[
          {
            rank: 1,
            label: 'Top Explorer',
            pts: '1350 pts',
            color: 'from-indigo-100 to-blue-100',
            text: 'text-indigo-700',
          },
          {
            rank: 2,
            label: 'Elite Hunter',
            pts: '1500 pts',
            color: 'from-purple-100 to-pink-100',
            text: 'text-purple-700',
          },
          {
            rank: 3,
            label: 'Master Scout',
            pts: '1750 pts',
            color: 'from-pink-100 to-yellow-100',
            text: 'text-pink-700',
          },
          {
            rank: 4,
            label: 'Legendary Curator',
            pts: '2000 pts',
            color: 'from-yellow-100 to-green-100',
            text: 'text-yellow-700',
          },
        ].map((item, i) => (
          <motion.div
            key={item.rank}
            className={`flex items-center justify-between bg-gradient-to-br ${item.color} rounded-xl shadow-lg p-4`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-lg bg-white shadow ${item.text}`}>{item.rank}</div>
              <div>
                <h4 className={`font-semibold ${item.text}`}>{item.label}</h4>
                <p className="text-xs text-gray-600">{item.pts}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
} 