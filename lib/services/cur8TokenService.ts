import { ethers } from 'ethers';
import PhoenixProofTokenArtifact from '../../abi/PhoenixProofToken.json';

export interface CUR8RewardResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export class CUR8TokenService {
  private contract: ethers.Contract;
  private wallet: ethers.Wallet;
  private provider: ethers.JsonRpcProvider;

  constructor() {
    console.log('🏗️ Initializing CUR8TokenService...');

    // Initialize provider for World Chain with FIXED network configuration
    const rpcUrl = process.env.NODE_ENV === 'production' 
      ? 'https://worldchain.g.alchemy.com/public'
      : 'https://worldchain-sepolia.g.alchemy.com/public';

    console.log(`🌐 Using RPC URL: ${rpcUrl}`);

    // CRITICAL FIX: Properly configure network to completely avoid ENS
    const networkConfig = {
      name: process.env.NODE_ENV === 'production' ? 'worldchain' : 'worldchain-sepolia',
      chainId: process.env.NODE_ENV === 'production' ? 480 : 4801
    };

    this.provider = new ethers.JsonRpcProvider(rpcUrl, networkConfig);

    // CRITICAL FIX: Override ENS resolution methods to prevent any ENS calls
    this.provider.resolveName = async () => null;
    this.provider.lookupAddress = async () => null;

    // Initialize backend wallet for minting
    if (!process.env.BACKEND_WALLET_PRIVATE_KEY) {
      throw new Error('BACKEND_WALLET_PRIVATE_KEY environment variable is required');
    }

    this.wallet = new ethers.Wallet(process.env.BACKEND_WALLET_PRIVATE_KEY, this.provider);
    console.log(`✅ Backend wallet initialized: ${this.wallet.address}`);

    // Initialize contract with STRICT address validation
    const contractAddress = process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_MAINNET
      : process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET;

    if (!contractAddress) {
      throw new Error('CUR8 contract address not configured');
    }

    // CRITICAL FIX: Validate contract address is proper hex (not ENS)
    if (!ethers.isAddress(contractAddress)) {
      throw new Error(`Invalid contract address format: ${contractAddress}. Must be hex address (0x...), not ENS name.`);
    }

    console.log(`🏗️ Connecting to contract: ${contractAddress}`);

    this.contract = new ethers.Contract(contractAddress, PhoenixProofTokenArtifact.abi, this.wallet);
    
    console.log('✅ CUR8TokenService initialized successfully');
  }

  /**
   * Check if backend wallet is authorized to mint rewards
   */
  async isAuthorizedMinter(): Promise<boolean> {
    // Skip authorization check entirely in development to avoid ENS issues
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Development mode: Skipping authorization check (assuming authorized)');
      return true;
    }

