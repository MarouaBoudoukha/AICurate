"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

export default function ClaimRewardsPage() {
  const router = useRouter();
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleSaveToWallet = () => {
    setShowComingSoon(true);
  };

  const handleClaimAll = () => {
    setShowComingSoon(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-sm mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="pt-12 pb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Claim Rewards</h1>
          
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-teal-700"></div>
              </div>
              {/* Coins decoration */}
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-yellow-400 border border-yellow-500"></div>
              <div className="absolute top-3 right-0 w-3 h-3 rounded-full bg-yellow-300 border border-yellow-400"></div>
            </div>
          </div>

          {/* Rewards Summary */}
          <p className="text-lg text-gray-700 mb-8">
            You have <span className="font-semibold">1 coin</span>, <span className="font-semibold">1 badge</span>, and <span className="font-semibold">5 credits</span>
            <br />
            ready to claim.
          </p>
        </div>

        {/* Rewards List */}
        <div className="px-4 space-y-4 mb-8">
          {/* Phoenix Coin */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-900">🦅</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">1 Phoenix Coin</h3>
                <p className="text-sm text-gray-500">Coin</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>

          {/* Edge Esmeralda Badge */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center relative overflow-hidden">
                <div className="w-8 h-8 bg-yellow-400 rounded-sm flex items-center justify-center">
                  <span className="text-xs font-bold text-teal-800">EDGE</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">1 Edge Esmeralda Badge</h3>
                <p className="text-sm text-gray-500">Badge</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>

          {/* Credits */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">5 Credits</h3>
                <p className="text-sm text-gray-500">Credits</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 space-y-4 mb-8">
          <button
            onClick={handleSaveToWallet}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:from-indigo-600 hover:to-purple-700 transition-all"
          >
            Save to Wallet
          </button>
          
          <button
            onClick={handleClaimAll}
            className="w-full text-blue-500 font-medium py-2"
          >
            Claim All &gt;
          </button>
        </div>
      </div>

      {/* Coming Soon Popup */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowComingSoon(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon!</h3>
                <p className="text-gray-600">
                  Reward claiming functionality is currently being developed. Stay tuned for updates!
                </p>
              </div>
              
              <button
                onClick={() => setShowComingSoon(false)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 