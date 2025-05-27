"use client";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const router = useRouter();
  return (
    <motion.div
      className="p-4 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.button
        onClick={() => router.push('/dashboard')}
        className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-400 transition"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        ← Back to Dashboard
      </motion.button>
      <motion.h2
        className="text-2xl font-bold mb-4 text-indigo-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Current Hunt Progress
      </motion.h2>
      <motion.div
        className="grid grid-cols-3 gap-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-indigo-600">21</span>
          <span className="text-xs text-gray-500">Votes Cast</span>
        </div>
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-purple-600">7</span>
          <span className="text-xs text-gray-500">Tools Tested</span>
        </div>
        <div className="bg-gradient-to-br from-pink-100 to-yellow-100 rounded-xl shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-pink-600">4</span>
          <span className="text-xs text-gray-500">Contributions Shared</span>
        </div>
      </motion.div>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center border-t-4 border-indigo-200">
          <h3 className="font-semibold text-lg mb-1 text-indigo-700">Reviews</h3>
          <div className="text-3xl font-bold text-blue-600">24</div>
          <p className="text-xs text-gray-500 text-center">Total reviews submitted</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center border-t-4 border-purple-200">
          <h3 className="font-semibold text-lg mb-1 text-purple-700">Rating</h3>
          <div className="text-3xl font-bold text-blue-600">4.5</div>
          <p className="text-xs text-gray-500 text-center">Average review rating</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center border-t-4 border-green-200">
          <h3 className="font-semibold text-lg mb-1 text-green-700">Influence</h3>
          <div className="text-3xl font-bold text-blue-600">78</div>
          <p className="text-xs text-gray-500 text-center">Community impact score</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center border-t-4 border-pink-200">
          <h3 className="font-semibold text-lg mb-1 text-pink-700">Performance</h3>
          <div className="text-3xl font-bold text-blue-600">85</div>
          <p className="text-xs text-gray-500 text-center">Overall performance score</p>
        </div>
      </motion.div>
      <motion.div
        className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-xl shadow-lg p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h3 className="font-semibold text-lg mb-4 text-indigo-700">Activity Timeline</h3>
        <div className="space-y-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
            <div>
              <p className="font-medium">Reviewed AI Art Generator App</p>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-purple-600"></div>
            <div>
              <p className="font-medium">Earned Review Champion NFT</p>
              <p className="text-sm text-gray-600">1 day ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-pink-600"></div>
            <div>
              <p className="font-medium">Completed AI Explorer Challenge</p>
              <p className="text-sm text-gray-600">3 days ago</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 