"use client";
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, FileText, Video, Mic, Image as ImageIcon, Star, Trophy, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

interface ContentTemplate {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'podcast' | 'tutorial';
  points: number;
  icon: any;
  requirements: string[];
}

const contentTemplates: ContentTemplate[] = [
  {
    id: '1',
    title: 'AI Tool Review Article',
    description: 'Write a detailed review of an AI tool, including features, pros, and cons',
    type: 'article',
    points: 150,
    icon: FileText,
    requirements: [
      'Minimum 1000 words',
      'Include screenshots',
      'Compare with alternatives',
      'Add use cases'
    ],
  },
  {
    id: '2',
    title: 'Video Tutorial',
    description: 'Create a step-by-step video guide for using an AI tool',
    type: 'video',
    points: 200,
    icon: Video,
    requirements: [
      'Minimum 5 minutes',
      'Clear audio quality',
      'Show practical examples',
      'Include timestamps'
    ],
  },
  {
    id: '3',
    title: 'AI Podcast Episode',
    description: 'Record a podcast discussing AI tools and their impact',
    type: 'podcast',
    points: 180,
    icon: Mic,
    requirements: [
      'Minimum 15 minutes',
      'Professional audio',
      'Include show notes',
      'Add timestamps'
    ],
  },
  {
    id: '4',
    title: 'Visual Tutorial',
    description: 'Create an infographic or visual guide for an AI tool',
    type: 'tutorial',
    points: 120,
    icon: ImageIcon,
    requirements: [
      'High-quality images',
      'Clear instructions',
      'Include examples',
      'Add annotations'
    ],
  },
];

const mockTopCreators = [
  { id: '1', name: 'AI Educator', points: 2500, content: 15 },
  { id: '2', name: 'Tech Writer', points: 1800, content: 12 },
  { id: '3', name: 'Content Creator', points: 1500, content: 10 },
];

export default function EducatePage() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const handleTemplateSelect = (template: ContentTemplate) => {
    setSelectedTemplate(template);
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setMediaFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = () => {
    // In a real app, this would submit the content to the backend
    setShowSubmissionModal(false);
    setSelectedTemplate(null);
    setContent('');
    setTitle('');
    setMediaFiles([]);
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
        Educate & Write
      </motion.h1>

      <Image 
        src="/images/educate.png" 
        alt="Education illustration"
        width={800}
        height={400}
        className="w-full h-auto"
      />

      <p className="text-gray-600">
        Let&apos;s explore the fascinating world of AI together!
      </p>

      {/* Content Templates */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          Choose Content Type
        </h2>
        <div className="space-y-4">
          {contentTemplates.map((template) => (
            <motion.button
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className={`w-full text-left p-4 rounded-xl transition ${
                selectedTemplate?.id === template.id
                  ? 'bg-indigo-50 border-2 border-indigo-500'
                  : 'bg-white shadow-lg hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <template.icon className={`w-8 h-8 ${template.type === 'article' ? 'text-blue-500' : 
                  template.type === 'video' ? 'text-red-500' : 
                  template.type === 'podcast' ? 'text-purple-500' : 'text-green-500'}`} />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{template.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-gray-900">{template.points} pts</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {template.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Content Creation Form */}
      {selectedTemplate && (
        <motion.div
          className="bg-white rounded-xl shadow-lg p-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Your Content</h2>
          
          {/* Title Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              placeholder="Enter your content title..."
            />
          </div>

          {/* Content Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              rows={6}
              placeholder="Write your content here..."
            />
          </div>

          {/* Media Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Media Files</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition cursor-pointer">
                <ImageIcon className="w-4 h-4" />
                Upload
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
              </label>
              {mediaFiles.length > 0 && (
                <span className="text-sm text-gray-600">{mediaFiles.length} files selected</span>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowSubmissionModal(true)}
            className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition"
          >
            Submit Content
          </button>
        </motion.div>
      )}

      {/* Top Creators Leaderboard */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Top Content Creators
        </h2>
        <div className="space-y-3">
          {mockTopCreators.map((creator, index) => (
            <div key={creator.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-indigo-600">#{index + 1}</span>
                <span className="font-medium text-gray-900">{creator.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{creator.content} pieces</span>
                <span className="text-sm font-medium text-indigo-600">{creator.points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Submission Modal */}
      {showSubmissionModal && selectedTemplate && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Submit Content</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your {selectedTemplate.type}? You&apos;ll earn {selectedTemplate.points} points upon approval.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
} 