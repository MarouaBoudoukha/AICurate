"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Wallet() {
  const router = useRouter();
  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <button className="text-gray-500 hover:text-indigo-500" onClick={() => router.back()}>
          <span className="text-2xl">&larr;</span>
        </button>
        <h1 className="text-2xl font-bold flex-1 text-center">My Wallet</h1>
      </div>
      {/* Balances */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow p-6 flex flex-col gap-4 items-center">
        <div className="flex flex-col items-center w-full gap-2">
          <div className="flex justify-between w-full max-w-xs">
            <span className="font-bold text-lg">Credits</span>
            <span className="font-bold text-2xl">3</span>
          </div>
          <div className="flex justify-between w-full max-w-xs">
            <span className="font-bold text-lg">Proofpoints™</span>
            <span className="font-bold text-2xl">50</span>
          </div>
        </div>
        <div className="flex gap-2 w-full max-w-xs">
          <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition">convert to credits</button>
          <button className="flex-1 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold py-2 rounded-lg transition">stake coins</button>
        </div>
      </div>
      {/* Coins & Badges */}
      <div>
        <h2 className="text-lg font-bold mb-2 mt-4">Your Coins &amp; Badges</h2>
        <div className="flex gap-3">
          <div className="flex-1 bg-white rounded-2xl shadow p-3 flex flex-col items-center hover:shadow-lg transition">
            <Image src="/badges/coin.png" alt="Coins" width={80} height={80} className="mb-1" />
            <span className="font-semibold">Coins</span>
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow p-3 flex flex-col items-center hover:shadow-lg transition">
            <Image src="/badges/Edge_Badge.png" alt="Badges" width={80} height={80} className="mb-1" />
            <span className="font-semibold">Badges</span>
          </div>
        </div>
      </div>
      {/* Meme NFTs */}
      <div>
        <h2 className="text-lg font-bold mb-2 mt-4">Your Meme NFTs</h2>
        <div className="flex gap-3">
          <div className="flex-1 bg-white rounded-2xl shadow p-3 flex flex-col items-center hover:shadow-lg transition">
            <Image src="/meme/meme1.png" alt="Meme NFT 1" width={100} height={120} className="rounded-lg" />
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow p-3 flex flex-col items-center hover:shadow-lg transition">
            <Image src="/meme/meme2.png" alt="Meme NFT 2" width={100} height={120} className="rounded-lg" />
          </div>
        </div>
      </div>
      {/* CTA */}
      <div className="mt-8">
        <button className="w-full py-3 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-lg rounded-2xl shadow-lg transition">Upload and Mint NFT Meme</button>
      </div>
    </div>
  );
} 