import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userAddress, proofPointsAmount, worldIdProof } = await req.json();

    console.log('🪙 Processing CUR8 claim request on World Chain...');

    // Validate inputs
    if (!userAddress || !proofPointsAmount || !worldIdProof) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    if (proofPointsAmount < 100) {
      return NextResponse.json({
        success: false,
        error: 'Minimum 100 proof points required'
      }, { status: 400 });
    }

    // Verify World ID (reuse existing verification)
    const verificationResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/verify-world-id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ proof: worldIdProof }),
    });

    const verificationResult = await verificationResponse.json();

    if (!verificationResult.verified) {
      return NextResponse.json({
        success: false,
        error: 'World ID verification failed'
      }, { status: 400 });
    }

    // Calculate CUR8 tokens to award
    const conversionRate = 100; // 100 proof points = 1 CUR8
    const tokensToAward = Math.floor(proofPointsAmount / conversionRate);

    // TODO: Integrate with your proof points system
    // Verify user has enough proof points
    // const userProofPoints = await getUserProofPoints(userAddress);
    // if (userProofPoints < proofPointsAmount) {
    //   return NextResponse.json({
    //     success: false,
    //     error: 'Insufficient proof points balance'
    //   }, { status: 400 });
    // }

    console.log('✅ CUR8 claim approved for World Send Transaction:', {
      user: userAddress,
      proofPoints: proofPointsAmount,
      tokensToAward,
      network: 'World Chain'
    });

    return NextResponse.json({
      success: true,
      tokensToAward,
      proofPointsUsed: proofPointsAmount,
      nullifierHash: verificationResult.nullifierHash,
      network: 'World Chain',
      gasRequired: false, // Free via World Send Transaction!
    });

  } catch (error) {
    console.error('💥 CUR8 claim error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}