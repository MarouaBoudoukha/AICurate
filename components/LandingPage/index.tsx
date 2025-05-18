"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MiniKit, VerifyCommandInput, VerificationLevel } from "@worldcoin/minikit-js";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function LandingPage() {
  const [username, setUsername] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }

    setIsVerifying(true);

    try {
      if (!MiniKit.isInstalled()) {
        alert("Please install World App to continue");
        return;
      }

      const verifyPayload: VerifyCommandInput = {
        action: "verify",
        verification_level: VerificationLevel.Orb,
      };

      const response = await MiniKit.commandsAsync.verify(verifyPayload);
      
      if (!response || !response.finalPayload) {
        throw new Error("Invalid response from World App");
      }

      const { finalPayload } = response;
      if (finalPayload.status === "error") {
        throw new Error("Verification failed");
      }

      // Verify the proof in the backend
      const verifyResponse = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload,
          action: "verify",
          username,
        }),
      });

      if (!verifyResponse.ok) {
        throw new Error("Backend verification failed");
      }

      router.push("/quiz");
    } catch (error) {
      console.error("Verification failed:", error);
      alert(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6"
    >
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-4"
        >
          <Image
            src="/aicuratelogo.png"
            alt="AICurate Logo"
            width={96}
            height={96}
            className="object-contain"
            priority
          />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome to AICurate</h1>
        <p className="text-gray-600">
          Join our community of AI app reviewers and earn rewards
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Choose your username
          </label>
          <input
            type="text"
            id="username"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter a unique username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <motion.button
          onClick={handleVerify}
          disabled={isVerifying}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isVerifying ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              Verifying...
            </span>
          ) : (
            "Verify with World ID"
          )}
        </motion.button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-gray-500 bg-white">Or</span>
          </div>
        </div>

        <motion.button
          onClick={() => router.push("/quiz")}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-3 text-gray-700 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Continue as Guest
        </motion.button>
      </div>
    </motion.div>
  );
} 