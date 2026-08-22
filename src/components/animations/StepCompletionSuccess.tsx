import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

interface StepCompletionSuccessProps {
  stepName: string;
  nextStepName?: string;
  onFinished: () => void;
}

export const StepCompletionSuccess: React.FC<StepCompletionSuccessProps> = ({
  stepName,
  nextStepName,
  onFinished
}) => {
  const [stage, setStage] = useState<'drawing' | 'settled' | 'exiting'>('drawing');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('settled'), 400);
    const t2 = setTimeout(() => setStage('exiting'), 1200);
    const t3 = setTimeout(() => onFinished(), 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinished]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-xs transition-opacity duration-300 ${
      stage === 'exiting' ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      <div 
        className={`bg-white dark:bg-[#181614] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center max-w-xs mx-4 transition-all duration-300 ${
          stage === 'drawing' 
            ? 'scale-95 opacity-80' 
            : stage === 'settled' 
              ? 'scale-100 opacity-100' 
              : 'scale-95 opacity-0 translate-y-2'
        }`}
      >
        {/* Animated Checkmark Circle */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-3.5 animate-bounce-subtle">
          <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline 
              points="20 6 9 17 4 12" 
              className="path-draw"
              style={{
                strokeDasharray: 50,
                strokeDashoffset: stage === 'drawing' ? 50 : 0,
                transition: 'stroke-dashoffset 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          </svg>
        </div>

        <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
          {stepName} Complete
        </h3>

        {nextStepName && (
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-medium">
            Up Next: <span className="text-amber-700 dark:text-amber-400 font-bold">{nextStepName}</span>
          </p>
        )}
      </div>
    </div>
  );
};
