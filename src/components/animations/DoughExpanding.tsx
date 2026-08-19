import React from 'react';

export const DoughExpanding: React.FC<{ className?: string; targetRise?: string }> = ({ 
  className = '',
  targetRise = '50–75% rise'
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-b from-amber-500/10 to-orange-500/15 border border-amber-500/25 p-4 ${className}`}>
      <div className="flex items-center justify-between z-10 relative mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            Bulk Fermentation
          </span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          Target: {targetRise}
        </span>
      </div>

      <div className="relative h-20 flex items-end justify-center">
        {/* Container outline */}
        <div className="w-48 h-16 border-b-2 border-x-2 border-stone-400/40 dark:border-stone-600/40 rounded-b-xl relative overflow-hidden flex items-end justify-center pb-1">
          {/* Target volume line */}
          <div className="absolute top-2 w-full border-t border-dashed border-amber-500/60 flex justify-between px-2 text-[9px] font-mono text-amber-600 dark:text-amber-400">
            <span>Peak Target</span>
            <span>+75%</span>
          </div>

          {/* Animated doming dough mass */}
          <div className="w-40 bg-gradient-to-t from-amber-200 to-amber-100 dark:from-amber-800/80 dark:to-amber-600/80 rounded-t-full shadow-inner border-t border-amber-300 dark:border-amber-500/40 animate-pulse-subtle transition-all duration-1000 flex items-center justify-center h-12">
            <span className="text-xs font-medium text-amber-900/80 dark:text-amber-100">
              Aerating Dough
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
