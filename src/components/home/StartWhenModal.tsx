import React, { useState, useMemo, useEffect } from 'react';
import { X, Clock, Calendar, ArrowRight, Snowflake, Sparkles, FlaskConical } from 'lucide-react';
import { format, addDays, addMinutes, setHours, setMinutes } from 'date-fns';
import { useSourdough } from '../../context/SourdoughContext';
import { Modal } from '../common/Modal';
import { Recipe } from '../../types/timeline';

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
  
  // Seed amount selection: 15, 20, 30, or custom
  const [selectedSeedPreset, setSelectedSeedPreset] = useState<number | 'custom'>(15);
  const [customSeedGrams, setCustomSeedGrams] = useState<number>(25);

  const activeSeedAmount = selectedSeedPreset === 'custom' ? customSeedGrams : selectedSeedPreset;

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

    const recipeToUse: Recipe = {
      ...selectedRecipe,
      customSeedGrams: activeSeedAmount
    };

    startNewBake('start-when', startDate, coldRetardHours, recipeToUse);
    onTimelineBuilt();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md" cardClass="p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60 flex items-center justify-center shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
              Start Feeding
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Schedule forward from starter feeding
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 space-y-3.5">
        {/* Date Selection */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
            Start Date
          </label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <button
              type="button"
              onClick={() => handleQuickDate(0)}
              className={`w-full py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center truncate active-press ${
                selectedDateStr === format(new Date(), 'yyyy-MM-dd')
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 shadow-xs ring-1 ring-amber-500/30'
                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleQuickDate(1)}
              className={`w-full py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center truncate active-press ${
                selectedDateStr === format(addDays(new Date(), 1), 'yyyy-MM-dd')
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 shadow-xs ring-1 ring-amber-500/30'
                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60'
              }`}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => handleQuickDate(2)}
              className={`w-full py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center truncate active-press ${
                selectedDateStr === format(addDays(new Date(), 2), 'yyyy-MM-dd')
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 shadow-xs ring-1 ring-amber-500/30'
                  : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60'
              }`}
            >
              {format(addDays(new Date(), 2), 'EEE, MMM d')}
            </button>
          </div>
          <input
            type="date"
            value={selectedDateStr}
            onChange={(e) => setSelectedDateStr(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
            Start Time (Feed Starter)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
            {suggestedTimes.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedTimeStr(value)}
                className={`w-full py-2 px-1.5 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center active-press ${
                  selectedTimeStr === value
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 shadow-xs ring-1 ring-amber-500/30'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/60'
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
            className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Starting Seed Starter Amount (Compact 1-Row Selection) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center space-x-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
              <span>Starting Seed Starter</span>
            </label>
            <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
              {activeSeedAmount}g seed
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[15, 20, 30].map(grams => (
              <button
                key={grams}
                type="button"
                onClick={() => setSelectedSeedPreset(grams)}
                className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center active-press ${
                  selectedSeedPreset === grams
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 shadow-xs ring-1 ring-amber-500/30'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 bg-stone-50/50 dark:bg-stone-800/50 hover:bg-stone-100'
                }`}
              >
                {grams}g
              </button>
            ))}

            {/* Custom Option: Button or Active Inline Input */}
            {selectedSeedPreset === 'custom' ? (
              <div className="py-1 px-1 rounded-xl border border-amber-500 bg-white dark:bg-stone-900 shadow-xs ring-1 ring-amber-500/30 flex items-center justify-center">
                <input
                  type="number"
                  min="5"
                  max="200"
                  autoFocus
                  value={customSeedGrams}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1) {
                      setCustomSeedGrams(val);
                    } else if (e.target.value === '') {
                      setCustomSeedGrams(15);
                    }
                  }}
                  className="w-8 text-center font-mono font-bold text-xs bg-transparent text-amber-900 dark:text-amber-200 focus:outline-none"
                />
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">g</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedSeedPreset('custom')}
                className="py-2 px-1 rounded-xl text-xs font-bold border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 bg-stone-50/50 dark:bg-stone-800/50 hover:bg-stone-100 transition-all text-center active-press"
              >
                Custom
              </button>
            )}
          </div>
        </div>

        {/* Cold Retard Slider */}
        <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-700 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
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
        </div>
      </div>

      {/* Primary Action Button (52px Touch Target) */}
      <div className="mt-4">
        <button
          onClick={handleBuildTimeline}
          className="w-full py-4 px-4 bg-gradient-to-r from-amber-600 via-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-2xl font-bold text-sm sm:text-base shadow-md shadow-amber-600/30 flex items-center justify-center space-x-2 transition-all active-press"
        >
          <span className="tracking-wide">BUILD MY TIMELINE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Modal>
  );
};
