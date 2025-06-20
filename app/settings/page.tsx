"use client";
import { motion } from 'framer-motion';
import { User, CreditCard, Wallet, Bell, HelpCircle, Shield, LogOut, ChevronRight, Edit } from 'lucide-react';
import Link from 'next/link';

const settingsOptions = [
  {
    label: 'Profile & Settings',
    icon: User,
    color: 'text-indigo-600',
    path: '/settings/profile'
  },
  {
    label: 'Subscription Plan',
    icon: CreditCard,
    color: 'text-purple-600',
    path: '/settings/subscription'
  },
  {
    label: 'Edit Quiz Responses',
    icon: Edit,
    color: 'text-orange-500',
    path: '/settings/quiz'
  },
  {
    label: 'Wallet',
    icon: Wallet,
    color: 'text-yellow-500',
    path: '/settings/wallet'
  },
  {
    label: 'Notifications',
    icon: Bell,
    color: 'text-pink-500',
    path: '/settings/notifications'
  },
  {
    label: 'Support / Help',
    icon: HelpCircle,
    color: 'text-blue-500',
    path: '/settings/support'
  },
  {
    label: 'Legal & Privacy',
    icon: Shield,
    color: 'text-green-600',
    path: '/settings/legal'
  },
  {
    label: 'Log Out',
    icon: LogOut,
    color: 'text-red-500',
    path: '/settings/logout'
  },
];

export default function SettingsPage() {
  return (
    <motion.div
      className="p-4 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.h1
        className="text-2xl font-bold mb-6 text-indigo-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        Settings
      </motion.h1>

      <motion.div
        className="bg-white rounded-xl shadow-lg p-4 space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {settingsOptions.map((option, index) => (
          <motion.div
            key={option.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.3 }}
          >
            <Link
              href={option.path}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 transition group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center ${option.color}`}>
                <option.icon className="w-5 h-5" />
              </div>
              <span className="flex-1 font-medium text-gray-700">{option.label}</span>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition" />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
} 