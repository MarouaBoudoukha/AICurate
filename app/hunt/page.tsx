"use client";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function HuntPage() {
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
        className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-400 transition"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        ← Back to Dashboard
      </motion.button>
      <motion.h1
        className="text-2xl font-bold mb-6 text-indigo-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Start New Hunt
      </motion.h1>
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } }
        }}
      >
        <motion.div
          className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg text-indigo-700">AI Art Explorer</h3>
              <p className="text-sm text-gray-600">Review 5 different AI art generation apps</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Active
            </span>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Participants: 156</p>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full w-3/5 transition-all"></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">3/5 completed</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Reward: <span className="text-indigo-600 font-semibold">Miss Artsy NFT</span></p>
            <motion.button
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md text-sm font-medium shadow hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Join Challenge
            </motion.button>
          </div>
        </motion.div>
        <motion.div
          className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg text-purple-700">Image Generation Master</h3>
              <p className="text-sm text-gray-600">Compare Midjourney, DALL-E, and Stable Diffusion</p>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Upcoming
            </span>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Participants: 89</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Reward: <span className="text-purple-600 font-semibold">Exclusive AI Artist Badge</span></p>
            <motion.button
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md text-sm font-medium shadow hover:bg-gray-300 focus:ring-2 focus:ring-purple-300 focus:outline-none transition-all"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              disabled
            >
              Coming Soon
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 