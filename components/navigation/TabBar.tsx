'use client';

import { usePathname, useRouter } from 'next/navigation';
import { 
  User, 
  Star, 
  Gift, 
  LayoutDashboard, 
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const tabs = [
  {
    label: 'AI Guide',
    icon: Bot,
    path: '/directory',
  },
  {
    label: 'Reviews',
    icon: Star,
    path: '/reviews',
  },
  {
    label: 'Rewards',
    icon: Gift,
    path: '/rewards',
  },
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    label: 'Profile',
    icon: User,
    path: '/quiz',
  },
];

interface TabBarProps {
  onNavigate?: (path: string) => void;
  className?: string;
}

export function TabBar({ onNavigate, className }: TabBarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show tab bar on landing page or root
  if (pathname === '/' || pathname === '/landing') return null;

  const handleClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      router.push(path);
    }
  };

  return (
    <div className={cn(
      "bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)] shadow-lg",
      className
    )}>
      <nav className="flex justify-around items-center h-[4.5rem] max-w-screen-sm mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.path}
              onClick={() => handleClick(tab.path)}
              className="relative w-full h-full"
            >
              <motion.div
                className={cn(
                  'flex flex-col items-center justify-center w-full h-full',
                  isActive ? 'text-blue-600' : 'text-gray-400'
                )}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-6 h-6 mb-0.5" strokeWidth={2} />
                <span className="text-[10px] font-medium tracking-tight opacity-85">
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-2 w-1 h-1 rounded-full bg-blue-600"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </button>
          );
        })}
      </nav>
    </div>
  );
} 