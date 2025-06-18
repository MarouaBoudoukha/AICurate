import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { 
      worldcoinId, 
      transactionId, 
      userAddress, 
      nullifierHash,
      badgeName = 'EdgeEsmeralda Badge'
    } = await req.json();

    if (!worldcoinId || !transactionId || !userAddress) {
      return NextResponse.json(
        { error: 'WorldCoin ID, transaction ID, and user address are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { worldcoinId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already minted
    const existingMint = await prisma.badgeMint.findFirst({
      where: {
        userId: user.id,
        badgeType: 'EdgeEsmeralda'
      }
    });

    if (existingMint) {
      return NextResponse.json(
        { error: 'Badge already minted', existingMint },
        { status: 409 }
      );
    }

    // Record the mint
    const badgeMint = await prisma.badgeMint.create({
      data: {
        userId: user.id,
        badgeName,
        badgeType: 'EdgeEsmeralda',
        contractAddress: '0xE058B6D762346586d1d1315dFED4029d17b0160D',
        tokenId: '1',
        transactionId,
        userAddress,
        nullifierHash,
        network: 'World Chain Sepolia',
        status: 'CONFIRMED'
      }
    });

    // Update user status
    await prisma.user.update({
      where: { id: user.id },
      data: {
        hasMintedBadge: true,
        badgeTransactionId: transactionId,
        badgeMintedAt: new Date(),
        proofPoints: user.proofPoints + 50 // Award proof points
      }
    });

    return NextResponse.json({ 
      success: true, 
      badgeMint,
      message: 'Badge minting recorded successfully'
    });

  } catch (error) {
    console.error('Error recording badge mint:', error);
    return NextResponse.json(
      { error: 'Failed to record badge mint' },
      { status: 500 }
    );
  }
} 