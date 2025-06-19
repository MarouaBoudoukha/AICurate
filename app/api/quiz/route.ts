import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CUR8TokenService } from '@/lib/services/cur8TokenService';

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

    // 🎯 Award proof points for quiz completion (50 points)
    const quizProofPoints = 50;
    const newProofPoints = user.proofPoints + quizProofPoints;
    const newLevel = Math.floor(newProofPoints / 100) + 1;

    // Mark quiz as completed and award proof points
    await prisma.user.update({
      where: { id: userId },
      data: {
        hasCompletedQuiz: true,
        onboardingCompleted: true,
        proofPoints: newProofPoints,
        level: newLevel,
        lastActiveAt: new Date()
      }
    });

    // Create quiz completion activity
    await prisma.userActivity.create({
      data: {
        userId: userId,
        activityType: 'QUIZ_COMPLETE',
        description: 'Onboarding quiz completed',
        proofPointsEarned: quizProofPoints,
        metadata: {
          questionsAnswered: answers.length,
          pointsAwarded: quizProofPoints
        }
      }
    });

    // 🪙 Mint CUR8 rewards for quiz completion
    let cur8MintResult = null;
    try {
      // Get user's wallet address from worldcoinId (this is their wallet address)
      const userWalletAddress = user.worldcoinId;
      
      if (userWalletAddress) {
        console.log(`🎯 Minting CUR8 rewards for quiz completion: ${userWalletAddress}`);
        
        const cur8Service = new CUR8TokenService();
        cur8MintResult = await cur8Service.mintRewardForProofPoints(
          userWalletAddress,
          quizProofPoints,
          'quiz_completion'
        );

        if (cur8MintResult.success) {
          console.log(`✅ CUR8 quiz rewards minted! TX: ${cur8MintResult.transactionHash}`);
          
          // Store the minting transaction
          await prisma.userActivity.create({
            data: {
              userId: userId,
              activityType: 'CUR8_REWARD_MINTED',
              description: `CUR8 tokens minted for quiz completion`,
              proofPointsEarned: quizProofPoints,
              metadata: {
                cur8TxHash: cur8MintResult.transactionHash,
                rewardType: 'quiz_completion',
                originalProofPoints: quizProofPoints
              }
            }
          });
        } else {
          console.warn(`⚠️ Failed to mint CUR8 quiz rewards: ${cur8MintResult.error}`);
        }
      } else {
        console.log(`ℹ️ No wallet address found for user ${userId}, skipping CUR8 minting`);
      }
    } catch (error) {
      console.error('❌ Error in CUR8 quiz minting process:', error);
      // Don't fail the entire request if minting fails
    }

    // Check for level up and create notification
    if (newLevel > user.level) {
      await prisma.notification.create({
        data: {
          userId: userId,
          type: 'LEVEL_UP',
          title: 'Level Up!',
          message: `Congratulations! You've reached level ${newLevel}`,
          metadata: {
            newLevel: newLevel,
            oldLevel: user.level,
            pointsEarned: quizProofPoints,
            source: 'quiz_completion'
          }
        }
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      results,
      userStats: {
        proofPoints: newProofPoints,
        level: newLevel,
        levelUp: newLevel > user.level
      },
      blockchain: {
        cur8Minted: cur8MintResult?.success || false,
        transactionHash: cur8MintResult?.transactionHash,
        error: cur8MintResult?.error
      }
    });
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