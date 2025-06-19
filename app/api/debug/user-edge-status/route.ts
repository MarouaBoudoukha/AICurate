import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const worldcoinId = searchParams.get('worldcoinId');
    const email = searchParams.get('email');

    if (!userId && !worldcoinId && !email) {
      return NextResponse.json(
        { error: 'Please provide userId, worldcoinId, or email parameter' },
        { status: 400 }
      );
    }

    // Find user using raw SQL to ensure we can see EdgeEsmeraldaAtt
    let query = '';
    let params: any[] = [];

    if (userId) {
      query = 'SELECT id, email, "worldcoinId", "EdgeEsmeraldaAtt", "updatedAt" FROM users WHERE id = $1';
      params = [userId];
    } else if (worldcoinId) {
      query = 'SELECT id, email, "worldcoinId", "EdgeEsmeraldaAtt", "updatedAt" FROM users WHERE "worldcoinId" = $1';
      params = [worldcoinId];
    } else if (email) {
      query = 'SELECT id, email, "worldcoinId", "EdgeEsmeraldaAtt", "updatedAt" FROM users WHERE email = $1';
      params = [email];
    }

    const result = await prisma.$queryRawUnsafe(query, ...params) as any[];

    if (result.length === 0) {
      return NextResponse.json({
        found: false,
        message: 'User not found',
        searchCriteria: { userId, worldcoinId, email }
      });
    }

    const user = result[0];

    return NextResponse.json({
      found: true,
      user: {
        id: user.id,
        email: user.email,
        worldcoinId: user.worldcoinId,
        EdgeEsmeraldaAtt: user.EdgeEsmeraldaAtt,
        updatedAt: user.updatedAt
      },
      message: `EdgeEsmeralda status: ${user.EdgeEsmeraldaAtt ? 'VERIFIED' : 'NOT_VERIFIED'}`
    });

  } catch (error) {
    console.error('Error checking user EdgeEsmeralda status:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check user status', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 