"use client";
import { useRouter } from 'next/navigation';
import { Trophy } from 'lucide-react';

export default function TrophyPage() {
  const router = useRouter();
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button
        onClick={() => router.push('/dashboard')}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        ← Back to Dashboard
      </button>
      <h2 className="text-xl font-bold mb-4">Trophy Wall</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <Trophy className="w-8 h-8 text-yellow-500 mb-2" />
          <div className="font-semibold">Level 5 — Seasoned Explorer</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <Trophy className="w-8 h-8 text-blue-500 mb-2" />
          <div className="font-semibold">Top Curator — 100 ProofPoints™ in the Vault</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <Trophy className="w-8 h-8 text-green-500 mb-2" />
          <div className="font-semibold">OG Status — Fearless Tester</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <Trophy className="w-8 h-8 text-orange-500 mb-2" />
          <div className="font-semibold">3 Trophies Earned — Bronze Cup</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <Trophy className="w-8 h-8 text-purple-500 mb-2" />
          <div className="font-semibold">Top 3 Clan Rank — Wisdom Clan</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
          <Trophy className="w-8 h-8 text-pink-500 mb-2" />
          <div className="font-semibold">7 Badges Collected — On a roll!</div>
        </div>
      </div>
    </div>
  );
} 