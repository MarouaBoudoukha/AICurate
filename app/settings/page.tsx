"use client";
import { motion } from 'framer-motion';
import { User, CreditCard, Vault, Bell, HelpCircle, Shield, LogOut, ChevronRight } from 'lucide-react';

const settingsOptions = [
  {
    label: 'Profile & Settings',
    icon: User,
    color: 'text-indigo-600',
  },
  {
    label: 'Subscription Plan',
    icon: CreditCard,
    color: 'text-purple-600',
  },
  {
    label: 'Vault',
    icon: Vault,
    color: 'text-yellow-500',
  },
  {
    label: 'Notifications',
    icon: Bell,
    color: 'text-pink-500',
  },
  {
    label: 'Support / Help',
    icon: HelpCircle,
    color: 'text-blue-500',
  },
  {
    label: 'Legal & Privacy',
    icon: Shield,
    color: 'text-green-600',
  },
  {
    label: 'Log Out',
    icon: LogOut,
    color: 'text-red-500',
  },
];

export default function SettingsPage() {
  return (
    <motion.div
      className="p-4 max-w-md mx-auto"
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
        className="space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } }
        }}
      >
        {settingsOptions.map((option, i) => (
          <motion.button
            key={option.label}
            className="w-full flex items-center justify-between bg-white rounded-xl shadow-lg px-4 py-4 hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-300 transition group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
          >
            <div className="flex items-center gap-4">
              <option.icon className={`w-6 h-6 ${option.color} group-hover:scale-110 transition-transform`} />
              <span className="font-medium text-gray-900 text-base">{option.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition" />
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
} 