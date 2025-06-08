"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SubscriptionPlan() {
  const router = useRouter();
  const [showComparison, setShowComparison] = useState(false);

  const handleSeeAllPlansClick = () => {
    setShowComparison(true);
  };

  const handleCloseComparison = () => {
    setShowComparison(false);
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <button className="text-gray-500 hover:text-indigo-500" onClick={() => router.back()}>
          <span className="text-2xl">&larr;</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">Subscription Plan</h2>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 space-y-6">
        {/* Current Plan Section */}
        <div className="flex items-center justify-between gap-2 pb-3 border-b">
          <div className="font-semibold text-gray-700">Your Plan</div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">Free</span>
        </div>
        {/* Benefits Section */}
        <div className="space-y-1">
          <div className="font-semibold text-gray-700 mb-1">Benefits</div>
          <ul className="list-disc list-inside text-gray-600 text-sm space-y-0.5">
            <li>Basic access to all features</li>
            <li>3 free credits per month</li>
            <li>Access to community support</li>
          </ul>
        </div>
        {/* Upgrade Options Section */}
        <div className="space-y-2">
          <div className="font-semibold text-gray-700 mb-1">Upgrade Options</div>
          <button className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition" onClick={handleSeeAllPlansClick}>See all plans</button>
        </div>
        {/* Billing Info Section */}
        <div className="space-y-1">
          <div className="font-semibold text-gray-700 mb-1">Billing Info & History</div>
          <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-500">
            <p>Current Billing: $0 (Free Plan)</p>
            <p>Last Payment: N/A</p>
            <p>Next Billing Date: N/A</p>
          </div>
        </div>
        {/* Upgrade Button */}
        <button className="w-full mt-2 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold text-base transition" onClick={handleSeeAllPlansClick}>Upgrade Plan</button>
      </div>
      {showComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">Plan Comparison</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Plan</th>
                  <th className="border p-2">Features</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Free</td>
                  <td className="border p-2">Basic access, 3 credits/month</td>
                  <td className="border p-2">$0</td>
                  <td className="border p-2"><button className="px-3 py-1 bg-indigo-500 text-white rounded-lg">Upgrade</button></td>
                </tr>
                <tr>
                  <td className="border p-2">Premium</td>
                  <td className="border p-2">Full access, 50 credits/month</td>
                  <td className="border p-2">$5/month</td>
                  <td className="border p-2"><button className="px-3 py-1 bg-indigo-500 text-white rounded-lg">Upgrade</button></td>
                </tr>
                <tr>
                  <td className="border p-2">Builder</td>
                  <td className="border p-2">Full access, 200 credits/month</td>
                  <td className="border p-2">$10/month</td>
                  <td className="border p-2"><button className="px-3 py-1 bg-indigo-500 text-white rounded-lg">Upgrade</button></td>
                </tr>
                <tr>
                  <td className="border p-2">Educator</td>
                  <td className="border p-2">Full access, 500 credits/month</td>
                  <td className="border p-2">$15/month</td>
                  <td className="border p-2"><button className="px-3 py-1 bg-indigo-500 text-white rounded-lg">Upgrade</button></td>
                </tr>
              </tbody>
            </table>
            <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg" onClick={handleCloseComparison}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
} 