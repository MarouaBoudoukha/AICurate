"use client";
import { motion } from 'framer-motion';
import { Coins, Gift, Award, Rocket, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const credits = 3; // Placeholder value

const upcomingHunts = [
  { title: 'Feedback Provider', reward: '15 ProofPoints™ bonus per review' },
  { title: 'Edge Community Meme Hunt', reward: '44 Proofpoints™ (tokens) + Edge Pioneer Badge' },
  { title: 'The big AI Hunt', reward: '100 Proofpoints™ (tokens) + AUCURATE Pioneer Badge' },
];
const ongoingHunts = [
  { title: 'Verification Pro', reward: '75 ProofPoints™ + Verified Voice Badge' },
  { title: 'Social Sharer', reward: '15 ProofPoints™ per share (daily limit)' },
  { title: 'Friend Referral', reward: '100 ProofPoints™ per verified friend' },
];
const previousHunts = [
  { title: 'First Review hunt', reward: 'Earn 5 ProofPoints™ + Rookie Reviewer Badge' },
  { title: 'Daily Curator', reward: '20 ProofPoints™ + Daily Streak Multiplier' },
  { title: 'Tool Explorer', reward: '50 ProofPoints™ + Explorer Badge' },
];

export default function StartHuntPage() {
  const router = useRouter();
  return (
    <motion.div
      className="p-4 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.button
        onClick={() => router.push('/hunt')}
        className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-400 transition flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <ArrowLeft className="w-5 h-5" /> Go Back
      </motion.button>
      <motion.h1
        className="text-2xl font-bold mb-4 text-indigo-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        Start a Hunt
      </motion.h1>
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
      <motion.div className="space-y-6" initial="hidden" animate="visible" variants={{hidden: {},visible: { transition: { staggerChildren: 0.08 } }}}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
          <h2 className="text-lg font-semibold text-indigo-700 mb-2">Upcoming Hunts</h2>
          <div className="space-y-3">
            {upcomingHunts.map((hunt, i) => (
              <div key={hunt.title} className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
                <Rocket className="w-6 h-6 text-indigo-500" />
                <div>
                  <div className="font-semibold text-gray-900">{hunt.title}</div>
                  <div className="text-xs text-gray-500">{hunt.reward}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
          <h2 className="text-lg font-semibold text-purple-700 mb-2">On-going Hunts</h2>
          <div className="space-y-3">
            {ongoingHunts.map((hunt, i) => (
              <div key={hunt.title} className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
                <Gift className="w-6 h-6 text-purple-500" />
                <div>
                  <div className="font-semibold text-gray-900">{hunt.title}</div>
                  <div className="text-xs text-gray-500">{hunt.reward}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
          <h2 className="text-lg font-semibold text-pink-700 mb-2">Previous Hunts</h2>
          <div className="space-y-3">
            {previousHunts.map((hunt, i) => (
              <div key={hunt.title} className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
                <Award className="w-6 h-6 text-pink-500" />
                <div>
                  <div className="font-semibold text-gray-900">{hunt.title}</div>
                  <div className="text-xs text-gray-500">{hunt.reward}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 