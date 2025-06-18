"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MiniKit } from "@worldcoin/minikit-js";
import { useUnifiedSession } from "@/hooks/useUnifiedSession";
import { useEdgeEsmeralda } from "../../../hooks/useEdgeEsmeralda";
import Image from 'next/image';
import Confetti from 'react-confetti';

export default function MintBadgePage() {
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const router = useRouter();
  const unifiedSession = useUnifiedSession();
  const { mintEdgeEsmeralda, loading: mintLoading, error: mintHookError } = useEdgeEsmeralda();

  useEffect(() => {
    // Check if user is authenticated
    if (unifiedSession.status === 'unauthenticated') {
      router.push('/landing');
      return;
    }

    // Auto-hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [unifiedSession.status, router]);

  // Using EdgeEsmeralda ERC1155 contract via hook

  const handleMintNFT = async () => {
    setIsMinting(true);
    setMintError(null);
    
    try {
      // Check if MiniKit is installed
      if (!MiniKit.isInstalled()) {
        throw new Error('Please install World App to mint your badge');
      }

      // Get user's wallet address from multiple sources
      let userAddress = null;
      
      // First try to get from unified session
      if (unifiedSession.user?.worldcoinId) {
        userAddress = unifiedSession.user.worldcoinId;
      }
      
      // Then try localStorage (where SIWE stores the wallet info)
      if (!userAddress && typeof window !== 'undefined') {
        const storedAddress = localStorage.getItem('worldcoin_wallet_address');
        if (storedAddress) {
          userAddress = storedAddress;
        }
      }
      
      // Finally try MiniKit directly
      if (!userAddress && MiniKit.isInstalled() && (MiniKit as any).walletAddress) {
        userAddress = (MiniKit as any).walletAddress;
      }
      
      // Log for debugging
      console.log('🔍 Checking wallet addresses:', {
        fromSession: unifiedSession.user?.worldcoinId,
        fromLocalStorage: typeof window !== 'undefined' ? localStorage.getItem('worldcoin_wallet_address') : null,
        fromMiniKit: MiniKit.isInstalled() ? (MiniKit as any).walletAddress : null,
        finalAddress: userAddress
      });
      
      if (!userAddress) {
        throw new Error('No wallet address found. Please make sure you\'re signed in with World App.');
      }

      // Generate a nullifier hash (in production, this would come from World ID verification)
      const nullifierData = `${userAddress}-${Date.now()}-${Math.random()}`;
      const encoder = new TextEncoder();
      const data = encoder.encode(nullifierData);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const nullifierHash = `0x${hashArray.map(b => b.toString(16).padStart(2, '0')).join('')}`;

      console.log('🎯 Minting EdgeEsmeralda badge...', { userAddress, nullifierHash });

      // Use the EdgeEsmeralda hook to mint
      const result = await mintEdgeEsmeralda(userAddress, nullifierHash);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to mint badge');
      }

      console.log('✅ Badge minted successfully!', result);
      
      // Store mint result in localStorage for wallet display
      localStorage.setItem('lastMintResult', JSON.stringify({
        ...result,
        userAddress,
        nullifierHash,
        badgeName: 'EdgeEsmeralda Badge',
        timestamp: new Date().toISOString()
      }));
      
      router.push("/settings/wallet");

    } catch (error) {
      console.error('❌ Minting failed:', error);
      setMintError(error instanceof Error ? error.message : 'Failed to mint badge');
    } finally {
      setIsMinting(false);
    }
  };

  const handleSkipMinting = () => {
    router.push("/dashboard");
  };

  if (unifiedSession.status === 'loading') {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f7f8fa] p-4">
      {showConfetti && (
        <Confetti
          width={typeof window !== 'undefined' ? window.innerWidth : 300}
          height={typeof window !== 'undefined' ? window.innerHeight : 300}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-lg text-center flex flex-col items-center justify-center max-w-md mx-auto p-8 space-y-6"
      >
        {/* Headline with confetti */}
        <div className="w-full flex flex-col items-center">
          <div className="text-2xl font-bold flex items-center justify-center gap-2">
            <span role="img" aria-label="confetti">🎉</span>
            Explorer Badge unlocked!
            <span role="img" aria-label="confetti">🎉</span>
          </div>
        </div>
        
        {/* Badge visual */}
        <div className="relative w-full aspect-square max-w-[180px] mx-auto">
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
        <h2 className="text-xl font-bold text-gray-900">
          You&apos;re officially in the hunt!
        </h2>
        
        {/* Checklist */}
        <div className="flex flex-col items-start gap-2 w-full max-w-xs mx-auto text-left">
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
        
        {/* Error message */}
        {mintError && (
          <p className="text-sm text-red-600">{mintError}</p>
        )}
        
        {/* Action buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={isMinting ? undefined : handleMintNFT}
            disabled={isMinting}
            className="w-full px-4 py-3 text-white bg-[#8b5cf6] hover:bg-[#7c3aed] font-bold text-lg rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
              'Mint Badge & Claim coins →'
            )}
          </button>
          
          <button
            onClick={handleSkipMinting}
            className="w-full px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium rounded-lg transition-all"
          >
            Skip for now
          </button>
        </div>
        
        {/* User info */}
        {unifiedSession.user && (
          <div className="text-sm text-gray-500 mt-4">
            Welcome, {unifiedSession.user.name}! 
            {unifiedSession.user.authMethod === 'minikit' && (
              <span className="ml-1">✓ Verified with World ID</span>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
} 