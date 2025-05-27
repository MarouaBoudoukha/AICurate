"use client";
import { motion } from 'framer-motion';
import { ThumbsUp, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VotePage() {
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
        className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded hover:bg-purple-200 focus:ring-2 focus:ring-purple-400 transition flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <ArrowLeft className="w-5 h-5" /> Go Back
      </motion.button>
      <motion.h1
        className="text-2xl font-bold mb-4 text-purple-700 flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <ThumbsUp className="w-7 h-7 text-purple-500" />
        Vote — Boost trusted reviews & earn ProofPoints™
      </motion.h1>
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="text-lg">Voting actions coming soon...</div>
      </motion.div>
    </motion.div>
  );
} 