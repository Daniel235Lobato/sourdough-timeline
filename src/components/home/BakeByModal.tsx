import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, ArrowRight, Snowflake, Sparkles, AlertCircle } from 'lucide-react';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { useSourdough } from '../../context/SourdoughContext';
import { calculateReverseSchedule } from '../../engine/scheduler';

interface BakeByModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimelineBuilt: () => void;
}

export const BakeByModal: React.FC<BakeByModalProps> = ({
  isOpen,
  onClose,
  onTimelineBuilt
}) => {
  const { selectedRecipe, startNewBake } = useSourdough();

  // Default to 2 days ahead at 10:00 AM (e.g., Saturday 10 AM)
  const defaultTarget = addDays(new Date(), 2);
  const [selectedDateStr, setSelectedDateStr] = useState<string>(format(defaultTarget, 'yyyy-MM-dd'));
  const [selectedTimeStr, setSelectedTimeStr] = useState<string>('10:00');
  const [coldRetardHours, setColdRetardHours] = useState<number>(selectedRecipe.defaultRetardHours || 14);

  // Compute live reverse schedule
  const reverseCalculation = useMemo(() => {
    try {
      const [hours, minutes] = selectedTimeStr.split(':').map(Number);
      const [year, month, day] = selectedDateStr.split('-').map(Number);
      const targetDate = new Date(year, month - 1, day, hours, minutes, 0);

      return calculateReverseSchedule(selectedRecipe, targetDate, coldRetardHours);
    } catch {
      return null;
    }
  }, [selectedRecipe, selectedDateStr, selectedTimeStr, coldRetardHours]);

  if (!isOpen) return null;

  const handleQuickDate = (daysFromNow: number) => {
    const target = addDays(new Date(), daysFromNow);
    setSelectedDateStr(format(target, 'yyyy-MM-dd'));
  };

  const handleBuildTimeline = () => {
    const [hours, minutes] = selectedTimeStr.split(':').map(Number);
    const [year, month, day] = selectedDateStr.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day, hours, minutes, 0);

    startNewBake('bake-by', targetDate, coldRetardHours);
    onTimelineBuilt();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-crust-100 dark:bg-crust-950/60 text-crust-600 dark:text-crust-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Bake By? (Arrive By)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Calculates backward to tell you when to feed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date & Time Selection */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              When do you want your bread ready?
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2.5">
              <button
                type="button"
                onClick={() => handleQuickDate(1)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedDateStr === format(addDays(new Date(), 1), 'yyyy-MM-dd')
                    ? 'border-crust-500 bg-crust-50 dark:bg-crust-950/50 text-crust-700 dark:text-crust-300 shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(2)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedDateStr === format(addDays(new Date(), 2), 'yyyy-MM-dd')
                    ? 'border-crust-500 bg-crust-50 dark:bg-crust-950/50 text-crust-700 dark:text-crust-300 shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {format(addDays(new Date(), 2), 'EEEE')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(3)}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedDateStr === format(addDays(new Date(), 3), 'yyyy-MM-dd')
                    ? 'border-crust-500 bg-crust-50 dark:bg-crust-950/50 text-crust-700 dark:text-crust-300 shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {format(addDays(new Date(), 3), 'EEEE')}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={selectedDateStr}
                onChange={(e) => setSelectedDateStr(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-crust-500"
              />
              <input
                type="time"
                value={selectedTimeStr}
                onChange={(e) => setSelectedTimeStr(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-crust-500"
              />
            </div>
          </div>

          {/* Cold Retard Slider */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                <Snowflake className="w-3.5 h-3.5 text-sky-500" />
                <span>Adjust Cold Retard Window</span>
              </span>
              <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                {coldRetardHours} Hours
              </span>
            </div>
            <input
              type="range"
              min="12"
              max="48"
              step="1"
              value={coldRetardHours}
              onChange={(e) => setColdRetardHours(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>12h (Min)</span>
              <span>14h (Default)</span>
              <span>48h (Max)</span>
            </div>
          </div>

          {/* Dynamic Calculated Start Callout Banner */}
          {reverseCalculation && (
            <div className="rounded-2xl bg-gradient-to-br from-crust-50 via-amber-50 to-orange-50 dark:from-stone-800/90 dark:to-stone-800/40 p-4 border border-crust-200 dark:border-stone-700">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-crust-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm font-bold text-sm">
                  🌱
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-crust-700 dark:text-crust-400">
                    Recommended Feeding Time:
                  </span>
                  <div className="font-serif text-xl font-extrabold text-stone-900 dark:text-stone-100 mt-0.5">
                    {format(reverseCalculation.calculatedStartTime, 'EEEE, MMM d')} at{' '}
                    <span className="text-crust-600 dark:text-crust-400">
                      {format(reverseCalculation.calculatedStartTime, 'h:mm a')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1.5 leading-relaxed">
                    Based on your recipe, 6h starter build, 4.5h mix & folds, {coldRetardHours}h refrigerator retard, baking, and 2h cooling.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={handleBuildTimeline}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-crust-600 via-amber-600 to-crust-700 hover:from-crust-700 hover:to-crust-800 text-white rounded-2xl font-semibold shadow-lg shadow-crust-600/25 hover:shadow-crust-600/35 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98]"
          >
            <span>CALCULATE START TIME & BAKE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
