"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MiniKit } from '@worldcoin/minikit-js';
import { useSession, signIn } from 'next-auth/react';

// Quiz step definitions
const quizSteps: QuizStep[] = [
  {
    key: 'interests',
    title: "What interests you most?",
    type: 'multi',
    max: 2,
    options: [
      { label: "AI & Tech", icon: "🤖" },
      { label: "Gaming", icon: "🕹️" },
      { label: "Art & Design", icon: "🧑‍🎨" },
      { label: "Business & Startups", icon: "🚀" },
      { label: "Education & Research", icon: "🧬" },
      { label: "Writing & Blogging", icon: "📝" },
      { label: "Music & Audio", icon: "🎧" },
      { label: "Travel & Culture", icon: "🌐" },
      { label: "Marketing & Social Media", icon: "📱" },
      { label: "Mental Health & Wellness", icon: "🧠" },
      { label: "Finance & Investing", icon: "💹" },
      { label: "Lifestyle & Productivity", icon: "🦾" },
      { label: "Other", icon: "✨", isOther: true },
    ],
  },
  {
    key: 'location',
    title: "Where do you live?",
    type: 'dropdown',
    options: [
      // You can use a country list library or static list for production
      { label: "United States" },
      { label: "United Kingdom" },
      { label: "France" },
      { label: "Germany" },
      { label: "India" },
      { label: "China" },
      { label: "Japan" },
      { label: "Brazil" },
      { label: "South Africa" },
      { label: "Other" },
    ],
  },
  {
    key: 'age',
    title: "What's your age range?",
    type: 'radio',
    options: [
      { label: "13–17" },
      { label: "18–24" },
      { label: "25–34" },
      { label: "35–44" },
      { label: "45–60" },
      { label: "60+" },
    ],
  },
  {
    key: 'platforms',
    title: "What platform do you use most?",
    type: 'multi',
    max: 2,
    options: [
      { label: "X", icon: "𝕏" },
      { label: "LinkedIn", icon: "💼" },
      { label: "TikTok", icon: "🎵" },
      { label: "YouTube", icon: "▶️" },
      { label: "Instagram", icon: "📸" },
      { label: "Farcaster", icon: "🟣" },
      { label: "Other", icon: "➕", isOther: true },
    ],
  },
  {
    key: 'tasks',
    title: "What do you want AI to help you with?",
    type: 'multi',
    max: 3,
    options: [
      { label: "Work" },
      { label: "Personal Projects" },
      { label: "Entertainment" },
      { label: "Learning" },
      { label: "Art" },
      { label: "Automation" },
      { label: "Business" },
      { label: "Other", isOther: true },
    ],
  },
  {
    key: 'comfort',
    title: "What's your AI comfort level?",
    type: 'single',
    options: [
      { label: "Newcomer", icon: "🟣", desc: "Just getting started" },
      { label: "Beginner", icon: "🚀", desc: "Curious mind" },
      { label: "Intermediate", icon: "🔨", desc: "Task tamer" },
      { label: "Advanced / Pro", icon: "⚡", desc: "Power hustler" },
      { label: "Builder / Developer", icon: "🧱", desc: "Maker spirit" },
    ],
  },
];

// Add types for quiz steps and options
interface QuizOption {
  label: string;
  icon?: string;
  desc?: string;
  isOther?: boolean;
}
interface QuizStep {
  key: string;
  title: string;
  type: 'multi' | 'dropdown' | 'radio' | 'single';
  max?: number;
  options: QuizOption[];
}

