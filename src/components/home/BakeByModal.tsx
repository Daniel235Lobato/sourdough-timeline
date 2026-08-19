import React, { useState, useMemo, useEffect } from 'react';
import { X, Calendar, Clock, ArrowRight, Snowflake, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format, addDays, isSameDay, differenceInCalendarDays } from 'date-fns';
import { useSourdough } from '../../context/SourdoughContext';
import { Modal } from '../common/Modal';
import { 
  calculateReverseSchedule, 
  getEarliestBakeByTime, 
  getMinimumRecipeDurationMinutes,
  roundToNearestHalfHour 
} from '../../engine/scheduler';

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

  const [coldRetardHours, setColdRetardHours] = useState<number>(selectedRecipe.defaultRetardHours || 14);

  // Compute minimum recipe duration and absolute earliest valid Bake-By time from right now (rounded to nearest half hour)
  const earliestPossibleBakeBy = useMemo(() => {
    return getEarliestBakeByTime(selectedRecipe, new Date(), coldRetardHours);
  }, [selectedRecipe, coldRetardHours]);

  const minDurationHours = useMemo(() => {
    const mins = getMinimumRecipeDurationMinutes(selectedRecipe, coldRetardHours);
    return Math.round((mins / 60) * 10) / 10;
  }, [selectedRecipe, coldRetardHours]);

  // Selected date and time state (defaulted to earliest valid bake-by time)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => format(earliestPossibleBakeBy, 'yyyy-MM-dd'));
  const [selectedTimeStr, setSelectedTimeStr] = useState<string>(() => format(earliestPossibleBakeBy, 'HH:mm'));

  // Sync if cold retard changes and pushes earliest time further
  useEffect(() => {
    const [hours, minutes] = selectedTimeStr.split(':').map(Number);
    const [year, month, day] = selectedDateStr.split('-').map(Number);
    const currentSelected = new Date(year, month - 1, day, hours, minutes, 0);

    if (currentSelected.getTime() < earliestPossibleBakeBy.getTime()) {
      setSelectedDateStr(format(earliestPossibleBakeBy, 'yyyy-MM-dd'));
      setSelectedTimeStr(format(earliestPossibleBakeBy, 'HH:mm'));
    }
  }, [earliestPossibleBakeBy]);

  // Evaluate currently selected target date
  const selectedTargetDate = useMemo(() => {
    try {
      const [hours, minutes] = selectedTimeStr.split(':').map(Number);
      const [year, month, day] = selectedDateStr.split('-').map(Number);
      return new Date(year, month - 1, day, hours, minutes, 0);
    } catch {
      return earliestPossibleBakeBy;
    }
  }, [selectedDateStr, selectedTimeStr, earliestPossibleBakeBy]);

  const isSelectedTimeTooEarly = selectedTargetDate.getTime() < earliestPossibleBakeBy.getTime();

  // Compute live reverse schedule
  const reverseCalculation = useMemo(() => {
    if (isSelectedTimeTooEarly) return null;
    try {
      return calculateReverseSchedule(selectedRecipe, selectedTargetDate, coldRetardHours);
    } catch {
      return null;
    }
  }, [selectedRecipe, selectedTargetDate, coldRetardHours, isSelectedTimeTooEarly]);

  if (!isOpen) return null;

  // Days offset relative to today for quick buttons
  const earliestDaysOffset = Math.max(0, differenceInCalendarDays(earliestPossibleBakeBy, new Date()));

  const handleQuickDaySelect = (dayOffsetFromToday: number) => {
    const target = addDays(new Date(), dayOffsetFromToday);
    const dateStr = format(target, 'yyyy-MM-dd');
    setSelectedDateStr(dateStr);

    // If picking the earliest possible day, ensure time is at or after earliest half hour
    if (isSameDay(target, earliestPossibleBakeBy)) {
      const [currH, currM] = selectedTimeStr.split(':').map(Number);
      const testDate = new Date(target.getFullYear(), target.getMonth(), target.getDate(), currH, currM, 0);
      if (testDate.getTime() < earliestPossibleBakeBy.getTime()) {
        setSelectedTimeStr(format(earliestPossibleBakeBy, 'HH:mm'));
      }
    }
  };

  const handleTimePreset = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const [year, month, day] = selectedDateStr.split('-').map(Number);
    const testDate = new Date(year, month - 1, day, h, m, 0);

    if (testDate.getTime() >= earliestPossibleBakeBy.getTime()) {
      setSelectedTimeStr(time);
    } else {
      // Clamp to earliest possible time
      setSelectedDateStr(format(earliestPossibleBakeBy, 'yyyy-MM-dd'));
      setSelectedTimeStr(format(earliestPossibleBakeBy, 'HH:mm'));
    }
  };

  const handleBuildTimeline = () => {
    if (isSelectedTimeTooEarly) return;

    startNewBake('bake-by', selectedTargetDate, coldRetardHours);
    onTimelineBuilt();
    onClose();
  };

  const minDateAttribute = format(earliestPossibleBakeBy, 'yyyy-MM-dd');

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md">
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
                Calculates backward from target ready time
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

        {/* Earliest Safe Time Notice */}
        <div className="mt-4 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 text-xs text-stone-600 dark:text-stone-300 flex items-start space-x-2">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              Minimum timeline duration: ~{minDurationHours} hours.
            </span>{' '}
            Earliest possible bake-by time from now is{' '}
            <span className="font-bold text-amber-700 dark:text-amber-300">
              {format(earliestPossibleBakeBy, 'EEE, MMM d')} at {format(earliestPossibleBakeBy, 'h:mm a')}
            </span>.
          </div>
        </div>

        {/* Date & Time Selection */}
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Target Ready Date:
            </label>

            {/* Quick Day Chips (only showing valid future days) */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-2.5">
              {[earliestDaysOffset, earliestDaysOffset + 1, earliestDaysOffset + 2].map((offset) => {
                const dayDate = addDays(new Date(), offset);
                const dayStr = format(dayDate, 'yyyy-MM-dd');
                const isSelected = selectedDateStr === dayStr;
                const isTomorrowDate = offset === 1;

                return (
                  <button
                    key={offset}
                    type="button"
                    onClick={() => handleQuickDaySelect(offset)}
                    className={`py-2 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all text-center truncate ${
                      isSelected
                        ? 'border-crust-500 bg-crust-50 dark:bg-crust-950/50 text-crust-700 dark:text-crust-300 shadow-sm'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    {isTomorrowDate ? 'Tomorrow' : format(dayDate, 'EEE, MMM d')}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 min-[340px]:grid-cols-2 gap-2">
              <input
                type="date"
                min={minDateAttribute}
                value={selectedDateStr}
                onChange={(e) => setSelectedDateStr(e.target.value)}
                className="w-full min-w-0 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-crust-500"
              />
              <input
                type="time"
                step="1800"
                value={selectedTimeStr}
                onChange={(e) => setSelectedTimeStr(e.target.value)}
                className="w-full min-w-0 bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-crust-500"
              />
            </div>
          </div>

          {/* Quick Time Presets (Half-hour intervals) */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
              Popular Target Times:
            </label>
            <div className="grid grid-cols-2 min-[340px]:grid-cols-4 gap-1.5 sm:gap-2">
              {['08:00', '10:00', '12:30', '17:00'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimePreset(time)}
                  className={`py-2 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs font-semibold border transition-all text-center whitespace-nowrap flex items-center justify-center ${
                    selectedTimeStr === time
                      ? 'border-crust-500 bg-crust-50 dark:bg-crust-950/50 text-crust-700 dark:text-crust-300 shadow-sm font-bold'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  {time === '08:00' ? '8:00 AM' : time === '10:00' ? '10:00 AM' : time === '12:30' ? '12:30 PM' : '5:00 PM'}
                </button>
              ))}
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

          {/* Too Early Error Warning Banner */}
          {isSelectedTimeTooEarly ? (
            <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/60 p-3.5 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Target time is too early:</span> Sourdough requires at least {minDurationHours} hours from now to ferment properly.
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDateStr(format(earliestPossibleBakeBy, 'yyyy-MM-dd'));
                    setSelectedTimeStr(format(earliestPossibleBakeBy, 'HH:mm'));
                  }}
                  className="block mt-1 font-bold text-amber-700 dark:text-amber-300 underline"
                >
                  Set to earliest valid time ({format(earliestPossibleBakeBy, 'EEE, h:mm a')})
                </button>
              </div>
            </div>
          ) : reverseCalculation && (
            <div className="rounded-2xl bg-gradient-to-br from-crust-50 via-amber-50 to-orange-50 dark:from-stone-800/90 dark:to-stone-800/40 p-3.5 sm:p-4 border border-crust-200 dark:border-stone-700">
              <div className="flex items-start space-x-2.5 sm:space-x-3">
                <div className="w-8 h-8 rounded-full bg-crust-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm font-bold text-sm">
                  🌱
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-crust-700 dark:text-crust-400">
                    Recommended Feeding Time:
                  </span>
                  <div className="font-serif text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100 mt-0.5 break-words">
                    {format(reverseCalculation.calculatedStartTime, 'EEEE, MMM d')} at{' '}
                    <span className="text-crust-600 dark:text-crust-400">
                      {format(reverseCalculation.calculatedStartTime, 'h:mm a')}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
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
            disabled={isSelectedTimeTooEarly}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-crust-600 via-amber-600 to-crust-700 hover:from-crust-700 hover:to-crust-800 text-white rounded-2xl font-semibold shadow-lg shadow-crust-600/25 hover:shadow-crust-600/35 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>CALCULATE START TIME & BAKE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
    </Modal>
  );
};
