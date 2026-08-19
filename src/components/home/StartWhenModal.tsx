import React, { useState, useMemo, useEffect } from 'react';
import { X, Clock, Calendar, ArrowRight, Snowflake, Sparkles } from 'lucide-react';
import { format, addDays, addMinutes, setHours, setMinutes } from 'date-fns';
import { useSourdough } from '../../context/SourdoughContext';
import { Modal } from '../common/Modal';

interface StartWhenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimelineBuilt: () => void;
}

const getSuggestedStartTimes = (dateStr: string) => {
  const now = new Date();
  const isToday = dateStr === format(now, 'yyyy-MM-dd');

  if (isToday) {
    const currentMinutes = now.getMinutes();
    let startHour = now.getHours();
    let startMinute = 0;

    // Round to next comfortable 30-min interval from current time
    if (currentMinutes <= 10) {
      startMinute = 0;
    } else if (currentMinutes <= 40) {
      startMinute = 30;
    } else {
      startHour = (startHour + 1) % 24;
      startMinute = 0;
    }

    const suggestions: { value: string; label: string }[] = [];
    const baseDate = setMinutes(setHours(new Date(), startHour), startMinute);

    for (let i = 0; i < 4; i++) {
      const slot = addMinutes(baseDate, i * 30);
      suggestions.push({
        value: format(slot, 'HH:mm'),
        label: format(slot, 'h:mm a')
      });
    }
    return suggestions;
  } else {
    // For tomorrow / future dates, provide default morning slots
    return [
      { value: '07:00', label: '7:00 AM' },
      { value: '07:30', label: '7:30 AM' },
      { value: '08:00', label: '8:00 AM' },
      { value: '08:30', label: '8:30 AM' },
    ];
  }
};

export const StartWhenModal: React.FC<StartWhenModalProps> = ({
  isOpen,
  onClose,
  onTimelineBuilt
}) => {
  const { selectedRecipe, startNewBake } = useSourdough();

  // Default to today (or tomorrow if past 9pm)
  const now = new Date();
  const defaultDate = now.getHours() >= 21 ? addDays(now, 1) : now;

  const [selectedDateStr, setSelectedDateStr] = useState<string>(format(defaultDate, 'yyyy-MM-dd'));
  const [coldRetardHours, setColdRetardHours] = useState<number>(selectedRecipe.defaultRetardHours || 14);

  const suggestedTimes = useMemo(() => {
    return getSuggestedStartTimes(selectedDateStr);
  }, [selectedDateStr, isOpen]);

  const [selectedTimeStr, setSelectedTimeStr] = useState<string>(() => {
    const initialSuggestions = getSuggestedStartTimes(format(defaultDate, 'yyyy-MM-dd'));
    return initialSuggestions[0]?.value || '07:00';
  });

  // When modal opens or selected date changes, sync to the first suggested slot
  useEffect(() => {
    if (isOpen) {
      const currentSuggestions = getSuggestedStartTimes(selectedDateStr);
      if (currentSuggestions.length > 0) {
        setSelectedTimeStr(currentSuggestions[0].value);
      }
    }
  }, [isOpen, selectedDateStr]);

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
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md">
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
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Start Date
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2.5">
              <button
                type="button"
                onClick={() => handleQuickDate(0)}
                className={`py-2 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all text-center truncate ${
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
                className={`py-2 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all text-center truncate ${
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
                className={`py-2 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all text-center truncate ${
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
                className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Start Time (Feed Starter)
            </label>
            <div className="grid grid-cols-2 min-[340px]:grid-cols-4 gap-1.5 sm:gap-2 mb-2.5">
              {suggestedTimes.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedTimeStr(value)}
                  className={`py-2 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all text-center whitespace-nowrap flex items-center justify-center ${
                    selectedTimeStr === value
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 shadow-sm'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              type="time"
              value={selectedTimeStr}
              onChange={(e) => setSelectedTimeStr(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
    </Modal>
  );
};
