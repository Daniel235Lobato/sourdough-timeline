import React from 'react';

export const DoughExpanding: React.FC<{ className?: string; targetRise?: string }> = ({ 
  className = '',
  targetRise = '50–75% rise'
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-[#D1C1A8] border border-[#AD9677] p-4 text-[#836A4D] ${className}`}>
      <div className="flex items-center justify-between z-10 relative mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#986A4C] animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#836A4D]">
            Bulk Fermentation
          </span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E7CEB5] text-[#836A4D] border border-[#AD9677]">
          Target: {targetRise}
        </span>
      </div>

      <div className="relative h-20 flex items-end justify-center">
        {/* Container outline */}
        <div className="w-48 h-16 border-b-2 border-x-2 border-[#AD9677] rounded-b-xl relative overflow-hidden flex items-end justify-center pb-1">
          {/* Target volume line */}
          <div className="absolute top-2 w-full border-t border-dashed border-[#AD9677] flex justify-between px-2 text-[9px] font-mono text-[#836A4D]">
            <span>Peak Target</span>
            <span>+75%</span>
          </div>

          {/* Animated doming dough mass */}
          <div className="w-40 bg-gradient-to-t from-[#AD9677] to-[#E7CEB5] rounded-t-full shadow-inner border-t border-[#836A4D] animate-pulse-subtle transition-all duration-1000 flex items-center justify-center h-12">
            <span className="text-xs font-semibold text-[#836A4D]">
              Aerating Dough
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
