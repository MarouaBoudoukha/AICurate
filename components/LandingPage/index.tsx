"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MiniKit } from "@worldcoin/minikit-js";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export function LandingPage() {
  const [username, setUsername] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      if (!MiniKit.isInstalled()) {
        alert("Please install World App to continue");
        return;
      }
      
      console.log("Starting wallet authentication process...");
      console.log("MiniKit version and capabilities:", {
        isInstalled: MiniKit.isInstalled(),
        commandsAsync: Object.keys(MiniKit.commandsAsync || {}),
        user: MiniKit.user,
      });
      
      // STEP 1: Get nonce from backend
      console.log("Step 1: Getting nonce...");
      const nonceRes = await fetch('/api/nonce');
      if (!nonceRes.ok) {
        throw new Error('Failed to get nonce');
      }
      const { nonce } = await nonceRes.json();
      console.log("Nonce received:", nonce);

      // STEP 2: Wallet authentication (SIWE)
      console.log("Step 2: Starting wallet authentication...");
      
      // Check if walletAuth is available
      if (!MiniKit.commandsAsync?.walletAuth) {
        console.error('Available MiniKit commands:', Object.keys(MiniKit.commandsAsync || {}));
        throw new Error('Wallet authentication is not supported in this MiniKit version. Available commands: ' + Object.keys(MiniKit.commandsAsync || {}).join(', '));
      }
      
      // Try with minimal required parameters first
      const walletAuthInput = {
        nonce,
        statement: 'Sign in to AICurate',
      };
      
      console.log("Wallet auth input (minimal):", walletAuthInput);
      
      const result = await MiniKit.commandsAsync.walletAuth(walletAuthInput);
      console.log("Raw wallet auth result:", result);
      
      const { commandPayload, finalPayload } = result;

      console.log("Wallet auth result:", finalPayload);

      if (finalPayload.status === 'error') {
        console.error('Wallet auth failed:', finalPayload);
        throw new Error('Wallet authentication failed');
      }

      // STEP 3: Verify on backend
      console.log("Step 3: Verifying with backend...");
      const verifyResponse = await fetch("/api/complete-siwe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          payload: finalPayload, 
          nonce,
          username: username || undefined // Pass username if provided
        }),
      });
      
      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.message || "Backend verification failed");
      }
      
      const verifyResult = await verifyResponse.json();
      console.log("Verification successful:", verifyResult);
      
      // STEP 4: Store user data in localStorage for session persistence
      localStorage.setItem('worldIdUser', JSON.stringify({
        id: verifyResult.user.id,
        name: verifyResult.user.name,
        isVerified: verifyResult.user.isVerified,
        walletAddress: finalPayload.address
      }));
      
      // Store individual keys for consistency with your session hook
      localStorage.setItem('worldcoin_user_id', verifyResult.user.id);
      localStorage.setItem('worldcoin_username', verifyResult.user.name || username);
      
      // STEP 5: Access wallet info from MiniKit
      console.log("Wallet address from payload:", finalPayload.address);
      console.log("Username from MiniKit:", MiniKit.user?.username);
      
      router.push("/quiz");
    } catch (error) {
      console.error("Wallet authentication failed:", error);
      alert(error instanceof Error ? error.message : "Wallet authentication failed");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f7f8fa]">
      <div className="screen-1-container flex flex-col" style={{position: 'relative', width: 400, height: 700}}>
        <div className="screen-1-content flex flex-col items-center justify-between">
          {/* Content area with consistent height */}
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            {/* Lightning image above headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="lightning-svg-no-bg"
              style={{ marginBottom: 18 }}
            >
              <img src="/onboarding/lightning.svg" alt="Lightning" style={{width: 60, height: 60}} />
            </motion.div>
            {/* Headline below lightning */}
            <h1 className="welcome-headline landing-headline" style={{ marginBottom: 24, fontWeight: 700 }}>
              Your AI Journey starts with Proof
            </h1>
            {/* Main Bullet (optional, can be removed if not needed) */}
            {/* <div className="main-bullet" style={{ fontWeight: 'bold', marginBottom: 12 }}><b>It starts with Proof</b></div> */}
            {/* Username Input */}
            <div className="username-input-container">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (optional)"
                className="username-input"
              />
            </div>
          </div>
          {/* Bottom section with CTA buttons */}
          <div className="w-full flex flex-col items-center">
            <div className="login-buttons-container">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleVerify}
                disabled={isVerifying}
                className="sign-in-button"
              >
                {isVerifying ? 'Connecting...' : 'Sign in with Wallet'}
              </motion.button>
              {/* Temporarily removed guest signup option
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/quiz")}
                className="guest-signup-button"
              >
                Continue as Guest
              </motion.button>
              */}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .screen-1-container {
          background: #f8fafc;
          border-radius: 30px;
          border: none;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          width: 400px;
          height: 700px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .screen-1-content {
          min-height: 600px;
          padding: 40px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .lightning-svg-no-bg {
          width: 60px;
          height: 60px;
          display: block;
          margin: 0 auto 18px auto;
          filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.5));
          animation: lightningPulse 2s ease-in-out infinite;
        }
        @keyframes lightningPulse {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.5));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 15px rgba(251, 191, 36, 0.8));
            transform: scale(1.05);
          }
        }
        .landing-headline {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          text-align: center;
          margin: 0 0 24px 0;
          line-height: 1.2;
          letter-spacing: -0.3px;
          max-width: 280px;
        }
        .username-input-container {
          width: 100%;
          max-width: 280px;
          margin-bottom: 30px;
        }
        .username-input {
          width: 100%;
          height: 50px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 25px;
          padding: 0 20px;
          font-size: 16px;
          color: #1f2937;
          outline: none;
          transition: all 0.3s ease;
        }
        .username-input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        .username-input::placeholder {
          color: #9ca3af;
        }
        .login-buttons-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
          width: 100%;
          max-width: 320px;
          margin-bottom: 40px;
        }
      `}</style>
      <style jsx global>{`
        .sign-in-button {
          width: 100%;
          height: 48px;
          background: #111827;
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 10px;
          transition: background 0.2s;
        }
        .sign-in-button:hover {
          background: #1f2937;
        }
        .guest-signup-button {
          width: 100%;
          height: 48px;
          background: #fff;
          border: 1.5px solid #111827;
          border-radius: 10px;
          color: #111827;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .guest-signup-button:hover {
          background: #f3f4f6;
          color: #1f2937;
        }
      `}</style>
    </div>
  );
} 