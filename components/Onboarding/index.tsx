'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const slides = [
  // {
  //   id: 1,
  //   title: "",
  //   subtitle: "",
  //   image: "/onboarding/welcome.png"
  // },
  {
    id: 1,
    title: "Welcome to AICURATE",
    subtitle: "Start your AI Tool Journey — I will guide you.",
    image: "/onboarding/aicurate_agent.png"
  },
  {
    id: 2,
    title: "Launch Your AI Journey in minutes",
    subtitle: "From overwhelmed to empowered",
    image: "/onboarding/launch.jpg",
    checklist: [
      "Too many AI tools? We'll match you with the best one,based on your goals",
      "Earn rewards for testing and giving feedback",
      "Join top AI explorers and shape AI's future"
    ]
  },
  {
    id: 3,
    title: "Meet Your AI Guide",
    subtitle: "Got a goal? We've got the right AI for You",
    image: "/onboarding/guide.png",
    checklist: [
      "Share what you want to do — we'll find the best AI for You! Simple!",
      "No fluff. No hype. No DIY. Just Proof",
      "If you have a task — we have an AI for you"
    ]
  },
  {
    id: 4,
    title: "🎉 Test, Vote, Earn & Level Up! 🎉",
    subtitle: "Earn rewards by completing AI challenges",
    image: "/onboarding/hunt.png",
    checklist: [
      "Complete fun tasks and fill your vault with tokens & credits",
      "Use your credits to unlock exclusive hunts and special features",
      "Join the Proof Revolution"
    ]
  }

];

