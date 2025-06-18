import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch user's badge mints
    const badgeMints = await prisma.badgeMint.findMany({
      where: {
        userId: userId,
        status: 'CONFIRMED'
      },
      orderBy: {
        mintedAt: 'desc',
      },
    });

    // Fetch user data for proof points and credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        proofPoints: true,
        hasCompletedQuiz: true,
        hasMintedBadge: true,
        badgeTransactionId: true,
        badgeMintedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      badges: badgeMints,
      user: user,
      proofPoints: user?.proofPoints || 50,
      hasCompletedQuiz: user?.hasCompletedQuiz || false,
      hasMintedBadge: user?.hasMintedBadge || false
    });

  } catch (error) {
    console.error('Error fetching user badges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user badges' },
      { status: 500 }
    );
  }
} 