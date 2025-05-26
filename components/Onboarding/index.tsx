'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const slides = [
  {
    id: 1,
    title: "Welcome to AICURATE",
    subtitle: "Your AI Tool Hunt begins here...",
    image: "/onboarding/welcome.png"
  },
  {
    id: 2,
    title: "Launch Your AI Journey in minutes",
    subtitle: "There is an AI Tool for YOU",
    image: "/onboarding/launch.png",
    checklist: [
      "Find the AI tool you need",
      "Earn rewards for testing and giving feedback to the community",
      "Join the top AI explorers and shape the future of AI"
    ]
  },
  {
    id: 3,
    title: "Meet Your AI Guide",
    subtitle: "Tell me what you need to do — I'll find the AI you need",
    image: "/onboarding/guide.png",
    checklist: [
      "No fluff. No hype. No DIY. Just Proof",
      "You have a task — I have an AI for you"
    ]
  },
  {
    id: 4,
    title: "Hunt AI Tools and Get Paid in Proof",
    subtitle: "Discover. Test. Vote. Share and EARN as you go",
    image: "/onboarding/hunt.png",
    checklist: [
      "Your feedback turns into rewards and reputation",
      "Join the Proof Revolution"
    ]
  },
  {
    id: 5,
    title: "Become an Expert Curator",
    subtitle: "Review. Educate. Share your insights with the world",
    image: "/onboarding/curator.png",
    checklist: [
      "Prove yourself as a trusted voice in AI tools ecosystem",
      "Claim greater rewards and influence"
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

  // Only render the first screen for now
  if (currentSlide === 0) {
  return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f7f8fa]">
        <div className="screen-frame flex items-center justify-center">
          <div className="screen-1-container flex flex-col" style={{position: 'relative'}}>
            <div className="screen-1-content flex flex-col items-center justify-between">
              {/* Logo above robot icon - only one, larger */}
              <div className="flex flex-col items-center mb-2">
                <img src="/logo.png" alt="AICURATE Logo" className="logo-img mb-4" style={{width: 80, height: 80}} />
              </div>
              {/* Floating Robot Icon */}
          <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="robot-icon-container"
              >
                <img src="/onboarding/welcome.png" alt="Robot Icon" className="robot-emoji" style={{width: 60, height: 60}} />
              </motion.div>
              {/* Headline and subtext */}
              <div className="flex flex-col items-center w-full">
                <h1 className="welcome-headline title-format">{slide.title}</h1>
                <div className="welcome-subtitle">{slide.subtitle}</div>
              </div>
              {/* CTA Button at bottom */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="lets-go-button flex items-center justify-center gap-2"
              >
                Let&apos;s Go <ChevronRight className="w-5 h-5 ml-1" />
              </motion.button>
            </div>
          </div>
          <style jsx>{`
            .logo-img {
              width: 60px;
              height: 60px;
              object-fit: contain;
              margin-bottom: 8px;
            }
            .title-format {
              font-size: 32px;
              font-weight: 700;
              color: #1f2937;
              text-align: center;
              margin: 0 0 15px 0;
              line-height: 1.1;
              letter-spacing: -0.5px;
            }
            .screen-frame {
              background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
              padding: 3px;
              border-radius: 33px;
              box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
            }
            .screen-1-container {
              width: 400px;
              height: 700px;
              background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
              border-radius: 30px;
              border: 1px solid #c7d2fe;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
            }
            .screen-1-content {
              background: #f8fafc;
              height: 100%;
              padding: 60px 30px 40px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
            }
            /* Rocket Icon */
            .rocket-icon-container {
              width: 120px; height: 120px;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              border-radius: 50%; display: flex; align-items: center; justify-content: center;
              box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
              margin: 0 auto 40px; position: relative; animation: float 3s ease-in-out infinite;
            }
            .rocket-emoji { font-size: 50px; transform: rotate(-15deg); }
            .coin-effect { position: absolute; width: 12px; height: 12px; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 50%; box-shadow: 0 2px 4px rgba(251,191,36,0.3); opacity: 0.8; }
            .coin-1 { top: -20px; right: 10px; animation: coinFloat 3s ease-in-out infinite; }
            .coin-2 { bottom: -15px; left: 15px; animation: coinFloat 3s ease-in-out infinite; animation-delay: 1s; }
            @keyframes coinFloat { 0%,100%{transform:translateY(0px) scale(1);opacity:0.8;} 50%{transform:translateY(-8px) scale(1.1);opacity:1;} }
            /* Brain Icon */
            .brain-icon-container { width: 120px; height: 120px; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(6,182,212,0.25); margin: 0 auto 40px; animation: float 3s ease-in-out infinite; }
            .brain-emoji { font-size: 55px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
            /* Hunt Icon */
            .hunt-icon-container { width: 120px; height: 120px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(245,158,11,0.25); margin: 0 auto 40px; position: relative; animation: float 3s ease-in-out infinite; }
            .magnifying-glass-emoji { font-size: 50px; transform: rotate(-10deg); }
            .hunt-sparkle { position: absolute; width: 8px; height: 8px; background: #fbbf24; border-radius: 50%; opacity: 0.7; }
            .sparkle-1 { top: 15px; right: 20px; animation: sparkle 2s ease-in-out infinite; }
            .sparkle-2 { bottom: 20px; left: 25px; animation: sparkle 2s ease-in-out infinite; animation-delay: 1s; }
            @keyframes sparkle { 0%,100%{opacity:0.4;transform:scale(1);} 50%{opacity:1;transform:scale(1.3);} }
            /* Crown Icon */
            .crown-icon-container { width: 120px; height: 120px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(139,92,246,0.25); margin: 0 auto 40px; position: relative; animation: float 3s ease-in-out infinite; }
            .crown-emoji { font-size: 55px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
            .crown-sparkle { position: absolute; width: 8px; height: 8px; background: #fbbf24; border-radius: 50%; opacity: 0.7; }
            .crown-sparkle-1 { top: 10px; left: 30px; animation: crownSparkle 1.8s ease-in-out infinite; }
            .crown-sparkle-2 { top: 30px; right: 20px; animation: crownSparkle 1.8s ease-in-out infinite; animation-delay: 0.6s; }
            .crown-sparkle-3 { bottom: 20px; left: 25px; animation: crownSparkle 1.8s ease-in-out infinite; animation-delay: 1.2s; }
            .crown-sparkle-4 { bottom: 10px; right: 30px; animation: crownSparkle 1.8s ease-in-out infinite; animation-delay: 0.3s; }
            @keyframes crownSparkle { 0%,100%{opacity:0.5;transform:scale(1);} 50%{opacity:1;transform:scale(1.3);} }
            /* Typography and Bullets */
            .journey-headline { font-size: 28px; font-weight: 700; color: #1f2937; text-align: center; margin: 0 0 12px 0; line-height: 1.2; }
            .journey-subtitle { font-size: 18px; font-weight: 600; color: #374151; text-align: center; margin: 0 0 30px 0; }
            .bullet-list { list-style: none; padding: 0; margin: 0 0 40px 0; }
            .bullet-item { color: #4b5563; font-size: 15px; line-height: 1.5; margin: 15px 0; padding-left: 25px; position: relative; }
            .bullet-item::before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 16px; }
            .guide-headline { font-size: 28px; font-weight: 700; color: #1f2937; text-align: center; margin: 0 0 20px 0; line-height: 1.2; }
            .guide-description { font-size: 16px; font-weight: 400; color: #6b7280; text-align: center; margin: 0 0 35px 0; line-height: 1.4; }
            .guide-list { list-style: none; padding: 0; margin: 0 0 30px 0; }
            .guide-item { color: #4b5563; font-size: 15px; line-height: 1.5; margin: 12px 0; padding-left: 25px; position: relative; }
            .guide-item::before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 16px; }
            .hunt-headline { font-size: 26px; font-weight: 700; color: #1f2937; text-align: center; margin: 0 0 15px 0; line-height: 1.2; }
            .hunt-subtitle { font-size: 16px; font-weight: 400; color: #6b7280; text-align: center; margin: 0 0 30px 0; line-height: 1.4; }
            .hunt-list { list-style: none; padding: 0; margin: 0 0 30px 0; }
            .hunt-item { color: #4b5563; font-size: 15px; line-height: 1.5; margin: 12px 0; padding-left: 25px; position: relative; }
            .hunt-item::before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 16px; }
            .curator-headline { font-size: 28px; font-weight: 700; color: #1f2937; text-align: center; margin: 0 0 20px 0; line-height: 1.2; }
            .curator-subtitle { font-size: 16px; font-weight: 400; color: #6b7280; text-align: center; margin: 0 0 35px 0; line-height: 1.4; }
            .curator-list { list-style: none; padding: 0; margin: 0 0 30px 0; }
            .curator-item { color: #4b5563; font-size: 15px; line-height: 1.5; margin: 12px 0; padding-left: 25px; position: relative; }
            .curator-item::before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 16px; }
            .next-button { width: 200px; height: 50px; background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); border: none; border-radius: 25px; color: #fff; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(79,70,229,0.3); transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
            .next-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(79,70,229,0.4); }
            @media (max-width: 480px) {
              .screen-1-container { max-width: 350px; width: 100%; height: 520px; border-radius: 22px; }
              .screen-frame { border-radius: 25px; }
              .rocket-icon-container, .brain-icon-container, .hunt-icon-container, .crown-icon-container { width: 100px; height: 100px; }
              .journey-headline, .guide-headline, .curator-headline { font-size: 22px; }
              .hunt-headline { font-size: 20px; }
              .next-button { width: 100%; max-width: 180px; }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Screens 2-5
  // Use SVGs for icons
  const iconSrcs = [
    '/onboarding/rocket.svg',
    '/onboarding/curator.svg',
    '/onboarding/hunt.svg',
    '/onboarding/crown.svg',
  ];
  const iconAlts = [
    'Rocket Icon',
    'Curator Icon',
    'Hunt Icon',
    'Crown Icon',
  ];
  const iconClassNames = [
    'rocket-icon-container',
    'brain-icon-container',
    'hunt-icon-container',
    'crown-icon-container',
  ];
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f7f8fa]">
      <div className="screen-frame flex items-center justify-center">
        <div className="screen-1-container flex flex-col" style={{position: 'relative'}}>
          <div className="screen-1-content flex flex-col items-center justify-between">
            {/* Animated SVG Icon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className={iconClassNames[currentSlide - 1]}
            >
              <img src={iconSrcs[currentSlide - 1]} alt={iconAlts[currentSlide - 1]} style={{width: 100, height: 100}} />
              {/* Coin/sparkle effects for rocket/hunt/crown */}
              {currentSlide === 1 && (
                <>
                  <span className="coin-effect coin-1" />
                  <span className="coin-effect coin-2" />
                </>
              )}
              {currentSlide === 3 && (
                <>
                  <span className="hunt-sparkle sparkle-1" />
                  <span className="hunt-sparkle sparkle-2" />
                </>
              )}
              {currentSlide === 4 && (
                <>
                  <span className="crown-sparkle crown-sparkle-1" />
                  <span className="crown-sparkle crown-sparkle-2" />
                  <span className="crown-sparkle crown-sparkle-3" />
                  <span className="crown-sparkle crown-sparkle-4" />
                </>
              )}
            </motion.div>
            {/* Headline and subtext */}
            <div className="flex flex-col items-center w-full">
              <h1 className={
                currentSlide === 1 ? "journey-headline" :
                currentSlide === 2 ? "guide-headline" :
                currentSlide === 3 ? "hunt-headline" :
                currentSlide === 4 ? "curator-headline" : ""
              }>{slide.title}</h1>
              <div className={
                currentSlide === 1 ? "journey-subtitle" :
                currentSlide === 2 ? "guide-description" :
                currentSlide === 3 ? "hunt-subtitle" :
                currentSlide === 4 ? "curator-subtitle" : ""
              }>{slide.subtitle}</div>
              {/* Bullets/Checklist */}
              {slide.checklist && (
                <ul className={
                  currentSlide === 1 ? "bullet-list" :
                  currentSlide === 2 ? "guide-list" :
                  currentSlide === 3 ? "hunt-list" :
                  currentSlide === 4 ? "curator-list" : ""
                }>
                  {slide.checklist.map((point, idx) => (
                    <li key={idx} className={
                      currentSlide === 1 ? "bullet-item" :
                      currentSlide === 2 ? "guide-item" :
                      currentSlide === 3 ? "hunt-item" :
                      currentSlide === 4 ? "curator-item" : ""
                    }>{point}</li>
                  ))}
                </ul>
              )}
            </div>
            {/* Next button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="next-button flex items-center justify-center gap-2"
            >
              Next <ChevronRight className="w-5 h-5 ml-1" />
            </motion.button>
          </div>
        </div>
        <style jsx>{`
          .screen-frame {
            background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
            padding: 3px;
            border-radius: 33px;
            box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
          }
          .screen-1-container {
            width: 400px;
            height: 700px;
            background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
            border-radius: 30px;
            border: 1px solid #c7d2fe;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }
          .screen-1-content {
            background: #f8fafc;
            height: 100%;
            padding: 60px 30px 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
          }
          /* Rocket Icon */
          .rocket-icon-container {
            width: 120px; height: 120px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 50%; display: flex; align-items: center; justify-content: center;
            box-shadow: 0 8px 25px rgba(16, 185, 129, 0.25);
            margin: 0 auto 40px; position: relative; animation: float 3s ease-in-out infinite;
          }
          .rocket-emoji { font-size: 50px; transform: rotate(-15deg); }
          .coin-effect { position: absolute; width: 12px; height: 12px; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 50%; box-shadow: 0 2px 4px rgba(251,191,36,0.3); opacity: 0.8; }
          .coin-1 { top: -20px; right: 10px; animation: coinFloat 3s ease-in-out infinite; }
          .coin-2 { bottom: -15px; left: 15px; animation: coinFloat 3s ease-in-out infinite; animation-delay: 1s; }
          @keyframes coinFloat { 0%,100%{transform:translateY(0px) scale(1);opacity:0.8;} 50%{transform:translateY(-8px) scale(1.1);opacity:1;} }
          /* Brain Icon */
          .brain-icon-container { width: 120px; height: 120px; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(6,182,212,0.25); margin: 0 auto 40px; animation: float 3s ease-in-out infinite; }
          .brain-emoji { font-size: 55px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
          /* Hunt Icon */
          .hunt-icon-container { width: 120px; height: 120px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(245,158,11,0.25); margin: 0 auto 40px; position: relative; animation: float 3s ease-in-out infinite; }
          .magnifying-glass-emoji { font-size: 50px; transform: rotate(-10deg); }
          .hunt-sparkle { position: absolute; width: 8px; height: 8px; background: #fbbf24; border-radius: 50%; opacity: 0.7; }
          .sparkle-1 { top: 15px; right: 20px; animation: sparkle 2s ease-in-out infinite; }
          .sparkle-2 { bottom: 20px; left: 25px; animation: sparkle 2s ease-in-out infinite; animation-delay: 1s; }
          @keyframes sparkle { 0%,100%{opacity:0.4;transform:scale(1);} 50%{opacity:1;transform:scale(1.3);} }
          /* Crown Icon */
          .crown-icon-container { width: 120px; height: 120px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 25px rgba(139,92,246,0.25); margin: 0 auto 40px; position: relative; animation: float 3s ease-in-out infinite; }
          .crown-emoji { font-size: 55px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
          .crown-sparkle { position: absolute; width: 8px; height: 8px; background: #fbbf24; border-radius: 50%; opacity: 0.7; }
          .crown-sparkle-1 { top: 10px; left: 30px; animation: crownSparkle 1.8s ease-in-out infinite; }
          .crown-sparkle-2 { top: 30px; right: 20px; animation: crownSparkle 1.8s ease-in-out infinite; animation-delay: 0.6s; }
          .crown-sparkle-3 { bottom: 20px; left: 25px; animation: crownSparkle 1.8s ease-in-out infinite; animation-delay: 1.2s; }
          .crown-sparkle-4 { bottom: 10px; right: 30px; animation: crownSparkle 1.8s ease-in-out infinite; animation-delay: 0.3s; }
          @keyframes crownSparkle { 0%,100%{opacity:0.5;transform:scale(1);} 50%{opacity:1;transform:scale(1.3);} }
          /* Typography and Bullets */
          .journey-headline { font-size: 28px; font-weight: 700; color: #1f2937; text-align: center; margin: 0 0 12px 0; line-height: 1.2; }
          .journey-subtitle { font-size: 18px; font-weight: 600; color: #374151; text-align: center; margin: 0 0 30px 0; }
          .bullet-list { list-style: none; padding: 0; margin: 0 0 40px 0; }
          .bullet-item { color: #4b5563; font-size: 15px; line-height: 1.5; margin: 15px 0; padding-left: 25px; position: relative; }
          .bullet-item::before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 16px; }
          .guide-headline { font-size: 28px; font-weight: 700; color: #1f2937; text-align: center; margin: 0 0 20px 0; line-height: 1.2; }
          .guide-description { font-size: 16px; font-weight: 400; color: #6b7280; text-align: center; margin: 0 0 35px 0; line-height: 1.4; }
          .guide-list { list-style: none; padding: 0; margin: 0 0 30px 0; }
          .guide-item { color: #4b5563; font-size: 15px; line-height: 1.5; margin: 12px 0; padding-left: 25px; position: relative; }
          .guide-item::before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 16px; }
          .hunt-headline { font-size: 26px; font-weight: 700; color: #1f2937; text-align: center; margin: 0 0 15px 0; line-height: 1.2; }
          .hunt-subtitle { font-size: 16px; font-weight: 400; color: #6b7280; text-align: center; margin: 0 0 30px 0; line-height: 1.4; }
          .hunt-list { list-style: none; padding: 0; margin: 0 0 30px 0; }
          .hunt-item { color: #4b5563; font-size: 15px; line-height: 1.5; margin: 12px 0; padding-left: 25px; position: relative; }
          .hunt-item::before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 16px; }
          .curator-headline { font-size: 28px; font-weight: 700; color: #1f2937; text-align: center; margin: 0 0 20px 0; line-height: 1.2; }
          .curator-subtitle { font-size: 16px; font-weight: 400; color: #6b7280; text-align: center; margin: 0 0 35px 0; line-height: 1.4; }
          .curator-list { list-style: none; padding: 0; margin: 0 0 30px 0; }
          .curator-item { color: #4b5563; font-size: 15px; line-height: 1.5; margin: 12px 0; padding-left: 25px; position: relative; }
          .curator-item::before { content: '✓'; position: absolute; left: 0; color: #10b981; font-weight: bold; font-size: 16px; }
          .next-button { width: 200px; height: 50px; background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); border: none; border-radius: 25px; color: #fff; font-size: 16px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(79,70,229,0.3); transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
          .next-button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(79,70,229,0.4); }
          @media (max-width: 480px) {
            .screen-1-container { max-width: 350px; width: 100%; height: 520px; border-radius: 22px; }
            .screen-frame { border-radius: 25px; }
            .rocket-icon-container, .brain-icon-container, .hunt-icon-container, .crown-icon-container { width: 100px; height: 100px; }
            .journey-headline, .guide-headline, .curator-headline { font-size: 22px; }
            .hunt-headline { font-size: 20px; }
            .next-button { width: 100%; max-width: 180px; }
          }
        `}</style>
      </div>
    </div>
  );
} 