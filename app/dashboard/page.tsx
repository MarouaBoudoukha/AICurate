"use client";
import { useRouter } from 'next/navigation';
import { UserCircle, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useRef } from 'react';

export default function UserDashboard() {
  const router = useRouter();
  // Mock user data
  const username = 'Explorer';
  const proofPoints = 1250;
  const credits = 3;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar upload handler (placeholder, no upload logic)
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      className="max-w-sm mx-auto px-4 py-8 w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Top: Welcome & Avatar */}
      <motion.div
        className="flex flex-col items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
      >
        <div
          className="relative group cursor-pointer mb-2"
          onClick={handleAvatarClick}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-400 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <UserCircle className="w-16 h-16 text-white/80" />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
            />
            <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow group-hover:bg-indigo-100 transition-colors">
              <Camera className="w-5 h-5 text-indigo-500" />
            </div>
          </motion.div>
        </div>
        <motion.h1
          className="text-lg font-bold text-gray-900 mb-1 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Welcome back, {username}!
        </motion.h1>
      </motion.div>
      {/* ProofPoints & Credits */}
      <motion.div
        className="flex flex-col items-center mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <span className="text-sm text-gray-500">
          ProofPoints™: <span className="font-bold text-indigo-600">{proofPoints.toLocaleString()}</span>
        </span>
        <span className="text-sm text-gray-500">
          Credits: <span className="font-bold text-green-600">{credits}</span>
        </span>
      </motion.div>
      {/* Main Actions */}
      <motion.div
        className="flex flex-col gap-3 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.button
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/hunt')}
        >
          Start New Hunt
        </motion.button>
        <motion.button
          className="w-full bg-gradient-to-r from-yellow-400 to-pink-500 hover:from-yellow-500 hover:to-pink-600 text-white font-semibold py-3 rounded-lg shadow-lg border-0 transition-all focus:ring-2 focus:ring-pink-300 focus:outline-none"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Claim My Rewards
        </motion.button>
      </motion.div>
      {/* Section Links */}
      <motion.div
        className="space-y-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } }
        }}
      >
        {[
          {
            label: 'Analytics',
            desc: '2 reviews left in current hunt',
            color: 'text-indigo-600',
            to: '/analytics',
          },
          {
            label: 'Leaderboard',
            desc: 'Top 10% of Explorers',
            color: 'text-purple-600',
            to: '/leaderboard',
          },
          {
            label: 'Trophy Wall',
            desc: 'View your collected badges',
            color: 'text-yellow-500',
            to: '/trophy',
          },
          {
            label: 'Hunt Vault',
            desc: 'Phoenix Coins staked here',
            color: 'text-pink-500',
            to: '/vault',
          },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            className=""
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
          >
            <button
              onClick={() => router.push(item.to)}
              className={`w-full text-left text-base font-semibold ${item.color} hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-300 transition`}
            >
              {item.label}
            </button>
            <div className="text-xs text-gray-500 ml-1 mt-1">{item.desc}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
} 