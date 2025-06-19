import React from 'react';
import CUR8TokenClaim from '../components/CUR8TokenClaim';
import { Card } from '@/components/ui/card';

export default function ClaimCUR8Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🪙 Claim CUR8 on World Chain
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Convert Proof Points into CUR8 rewards • Gas-free via World Protocol
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
              ERC-20 Token
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
              World Chain
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Free Gas
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Claiming Interface */}
          <div className="lg:col-span-2">
            <CUR8TokenClaim />
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            {/* World Chain Benefits */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                🌍 World Chain Benefits
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">⛽</span>
                  <div>
                    <strong>Free Gas:</strong> All transactions covered by World Protocol
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500">🚀</span>
                  <div>
                    <strong>World Send Transaction:</strong> One-click claiming experience
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-purple-500">🔒</span>
                  <div>
                    <strong>World ID Verified:</strong> Sybil-resistant rewards
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-orange-500">⚡</span>
                  <div>
                    <strong>Same Network:</strong> Works with your EdgeEsmeralda badge
                  </div>
                </div>
              </div>
            </Card>

            {/* About CUR8 */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">🔥 About CUR8</h2>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>CUR8</strong> is the Phoenix Proof Token - the native reward 
                  of the AICURATE ecosystem on World Chain.
                </p>
                <p>
                  Every CUR8 token represents verified contribution to AI curation, 
                  not speculation.
                </p>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-orange-800 font-semibold">
                    &ldquo;The more you CUR8, the more AI gets human again&rdquo;
                  </p>
                </div>
              </div>
            </Card>

            {/* How to Earn */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">💎 How to Earn CUR8</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500">🔍</span>
                  <div>
                    <strong>Review AI Tools:</strong> Earn Proof Points for quality reviews
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-green-500">🧪</span>
                  <div>
                    <strong>Beta Testing:</strong> Test new AI tools and provide feedback
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-purple-500">🏆</span>
                  <div>
                    <strong>Challenges:</strong> Complete weekly AI discovery challenges
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-red-500">🎯</span>
                  <div>
                    <strong>Quality Curation:</strong> Help others discover great AI tools
                  </div>
                </div>
              </div>
            </Card>

            {/* Utility */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">🚀 CUR8 Utility</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span>Access premium AI tool features</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Participate in governance decisions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Unlock exclusive content and tools</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span>Trade on decentralized exchanges</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}