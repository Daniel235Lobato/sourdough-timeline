import React, { useState } from 'react';
import { 
  Clock, 
  ArrowRight, 
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';
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

  const handleQuickStartNow = () => {
    startNewBake('start-when', new Date(), selectedRecipe.defaultRetardHours || 14, selectedRecipe, startStage);
    onNavigateToTimeline();
  };

  const saltGrams = selectedRecipe.saltGrams ?? Math.round(selectedRecipe.flourGrams * 0.02);

  return (
    <div className="w-full flex-1 flex flex-col justify-center max-w-xl mx-auto animate-fade-in text-[#2E1E14]">
      {/* Apple-Inspired Unified Main Card */}
      <div className="relative rounded-[28px] bg-[#E7CEB5] p-4 sm:p-6 border border-[#D1C1A8] shadow-card overflow-hidden space-y-3.5 sm:space-y-4">
        {/* Subtle Warm Highlight */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-[#FAF5EE]/60 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Compact Editorial Header */}
        <div className="relative z-10 flex items-center space-x-3.5 px-0.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FAF5EE] border border-[#D1C1A8] flex items-center justify-center shadow-2xs shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#2E1E14]"
            >
              <path
                d="M18 13C18 11 20 10 20 8"
                stroke="#AD9677"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <path
                d="M24 11C24 9 26 8 26 6"
                stroke="#AD9677"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <path
                d="M30 13C30 11 32 10 32 8"
                stroke="#AD9677"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
              <path
                d="M9 34C9 22.5 15 17.5 24 17.5C33 17.5 39 22.5 39 34H9Z"
                fill="#D1C1A8"
                fillOpacity="0.4"
                stroke="#2E1E14"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.5 26C19 22 29 22 32.5 26"
                stroke="#986A4C"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M7 34H41"
                stroke="#2E1E14"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="min-w-0">
            <h1 className="font-serif text-xl sm:text-2xl font-extrabold text-[#2E1E14] tracking-tight leading-tight">
              Begin Your Bake
            </h1>
            <p className="text-xs text-[#2E1E14]/70 truncate mt-0.5">
              Guided fermentation from starter to oven
            </p>
          </div>
        </div>

        {/* 2. Apple Inset Grouped Active Recipe Card */}
        <div className="relative z-10 bg-[#FAF5EE] rounded-2xl p-3.5 sm:p-4 border border-[#D1C1A8] shadow-2xs space-y-3">
          {/* Tappable Recipe Header Row */}
          <button
            type="button"
            onClick={onNavigateToRecipes}
            className="w-full flex items-center justify-between text-left group active-press"
          >
            <div className="min-w-0 pr-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#986A4C] block leading-none mb-1">
                Active Recipe
              </span>
              <h2 className="font-serif text-base sm:text-lg font-extrabold text-[#2E1E14] truncate leading-tight">
                {selectedRecipe.name}
              </h2>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="px-2.5 py-1 rounded-full bg-[#E7CEB5]/75 border border-[#D1C1A8] text-[11px] font-bold text-[#2E1E14]">
                {selectedRecipe.hydration}% Hydration
              </span>
              <div className="w-7 h-7 rounded-full bg-[#E7CEB5]/50 group-hover:bg-[#E7CEB5] border border-[#D1C1A8] flex items-center justify-center transition-colors">
                <ChevronRight className="w-3.5 h-3.5 text-[#2E1E14]" />
              </div>
            </div>
          </button>

          {/* Clean 4-Column Hairline Formula Strip */}
          <div className="grid grid-cols-4 divide-x divide-[#D1C1A8]/70 py-2.5 border-y border-[#D1C1A8]/60 text-center">
            <div className="px-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#836A4D] block">
                Flour
              </span>
              <span className="font-serif text-sm sm:text-base font-extrabold text-[#2E1E14] mt-0.5 block">
                {selectedRecipe.flourGrams}g
              </span>
            </div>
            <div className="px-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#836A4D] block">
                Water
              </span>
              <span className="font-serif text-sm sm:text-base font-extrabold text-[#2E1E14] mt-0.5 block">
                {selectedRecipe.waterGrams}g
              </span>
            </div>
            <div className="px-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#836A4D] block">
                Starter
              </span>
              <span className="font-serif text-sm sm:text-base font-extrabold text-[#2E1E14] mt-0.5 block">
                {selectedRecipe.starterGrams}g
              </span>
            </div>
            <div className="px-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#836A4D] block">
                Salt
              </span>
              <span className="font-serif text-sm sm:text-base font-extrabold text-[#2E1E14] mt-0.5 block">
                {saltGrams}g
              </span>
            </div>
          </div>

          {/* Batch Size Segmented Row */}
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-xs font-bold text-[#2E1E14]/85">
              Batch Size (Loaves)
            </span>
            <div className="inline-flex p-0.5 rounded-xl bg-[#E7CEB5]/60 border border-[#D1C1A8]">
              {[1, 2, 3, 4].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => scaleRecipeLoaves(selectedRecipe.id, count)}
                  className={`w-8 h-7 rounded-[9px] text-xs font-bold transition-all active-press ${
                    selectedRecipe.loavesCount === count
                      ? 'bg-[#2E1E14] text-[#FAF5EE] shadow-2xs'
                      : 'text-[#2E1E14]/75 hover:text-[#2E1E14]'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. iOS Segmented Sliding Toggle: Start from Feed vs Peak */}
        <div className="relative z-10">
          <div className="relative p-1 rounded-2xl bg-[#FAF5EE] border border-[#D1C1A8] flex">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-[#2E1E14] shadow-xs transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none ${
                startStage === 'peak' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
              }`}
            />

            <button
              type="button"
              onClick={() => setStartStage('feed')}
              className={`relative z-10 w-1/2 py-2 px-2 text-center rounded-xl transition-colors duration-200 active-press select-none flex flex-col items-center justify-center ${
                startStage === 'feed'
                  ? 'text-[#FAF5EE]'
                  : 'text-[#2E1E14]/75 hover:text-[#2E1E14]'
              }`}
            >
              <span className="text-xs font-bold leading-tight">Start from Feed</span>
              <span className={`text-[10px] leading-tight mt-0.5 transition-opacity ${startStage === 'feed' ? 'opacity-80' : 'opacity-60'}`}>
                5–6h starter rise
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStartStage('peak')}
              className={`relative z-10 w-1/2 py-2 px-2 text-center rounded-xl transition-colors duration-200 active-press select-none flex flex-col items-center justify-center ${
                startStage === 'peak'
                  ? 'text-[#FAF5EE]'
                  : 'text-[#2E1E14]/75 hover:text-[#2E1E14]'
              }`}
            >
              <span className="text-xs font-bold leading-tight">Start from Peak</span>
              <span className={`text-[10px] leading-tight mt-0.5 transition-opacity ${startStage === 'peak' ? 'opacity-80' : 'opacity-60'}`}>
                Starter ripe, mix now
              </span>
            </button>
          </div>
        </div>

        {/* 4. Action Stack: Primary "Start Bake" + Symmetrical Secondary Row */}
        <div className="relative z-10 space-y-2 pt-0.5">
          <button
            type="button"
            onClick={handleQuickStartNow}
            className="group/btn w-full py-3.5 px-5 rounded-2xl bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] font-bold text-sm shadow-xs transition-all duration-200 active-press flex items-center justify-center space-x-2"
          >
            <span className="tracking-wide">Start Bake</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsStartWhenOpen(true)}
              className="py-2.5 px-3 rounded-xl bg-[#FAF5EE] hover:bg-[#D1C1A8]/40 border border-[#D1C1A8] text-[#2E1E14] font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all active-press"
            >
              <Clock className="w-3.5 h-3.5 text-[#986A4C] shrink-0" />
              <span className="truncate">Schedule Time</span>
            </button>

            <button
              type="button"
              onClick={() => setIsStartFromStepOpen(true)}
              className="py-2.5 px-3 rounded-xl bg-[#FAF5EE] hover:bg-[#D1C1A8]/40 border border-[#D1C1A8] text-[#2E1E14] font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all active-press"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#986A4C] shrink-0" />
              <span className="truncate">Start at Step</span>
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
