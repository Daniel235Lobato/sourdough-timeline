import React from 'react';
import { Flame } from 'lucide-react';

export const OvenHeatGlow: React.FC<{ className?: string; temp?: string }> = ({ 
  className = '',
  temp = '475°F / 245°C'
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#D1C1A8] border border-[#AD9677] p-4 text-[#836A4D] ${className}`}>
      <div className="flex items-center justify-between z-10 relative mb-2">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-[#986A4C] animate-bounce" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#836A4D]">
            Dutch Oven Radiant Heat
          </span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E7CEB5] text-[#836A4D] border border-[#AD9677]">
          {temp}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-[#836A4D]/80 pt-1">
        <span>Steam trapping phase for maximum oven spring & ear development</span>
      </div>
    </div>
  );
};
