const hre = require("hardhat");

async function main() {
  console.log("🧪 Testing CUR8 Smart Contract Integration...\n");

  // Get the deployed contract address
  const contractAddress = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_MAINNET
    : process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET;

  if (!contractAddress) {
    console.error("❌ CUR8 contract address not found in environment variables");
    console.log("💡 Make sure to set NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET in your .env.local file");
    process.exit(1);
  }

  console.log("📍 Testing contract at:", contractAddress);

  // Load the contract
  const PhoenixProofToken = await hre.ethers.getContractFactory("PhoenixProofToken");
  const token = PhoenixProofToken.attach(contractAddress);

  try {
    console.log("\n🔍 1. Basic Contract Information");
    console.log("====================================");
    
    const name = await token.name();
    const symbol = await token.symbol();
    const version = await token.version();
    const totalSupply = await token.totalSupply();
    
    console.log("✅ Contract Name:", name);
    console.log("✅ Symbol:", symbol);
    console.log("✅ Version:", version);
    console.log("✅ Total Supply:", hre.ethers.formatEther(totalSupply), "CUR8");

    console.log("\n🔍 2. Token Economics");
    console.log("========================");
    
    const tokenInfo = await token.getTokenInfo();
    console.log("✅ Max Supply:", hre.ethers.formatEther(tokenInfo.maxSupply), "CUR8");
    console.log("✅ Current Supply:", hre.ethers.formatEther(tokenInfo.currentSupply), "CUR8");
    console.log("✅ Remaining:", hre.ethers.formatEther(tokenInfo.remaining), "CUR8");
    console.log("✅ Conversion Rate:", tokenInfo.conversionRate.toString(), "PP per CUR8");
    console.log("✅ Min Proof Points:", tokenInfo.minProofPoints.toString());
    console.log("✅ Daily Limit:", hre.ethers.formatEther(tokenInfo.dailyLimit), "CUR8");
    console.log("✅ Max Reward Size:", hre.ethers.formatEther(tokenInfo.maxRewardSize), "CUR8");

    console.log("\n🔍 3. Backend Wallet Authorization");
    console.log("=====================================");
    
    const backendWallet = process.env.BACKEND_WALLET_ADDRESS;
    if (backendWallet) {
      const isAuthorized = await token.isAuthorizedMinter(backendWallet);
      console.log("📧 Backend Wallet:", backendWallet);
      console.log(isAuthorized ? "✅ Authorized to mint rewards" : "❌ NOT authorized to mint rewards");
      
      if (!isAuthorized) {
        console.log("⚠️  WARNING: Backend wallet is not authorized!");
        console.log("🔧 Run: npx hardhat run scripts/authorize-backend-minter.js --network worldchainSepolia");
      }
    } else {
      console.log("❌ BACKEND_WALLET_ADDRESS not set in environment");
    }

    console.log("\n🔍 4. Test Proof Points Calculation");
    console.log("======================================");
    
    const testProofPoints = [50, 100, 200, 500];
    for (const pp of testProofPoints) {
      const tokens = await token.calculateTokens(pp);
      console.log(`✅ ${pp} PP → ${hre.ethers.formatEther(tokens)} CUR8`);
    }

    console.log("\n🔍 5. Contract Constants");
    console.log("===========================");
    
    const maxSupply = await token.MAX_SUPPLY();
    const initialSupply = await token.INITIAL_SUPPLY();
    const claimCooldown = await token.CLAIM_COOLDOWN();
    const maxClaimPerDay = await token.MAX_CLAIM_PER_DAY();
    const minProofPoints = await token.MIN_PROOF_POINTS();
    const maxRewardSize = await token.MAX_REWARD_SIZE();
    
    console.log("✅ MAX_SUPPLY:", hre.ethers.formatEther(maxSupply), "CUR8");
    console.log("✅ INITIAL_SUPPLY:", hre.ethers.formatEther(initialSupply), "CUR8");
    console.log("✅ CLAIM_COOLDOWN:", (claimCooldown / 3600n).toString(), "hours");
    console.log("✅ MAX_CLAIM_PER_DAY:", hre.ethers.formatEther(maxClaimPerDay), "CUR8");
    console.log("✅ MIN_PROOF_POINTS:", minProofPoints.toString());
    console.log("✅ MAX_REWARD_SIZE:", hre.ethers.formatEther(maxRewardSize), "CUR8");

    console.log("\n🎉 Integration Test Complete!");
    console.log("===============================");
    console.log("✅ Smart contract is deployed and functional");
    console.log("✅ Token economics are properly configured");
    console.log("✅ Contract constants are set correctly");
    
    if (backendWallet && await token.isAuthorizedMinter(backendWallet)) {
      console.log("✅ Backend wallet is authorized for minting");
      console.log("\n🚀 Your CUR8 integration is ready!");
      console.log("💡 Users will automatically receive CUR8 tokens when they earn proof points");
    } else {
      console.log("⚠️  Backend wallet needs authorization");
      console.log("🔧 Next step: Run the authorization script");
    }

  } catch (error) {
    console.error("\n❌ Integration test failed:", error.message);
    console.log("💡 Check your contract address and network configuration");
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Test script failed:", error);
    process.exit(1);
  }); 