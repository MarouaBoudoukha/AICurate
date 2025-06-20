"use client";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Star, Clock } from 'lucide-react';

const aiToolsHistory = [
  {
    id: 1,
    name: "ChatGPT",
    description: "Conversational AI for writing, coding, and analysis",
    category: "Writing & Productivity",
    rating: 4.8,
    recommendedAt: "2 days ago",
    website: "https://chat.openai.com"
  },
  {
    id: 2,
    name: "Midjourney",
    description: "AI image generation for creative projects",
    category: "Image Generation",
    rating: 4.7,
    recommendedAt: "5 days ago",
    website: "https://midjourney.com"
  },
  {
    id: 3,
    name: "GitHub Copilot",
    description: "AI pair programmer for code completion",
    category: "Development",
    rating: 4.6,
    recommendedAt: "1 week ago",
    website: "https://github.com/features/copilot"
  }
];

export default function AIPicksHistoryPage() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  const handleToolClick = (website: string) => {
    window.open(website, '_blank');
  };

  return (
    <motion.div
      className="max-w-sm mx-auto px-4 py-6 w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <button
          onClick={handleBackClick}
          className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">AI Picks History</h1>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="text-gray-600 mb-6 text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        AI tools recommended by your AI Guide
      </motion.p>

      {/* AI Tools List */}
      <motion.div
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        {aiToolsHistory.map((tool, index) => (
          <motion.div
            key={tool.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer"
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 }
            }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
            onClick={() => handleToolClick(tool.website)}
          >
            <div className="flex items-start gap-3">
              {/* Tool Icon */}
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">
                  {tool.name.charAt(0)}
                </span>
              </div>

              {/* Tool Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {tool.name}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                </div>

                <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                  {tool.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {tool.category}
                  </span>
                  
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{tool.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{tool.recommendedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
} 