const hre = require("hardhat");

async function main() {
  console.log("🔐 Authorizing backend wallet as CUR8 minter...");

  // Get the contract owner (deployer)
  const [owner] = await hre.ethers.getSigners();
  console.log("👤 Contract owner:", owner.address);

  // Get backend wallet address from private key (more reliable than env address)
  const backendPrivateKey = process.env.BACKEND_WALLET_PRIVATE_KEY;
  
  if (!backendPrivateKey) {
    throw new Error("❌ BACKEND_WALLET_PRIVATE_KEY environment variable is required");
  }

  // Create wallet from private key to get correct address
  const backendWallet = new hre.ethers.Wallet(backendPrivateKey);
  const backendWalletAddress = backendWallet.address;

  console.log("🎯 Backend wallet to authorize:", backendWalletAddress);

  // Get the deployed contract address
  const contractAddress = process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_MAINNET
    : process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET;

  if (!contractAddress) {
    throw new Error("❌ CUR8 contract address not found in environment variables");
  }

  console.log("📍 Contract address:", contractAddress);

  // Load the contract with better error handling
  let token;
  try {
    const PhoenixProofToken = await hre.ethers.getContractFactory("PhoenixProofToken");
    token = PhoenixProofToken.attach(contractAddress);
    console.log("✅ Contract loaded successfully");
  } catch (error) {
    console.error("❌ Error loading contract:", error.message);
    throw error;
  }

  // Ensure address format is correct (no ENS resolution needed)
  if (!hre.ethers.isAddress(backendWalletAddress)) {
    throw new Error(`❌ Invalid address format: ${backendWalletAddress}`);
  }

  // Check current authorization status with better error handling
  let isCurrentlyAuthorized = false;
  try {
    console.log("🔍 Checking current authorization status...");
    isCurrentlyAuthorized = await token.isAuthorizedMinter(backendWalletAddress);
    console.log("📊 Current authorization status:", isCurrentlyAuthorized);
  } catch (error) {
    console.warn("⚠️ Could not check authorization status:", error.message);
    console.log("🚀 Proceeding with authorization attempt...");
  }

  if (isCurrentlyAuthorized) {
    console.log("✅ Backend wallet is already authorized as a minter!");
    
    // Still display contract info
    try {
      console.log("\n📋 Contract Information:");
      const tokenInfo = await token.getTokenInfo();
      console.log("   Max Supply:", hre.ethers.formatEther(tokenInfo.maxSupply), "CUR8");
      console.log("   Current Supply:", hre.ethers.formatEther(tokenInfo.currentSupply), "CUR8");
      console.log("   Conversion Rate:", tokenInfo.conversionRate.toString(), "PP per CUR8");
      console.log("   Max Reward Size:", hre.ethers.formatEther(tokenInfo.maxRewardSize), "CUR8");
    } catch (error) {
      console.warn("⚠️ Could not fetch contract info:", error.message);
    }
    
    return;
  }

  // Authorize the backend wallet
  try {
    console.log("🔄 Authorizing backend wallet...");
    const tx = await token.connect(owner).setMinterAuthorization(backendWalletAddress, true);
    
    console.log("⏳ Transaction submitted:", tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait();
    console.log("✅ Authorization transaction confirmed!");
    console.log("📊 Block number:", receipt.blockNumber);
    console.log("⛽ Gas used:", receipt.gasUsed.toString());

    // Verify authorization
    try {
      const isNowAuthorized = await token.isAuthorizedMinter(backendWalletAddress);
      console.log("🔍 Final authorization status:", isNowAuthorized);

      if (isNowAuthorized) {
        console.log("🎉 Backend wallet successfully authorized as CUR8 minter!");
        console.log("💡 The backend can now mint CUR8 rewards for users who complete challenges.");
      } else {
        console.log("❌ Authorization failed - please check the transaction");
      }
    } catch (error) {
      console.warn("⚠️ Could not verify final authorization status:", error.message);
      console.log("✅ Transaction was successful, authorization likely completed");
    }

  } catch (error) {
    console.error("❌ Error during authorization:", error.message);
    throw error;
  }

  // Display contract info
  try {
    console.log("\n📋 Contract Information:");
    const tokenInfo = await token.getTokenInfo();
    console.log("   Max Supply:", hre.ethers.formatEther(tokenInfo.maxSupply), "CUR8");
    console.log("   Current Supply:", hre.ethers.formatEther(tokenInfo.currentSupply), "CUR8");
    console.log("   Conversion Rate:", tokenInfo.conversionRate.toString(), "PP per CUR8");
    console.log("   Max Reward Size:", hre.ethers.formatEther(tokenInfo.maxRewardSize), "CUR8");
  } catch (error) {
    console.warn("⚠️ Could not fetch contract info:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Authorization failed:", error);
    process.exit(1);
  }); 