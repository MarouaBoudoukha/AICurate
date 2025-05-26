"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MiniKit, VerifyCommandInput, VerificationLevel } from "@worldcoin/minikit-js";
import { useRouter } from "next/navigation";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: finalPayload, action: "verify", username }),
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f7f8fa]">
      <div className="screen-frame flex items-center justify-center">
        <div className="screen-1-container flex flex-col" style={{position: 'relative'}}>
          <div className="screen-1-content flex flex-col items-center justify-between">
            {/* Lightning Icon */}
            <img src="/onboarding/lightning.svg" alt="Lightning" className="lightning-svg-no-bg" />
            {/* Headline */}
            <h1 className="welcome-headline" style={{color: '#1f2937'}}>Your AI Hunt starts with Proof</h1>
            {/* Username Input */}
            <div className="username-input-container">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="username-input"
              />
            </div>
            {/* Login Buttons */}
            <div className="login-buttons-container">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleVerify}
                disabled={isVerifying}
                className="sign-in-button"
              >
                Sign in with World ID
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/quiz")}
                className="guest-signup-button"
              >
                Sign up as Guest
              </motion.button>
            </div>
          </div>
          <style jsx>{`
            .screen-frame {
              background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
              padding: 3px;
              border-radius: 33px;
              box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
              width: 375px;
              height: 812px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .screen-1-container {
              width: 400px;
              height: 700px;
              background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
              border-radius: 30px;
              border: 1px solid #c7d2fe;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
            }
            .screen-1-content {
              background: #f8fafc;
              height: 100%;
              padding: 60px 30px 40px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
            }
            .lightning-svg-no-bg {
              width: 60px;
              height: 60px;
              display: block;
              margin: 0 auto 30px auto;
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
            .welcome-headline {
              font-size: 28px;
              font-weight: 700;
              color: #1f2937;
              text-align: center;
              margin: 0 0 30px 0;
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
      </div>
    </div>
  );
} 