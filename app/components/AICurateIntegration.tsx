import React from 'react';
import { useAICurate } from '../lib/hooks/useAICurate';
import AgentChatInterface from './AgentChatInterface';
import { LevelUpCelebration } from './LevelUpCelebration';

interface AICurateIntegrationProps {
  userId: string;
  showChatInterface?: boolean;
}

export default function AICurateIntegration({ userId, showChatInterface = true }: AICurateIntegrationProps) {
  const { userProfile, currentSession, isLoading, error } = useAICurate(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center p-4">
        <p>Please sign in to access the AI Guide</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {!showChatInterface && (
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold mb-4">Welcome to AI Guide</h2>
          <p className="mb-4">I&apos;m here to help you find the perfect AI tools for your needs.</p>
          <button
            onClick={() => window.location.href = '/guide'}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600"
          >
            Start Chatting
          </button>
        </div>
      )}

      <div className="flex-1 p-4">
        {showChatInterface && <AgentChatInterface userId={userId} />}
      </div>

      <LevelUpCelebration />
    </div>
  );
} 