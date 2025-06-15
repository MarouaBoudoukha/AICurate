"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MiniKit } from '@worldcoin/minikit-js';
import { useUnifiedSession } from '@/hooks/useUnifiedSession';

// Quiz step definitions
const quizSteps: QuizStep[] = [
  {
    key: 'interests',
    title: "What are you passionate about?",
    subtitle: "(Choose up to 3)",
    type: 'multi',
    max: 3,
    options: [
      { label: "AI & Tech", icon: "📲" },
      { label: "Gaming", icon: "🎮" },
      { label: "Art & Design", icon: "🎨" },
      { label: "Writing & Storytelling", icon: "✍️" },
      { label: "Wellness & Mindset", icon: "🧠" },
      { label: "Business & Productivity", icon: "💼" },
      { label: "Other", icon: "✨", isOther: true },
    ],
  },
  {
    key: 'location',
    title: "Where do you live?",
    type: 'dropdown',
    options: [
      // Sort all countries alphabetically
      { label: "Afghanistan", tribe: "Asian" },
      { label: "Albania", tribe: "European" },
      { label: "Algeria", tribe: "African" },
      { label: "Andorra", tribe: "European" },
      { label: "Angola", tribe: "African" },
      { label: "Antigua and Barbuda", tribe: "North American" },
      { label: "Argentina", tribe: "LATAM" },
      { label: "Armenia", tribe: "European" },
      { label: "Australia", tribe: "Oceanic" },
      { label: "Austria", tribe: "European" },
      { label: "Azerbaijan", tribe: "European" },
      { label: "Bahamas", tribe: "North American" },
      { label: "Bahrain", tribe: "Middle Eastern" },
      { label: "Bangladesh", tribe: "Asian" },
      { label: "Barbados", tribe: "North American" },
      { label: "Belarus", tribe: "European" },
      { label: "Belgium", tribe: "European" },
      { label: "Belize", tribe: "North American" },
      { label: "Benin", tribe: "African" },
      { label: "Bhutan", tribe: "Asian" },
      { label: "Bolivia", tribe: "LATAM" },
      { label: "Bosnia and Herzegovina", tribe: "European" },
      { label: "Botswana", tribe: "African" },
      { label: "Brazil", tribe: "LATAM" },
      { label: "Brunei", tribe: "Asian" },
      { label: "Bulgaria", tribe: "European" },
      { label: "Burkina Faso", tribe: "African" },
      { label: "Burundi", tribe: "African" },
      { label: "Cabo Verde", tribe: "African" },
      { label: "Cambodia", tribe: "Asian" },
      { label: "Cameroon", tribe: "African" },
      { label: "Canada", tribe: "North American" },
      { label: "Central African Republic", tribe: "African" },
      { label: "Chad", tribe: "African" },
      { label: "Chile", tribe: "LATAM" },
      { label: "China", tribe: "Asian" },
      { label: "Colombia", tribe: "LATAM" },
      { label: "Comoros", tribe: "African" },
      { label: "Congo", tribe: "African" },
      { label: "Costa Rica", tribe: "North American" },
      { label: "Croatia", tribe: "European" },
      { label: "Cuba", tribe: "North American" },
      { label: "Cyprus", tribe: "European" },
      { label: "Czech Republic", tribe: "European" },
      { label: "Democratic Republic of the Congo", tribe: "African" },
      { label: "Denmark", tribe: "European" },
      { label: "Djibouti", tribe: "African" },
      { label: "Dominica", tribe: "North American" },
      { label: "Dominican Republic", tribe: "North American" },
      { label: "Ecuador", tribe: "LATAM" },
      { label: "Egypt", tribe: "African" },
      { label: "El Salvador", tribe: "North American" },
      { label: "Equatorial Guinea", tribe: "African" },
      { label: "Eritrea", tribe: "African" },
      { label: "Estonia", tribe: "European" },
      { label: "Eswatini", tribe: "African" },
      { label: "Ethiopia", tribe: "African" },
      { label: "Fiji", tribe: "Oceanic" },
      { label: "Finland", tribe: "European" },
      { label: "France", tribe: "European" },
      { label: "Gabon", tribe: "African" },
      { label: "Gambia", tribe: "African" },
      { label: "Georgia", tribe: "European" },
      { label: "Germany", tribe: "European" },
      { label: "Ghana", tribe: "African" },
      { label: "Greece", tribe: "European" },
      { label: "Grenada", tribe: "North American" },
      { label: "Guatemala", tribe: "North American" },
      { label: "Guinea", tribe: "African" },
      { label: "Guinea-Bissau", tribe: "African" },
      { label: "Guyana", tribe: "LATAM" },
      { label: "Haiti", tribe: "North American" },
      { label: "Honduras", tribe: "North American" },
      { label: "Hungary", tribe: "European" },
      { label: "Iceland", tribe: "European" },
      { label: "India", tribe: "Asian" },
      { label: "Indonesia", tribe: "Asian" },
      { label: "Iran", tribe: "Middle Eastern" },
      { label: "Iraq", tribe: "Middle Eastern" },
      { label: "Ireland", tribe: "European" },
      { label: "Israel", tribe: "Middle Eastern" },
      { label: "Italy", tribe: "European" },
      { label: "Ivory Coast", tribe: "African" },
      { label: "Jamaica", tribe: "North American" },
      { label: "Japan", tribe: "Asian" },
      { label: "Jordan", tribe: "Middle Eastern" },
      { label: "Kazakhstan", tribe: "Asian" },
      { label: "Kenya", tribe: "African" },
      { label: "Kiribati", tribe: "Oceanic" },
      { label: "Kuwait", tribe: "Middle Eastern" },
      { label: "Kyrgyzstan", tribe: "Asian" },
      { label: "Laos", tribe: "Asian" },
      { label: "Latvia", tribe: "European" },
      { label: "Lebanon", tribe: "Middle Eastern" },
      { label: "Lesotho", tribe: "African" },
      { label: "Liberia", tribe: "African" },
      { label: "Libya", tribe: "African" },
      { label: "Liechtenstein", tribe: "European" },
      { label: "Lithuania", tribe: "European" },
      { label: "Luxembourg", tribe: "European" },
      { label: "Madagascar", tribe: "African" },
      { label: "Malawi", tribe: "African" },
      { label: "Malaysia", tribe: "Asian" },
      { label: "Maldives", tribe: "Asian" },
      { label: "Mali", tribe: "African" },
      { label: "Malta", tribe: "European" },
      { label: "Marshall Islands", tribe: "Oceanic" },
      { label: "Mauritania", tribe: "African" },
      { label: "Mauritius", tribe: "African" },
      { label: "Mexico", tribe: "North American" },
      { label: "Micronesia", tribe: "Oceanic" },
      { label: "Moldova", tribe: "European" },
      { label: "Monaco", tribe: "European" },
      { label: "Mongolia", tribe: "Asian" },
      { label: "Montenegro", tribe: "European" },
      { label: "Morocco", tribe: "African" },
      { label: "Mozambique", tribe: "African" },
      { label: "Myanmar", tribe: "Asian" },
      { label: "Namibia", tribe: "African" },
      { label: "Nauru", tribe: "Oceanic" },
      { label: "Nepal", tribe: "Asian" },
      { label: "Netherlands", tribe: "European" },
      { label: "New Zealand", tribe: "Oceanic" },
      { label: "Nicaragua", tribe: "North American" },
      { label: "Niger", tribe: "African" },
      { label: "Nigeria", tribe: "African" },
      { label: "North Korea", tribe: "Asian" },
      { label: "North Macedonia", tribe: "European" },
      { label: "Norway", tribe: "European" },
      { label: "Oman", tribe: "Middle Eastern" },
      { label: "Pakistan", tribe: "Asian" },
      { label: "Palau", tribe: "Oceanic" },
      { label: "Palestine", tribe: "Middle Eastern" },
      { label: "Panama", tribe: "North American" },
      { label: "Papua New Guinea", tribe: "Oceanic" },
      { label: "Paraguay", tribe: "LATAM" },
      { label: "Peru", tribe: "LATAM" },
      { label: "Philippines", tribe: "Asian" },
      { label: "Poland", tribe: "European" },
      { label: "Portugal", tribe: "European" },
      { label: "Qatar", tribe: "Middle Eastern" },
      { label: "Romania", tribe: "European" },
      { label: "Russia", tribe: "European" },
      { label: "Rwanda", tribe: "African" },
      { label: "Saint Kitts and Nevis", tribe: "North American" },
      { label: "Saint Lucia", tribe: "North American" },
      { label: "Saint Vincent and the Grenadines", tribe: "North American" },
      { label: "Samoa", tribe: "Oceanic" },
      { label: "San Marino", tribe: "European" },
      { label: "São Tomé and Príncipe", tribe: "African" },
      { label: "Saudi Arabia", tribe: "Middle Eastern" },
      { label: "Senegal", tribe: "African" },
      { label: "Serbia", tribe: "European" },
      { label: "Seychelles", tribe: "African" },
      { label: "Sierra Leone", tribe: "African" },
      { label: "Singapore", tribe: "Asian" },
      { label: "Slovakia", tribe: "European" },
      { label: "Slovenia", tribe: "European" },
      { label: "Solomon Islands", tribe: "Oceanic" },
      { label: "Somalia", tribe: "African" },
      { label: "South Africa", tribe: "African" },
      { label: "South Korea", tribe: "Asian" },
      { label: "South Sudan", tribe: "African" },
      { label: "Spain", tribe: "European" },
      { label: "Sri Lanka", tribe: "Asian" },
      { label: "Sudan", tribe: "African" },
      { label: "Suriname", tribe: "LATAM" },
      { label: "Sweden", tribe: "European" },
      { label: "Switzerland", tribe: "European" },
      { label: "Syria", tribe: "Middle Eastern" },
      { label: "Tajikistan", tribe: "Asian" },
      { label: "Tanzania", tribe: "African" },
      { label: "Thailand", tribe: "Asian" },
      { label: "Timor-Leste", tribe: "Asian" },
      { label: "Togo", tribe: "African" },
      { label: "Tonga", tribe: "Oceanic" },
      { label: "Trinidad and Tobago", tribe: "North American" },
      { label: "Tunisia", tribe: "African" },
      { label: "Turkey", tribe: "European" },
      { label: "Turkmenistan", tribe: "Asian" },
      { label: "Tuvalu", tribe: "Oceanic" },
      { label: "Uganda", tribe: "African" },
      { label: "Ukraine", tribe: "European" },
      { label: "United Arab Emirates", tribe: "Middle Eastern" },
      { label: "United Kingdom", tribe: "European" },
      { label: "United States", tribe: "North American" },
      { label: "Uruguay", tribe: "LATAM" },
      { label: "Uzbekistan", tribe: "Asian" },
      { label: "Vanuatu", tribe: "Oceanic" },
      { label: "Vatican City", tribe: "European" },
      { label: "Venezuela", tribe: "LATAM" },
      { label: "Vietnam", tribe: "SEA" },
      { label: "Yemen", tribe: "Middle Eastern" },
      { label: "Zambia", tribe: "African" },
      { label: "Zimbabwe", tribe: "African" },
    ],
  },
  {
    key: 'age',
    title: "How old are you?",
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
    title: "Where do you hang out most online?",
    subtitle: "(Choose up to 3)",
    type: 'multi',
    max: 3,
    options: [
      { label: "X", icon: "𝕏" },
      { label: "LinkedIn", icon: "in" },
      { label: "TikTok", icon: "♪" },
      { label: "YouTube", icon: "▶" },
      { label: "Instagram", icon: "📸" },
      { label: "Facebook", icon: "f" },
      { label: "Substack", icon: "📬" },
      { label: "Other", icon: "✨", isOther: true },
    ],
  },
  {
    key: 'tasks',
    title: "What do you want AI to help you with?",
    subtitle: "(Choose up to 5)",
    type: 'multi',
    max: 5,
    options: [
      { label: "Business / Analytics", icon: "📊" },
      { label: "Coding / Dev tools", icon: "🛠" },
      { label: "Coaching & Wellness", icon: "🧠" },
      { label: "Crypto/web3", icon: "🍿" },
      { label: "Learning", icon: "📖" },
      { label: "Visual design / Image generation", icon: "🎭" },
      { label: "Writing/ Content creation", icon: "✍️" },
      { label: "Marketing/ advertising", icon: "📢" },
      { label: "Automation/ Productivity", icon: "⚙️" },
      { label: "Other", icon: "🧩", isOther: true },
    ],
  },
  {
    key: 'comfort',
    title: "What's your comfort level with AI?",
    subtitle: "Let's Personalize Your Profile",
    type: 'single',
    options: [
      { label: "Newcomer", icon: "✨", desc: "Just getting started" },
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
  tribe?: string;
}
interface QuizStep {
  key: string;
  title: string;
  subtitle?: string;
  type: 'multi' | 'dropdown' | 'radio' | 'single' | 'country_grid';
  max?: number;
  options: QuizOption[];
}

export function QuizSection({ onQuizComplete }: { onQuizComplete?: () => void } = {}) {
  const unifiedSession = useUnifiedSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [otherInputs, setOtherInputs] = useState<Record<string, any>>({});
  const [selectedTribe, setSelectedTribe] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const router = useRouter();

  // Get user ID from session or localStorage
  const getUserId = () => {
    const userId = unifiedSession.user?.id || localStorage.getItem('worldcoin_user_id');
    if (!userId) {
      console.error('No user ID found');
      return null;
    }
    return userId;
  };

  // Country grid selection handler
  const handleCountrySelect = (option: QuizOption, step: QuizStep) => {
    setAnswers({ ...answers, [step.key]: option.label });
    if (option.tribe) {
      setSelectedTribe(option.tribe);
    }
  };

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
    if (step.key === 'location') {
      const value = answers[step.key] || '';
      const city = answers['city'] || '';
      const selectedOption = step.options.find(opt => opt.label === value);
      const tribe = selectedOption?.tribe || '';
      
        return (
        <div className="space-y-4">
            <select
            className="w-full p-3 border-2 border-indigo-300 rounded-xl text-lg focus:ring-2 focus:ring-indigo-400 bg-white"
            value={value}
            onChange={(e) => {
              const selected = step.options.find(opt => opt.label === e.target.value);
              setAnswers({ ...answers, [step.key]: e.target.value });
              if (selected?.tribe) {
                setSelectedTribe(selected.tribe);
              }
            }}
            >
            <option value="" disabled>Select your country</option>
            {step.options.map((option) => (
              <option key={option.label} value={option.label}>{option.label}</option>
              ))}
            </select>
          
                  <input
                    type="text"
            className="w-full p-3 border-2 border-indigo-300 rounded-xl text-lg focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter your city"
            value={city}
            onChange={(e) => setAnswers({ ...answers, city: e.target.value })}
          />
          
          {selectedTribe && value && city && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 border border-green-200 rounded-xl text-center"
            >
              <p className="text-green-800 font-semibold">
                Welcome to the {selectedTribe} AI Hunter Tribe! 🎉
              </p>
            </motion.div>
          )}
          </div>
        );
    }
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
              className={`w-full p-4 text-left text-gray-700 bg-white border rounded-xl transition-colors font-semibold text-lg shadow-sm ${selected.includes(option.label) || (option.isOther && otherSelected) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400 hover:bg-indigo-50'}`}
              disabled={isDisabled && !selected.includes(option.label) && !option.isOther}
              style={{ cursor: isDisabled && !selected.includes(option.label) && !option.isOther ? 'not-allowed' : 'pointer' }}
              >
              <div className="flex items-center gap-3">
                  {option.icon && <span className="text-2xl">{option.icon}</span>}
                <div className="flex-1">
                  <span>{option.label}</span>
                  {option.desc && <div className="text-xs text-gray-500 mt-1">{option.desc}</div>}
                </div>
                {(selected.includes(option.label) || (option.isOther && otherSelected)) && <span className="ml-auto text-indigo-600 font-bold">✓</span>}
              </div>
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
    const currentAnswers = answers[step.key];

    if (!currentAnswers) return false;

    switch (step.type) {
      case 'multi':
        return currentAnswers.length > 0;
      case 'dropdown':
        // Make city required for location step
    if (step.key === 'location') {
          return currentAnswers && answers.city && currentAnswers.trim() !== '' && answers.city.trim() !== '';
    }
        return currentAnswers;
      case 'radio':
      case 'single':
        return currentAnswers.length > 0;
      default:
    return false;
    }
  };

  // Next step
  const handleNext = async () => {
    if (currentStep === quizSteps.length - 1) {
      // Save quiz answers to database before proceeding
      try {
        const userId = getUserId();
        if (!userId) {
          console.error('No user ID found');
          return;
        }

        // Format answers for database
        const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
          score: 1 // Default score for now
        }));

        // Save to database
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            answers: formattedAnswers
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save quiz answers');
        }

        // Update user's onboarding status
        const updateResponse = await fetch(`/api/user/${userId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            onboardingCompleted: true
          }),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update onboarding status');
        }

        // Proceed to mint page
        router.push('/quiz/mint');
      } catch (error) {
        console.error('Error saving quiz:', error);
        // Still proceed to mint page even if save fails
        router.push('/quiz/mint');
      }
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
      if (!(MiniKit as any).walletAddress) {
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
          args: [(MiniKit as any).walletAddress as string, 'ipfs://QmdStFxJS9SNNEvxAk4U8jiwsEbRoStffQJUDyghxvgcvj/0']
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
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
                {quizSteps[currentStep].title}
              </h2>
              {quizSteps[currentStep].subtitle && (
                <p className="text-sm text-gray-600 mb-4 text-center">
                  {quizSteps[currentStep].subtitle}
                </p>
              )}
              {renderStep(quizSteps[currentStep], currentStep)}
            </motion.div>
            <motion.button
              className="w-full mt-8 px-4 py-3 text-white font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === quizSteps.length - 1 ? 'Continue → Launch First AI Hunt' : 'Next →'}
            </motion.button>
          </div>
          {/* Confetti and Reveal/Minting UI */}
          <AnimatePresence mode="wait">
            {showReveal && (
              <>
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 p-4 sm:p-8 bg-white rounded-lg shadow-lg text-center flex flex-col items-center justify-center z-20 max-w-md mx-auto my-auto space-y-5"
                >
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
              </motion.div>
              </>
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
          /* Removed purple border for badge reveal */
          background: none;
          padding: 0;
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