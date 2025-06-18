import { useState } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import { createPublicClient, http } from 'viem';
import { worldchain, worldchainSepolia } from 'viem/chains';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';

// Import ABI
import EdgeEsmeraldaABI from '../abi/EdgeEsmeraldaBadge.json';

// Get contract address based on environment
const getContractAddress = () => {
  // For now, using the deployed testnet address
  // In production, you would use environment variables
  return '0xE058B6D762346586d1d1315dFED4029d17b0160D'; // WorldChain Sepolia
};

// Get chain configuration
const getChain = () => {
  return process.env.NODE_ENV === 'production' ? worldchain : worldchainSepolia;
};

export const useEdgeEsmeralda = () => {
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState(null);

  // Create viem client for transaction confirmation
  const client = createPublicClient({
    chain: getChain(),
    transport: http(process.env.NEXT_PUBLIC_RPC_URL),
  });

  // Hook to wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    client,
    appConfig: {
      app_id: process.env.NEXT_PUBLIC_WORLD_APP_ID,
    },
    transactionId,
  });

  /**
   * Mint EdgeEsmeralda badge using World Send Transaction
   */
  const mintEdgeEsmeralda = async (userAddress, nullifierHash) => {
    if (!MiniKit.isInstalled()) {
      throw new Error('World App required');
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Sending EdgeEsmeralda mint transaction...');
      
      const { commandPayload, finalPayload } = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: getContractAddress(),
            abi: EdgeEsmeraldaABI.abi,
            functionName: 'mintEdgeEsmeralda',
            args: [userAddress, nullifierHash],
          },
        ],
      });

      console.log('📤 Transaction sent:', { commandPayload, finalPayload });

      if (finalPayload.status === 'error') {
        throw new Error(finalPayload.error || 'Transaction failed');
      }

      // Set transaction ID for confirmation tracking
      setTransactionId(finalPayload.transaction_id);
      
      return {
        success: true,
        transactionId: finalPayload.transaction_id,
      };

    } catch (error) {
      console.error('❌ Mint transaction failed:', error);
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
   * Get badge information from contract
   */
  const getBadgeInfo = async () => {
    try {
      // This is a read-only call, we can use viem directly
      const data = await client.readContract({
        address: getContractAddress(),
        abi: EdgeEsmeraldaABI.abi,
        functionName: 'getBadgeInfo',
      });

      return {
        currentSupply: Number(data[0]),
        maxSupply: Number(data[1]),
        remaining: Number(data[2]),
      };
    } catch (error) {
      console.error('Error getting badge info:', error);
      return null;
    }
  };

  /**
   * Check if user can mint
   */
  const canMint = async (userAddress) => {
    try {
      const result = await client.readContract({
        address: getContractAddress(),
        abi: EdgeEsmeraldaABI.abi,
        functionName: 'canMint',
        args: [userAddress],
      });

      return result;
    } catch (error) {
      console.error('Error checking mint eligibility:', error);
      return false;
    }
  };

  /**
   * Check if user has already minted
   */
  const hasMinted = async (userAddress) => {
    try {
      const result = await client.readContract({
        address: getContractAddress(),
        abi: EdgeEsmeraldaABI.abi,
        functionName: 'hasMinted',
        args: [userAddress],
      });

      return result;
    } catch (error) {
      console.error('Error checking mint status:', error);
      return false;
    }
  };

  return {
    // State
    loading,
    isConfirming,
    isConfirmed,
    transactionId,
    error,
    
    // Functions
    mintEdgeEsmeralda,
    getBadgeInfo,
    canMint,
    hasMinted,
  };
};
