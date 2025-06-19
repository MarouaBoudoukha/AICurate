import { useState, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

// Import ABI (will be generated after compilation)
import PhoenixProofTokenABI from '../abi/PhoenixProofToken.json';

// Get contract address based on environment (same pattern as EdgeEsmeralda)
const getContractAddress = () => {
  return process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_MAINNET
    : process.env.NEXT_PUBLIC_CUR8_CONTRACT_ADDRESS_TESTNET;
};

// Get World Chain configuration (same as EdgeEsmeralda)
const getWorldChainConfig = () => {
  return process.env.NODE_ENV === 'production' 
    ? {
        chainId: 480,
        rpcUrl: 'https://worldchain-mainnet.g.alchemy.com/public',
        explorerUrl: 'https://worldchain.blockscout.com',
        name: 'World Chain'
      }
    : {
        chainId: 4801,
        rpcUrl: 'https://worldchain-sepolia.g.alchemy.com/public',
        explorerUrl: 'https://worldchain-sepolia.blockscout.com',
        name: 'World Chain Sepolia'
      };
};

export const useCUR8Token = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  
  const [tokenInfo, setTokenInfo] = useState({
    currentSupply: 0,
    maxSupply: 1000000000,
    remaining: 1000000000,
    conversionRate: 100,
    minProofPoints: 100,
    dailyLimit: 1000
  });
  
  const [userBalance, setUserBalance] = useState(0);
  const [userClaimInfo, setUserClaimInfo] = useState({
    isVerified: false,
    canClaimNow: true,
    totalClaimed: 0,
    totalProofPointsSpent: 0,
    nextClaimTime: 0
  });

  // Initialize user address from MiniKit (same as EdgeEsmeralda)
  useEffect(() => {
    if (MiniKit.isInstalled()) {
      const user = MiniKit.user;
      if (user?.walletAddress) {
        setUserAddress(user.walletAddress);
        console.log('👤 User address from World App:', user.walletAddress);
      }
    } else {
      console.log('⚠️ Not running in World App');
    }
  }, []);

  // Load user data when address changes
  useEffect(() => {
    if (userAddress) {
      loadUserData();
    }
  }, [userAddress]);

  /**
   * 🚀 MAIN FUNCTION: Claim CUR8 tokens using World Send Transaction
   * Same pattern as EdgeEsmeralda but for ERC-20 tokens!
   */
  const claimCUR8Tokens = async (proofPointsAmount, worldIdProof) => {
    if (!MiniKit.isInstalled()) {
      throw new Error('World App required for claiming CUR8');
    }

    if (!userAddress) {
      throw new Error('User address not found');
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🪙 Initiating CUR8 claim with World Send Transaction...');
      console.log('📍 Contract:', getContractAddress());
      console.log('👤 User:', userAddress);
      console.log('💎 Proof Points:', proofPointsAmount);

      // First, get claim approval from backend
      const claimResponse = await fetch('/api/claim-cur8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress,
          proofPointsAmount,
          worldIdProof,
        }),
      });

      const claimResult = await claimResponse.json();

      if (!claimResult.success) {
        throw new Error(claimResult.error);
      }

      console.log('✅ Claim approved, sending World transaction...');
      
      // ✨ THIS IS THE WORLD SEND TRANSACTION FOR CUR8! ✨
      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: getContractAddress(),
            abi: PhoenixProofTokenABI.abi,
            functionName: 'claimTokens',
            args: [proofPointsAmount, claimResult.nullifierHash],
          },
        ],
      });

      console.log('📤 CUR8 World transaction sent!');
      console.log('Command payload:', commandPayload);
      console.log('Final payload:', finalPayload);

      if (finalPayload.status === 'error') {
        throw new Error(finalPayload.error || 'Transaction failed');
      }

      // Set transaction ID for tracking
      setTransactionId(finalPayload.transaction_id);
      
      // Start polling for transaction hash
      pollForTransactionHash(finalPayload.transaction_id);
      
      console.log('✅ CUR8 claim transaction submitted successfully!');
      
      return {
        success: true,
        transactionId: finalPayload.transaction_id,
        tokensAwarded: claimResult.tokensToAward,
      };

    } catch (error) {
      console.error('❌ CUR8 claim failed:', error);
      setError(error.message);
      return {
        success: false,
        error: error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Poll for transaction hash (same as EdgeEsmeralda)
   */
  const pollForTransactionHash = async (txId) => {
    console.log('🔄 Polling for CUR8 transaction hash...', txId);
    let attempts = 0;
    const maxAttempts = 60; // 10 minutes max

    const poll = async () => {
      try {
        // Reuse the same transaction hash API from EdgeEsmeralda
        const response = await fetch(`/api/get-transaction-hash?transactionId=${txId}`);

        if (response.ok) {
          const data = await response.json();
          if (data.transactionHash) {
            console.log('🎉 CUR8 transaction hash received:', data.transactionHash);
            setTransactionHash(data.transactionHash);
            await loadUserData(); // Refresh data
            return;
          }
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Poll every 10 seconds
        } else {
          console.log('⏰ Polling timeout reached');
        }
      } catch (error) {
        console.error('Error polling for CUR8 transaction hash:', error);
      }
    };

    poll();
  };

  /**
   * Add CUR8 token to MetaMask (World Chain)
   */
  const addToMetaMask = async () => {
    try {
      const contractAddress = getContractAddress();
      const worldChainConfig = getWorldChainConfig();

      console.log('🦊 Adding CUR8 to wallet via World App...');

      // Check if we're in World App (MiniKit)
      if (MiniKit.isInstalled()) {
        // In World App, we can't directly add tokens to MetaMask
        // Instead, provide the user with the contract information
        console.log('🌍 In World App environment, providing token information');
        
        const tokenInfo = `🪙 CUR8 Token Information:
        
📍 Contract: ${contractAddress}
🏷️ Symbol: CUR8
🔢 Decimals: 18
🌐 Network: World Chain Sepolia (Testnet)
🔗 Explorer: https://worldchain-sepolia.blockscout.com/token/${contractAddress}

To add CUR8 to external wallets:
1. Open your external wallet (MetaMask, etc.)
2. Go to "Import Token" or "Add Token"
3. Use the contract address above
4. CUR8 will appear in your wallet

Note: World App automatically recognizes CUR8 transactions!`;

        return { 
          success: true, 
          message: tokenInfo
        };
      }

      // Fallback for external browsers with MetaMask
      if (typeof window !== 'undefined' && window.ethereum) {
        console.log('🦊 Adding CUR8 to MetaMask on World Chain...');

        // Switch to World Chain network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${worldChainConfig.chainId.toString(16)}` }],
          });
        } catch (switchError) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${worldChainConfig.chainId.toString(16)}`,
                chainName: worldChainConfig.name,
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [worldChainConfig.rpcUrl],
                blockExplorerUrls: [worldChainConfig.explorerUrl],
              }],
            });
          }
        }

        // Add CUR8 token
        await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: contractAddress,
              symbol: 'CUR8',
              decimals: 18,
              image: `${window.location.origin}/tokens/cur8-token.png`,
            },
          },
        });

        console.log('✅ CUR8 added to MetaMask!');
        return { success: true };
      }

      // No wallet available
      throw new Error('No compatible wallet found. Please use World App or install MetaMask.');

    } catch (error) {
      console.error('❌ Failed to add CUR8 to wallet:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Load user data (simplified for now, can be enhanced with actual contract calls)
   */
  const loadUserData = async () => {
    try {
      console.log('📊 Loading CUR8 user data...');
      
      // TODO: Implement actual contract reading
      // For now, return mock data
      setTokenInfo({
        currentSupply: 100000000, // 100M circulating
        maxSupply: 1000000000,    // 1B max
        remaining: 900000000,     // 900M remaining
        conversionRate: 100,      // 100 PP = 1 CUR8
        minProofPoints: 100,
        dailyLimit: 1000
      });

      setUserBalance(0); // Would read from contract
      
      setUserClaimInfo({
        isVerified: false,     // Would read from contract
        canClaimNow: true,     // Would check cooldown
        totalClaimed: 0,       // Would read from contract
        totalProofPointsSpent: 0,
        nextClaimTime: 0
      });

    } catch (error) {
      console.error('Error loading CUR8 user data:', error);
    }
  };

  /**
   * Calculate CUR8 tokens from proof points
   */
  const calculateTokensFromProofPoints = (proofPoints) => {
    if (!tokenInfo.conversionRate || proofPoints < tokenInfo.minProofPoints) return 0;
    return Math.floor(proofPoints / tokenInfo.conversionRate);
  };

  /**
   * Get transaction details for display
   */
  const getTransactionDetails = (txHash = transactionHash) => {
    if (!txHash) return null;

    const worldChainConfig = getWorldChainConfig();
    return {
      hash: txHash,
      explorerUrl: `${worldChainConfig.explorerUrl}/tx/${txHash}`,
      shortHash: `${txHash.slice(0, 6)}...${txHash.slice(-4)}`
    };
  };

  return {
    // State
    loading,
    error,
    userAddress,
    transactionId,
    transactionHash,
    tokenInfo,
    userBalance,
    userClaimInfo,
    
    // Functions
    claimCUR8Tokens, // 🔥 Main function using World Send Transaction
    addToMetaMask,
    loadUserData,
    calculateTokensFromProofPoints,
    getTransactionDetails,
  };
};