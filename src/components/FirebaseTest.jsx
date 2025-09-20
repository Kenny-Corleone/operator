import React, { useState, useEffect } from 'react';
import { useAuth, useAutoAnswers, useServicesPrices } from '../hooks/firebase.hooks';
import { runFirebaseTests } from '../utils/firebase.test';

/**
 * Firebase Test Component
 * 
 * This component tests Firebase functionality and displays results
 * for development and debugging purposes.
 */
export default function FirebaseTest() {
    const [testResults, setTestResults] = useState(null);
    const [isRunningTests, setIsRunningTests] = useState(false);
    
    // Test Firebase hooks
    const { user, loading: authLoading, error: authError } = useAuth();
    const { data: autoAnswers, loading: answersLoading, error: answersError } = useAutoAnswers();
    const { data: servicesPrices, loading: pricesLoading, error: pricesError } = useServicesPrices();

    const runTests = async () => {
        setIsRunningTests(true);
        try {
            const results = await runFirebaseTests();
            setTestResults(results);
        } catch (error) {
            console.error('Test execution failed:', error);
            setTestResults({ error: error.message });
        } finally {
            setIsRunningTests(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Firebase Configuration Test</h1>
            
            <div className="mb-6">
                <button 
                    onClick={runTests}
                    disabled={isRunningTests}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {isRunningTests ? 'Running Tests...' : 'Run Firebase Tests'}
                </button>
            </div>

            {/* Test Results */}
            {testResults && (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Test Results</h2>
                    {testResults.error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <p className="font-bold">Test Failed</p>
                            <p>{testResults.error}</p>
                        </div>
                    ) : (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            <p className="font-bold">Tests Completed</p>
                            <p>Connection: {testResults.connectionTest ? '✅ PASSED' : '❌ FAILED'}</p>
                            <p>Collections: {testResults.allTestsPassed ? '✅ PASSED' : '❌ FAILED'}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Authentication Status */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Authentication Status</h2>
                {authLoading ? (
                    <p>Loading authentication...</p>
                ) : authError ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p className="font-bold">Authentication Error</p>
                        <p>{authError.message}</p>
                    </div>
                ) : user ? (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        <p className="font-bold">User Authenticated</p>
                        <p>Email: {user.email}</p>
                        <p>UID: {user.uid}</p>
                    </div>
                ) : (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                        <p className="font-bold">Not Authenticated</p>
                        <p>No user currently signed in</p>
                    </div>
                )}
            </div>

            {/* Data Loading Status */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Data Loading Status</h2>
                
                <div className="mb-4">
                    <h3 className="font-medium mb-2">Auto Answers</h3>
                    {answersLoading ? (
                        <p>Loading...</p>
                    ) : answersError ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <p className="font-bold">Error</p>
                            <p>{answersError.message}</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-green-600">✅ Loaded {autoAnswers.length} records</p>
                            {autoAnswers.length > 0 && (
                                <p className="text-sm text-gray-600 mt-1">
                                    First record: {JSON.stringify(autoAnswers[0]).substring(0, 100)}...
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="font-medium mb-2">Services Prices</h3>
                    {pricesLoading ? (
                        <p>Loading...</p>
                    ) : pricesError ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <p className="font-bold">Error</p>
                            <p>{pricesError.message}</p>
                        </div>
                    ) : (
                        <div>
                            <p className="text-green-600">✅ Loaded {servicesPrices.length} records</p>
                            {servicesPrices.length > 0 && (
                                <p className="text-sm text-gray-600 mt-1">
                                    First record: {JSON.stringify(servicesPrices[0]).substring(0, 100)}...
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Configuration Info */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Configuration Info</h2>
                <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded">
                    <p className="font-bold">Firebase Status</p>
                    <p>✅ Firebase library loaded</p>
                    <p>✅ Configuration module imported</p>
                    <p>✅ React hooks implemented</p>
                    <p>✅ Error handling in place</p>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
                <h3 className="font-bold mb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-1">
                    <li>Click "Run Firebase Tests" to test connection</li>
                    <li>Ensure .env.local is configured with Firebase credentials</li>
                    <li>Check browser console for detailed error messages</li>
                    <li>Verify Firebase project has Firestore database enabled</li>
                </ol>
            </div>
        </div>
    );
}