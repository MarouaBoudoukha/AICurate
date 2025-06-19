import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch CUR8 reward transactions from user activities
    const cur8Transactions = await prisma.userActivity.findMany({
      where: {
        userId: userId,
        activityType: 'CUR8_REWARD_MINTED'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to last 50 transactions
    });

    // Format transactions for wallet display
    const formattedTransactions = cur8Transactions.map((activity) => {
      const metadata = activity.metadata as any;
      return {
        id: activity.id,
        type: 'earn',
        amount: activity.proofPointsEarned,
        description: activity.description,
        date: activity.createdAt.toISOString(),
        status: 'completed',
        txHash: metadata?.cur8TxHash || null,
        rewardType: metadata?.rewardType || 'unknown',
        proofPointsEarned: activity.proofPointsEarned
      };
    });

    return NextResponse.json({
      success: true,
      transactions: formattedTransactions,
      totalCount: cur8Transactions.length
    });

  } catch (error) {
    console.error('Error fetching CUR8 transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CUR8 transactions' },
      { status: 500 }
    );
  }
} 