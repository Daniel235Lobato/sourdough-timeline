import React from 'react';
import { Wind } from 'lucide-react';

export const SteamEffect: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-500/10 via-amber-500/5 to-stone-500/15 border border-stone-300 dark:border-stone-700 p-4 ${className}`}>
      <div className="flex items-center justify-between z-10 relative mb-2">
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-stone-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Crumb Stabilization & Cooling
          </span>
        </div>
        <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
          Listen to the crust "sing"
        </span>
      </div>

      <div className="text-xs text-stone-600 dark:text-stone-400">
        Internal steam finishes cooking the gelatinized starches. Avoid cutting until fully cooled!
      </div>
    </div>
  );
};
