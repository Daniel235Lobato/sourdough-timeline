import React from 'react';
import { Snowflake, Moon } from 'lucide-react';

export const FridgeColdEffect: React.FC<{ className?: string; hours?: number }> = ({ 
  className = '',
  hours = 14
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#D1C1A8] border border-[#AD9677] p-4 text-[#836A4D] ${className}`}>
      <div className="flex items-center justify-between z-10 relative mb-2">
        <div className="flex items-center space-x-2">
          <Snowflake className="w-4 h-4 text-[#986A4C] animate-spin" style={{ animationDuration: '12s' }} />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#836A4D]">
            Cold Retardation
          </span>
        </div>
        <div className="flex items-center space-x-1 text-xs font-semibold text-[#836A4D] bg-[#E7CEB5] border border-[#AD9677] px-2 py-0.5 rounded-full">
          <Moon className="w-3 h-3 text-[#986A4C]" />
          <span>{hours}h Sleep Period</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#836A4D]/80 pt-1">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-[#986A4C] animate-ping" />
          <span>36°F – 39°F (2°C – 4°C)</span>
        </div>
        <span className="text-[11px] italic text-[#986A4C]">Yeast sleeps • Lactic acid builds flavor</span>
      </div>
    </div>
  );
};
