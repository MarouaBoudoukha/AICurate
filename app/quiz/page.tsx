"use client";

import { QuizSection } from "@/components/QuizSection";
import { useUnifiedSession } from "@/hooks/useUnifiedSession";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuizPage() {
  const unifiedSession = useUnifiedSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Allow both authenticated users and guests to access the quiz
    if (unifiedSession.status === "loading") {
      return;
    }
    
    // Always allow access to quiz (both authenticated users and guests)
    setIsLoading(false);
  }, [unifiedSession.status, router]);

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