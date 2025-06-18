"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Edit2, Check, X } from 'lucide-react';
import { useUnifiedSession } from '@/hooks/useUnifiedSession';

interface QuizAnswer {
  questionId: string;
  answer: string;
  answeredAt: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: string;
  options?: string[];
  category: string;
}

export default function QuizEditPage() {
  const router = useRouter();
  const unifiedSession = useUnifiedSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, QuizAnswer>>({});
  const [questions, setQuestions] = useState<Record<string, QuizQuestion>>({});
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  // Load user's quiz answers
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const userId = unifiedSession.user?.id;
        if (!userId) {
          router.push('/landing');
          return;
        }

        // Fetch user's quiz results
        const response = await fetch(`/api/user/quiz-results?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          const answersMap: Record<string, QuizAnswer> = {};
          const questionsMap: Record<string, QuizQuestion> = {};
          
          data.results.forEach((result: any) => {
            answersMap[result.questionId] = {
              questionId: result.questionId,
              answer: result.answer,
              answeredAt: result.answeredAt
            };
            
            questionsMap[result.questionId] = {
              id: result.question.id,
              question: result.question.question,
              type: result.question.type,
              options: result.question.options,
              category: result.question.category
            };
          });
          
          setUserAnswers(answersMap);
          setQuestions(questionsMap);
        }
      } catch (error) {
        console.error('Error loading quiz data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (unifiedSession.status !== 'loading') {
      loadQuizData();
    }
  }, [unifiedSession.status, unifiedSession.user?.id, router]);

  const handleEdit = (questionId: string) => {
    setEditingQuestion(questionId);
    setEditValues({ ...editValues, [questionId]: userAnswers[questionId]?.answer || '' });
  };

  const handleSave = async (questionId: string) => {
    setSaving(true);
    try {
      const userId = unifiedSession.user?.id;
      if (!userId) return;

      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          answers: [{
            questionId,
            answer: editValues[questionId],
            score: 1
          }]
        }),
      });

      if (response.ok) {
        // Update local state
        setUserAnswers({
          ...userAnswers,
          [questionId]: {
            ...userAnswers[questionId],
            answer: editValues[questionId],
            answeredAt: new Date().toISOString()
          }
        });
        setEditingQuestion(null);
      } else {
        console.error('Failed to save answer');
      }
    } catch (error) {
      console.error('Error saving answer:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (questionId: string) => {
    setEditingQuestion(null);
    setEditValues({ ...editValues, [questionId]: userAnswers[questionId]?.answer || '' });
  };

  const renderAnswerInput = (question: QuizQuestion, currentAnswer: string) => {
    const questionId = question.id;
    
    if (question.type === 'MULTIPLE_CHOICE') {
      return (
        <select
          value={editValues[questionId] || currentAnswer}
          onChange={(e) => setEditValues({ ...editValues, [questionId]: e.target.value })}
          className="w-full p-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          <option value="">Select an option</option>
          {question.options?.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    if (question.type === 'MULTI_SELECT') {
      const selectedOptions = (editValues[questionId] || currentAnswer).split(', ').filter(Boolean);
      
      return (
        <div className="space-y-2">
          {question.options?.map((option) => (
            <label key={option} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={(e) => {
                  let newSelected = [...selectedOptions];
                  if (e.target.checked) {
                    newSelected.push(option);
                  } else {
                    newSelected = newSelected.filter(item => item !== option);
                  }
                  setEditValues({ ...editValues, [questionId]: newSelected.join(', ') });
                }}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      );
    }

    // Default to text input
    return (
      <input
        type="text"
        value={editValues[questionId] || currentAnswer}
        onChange={(e) => setEditValues({ ...editValues, [questionId]: e.target.value })}
        className="w-full p-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
        placeholder="Enter your answer"
      />
    );
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading your quiz responses...</p>
      </div>
    );
  }

  const questionCategories = {
    'preferences': 'Interests & Preferences',
    'demographics': 'Demographics',
    'social': 'Social Platforms', 
    'use_cases': 'AI Use Cases',
    'experience': 'Experience Level'
  };

  return (
    <motion.div
      className="p-4 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-400 transition flex items-center gap-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        <ArrowLeft className="w-5 h-5" /> Back to Settings
      </motion.button>

      <motion.h1
        className="text-2xl font-bold mb-2 text-indigo-700"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        Edit Quiz Responses
      </motion.h1>

      <motion.p
        className="text-gray-600 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        Update your preferences to get better AI tool recommendations
      </motion.p>

      {Object.entries(questionCategories).map(([category, categoryName]) => {
        const categoryQuestions = Object.values(questions).filter(q => q.category === category);
        
        if (categoryQuestions.length === 0) return null;

        return (
          <motion.div
            key={category}
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{categoryName}</h2>
            
            <div className="space-y-4">
              {categoryQuestions.map((question) => {
                const answer = userAnswers[question.id];
                const isEditing = editingQuestion === question.id;
                
                return (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-900">{question.question}</h3>
                      {!isEditing && (
                        <button
                          onClick={() => handleEdit(question.id)}
                          className="p-1 text-gray-400 hover:text-indigo-600 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-3">
                        {renderAnswerInput(question, answer?.answer || '')}
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(question.id)}
                            disabled={saving}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition flex items-center gap-1"
                          >
                            {saving ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            Save
                          </button>
                          <button
                            onClick={() => handleCancel(question.id)}
                            className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-gray-700">
                          {answer?.answer || 'No answer provided'}
                        </p>
                        {answer?.answeredAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Last updated: {new Date(answer.answeredAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {Object.keys(questions).length === 0 && (
        <motion.div
          className="bg-white rounded-xl shadow-lg p-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <p className="text-gray-600 mb-4">No quiz responses found.</p>
          <button
            onClick={() => router.push('/quiz')}
            className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            Take the Quiz
          </button>
        </motion.div>
      )}
    </motion.div>
  );
} 