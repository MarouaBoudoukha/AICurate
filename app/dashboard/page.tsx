"use client";
import { useRouter } from 'next/navigation';
import { UserCircle, Camera, Bot, BarChart3, Trophy, Wallet, Crown, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import React, { useRef, useEffect, useState } from 'react';
import { useUnifiedSession } from '@/hooks/useUnifiedSession';
import { useProfileData } from '@/hooks/useProfileData';
import Image from 'next/image';

// ProofProfile Home Screen (formerly Dashboard)
export default function ProofProfile() {
  const router = useRouter();
  const unifiedSession = useUnifiedSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use profile data hook for proper synchronization
  const { data: profileData, isLoading: profileLoading, refetch } = useProfileData(unifiedSession.user?.id);
  
  // State declarations must come before any conditional logic
  const [proofPoints, setProofPoints] = useState(50);
  const [credits, setCredits] = useState(3);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Redirect to landing if not authenticated
  useEffect(() => {
    if (unifiedSession.status === 'unauthenticated') {
      router.push('/landing');
    }
  }, [unifiedSession.status, router]);

  // Update local state when profile data changes
  useEffect(() => {
    if (profileData) {
      setProofPoints(profileData.proofPoints || 50);
      // Keep credits as is for now, or set to a default
      setCredits(3);
    }
  }, [profileData]);

  // Show loading state
  if (unifiedSession.status === 'loading' || profileLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // Get user data from session or use defaults
  const username = unifiedSession.user?.name || profileData?.name || 'Explorer';
  const userAvatar = profileData?.avatar;

  // Avatar upload handler with DB sync
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !unifiedSession.user?.id) return;

    setUploadingAvatar(true);
    
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', unifiedSession.user.id);

      const response = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Avatar uploaded successfully:', result);
        
        // Refetch profile data to get updated avatar
        await refetch();
      } else {
        const error = await response.json();
        console.error('Avatar upload failed:', error);
        alert('Failed to upload avatar. Please try again.');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const sectionItems = [
    {
      label: 'Analytics',
      desc: '2 reviews left in current hunt',
      color: 'text-indigo-600',
      bgColor: 'from-indigo-50 to-indigo-100',
      icon: BarChart3,
      iconColor: 'text-indigo-500',
      to: '/analytics',
    },
    {
      label: 'Leaderboard',
      desc: 'Top 10% of Explorers',
      color: 'text-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      icon: Crown,
      iconColor: 'text-purple-500',
      to: '/leaderboard',
    },
    {
      label: 'Trophy Wall',
      desc: 'View your collected badges',
      color: 'text-yellow-600',
      bgColor: 'from-yellow-50 to-yellow-100',
      icon: Trophy,
      iconColor: 'text-yellow-500',
      to: '/trophy',
    },
    {
      label: 'Wallet',
      desc: 'Phoenix Coins staked here',
      color: 'text-pink-600',
      bgColor: 'from-pink-50 to-pink-100',
      icon: Wallet,
      iconColor: 'text-pink-500',
      to: '/settings/wallet',
    },
  ];

  return (
    <motion.div
      className="max-w-sm mx-auto px-4 py-6 w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Top: Welcome & Avatar */}
      <motion.div
        className="flex flex-col items-center mb-4"
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
            {userAvatar ? (
              <Image 
                src={userAvatar} 
                alt="Profile"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle className="w-16 h-16 text-white/80" />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow group-hover:bg-indigo-100 transition-colors">
              {uploadingAvatar ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              ) : (
                <Camera className="w-5 h-5 text-indigo-500" />
              )}
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

      {/* ProofPoints & Credits - Using same icons as Wallet */}
      <motion.div
        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image src="/badges/coin.PNG" alt="ProofPoints" width={32} height={32} />
            <div>
              <div className="text-xs text-gray-500">ProofPoints™</div>
              <div className="text-lg font-bold text-orange-700">{proofPoints.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-xs text-gray-500">Credits</div>
              <div className="text-lg font-bold text-purple-700">{credits}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Ask AI Guide Button */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <motion.button
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/guide')}
        >
          <Bot className="w-5 h-5" />
          Ask your AI Guide
        </motion.button>
      </motion.div>

      {/* Main Actions */}
      <motion.div
        className="flex flex-col gap-3 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.button
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg shadow-lg transition-all focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/challenge/start')}
        >
          Start New Hunt
        </motion.button>
      </motion.div>

      {/* Section Cards - Dynamic and Animated */}
      <motion.div
        className="grid grid-cols-2 gap-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {sectionItems.map((item, i) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={item.label}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
            >
              <motion.button
                onClick={() => router.push(item.to)}
                className={`w-full p-4 bg-gradient-to-br ${item.bgColor} rounded-xl shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300 group`}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    className={`w-10 h-10 ${item.iconColor} mb-2 group-hover:scale-110 transition-transform`}
                    whileHover={{ rotate: 5 }}
                  >
                    <IconComponent className="w-full h-full" />
                  </motion.div>
                  <div className={`text-sm font-semibold ${item.color} mb-1`}>
                    {item.label}
                  </div>
                  <div className="text-xs text-gray-500 leading-tight">
                    {item.desc}
                  </div>
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
} 