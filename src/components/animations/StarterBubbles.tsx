import React from 'react';

export const StarterBubbles: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-500/10 to-emerald-500/20 border border-emerald-500/20 p-4 ${className}`}>
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            Active Fermentation
          </span>
        </div>
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
          Yeasts Multiplying
        </span>
      </div>

      {/* Bubble particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-1 left-[15%] w-3 h-3 rounded-full bg-emerald-400/40 animate-bubble" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute bottom-2 left-[35%] w-4 h-4 rounded-full bg-emerald-400/30 animate-bubble" style={{ animationDelay: '1.2s', animationDuration: '4.2s' }} />
        <div className="absolute bottom-0 left-[60%] w-2 h-2 rounded-full bg-emerald-400/50 animate-bubble" style={{ animationDelay: '0.6s', animationDuration: '2.8s' }} />
        <div className="absolute bottom-3 left-[80%] w-3.5 h-3.5 rounded-full bg-emerald-400/35 animate-bubble" style={{ animationDelay: '1.8s', animationDuration: '3.6s' }} />
        <div className="absolute bottom-1 left-[48%] w-5 h-5 rounded-full bg-emerald-400/25 animate-bubble" style={{ animationDelay: '2.3s', animationDuration: '4.8s' }} />
      </div>
    </div>
  );
};
