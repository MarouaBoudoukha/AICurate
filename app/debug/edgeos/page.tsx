"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EdgeOSDebugPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const router = useRouter();

  const runDebugTest = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/debug/edgeos-flow?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testEmailVerification = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/check-edgeos-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          userId: 'test-user-id',
          worldcoinId: 'test-worldcoin-id'
        })
      });
      
      const data = await response.json();
      setTestResult({
        status: response.status,
        ok: response.ok,
        data
      });
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const forceEdgeEsmeralda = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/debug/edgeos-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          userId: 'test-user-id',
          worldcoinId: 'test-worldcoin-id',
          forceEdgeEsmeralda: true
        })
      });
      
      const data = await response.json();
      setTestResult({
        status: response.status,
        ok: response.ok,
        data,
        action: 'force'
      });
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">EdgeOS Debug Tool</h1>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Test Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email to test"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={runDebugTest}
                disabled={!email || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Running...' : 'Run Debug Test'}
              </button>
              
              <button
                onClick={testEmailVerification}
                disabled={!email || loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Email Verification'}
              </button>
              
              <button
                onClick={forceEdgeEsmeralda}
                disabled={!email || loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Forcing...' : 'Force EdgeEsmeralda Status'}
              </button>
            </div>
          </div>
        </div>

        {debugInfo && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Debug Information</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}

        {testResult && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {testResult.action === 'force' ? 'Force Result' : 'Verification Test Result'}
            </h2>
            <div className="space-y-2 mb-4">
              <p><strong>Status:</strong> {testResult.status}</p>
              <p><strong>OK:</strong> {testResult.ok ? 'Yes' : 'No'}</p>
              {testResult.data?.isEdgeEsmeralda !== undefined && (
                <p><strong>Is EdgeEsmeralda:</strong> {testResult.data.isEdgeEsmeralda ? 'Yes' : 'No'}</p>
              )}
            </div>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Troubleshooting Steps</h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>Check if EDGEOS_API_KEY environment variable is set in Vercel</li>
            <li>Verify EdgeOS API is accessible from your deployment</li>
            <li>Test with a known EdgeEsmeralda email address</li>
            <li>Check database connectivity and user lookup logic</li>
            <li>Use Force EdgeEsmeralda button to bypass API for testing</li>
          </ol>
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push('/quiz')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            ← Back to Quiz
          </button>
        </div>
      </div>
    </div>
  );
} 