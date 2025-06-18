import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch quiz results with questions
    const quizResults = await prisma.userQuizResult.findMany({
      where: {
        userId: userId,
      },
      include: {
        question: true,
      },
      orderBy: {
        answeredAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      results: quizResults,
    });

  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz results' },
      { status: 500 }
    );
  }
} 