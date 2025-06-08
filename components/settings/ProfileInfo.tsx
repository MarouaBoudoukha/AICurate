"use client";
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, XCircle, Twitter, Linkedin } from 'lucide-react';

const initialUser = {
  name: "Jane Doe",
  username: "janedoe",
  avatar: "/avatars/default.png",
  worldId: true,
  tribe: "European",
  badge: "Edge Esmeralda",
  badgeImg: "/badges/Edge_Badge.png",
  language: "English",
  location: "France",
  socials: { twitter: "@janedoe", linkedin: "@janedoe" }
};

export default function ProfileInfo() {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [edit, setEdit] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [form, setForm] = useState(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('socials.')) {
      setForm({ ...form, socials: { ...form.socials, [name.split('.')[1]]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = () => setEdit(true);
  const handleCancel = () => {
    setEdit(false);
    setForm(user);
    setAvatarPreview(user.avatar);
  };
  const handleSave = () => {
    setUser({ ...form, avatar: avatarPreview });
    setEdit(false);
  };
  const isChanged = JSON.stringify(form) !== JSON.stringify(user) || avatarPreview !== user.avatar;

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <button className="text-gray-500 hover:text-indigo-500" onClick={() => router.back()}>
          <span className="text-2xl">&larr;</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">Profile Info</h2>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 space-y-6">
        {/* Avatar & Name Section */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative group w-20 h-20 mb-2">
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
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
              />
              <input
                className="text-gray-500 text-sm text-center border border-gray-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-1 bg-gray-50 transition"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
              />
            </>
          ) : (
            <>
              <div className="font-semibold text-lg">{user.name}</div>
              <div className="text-gray-500 text-sm">@{user.username}</div>
            </>
          )}
        </div>
        {/* Divider */}
        <div className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            {user.worldId ? (
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
              {user.tribe}
            </span>
            <Image src={user.badgeImg} alt="Badge" width={32} height={32} className="rounded-full border" />
            <span className="font-semibold text-xs">{user.badge}</span>
          </div>
        </div>
        {/* Preferences Section */}
        <div className="space-y-2">
          <div className="font-semibold text-gray-700 mb-1">Preferences</div>
          <div className="flex flex-col gap-2">
            <div>
              <span className="text-gray-500">Language:</span>{' '}
              {edit ? (
                <input
                  className="font-semibold border border-gray-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-1 bg-gray-50 transition"
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  placeholder="Language"
                />
              ) : (
                <span className="font-semibold">{user.language}</span>
              )}
            </div>
            <div>
              <span className="text-gray-500">Location:</span>{' '}
              {edit ? (
                <input
                  className="font-semibold border border-gray-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-1 bg-gray-50 transition"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Location"
                />
              ) : (
                <span className="font-semibold">{user.location}</span>
              )}
            </div>
          </div>
        </div>
        {/* Socials Section */}
        <div className="space-y-2">
          <div className="font-semibold text-gray-700 mb-1">Social Media</div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Twitter className="w-5 h-5 text-sky-400" />
              {edit ? (
                <input
                  className="border border-gray-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-1 bg-gray-50 transition"
                  name="socials.twitter"
                  value={form.socials.twitter}
                  onChange={handleChange}
                  placeholder="Twitter handle"
                />
              ) : (
                <span className="text-gray-500">{user.socials.twitter}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Linkedin className="w-5 h-5 text-blue-700" />
              {edit ? (
                <input
                  className="border border-gray-200 focus:border-indigo-400 outline-none rounded-lg px-3 py-1 bg-gray-50 transition"
                  name="socials.linkedin"
                  value={form.socials.linkedin}
                  onChange={handleChange}
                  placeholder="LinkedIn handle"
                />
              ) : (
                <span className="text-gray-500">{user.socials.linkedin}</span>
              )}
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        {edit ? (
          <div className="flex gap-2 mt-4">
            <button
              className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition disabled:opacity-50"
              onClick={handleSave}
              disabled={!isChanged}
            >
              Save Changes
            </button>
            <button
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            className="w-full mt-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition"
            onClick={handleEdit}
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
} 