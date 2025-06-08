"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, ShieldCheck, BookOpen, Trash2 } from 'lucide-react';

export default function LegalPrivacy() {
  const router = useRouter();
  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <button className="text-gray-500 hover:text-indigo-500" onClick={() => router.back()}>
          <span className="text-2xl">&larr;</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">Legal & Privacy</h2>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 space-y-6">
        {/* Legal Info Section */}
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <div>
            <div className="font-semibold text-gray-700">Legal Info</div>
            <span className="text-gray-400">[Legal Info Placeholder]</span>
          </div>
        </div>
        {/* Privacy Policy Section */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
          <FileText className="w-5 h-5 text-indigo-500" />
          <div className="flex-1">
            <div className="font-semibold text-gray-700">Privacy Policy</div>
          </div>
          <button className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full text-xs font-semibold transition">View</button>
        </div>
        {/* Terms of Service Section */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <div className="flex-1">
            <div className="font-semibold text-gray-700">Terms of Service</div>
          </div>
          <button className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-xs font-semibold transition">View</button>
        </div>
        {/* Delete my account Section */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
          <Trash2 className="w-5 h-5 text-red-500" />
          <div className="flex-1">
            <div className="font-semibold text-gray-700">Delete my account</div>
          </div>
          <button className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full text-xs font-semibold transition">Request</button>
        </div>
      </div>
    </div>
  );
} 