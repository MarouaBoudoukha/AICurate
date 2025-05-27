"use client";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function HuntPage() {
  const router = useRouter();
  return (
    <div className="p-4">
      <button
        onClick={() => router.push('/dashboard')}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        ← Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-6">Start New Hunt</h1>
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">AI Art Explorer</h3>
              <p className="text-sm text-gray-600">Review 5 different AI art generation apps</p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Active
            </span>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Participants: 156</p>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full w-3/5"></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">3/5 completed</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Reward: Miss Artsy NFT</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">
              Join Challenge
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Image Generation Master</h3>
              <p className="text-sm text-gray-600">Compare Midjourney, DALL-E, and Stable Diffusion</p>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Upcoming
            </span>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Participants: 89</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Reward: Exclusive AI Artist Badge</p>
            <button className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md text-sm font-medium">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 