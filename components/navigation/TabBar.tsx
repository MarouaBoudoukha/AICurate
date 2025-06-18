'use client';

import { usePathname, useRouter } from 'next/navigation';
import { 
  User, 
  Gift, 
  Bot,
  Settings as SettingsIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  {
    label: 'AI Journey',
    icon: User,
    path: '/dashboard',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    label: 'AI Challenge',
    icon: Gift,
    path: '/challenge',
    color: 'from-pink-500 to-yellow-400',
  },
  {
    label: 'AI Guide',
    icon: Bot,
    path: '/guide',
    color: 'from-blue-500 to-indigo-400',
  },
  {
    label: 'Settings',
    icon: SettingsIcon,
    path: '/settings',
    color: 'from-gray-400 to-gray-600',
  },
];

interface TabBarProps {
  onNavigate?: (path: string) => void;
  className?: string;
}

export function TabBar({ onNavigate, className }: TabBarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show tab bar on landing page, root, or quiz steps (but show on /quiz/mint)
  if (
    pathname === '/' ||
    pathname === '/landing' ||
    pathname === '/quiz'
  ) return null;

  const handleClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      router.push(path);
    }
  };

  return (
    <motion.div
      className={cn(
        'bg-white/90 border-t border-gray-100 pb-[env(safe-area-inset-bottom)] shadow-2xl rounded-t-2xl',
        'backdrop-blur-md',
        className
      )}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <nav className="flex justify-around items-center h-[4.5rem] max-w-screen-sm mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => handleClick(tab.path)}
              className={cn(
                'relative w-full h-full flex flex-col items-center justify-center transition-all',
                isActive ? '' : 'hover:bg-gray-50',
                'rounded-xl py-1'
              )}
              style={{ zIndex: isActive ? 2 : 1 }}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className={cn(
                      'absolute inset-0 rounded-xl -z-10',
                      'bg-gradient-to-r',
                      tab.color,
                      'shadow-lg'
                    )}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <motion.div
                className={cn(
                  'flex flex-col items-center justify-center w-full h-full',
                  isActive ? 'text-white' : 'text-gray-400'
                )}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-6 h-6 mb-0.5" strokeWidth={2} />
                <span className="text-[10px] font-medium tracking-tight opacity-85">
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabDot"
                    className="absolute -top-2 w-1 h-1 rounded-full bg-white"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </button>
          );
        })}
      </nav>
    </motion.div>
  );
} 