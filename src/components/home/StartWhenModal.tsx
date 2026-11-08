import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Snowflake, 
  FlaskConical, 
  Sun, 
  Moon, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { format, addDays, addMinutes, setHours, setMinutes } from 'date-fns';
import { useSourdough } from '../../context/SourdoughContext';
import { Modal } from '../common/Modal';
import { Recipe } from '../../types/timeline';
import { calculateForwardSchedule } from '../../engine/scheduler';

interface StartWhenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimelineBuilt: () => void;
}

const getSuggestedStartTimes = (dateStr: string) => {
  const now = new Date();
  const isToday = dateStr === format(now, 'yyyy-MM-dd');

  if (isToday) {
    if (now.getHours() < 9) {
      return [
        { value: '08:00', label: '8:00 AM (Ideal)' },
        { value: '08:30', label: '8:30 AM' },
        { value: '09:00', label: '9:00 AM' }
      ];
    }

    const currentMinutes = now.getMinutes();
    let startHour = now.getHours();
    let startMinute = 0;

    if (currentMinutes <= 10) {
      startMinute = 0;
    } else if (currentMinutes <= 40) {
      startMinute = 30;
    } else {
      startHour = (startHour + 1) % 24;
      startMinute = 0;
    }

    const suggestions: { value: string; label: string }[] = [
      {
        value: format(now, 'HH:mm'),
        label: 'Right Now'
      }
    ];
    const baseDate = setMinutes(setHours(new Date(), startHour), startMinute);

    for (let i = 1; i <= 2; i++) {
      const slot = addMinutes(baseDate, i * 30);
      suggestions.push({
        value: format(slot, 'HH:mm'),
        label: format(slot, 'h:mm a')
      });
    }
    return suggestions;
  } else {
    return [
      { value: '08:00', label: '8:00 AM (Recommended)' },
      { value: '08:30', label: '8:30 AM' },
      { value: '09:00', label: '9:00 AM' }
    ];
  }
};

