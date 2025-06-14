import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../lib/types/agent';

export const ProofPointsDisplay: React.FC<{
  userProfile: UserProfile;
  recentEarnings?: number;
}> = ({ userProfile, recentEarnings }) => {
  // Safely access properties with defaults
  const level = (userProfile as any).level || 1;
  const proofPoints = (userProfile as any).proofPoints || 0;
  const badges = (userProfile as any).badges || [];
  const completedTasks = (userProfile as any).completedTasks || [];
  
  const nextLevelAt = level * 1000;
  const currentLevelPoints = proofPoints - ((level - 1) * 1000);
  const progress = (currentLevelPoints / 1000) * 100;

  return (
    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">ProofPoints™</h3>
          <p className="text-purple-200">Level {level} Curator</p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold">
            {proofPoints.toLocaleString()}
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
          <span>Progress to Level {level + 1}</span>
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
        <span>🏆 {badges.length} badges earned</span>
        <span>📈 {completedTasks.length} tasks completed</span>
      </div>
    </div>
  );
}; 