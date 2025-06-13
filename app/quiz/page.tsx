"use client";

import { QuizSection } from "@/components/QuizSection";
import { useUnifiedSession } from "@/hooks/useUnifiedSession";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const unifiedSession = useUnifiedSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);

  useEffect(() => {
    const checkQuizStatus = async () => {
      try {
        console.log('=== Quiz Page Check Debug ===');
        console.log('Unified session status:', unifiedSession.status);
        
        // Wait for unified session to load
        if (unifiedSession.status === "loading") {
          console.log('Still loading unified session...');
          return;
        }
        
        // Get user ID from unified session first
        let userId = unifiedSession.user?.id;
        
        // Fallback to manual localStorage check
        if (!userId) {
          const storedUserId = localStorage.getItem('worldcoin_user_id');
          const worldIdUser = localStorage.getItem('worldIdUser');
          
          console.log('No unified session user, checking localStorage:');
          console.log('- worldcoin_user_id:', storedUserId);
          console.log('- worldIdUser:', worldIdUser);
          
          if (storedUserId) {
            userId = storedUserId;
          } else if (worldIdUser) {
            try {
              const userData = JSON.parse(worldIdUser);
              userId = userData.id;
            } catch (e) {
              console.error('Error parsing worldIdUser:', e);
            }
          }
        }

        console.log('Final userId for quiz check:', userId);

        // If no user ID found, redirect to landing
        if (!userId) {
          console.log('No user ID found, redirecting to landing');
          router.push('/landing');
          return;
        }

        // Check user's onboarding status
        console.log('Fetching user data for:', userId);
        const response = await fetch(`/api/user/${userId}`);
        console.log('User API response status:', response.status);
        
        if (response.ok) {
          const userData = await response.json();
          console.log('User data received:', userData);
          
          // Check if user has completed onboarding
          if (userData.user?.onboardingCompleted === true) {
            console.log('✅ User has completed onboarding - showing completion message');
            setHasCompletedQuiz(true);
            // Auto-redirect after 3 seconds
            setTimeout(() => {
              console.log('Auto-redirecting to landing page');
              router.push('/landing');
            }, 3000);
            return;
          } else {
            console.log('❌ User has NOT completed onboarding - showing quiz');
            setHasCompletedQuiz(false);
          }
        } else if (response.status === 404) {
          console.log('User not found in database, redirecting to landing');
          router.push('/landing');
          return;
        } else {
          console.error('Error fetching user data:', response.status);
          // On API error, redirect to landing to re-authenticate
          router.push('/landing');
          return;
        }
      } catch (error) {
        console.error('Error in checkQuizStatus:', error);
        // On any error, redirect to landing
        router.push('/landing');
      } finally {
        setIsLoading(false);
      }
    };

    checkQuizStatus();
  }, [unifiedSession, router]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (hasCompletedQuiz) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Quiz Already Completed!
          </h1>
          <p className="text-gray-600 mb-4">
            You&apos;ve already completed your onboarding quiz. This is a one-time quiz.
          </p>
          <p className="text-gray-500 mb-6">
            Redirecting you back to the landing page...
          </p>
          <div className="animate-pulse text-blue-500 mb-4">
            Taking you back in 3 seconds...
          </div>
          <button
            onClick={() => router.push('/landing')}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all"
          >
            Go to Landing Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <main className="flex-1 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Customize Your AI Journey</h1>
        <QuizSection />
      </main>
    </div>
  );
} 