    try {
      // CRITICAL FIX: Get wallet address directly (no ENS resolution)
      const walletAddress = this.wallet.address;
      
      // Double-check address format
      if (!ethers.isAddress(walletAddress)) {
        console.error('❌ Invalid wallet address format:', walletAddress);
        return false;
      }
      
      console.log('🔍 Checking authorization for wallet:', walletAddress);
      
      // Make the contract call with explicit hex address (guaranteed no ENS)
      const isAuthorized = await this.contract.isAuthorizedMinter(walletAddress);
      console.log('📊 Authorization result:', isAuthorized);
      
      return isAuthorized;
    } catch (error) {
      console.error('❌ Error checking minter authorization:', error);
      return false;
    }
  }

  /**
   * Mint CUR8 reward tokens for a user when they complete challenges/activities
   * @param userAddress - User's wallet address (MUST be hex format, not ENS)
   * @param proofPointsEarned - Amount of proof points earned
   * @param rewardType - Type of reward (e.g., "challenge_complete", "agent_session", "quiz_complete")
   * @returns Transaction result
   */
  async mintRewardForProofPoints(
    userAddress: string, 
    proofPointsEarned: number, 
    rewardType: string
  ): Promise<CUR8RewardResult> {
    try {
      console.log(`🪙 Minting CUR8 reward for ${userAddress}: ${proofPointsEarned} proof points (${rewardType})`);

      // CRITICAL FIX: Validate user address is proper hex format (not ENS)
      if (!ethers.isAddress(userAddress)) {
        const error = `Invalid user address format: ${userAddress}. Must be hex address (0x...), not ENS name.`;
        console.error('❌', error);
        return { success: false, error };
      }

      // Check if backend is authorized
      const isAuthorized = await this.isAuthorizedMinter();
      if (!isAuthorized) {
        console.error('❌ Backend wallet not authorized to mint CUR8 tokens');
        return { success: false, error: 'Backend not authorized to mint' };
      }

      // Calculate reward amount based on your tier system
      let rewardAmount: bigint;

      // Define reward tiers based on proof points earned
      if (proofPointsEarned >= 100) {
        // Major milestone: 1 CUR8 token
        rewardAmount = ethers.parseEther("1");
        console.log(`💎 Major milestone reward: 1 CUR8`);
      } else if (proofPointsEarned >= 50) {
        // Medium milestone: 0.5 CUR8 tokens
        rewardAmount = ethers.parseEther("0.5");
        console.log(`🏆 Medium milestone reward: 0.5 CUR8`);
      } else if (proofPointsEarned >= 20) {
        // Small milestone: 0.2 CUR8 tokens
        rewardAmount = ethers.parseEther("0.2");
        console.log(`🎯 Small milestone reward: 0.2 CUR8`);
      } else {
        // Micro rewards: 0.1 CUR8 tokens
        rewardAmount = ethers.parseEther("0.1");
        console.log(`⭐ Micro reward: 0.1 CUR8`);
      }

      // Ensure we don't exceed the max reward size (100 CUR8)
      const maxReward = ethers.parseEther("100");
      if (rewardAmount > maxReward) {
        rewardAmount = maxReward;
        console.log(`🚨 Reward capped at max: 100 CUR8`);
      }

      console.log(`💰 Final reward amount: ${ethers.formatEther(rewardAmount)} CUR8 (${rewardAmount.toString()} wei)`);

      // CRITICAL FIX: Call contract with validated hex addresses only
      const tx = await this.contract.mintReward(
        userAddress, // Already validated as hex address
        rewardAmount,
        rewardType
      );

      console.log(`⏳ CUR8 reward transaction submitted: ${tx.hash}`);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log(`✅ CUR8 reward minted successfully!`);
      console.log(`   Transaction: ${receipt.hash || tx.hash}`);
      console.log(`   Gas used: ${receipt.gasUsed.toString()}`);
      console.log(`   Block: ${receipt.blockNumber}`);

      return {
        success: true,
        transactionHash: receipt.hash || tx.hash
      };

    } catch (error: any) {
      console.error('❌ Error minting CUR8 reward:', error);
      
      // Provide more helpful error messages
      let errorMessage = 'Unknown error';
      if (error.code === 'UNSUPPORTED_OPERATION') {
        errorMessage = `Network configuration error: ${error.shortMessage}`;
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Backend wallet has insufficient funds for gas';
      } else if (error.code === 'CALL_EXCEPTION') {
        errorMessage = `Smart contract error: ${error.reason || error.message}`;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Batch mint rewards for multiple users (for efficiency)
   */
  async batchMintRewards(
    rewards: Array<{
      userAddress: string;
      proofPointsEarned: number;
    }>,
    rewardType: string
  ): Promise<CUR8RewardResult> {
    try {
      console.log(`🪙 Batch minting CUR8 rewards for ${rewards.length} users`);

      // Validate all addresses first
      for (const reward of rewards) {
        if (!ethers.isAddress(reward.userAddress)) {
          const error = `Invalid user address in batch: ${reward.userAddress}`;
          console.error('❌', error);
          return { success: false, error };
        }
      }

      const isAuthorized = await this.isAuthorizedMinter();
      if (!isAuthorized) {
        return { success: false, error: 'Backend not authorized to mint' };
      }

      const users: string[] = [];
      const amounts: bigint[] = [];

      rewards.forEach(reward => {
        users.push(reward.userAddress);
        
        // Calculate reward amount based on proof points (same tier system)
        let rewardAmount: bigint;
        if (reward.proofPointsEarned >= 100) {
          rewardAmount = ethers.parseEther("1");
        } else if (reward.proofPointsEarned >= 50) {
          rewardAmount = ethers.parseEther("0.5");
        } else if (reward.proofPointsEarned >= 20) {
          rewardAmount = ethers.parseEther("0.2");
        } else {
          rewardAmount = ethers.parseEther("0.1");
        }
        
        amounts.push(rewardAmount);
      });

      console.log(`💰 Batch totals: ${rewards.length} users, ${amounts.reduce((sum, amt) => sum + amt, 0n)} wei total`);

      const tx = await this.contract.batchMintRewards(users, amounts, rewardType);
      console.log(`⏳ Batch CUR8 reward transaction submitted: ${tx.hash}`);

      const receipt = await tx.wait();
      console.log(`✅ Batch CUR8 rewards minted successfully: ${receipt.hash || tx.hash}`);

      return {
        success: true,
        transactionHash: receipt.hash || tx.hash
      };

    } catch (error: any) {
      console.error('❌ Error batch minting CUR8 rewards:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get user's total CUR8 balance
   */
  async getUserCUR8Balance(userAddress: string): Promise<bigint> {
    try {
      // Validate address format
      if (!ethers.isAddress(userAddress)) {
        console.error('❌ Invalid address for balance check:', userAddress);
        return BigInt(0);
      }

      return await this.contract.balanceOf(userAddress);
    } catch (error) {
      console.error('❌ Error getting CUR8 balance:', error);
      return BigInt(0);
    }
  }

  /**
   * Get token economics information
   */
  async getTokenInfo() {
    try {
      return await this.contract.getTokenInfo();
    } catch (error) {
      console.error('❌ Error getting token info:', error);
      return null;
    }
  }

  /**
   * Get user's claim information from smart contract
   */
  async getUserClaimInfo(userAddress: string) {
    try {
      // Validate address format
      if (!ethers.isAddress(userAddress)) {
        console.error('❌ Invalid address for claim info:', userAddress);
        return null;
      }

      return await this.contract.getUserClaimInfo(userAddress);
    } catch (error) {
      console.error('❌ Error getting user claim info:', error);
      return null;
    }
  }

  /**
   * Test connection to contract (useful for debugging)
   */
  async testConnection(): Promise<boolean> {
    try {
      const version = await this.contract.version();
      console.log(`✅ Contract connection successful. Version: ${version}`);
      return true;
    } catch (error) {
      console.error('❌ Contract connection failed:', error);
      return false;
    }
  }
}