export function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      router.push('/landing');
    } else {
      setCurrentSlide(prev => prev + 1);
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  const slide = slides[currentSlide];

  // Use SVGs for icons
  const iconSrcs = [
    '/onboarding/aicurate_agent.png',
    '/onboarding/launch.png',
    '/onboarding/guide.png',
    '/onboarding/hunt.png',
  ];
  const iconAlts = [
    'AICURATE Agent Icon',
    'Launch Icon',
    'Guide Icon',
    'Hunt Icon',
  ];
  const iconClassNames = [
    'rocket-icon-container',
    'brain-icon-container',
    'hunt-icon-container',
    'crown-icon-container',
  ];
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f7f8fa] pt-safe pb-safe">
      <div className="screen-1-container flex flex-col" style={{position: 'relative'}}>
        <div className="screen-1-content flex flex-col items-center justify-between">
          {/* Carousel dots at the top */}
          <div className="w-full flex flex-col items-center mb-8">
            <div className="flex flex-row items-center justify-center gap-2">
              {[...Array(slides.length)].map((_, idx) => (
                <span
                  key={idx}
                  className={
                    "carousel-dot" + (idx === currentSlide ? " active" : "")
                  }
                />
              ))}
            </div>
          </div>
          {/* Content area with consistent height */}
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            {currentSlide === 4 ? (
              <>
                <div className="welcome-headline" style={{ marginBottom: 0 }}>
                  <span className="welcome-to">Welcome to</span><br />
                  <span className="aicurate-logo">AICURATE</span>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="welcome-mascot"
                  style={{ margin: '18px 0 18px 0' }}
                >
                  <Image 
                    src="/onboarding/aicurate_agent.png" 
                    alt="AICURATE Agent Icon"
                    width={120}
                    height={120}
                    className="w-full h-auto"
                  />
                </motion.div>
                <div className="welcome-subtitle">
                  <b>Start your AI Tool Journey — I will guide you.</b>
                </div>
              </>
            ) : (
              <>
                <h1 className="journey-headline" style={{ marginBottom: 18 }}>{slide.title}</h1>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="rocket-icon-container"
                  style={{ marginBottom: 18 }}
                >
                  <Image 
                    src={slide.image} 
                    alt={iconAlts[currentSlide]}
                    width={140}
                    height={140}
                    className="w-full h-auto"
                  />
                  {currentSlide === 3 && (
                    <>
                      <span className="coin-effect coin-1" />
                      <span className="coin-effect coin-2" />
                      <span className="coin-effect coin-3" />
                    </>
                  )}
                  {currentSlide === 4 && (
                    <>
                      <span className="trophy-effect trophy-1" />
                      <span className="trophy-effect trophy-2" />
                      <span className="coin-effect coin-1" />
                      <span className="coin-effect coin-2" />
                    </>
                  )}
                </motion.div>
                <div className="journey-subtitle" style={{ fontWeight: 'bold', marginBottom: slide.checklist ? 12 : 0 }}><b>{slide.subtitle}</b></div>
                {slide.checklist && (
                  <ul className="bullet-list">
                    {slide.checklist.map((point, idx) => (
                      <li key={idx} className="bullet-item">{point}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
          {/* Bottom section with button */}
          <div className="w-full flex flex-col items-center">
            <button
              onClick={handleNext}
              className={currentSlide === 4 ? "welcome-cta-btn" : "plain-cta-btn"}
            >
              {currentSlide === 0 ? 'Let\'s go →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .screen-1-container {
          width: 100%;
          max-width: 400px;
          background: #f8fafc;
          border-radius: 30px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .screen-1-content {
          min-height: 600px;
          padding: 40px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .journey-headline {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          text-align: center;
          margin: 0 0 12px 0;
          line-height: 1.2;
        }
        .journey-subtitle {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          text-align: center;
          margin: 0 0 30px 0;
        }
        .bullet-list {
          list-style: none;
          padding: 0;
          margin: 0 0 40px 0;
        }
        .bullet-item {
          color: #4b5563;
          font-size: 15px;
          line-height: 1.5;
          margin: 15px 0;
          padding-left: 25px;
          position: relative;
        }
        .bullet-item::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
          font-size: 16px;
        }
        .rocket-icon-container {
          width: 140px;
          height: 140px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
          position: relative;
          animation: float 3s ease-in-out infinite;
        }
        .coin-effect {
          position: absolute;
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(251,191,36,0.3);
          opacity: 0.8;
        }
        .coin-1 {
          top: -20px;
          right: 10px;
          animation: coinFloat 3s ease-in-out infinite;
        }
        .coin-2 {
          bottom: -15px;
          left: 15px;
          animation: coinFloat 3s ease-in-out infinite;
          animation-delay: 1s;
        }
        .coin-3 {
          top: 15px;
          right: -20px;
          animation: coinFloat 3s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        @keyframes coinFloat {
          0%,100%{transform:translateY(0px) scale(1);opacity:0.8;}
          50%{transform:translateY(-8px) scale(1.1);opacity:1;}
        }
        .trophy-effect {
          position: absolute;
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(251,191,36,0.3);
          opacity: 0.8;
        }
        .trophy-1 {
          top: -25px;
          right: 15px;
          animation: trophyFloat 3s ease-in-out infinite;
        }
        .trophy-2 {
          bottom: -20px;
          left: 20px;
          animation: trophyFloat 3s ease-in-out infinite;
          animation-delay: 1s;
        }
        @keyframes trophyFloat {
          0%,100%{transform:translateY(0px) scale(1) rotate(0deg);opacity:0.8;}
          50%{transform:translateY(-8px) scale(1.1) rotate(10deg);opacity:1;}
        }
        .carousel-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #d1d5db;
          display: inline-block;
          transition: background 0.2s;
        }
        .carousel-dot.active {
          background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);
        }
        .welcome-headline {
          font-size: 1.7rem;
          font-weight: 500;
          color: #222;
          text-align: center;
          margin-bottom: 0;
          line-height: 1.2;
        }
        .welcome-to {
          font-size: 1.3rem;
          font-weight: 500;
          color: #444;
          letter-spacing: 0.01em;
        }
        .aicurate-logo {
          font-size: 2.1rem;
          font-weight: 800;
          color: #222;
          letter-spacing: 0.01em;
          font-family: inherit;
          display: inline-block;
        }
        .welcome-mascot {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 18px 0 18px 0;
        }
        .welcome-subtitle {
          font-size: 1.1rem;
          font-weight: 700;
          color: #222;
          text-align: center;
          margin-bottom: 0;
          margin-top: 0;
          line-height: 1.3;
        }
        @media (max-width: 480px) {
          .screen-1-container {
            max-width: 350px;
            width: 100%;
            border-radius: 22px;
          }
          .screen-1-content {
            min-height: 500px;
            padding: 32px 20px;
          }
          .rocket-icon-container {
            width: 100px;
            height: 100px;
          }
          .journey-headline {
            font-size: 22px;
          }
        }
        /* Safe area utility classes */
        :global(.pt-safe) {
          padding-top: env(safe-area-inset-top, 24px);
        }
        :global(.pb-safe) {
          padding-bottom: env(safe-area-inset-bottom, 24px);
        }
        @media (max-width: 600px) {
          :global(.pt-safe) {
            padding-top: 48px !important;
          }
        }
        .plain-cta-btn {
          width: 100%;
          max-width: 350px;
          height: 56px;
          background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);
          color: #fff;
          font-size: 1.5rem;
          font-weight: 600;
          border: none;
          border-radius: 18px;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.10);
          transition: background 0.2s, box-shadow 0.2s;
          cursor: pointer;
          text-align: center;
          letter-spacing: 0.01em;
          margin-top: 0;
        }
        .plain-cta-btn:active {
          background: linear-gradient(90deg, #7c3aed 0%, #8b5cf6 100%);
          box-shadow: 0 1px 4px rgba(139, 92, 246, 0.08);
        }
        .welcome-cta-btn {
          width: 100%;
          max-width: 350px;
          height: 56px;
          background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);
          color: #fff;
          font-size: 1.5rem;
          font-weight: 600;
          border: none;
          border-radius: 18px;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.10);
          transition: background 0.2s, box-shadow 0.2s;
          cursor: pointer;
          text-align: center;
          letter-spacing: 0.01em;
          margin-top: 0;
        }
        .welcome-cta-btn:active {
          background: linear-gradient(90deg, #7c3aed 0%, #8b5cf6 100%);
          box-shadow: 0 1px 4px rgba(139, 92, 246, 0.08);
        }
      `}</style>
    </div>
  );
} 