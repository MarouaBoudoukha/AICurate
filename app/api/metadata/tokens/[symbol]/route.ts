import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;

  if (symbol.toLowerCase() !== 'cur8') {
    return NextResponse.json({ error: 'Token not found' }, { status: 404 });
  }

  const metadata = {
    name: "Phoenix Proof Token",
    symbol: "CUR8",
    decimals: 18,
    description: "CUR8 is the native reward of the AICURATE Proof Economy on World Chain — earned by testing and curating AI tools. Every token represents verified contribution, not speculation.",
    image: `${process.env.NEXT_PUBLIC_APP_URL || 'https://aicurate.app'}/tokens/cur8-token.png`,
    external_url: "https://aicurate.app",
    
    // World Chain specific properties
    network: "World Chain",
    chainId: process.env.NODE_ENV === 'production' ? 480 : 4801,
    contractAddress: process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_MAINNET
      : process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET,
    
    // Economics
    tokenomics: {
      totalSupply: "1000000000000000000000000000", // 1 billion * 10^18
      initialSupply: "100000000000000000000000000", // 100 million * 10^18
      conversionRate: "100 Proof Points = 1 CUR8",
      dailyClaimLimit: "1000 CUR8",
      claimCooldown: "24 hours"
    },
    
    utility: [
      "Earned by curating AI tools",
      "Reward for proof contributions", 
      "Access to premium AICURATE features",
      "Governance participation",
      "Free claiming via World Send Transaction"
    ],
    
    attributes: [
      {
        trait_type: "Type",
        value: "Utility Token"
      },
      {
        trait_type: "Network", 
        value: "World Chain"
      },
      {
        trait_type: "Standard",
        value: "ERC-20"
      },
      {
        trait_type: "Gas Model",
        value: "Free via World Send Transaction"
      },
      {
        trait_type: "Use Case",
        value: "Proof Economy Rewards"
      },
      {
        trait_type: "Backing",
        value: "Curated Contributions"
      }
    ],
    
    links: {
      website: "https://aicurate.app",
      documentation: "https://docs.aicurate.app/cur8-token",
      explorer: process.env.NODE_ENV === 'production'
        ? `https://worldchain.blockscout.com/token/${process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_MAINNET}`
        : `https://worldchain-sepolia.blockscout.com/token/${process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET}`,
      worldApp: "https://worldcoin.org/apps/aicurate"
    },
    
    tags: ["utility", "reward", "AI", "proof", "Web3", "curation", "world-chain"],
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(metadata, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}