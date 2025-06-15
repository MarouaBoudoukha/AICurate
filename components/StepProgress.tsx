import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressProps {
  currentStep: string;
}

const steps = [
  { id: 'target', label: 'Target', icon: '🎯' },
  { id: 'assess', label: 'Assess', icon: '🔍' },
  { id: 'select', label: 'Select', icon: '⭐' },
];

export default function StepProgress({ currentStep }: StepProgressProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${isCompleted ? 'bg-green-500' : isCurrent ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'}
                transition-colors duration-200
              `}>
                {isCompleted ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-sm">{step.icon}</span>
                )}
              </div>
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 