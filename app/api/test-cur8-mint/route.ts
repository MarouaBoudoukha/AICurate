// Create app/api/test-cur8-mint/route.ts

import { CUR8TokenService } from '@/lib/services/cur8TokenService';

export async function POST(request: Request) {
  try {
    const { userAddress, proofPoints } = await request.json();
    
    // Validate input
    if (!userAddress || !proofPoints) {
      return Response.json({
        success: false,
        error: 'Missing userAddress or proofPoints'
      }, { status: 400 });
    }

    console.log(`🧪 Testing reward mint: ${userAddress} -> ${proofPoints} PP`);
    
    const service = new CUR8TokenService();
    
    // Test reward minting
    const result = await service.mintRewardForProofPoints(
      userAddress,
      proofPoints,
      'test_reward'
    );
    
    console.log('✅ Mint test result:', result);
    
    return Response.json(result);
  } catch (error: any) {
    console.error('❌ Test mint failed:', error);
    
    return Response.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}