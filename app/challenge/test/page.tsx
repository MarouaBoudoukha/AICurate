"use client";
import { motion } from 'framer-motion';
import { ArrowLeft, FlaskConical, Star, Upload, Link, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  image?: string;
}

const mockTools: Tool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'Advanced language model for natural conversations',
    rating: 4.8,
    reviews: 1500,
    image: '/tools/chatgpt.png',
  },
  {
    id: '2',
    name: 'Midjourney',
    description: 'AI-powered image generation tool',
    rating: 4.7,
    reviews: 1100,
    image: '/tools/midjourney.png',
  },
  {
    id: '3',
    name: 'Claude',
    description: 'Anthropic\'s AI assistant',
    rating: 4.6,
    reviews: 950,
    image: '/tools/claude.png',
  },
];

const mockTopReviewers = [
  { id: '1', name: 'AI Explorer', points: 1500, reviews: 45 },
  { id: '2', name: 'Tech Guru', points: 1200, reviews: 38 },
  { id: '3', name: 'AI Enthusiast', points: 980, reviews: 32 },
];

export default function TestPage() {
  const router = useRouter();
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [customToolUrl, setCustomToolUrl] = useState('');

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScreenshot(file);
    }
  };

  const handleSubmitReview = () => {
    // In a real app, this would submit the review to the backend
    router.push('/challenge');
  };

  return (
    <motion.div
      className="p-4 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.button
        onClick={() => router.push('/challenge')}
        className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-400 transition flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <ArrowLeft className="w-5 h-5" /> Go Back
      </motion.button>

      <motion.h1
        className="text-2xl font-bold mb-2 text-indigo-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        Test & Review AI Tools
      </motion.h1>

      {/* Tools List */}
      <motion.div
        className="space-y-4 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {mockTools.map((tool, index) => (
          <motion.button
            key={tool.id}
            onClick={() => handleToolSelect(tool)}
            className={`w-full text-left p-4 rounded-xl transition ${
              selectedTool?.id === tool.id
                ? 'bg-indigo-50 border-2 border-indigo-500'
                : 'bg-white shadow-lg hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-4">
              {tool.image && (
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <div>
                <h3 className="font-medium text-gray-900">{tool.name}</h3>
                <p className="text-sm text-gray-600">{tool.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{tool.rating}</span>
                  <span className="text-sm text-gray-500">({tool.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Review Form */}
      {selectedTool && (
        <motion.div
          className="bg-white rounded-xl shadow-lg p-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h2>
          
          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              rows={4}
              placeholder="Share your experience with this tool..."
            />
          </div>

          {/* Screenshot Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Screenshot (optional)</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition cursor-pointer">
                <Upload className="w-4 h-4" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleScreenshotUpload}
                />
              </label>
              {screenshot && (
                <span className="text-sm text-gray-600">{screenshot.name}</span>
              )}
            </div>
          </div>

          {/* Custom Tool URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Custom Tool URL (optional)</label>
            <div className="flex items-center gap-2">
              <Link className="w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={customToolUrl}
                onChange={(e) => setCustomToolUrl(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                placeholder="https://..."
              />
            </div>
          </div>

          <button
            onClick={handleSubmitReview}
            className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition"
          >
            Submit Review
          </button>
        </motion.div>
      )}

      {/* Top Reviewers Leaderboard */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top Reviewers
        </h2>
        <div className="space-y-3">
          {mockTopReviewers.map((reviewer, index) => (
            <div key={reviewer.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-indigo-600">#{index + 1}</span>
                <span className="font-medium text-gray-900">{reviewer.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{reviewer.reviews} reviews</span>
                <span className="text-sm font-medium text-indigo-600">{reviewer.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
} 