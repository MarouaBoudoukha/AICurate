"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Mail, MessageSquare } from 'lucide-react';

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
    <motion.div
      className="p-4 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.button
        onClick={() => router.back()}
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
        Notifications
      </motion.h1>

      {/* Stats Widget */}
      <motion.div
        className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow px-5 py-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <Bell className="w-7 h-7 text-indigo-500" />
          <div>
            <div className="text-xs text-gray-500">Active Notifications</div>
            <div className="text-xl font-bold text-indigo-700">2</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-7 h-7 text-purple-500" />
          <div>
            <div className="text-xs text-gray-500">Email Notifications</div>
            <div className="text-xl font-bold text-purple-700">Enabled</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white rounded-xl shadow-lg p-4 sm:p-6 space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-gray-700">Manage and customize AIcurate Notifications</div>
          <button
            onClick={handleEditClick}
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition"
          >
            Edit
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Email Notifications */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-indigo-500" />
              </div>
              <span>Email Notifications</span>
            </div>
            <button
              className="relative inline-flex items-center cursor-pointer focus:outline-none group"
              aria-pressed={prefs.email}
              onClick={() => handleToggle('email')}
            >
              <span className={`w-10 h-6 rounded-full transition ${prefs.email ? 'bg-indigo-200' : 'bg-gray-200'}`} />
              <span
                className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow transition-transform duration-200 ${prefs.email ? 'bg-indigo-500 translate-x-4' : 'bg-gray-400'}`}
              />
              <span className={`ml-12 text-xs font-semibold ${prefs.email ? 'text-indigo-700' : 'text-gray-500'}`}>
                {prefs.email ? 'On' : 'Off'}
              </span>
            </button>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-indigo-500" />
              </div>
              <span>Push Notifications</span>
            </div>
            <button
              className="relative inline-flex items-center cursor-pointer focus:outline-none group"
              aria-pressed={prefs.push}
              onClick={() => handleToggle('push')}
            >
              <span className={`w-10 h-6 rounded-full transition ${prefs.push ? 'bg-indigo-200' : 'bg-gray-200'}`} />
              <span
                className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow transition-transform duration-200 ${prefs.push ? 'bg-indigo-500 translate-x-4' : 'bg-gray-400'}`}
              />
              <span className={`ml-12 text-xs font-semibold ${prefs.push ? 'text-indigo-700' : 'text-gray-500'}`}>
                {prefs.push ? 'On' : 'Off'}
              </span>
            </button>
          </div>

          {/* Product Updates */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-indigo-500" />
              </div>
              <span>Product Updates</span>
            </div>
            <button
              className="relative inline-flex items-center cursor-pointer focus:outline-none group"
              aria-pressed={prefs.updates}
              onClick={() => handleToggle('updates')}
            >
              <span className={`w-10 h-6 rounded-full transition ${prefs.updates ? 'bg-indigo-200' : 'bg-gray-200'}`} />
              <span
                className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow transition-transform duration-200 ${prefs.updates ? 'bg-indigo-500 translate-x-4' : 'bg-gray-400'}`}
              />
              <span className={`ml-12 text-xs font-semibold ${prefs.updates ? 'text-indigo-700' : 'text-gray-500'}`}>
                {prefs.updates ? 'On' : 'Off'}
              </span>
            </button>
          </div>

          {/* Email Preferences */}
          <div className="py-3">
            <div className="font-semibold text-gray-700 mb-2">Email Preferences</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span>Proof rewards</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span>Upcoming missions</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-500 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span>AI tips</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      {isEditing && (
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
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Email Notifications</span>
                <button
                  className="relative inline-flex items-center cursor-pointer focus:outline-none group"
                  aria-pressed={prefs.email}
                  onClick={() => handleToggle('email')}
                >
                  <span className={`w-10 h-6 rounded-full transition ${prefs.email ? 'bg-indigo-200' : 'bg-gray-200'}`} />
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow transition-transform duration-200 ${prefs.email ? 'bg-indigo-500 translate-x-4' : 'bg-gray-400'}`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Push Notifications</span>
                <button
                  className="relative inline-flex items-center cursor-pointer focus:outline-none group"
                  aria-pressed={prefs.push}
                  onClick={() => handleToggle('push')}
                >
                  <span className={`w-10 h-6 rounded-full transition ${prefs.push ? 'bg-indigo-200' : 'bg-gray-200'}`} />
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow transition-transform duration-200 ${prefs.push ? 'bg-indigo-500 translate-x-4' : 'bg-gray-400'}`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Product Updates</span>
                <button
                  className="relative inline-flex items-center cursor-pointer focus:outline-none group"
                  aria-pressed={prefs.updates}
                  onClick={() => handleToggle('updates')}
                >
                  <span className={`w-10 h-6 rounded-full transition ${prefs.updates ? 'bg-indigo-200' : 'bg-gray-200'}`} />
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 rounded-full shadow transition-transform duration-200 ${prefs.updates ? 'bg-indigo-500 translate-x-4' : 'bg-gray-400'}`}
                  />
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveClick}
                className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
} 