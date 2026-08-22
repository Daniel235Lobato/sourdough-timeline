import React, { useState, useMemo, useEffect } from 'react';
import { X, Clock, Calendar, ArrowRight, Snowflake, Sparkles, FlaskConical } from 'lucide-react';
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
  const [seedGrams, setSeedGrams] = useState<number | undefined>(15);
  const [customSeedInput, setCustomSeedInput] = useState<string>('');

  const loaves = selectedRecipe.loavesCount || 1;
  const starterPerLoaf = Math.round((selectedRecipe.starterGrams || 100) / loaves);

  const feedingCalc = useMemo(() => {
    return calculateStarterFeeding(loaves, starterPerLoaf, 15, seedGrams);
  }, [loaves, starterPerLoaf, seedGrams]);

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
      customSeedGrams: seedGrams
    };

    startNewBake('start-when', startDate, coldRetardHours, recipeToUse);
    onTimelineBuilt();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md" cardClass="p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60 flex items-center justify-center shadow-2xs">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 leading-tight">
              Start Feeding
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Schedule forward from starter feed
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {/* Date & Time Row */}
        <div className="grid grid-cols-2 gap-2">
          {/* Date Picker */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
              Start Date
            </label>
            <div className="flex space-x-1 mb-1">
              <button
                type="button"
                onClick={() => handleQuickDate(0)}
                className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-bold border transition-all text-center ${
                  selectedDateStr === format(new Date(), 'yyyy-MM-dd')
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => handleQuickDate(1)}
                className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-bold border transition-all text-center ${
                  selectedDateStr === format(addDays(new Date(), 1), 'yyyy-MM-dd')
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                    : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                }`}
              >
                Tmrw
              </button>
            </div>
            <input
              type="date"
              value={selectedDateStr}
              onChange={(e) => setSelectedDateStr(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1.5 text-xs font-semibold text-stone-800 dark:text-stone-200"
            />
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
              Feed Time
            </label>
            <div className="grid grid-cols-2 gap-1 mb-1">
              {suggestedTimes.slice(0, 2).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedTimeStr(value)}
                  className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-all text-center truncate ${
                    selectedTimeStr === value
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
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
              className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1.5 text-xs font-semibold text-stone-800 dark:text-stone-200"
            />
          </div>
        </div>

        {/* Starter Feeding Calculation */}
        <div className="p-3 bg-amber-50/70 dark:bg-stone-800/70 rounded-2xl border border-amber-200/70 dark:border-stone-700/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center space-x-1">
              <FlaskConical className="w-3 h-3 text-amber-600" />
              <span>Starter Feeding Ratio</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400">
              {feedingCalc.feedRatio}
            </span>
          </div>

          {/* Seed selector pills */}
          <div className="grid grid-cols-4 gap-1">
            {[15, 20, 30].map(grams => (
              <button
                key={grams}
                type="button"
                onClick={() => {
                  setSeedGrams(grams);
                  setCustomSeedInput('');
                }}
                className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-all text-center active-press ${
                  seedGrams === grams
                    ? 'border-amber-500 bg-white dark:bg-stone-900 text-amber-800 dark:text-amber-300 shadow-2xs'
                    : 'border-amber-200/60 dark:border-stone-700 text-stone-600 dark:text-stone-400 bg-white/50 dark:bg-stone-800/50'
                }`}
              >
                {grams}g {grams === 15 ? '(Min)' : ''}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setSeedGrams(undefined);
                setCustomSeedInput('');
              }}
              className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-all text-center active-press ${
                seedGrams === undefined
                  ? 'border-amber-500 bg-white dark:bg-stone-900 text-amber-800 dark:text-amber-300 shadow-2xs'
                  : 'border-amber-200/60 dark:border-stone-700 text-stone-600 dark:text-stone-400 bg-white/50 dark:bg-stone-800/50'
              }`}
            >
              Auto
            </button>
          </div>

          {/* Formula summary */}
          <div className="pt-1.5 border-t border-amber-200/60 dark:border-stone-700 flex items-center justify-between text-[11px]">
            <span className="text-stone-600 dark:text-stone-300 font-medium">
              Mix: <strong className="text-amber-900 dark:text-amber-300">{feedingCalc.seedStarterGrams}g seed</strong> + <strong className="text-amber-900 dark:text-amber-300">{feedingCalc.waterGrams}g water</strong> + <strong className="text-amber-900 dark:text-amber-300">{feedingCalc.flourGrams}g flour</strong>
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold flex-shrink-0 ml-1">
              ⏱️ ~{feedingCalc.estimatedHours}h
            </span>
          </div>
        </div>

        {/* Cold Retard Slider (Compact) */}
        <div className="p-2.5 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200/80 dark:border-stone-700">
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              <Snowflake className="w-3 h-3 text-sky-500" />
              <span>Cold Retard Duration</span>
            </span>
            <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
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
            className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
        </div>

        {/* Primary Action Button */}
        <button
          onClick={handleBuildTimeline}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 via-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-amber-600/30 flex items-center justify-center space-x-1.5 transition-all active-press"
        >
          <span className="tracking-wide">BUILD MY TIMELINE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Modal>
  );
};
