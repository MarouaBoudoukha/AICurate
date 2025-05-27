"use client";
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const router = useRouter();
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button
        onClick={() => router.push('/dashboard')}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        ← Back to Dashboard
      </button>
      <h2 className="text-xl font-bold mb-2">Current Hunt Progress</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-indigo-600">21</span>
          <span className="text-xs text-gray-500">Votes Cast</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-purple-600">7</span>
          <span className="text-xs text-gray-500">Tools Tested</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-bold text-pink-600">4</span>
          <span className="text-xs text-gray-500">Contributions Shared</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <h3 className="font-semibold text-lg mb-1">Reviews</h3>
          <div className="text-3xl font-bold text-blue-600">24</div>
          <p className="text-xs text-gray-500 text-center">Total reviews submitted</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <h3 className="font-semibold text-lg mb-1">Rating</h3>
          <div className="text-3xl font-bold text-blue-600">4.5</div>
          <p className="text-xs text-gray-500 text-center">Average review rating</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <h3 className="font-semibold text-lg mb-1">Influence</h3>
          <div className="text-3xl font-bold text-blue-600">78</div>
          <p className="text-xs text-gray-500 text-center">Community impact score</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <h3 className="font-semibold text-lg mb-1">Performance</h3>
          <div className="text-3xl font-bold text-blue-600">85</div>
          <p className="text-xs text-gray-500 text-center">Overall performance score</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold text-lg mb-4">Activity Timeline</h3>
        <div className="space-y-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
            <div>
              <p className="font-medium">Reviewed AI Art Generator App</p>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
            <div>
              <p className="font-medium">Earned Review Champion NFT</p>
              <p className="text-sm text-gray-600">1 day ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
            <div>
              <p className="font-medium">Completed AI Explorer Challenge</p>
              <p className="text-sm text-gray-600">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 