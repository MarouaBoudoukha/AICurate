"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, HelpCircle, BookOpen, Search, Send, MessageSquare } from 'lucide-react';

export default function Support() {
  const router = useRouter();
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const handleChatbotClick = () => {
    setShowChatbot(true);
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <button className="text-gray-500 hover:text-indigo-500" onClick={() => router.back()}>
          <span className="text-2xl">&larr;</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center">Support & Help Center</h2>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 space-y-6">
        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
          <Search className="w-5 h-5 text-gray-500" />
          <input type="text" placeholder="Search for help..." className="flex-1 bg-transparent border-none outline-none" />
        </div>
        {/* FAQ Section */}
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          <div>
            <div className="font-semibold text-gray-700">FAQ</div>
            <span className="text-gray-400">[FAQ Placeholder]</span>
          </div>
        </div>
        {/* Contact Form */}
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-indigo-500" />
          <div>
            <div className="font-semibold text-gray-700">Contact</div>
            <span className="text-indigo-500">support@aicurate.com</span>
          </div>
        </div>
        {/* Submit a Request Section */}
        <div className="flex items-center gap-3">
          <Send className="w-5 h-5 text-green-600" />
          <div>
            <div className="font-semibold text-gray-700">Submit a Request</div>
            <span className="text-gray-400">Click on the link below to open the request form.</span>
          </div>
        </div>
        {/* Chatbot Widget */}
        <div className="relative">
          <button className="absolute top-0 right-0 p-2 bg-indigo-500 text-white rounded-full" onClick={handleChatbotClick}>
            <MessageSquare className="w-5 h-5" />
          </button>
          {showChatbot && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">Thank you for reaching out to AIcurate Support!</p>
              <p className="text-gray-700">🤖 We&apos;re currently experiencing a high volume of inquiries. For the fastest resolution, always check our Help Center first 📚🔍</p>
              <p className="text-gray-700">🤖✨ Please follow the bot&apos;s guidance carefully. It&apos;s designed to help you reach the right support quickly—think of it as your helpful guide, not a hurdle! 🚀</p>
              <p className="text-gray-700">🤖Select the most relevant option below, and I&apos;ll do my best to assist you.</p>
              <div className="mt-2 space-y-2">
                <button className="w-full px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full text-xs font-semibold transition" onClick={() => handleOptionSelect('Account related issues')}>Account related issues</button>
                <button className="w-full px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full text-xs font-semibold transition" onClick={() => handleOptionSelect('Privacy issue')}>Privacy issue</button>
                <button className="w-full px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full text-xs font-semibold transition" onClick={() => handleOptionSelect('Claim Airdrop')}>Claim Airdrop</button>
                <button className="w-full px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full text-xs font-semibold transition" onClick={() => handleOptionSelect('Report Scams or Abuse')}>Report Scams or Abuse</button>
                <button className="w-full px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full text-xs font-semibold transition" onClick={() => handleOptionSelect('Invites & Referral rewards')}>Invites & Referral rewards</button>
                <button className="w-full px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full text-xs font-semibold transition" onClick={() => handleOptionSelect('Wallet and Proofpoints')}>Wallet and Proofpoints</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 