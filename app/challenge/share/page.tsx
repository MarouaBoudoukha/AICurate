"use client";
import { motion } from 'framer-motion';
import { ArrowLeft, Twitter, Linkedin, Instagram, Share2, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const templates = [
  {
    id: '1',
    title: 'AI Tool Discovery',
    content: 'Just discovered an amazing AI tool on #ProofHunt! 🚀 #AI #AICurate',
    platforms: ['twitter', 'linkedin'],
  },
  {
    id: '2',
    title: 'Challenge Completion',
    content: 'Completed my first AI challenge on #ProofHunt! Earned 50 ProofPoints™ and a new badge 🏆 #AI #AICurate',
    platforms: ['twitter', 'linkedin', 'instagram'],
  },
  {
    id: '3',
    title: 'Tool Review',
    content: 'Check out my review of this incredible AI tool on #ProofHunt! #AI #AICurate',
    platforms: ['twitter', 'linkedin'],
  },
];

const platformIcons = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
};

export default function SharePage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [copied, setCopied] = useState(false);
  const [shares, setShares] = useState(0);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedTemplate.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    // In a real app, this would integrate with the platform's sharing API
    setShares(prev => prev + 1);
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
        Share on Social
      </motion.h1>

      {/* Share Stats */}
      <motion.div
        className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow px-5 py-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Share2 className="w-7 h-7 text-indigo-500" />
            <div>
              <div className="text-xs text-gray-500">Total Shares</div>
              <div className="text-xl font-bold text-indigo-700">{shares}</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Earn 15 ProofPoints™ per verified share
          </div>
        </div>
      </motion.div>

      {/* Templates */}
      <motion.div
        className="space-y-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {templates.map((template) => (
          <motion.button
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className={`w-full text-left p-4 rounded-xl transition ${
              selectedTemplate.id === template.id
                ? 'bg-indigo-50 border-2 border-indigo-500'
                : 'bg-white shadow-lg hover:bg-gray-50'
            }`}
          >
            <h3 className="font-medium text-gray-900 mb-1">{template.title}</h3>
            <p className="text-sm text-gray-600">{template.content}</p>
          </motion.button>
        ))}
      </motion.div>

      {/* Share Preview */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Preview</h2>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-gray-800">{selectedTemplate.content}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {selectedTemplate.platforms.map((platform) => {
              const Icon = platformIcons[platform as keyof typeof platformIcons];
              return (
                <button
                  key={platform}
                  onClick={() => handleShare(platform)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                </button>
              );
            })}
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 