"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Notifications() {
  const router = useRouter();
  const [prefs, setPrefs] = useState({
    email: true,
    push: false,
    updates: true,
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleToggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <button className="text-gray-500 hover:text-indigo-500" onClick={() => router.back()}>
          <span className="text-2xl">&larr;</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">Notifications</h2>
        <button className="text-indigo-500 hover:text-indigo-700" onClick={handleEditClick}>Edit</button>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
        <div className="font-semibold text-gray-700 mb-4">Manage and customize AIcurate Notifications</div>
        <div className="divide-y divide-gray-100">
          {/* Email Notifications */}
          <div className="flex items-center justify-between py-3">
            <span>Email Notifications</span>
            <button
              className="relative inline-flex items-center cursor-pointer focus:outline-none group"
              aria-pressed={prefs.email}
              onClick={() => handleToggle('email')}
            >
              <span className={`w-10 h-6 rounded-full transition ${prefs.email ? 'bg-green-200' : 'bg-gray-200'}`} />
              <span
                className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow transition-transform duration-200 ${prefs.email ? 'bg-green-500 translate-x-4' : 'bg-gray-400'}`}
              />
              <span className={`ml-12 text-xs font-semibold ${prefs.email ? 'text-green-700' : 'text-gray-500'}`}>{prefs.email ? 'On' : 'Off'}</span>
            </button>
          </div>
          {/* Push Notifications */}
          <div className="flex items-center justify-between py-3">
            <span>Push Notifications</span>
            <button
              className="relative inline-flex items-center cursor-pointer focus:outline-none group"
              aria-pressed={prefs.push}
              onClick={() => handleToggle('push')}
            >
              <span className={`w-10 h-6 rounded-full transition ${prefs.push ? 'bg-green-200' : 'bg-gray-200'}`} />
              <span
                className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow transition-transform duration-200 ${prefs.push ? 'bg-green-500 translate-x-4' : 'bg-gray-400'}`}
              />
              <span className={`ml-12 text-xs font-semibold ${prefs.push ? 'text-green-700' : 'text-gray-500'}`}>{prefs.push ? 'On' : 'Off'}</span>
            </button>
          </div>
          {/* Product Updates */}
          <div className="flex items-center justify-between py-3">
            <span>Product Updates</span>
            <button
              className="relative inline-flex items-center cursor-pointer focus:outline-none group"
              aria-pressed={prefs.updates}
              onClick={() => handleToggle('updates')}
            >
              <span className={`w-10 h-6 rounded-full transition ${prefs.updates ? 'bg-green-200' : 'bg-gray-200'}`} />
              <span
                className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow transition-transform duration-200 ${prefs.updates ? 'bg-green-500 translate-x-4' : 'bg-gray-400'}`}
              />
              <span className={`ml-12 text-xs font-semibold ${prefs.updates ? 'text-green-700' : 'text-gray-500'}`}>{prefs.updates ? 'On' : 'Off'}</span>
            </button>
          </div>
          {/* Email Preferences */}
          <div className="py-3">
            <div className="font-semibold text-gray-700 mb-2">Email Preferences</div>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Proof rewards</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Upcoming missions</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>AI tips</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-2">Edit Notification Preferences</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Email Notifications</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Push Notifications</span>
              </div>
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Product Updates</span>
              </div>
            </div>
            <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg" onClick={handleSaveClick}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
} 