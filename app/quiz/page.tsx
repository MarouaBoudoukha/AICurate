"use client";

import { QuizSection } from "@/components/QuizSection";
import { useUnifiedSession } from "@/hooks/useUnifiedSession";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4F46E5'
};

export default function QuizPage() {
  const unifiedSession = useUnifiedSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    if (unifiedSession.status === "loading") {
      return;
    }
    
    if (!unifiedSession.user) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [unifiedSession.status, unifiedSession.user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
        <QuizSection />
    </div>
  );
} 