"use client";

import AgentGuideScreen from '@/components/AgentGuideScreen';

// Move metadata to viewport export
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4F46E5'
};

export default function GuidePage() {
  return <AgentGuideScreen />;
} 