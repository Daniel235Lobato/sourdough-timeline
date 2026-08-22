import React, { useState, useMemo, useEffect } from 'react';
import { X, Clock, Calendar, ArrowRight, Snowflake, Sparkles, FlaskConical, Edit3 } from 'lucide-react';
import { format, addDays, addMinutes, setHours, setMinutes } from 'date-fns';
import { useSourdough } from '../../context/SourdoughContext';
import { Modal } from '../common/Modal';
import { calculateStarterFeeding } from '../../engine/starterCalculator';
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
  
  // Starter seed selection & custom input mode
  const [selectedSeedPreset, setSelectedSeedPreset] = useState<number | 'custom'>(15);
  const [customSeedGrams, setCustomSeedGrams] = useState<number>(25);

  const activeSeedAmount = selectedSeedPreset === 'custom' ? customSeedGrams : selectedSeedPreset;

  const loaves = selectedRecipe.loavesCount || 1;
  const starterPerLoaf = Math.round((selectedRecipe.starterGrams || 100) / loaves);

  const feedingCalc = useMemo(() => {
    return calculateStarterFeeding(loaves, starterPerLoaf, 15, activeSeedAmount);
  }, [loaves, starterPerLoaf, activeSeedAmount]);

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
      <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 dark:border-stone-800">
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

      <div className="mt-4 space-y-4">
        {/* Date Selection */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
            Start Date
          </label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <button
              type="button"
              onClick={() => handleQuickDate(0)}
              className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center truncate active-press ${
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
              className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center truncate active-press ${
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
              className={`w-full py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center truncate active-press ${
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
            className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
            Start Time (Feed Starter)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
            {suggestedTimes.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedTimeStr(value)}
                className={`w-full py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center active-press ${
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
            className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Starter Feeding Calculation Breakdown Card */}
        <div className="p-4 bg-amber-50/80 dark:bg-stone-800/80 rounded-2xl border border-amber-200/80 dark:border-stone-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center space-x-1.5">
              <FlaskConical className="w-4 h-4 text-amber-600" />
              <span>Starting Seed Starter Amount</span>
            </span>
            <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
              {feedingCalc.seedStarterGrams}g seed
            </span>
          </div>

          {/* Seed amount presets + Custom input button */}
          <div className="grid grid-cols-4 gap-2">
            {[15, 20, 30].map(grams => (
              <button
                key={grams}
                type="button"
                onClick={() => setSelectedSeedPreset(grams)}
                className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center active-press ${
                  selectedSeedPreset === grams
                    ? 'border-amber-500 bg-white dark:bg-stone-900 text-amber-800 dark:text-amber-300 shadow-xs ring-1 ring-amber-500/30'
                    : 'border-amber-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 bg-white/60 dark:bg-stone-800/60'
                }`}
              >
                {grams}g {grams === 15 ? '(Min)' : ''}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelectedSeedPreset('custom')}
              className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center active-press flex items-center justify-center space-x-1 ${
                selectedSeedPreset === 'custom'
                  ? 'border-amber-500 bg-white dark:bg-stone-900 text-amber-800 dark:text-amber-300 shadow-xs ring-1 ring-amber-500/30'
                  : 'border-amber-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 bg-white/60 dark:bg-stone-800/60'
              }`}
            >
              <Edit3 className="w-3 h-3 text-amber-600" />
              <span>Custom</span>
            </button>
          </div>

          {/* Custom Seed Input Row (shown when Custom is selected or always editable) */}
          {selectedSeedPreset === 'custom' && (
            <div className="p-3 bg-white dark:bg-stone-900 rounded-xl border border-amber-300 dark:border-stone-600 flex items-center justify-between animate-fade-in">
              <div className="text-xs">
                <span className="font-bold text-stone-800 dark:text-stone-200">Type Your Seed Amount:</span>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">Ratio & peak time will calculate live</p>
              </div>
              <div className="flex items-center space-x-1.5">
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={customSeedGrams}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 5) {
                      setCustomSeedGrams(val);
                    } else if (e.target.value === '') {
                      setCustomSeedGrams(15);
                    }
                  }}
                  className="w-16 px-2.5 py-1.5 text-center text-sm font-mono font-extrabold rounded-lg bg-amber-50/60 dark:bg-stone-800 border border-amber-300 dark:border-stone-600 text-amber-900 dark:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-stone-500 dark:text-stone-400">grams</span>
              </div>
            </div>
          )}

          {/* Live Dynamic Calculated Formula & Timing Summary */}
          <div className="pt-2.5 border-t border-amber-200/60 dark:border-stone-700 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-600 dark:text-stone-400">Calculated Ratio:</span>
              <span className="font-mono font-bold text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md bg-amber-100/70 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 text-[11px]">
                {feedingCalc.feedRatio}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600 dark:text-stone-400">Feeding Formula:</span>
              <span className="font-bold text-amber-900 dark:text-amber-300">
                {feedingCalc.seedStarterGrams}g seed + {feedingCalc.waterGrams}g water + {feedingCalc.flourGrams}g flour
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-600 dark:text-stone-400">Yield & Peak Time:</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                {feedingCalc.totalLevainYield}g yield • <span className="text-emerald-700 dark:text-emerald-400 font-bold">⏱️ ~{feedingCalc.estimatedHours}h to peak</span>
              </span>
            </div>
          </div>
        </div>

        {/* Cold Retard Slider */}
        <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-700 space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              <Snowflake className="w-4 h-4 text-sky-500" />
              <span>Cold Retard Duration</span>
            </span>
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
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
          <div className="flex justify-between text-[10px] text-stone-400 font-semibold">
            <span>12h (Min)</span>
            <span>48h (Max)</span>
          </div>
        </div>
      </div>

      {/* Primary Action Button (52px Touch Target) */}
      <div className="mt-5">
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
