"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Vault, Coins, ArrowUpRight, ArrowDownLeft, History, Lock } from 'lucide-react';

const transactions = [
  {
    id: 1,
    type: 'earn',
    amount: 50,
    description: 'Completed AI Challenge',
    date: '2024-03-15',
    status: 'completed'
  },
  {
    id: 2,
    type: 'spend',
    amount: 25,
    description: 'Tool Access',
    date: '2024-03-14',
    status: 'completed'
  },
  {
    id: 3,
    type: 'earn',
    amount: 100,
    description: 'Referral Bonus',
    date: '2024-03-13',
    status: 'completed'
  }
];

export default function Wallet() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <motion.div
      className="p-4 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-400 transition flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <ArrowLeft className="w-5 h-5" /> Go Back
      </motion.button>

      <motion.h1
        className="text-2xl font-bold mb-2 text-indigo-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        Wallet
      </motion.h1>

      {/* Stats Widget */}
      <motion.div
        className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow px-5 py-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <Vault className="w-7 h-7 text-indigo-500" />
          <div>
            <div className="text-xs text-gray-500">Total Balance</div>
            <div className="text-xl font-bold text-indigo-700">1,250 Credits</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Coins className="w-7 h-7 text-purple-500" />
          <div>
            <div className="text-xs text-gray-500">Available</div>
            <div className="text-xl font-bold text-purple-700">1,000 Credits</div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="flex gap-2 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <button
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </motion.div>

      {activeTab === 'overview' ? (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-indigo-500" />
              </div>
              <span className="font-medium text-gray-700">Convert</span>
            </button>
            <button className="p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                <Lock className="w-6 h-6 text-indigo-500" />
              </div>
              <span className="font-medium text-gray-700">Stake</span>
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {transactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center ${
                      transaction.type === 'earn' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.type === 'earn' ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{transaction.description}</div>
                      <div className="text-sm text-gray-500">{transaction.date}</div>
                    </div>
                  </div>
                  <div className={`font-semibold ${
                    transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Transaction History</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700">View All</button>
          </div>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center ${
                    transaction.type === 'earn' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'earn' ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-sm text-gray-500">{transaction.date}</div>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 