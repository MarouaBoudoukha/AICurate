"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: any;
}

interface AgentChatInterfaceProps {
  userId?: string;
}

export function AgentChatInterface({ userId }: AgentChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Generate a guest id if userId is not provided
  const guestId = React.useMemo(() => `guest-${Math.random().toString(36).slice(2, 10)}`, []);
  const effectiveUserId = userId || guestId;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call the agent API route
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input,
          userId: effectiveUserId,
          sessionId,
        }),
      });
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        data: data.data,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render tool recommendations, curation tags, and reward nudges
  const renderAgentData = (data: any) => {
    if (!data) return null;
    return (
      <div className="mt-2 space-y-2">
        {data.tools && (
          <div>
            <div className="font-semibold text-indigo-700 mb-1">Recommended Tools:</div>
            <ul className="list-disc ml-6">
              {data.tools.map((tool: any, idx: number) => (
                <li key={tool.id || idx} className="mb-1">
                  <span className="font-bold">{tool.name}</span> {' '}
                  {tool.curationTags && tool.curationTags.length > 0 && (
                    <span className="ml-2 text-xs text-green-600">{tool.curationTags.join(' | ')}</span>
                  )}
                  {tool.website && (
                    <a href={tool.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 underline">Visit</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.recommendation && (
          <div className="bg-indigo-50 rounded-lg p-3 mt-2">
            <div className="font-bold text-indigo-800">✅ Recommended AI Tool: {data.recommendation.tool}</div>
            <div>🌟 AIcurate Compatibility Score™: {data.recommendation.compatibilityScore}</div>
            <div>📌 Why this tool? {data.recommendation.reasoning}</div>
            <div>🚀 Next Steps: {data.recommendation.nextSteps}</div>
          </div>
        )}
        {data.proofPointsEarned && (
          <div className="text-sm text-purple-700 mt-1">+{data.proofPointsEarned} ProofPoints™ for this step!</div>
        )}
        {data.curationTags && data.curationTags.length > 0 && (
          <div className="text-xs text-green-700 mt-1">Curation: {data.curationTags.join(' | ')}</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] bg-white rounded-lg shadow-lg">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-indigo-600" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.role === 'assistant' && renderAgentData(message.data)}
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-500"
          >
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about AI tools..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 