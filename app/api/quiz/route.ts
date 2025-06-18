import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId, answers } = await req.json();
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create quiz questions for the onboarding steps if they don't exist
    const questionMap = new Map();
    
    for (const answer of answers) {
      const { questionId } = answer;
      
      // Check if question exists, if not create it
      let question = await prisma.quizQuestion.findFirst({
        where: { id: questionId }
      });
      
      if (!question) {
        // Create question for this step
        question = await prisma.quizQuestion.create({
          data: {
            id: questionId,
            question: getQuestionText(questionId),
            type: 'TEXT',
            category: 'ONBOARDING',
            order: getQuestionOrder(questionId),
            isActive: true
          }
        });
      }
      
      questionMap.set(questionId, question);
    }

    // Process quiz answers
    const results = await Promise.all(
      answers.map(async (a: any) =>
        prisma.userQuizResult.upsert({
          where: { userId_questionId: { userId, questionId: a.questionId } },
          update: { answer: a.answer, score: a.score },
          create: { userId, questionId: a.questionId, answer: a.answer, score: a.score }
        })
      )
    );

    // Mark quiz as completed
    await prisma.user.update({
      where: { id: userId },
      data: {
        hasCompletedQuiz: true,
        onboardingCompleted: true
      }
    });
    
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error processing quiz:', error);
    return NextResponse.json(
      { error: 'Failed to process quiz' },
      { status: 500 }
    );
  }
}

// Helper function to get question text based on step key
function getQuestionText(stepKey: string): string {
  const questionTexts: Record<string, string> = {
    'interests': 'What are your interests?',
    'location': 'What is your location?',
    'city': 'What city are you in?',
    'age': 'How old are you?',
    'platforms': 'Where do you hang out most online?',
    'tasks': 'What do you want AI to help you with?',
    'comfort': 'What\'s your comfort level with AI?'
  };
  
  return questionTexts[stepKey] || `Question: ${stepKey}`;
}

// Helper function to get question order
function getQuestionOrder(stepKey: string): number {
  const orderMap: Record<string, number> = {
    'interests': 1,
    'location': 2,
    'city': 3,
    'age': 4,
    'platforms': 5,
    'tasks': 6,
    'comfort': 7
  };
  
  return orderMap[stepKey] || 0;
} 