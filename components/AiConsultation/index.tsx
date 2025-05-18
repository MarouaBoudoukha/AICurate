'use client';

import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import { MiniKit, PayCommandInput, Tokens, tokenToDecimals } from '@worldcoin/minikit-js';
import { motion } from 'framer-motion';
import { Bot, Send, Loader2, Coins } from 'lucide-react';
import { useCreditsStore } from '@/store/credits';

const CREDIT_COST = 0.05; // 0.05 WLD per credit
const CREDITS_PER_PURCHASE = 5; // Get 5 credits per purchase
const INITIAL_FREE_CREDITS = 5; // First 5 messages are free

export function AiConsultation() {
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { credits, addCredits, deductCredit } = useCreditsStore();

  const {
    messages,
    input,
    handleInputChange,
    isLoading,
    error,
    append,
    handleSubmit: chatSubmit
  } = useChat({
    api: '/api/ai',
    body: {
      hasCredits: credits > 0
    },
    onResponse: (response) => {
      // Check if the response was successful
      if (response.ok) {
        // Only deduct credit after successful response
        deductCredit();
      }
    }
  });

  // Auto-scroll to bottom when messages change or during loading
  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    if (credits <= 0) {
      setPaymentError('No credits remaining. Please purchase more credits to continue.');
      return;
    }

    try {
      await chatSubmit(e);
    } catch (err) {
      console.error('Chat error:', err);
      setPaymentError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const handleBuyCredits = async () => {
    setIsPaymentPending(true);
    setPaymentError(null);

    try {
      if (!MiniKit.isInstalled()) {
        throw new Error('World App not installed');
      }

      // Get payment reference from backend
      const initResponse = await fetch('/api/initiate-payment', {
        method: 'POST'
      });
      
      if (!initResponse.ok) {
        throw new Error('Failed to initialize payment');
      }
      
      const { id: reference } = await initResponse.json();
      console.log('Payment reference:', reference);

      // Calculate total cost in WLD
      const totalCost = CREDIT_COST * CREDITS_PER_PURCHASE;
      const tokenAmount = tokenToDecimals(totalCost, Tokens.WLD).toString();
      console.log('Token amount:', tokenAmount);

      const paymentPayload: PayCommandInput = {
        to: process.env.NEXT_PUBLIC_WLD_APP_ID as string,
        tokens: [{
          symbol: Tokens.WLD,
          token_amount: tokenAmount
        }],
        reference,
        description: `${CREDITS_PER_PURCHASE} AI Consultation Credits`
      };

      console.log('Sending payment payload:', paymentPayload);
      const response = await MiniKit.commandsAsync.pay(paymentPayload);
      console.log('Payment response:', response);
      
      if (!response?.finalPayload) {
        throw new Error('No payment response received');
      }

      if (response.finalPayload.status === 'error') {
        throw new Error('Payment failed');
      }

      if (response.finalPayload.status === 'success') {
        // Verify payment with backend
        const confirmResponse = await fetch('/api/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            payload: response.finalPayload
          })
        });

        if (!confirmResponse.ok) {
          throw new Error('Payment verification failed');
        }

        const { success } = await confirmResponse.json();
        if (!success) {
          throw new Error('Payment verification failed');
        }

        // Add credits after successful payment
        addCredits(CREDITS_PER_PURCHASE);
        console.log('Credits added:', CREDITS_PER_PURCHASE);
      }

    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setIsPaymentPending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] bg-white rounded-lg shadow-lg">
      <header className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Madame Dappai</h1>
              <p className="text-sm text-gray-600">AI Consultant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
              <Coins className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                {credits} credits
              </span>
            </div>
            <button
              onClick={handleBuyCredits}
              disabled={isPaymentPending}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 disabled:opacity-50"
            >
              {isPaymentPending ? 'Processing...' : `Buy ${CREDITS_PER_PURCHASE} credits`}
            </button>
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-b flex items-center gap-2 bg-white"
      >
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={credits > 0 ? "Ask Madame Dappai about AI tools..." : "Purchase credits to chat..."}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading || isPaymentPending || credits <= 0}
        />
        <button
          type="submit"
          disabled={isLoading || isPaymentPending || !input.trim() || credits <= 0}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
            </div>
          </motion.div>
        )}

        {(error || paymentError) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center"
          >
            <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm">
              {error?.message || paymentError}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 