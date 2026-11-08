import React from 'react';
import { Wind } from 'lucide-react';

export const SteamEffect: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#D1C1A8] border border-[#AD9677] p-4 text-[#836A4D] ${className}`}>
      <div className="flex items-center justify-between z-10 relative mb-2">
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-[#986A4C] animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#836A4D]">
            Crumb Stabilization & Cooling
          </span>
        </div>
        <span className="text-xs font-semibold text-[#836A4D] bg-[#E7CEB5] px-2 py-0.5 rounded-full border border-[#AD9677]">
          Listen to the crust "sing"
        </span>
      </div>

      <div className="text-xs text-[#836A4D]/80">
        Internal steam finishes cooking the gelatinized starches. Avoid cutting until fully cooled!
      </div>
    </div>
  );
};
