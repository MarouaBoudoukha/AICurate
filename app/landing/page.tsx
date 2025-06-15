'use client';

import { LandingPage } from "@/components/LandingPage";

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4F46E5'
};

export default function Landing() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-4 bg-gray-50 landing-page">
      <LandingPage />
      <style jsx global>{`
        .landing-page + div .fixed.bottom-0 {
          display: none;
        }
      `}</style>
    </main>
  );
} 