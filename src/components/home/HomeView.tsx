import React, { useState, useMemo } from 'react';
import { format, isToday, isTomorrow } from 'date-fns';
import { 
  Clock, 
  ArrowRight, 
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';
import { calculateForwardSchedule, startFromChosenStep } from '../../engine/scheduler';
import { StartWhenModal } from './StartWhenModal';
import { StartFromStepModal } from '../timeline/StartFromStepModal';

interface HomeViewProps {
  onNavigateToTimeline: () => void;
  onNavigateToRecipes: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToTimeline,
  onNavigateToRecipes
}) => {
  const { selectedRecipe, scaleRecipeLoaves, startNewBake } = useSourdough();

  const [isStartWhenOpen, setIsStartWhenOpen] = useState<boolean>(false);
  const [isStartFromStepOpen, setIsStartFromStepOpen] = useState<boolean>(false);
  const [startStage, setStartStage] = useState<'feed' | 'peak'>('feed');

  const retardHours = selectedRecipe.defaultRetardHours || 14;
  const saltGrams = selectedRecipe.saltGrams ?? Math.round(selectedRecipe.flourGrams * 0.02);

  // Live schedule preview based on selected recipe and starter stage
  const schedulePreview = useMemo(() => {
    const now = new Date();
    let steps = calculateForwardSchedule(selectedRecipe, now, retardHours);
    if (startStage === 'peak') {
      const mixIdx = steps.findIndex(s => s.phase !== 'starter');
      if (mixIdx > 0) {
        steps = startFromChosenStep(selectedRecipe, mixIdx, now, retardHours);
      }
    }

    const mixStep = steps.find(s => s.phase === 'mix') || steps[0];
    const retardStep = steps.find(s => s.isColdRetard);
    const bakeStep = steps.find(s => s.isBakeStep);
    const lastStep = steps[steps.length - 1];

    const formatShortTime = (d?: Date) => {
      if (!d) return '--';
      const timeStr = format(d, 'h:mm a');
      if (isToday(d)) return timeStr;
      if (isTomorrow(d)) return `Tom ${timeStr}`;
      return `${format(d, 'EEE')} ${timeStr}`;
    };

    return {
      mixTime: startStage === 'peak' ? 'Now' : formatShortTime(mixStep?.startTime),
      fridgeTime: formatShortTime(retardStep?.startTime),
      bakeTime: formatShortTime(bakeStep?.startTime || lastStep?.endTime),
    };
  }, [selectedRecipe, startStage, retardHours]);

  const handleQuickStartNow = () => {
    startNewBake('start-when', new Date(), retardHours, selectedRecipe, startStage);
    onNavigateToTimeline();
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-center max-w-md mx-auto animate-fade-in text-[#2E1E14]">
      {/* Compact & Informative Main Card */}
      <div className="rounded-3xl bg-[#E7CEB5] p-4 sm:p-5 border border-[#D1C1A8] shadow-card space-y-3">
        
        {/* 1. Compact Header Row */}
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAF5EE] border border-[#D1C1A8] flex items-center justify-center shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#2E1E14]"
              >
                <path d="M18 13C18 11 20 10 20 8" stroke="#AD9677" strokeWidth="2" strokeLinecap="round" />
                <path d="M24 11C24 9 26 8 26 6" stroke="#AD9677" strokeWidth="2" strokeLinecap="round" />
                <path d="M30 13C30 11 32 10 32 8" stroke="#AD9677" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M9 34C9 22.5 15 17.5 24 17.5C33 17.5 39 22.5 39 34H9Z"
                  fill="#D1C1A8"
                  fillOpacity="0.4"
                  stroke="#2E1E14"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M15.5 26C19 22 29 22 32.5 26" stroke="#986A4C" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M7 34H41" stroke="#2E1E14" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="font-serif text-lg sm:text-xl font-extrabold text-[#2E1E14] tracking-tight leading-none">
                Begin Your Bake
              </h1>
              <p className="text-[11px] text-[#2E1E14]/70 mt-0.5 leading-none">
                {selectedRecipe.steps.length} guided steps · {retardHours}h cold proof
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-[#FAF5EE] border border-[#D1C1A8] text-[11px] font-bold text-[#986A4C]">
            {selectedRecipe.hydration}% Hydration
          </span>
        </div>

        {/* 2. Active Recipe, Formula Weights & Batch Size */}
        <div className="bg-[#FAF5EE] rounded-2xl p-3 border border-[#D1C1A8] space-y-2.5">
          {/* Recipe Selector Row */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onNavigateToRecipes}
              className="flex items-center space-x-1.5 text-left group active-press min-w-0"
            >
              <div className="min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#986A4C] block leading-none">
                  Active Recipe
                </span>
                <div className="flex items-center space-x-1 mt-0.5">
                  <h2 className="font-serif text-base font-extrabold text-[#2E1E14] truncate leading-tight">
                    {selectedRecipe.name}
                  </h2>
                  <ChevronRight className="w-4 h-4 text-[#986A4C] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>

            {/* Compact Loaves Picker */}
            <div className="flex items-center space-x-1 shrink-0">
              <span className="text-[10px] font-bold text-[#836A4D] mr-1">Loaves:</span>
              <div className="inline-flex p-0.5 rounded-xl bg-[#E7CEB5]/60 border border-[#D1C1A8]">
                {[1, 2, 3, 4].map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => scaleRecipeLoaves(selectedRecipe.id, count)}
                    className={`w-6 h-6 rounded-lg text-[11px] font-bold transition-all active-press ${
                      selectedRecipe.loavesCount === count
                        ? 'bg-[#2E1E14] text-[#FAF5EE]'
                        : 'text-[#2E1E14]/70 hover:text-[#2E1E14]'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4-Column Formula Weights Bar */}
          <div className="grid grid-cols-4 divide-x divide-[#D1C1A8]/70 pt-2 border-t border-[#D1C1A8]/60 text-center">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#836A4D] block leading-none">
                Flour
              </span>
              <span className="font-serif text-xs sm:text-sm font-extrabold text-[#2E1E14] mt-0.5 block">
                {selectedRecipe.flourGrams}g
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#836A4D] block leading-none">
                Water
              </span>
              <span className="font-serif text-xs sm:text-sm font-extrabold text-[#2E1E14] mt-0.5 block">
                {selectedRecipe.waterGrams}g
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#836A4D] block leading-none">
                Starter
              </span>
              <span className="font-serif text-xs sm:text-sm font-extrabold text-[#2E1E14] mt-0.5 block">
                {selectedRecipe.starterGrams}g
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#836A4D] block leading-none">
                Salt
              </span>
              <span className="font-serif text-xs sm:text-sm font-extrabold text-[#2E1E14] mt-0.5 block">
                {saltGrams}g
              </span>
            </div>
          </div>
        </div>

        {/* 3. Starter Stage Toggle + Live Timeline Forecast */}
        <div className="bg-[#FAF5EE] rounded-2xl p-2.5 border border-[#D1C1A8] space-y-2">
          {/* Sliding Pill Toggle */}
          <div className="relative p-1 rounded-xl bg-[#E7CEB5]/55 border border-[#D1C1A8] flex">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-[#2E1E14] shadow-2xs transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none ${
                startStage === 'peak' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
              }`}
            />

            <button
              type="button"
              onClick={() => setStartStage('feed')}
              className={`relative z-10 w-1/2 py-1.5 px-2 text-center rounded-lg transition-colors duration-200 active-press select-none flex flex-col items-center justify-center ${
                startStage === 'feed'
                  ? 'text-[#FAF5EE]'
                  : 'text-[#2E1E14]/75 hover:text-[#2E1E14]'
              }`}
            >
              <span className="text-xs font-bold leading-tight">Start from Feed</span>
              <span className={`text-[9px] leading-tight ${startStage === 'feed' ? 'opacity-80' : 'opacity-65'}`}>
                +{selectedRecipe.starterFeedHours || 5.5}h starter rise
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStartStage('peak')}
              className={`relative z-10 w-1/2 py-1.5 px-2 text-center rounded-lg transition-colors duration-200 active-press select-none flex flex-col items-center justify-center ${
                startStage === 'peak'
                  ? 'text-[#FAF5EE]'
                  : 'text-[#2E1E14]/75 hover:text-[#2E1E14]'
              }`}
            >
              <span className="text-xs font-bold leading-tight">Start from Peak</span>
              <span className={`text-[9px] leading-tight ${startStage === 'peak' ? 'opacity-80' : 'opacity-65'}`}>
                Starter ripe, mix now
              </span>
            </button>
          </div>

          {/* Live Estimated Schedule Strip */}
          <div className="grid grid-cols-3 divide-x divide-[#D1C1A8]/70 pt-0.5 text-center">
            <div className="px-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#836A4D] block leading-none">
                Mix Dough
              </span>
              <span className="text-[11px] font-extrabold text-[#2E1E14] mt-0.5 block truncate">
                {schedulePreview.mixTime}
              </span>
            </div>
            <div className="px-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#836A4D] block leading-none">
                In Fridge
              </span>
              <span className="text-[11px] font-extrabold text-[#2E1E14] mt-0.5 block truncate">
                {schedulePreview.fridgeTime}
              </span>
            </div>
            <div className="px-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#986A4C] block leading-none">
                Oven Bake
              </span>
              <span className="text-[11px] font-extrabold text-[#986A4C] mt-0.5 block truncate">
                {schedulePreview.bakeTime}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="space-y-2 pt-0.5">
          <button
            type="button"
            onClick={handleQuickStartNow}
            className="group/btn w-full py-3 px-5 rounded-2xl bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] font-bold text-sm shadow-xs transition-all duration-200 active-press flex items-center justify-center space-x-2"
          >
            <span>Start Bake</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsStartWhenOpen(true)}
              className="py-2 px-3 rounded-xl bg-[#FAF5EE] hover:bg-[#D1C1A8]/40 border border-[#D1C1A8] text-[#2E1E14] font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all active-press"
            >
              <Clock className="w-3.5 h-3.5 text-[#986A4C] shrink-0" />
              <span>Schedule Time</span>
            </button>

            <button
              type="button"
              onClick={() => setIsStartFromStepOpen(true)}
              className="py-2 px-3 rounded-xl bg-[#FAF5EE] hover:bg-[#D1C1A8]/40 border border-[#D1C1A8] text-[#2E1E14] font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all active-press"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#986A4C] shrink-0" />
              <span>Start at Step</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StartWhenModal
        isOpen={isStartWhenOpen}
        onClose={() => setIsStartWhenOpen(false)}
        onTimelineBuilt={onNavigateToTimeline}
      />

      <StartFromStepModal
        isOpen={isStartFromStepOpen}
        onClose={() => setIsStartFromStepOpen(false)}
        onSyncComplete={onNavigateToTimeline}
      />
    </div>
  );
};
