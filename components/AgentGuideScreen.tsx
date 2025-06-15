"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Clock } from "lucide-react";
import { useUnifiedSession } from '@/hooks/useUnifiedSession';

// Step icons for TASKS framework
const stepIcons: Record<string, string> = {
  intro: '💬',
  target: '🎯',
  assess: '🔍',
  sample: '🧪',
  knowledge: '🧠',
  select: '⭐',
  completed: '📸'
};

// Steps definition for TASKS framework (3 steps)
const steps = [
  { id: 'target', label: 'Target', icon: '🎯' },
  { id: 'assess', label: 'Assess', icon: '🔍' },
  { id: 'select', label: 'Select', icon: '⭐' },
];

const conversationStarters = [
  "I need an AI to build a DAPP",
  "I need an AI to help me cook",
  "I need an AI to plan my trip",
  "I need an AI to create social media content",
  "I need an AI to analyze data",
  "I need an AI to automate my business"
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  step?: string;
  responseOptions?: string[];
}

interface AIToolRecommendation {
  tool: string;
  reasoning: string;
  nextSteps: string;
  compatibilityScore: number;
  rating: number;
  reviews: number;
  curationTags: string[];
  referralLink: string;
  proofPoints: number;
}

// Step Progress Component
function StepProgress({ currentStep, sessionTime }: { currentStep: string; sessionTime: number }) {
  const [targetTime] = useState<number>(3 * 60); // 3 minutes in seconds
  
  // Calculate current step index (intro is not counted in progress)
  const currentIndex = currentStep === 'intro' ? -1 : steps.findIndex(step => step.id === currentStep);
  const progress = currentIndex === -1 ? 0 : ((currentIndex + 1) / steps.length) * 100;
  
  // Calculate time remaining (countdown from 3 minutes)
  const timeRemaining = Math.max(targetTime - sessionTime, 0);
  const timeProgress = Math.min((sessionTime / targetTime) * 100, 100);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Time warning color
  const getTimeColor = () => {
    if (timeProgress >= 90) return 'text-red-500';
    if (timeProgress >= 75) return 'text-yellow-500';
    return 'text-green-500';
  };
  
  return (
    <div className="w-full mb-6">
      {/* Step progress bar with animation */}
      <div className="flex items-center mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 mr-3 dark:bg-gray-700 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
        <div className={`text-sm font-medium ${getTimeColor()} min-w-[3rem]`}>
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      {/* Step indicators with enhanced animations */}
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentIndex > index;
          const isUpcoming = currentIndex < index;
          
          return (
            <div 
              key={step.id} 
              className="relative flex flex-col items-center group"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="absolute top-4 left-8 w-full h-0.5 -z-10">
                  <div 
                    className={`h-full transition-all duration-700 ${
                      isCompleted || isActive ? 'bg-indigo-400' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  ></div>
                </div>
              )}
              
              {/* Step circle with animations */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all duration-500 transform ${
                  isActive 
                    ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-500/50 ring-4 ring-indigo-200 dark:ring-indigo-800' 
                    : isCompleted 
                      ? 'bg-green-500 text-white scale-105' 
                      : 'bg-gray-200 text-gray-400 dark:bg-gray-700 hover:scale-105'
                }`}
              >
                {isCompleted ? (
                  <span className="animate-bounce">✓</span>
                ) : (
                  <span className={isActive ? 'animate-pulse' : ''}>{stepIcons[step.id]}</span>
                )}
              </div>
              
              {/* Step label with fade animation */}
              <span className={`text-xs mt-2 font-medium transition-all duration-300 ${
                isActive 
                  ? 'text-indigo-600 dark:text-indigo-400 opacity-100 transform scale-105' 
                  : isCompleted
                    ? 'text-green-600 dark:text-green-400 opacity-90'
                    : 'text-gray-500 dark:text-gray-400 opacity-70'
              }`}>
                {step.label}
              </span>
              
              {/* Active step indicator */}
              {isActive && (
                <div className="absolute -bottom-1 w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Progress percentage indicator */}
      <div className="mt-3 text-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Progress: {Math.round(progress)}% • Step {Math.max(currentIndex + 1, 0)} of {steps.length}
        </span>
      </div>
    </div>
  );
}

// AI Tool Recommendation Component
function AIToolRecommendationModal({ 
  recommendation, 
  onClose, 
  onSave 
}: { 
  recommendation: AIToolRecommendation; 
  onClose: () => void; 
  onSave: () => void; 
}) {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  
  const handleEmailSubmit = () => {
    if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    console.log(`Sending recommendation to ${email}`);
    setEmailSent(true);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
          ⭐ Your AIcurate Pick™
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            ✅ {recommendation.tool}
          </h3>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Compatibility Score™</h4>
          <p className="text-2xl font-bold text-indigo-600">🌟 {recommendation.compatibilityScore}/100</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Why this tool?</h4>
          <p className="text-gray-800 dark:text-gray-100">📌 {recommendation.reasoning}</p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Steps</h4>
          <p className="text-gray-800 dark:text-gray-100 font-medium">🚀 {recommendation.nextSteps}</p>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {recommendation.curationTags.map((tag, index) => (
              <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            ⭐ {recommendation.rating} | 👥 {recommendation.reviews?.toLocaleString()} reviews
          </div>
          
          <div className="mt-2 text-green-700 font-semibold">
            💰 You earned +{recommendation.proofPoints} ProofPoints™ for this pick!
          </div>
        </div>
      </div>
      
      {!emailSent ? (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Would you like a copy sent to your email so you can revisit it later?
          </p>
          
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <Button onClick={handleEmailSubmit} className="px-4">
              Send
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-green-600 dark:text-green-400 mb-4">
            ✓ Your AI tool recommendation has been sent to {email}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Would you like to save this recommendation for future reference? (Premium feature)
          </p>
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Button onClick={onClose} className="px-4 bg-gray-200 text-gray-800">
          Close
        </Button>
        <Button onClick={onSave} className="px-4">
          Save to My Vault
        </Button>
      </div>
    </div>
  );
}

export default function AgentGuideScreen() {
  const unifiedSession = useUnifiedSession();
  const guestId = useMemo(() => `guest-${Math.random().toString(36).slice(2, 10)}`, []);
  const userId = unifiedSession.user?.id || guestId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('target');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [showComingSoonPopup, setShowComingSoonPopup] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize with welcome message if empty
  useEffect(() => {
    // Don't auto-add welcome message - let the starter buttons serve as the welcome interface
  }, [messages.length]);

  // Start session timer
  useEffect(() => {
    timerInterval.current = setInterval(() => {
      // Timer logic would go here
    }, 1000);
    
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Handle premium subscription prompt
    if (input.toLowerCase().includes('yes')) {
      setMessages(prev => [...prev, 
        { role: 'user', content: input, step: currentStep },
        { role: 'assistant', content: "Great! To upgrade to premium and save all your AI tool recommendations, please visit our subscription page. With premium, you'll get unlimited access to your personal AI tool vault and deeper insights.", step: currentStep }
      ]);
      setShowEmailInput(false);
    } else {
      setMessages(prev => [...prev, 
        { role: 'user', content: input, step: currentStep },
        { role: 'assistant', content: "No problem! Your AI tool recommendation is still available in this session. Would you like to start a new tool search?", step: currentStep }
      ]);
      setShowEmailInput(false);
    }
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          userId,
          currentStep,
          messages: [...messages, { role: 'user', content: input, step: currentStep }],
        }),
      });

      const data = await response.json();
      
      // Update current step if provided by the API
      if (data.currentStep) {
        setCurrentStep(data.currentStep);
      } else {
        // Try to detect step from message content
        setCurrentStep(detectStepFromContent(data.message));
      }
      
      // Check if this is a prompt for email
      if (data.message.includes('Would you like a copy sent to your email')) {
        setShowEmailInput(true);
      }
      
      // Check if this is an AI Tool Recommendation
      if (data.data?.recommendation && currentStep === 'select') {
        setRecommendation(data.data.recommendation);
        setShowRecommendation(true);
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message,
        step: data.currentStep || detectStepFromContent(data.message),
        responseOptions: data.data?.responseOptions || data.responseOptions
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try again.',
        step: currentStep
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to detect step from message content
  const detectStepFromContent = (content: string): string => {
    if (content.includes('🎯') || content.includes('Target')) {
      return 'target';
    } else if (content.includes('🔍') || content.includes('Assess') || content.includes('experience') || content.includes('budget')) {
      return 'assess';
    } else if (content.includes('⭐') || content.includes('Select') || content.includes('recommendation') || content.includes('Your AIcurate Pick™')) {
      return 'select';
    }
    return currentStep; // Keep current step if no clear indicator
  };

  // Handle starting new session with a conversation starter
  const handleStarterClick = async (starter: string) => {
    const userMessage: Message = { role: 'user', content: starter, step: currentStep };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: starter,
          userId,
          currentStep,
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();
      
      // Update current step if provided by the API
      if (data.currentStep) {
        setCurrentStep(data.currentStep);
      } else {
        // Try to detect step from message content
        setCurrentStep(detectStepFromContent(data.message));
      }
      
      // Check if this is a prompt for email
      if (data.message.includes('Would you like a copy sent to your email')) {
        setShowEmailInput(true);
      }
      
      // Check if this is an AI Tool Recommendation
      if (data.data?.recommendation && currentStep === 'select') {
        setRecommendation(data.data.recommendation);
        setShowRecommendation(true);
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message,
        step: data.currentStep || detectStepFromContent(data.message),
        responseOptions: data.data?.responseOptions || data.responseOptions
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try again.',
        step: currentStep
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset conversation
  const handleNewSession = () => {
    setMessages([]);
    setCurrentStep('target');
    setShowEmailInput(false);
    setShowRecommendation(false);
  };

  const handleSaveRecommendation = () => {
    // Implement recommendation saving logic
    alert('Recommendation saved! (Premium feature)');
  };

  // Handle bonus button click
  const handleBonusClick = () => {
    setShowComingSoonPopup(true);
  };

  // Handle response options
  const handleResponseOption = async (option: string) => {
    if (option === "Leave a review on AICURATE") {
      handleBonusClick();
      return;
    }

    const userMessage: Message = { role: 'user', content: option, step: currentStep };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: option,
          userId,
          currentStep,
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();
      
      if (data.currentStep) setCurrentStep(data.currentStep);
      
      // Check if this is a prompt for email
      if (data.message.includes("Would you like me to notify you when new tools match your needs?")) {
        setShowEmailInput(true);
      }
      
      // Check if this is an AI Tool Recommendation
      if (data.data?.recommendation && currentStep === 'select') {
        setRecommendation(data.data.recommendation);
        setShowRecommendation(true);
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message,
        step: data.currentStep || detectStepFromContent(data.message),
        responseOptions: data.data?.responseOptions || data.responseOptions
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error. Please try again.',
        step: currentStep
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header with step information and timer */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <MessageCircle className="text-white" size={24} />
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold dark:text-white">AICURATE</h1>
              {currentStep !== 'intro' && (
                <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  <span>{stepIcons[currentStep]} {currentStep.charAt(0).toUpperCase() + currentStep.slice(1)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Tool Curation — Powered by TASKS™
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
            Intelligent AI tool matching in under 3 minutes
          </p>
        </div>

        {/* Progress Bar - Temporarily disabled
        <StepProgress currentStep={currentStep} sessionTime={sessionTime} />
        */}

        {/* Chat Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-4 h-[600px] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4">
            {messages.length === 0 ? (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-xl text-gray-800 dark:text-gray-200 mb-2">
                    I'm AICURATE. What do you need to build or accomplish?
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose a quick start or describe your specific need
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {conversationStarters.map((starter, index) => (
                    <button
                      key={index}
                      onClick={() => handleStarterClick(starter)}
                      className="p-4 text-left bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-800/30 dark:hover:to-purple-800/30 transition-all duration-300 border border-indigo-200 dark:border-indigo-700 hover:border-indigo-300 dark:hover:border-indigo-600 transform hover:scale-105 hover:shadow-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center">
                          <span className="text-indigo-600 dark:text-indigo-400">🚀</span>
                        </div>
                        <span className="font-medium text-gray-800 dark:text-gray-200">{starter}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {message.role === 'assistant' && message.step && message.step !== 'intro' && (
                      <div className="text-sm font-medium mb-1 text-indigo-600 dark:text-indigo-400">
                        {stepIcons[message.step || 'intro']} {message.step.charAt(0).toUpperCase() + message.step.slice(1)}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {/* Response options as buttons */}
                    {message.role === 'assistant' && message.responseOptions && message.responseOptions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.responseOptions.map((option, optionIndex) => (
                          <Button
                            key={optionIndex}
                            variant="outline"
                            size="sm"
                            onClick={() => handleResponseOption(option)}
                            className="text-xs"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-gray-100 dark:bg-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-75"></div>
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-150"></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                      AICURATE is analyzing...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex gap-2">
            {currentStep === 'intro' && messages.length <= 1 ? (
              // Show conversation starters on small screens
              <div className="md:hidden w-full">
                <select 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  onChange={(e) => setInput(e.target.value)}
                  value=""
                >
                  <option value="" disabled>Choose a starting point...</option>
                  {conversationStarters.map((starter, index) => (
                    <option key={index} value={starter}>
                      {starter.length > 60 ? starter.substring(0, 57) + '...' : starter}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={showEmailInput ? "Enter your email address..." : "Type your message..."}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-4"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
          
          {currentStep === 'select' && (
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleNewSession}
                className="px-4"
              >
                New Session
              </Button>
            </div>
          )}
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            AICurate AI provides general information only. It is not medical, financial, therapeutic, or professional advice.
          </div>
        </div>
      </div>
      
      {/* AI Tool Recommendation Modal */}
      {showRecommendation && recommendation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <AIToolRecommendationModal
            recommendation={recommendation}
            onClose={() => setShowRecommendation(false)}
            onSave={handleSaveRecommendation}
          />
        </div>
      )}

      {/* Coming Soon Popup */}
      {showComingSoonPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Coming Soon!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              This feature is currently under development. Stay tuned for updates!
            </p>
            <Button
              onClick={() => setShowComingSoonPopup(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 