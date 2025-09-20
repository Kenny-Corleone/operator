import React from 'react';
import { User, Briefcase } from 'lucide-react';

const RoleSelectionScreen = ({ onSelectRole }) => {
    return (
        <div className="flex items-center justify-center min-h-screen premium-bg">
            <div className="text-center p-12 glass-card max-w-md w-full mx-4 fade-in">
                <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-premium-gold to-premium-gold-light flex items-center justify-center shadow-premium animate-bounce-subtle">
                    <span className="text-3xl font-bold text-premium-dark">TB</span>
                </div>
                <h1 className="text-4xl font-bold text-premium-text mb-4 font-display tracking-tight">Welcome</h1>
                <p className="text-premium-text-secondary mb-10 text-lg font-medium">Please select your role to continue</p>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => onSelectRole('operator')}
                        className="premium-button flex items-center justify-center gap-3 text-lg font-semibold w-full group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:animate-pulse">
                            <User size={20} />
                        </div>
                        <span>Operator</span>
                    </button>
                    <button
                        onClick={() => onSelectRole('management')}
                        className="premium-button flex items-center justify-center gap-3 text-lg font-semibold w-full group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:animate-pulse">
                            <Briefcase size={20} />
                        </div>
                        <span>Manager</span>
                    </button>
                </div>
                <div className="mt-8 text-sm text-premium-text-secondary">
                    The Bay Services • Premium Dashboard
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionScreen;