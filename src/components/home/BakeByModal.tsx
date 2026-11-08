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
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md" cardClass="p-4 sm:p-5 bg-[#FAF5EE] border border-[#D1C1A8] text-[#2E1E14]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#D1C1A8]">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#E7CEB5] text-[#2E1E14] border border-[#D1C1A8] flex items-center justify-center shadow-xs">
            <Calendar className="w-5 h-5 text-[#986A4C]" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2E1E14]">
              Target Serve Time
            </h3>
            <p className="text-xs text-[#2E1E14]/75">
              Work backward from when you want fresh sourdough
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-[#2E1E14]/70 hover:text-[#2E1E14] hover:bg-[#E7CEB5] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Earliest Safe Time Notice */}
      <div className="mt-4 p-3.5 rounded-2xl bg-[#E7CEB5] border border-[#D1C1A8] text-xs text-[#2E1E14] flex items-start space-x-2">
        <Clock className="w-4 h-4 text-[#986A4C] flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-[#2E1E14]">
            Minimum timeline duration: ~{minDurationHours} hours.
          </span>{' '}
          Earliest possible bake-by time from now is{' '}
          <span className="font-bold text-[#2E1E14]">
            {format(earliestPossibleBakeBy, 'EEE, MMM d')} at {format(earliestPossibleBakeBy, 'h:mm a')}
          </span>.
        </div>
      </div>

      {/* Date & Time Selection */}
      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2E1E14]/70 mb-2">
            Target Ready Date:
          </label>

          {/* Quick Day Chips */}
          <div className="grid grid-cols-3 gap-2 mb-2">
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
                  className={`w-full py-2.5 px-1 sm:px-2 rounded-xl text-xs font-bold border transition-all text-center truncate active-press ${
                    isSelected
                      ? 'border-[#2E1E14] bg-[#E7CEB5] text-[#2E1E14] shadow-xs ring-1 ring-[#2E1E14]/30'
                      : 'border-[#D1C1A8] bg-[#FAF5EE] text-[#2E1E14] hover:bg-[#E7CEB5]/60'
                  }`}
                >
                  {isTomorrowDate ? 'Tomorrow' : format(dayDate, 'EEE, MMM d')}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="date"
              min={minDateAttribute}
              value={selectedDateStr}
              onChange={(e) => setSelectedDateStr(e.target.value)}
              className="w-full bg-[#E7CEB5] border border-[#D1C1A8] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#2E1E14] focus:outline-none focus:ring-2 focus:ring-[#2E1E14]"
            />
            <input
              type="time"
              step="1800"
              value={selectedTimeStr}
              onChange={(e) => setSelectedTimeStr(e.target.value)}
              className="w-full bg-[#E7CEB5] border border-[#D1C1A8] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#2E1E14] focus:outline-none focus:ring-2 focus:ring-[#2E1E14]"
            />
          </div>
        </div>

        {/* Quick Time Presets */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2E1E14]/70 mb-1.5">
            Popular Target Times:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['08:00', '10:00', '12:30', '17:00'].map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => handleTimePreset(time)}
                className={`w-full py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center active-press ${
                  selectedTimeStr === time
                    ? 'border-[#2E1E14] bg-[#E7CEB5] text-[#2E1E14] shadow-xs ring-1 ring-[#2E1E14]/30'
                    : 'border-[#D1C1A8] bg-[#FAF5EE] text-[#2E1E14] hover:bg-[#E7CEB5]/60'
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
            <span className="flex items-center space-x-1.5 text-[11px] font-bold uppercase tracking-wider text-[#2E1E14]/70">
              <Snowflake className="w-3.5 h-3.5 text-[#986A4C]" />
              <span>Adjust Cold Retard Window</span>
            </span>
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-full bg-[#E7CEB5] text-[#2E1E14] border border-[#D1C1A8]">
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
            className="w-full h-2 bg-[#FAF5EE] rounded-lg appearance-none cursor-pointer accent-[#2E1E14]"
          />
          <div className="flex justify-between text-[11px] text-[#2E1E14]/70 font-semibold mt-1">
            <span>12h (Min)</span>
            <span>48h (Max)</span>
          </div>
        </div>

        {/* Too Early Error Warning Banner */}
        {isSelectedTimeTooEarly ? (
          <div className="rounded-2xl bg-[#E7CEB5] p-3.5 border border-[#986A4C] text-xs text-[#2E1E14] flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-[#986A4C] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Target time is too early:</span> Sourdough requires at least {minDurationHours} hours from now to ferment properly.
              <button
                type="button"
                onClick={() => {
                  setSelectedDateStr(format(earliestPossibleBakeBy, 'yyyy-MM-dd'));
                  setSelectedTimeStr(format(earliestPossibleBakeBy, 'HH:mm'));
                }}
                className="block mt-1 font-bold text-[#986A4C] underline"
              >
                Set to earliest valid time ({format(earliestPossibleBakeBy, 'EEE, h:mm a')})
              </button>
            </div>
          </div>
        ) : reverseCalculation && (
          <div className="rounded-2xl bg-[#E7CEB5] p-4 border border-[#D1C1A8]">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#2E1E14] text-[#FAF5EE] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs font-bold text-sm">
                🌱
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#986A4C]">
                  Recommended Feeding Time:
                </span>
                <div className="font-serif text-lg sm:text-xl font-extrabold text-[#2E1E14] mt-0.5 break-words">
                  {format(reverseCalculation.calculatedStartTime, 'EEEE, MMM d')} at{' '}
                  <span className="text-[#986A4C]">
                    {format(reverseCalculation.calculatedStartTime, 'h:mm a')}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[#2E1E14]/75 mt-1 leading-relaxed">
                  Based on your recipe, 6h starter build, 4.5h mix & folds, {coldRetardHours}h refrigerator retard, baking, and 2h cooling.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button (52px Touch Target) */}
      <div className="mt-5">
        <button
          onClick={handleBuildTimeline}
          disabled={isSelectedTimeTooEarly}
          className="w-full py-4 px-4 bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] rounded-2xl font-bold shadow-md flex items-center justify-center space-x-2 transition-all active-press disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="tracking-wide">CALCULATE START TIME & BAKE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Modal>
  );
};
