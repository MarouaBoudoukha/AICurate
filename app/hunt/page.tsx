"use client";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Rocket, ThumbsUp, Share2, FlaskConical, Award, BookOpen, PlusCircle, ChevronRight, Coins } from 'lucide-react';

const huntSections = [
  {
    label: 'Start a Hunt',
    icon: Rocket,
    color: 'text-indigo-600',
    path: '/hunt/start',
  },
  {
    label: 'Vote',
    icon: ThumbsUp,
    color: 'text-purple-600',
    path: '/hunt/vote',
  },
  {
    label: 'Share',
    icon: Share2,
    color: 'text-pink-500',
    path: '/hunt/share',
  },
  {
    label: 'Test',
    icon: FlaskConical,
    color: 'text-blue-500',
    path: '/hunt/test',
  },
  {
    label: 'Claim',
    icon: Award,
    color: 'text-yellow-500',
    path: '/hunt/claim',
  },
  {
    label: 'Educate',
    icon: BookOpen,
    color: 'text-green-600',
    path: '/hunt/educate',
  },
  {
    label: 'List Your AI App',
    icon: PlusCircle,
    color: 'text-indigo-500',
    path: '/hunt/list',
  },
];

export default function HuntPage() {
  const router = useRouter();
  const credits = 3; // Replace with real credits logic if available

  return (
    <motion.div
      className="p-4 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.h1
        className="text-2xl font-bold mb-6 text-indigo-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        AI Tool Hunt
      </motion.h1>
      {/* Credits Widget */}
      <motion.div
        className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow px-5 py-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <Coins className="w-7 h-7 text-yellow-500" />
          <div>
            <div className="text-xs text-gray-500">Credits Available</div>
            <div className="text-xl font-bold text-indigo-700">{credits}</div>
          </div>
        </div>
        <button className="ml-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-lg font-semibold shadow hover:from-yellow-500 hover:to-pink-600 focus:ring-2 focus:ring-pink-300 transition">
          Buy More
        </button>
      </motion.div>
      {/* Hunt Sections */}
      <motion.div
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } }
        }}
      >
        {huntSections.map((section, i) => (
          <motion.button
            key={section.label}
            className="w-full flex items-center justify-between bg-white rounded-xl shadow-lg px-4 py-4 hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-300 transition group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
            onClick={() => router.push(section.path)}
          >
            <div className="flex items-center gap-4">
              <section.icon className={`w-6 h-6 ${section.color} group-hover:scale-110 transition-transform`} />
              <span className="font-medium text-gray-900 text-base">{section.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition" />
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
} 