export function QuizSection() {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [otherInputs, setOtherInputs] = useState<Record<string, any>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const router = useRouter();

  // --- Refactored 'Other' logic for all step types ---
  // Multi-select
  const handleMultiSelect = (option: QuizOption, step: QuizStep) => {
    let prev = (answers[step.key] as string[]) || [];
    let updated;
    if (option.isOther) {
      // If already selected, deselect and clear input
      if (prev.some(v => v === otherInputs[step.key] || v === 'Other')) {
        updated = prev.filter((l: string) => l !== otherInputs[step.key] && l !== 'Other');
        setOtherInputs({ ...otherInputs, [step.key]: '' });
      } else {
        updated = [...prev, 'Other'];
      }
    } else {
      if (prev.includes(option.label)) {
        updated = prev.filter((l: string) => l !== option.label);
      } else if (prev.length < (step.max || 1)) {
        updated = [...prev, option.label];
      } else {
        updated = prev;
      }
    }
    setAnswers({ ...answers, [step.key]: updated });
  };

  // Single select (radio or single card)
  const handleSingleSelect = (option: QuizOption, step: QuizStep) => {
    if (option.isOther) {
      setAnswers({ ...answers, [step.key]: 'Other' });
    } else {
      setAnswers({ ...answers, [step.key]: option.label });
    }
  };

  // Dropdown
  const handleDropdown = (e: React.ChangeEvent<HTMLSelectElement>, step: QuizStep) => {
    const value = e.target.value;
    setAnswers({ ...answers, [step.key]: value });
  };

  // 'Other' input for all types
  const handleOtherInput = (e: React.ChangeEvent<HTMLInputElement>, step: QuizStep) => {
    setOtherInputs({ ...otherInputs, [step.key]: e.target.value });
    if (step.type === 'multi') {
      let prev = (answers[step.key] as string[]) || [];
      // Replace any previous custom value for 'Other' with the new value
      let filtered = prev.filter((l: string) => l !== otherInputs[step.key] && l !== 'Other');
      if (e.target.value) {
        setAnswers({ ...answers, [step.key]: [...filtered, e.target.value] });
      } else {
        setAnswers({ ...answers, [step.key]: filtered });
      }
    } else {
      setAnswers({ ...answers, [step.key]: e.target.value });
    }
  };

  // --- Progress indicator (step dots) ---
  const renderProgress = () => (
    <div className="flex justify-center gap-2 mb-4">
      {quizSteps.map((_, idx) => (
        <span
          key={idx}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentStep ? 'bg-gradient-to-r from-indigo-500 to-purple-400 shadow-lg scale-125' : 'bg-gray-300'}`}
        />
      ))}
    </div>
  );

  // --- UI for each step ---
  const renderStep = (step: QuizStep, idx: number) => {
    if (step.type === 'multi') {
      const selected: string[] = answers[step.key] || [];
      const isDisabled = step.max !== undefined ? (selected.length >= step.max) : false;
      const otherSelected = selected.includes('Other') || selected.some(v => v === otherInputs[step.key]);
      return (
        <div className="space-y-2">
          {step.options.map((option: QuizOption) => (
            <motion.button
              key={option.label}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => handleMultiSelect(option, step)}
              className={`w-full p-4 text-left text-gray-700 bg-white border rounded-xl flex items-center gap-3 transition-colors font-semibold text-lg shadow-sm ${selected.includes(option.label) || (option.isOther && otherSelected) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'}`}
              disabled={isDisabled && !selected.includes(option.label) && !option.isOther}
              style={{ cursor: isDisabled && !selected.includes(option.label) && !option.isOther ? 'not-allowed' : 'pointer' }}
            >
              {option.icon && <span className="text-2xl">{option.icon}</span>}
              <span>{option.label}</span>
              {(selected.includes(option.label) || (option.isOther && otherSelected)) && <span className="ml-auto text-indigo-600 font-bold">✓</span>}
            </motion.button>
          ))}
          {/* Show input if 'Other' is selected */}
          {step.options.some((o: QuizOption) => o.isOther) && otherSelected && (
            <motion.input
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              type="text"
              className="w-full mt-2 p-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-400 text-lg"
              placeholder="Please specify..."
              value={otherInputs[step.key] || ''}
              onChange={e => handleOtherInput(e, step)}
            />
          )}
          <div className="text-xs text-gray-500 mt-1">Select up to {step.max}</div>
        </div>
      );
    }
    if (step.type === 'dropdown') {
      const value = answers[step.key] || '';
      const otherSelected = value === 'Other' || value === otherInputs[step.key];
      return (
        <div>
          <select
            className="w-full p-3 border-2 border-indigo-300 rounded-xl text-lg focus:ring-2 focus:ring-indigo-400 bg-white"
            value={otherSelected ? 'Other' : value}
            onChange={e => handleDropdown(e, step)}
          >
            <option value="" disabled>Select your country</option>
            {step.options.map((option: QuizOption) => (
              <option key={option.label} value={option.label}>{option.label}</option>
            ))}
          </select>
          {/* Show input if 'Other' is selected */}
          {otherSelected && (
            <motion.input
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              type="text"
              className="w-full mt-2 p-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-400 text-lg"
              placeholder="Please specify..."
              value={otherInputs[step.key] || ''}
              onChange={e => handleOtherInput(e, step)}
            />
          )}
        </div>
      );
    }
    if (step.type === 'radio') {
      const value = answers[step.key] || '';
      const otherSelected = value === 'Other' || value === otherInputs[step.key];
      return (
        <div className="space-y-2">
          {step.options.map((option: QuizOption) => (
            <motion.label
              key={option.label}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer text-lg font-semibold transition-colors ${value === option.label || (option.isOther && otherSelected) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'}`}
            >
              <input
                type="radio"
                name={step.key}
                value={option.label}
                checked={value === option.label || (option.isOther && otherSelected)}
                onChange={() => handleSingleSelect(option, step)}
                className="accent-indigo-500 w-5 h-5"
              />
              <span>{option.label}</span>
            </motion.label>
          ))}
          {/* Show input if 'Other' is selected */}
          {otherSelected && (
            <motion.input
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              type="text"
              className="w-full mt-2 p-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-400 text-lg"
              placeholder="Please specify..."
              value={otherInputs[step.key] || ''}
              onChange={e => handleOtherInput(e, step)}
            />
          )}
        </div>
      );
    }
    if (step.type === 'single') {
      const value = answers[step.key] || '';
      const otherSelected = value === 'Other' || value === otherInputs[step.key];
      return (
        <div className="space-y-2">
          {step.options.map((option: QuizOption) => (
            <motion.button
              key={option.label}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSingleSelect(option, step)}
              className={`w-full p-4 text-left text-gray-700 bg-white border-2 rounded-xl flex items-center gap-3 transition-colors font-semibold text-lg shadow-sm ${value === option.label || (option.isOther && otherSelected) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'}`}
            >
              {option.icon && <span className="text-2xl">{option.icon}</span>}
              <span className="flex-1">{option.label}</span>
              {option.desc && <span className="text-xs text-gray-500">{option.desc}</span>}
              {(value === option.label || (option.isOther && otherSelected)) && <span className="ml-auto text-indigo-600 font-bold">✓</span>}
            </motion.button>
          ))}
          {/* Show input if 'Other' is selected */}
          {otherSelected && (
            <motion.input
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              type="text"
              className="w-full mt-2 p-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-400 text-lg"
              placeholder="Please specify..."
              value={otherInputs[step.key] || ''}
              onChange={e => handleOtherInput(e, step)}
            />
          )}
        </div>
      );
    }
    return null;
  };

  // --- Validation for next button ---
  const canProceed = () => {
    const step = quizSteps[currentStep];
    if (step.type === 'multi') {
      const selected: string[] = answers[step.key] || [];
      // All selected must be non-empty
      return (
        selected.length > 0 &&
        selected.length <= (step.max || 1) &&
        selected.every(v => v && v.trim() !== '')
      );
    }
    if (step.type === 'dropdown' || step.type === 'radio' || step.type === 'single') {
      const value = answers[step.key];
      return !!value && value.trim() !== '';
    }
    return false;
  };

  // Next step
  const handleNext = () => {
    if (currentStep === quizSteps.length - 1) {
      setShowConfetti(true);
      setTimeout(() => setShowReveal(true), 2000);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  // Minimal ABI for ERC721 mint function
  const NFT_ABI = [
    {
      "inputs": [
        { "internalType": "address", "name": "to", "type": "address" },
        { "internalType": "string", "name": "uri", "type": "string" }
      ],
      "name": "safeMint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
  const NFT_CONTRACT_ADDRESS = '0x761eDad8F522a153096110e0B88513BAbb19fCf4';

  const handleMintNFT = async () => {
    setIsMinting(true);
    setMintError(null);
    try {
      if (!MiniKit.isInstalled()) throw new Error('Please install World App to continue');
      const nonceResponse = await fetch('/api/nonce');
      if (!nonceResponse.ok) throw new Error('Failed to get nonce');
      const { nonce } = await nonceResponse.json();
      if (!MiniKit.walletAddress) {
        const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
          nonce,
          statement: 'Connect your wallet to mint your NFT',
          expirationTime: new Date(Date.now() + 1000 * 60 * 60)
        });
        if (finalPayload.status === 'error') throw new Error('Failed to connect wallet');
        const verifyResponse = await fetch('/api/complete-siwe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payload: finalPayload, nonce }),
        });
        if (!verifyResponse.ok) throw new Error('Failed to verify wallet connection');
        const { address } = await verifyResponse.json();
        if (!address) throw new Error('No wallet address returned');
      }
      const response = await MiniKit.commandsAsync.sendTransaction({
        transaction: [{
          address: NFT_CONTRACT_ADDRESS,
          abi: NFT_ABI,
          functionName: 'safeMint',
          args: [MiniKit.walletAddress as string, 'ipfs://QmdStFxJS9SNNEvxAk4U8jiwsEbRoStffQJUDyghxvgcvj/0']
        }]
      });
      if (!response?.finalPayload || response.finalPayload.status === 'error') throw new Error('Failed to mint NFT');
      const transactionId = response.finalPayload.transaction_id;
      if (transactionId) console.log('Transaction ID:', transactionId);
      router.push("/dashboard");
    } catch (error) {
      console.error('Minting error:', error);
      setMintError(error instanceof Error ? error.message : 'Failed to mint NFT');
    } finally {
      setIsMinting(false);
    }
  };

  // --- Main render ---
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f7f8fa]">
      <div className="screen-frame flex items-center justify-center">
        <div className="screen-1-container flex flex-col relative" style={{ position: 'relative', width: 400, minHeight: 600 }}>
          <div className="screen-1-content flex flex-col items-center justify-between w-full h-full" style={{ padding: '40px 24px 32px' }}>
            {renderProgress()}
            <motion.h1
              className="text-3xl font-extrabold text-center text-gray-900 mb-2 tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Personalization Quiz
            </motion.h1>
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {quizSteps[currentStep].title}
              </h2>
              {renderStep(quizSteps[currentStep], currentStep)}
            </motion.div>
            <motion.button
              className="w-full mt-8 px-4 py-3 text-white font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === quizSteps.length - 1 ? 'Launch First Hunt with AI Guide' : 'Next →'}
            </motion.button>
          </div>
          {/* Confetti and Reveal/Minting UI remain unchanged */}
          <AnimatePresence mode="wait">
            {showReveal && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 p-6 bg-white rounded-lg shadow-lg text-center space-y-6 flex flex-col items-center justify-center z-20"
              >
                <div className="relative w-full aspect-square max-w-[300px] mx-auto">
                  <Image
                    src="/madamenft2.jpg"
                    alt="Your NFT"
                    fill
                    className="object-cover rounded-lg shadow-xl"
                    sizes="(max-width: 300px) 100vw, 300px"
                    priority
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
                    Ready to Mint!
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Congratulations! Your Avatar NFT is Ready
                </h2>
                <p className="text-gray-600">
                  Your unique NFT is ready to be minted on World Chain. Click below to mint and add it to your collection.
                </p>
                {mintError && (
                  <p className="text-sm text-red-600">{mintError}</p>
                )}
                <button
                  onClick={isMinting ? undefined : handleMintNFT}
                  disabled={isMinting}
                  className="w-full px-4 py-2 text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-bold text-lg shadow-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
                    'Mint NFT'
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {showConfetti && (
            <Confetti
              width={typeof window !== 'undefined' ? window.innerWidth : 300}
              height={typeof window !== 'undefined' ? window.innerHeight : 300}
              recycle={!showReveal}
              numberOfPieces={200}
            />
          )}
        </div>
      </div>
      <style jsx global>{`
        .screen-frame {
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          padding: 3px;
          border-radius: 33px;
          box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
        }
        .screen-1-container {
          width: 400px;
          min-height: 600px;
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
          min-height: 600px;
          padding: 40px 24px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );
} 