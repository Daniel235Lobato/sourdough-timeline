import React, { useState } from 'react';
import { X, Clock, Calendar, ArrowRight, Snowflake, Sparkles } from 'lucide-react';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { useSourdough } from '../../context/SourdoughContext';

interface StartWhenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimelineBuilt: () => void;
}

export const StartWhenModal: React.FC<StartWhenModalProps> = ({
  isOpen,
  onClose,
  onTimelineBuilt
}) => {
  const { selectedRecipe, startNewBake } = useSourdough();

  // Default to 7:00 AM today (or tomorrow if currently past 7pm)
  const now = new Date();
  const defaultDate = now.getHours() >= 19 ? addDays(now, 1) : now;

  const [selectedDateStr, setSelectedDateStr] = useState<string>(format(defaultDate, 'yyyy-MM-dd'));
  const [selectedTimeStr, setSelectedTimeStr] = useState<string>('07:00');
  const [coldRetardHours, setColdRetardHours] = useState<number>(selectedRecipe.defaultRetardHours || 14);

  if (!isOpen) return null;

  const handleQuickDate = (daysFromNow: number) => {
    const target = addDays(new Date(), daysFromNow);
    setSelectedDateStr(format(target, 'yyyy-MM-dd'));
  };

  const handleBuildTimeline = () => {
    const [hours, minutes] = selectedTimeStr.split(':').map(Number);
    const [year, month, day] = selectedDateStr.split('-').map(Number);
    const startDate = new Date(year, month - 1, day, hours, minutes, 0);

    startNewBake('start-when', startDate, coldRetardHours);
    onTimelineBuilt();
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
                Start When?
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Forward schedule starting from feeding
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

        {/* Date Selection */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Start Date
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2.5">
              <button
                type="button"
                onClick={() => handleQuickDate(0)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  selectedDateStr === format(new Date(), 'yyyy-MM-dd')
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(1)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  selectedDateStr === format(addDays(new Date(), 1), 'yyyy-MM-dd')
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(2)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  selectedDateStr === format(addDays(new Date(), 2), 'yyyy-MM-dd')
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {format(addDays(new Date(), 2), 'EEE, MMM d')}
              </button>
            </div>
            <div className="relative">
              <input
                type="date"
                value={selectedDateStr}
                onChange={(e) => setSelectedDateStr(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Start Time (Feed Starter)
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2.5">
              {['06:00', '07:00', '08:00', '09:00'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTimeStr(time)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedTimeStr === time
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 shadow-sm'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  {time === '06:00' ? '6:00 AM' : time === '07:00' ? '7:00 AM' : time === '08:00' ? '8:00 AM' : '9:00 AM'}
                </button>
              ))}
            </div>
            <input
              type="time"
              value={selectedTimeStr}
              onChange={(e) => setSelectedTimeStr(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Cold Retard Slider */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                <Snowflake className="w-3.5 h-3.5 text-sky-500" />
                <span>Cold Retard Duration</span>
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
              <span>12h (Minimum)</span>
              <span>16h (Optimal)</span>
              <span>48h (Maximum)</span>
            </div>
          </div>

          {/* Recipe Info Pill */}
          <div className="bg-flour-100 dark:bg-stone-800/60 rounded-2xl p-3 border border-stone-200/70 dark:border-stone-800 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-stone-500 dark:text-stone-400">Recipe:</span>{' '}
              <span className="font-semibold text-stone-800 dark:text-stone-200">{selectedRecipe.name}</span>
            </div>
            <span className="text-xs font-mono font-medium text-amber-600 dark:text-amber-400">
              {selectedRecipe.hydration}% Hydration
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={handleBuildTimeline}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 via-crust-600 to-amber-700 hover:from-amber-700 hover:to-crust-800 text-white rounded-2xl font-semibold shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98]"
          >
            <span>BUILD MY TIMELINE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
