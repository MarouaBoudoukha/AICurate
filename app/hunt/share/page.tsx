"use client";
import { motion } from 'framer-motion';
import { Share2, Twitter, Instagram, Linkedin, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SharePage() {
  const router = useRouter();
  return (
    <motion.div
      className="p-4 max-w-md mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.button
        onClick={() => router.push('/hunt')}
        className="mb-4 px-4 py-2 bg-gradient-to-r from-pink-100 to-yellow-100 text-pink-700 rounded hover:bg-pink-200 focus:ring-2 focus:ring-pink-400 transition flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <ArrowLeft className="w-5 h-5" /> Go Back
      </motion.button>
      <motion.h1
        className="text-2xl font-bold mb-2 text-pink-600 flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Share2 className="w-7 h-7 text-pink-500" />
        Share on Social
      </motion.h1>
      <motion.p
        className="mb-4 text-gray-600 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        Earn tokens for posts or referrals using specific hashtags
      </motion.p>
      <motion.div
        className="bg-white rounded-xl shadow-lg p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="text-sm text-gray-700 mb-2">Pre-scripted post:</div>
        <div className="bg-gray-50 rounded p-3 text-xs text-gray-600 mb-3">Check out this amazing AI tool on #ProofHunt! 🚀 #AI #AICurate</div>
        <div className="flex gap-3 justify-center">
          <button className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"><Twitter className="w-4 h-4" /> Twitter</button>
          <button className="flex items-center gap-1 px-3 py-2 bg-pink-100 text-pink-600 rounded hover:bg-pink-200 transition"><Instagram className="w-4 h-4" /> IG</button>
          <button className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition"><Linkedin className="w-4 h-4" /> LinkedIn</button>
          <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition"><MoreHorizontal className="w-4 h-4" /> Other</button>
        </div>
      </motion.div>
    </motion.div>
  );
} 