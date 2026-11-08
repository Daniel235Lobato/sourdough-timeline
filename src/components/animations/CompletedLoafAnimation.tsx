import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export const CompletedLoafAnimation: React.FC<{ className?: string }> = ({ className = '' }) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E7CEB5', '#D1C1A8', '#AD9677', '#836A4D', '#986A4C']
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center py-6 text-center text-[#836A4D] ${className}`}>
      {/* Golden halo effect */}
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-[#AD9677]/20 rounded-full blur-2xl animate-pulse" />
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#836A4D] via-[#986A4C] to-[#D1C1A8] p-1 shadow-md relative animate-float flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#E7CEB5] flex items-center justify-center text-5xl">
            🍞
          </div>
        </div>
      </div>
      <h3 className="font-serif text-2xl font-bold text-[#836A4D]">
        Artisan Loaf Complete
      </h3>
      <p className="text-sm text-[#836A4D]/80 max-w-xs mt-1">
        Crispy blistered crust, caramelized ear, and open tender crumb. You are an artisan baker!
      </p>
    </div>
  );
};
