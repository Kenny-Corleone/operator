import React from 'react';

const AppLayout = ({ role, onSwitchRole, children, activeTab, setActiveTab, tabs }) => (
    <div className="max-w-7xl mx-auto glass-card fade-in">
        <header className="p-8 border-b border-white/10 bg-gradient-to-r from-premium-blue via-premium-purple to-premium-blue-light rounded-t-2xl flex items-center justify-between text-premium-text relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-premium-gold/10 to-transparent animate-gradient-shift"></div>
            <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-premium-gold to-premium-gold-light flex items-center justify-center shadow-premium">
                    <span className="text-2xl font-bold text-premium-dark">TB</span>
                </div>
                <div>
                    <h1 className="text-4xl font-bold font-display tracking-tight">The Bay Services</h1>
                    <p className="text-lg opacity-90 font-medium">Premium Dashboard</p>
                </div>
            </div>
            <button
                onClick={() => onSwitchRole(null)}
                className="premium-button relative z-10 flex items-center gap-3 text-sm font-semibold"
            >
                <span>🔄</span>
                Switch Role ({role})
            </button>
        </header>
        <nav className="p-6 border-b border-white/10 bg-premium-surface/50 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-3">
                {Object.entries(tabs).map(([key, title]) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden ${
                            activeTab === key
                                ? 'bg-gradient-to-r from-premium-purple to-premium-blue text-white shadow-premium glow-effect'
                                : 'text-premium-text-secondary hover:text-premium-text hover:bg-white/10 backdrop-blur-sm border border-white/10'
                        }`}
                    >
                        {activeTab === key && (
                            <div className="absolute inset-0 bg-gradient-to-r from-premium-gold/20 to-transparent animate-pulse"></div>
                        )}
                        <span className="relative z-10">{title}</span>
                    </button>
                ))}
            </div>
        </nav>
        <main className="p-8 bg-premium-surface/30 backdrop-blur-sm min-h-screen rounded-b-2xl">{children}</main>
    </div>
);

export default AppLayout;