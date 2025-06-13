"use client";
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft, CheckCircle, XCircle, Twitter, Linkedin, User, MapPin, Globe } from 'lucide-react';
import { useUnifiedSession } from '@/hooks/useUnifiedSession';

interface UserProfile {
  id: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  isVerified: boolean;
  worldcoinId: string | null;
  region: string | null;
  bio: string | null;
  interests: string[];
  experienceLevel: string;
  preferences: {
    language?: string;
    socials?: {
      twitter?: string;
      linkedin?: string;
    };
  } | null;
}

export default function ProfileInfo() {
  const router = useRouter();
  const unifiedSession = useUnifiedSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [edit, setEdit] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('/avatars/default.png');
  const [form, setForm] = useState<Partial<UserProfile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = unifiedSession.user?.id;
        if (!userId) {
          console.error('No user ID found');
          return;
        }

        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData);
        setForm(userData);
        setAvatarPreview(userData.avatar || '/avatars/default.png');
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (unifiedSession.status === 'authenticated') {
      fetchUserData();
    }
  }, [unifiedSession]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('preferences.socials.')) {
      const social = name.split('.')[2];
      setForm(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          socials: {
            ...prev.preferences?.socials,
            [social]: value
          }
        }
      }));
    } else if (name.startsWith('preferences.')) {
      const pref = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [pref]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
      // TODO: Implement avatar upload
    }
  };

  const handleEdit = () => setEdit(true);
  const handleCancel = () => {
    setEdit(false);
    setForm(user || {});
    setAvatarPreview(user?.avatar || '/avatars/default.png');
  };

  const handleSave = async () => {
    try {
      const userId = unifiedSession.user?.id;
      if (!userId) {
        throw new Error('No user ID found');
      }

      const response = await fetch(`/api/user/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    setEdit(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      // TODO: Show error message to user
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Failed to load user data</p>
      </div>
    );
  }

  const isChanged = JSON.stringify(form) !== JSON.stringify(user) || avatarPreview !== user.avatar;

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
        Profile Info
      </motion.h1>

      {/* Stats Widget */}
      <motion.div
        className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow px-5 py-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <User className="w-7 h-7 text-indigo-500" />
          <div>
            <div className="text-xs text-gray-500">Profile Status</div>
            <div className="text-xl font-bold text-indigo-700">Active</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Globe className="w-7 h-7 text-purple-500" />
          <div>
            <div className="text-xs text-gray-500">Language</div>
            <div className="text-xl font-bold text-purple-700">{user.preferences?.language || 'English'}</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white rounded-xl shadow-lg p-4 sm:p-6 space-y-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Avatar & Name Section */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative group w-24 h-24 mb-2">
            <Image
              src={avatarPreview}
              alt="Avatar"
              fill
              className="object-cover rounded-full border-2 border-indigo-200 shadow"
            />
            {edit && (
              <button
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition"
                onClick={() => fileInputRef.current?.click()}
                type="button"
                aria-label="Change avatar"
              >
                <span className="text-white font-bold">Change</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          {edit ? (
            <>
              <input
                className="font-semibold text-lg text-center border border-gray-200 focus:border-indigo-400 outline-none mb-1 rounded-lg px-3 py-1 bg-gray-50 transition"
                name="name"
                value={form.name || ''}
                onChange={handleChange}
                placeholder="Name"
              />
              <input
                className="text-gray-500 text-sm text-center border border-gray-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-1 bg-gray-50 transition"
                name="username"
                value={form.username || ''}
                onChange={handleChange}
                placeholder="Username"
              />
            </>
          ) : (
            <>
              <div className="font-semibold text-lg">{user.name || 'Anonymous'}</div>
              <div className="text-gray-500 text-sm">@{user.username || 'user'}</div>
            </>
          )}
        </div>

        {/* Verification & Badge Section */}
        <div className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
          <div className="flex items-center gap-2">
            {user.isVerified ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                <CheckCircle className="w-4 h-4" /> Verified World ID
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                <XCircle className="w-4 h-4" /> Not Verified
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
              {user.region || 'Global'}
            </span>
            <span className="font-semibold text-xs">{user.experienceLevel}</span>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-4">
          <div className="font-semibold text-gray-700 mb-2">Preferences</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Globe className="w-5 h-5 text-indigo-500" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">Language</div>
                {edit ? (
                  <input
                    className="w-full font-semibold border border-gray-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-1 bg-white transition"
                    name="preferences.language"
                    value={form.preferences?.language || ''}
                    onChange={handleChange}
                    placeholder="Language"
                  />
                ) : (
                  <div className="font-semibold">{user.preferences?.language || 'English'}</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">Location</div>
                {edit ? (
                  <input
                    className="w-full font-semibold border border-gray-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-1 bg-white transition"
                    name="region"
                    value={form.region || ''}
                    onChange={handleChange}
                    placeholder="Location"
                  />
                ) : (
                  <div className="font-semibold">{user.region || 'Not set'}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Socials Section */}
        <div className="space-y-4">
          <div className="font-semibold text-gray-700 mb-2">Social Media</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Twitter className="w-5 h-5 text-sky-400" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">Twitter</div>
                {edit ? (
                  <input
                    className="w-full font-semibold border border-gray-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-1 bg-white transition"
                    name="preferences.socials.twitter"
                    value={form.preferences?.socials?.twitter || ''}
                    onChange={handleChange}
                    placeholder="Twitter handle"
                  />
                ) : (
                  <div className="font-semibold">{user.preferences?.socials?.twitter || 'Not set'}</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Linkedin className="w-5 h-5 text-blue-700" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">LinkedIn</div>
                {edit ? (
                  <input
                    className="w-full font-semibold border border-gray-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-1 bg-white transition"
                    name="preferences.socials.linkedin"
                    value={form.preferences?.socials?.linkedin || ''}
                    onChange={handleChange}
                    placeholder="LinkedIn handle"
                  />
                ) : (
                  <div className="font-semibold">{user.preferences?.socials?.linkedin || 'Not set'}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {edit ? (
          <div className="flex gap-3 mt-6">
            <button
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition disabled:opacity-50"
              onClick={handleSave}
              disabled={!isChanged}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <button
            className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition"
            onClick={handleEdit}
          >
            Edit Profile
          </button>
        )}
      </motion.div>
    </motion.div>
  );
} 