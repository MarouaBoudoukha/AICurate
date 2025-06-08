"use client";
import { motion } from 'framer-motion';
import { User, CreditCard, Vault, Bell, HelpCircle, Shield, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';

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
    <div className="p-4 space-y-4">
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-bold mb-4">Settings</h2>
        <div className="flex flex-col gap-2">
          <Link href="/settings/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
            <User className="w-5 h-5 text-indigo-500" />
            <span className="flex-1">Profile Info</span>
          </Link>
          <Link href="/settings/subscription" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
            <CreditCard className="w-5 h-5 text-purple-500" />
            <span className="flex-1">Subscription Plan</span>
          </Link>
          <Link href="/settings/wallet" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
            <Vault className="w-5 h-5 text-yellow-500" />
            <span className="flex-1">Wallet</span>
          </Link>
          <Link href="/settings/notifications" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
            <Bell className="w-5 h-5 text-pink-500" />
            <span className="flex-1">Notifications</span>
          </Link>
          <Link href="/settings/support" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
            <HelpCircle className="w-5 h-5 text-blue-500" />
            <span className="flex-1">Support</span>
          </Link>
          <Link href="/settings/legal" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="flex-1">Legal / Privacy</span>
          </Link>
          <Link href="/settings/logout" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="flex-1">Log Out</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 