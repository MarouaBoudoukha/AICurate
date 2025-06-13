"use client";

import React from 'react';
import AICurateIntegration from '../components/AICurateIntegration';

// Mock user for testing
const mockUser = {
  id: 'test-user-123',
  name: 'Test User',
  experienceLevel: 'beginner' as const,
  preferences: {
    budget: 'free' as const,
    complexity: 'simple' as const,
    useCase: 'personal' as const,
  }
};

export default function GuidePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">AI Tool Guide</h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Discover the perfect AI tools for your needs using our TASKS™ methodology. 
          I&apos;ll research the latest tools in real-time and give you personalized recommendations in just 3 minutes!
        </p>
      </div>

      {/* Quick Start Prompts */}
      <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm mb-6">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Try these prompts:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "I want to create better social media content",
            "Help me automate my business processes", 
            "I need AI for writing and research",
            "Find tools for video editing and creation"
          ].map((prompt, index) => (
            <button 
              key={index}
              onClick={() => {/* You can implement auto-fill functionality */}}
              className="text-left p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 transition-colors"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>
      </div>

      <AICurateIntegration 
        userId={mockUser.id} 
        showChatInterface={true}
      />
    </div>
  );
} 