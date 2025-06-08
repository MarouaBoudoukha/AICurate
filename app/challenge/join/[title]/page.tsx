"use client";
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface JoinChallengePageProps {
  params: {
    title: string;
  };
}

export default function JoinChallengePage({ params }: JoinChallengePageProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const decodedTitle = decodeURIComponent(params.title);

  // Mock challenge data - in a real app, this would come from an API
  const challenge = {
    title: decodedTitle,
    images: [
      '/challenges/step1.png',
      '/challenges/step2.png',
      '/challenges/step3.png',
    ],
    steps: [
      {
        title: 'Follow us on X',
        description: 'Like and follow our X page to stay updated with the latest challenges and rewards.',
        link: 'https://x.com/aicurate',
      },
      {
        title: 'Join our community',
        description: 'Join our Telegram group to connect with other AI explorers and get support.',
        link: 'https://t.me/aicurate',
      },
      {
        title: 'Start your journey',
        description: 'Begin your challenge and track your progress in real-time.',
        link: null,
      },
    ],
  };

  const handleNext = () => {
    if (currentStep < challenge.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle challenge join completion
      router.push('/challenge');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push('/challenge/start');
    }
  };

  return (
    <motion.div
      className="p-4 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.button
        onClick={() => router.push('/challenge/start')}
        className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-400 transition flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <ArrowLeft className="w-5 h-5" /> Go Back
      </motion.button>

      <motion.h1
        className="text-2xl font-bold mb-2 text-indigo-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        Join Challenge: {challenge.title}
      </motion.h1>

      {/* Image Carousel */}
      <motion.div
        className="relative h-48 bg-gray-100 rounded-xl mb-6 overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
          style={{
            backgroundImage: `url(${challenge.images[currentStep]})`,
            transform: `translateX(-${currentStep * 100}%)`,
          }}
        />
      </motion.div>

      {/* How it works */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-3">How it works:</h2>
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h3 className="font-medium text-indigo-600 mb-2">{challenge.steps[currentStep].title}</h3>
          <p className="text-gray-600 mb-3">{challenge.steps[currentStep].description}</p>
          {challenge.steps[currentStep].link && (
            <a
              href={challenge.steps[currentStep].link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:text-indigo-600 font-medium inline-flex items-center gap-1"
            >
              Visit Link <ChevronRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        className="flex justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 transition flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          {currentStep === 0 ? 'Back' : 'Previous'}
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-300 transition flex items-center gap-2"
        >
          {currentStep === challenge.steps.length - 1 ? 'Join Challenge' : 'Next'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>
    </motion.div>
  );
} 