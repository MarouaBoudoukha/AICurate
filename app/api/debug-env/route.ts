export async function GET() {
  return Response.json({
    NODE_ENV: process.env.NODE_ENV,
    testnetAddress: process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET,
    mainnetAddress: process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_MAINNET,
    hasBackendKey: !!process.env.BACKEND_WALLET_PRIVATE_KEY,
    
    // Debug info
    testnetLength: process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET?.length,
    testnetValid: process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET 
      ? /^0x[a-fA-F0-9]{40}$/.test(process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET)
      : false
  });
}