'use client';

import { useState, useEffect } from 'react';
import { UserProfile, AgentResponse, AITool, TasksSession } from '../types/agent';

export function useAICurate(userId: string) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentSession, setCurrentSession] = useState<TasksSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/user/${userId}`);
      const data = await res.json();
      setUserProfile(data);
      setIsLoading(false);
    }
    fetchUser();
  }, [userId]);

  const createSession = async (sessionData: Partial<TasksSession>) => {
    const res = await fetch('/api/session', {
      method: 'POST',
      body: JSON.stringify(sessionData),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    setCurrentSession(data);
    return data;
  };

  const updateSession = async (sessionData: Partial<TasksSession>) => {
    const res = await fetch('/api/session', {
      method: 'PUT',
      body: JSON.stringify(sessionData),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    setCurrentSession(data);
    return data;
  };

  const fetchSession = async (id: string) => {
    const res = await fetch(`/api/session?id=${id}`);
    const data = await res.json();
    setCurrentSession(data);
    return data;
  };

  const processUserInput = async (input: string): Promise<AgentResponse> => {
    // In a real app, this would call your backend API
    // For now, we'll return mock responses
    return {
      message: "I understand you're looking for AI tools. Let me help you find the perfect match.",
      data: {
        userType: 'individual',
        nextStep: 'assess',
        nextStepPreview: 'Understanding your needs better',
        tools: [
          {
            name: 'Example Tool',
            description: 'A powerful AI tool for your needs',
            category: 'Productivity',
            pricing: {
              model: 'freemium',
              details: 'Free tier available'
            },
            features: ['Feature 1', 'Feature 2'],
            complexity: 'simple',
            rating: 4.5,
            reviews: 100,
            url: 'https://example.com'
          }
        ]
      },
      clarifyingQuestion: "What specific tasks are you looking to accomplish?",
      nextStep: 'assess'
    };
  };

  return {
    userProfile,
    currentSession,
    createSession,
    updateSession,
    fetchSession,
    processUserInput,
    isLoading
  };
} 