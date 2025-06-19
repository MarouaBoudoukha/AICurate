// Update app/api/test-cur8-connection/route.ts

import { CUR8TokenService } from '@/lib/services/cur8TokenService';

// Helper function to serialize BigInt values
function serializeBigInt(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (key, value) => 
    typeof value === 'bigint' ? value.toString() : value
  ));
}

export async function GET() {
  try {
    console.log('🧪 Testing CUR8 connection...');
    
    const service = new CUR8TokenService();
    
    // Test basic connection
    const connectionTest = await service.testConnection();
    console.log('✅ Connection test result:', connectionTest);
    
    // Test authorization
    const isAuthorized = await service.isAuthorizedMinter();
    console.log('🔐 Authorization test result:', isAuthorized);
    
    // Get token info (this likely contains BigInt values)
    let tokenInfo = null;
    try {
      const rawTokenInfo = await service.getTokenInfo();
      // Convert BigInt values to strings for JSON serialization
      if (rawTokenInfo) {
        tokenInfo = {
          currentSupply: rawTokenInfo.currentSupply.toString(),
          maxSupply: rawTokenInfo.maxSupply.toString(),
          remaining: rawTokenInfo.remaining.toString(),
          conversionRate: rawTokenInfo.conversionRate.toString(),
          minProofPoints: rawTokenInfo.minProofPoints.toString(),
          dailyLimit: rawTokenInfo.dailyLimit.toString(),
          maxRewardSize: rawTokenInfo.maxRewardSize.toString()
        };
      }
      console.log('📊 Token info retrieved and serialized');
    } catch (error) {
      console.error('⚠️ Token info failed:', error);
      tokenInfo = { error: 'Failed to get token info' };
    }
    
    return Response.json({
      success: true,
      connectionWorking: connectionTest,
      backendAuthorized: isAuthorized,
      tokenInfo: tokenInfo,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        usingTestnet: process.env.NODE_ENV !== 'production',
        contractAddress: process.env.NODE_ENV === 'production'
          ? process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_MAINNET
          : process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET,
        hasContractAddress: !!(process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_MAINNET
          : process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET),
        hasBackendKey: !!process.env.BACKEND_WALLET_PRIVATE_KEY
      }
    });
  } catch (error: any) {
    console.error('❌ CUR8 connection test failed:', error);
    
    return Response.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        testnetAddress: process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET,
        mainnetAddress: process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_MAINNET,
        hasBackendKey: !!process.env.BACKEND_WALLET_PRIVATE_KEY
      }
    }, { status: 500 });
  }
}