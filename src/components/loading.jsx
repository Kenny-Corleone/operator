import React from 'react';

export function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center p-12">
            <div className="relative mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-premium-gold/30 border-t-premium-gold"></div>
                <div className="absolute inset-2 rounded-full border-4 border-premium-purple/30 border-t-premium-purple animate-spin animation-delay-75"></div>
                <div className="absolute inset-4 rounded-full border-4 border-premium-blue/30 border-t-premium-blue animate-spin animation-delay-150"></div>
            </div>
            <p className="text-premium-text font-semibold text-lg animate-pulse">Loading...</p>
            <div className="mt-4 flex gap-1">
                <div className="w-2 h-2 bg-premium-gold rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-premium-purple rounded-full animate-bounce animation-delay-100"></div>
                <div className="w-2 h-2 bg-premium-blue rounded-full animate-bounce animation-delay-200"></div>
            </div>
        </div>
    );
}

export function ErrorMessage({ message }) {
    return (
        <div className="premium-card bg-red-500/10 border-red-500/20 p-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-premium">
                    <span className="text-xl">⚠️</span>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-red-400 mb-1">Error</h3>
                    <p className="text-premium-text font-medium">{message}</p>
                </div>
            </div>
        </div>
    );
}

export function LoadingWrapper({ loading, error, children }) {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error.message || 'An error occurred'} />;
    return children;
}