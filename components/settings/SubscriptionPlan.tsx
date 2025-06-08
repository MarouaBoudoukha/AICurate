"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, CheckCircle, Zap, Star, Crown } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '0',
    features: [
      'Basic AI tool access',
      'Limited challenges',
      'Community support',
      'Basic analytics'
    ],
    icon: Star,
    color: 'text-yellow-500'
  },
  {
    name: 'Pro',
    price: '9.99',
    features: [
      'Full AI tool access',
      'Unlimited challenges',
      'Priority support',
      'Advanced analytics',
      'Custom rewards',
      'Early access'
    ],
    icon: Zap,
    color: 'text-purple-500',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '29.99',
    features: [
      'Everything in Pro',
      'Team management',
      'Custom integrations',
      'Dedicated support',
      'API access',
      'White-label options'
    ],
    icon: Crown,
    color: 'text-indigo-500'
  }
];

export default function SubscriptionPlan() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('Pro');

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
        Subscription Plan
      </motion.h1>

      {/* Stats Widget */}
      <motion.div
        className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow px-5 py-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <CreditCard className="w-7 h-7 text-indigo-500" />
          <div>
            <div className="text-xs text-gray-500">Current Plan</div>
            <div className="text-xl font-bold text-indigo-700">Pro</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle className="w-7 h-7 text-purple-500" />
          <div>
            <div className="text-xs text-gray-500">Status</div>
            <div className="text-xl font-bold text-purple-700">Active</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            className={`relative bg-white rounded-xl shadow-lg p-6 ${
              selectedPlan === plan.name ? 'ring-2 ring-indigo-500' : ''
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center ${plan.color}`}>
                <plan.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                <div className="text-2xl font-bold text-gray-900">
                  ${plan.price}
                  <span className="text-sm text-gray-500 font-normal">/month</span>
                </div>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2 rounded-lg font-medium transition ${
                selectedPlan === plan.name
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedPlan(plan.name)}
            >
              {selectedPlan === plan.name ? 'Current Plan' : 'Select Plan'}
            </button>
          </motion.div>
        ))}
      </motion.div>

      {/* Payment Info */}
      <motion.div
        className="mt-8 bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h3 className="font-semibold text-gray-900 mb-4">Payment Information</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <CreditCard className="w-5 h-5 text-indigo-500" />
            <div className="flex-1">
              <div className="text-sm text-gray-500">Card Number</div>
              <div className="font-semibold">**** **** **** 4242</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="text-sm text-gray-500">Expiry Date</div>
                <div className="font-semibold">12/24</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="text-sm text-gray-500">CVV</div>
                <div className="font-semibold">***</div>
              </div>
            </div>
          </div>
        </div>
        <button className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition">
          Update Payment Method
        </button>
      </motion.div>
    </motion.div>
  );
} 