import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle, AlertCircle, Info, Sparkles, Star, ExternalLink } from 'lucide-react';
import { useAICurate } from '../lib/hooks/useAICurate';

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
  data?: {
    userType?: 'individual' | 'business';
    nextStep?: string;
    nextStepPreview?: string;
    constraints?: Record<string, any>;
    tools?: Array<{
      name: string;
      description: string;
      category?: string;
      pricing: {
        model: 'free' | 'freemium' | 'subscription' | 'pay_per_use';
        details: string;
      };
      features: string[];
      complexity: 'simple' | 'moderate' | 'advanced';
      rating?: number;
      reviews?: number;
      url?: string;
    }>;
    comparison?: Record<string, {
      pros: string[];
      cons: string[];
      bestFor: string;
    }>;
    recommendation?: {
      tool: string;
      reasoning: string;
      nextSteps: string[];
      tips: string[];
      aiCurateScore: number;
    };
  };
  clarifyingQuestion?: string;
  nextStep?: 'target' | 'assess' | 'sample' | 'knowledge' | 'success' | 'complete';
}

interface AgentChatInterfaceProps {
  userId: string;
}

export default function AgentChatInterface({ userId }: AgentChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<'target' | 'assess' | 'sample' | 'knowledge' | 'success' | 'complete'>('target');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { userProfile, currentSession, processUserInput } = useAICurate(userId);

  useEffect(() => {
    if (userProfile) {
      setMessages([
        {
          id: 'welcome',
          type: 'agent',
          content: `Hi ${userProfile.name}! 👋 I&apos;m your AI Guide, and I&apos;m here to help you discover the perfect AI tools for your needs. I&apos;ll guide you through the process step by step, making sure we find exactly what you&apos;re looking for. What would you like to explore today?`,
          timestamp: new Date(),
          data: {
            nextStep: "Let&apos;s start by understanding your needs. What kind of AI tools are you looking for?"
          }
        }
      ]);
    }
  }, [userProfile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await processUserInput(inputValue);
      setCurrentStep(response.nextStep);
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response.message,
        timestamp: new Date(),
        data: response.data,
        clarifyingQuestion: response.clarifyingQuestion,
        nextStep: response.nextStep
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isAgent = message.type === 'agent';
    const isSystem = message.type === 'system';

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`flex ${isAgent ? 'justify-start' : 'justify-end'} mb-4`}
      >
        <div
          className={`max-w-[80%] rounded-2xl p-4 backdrop-blur-sm ${
            isAgent
              ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-lg shadow-indigo-500/20'
              : isSystem
              ? 'bg-gray-100/90 text-gray-800 shadow-lg'
              : 'bg-white/90 text-gray-800 shadow-lg'
          }`}
        >
          <div className="flex items-start gap-3">
            {isAgent && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.data?.nextStep && (
                <div className="mt-3 p-3 rounded bg-white/10 text-indigo-100 text-sm">
                  <span className="font-semibold">Next Step:</span> {message.data.nextStep}
                </div>
              )}
              {message.data?.nextStepPreview && (
                <div className="mt-2 p-2 rounded bg-white/5 text-indigo-200 text-xs">
                  <span className="font-semibold">Preview:</span> {message.data.nextStepPreview}
                </div>
              )}
              {message.clarifyingQuestion && (
                <div className="mt-2 p-2 rounded bg-indigo-800/30 text-indigo-100 text-xs">
                  <span className="font-semibold">Clarifying Question:</span> {message.clarifyingQuestion}
                </div>
              )}
              <div className="mt-2 text-xs opacity-75">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderToolCard = (tool: any, index: number) => (
    <motion.div
      key={tool.id || index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-white">{tool.name}</h4>
        <div className="flex items-center gap-1 text-xs text-yellow-400">
          <Star className="w-3 h-3 fill-current" />
          <span>{tool.rating || 'N/A'}</span>
        </div>
      </div>
      <p className="text-sm text-gray-300 mb-3">{tool.description}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {tool.features && tool.features.slice(0, 3).map((feature: string, i: number) => (
          <span key={i} className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">
            {feature}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded">
          {tool.pricing?.details || 'Check website'}
        </span>
        {tool.url && (
          <a 
            href={tool.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded-lg flex items-center gap-1 transition-colors"
          >
            Try it <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">AI Guide Chat</h2>
            <p className="text-sm text-gray-300">Let&apos;s find the perfect AI tools for you</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => renderMessage(message))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-6"
          >
            <div className="bg-gradient-to-br from-indigo-600/90 to-purple-600/90 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <div className="flex space-x-1 mb-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="text-xs text-indigo-200">
                    {currentStep === 'sample' ? 'Researching AI tools...' : 'Thinking...'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
          />
          <motion.button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-500/20"
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
} 