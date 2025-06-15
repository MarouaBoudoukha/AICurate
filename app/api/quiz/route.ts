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
    
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error processing quiz:', error);
    return NextResponse.json(
      { error: 'Failed to process quiz' },
      { status: 500 }
    );
  }
} 