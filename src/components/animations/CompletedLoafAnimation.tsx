import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export const CompletedLoafAnimation: React.FC<{ className?: string }> = ({ className = '' }) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ce7449', '#f3d9c7', '#10b981', '#fbbf24', '#b45309']
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center py-6 text-center ${className}`}>
      {/* Golden halo effect */}
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl animate-pulse" />
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 p-1 shadow-xl relative animate-float flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-amber-50 dark:bg-stone-900 flex items-center justify-center text-5xl">
            🍞
          </div>
        </div>
      </div>
      <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
        Artisan Loaf Complete
      </h3>
      <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xs mt-1">
        Crispy blistered crust, caramelized ear, and open tender crumb. You are an artisan baker!
      </p>
    </div>
  );
};
