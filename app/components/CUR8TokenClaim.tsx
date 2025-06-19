'use client';

import React, { useState, useEffect } from 'react';
import { IDKitWidget, VerificationLevel } from '@worldcoin/idkit';
import { MiniKit } from '@worldcoin/minikit-js';
import { useCUR8Token } from '../../hooks/useCUR8Token';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const CUR8TokenClaim = () => {
  const {
    loading,
    error,
    userAddress,
    transactionId,
    transactionHash,
    tokenInfo,
    userBalance,
    userClaimInfo,
    claimCUR8Tokens,
    addToMetaMask,
    loadUserData,
    calculateTokensFromProofPoints,
    getTransactionDetails,
  } = useCUR8Token();

  const [claimAmount, setClaimAmount] = useState('100');
  const [claimStatus, setClaimStatus] = useState<'idle' | 'verifying' | 'claiming' | 'confirming' | 'success' | 'error'>('idle');
  const [showConfetti, setShowConfetti] = useState(false);

  // Handle transaction confirmation
  useEffect(() => {
    if (transactionHash) {
      setClaimStatus('success');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else if (transactionId && !transactionHash) {
      setClaimStatus('confirming');
    }
  }, [transactionHash, transactionId]);

  // Load data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const handleWorldIdVerification = async (proof: any) => {
    try {
      setClaimStatus('verifying');
      console.log('🔍 Verifying World ID for CUR8 claim...');

      const proofPointsAmount = parseInt(claimAmount);
      if (proofPointsAmount < 100) {
        throw new Error('Minimum 100 proof points required');
      }

      console.log('🪙 Claiming CUR8 tokens on World Chain...');
      setClaimStatus('claiming');

      // 🚀 THIS CALLS THE WORLD SEND TRANSACTION FOR CUR8! 🚀
      const claimResult = await claimCUR8Tokens(proofPointsAmount, proof);

      if (claimResult.success) {
        console.log('🎉 CUR8 claim transaction initiated successfully!');
        // Status will be updated when transaction hash is received
      } else {
        throw new Error(claimResult.error);
      }

    } catch (error) {
      console.error('❌ CUR8 claim failed:', error);
      setClaimStatus('error');
    }
  };

  const handleAddToMetaMask = async () => {
    try {
      const result = await addToMetaMask();
      if (result.success) {
        if (result.message) {
          // Show custom message for World App users in a formatted way
          const formattedMessage = result.message.replace(/\n/g, '\n');
          
          // For World App, show in a better format
          if (MiniKit.isInstalled()) {
            // Create a temporary div to show the token info nicely
            const tokenInfoDiv = document.createElement('div');
            tokenInfoDiv.style.cssText = `
              position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
              background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              z-index: 10000; max-width: 90%; white-space: pre-line; font-family: monospace;
              border: 2px solid #4F46E5;
            `;
            tokenInfoDiv.innerHTML = `
              <div style="text-align: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #4F46E5;">🪙 CUR8 Token Info</h3>
              </div>
              <div style="text-align: left; line-height: 1.5;">
                ${result.message.replace(/\n/g, '<br>')}
              </div>
              <div style="text-align: center; margin-top: 15px;">
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #4F46E5; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">
                  Got it!
                </button>
              </div>
            `;
            document.body.appendChild(tokenInfoDiv);
            
            // Auto-remove after 10 seconds
            setTimeout(() => {
              if (document.body.contains(tokenInfoDiv)) {
                document.body.removeChild(tokenInfoDiv);
              }
            }, 10000);
          } else {
            alert(result.message);
          }
        } else {
          alert("🪙 CUR8 token added to MetaMask successfully!");
        }
      } else {
        alert(`❌ Failed to add to wallet: ${result.error}`);
      }
    } catch (error: any) {
      alert(`💥 Error: ${error.message}`);
    }
  };

  const tokensToReceive = calculateTokensFromProofPoints(parseInt(claimAmount) || 0);
  const nextClaimDate = userClaimInfo.nextClaimTime ? new Date(userClaimInfo.nextClaimTime) : null;

  // Check if running in World App
  if (!MiniKit.isInstalled()) {
    return (
      <Card className="flex flex-col items-center p-8 bg-red-50 shadow-lg max-w-md mx-auto">
        <div className="text-6xl mb-4">🌍</div>
        <h2 className="text-xl font-bold text-red-700 mb-4">World App Required</h2>
        <p className="text-red-600 text-center">
          Please open this page in the World App to claim your CUR8 tokens.
        </p>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              {['🪙', '💰', '🎉', '✨', '🌍'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* User Balance Card */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="text-4xl mb-2">🪙</div>
          <h2 className="text-2xl font-bold text-orange-800 mb-2">Your CUR8 Balance</h2>
          <p className="text-3xl font-bold text-orange-600">{userBalance} CUR8</p>
          <p className="text-sm text-gray-600 mt-2">
            Total Claimed: {userClaimInfo.totalClaimed} CUR8
          </p>
          <p className="text-xs text-gray-500 mt-1">
            On World Chain • Free Gas via World Protocol
          </p>
        </div>
      </Card>

      {/* Token Info */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">📊 Token Economics</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">World Chain</Badge>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Conversion Rate:</span>
            <span className="font-semibold">{tokenInfo.conversionRate} PP = 1 CUR8</span>
          </div>
          <div className="flex justify-between">
            <span>Daily Limit:</span>
            <span>{tokenInfo.dailyLimit.toLocaleString()} CUR8</span>
          </div>
          <div className="flex justify-between">
            <span>Gas Fees:</span>
            <span className="font-semibold text-green-600">FREE! 🌍</span>
          </div>
          <div className="flex justify-between">
            <span>Circulating Supply:</span>
            <span>{Number(tokenInfo.currentSupply).toLocaleString()} CUR8</span>
          </div>
        </div>
      </Card>

      {/* Claiming Interface */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-center">
          🌍 Claim CUR8 on World Chain
        </h2>
        
        {/* Status Messages */}
        {claimStatus === 'verifying' && (
          <Badge variant="secondary" className="mb-4 w-full justify-center bg-blue-100 text-blue-800">
            🔍 Verifying World ID...
          </Badge>
        )}

        {claimStatus === 'claiming' && (
          <Badge variant="secondary" className="mb-4 w-full justify-center bg-yellow-100 text-yellow-800">
            🚀 Sending World transaction...
          </Badge>
        )}

        {claimStatus === 'confirming' && (
          <Badge variant="secondary" className="mb-4 w-full justify-center bg-purple-100 text-purple-800">
            ⏳ Confirming on World Chain...
          </Badge>
        )}

        {claimStatus === 'success' && (
          <Badge variant="default" className="mb-4 w-full justify-center bg-green-500">
            🎉 CUR8 tokens claimed successfully!
          </Badge>
        )}

        {claimStatus === 'error' && (
          <Badge variant="destructive" className="mb-4 w-full justify-center">
            ❌ Claim failed
          </Badge>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Claim Form */}
        {userClaimInfo.canClaimNow ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Proof Points to Convert
              </label>
              <Input
                type="number"
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
                min="100"
                step="100"
                placeholder="Enter proof points (min 100)"
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>You&apos;ll receive: {tokensToReceive} CUR8</span>
                <span>⛽ Gas: FREE!</span>
              </div>
            </div>

            <IDKitWidget
              app_id={process.env.NEXT_PUBLIC_WORLD_ID_APP_ID!}
              action={process.env.NEXT_PUBLIC_WORLD_ID_ACTION_ID!}
              verification_level={VerificationLevel.Orb}
              handleVerify={handleWorldIdVerification}
              onError={(error: any) => {
                console.error('World ID error:', error);
                setClaimStatus('error');
              }}
            >
              {({ open }: { open: () => void }) => (
                <Button
                  onClick={open}
                  disabled={loading || ['verifying', 'claiming', 'confirming'].includes(claimStatus) || tokensToReceive === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3"
                >
                  {['verifying', 'claiming', 'confirming'].includes(claimStatus) ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      {claimStatus === 'verifying' ? 'Verifying...' : 
                       claimStatus === 'claiming' ? 'Claiming...' : 'Confirming...'}
                    </div>
                  ) : (
                    `🌍 Verify & Claim ${tokensToReceive} CUR8`
                  )}
                </Button>
              )}
            </IDKitWidget>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              {userClaimInfo.isVerified 
                ? '⏰ Claim cooldown active (24 hours)' 
                : '🌍 World ID verification required'
              }
            </p>
            {nextClaimDate && (
              <p className="text-sm text-gray-500">
                Next claim: {nextClaimDate.toLocaleString()}
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToMetaMask}
          variant="outline"
          className="w-full"
        >
          🦊 Add CUR8 to MetaMask
        </Button>

        {transactionHash && (
          <Button
            onClick={() => {
              const txDetails = getTransactionDetails();
              if (txDetails) window.open(txDetails.explorerUrl, '_blank');
            }}
            variant="outline"
            className="w-full"
          >
            🔍 View on World Chain Explorer
          </Button>
        )}

        <Button
          onClick={() => window.history.back()}
          variant="outline"
          className="w-full"
        >
          ← Back to AICURATE
        </Button>
      </div>

      {/* Info Footer */}
      <div className="text-xs text-gray-500 text-center space-y-1">
        <p>• 🌍 Powered by World Chain & World Send Transaction</p>
        <p>• ⛽ FREE gas fees covered by World Protocol</p>
        <p>• 🔒 World ID verification required</p>
        <p>• ⏰ 24-hour cooldown between claims</p>
      </div>
    </div>
  );
};

export default CUR8TokenClaim;