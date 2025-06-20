"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Send, 
  Clock, 
  Target, 
  Search, 
  TestTube, 
  Brain, 
  CheckCircle,
  Star 
} from 'lucide-react';
import { useUnifiedSession } from '@/hooks/useUnifiedSession';
import Image from "next/image";

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

// Steps definition for TASKS framework (5 steps)
const steps = [
  { id: 'target', label: 'Target', icon: '🎯' },
  { id: 'assess', label: 'Assess', icon: '🔍' },
  { id: 'sample', label: 'Sample', icon: '🧪' },
  { id: 'knowledge', label: 'Knowledge', icon: '🧠' },
  { id: 'select', label: 'Select', icon: '⭐' },
];

const conversationStarters = [
  "I need an AI to write a book",
  "I need an AI to build an app", 
  "I need an AI to plan trips",
  "I need an AI to create content"
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
  step?: string;
  responseOptions?: string[];
  recommendationData?: any;
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
  const [currentStep, setCurrentStep] = useState<string>('intro');
  const [sessionTime, setSessionTime] = useState<number>(0);
  const [showEmailInput, setShowEmailInput] = useState<boolean>(false);
  const [isPremiumPrompt, setIsPremiumPrompt] = useState<boolean>(false);
  const [showRecommendation, setShowRecommendation] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<AIToolRecommendation | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize with welcome message if empty
  useEffect(() => {
    // Don't auto-add welcome message - let the starter buttons serve as the welcome interface
  }, [messages.length]);

  // Start session timer
  useEffect(() => {
    timerInterval.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
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

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Handle premium subscription prompt
    if (isPremiumPrompt) {
      if (input.toLowerCase().includes('yes')) {
        setMessages(prev => [...prev, 
          { role: 'user', content: input, step: currentStep },
          { role: 'assistant', content: "Great! To upgrade to premium and save all your AI tool recommendations, please visit our subscription page. With premium, you'll get unlimited access to your personal AI tool vault and deeper insights.", step: currentStep }
        ]);
        setIsPremiumPrompt(false);
      } else {
        setMessages(prev => [...prev, 
          { role: 'user', content: input, step: currentStep },
          { role: 'assistant', content: "No problem! Your AI tool recommendation is still available in this session. Would you like to start a new tool search?", step: currentStep }
        ]);
        setIsPremiumPrompt(false);
      }
      setInput('');
      return;
    }
    
    // Handle email input
    if (showEmailInput) {
      if (input.includes('@')) {
        setMessages(prev => [...prev, 
          { role: 'user', content: input, step: currentStep },
          { role: 'assistant', content: `Perfect! I've sent your AI tool recommendation to ${input}. Would you like to save this recommendation for future reference? (Premium feature)`, step: currentStep }
        ]);
        setShowEmailInput(false);
        setIsPremiumPrompt(true);
      } else {
        setMessages(prev => [...prev, 
          { role: 'user', content: input, step: currentStep },
          { role: 'assistant', content: "That doesn't appear to be a valid email address. Would you like to try again or continue without sending an email?", step: currentStep }
        ]);
        setShowEmailInput(false);
      }
      setInput('');
      return;
    }

    const userMessage: Message = { role: 'user', content: input, step: currentStep };
    setMessages(prev => [...prev, userMessage]);
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
          sessionId,
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

      // Update session ID
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
      
      // Check if this is a prompt for email
      if (data.message.includes('Would you like a copy sent to your email')) {
        setShowEmailInput(true);
      }
      
      // Check if this is a premium feature prompt
      if (data.message.includes('save this recommendation') && 
          data.message.includes('Premium')) {
        setIsPremiumPrompt(true);
      }
      
      // Check if this is an AI Tool Recommendation
      if (data.data?.recommendation && (currentStep === 'complete' || data.currentStep === 'complete')) {
        setRecommendation({
          tool: data.data.recommendation.toolName || 'AI Tool',
          reasoning: data.data.recommendation.whyPerfect || 'Perfect match for your needs',
          nextSteps: 'Click the link to get started',
          compatibilityScore: data.data.recommendation.compatibilityScore || 90,
          rating: data.data.recommendation.rating || 4.5,
          reviews: 1000,
          curationTags: data.data.recommendation.keyFeatures || ['AI-Powered', 'Recommended'],
          referralLink: data.data.recommendation.url || '#',
          proofPoints: 50
        });
        setShowRecommendation(true);
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message,
        step: data.currentStep || detectStepFromContent(data.message),
        responseOptions: data.data?.responseOptions || data.responseOptions,
        recommendationData: data.data?.recommendation // Store recommendation data in message
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
    } else if (content.includes('🧪') || content.includes('Sample') || content.includes('perfect AI tool')) {
      return 'sample';
    } else if (content.includes('🧠') || content.includes('Knowledge') || content.includes('why this tool')) {
      return 'knowledge';
    } else if (content.includes('⭐') || content.includes('Select') || content.includes('recommendation')) {
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
          sessionId,
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

      // Update session ID
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }
      
      // Check if this is a prompt for email
      if (data.message.includes('Would you like a copy sent to your email')) {
        setShowEmailInput(true);
      }
      
      // Check if this is a premium feature prompt
      if (data.message.includes('save this recommendation') && 
          data.message.includes('Premium')) {
        setIsPremiumPrompt(true);
      }
      
      // Check if this is an AI Tool Recommendation
      if (data.data?.recommendation && (currentStep === 'complete' || data.currentStep === 'complete')) {
        setRecommendation({
          tool: data.data.recommendation.toolName || 'AI Tool',
          reasoning: data.data.recommendation.whyPerfect || 'Perfect match for your needs',
          nextSteps: 'Click the link to get started',
          compatibilityScore: data.data.recommendation.compatibilityScore || 90,
          rating: data.data.recommendation.rating || 4.5,
          reviews: 1000,
          curationTags: data.data.recommendation.keyFeatures || ['AI-Powered', 'Recommended'],
          referralLink: data.data.recommendation.url || '#',
          proofPoints: 50
        });
        setShowRecommendation(true);
      }
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message,
        step: data.currentStep || detectStepFromContent(data.message),
        responseOptions: data.data?.responseOptions || data.responseOptions,
        recommendationData: data.data?.recommendation // Store recommendation data in message
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
    setCurrentStep('intro');
    setSessionTime(0);
    setShowEmailInput(false);
    setIsPremiumPrompt(false);
    setShowRecommendation(false);
    setSessionId(null);
  };

  const handleSaveRecommendation = () => {
    // Implement recommendation saving logic
    alert('Recommendation saved! (Premium feature)');
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header - relative positioning */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 py-2 shadow-sm flex-shrink-0">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
            <MessageCircle className="text-white" size={12} />
          </div>
          <div className="ml-2">
            <h1 className="text-sm font-bold dark:text-white">AI Guide</h1>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Find the perfect AI tool for your needs
            </p>
          </div>
        </div>
      </header>

      {/* Scrollable Messages Area - fills available space */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 px-3 py-2">
        <div className="space-y-2">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col justify-center space-y-4 min-h-[400px]">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <Image
                    src="/onboarding/aicurate_agent.png"
                    alt="AICurate Agent"
                    width={160}
                    height={160}
                    className="object-cover"
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Tell me what you need help with or choose from the suggestions below
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                {conversationStarters.map((starter, index) => (
                  <button
                    key={index}
                    onClick={() => handleStarterClick(starter)}
                    className="p-2 text-xs text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  >
                    <span className="text-gray-700 dark:text-gray-200">{starter}</span>
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
                  className={`max-w-[80%] rounded-lg p-2 ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  {message.role === 'assistant' && message.step && message.step !== 'intro' && (
                    <div className="text-xs font-medium mb-1 text-indigo-600 dark:text-indigo-400">
                      {stepIcons[message.step || 'intro']} {message.step.charAt(0).toUpperCase() + message.step.slice(1)}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  
                  {/* Response options */}
                  {message.role === 'assistant' && message.responseOptions && message.responseOptions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.responseOptions.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          onClick={() => {
                            setInput(option);
                            handleSend();
                          }}
                          className="block w-full text-left p-2 text-xs bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Check if this message contains a card format recommendation */}
                  {message.role === 'assistant' && (message.content.includes('Perfect Match Found!') || message.recommendationData) && (
                    <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                            <Star className="text-white" size={18} />
                          </div>
                          <div className="ml-3">
                            <span className="text-sm font-bold text-blue-700 dark:text-blue-300 block">
                              {message.recommendationData?.toolName || 'Perfect AI Tool Match'}
                            </span>
                            {message.recommendationData?.rating && (
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                ⭐ {message.recommendationData.rating}/5
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Tool details */}
                      <div className="space-y-2 mb-4">
                        {message.recommendationData?.compatibilityScore && (
                          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Match Score</span>
                            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                              {message.recommendationData.compatibilityScore}/100
                            </span>
                          </div>
                        )}
                        
                        {message.recommendationData?.pricing && (
                          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Pricing</span>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              {message.recommendationData.pricing}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Action button */}
                      <button 
                        onClick={() => {
                          const toolUrl = message.recommendationData?.url || 
                                        message.content.match(/https?:\/\/[^\s\)]+/)?.[0];
                          
                          if (toolUrl && toolUrl !== '#') {
                            window.open(toolUrl, '_blank');
                          } else {
                            alert('Getting tool link...');
                          }
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                      >
                        🚀 Visit {message.recommendationData?.toolName || 'Tool'} Now
                      </button>
                      
                      <div className="flex items-center justify-center pt-2 mt-2 border-t border-blue-200 dark:border-blue-700">
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          ✨ Personalized by AICURATE AI
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-2 bg-gray-100 dark:bg-gray-700">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-150"></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 animate-pulse">
                    AICURATE is analyzing...
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area at bottom - relative positioning */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shadow-lg flex-shrink-0">
        <div className="flex gap-2 p-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={showEmailInput ? "Enter your email address..." : "Type your message or select an option above..."}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 text-sm"
          >
            {isLoading ? '...' : 'Send'}
          </Button>
        </div>
        
        {currentStep === 'complete' && (
          <div className="flex justify-end px-3 pb-2">
            <Button
              onClick={handleNewSession}
              className="px-3 py-1 text-xs"
            >
              New Session
            </Button>
          </div>
        )}
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
    </div>
  );
} 