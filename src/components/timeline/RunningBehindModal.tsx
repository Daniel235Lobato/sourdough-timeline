import React, { useState } from 'react';
import { X, Clock, AlertCircle, Sparkles, Snowflake, ArrowRight, Check } from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';

interface RunningBehindModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DelayReason = 'starter_late' | 'bulk_late' | 'started_late' | 'bake_later' | 'bake_sooner';

export const RunningBehindModal: React.FC<RunningBehindModalProps> = ({ isOpen, onClose }) => {
  const { adjustRunningBehind, activeSession } = useSourdough();
  const [selectedReason, setSelectedReason] = useState<DelayReason>('starter_late');
  const [customMinutes, setCustomMinutes] = useState<number>(45);

  if (!isOpen || !activeSession) return null;

  const reasons: { id: DelayReason; title: string; subtitle: string; defaultMinutes: number; explanation: string }[] = [
    {
      id: 'starter_late',
      title: '🌱 Starter isn\'t peaked yet',
      subtitle: 'Needs more time to double and dome',
      defaultMinutes: 60,
      explanation: 'Extends starter fermentation. Pushes all downstream mix and baking steps forward.'
    },
    {
      id: 'bulk_late',
      title: '🌡️ Bulk fermentation isn\'t ready',
      subtitle: 'Dough has not reached 50–75% rise',
      defaultMinutes: 60,
      explanation: 'Adds extra bulk fermentation time so gluten and flavor develop properly before shaping.'
    },
    {
      id: 'started_late',
      title: '⏱️ I started late / fell behind',
      subtitle: 'Shift current step start time to right now',
      defaultMinutes: 0,
      explanation: 'Aligns the current step timestamp with actual real-world clock time right now.'
    },
    {
      id: 'bake_later',
      title: '❄️ I need to bake later',
      subtitle: 'Extend refrigerator cold sleep safely',
      defaultMinutes: 240, // 4 hours
      explanation: 'Extends the cold retard window. Cold temperature pauses yeast while enhancing crust blisters and flavor (safe up to 48h).'
    },
    {
      id: 'bake_sooner',
      title: '🔥 I need to bake sooner',
      subtitle: 'Shorten refrigerator cold retard',
      defaultMinutes: 120, // 2 hours
      explanation: 'Shortens the refrigerator sleep down to the 12-hour minimum required for clean scoring and structural integrity.'
    }
  ];

  const currentOption = reasons.find(r => r.id === selectedReason)!;

  const handleApply = () => {
    adjustRunningBehind(selectedReason, customMinutes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                I'm Running Behind
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Intelligent biological rescheduling
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reason Selector */}
        <div className="mt-4 space-y-2.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
            What's happening?
          </label>

          {reasons.map((r) => {
            const isSelected = selectedReason === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSelectedReason(r.id);
                  setCustomMinutes(r.defaultMinutes);
                }}
                className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-600 dark:text-stone-300'
                }`}
              >
                <div>
                  <div className="font-medium text-sm font-serif">{r.title}</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{r.subtitle}</div>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Time adjustment slider for this reason */}
        {selectedReason !== 'started_late' && (
          <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                Adjustment Duration:
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-amber-700 dark:text-amber-400">
                {customMinutes >= 60 ? `+${customMinutes / 60}h` : `+${customMinutes}m`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[30, 45, 60, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setCustomMinutes(mins)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    customMinutes === mins
                      ? 'border-amber-500 bg-amber-500 text-white'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  {mins >= 60 ? `${mins / 60}h` : `${mins}m`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Biological Safety Explanation */}
        <div className="mt-4 p-3 rounded-2xl bg-amber-50/60 dark:bg-stone-800/60 border border-amber-200/60 dark:border-stone-700 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            {currentOption.explanation}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <button
            onClick={handleApply}
            className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold shadow-lg shadow-amber-600/20 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98]"
          >
            <span>RECALCULATE SCHEDULE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
