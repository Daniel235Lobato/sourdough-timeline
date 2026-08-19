import React from 'react';
import { Flame } from 'lucide-react';

export const OvenHeatGlow: React.FC<{ className?: string; temp?: string }> = ({ 
  className = '',
  temp = '475°F / 245°C'
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/15 via-red-500/10 to-amber-500/20 border border-orange-500/30 p-4 ${className}`}>
      <div className="flex items-center justify-between z-10 relative mb-2">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-800 dark:text-orange-300">
            Dutch Oven Radiant Heat
          </span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
          {temp}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-orange-900/80 dark:text-orange-200/90 pt-1">
        <span>Steam trapping phase for maximum oven spring & ear development</span>
      </div>
    </div>
  );
};
