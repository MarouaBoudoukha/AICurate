"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface TrendingApp {
  id: string;
  name: string;
  category: string;
  rating: { human: number; ai: number };
  reviews: number;
  location: string;
  icon: string;
  description: string;
}

const trendingApps: TrendingApp[] = [
  {
    id: '1',
    name: 'Midjourney',
    category: 'Image Generation',
    rating: { human: 4.8, ai: 4.9 },
    reviews: 1250,
    location: 'Global',
    icon: '🎨',
    description: 'Advanced AI image generation platform'
  },
  {
    id: '2',
    name: 'ChatGPT',
    category: 'Text Generation',
    rating: { human: 4.9, ai: 4.8 },
    reviews: 2500,
    location: 'Global',
    icon: '💬',
    description: 'Leading conversational AI model'
  }
];

const categories = [
  'All',
  'Image Generation',
  'Text Generation',
  'Audio Processing',
  'Video Creation',
  'Code Generation'
];

export default function TrendingPage() {
  const router = useRouter();
  const [filterCategory, setFilterCategory] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('rating');

  const sortApps = (apps: TrendingApp[]): TrendingApp[] => {
    return [...apps].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating.human + b.rating.ai) / 2 - (a.rating.human + a.rating.ai) / 2;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });
  };

  const filterApps = (apps: TrendingApp[]): TrendingApp[] => {
    if (filterCategory === 'all') return apps;
    return apps.filter(app => app.category === filterCategory);
  };

  const filteredApps = filterApps(trendingApps);
  const sortedApps = sortApps(filteredApps);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button
        onClick={() => router.push('/dashboard')}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        ← Back to Dashboard
      </button>
      <h2 className="text-xl font-bold mb-4">Trending Apps</h2>
      <div className="flex flex-col space-y-2 mb-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map((category) => (
            <option key={category} value={category.toLowerCase()}>
              {category}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="rating">Sort by Rating</option>
          <option value="reviews">Sort by Reviews</option>
          <option value="location">Sort by Location</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {sortedApps.map((app: TrendingApp) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{app.icon}</span>
                <div>
                  <h4 className="font-semibold text-black">{app.name}</h4>
                  <p className="text-sm text-gray-600">{app.category}</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {app.location}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{app.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Human Rating</span>
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="font-medium">{app.rating.human}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">AI Rating</span>
                <div className="flex items-center">
                  <span className="text-purple-400 mr-1">★</span>
                  <span className="font-medium">{app.rating.ai}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Reviews</span>
                <span className="font-medium">{app.reviews}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 