"use client";
import Image from 'next/image';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function MintBadgeReveal() {
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);

  // Dummy mint handler (replace with real logic if needed)
  const handleMintNFT = async () => {
    setIsMinting(true);
    setTimeout(() => {
      setIsMinting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f7f8fa]">
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4 sm:p-8 relative">
        {/* Headline with confetti */}
        <div className="w-full flex flex-col items-center mb-2">
          <div className="text-2xl font-bold flex items-center justify-center gap-2">
            <span role="img" aria-label="confetti">🎉</span>
            Explorer Badge unlocked!
            <span role="img" aria-label="confetti">🎉</span>
          </div>
        </div>
        {/* Badge visual */}
        <div className="relative w-full aspect-square max-w-[180px] mx-auto mb-2">
          <Image
            src="/badges/Edge_Badge.png"
            alt="Explorer Badge"
            fill
            className="object-contain"
            sizes="(max-width: 180px) 100vw, 180px"
            priority
          />
        </div>
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mt-2 mb-2">
          You&apos;re officially in the hunt!
        </h2>
        {/* Checklist */}
        <div className="flex flex-col items-start gap-2 w-full max-w-xs mx-auto text-left mb-2">
          <div className="flex items-start gap-2">
            <span className="text-green-500 text-lg mt-0.5">✔</span>
            <span><b>Mint your badge</b> now to keep forever.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 text-lg mt-0.5">✔</span>
            <span>You just won <b>50 ProofPoints™</b> and <b>3 free credits</b></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-500 text-lg mt-0.5">✔</span>
            <span>Time to <b>explore AI tools!</b></span>
          </div>
        </div>
        {/* CTA Button */}
        {mintError && (
          <p className="text-sm text-red-600">{mintError}</p>
        )}
        <button
          onClick={isMinting ? undefined : handleMintNFT}
          disabled={isMinting}
          className="w-full px-4 py-3 text-white bg-[#8b5cf6] hover:bg-[#7c3aed] font-bold text-lg rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-2"
          style={{ minHeight: 56 }}
        >
          {isMinting ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Minting...
            </span>
          ) : (
            'Mint Badge & Claim coins ->'
          )}
        </button>
        {/* Confetti celebration animation - only on minting page */}
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 300}
          height={typeof window !== 'undefined' ? window.innerHeight : 300}
          recycle={false}
          numberOfPieces={200}
        />
      </div>
    </div>
  );
} 