"use client";
import { useRouter } from 'next/navigation';

export default function LeaderboardPage() {
  const router = useRouter();
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button
        onClick={() => router.push('/dashboard')}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        ← Back to Dashboard
      </button>
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-lg font-semibold">Rank Breakdown of all hunters:</div>
        <div>
          <label className="text-xs text-gray-500 mr-2">Sort by:</label>
          <select className="px-2 py-1 border rounded" defaultValue="tribe">
            <option value="tribe">Tribe</option>
            <option value="continent">Continent</option>
            <option value="country">Country</option>
          </select>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow divide-y">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-800 rounded-full font-bold">1</div>
            <div>
              <h4 className="font-semibold">Top Explorer</h4>
              <p className="text-xs text-gray-600">1350 pts</p>
            </div>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-800 rounded-full font-bold">2</div>
            <div>
              <h4 className="font-semibold">Elite Hunter</h4>
              <p className="text-xs text-gray-600">1500 pts</p>
            </div>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center bg-pink-100 text-pink-800 rounded-full font-bold">3</div>
            <div>
              <h4 className="font-semibold">Master Scout</h4>
              <p className="text-xs text-gray-600">1750 pts</p>
            </div>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 text-yellow-800 rounded-full font-bold">4</div>
            <div>
              <h4 className="font-semibold">Legendary Curator</h4>
              <p className="text-xs text-gray-600">2000 pts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 