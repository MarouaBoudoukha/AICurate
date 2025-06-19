import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CUR8TokenService } from '@/lib/services/cur8TokenService';

export async function POST(req: NextRequest) {
  try {
    const { 
      userId, 
      challengeId, 
      proofPointsEarned, 
      userWalletAddress,
      challengeType = 'general'
    } = await req.json();

    if (!userId || !challengeId || !proofPointsEarned) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, challengeId, proofPointsEarned' },
        { status: 400 }
      );
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update user's proof points and level
    const newProofPoints = user.proofPoints + proofPointsEarned;
    const newLevel = Math.floor(newProofPoints / 100) + 1;

    await prisma.user.update({
      where: { id: userId },
      data: {
        proofPoints: newProofPoints,
        level: newLevel,
        lastActiveAt: new Date()
      }
    });

    // Create challenge completion activity
    await prisma.userActivity.create({
      data: {
        userId: userId,
        activityType: 'CHALLENGE_COMPLETE',
        description: `Challenge completed: ${challengeId}`,
        proofPointsEarned: proofPointsEarned,
        metadata: {
          challengeId: challengeId,
          challengeType: challengeType,
          pointsAwarded: proofPointsEarned
        }
      }
    });

    // 🪙 Mint CUR8 rewards on blockchain
    let cur8MintResult = null;
    try {
      if (userWalletAddress) {
        console.log(`🎯 Minting CUR8 rewards for challenge completion: ${userWalletAddress}`);
        
        const cur8Service = new CUR8TokenService();
        cur8MintResult = await cur8Service.mintRewardForProofPoints(
          userWalletAddress,
          proofPointsEarned,
          `challenge_${challengeType}`
        );

        if (cur8MintResult.success) {
          console.log(`✅ CUR8 challenge rewards minted! TX: ${cur8MintResult.transactionHash}`);
          
          // Store the minting transaction
          await prisma.userActivity.create({
            data: {
              userId: userId,
              activityType: 'CUR8_REWARD_MINTED',
              description: `CUR8 tokens minted for challenge completion`,
              proofPointsEarned: proofPointsEarned,
              metadata: {
                cur8TxHash: cur8MintResult.transactionHash,
                rewardType: `challenge_${challengeType}`,
                challengeId: challengeId,
                originalProofPoints: proofPointsEarned
              }
            }
          });
        } else {
          console.warn(`⚠️ Failed to mint CUR8 challenge rewards: ${cur8MintResult.error}`);
        }
      } else {
        console.log(`ℹ️ No wallet address provided for user ${userId}, skipping CUR8 minting`);
      }
    } catch (error) {
      console.error('❌ Error in CUR8 challenge minting process:', error);
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
            pointsEarned: proofPointsEarned,
            challengeId: challengeId
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Challenge completed successfully',
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
    console.error('Challenge completion error:', error);
    return NextResponse.json(
      { error: 'Failed to complete challenge' },
      { status: 500 }
    );
  }
} 