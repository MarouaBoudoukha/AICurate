"use client";
import { useRouter } from 'next/navigation';
import { Vault } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VaultPage() {
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
        className="mb-4 px-4 py-2 bg-gradient-to-r from-pink-100 to-yellow-100 text-pink-700 rounded hover:bg-pink-200 focus:ring-2 focus:ring-pink-400 transition"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        ← Back to Dashboard
      </motion.button>
      <motion.h2
        className="text-2xl font-bold mb-4 text-pink-600"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Hunt Vault
      </motion.h2>
      <motion.div
        className="bg-gradient-to-br from-yellow-50 to-pink-50 rounded-xl shadow-lg p-8 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Vault className="w-12 h-12 text-yellow-500 mb-2" />
        <div className="font-semibold mb-2 text-gray-800 text-center">Your treasure is staked here. It will turn into real</div>
        <motion.button
          className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow hover:from-indigo-600 hover:to-purple-600 transition-all focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          Enter Vault
        </motion.button>
      </motion.div>
    </motion.div>
  );
} 