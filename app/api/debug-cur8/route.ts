export async function GET() {
  const contractAddress = process.env.CUR8_CONTRACT_ADDRESS;
  const privateKey = process.env.BACKEND_WALLET_PRIVATE_KEY;
  const rpcUrl = process.env.WORLD_CHAIN_RPC_URL;
  
  return Response.json({
    contractAddress: contractAddress || 'MISSING',
    hasPrivateKey: !!privateKey,
    rpcUrl: rpcUrl || 'MISSING',
    contractIsValidHex: contractAddress ? /^0x[a-fA-F0-9]{40}$/.test(contractAddress) : false
  });
}