export const StartWhenModal: React.FC<StartWhenModalProps> = ({
  isOpen,
  onClose,
  onTimelineBuilt
}) => {
  const { selectedRecipe, startNewBake } = useSourdough();

  // If current hour is past 11 AM, default to tomorrow 8:00 AM to keep active steps during wake hours
  const now = new Date();
  const isPastMorningToday = now.getHours() >= 11;
  const defaultDate = isPastMorningToday ? addDays(now, 1) : now;

  const [selectedDateStr, setSelectedDateStr] = useState<string>(format(defaultDate, 'yyyy-MM-dd'));
  const [coldRetardHours, setColdRetardHours] = useState<number>(selectedRecipe.defaultRetardHours || 14);
  
  // Seed amount selection: 15, 20, 30, or custom
  const [selectedSeedPreset, setSelectedSeedPreset] = useState<number | 'custom'>(15);
  const [customSeedGrams, setCustomSeedGrams] = useState<string>('25');

  const parsedCustomSeed = parseInt(customSeedGrams, 10);
  const activeSeedAmount = selectedSeedPreset === 'custom' 
    ? (!isNaN(parsedCustomSeed) && parsedCustomSeed > 0 ? parsedCustomSeed : 25)
    : selectedSeedPreset;

  const suggestedTimes = useMemo(() => {
    return getSuggestedStartTimes(selectedDateStr);
  }, [selectedDateStr, isOpen]);

  const [selectedTimeStr, setSelectedTimeStr] = useState<string>(() => {
    if (isPastMorningToday) return '08:00';
    const initialSuggestions = getSuggestedStartTimes(format(defaultDate, 'yyyy-MM-dd'));
    return initialSuggestions[0]?.value || '08:00';
  });

  // Calculate projected bread ready time and analyze wake hours / nighttime conflicts
  const projectedSchedule = useMemo(() => {
    try {
      const [hours, minutes] = selectedTimeStr.split(':').map(Number);
      const [year, month, day] = selectedDateStr.split('-').map(Number);
      const startDate = new Date(year, month - 1, day, hours, minutes, 0);

      const recipeToUse: Recipe = {
        ...selectedRecipe,
        customSeedGrams: activeSeedAmount
      };

      const steps = calculateForwardSchedule(recipeToUse, startDate, coldRetardHours);
      if (!steps || steps.length === 0) return null;

      const retardIndex = steps.findIndex(s => s.isColdRetard);
      const readyStep = steps[steps.length - 1];
      const readyDate = readyStep?.endTime;

      // Active phase steps: after starter feeding and before dough rests in cold retard
      const activeSteps = steps.filter((_, idx) => idx > 0 && (retardIndex === -1 || idx < retardIndex));
      const firstActiveStep = activeSteps[0];
      const lastActiveStep = activeSteps[activeSteps.length - 1];
      const fridgeStep = retardIndex !== -1 ? steps[retardIndex] : null;

      // Detect if active folding/shaping steps fall during sleep hours (10:30 PM - 6:30 AM)
      const isNightTime = (d: Date) => {
        const h = d.getHours();
        const m = d.getMinutes();
        return h > 22 || (h === 22 && m >= 30) || h < 6 || (h === 6 && m < 30);
      };

      const conflictStep = activeSteps.find(s => isNightTime(s.startTime) || isNightTime(s.endTime));

      return {
        startDate,
        readyDate,
        totalMinutes: steps.reduce((acc, s) => acc + s.durationMinutes, 0),
        firstActiveTime: firstActiveStep?.startTime,
        lastActiveEndTime: lastActiveStep?.endTime,
        fridgeTime: fridgeStep?.startTime,
        hasNightConflict: !!conflictStep,
        conflictStepName: conflictStep ? conflictStep.name : null,
        conflictTime: conflictStep ? conflictStep.startTime : null
      };
    } catch {
      return null;
    }
  }, [selectedDateStr, selectedTimeStr, coldRetardHours, selectedRecipe, activeSeedAmount]);

  const handleApplyRecommendedWakeHours = () => {
    const tomorrow = addDays(new Date(), 1);
    setSelectedDateStr(format(tomorrow, 'yyyy-MM-dd'));
    setSelectedTimeStr('08:00');
  };

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
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md" cardClass="p-5 sm:p-6 bg-[#FAF5EE] text-[#2E1E14] border border-[#D1C1A8]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D1C1A8]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E7CEB5] text-[#2E1E14] border border-[#D1C1A8] flex items-center justify-center shadow-xs">
            <Clock className="w-5 h-5 text-[#986A4C]" />
          </div>
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-extrabold text-[#2E1E14] leading-tight">
              Start Your Bake
            </h3>
            <p className="text-xs text-[#986A4C] mt-0.5">
              Configure your starter build &amp; fermentation timeline
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-[#2E1E14]/70 hover:text-[#2E1E14] hover:bg-[#E7CEB5] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 space-y-3.5">
        {/* Date Selection */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2E1E14] mb-1.5">
            Start Date
          </label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <button
              type="button"
              onClick={() => handleQuickDate(0)}
              className={`w-full py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center truncate active-press ${
                selectedDateStr === format(new Date(), 'yyyy-MM-dd')
                  ? 'border-[#2E1E14] bg-[#2E1E14] text-[#FAF5EE] shadow-xs'
                  : 'border-[#D1C1A8] bg-[#E7CEB5] text-[#2E1E14] hover:bg-[#D1C1A8]'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handleQuickDate(1)}
              className={`w-full py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center truncate active-press ${
                selectedDateStr === format(addDays(new Date(), 1), 'yyyy-MM-dd')
                  ? 'border-[#2E1E14] bg-[#2E1E14] text-[#FAF5EE] shadow-xs'
                  : 'border-[#D1C1A8] bg-[#E7CEB5] text-[#2E1E14] hover:bg-[#D1C1A8]'
              }`}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => handleQuickDate(2)}
              className={`w-full py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center truncate active-press ${
                selectedDateStr === format(addDays(new Date(), 2), 'yyyy-MM-dd')
                  ? 'border-[#2E1E14] bg-[#2E1E14] text-[#FAF5EE] shadow-xs'
                  : 'border-[#D1C1A8] bg-[#E7CEB5] text-[#2E1E14] hover:bg-[#D1C1A8]'
              }`}
            >
              {format(addDays(new Date(), 2), 'EEE, MMM d')}
            </button>
          </div>
          <input
            type="date"
            value={selectedDateStr}
            onChange={(e) => setSelectedDateStr(e.target.value)}
            className="w-full bg-[#FAF5EE] border border-[#D1C1A8] rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[#2E1E14] focus:outline-none focus:ring-2 focus:ring-[#2E1E14]"
          />
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2E1E14] mb-1.5">
            Start Time (Feed Starter)
          </label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {suggestedTimes.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedTimeStr(value)}
                className={`w-full py-2 px-1.5 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center active-press ${
                  selectedTimeStr === value
                    ? 'border-[#2E1E14] bg-[#2E1E14] text-[#FAF5EE] shadow-xs'
                    : 'border-[#D1C1A8] bg-[#E7CEB5] text-[#2E1E14] hover:bg-[#D1C1A8]'
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
            className="w-full bg-[#FAF5EE] border border-[#D1C1A8] rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-[#2E1E14] focus:outline-none focus:ring-2 focus:ring-[#2E1E14]"
          />
        </div>

        {/* Starting Seed Starter Amount (Compact 1-Row Selection) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#2E1E14] flex items-center space-x-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-[#986A4C]" />
              <span>Starting Seed Starter</span>
            </label>
            <span className="text-xs font-mono font-bold text-[#986A4C]">
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
                    ? 'border-[#2E1E14] bg-[#2E1E14] text-[#FAF5EE] shadow-xs'
                    : 'border-[#D1C1A8] bg-[#E7CEB5] text-[#2E1E14] hover:bg-[#D1C1A8]'
                }`}
              >
                {grams}g
              </button>
            ))}

            {/* Custom Option: Button or Active Inline Input */}
            {selectedSeedPreset === 'custom' ? (
              <div className="py-1 px-1.5 rounded-xl border border-[#2E1E14] bg-[#FAF5EE] shadow-xs flex items-center justify-center space-x-0.5">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoFocus
                  placeholder="25"
                  value={customSeedGrams}
                  onChange={(e) => {
                    const onlyDigits = e.target.value.replace(/[^0-9]/g, '');
                    setCustomSeedGrams(onlyDigits);
                  }}
                  onBlur={() => {
                    if (!customSeedGrams || parseInt(customSeedGrams, 10) < 1) {
                      setCustomSeedGrams('25');
                    }
                  }}
                  className="w-9 text-center font-mono font-bold text-xs bg-transparent text-[#2E1E14] focus:outline-none"
                />
                <span className="text-[11px] font-bold text-[#2E1E14]">g</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSelectedSeedPreset('custom')}
                className="py-2 px-1 rounded-xl text-xs font-bold border border-[#D1C1A8] bg-[#E7CEB5] text-[#2E1E14] hover:bg-[#D1C1A8] transition-all text-center active-press"
              >
                Custom
              </button>
            )}
          </div>
        </div>

        {/* Cold Retard Slider */}
        <div className="p-3 bg-[#E7CEB5] rounded-2xl border border-[#D1C1A8] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2E1E14]">
              <Snowflake className="w-3.5 h-3.5 text-[#986A4C]" />
              <span>Cold Retard Duration</span>
            </span>
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#FAF5EE] text-[#2E1E14] border border-[#D1C1A8]">
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
            className="w-full h-2 bg-[#D1C1A8] rounded-lg appearance-none cursor-pointer accent-[#2E1E14]"
          />
        </div>

        {/* Projected Bread Ready & Wake-Hours Health Card */}
        {projectedSchedule && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#E7CEB5] border border-[#D1C1A8] space-y-2.5">
            {/* Header: Bread Ready Time */}
            <div className="flex items-center justify-between pb-2 border-b border-[#D1C1A8]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E1E14]/80 block">
                  Bread Ready to Slice
                </span>
                <p className="font-serif text-base sm:text-lg font-extrabold text-[#2E1E14] mt-0.5">
                  {format(projectedSchedule.readyDate, 'EEEE, MMM d • h:mm a')}
                </p>
              </div>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FAF5EE] text-[#2E1E14] border border-[#D1C1A8]">
                ~{Math.round(projectedSchedule.totalMinutes / 60)}h total
              </span>
            </div>

            {/* Wake Hours Advisor */}
            {projectedSchedule.hasNightConflict ? (
              <div className="p-3 rounded-xl bg-[#FAF5EE] border border-[#986A4C] space-y-2">
                <div className="flex items-start space-x-2 text-xs text-[#2E1E14]">
                  <Moon className="w-4 h-4 text-[#986A4C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#2E1E14]">
                      Late-Night Folding Alert
                    </p>
                    <p className="text-[11px] text-[#2E1E14]/80 mt-0.5 leading-relaxed">
                      Starting now requires active steps like <span className="font-bold">{projectedSchedule.conflictStepName}</span> around <span className="font-mono font-bold">{format(projectedSchedule.conflictTime!, 'h:mm a')}</span> in the middle of the night.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyRecommendedWakeHours}
                  className="w-full py-2 px-3 rounded-lg bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] text-xs font-bold flex items-center justify-center space-x-1.5 transition-all active-press shadow-xs"
                >
                  <Sun className="w-3.5 h-3.5 text-[#FAF5EE]" />
                  <span>Switch to Tomorrow 8:00 AM (Normal Wake Hours)</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-xs text-[#2E1E14] px-1 py-0.5">
                <CheckCircle2 className="w-4 h-4 text-[#986A4C] flex-shrink-0" />
                <span className="text-[11px] leading-tight">
                  <strong className="font-bold text-[#2E1E14]">Normal wake hours:</strong> All folds finish by {projectedSchedule.fridgeTime ? format(projectedSchedule.fridgeTime, 'h:mm a') : 'evening'}, proofing safely in the fridge overnight.
                </span>
              </div>
            )}

            {/* Quick 3-Stage Milestone Breadcrumb */}
            <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px]">
              <div className="bg-[#FAF5EE] p-2 rounded-xl border border-[#D1C1A8] text-center">
                <span className="text-[#AD9677] block font-bold">1. Feed Starter</span>
                <span className="font-mono font-extrabold text-[#2E1E14] text-xs">
                  {format(projectedSchedule.startDate, 'h:mm a')}
                </span>
              </div>
              <div className="bg-[#FAF5EE] p-2 rounded-xl border border-[#D1C1A8] text-center">
                <span className="text-[#AD9677] block font-bold">2. Into Fridge</span>
                <span className="font-mono font-extrabold text-[#2E1E14] text-xs">
                  {projectedSchedule.fridgeTime ? format(projectedSchedule.fridgeTime, 'h:mm a') : '—'}
                </span>
              </div>
              <div className="bg-[#FAF5EE] p-2 rounded-xl border border-[#D1C1A8] text-center">
                <span className="text-[#AD9677] block font-bold">3. Ready to Slice</span>
                <span className="font-mono font-extrabold text-[#2E1E14] text-xs">
                  {format(projectedSchedule.readyDate, 'h:mm a')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button (52px Touch Target) */}
      <div className="mt-4">
        <button
          onClick={handleBuildTimeline}
          className="w-full py-3.5 px-4 bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] rounded-2xl font-bold text-sm sm:text-base shadow-sm flex items-center justify-center space-x-2 transition-all active-press"
        >
          <span className="tracking-wide">Start Bake</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Modal>
  );
};
