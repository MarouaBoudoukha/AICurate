import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../lib/types/agent';

export const ProofPointsDisplay: React.FC<{
  userProfile: UserProfile;
  recentEarnings?: number;
}> = ({ userProfile, recentEarnings }) => {
  const nextLevelAt = userProfile.level * 1000;
  const currentLevelPoints = userProfile.proofPoints - ((userProfile.level - 1) * 1000);
  const progress = (currentLevelPoints / 1000) * 100;

  return (
    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">ProofPoints™</h3>
          <p className="text-purple-200">Level {userProfile.level} Curator</p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold">
            {userProfile.proofPoints.toLocaleString()}
          </div>
          {recentEarnings && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-200 text-sm"
            >
              +{recentEarnings} earned!
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span>Progress to Level {userProfile.level + 1}</span>
          <span>{currentLevelPoints}/1000</span>
        </div>
        <div className="w-full bg-purple-400 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            className="bg-white h-2 rounded-full"
            transition={{ duration: 1 }}
          />
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-purple-200">
        <span>🏆 {userProfile.badges.length} badges earned</span>
        <span>📈 {userProfile.completedTasks.length} tasks completed</span>
      </div>
    </div>
  );
}; 