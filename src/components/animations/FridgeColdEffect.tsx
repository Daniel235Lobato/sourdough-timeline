import React from 'react';
import { Snowflake, Moon } from 'lucide-react';

export const FridgeColdEffect: React.FC<{ className?: string; hours?: number }> = ({ 
  className = '',
  hours = 14
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/10 via-blue-500/10 to-indigo-500/15 border border-sky-400/30 p-4 ${className}`}>
      <div className="flex items-center justify-between z-10 relative mb-2">
        <div className="flex items-center space-x-2">
          <Snowflake className="w-4 h-4 text-sky-500 animate-spin" style={{ animationDuration: '12s' }} />
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-800 dark:text-sky-300">
            Cold Retardation
          </span>
        </div>
        <div className="flex items-center space-x-1 text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/40 px-2 py-0.5 rounded-full">
          <Moon className="w-3 h-3 text-sky-600" />
          <span>{hours}h Sleep Period</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-sky-900/70 dark:text-sky-200/80 pt-1">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          <span>36°F – 39°F (2°C – 4°C)</span>
        </div>
        <span className="text-[11px] italic">Yeast sleeps • Lactic acid builds flavor</span>
      </div>
    </div>
  );
};
