"use client";
import { useRouter } from 'next/navigation';
import { Vault } from 'lucide-react';

export default function VaultPage() {
  const router = useRouter();
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <button
        onClick={() => router.push('/dashboard')}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        ← Back to Dashboard
      </button>
      <h2 className="text-xl font-bold mb-4">Hunt Vault</h2>
      <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
        <Vault className="w-10 h-10 text-yellow-500 mb-2" />
        <div className="font-semibold mb-2">Your treasure is staked here. It will turn into real</div>
        <button className="mt-4 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold shadow hover:from-indigo-600 hover:to-purple-600 transition-all">
          Enter Vault
        </button>
      </div>
    </div>
  );
} 