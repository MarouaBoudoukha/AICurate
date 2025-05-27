"use client";
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EducatePage() {
  const router = useRouter();
  return (
    <motion.div
      className="p-4 max-w-md mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.button
        onClick={() => router.push('/hunt')}
        className="mb-4 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded hover:bg-green-200 focus:ring-2 focus:ring-green-400 transition flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <ArrowLeft className="w-5 h-5" /> Go Back
      </motion.button>
      <motion.h1
        className="text-2xl font-bold mb-2 text-green-600 flex items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <BookOpen className="w-7 h-7 text-green-500" />
        Create and share tutorials or guides to help others use AI tools
      </motion.h1>
      <motion.p
        className="mb-4 text-gray-600 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        (More details coming soon)
      </motion.p>
    </motion.div>
  );
} 