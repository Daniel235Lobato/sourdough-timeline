import React, { useState } from 'react';
import { 
  Clock, 
  ArrowRight, 
  ChevronRight
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
    // Start forward schedule right now from chosen starter stage
    startNewBake('start-when', new Date(), selectedRecipe.defaultRetardHours || 14, selectedRecipe, startStage);
    onNavigateToTimeline();
  };

  return (
    <div className="pb-20 sm:pb-24 pt-1 px-3 sm:px-4 max-w-xl mx-auto space-y-3 sm:space-y-4 animate-fade-in text-[#2E1E14]">
      {/* Minimalist Hero Card: Start Bake */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#E7CEB5] p-4 sm:p-7 border border-[#D1C1A8] shadow-xs overflow-hidden">
        {/* Soft Ambient Cream Backdrop Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FAF5EE]/70 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#FAF5EE]/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Compact Sourdough Emblem */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#FAF5EE] border border-[#D1C1A8] flex items-center justify-center shadow-2xs mb-2 sm:mb-2.5">
            <svg
              width="28"
              height="28"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#2E1E14] sm:w-8 sm:h-8"
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

          {/* Heading & Subtitle */}
          <h1 className="font-serif text-xl sm:text-2xl font-extrabold text-[#2E1E14] tracking-tight leading-tight">
            Begin Your Bake
          </h1>
          <p className="text-xs text-[#2E1E14]/80 max-w-sm mt-0.5 leading-snug">
            A calm rhythm from starter rise through cold proof and bake.
          </p>

          {/* Animated Sliding Toggle: Start from Feed vs Start from Peak (No Emojis) */}
          <div className="w-full max-w-sm my-2.5 sm:my-3">
            <div className="relative p-1 rounded-2xl bg-[#FAF5EE] border border-[#D1C1A8] flex">
              {/* Smooth Sliding Pill Indicator */}
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-[#2E1E14] shadow-xs transition-transform duration-300 ease-in-out pointer-events-none ${
                  startStage === 'peak' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
                }`}
              />

              {/* Start from Feed */}
              <button
                type="button"
                onClick={() => setStartStage('feed')}
                className={`relative z-10 w-1/2 py-1.5 sm:py-2 px-2 text-center rounded-xl transition-colors duration-200 active-press select-none flex flex-col items-center justify-center ${
                  startStage === 'feed'
                    ? 'text-[#FAF5EE]'
                    : 'text-[#2E1E14]/75 hover:text-[#2E1E14]'
                }`}
              >
                <span className="text-xs font-bold leading-tight">Start from Feed</span>
                <span className={`text-[10px] leading-tight transition-opacity ${startStage === 'feed' ? 'opacity-80' : 'opacity-60'}`}>
                  5–6h starter rise
                </span>
              </button>

              {/* Start from Peak */}
              <button
                type="button"
                onClick={() => setStartStage('peak')}
                className={`relative z-10 w-1/2 py-1.5 sm:py-2 px-2 text-center rounded-xl transition-colors duration-200 active-press select-none flex flex-col items-center justify-center ${
                  startStage === 'peak'
                    ? 'text-[#FAF5EE]'
                    : 'text-[#2E1E14]/75 hover:text-[#2E1E14]'
                }`}
              >
                <span className="text-xs font-bold leading-tight">Start from Peak</span>
                <span className={`text-[10px] leading-tight transition-opacity ${startStage === 'peak' ? 'opacity-80' : 'opacity-60'}`}>
                  Starter ripe, mix now
                </span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full space-y-2">
            <button
              onClick={handleQuickStartNow}
              className="group/btn w-full py-3 px-5 rounded-2xl bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] font-bold text-xs sm:text-sm shadow-xs transition-all duration-200 active-press flex items-center justify-center space-x-2"
            >
              <span className="tracking-wide">
                {startStage === 'peak' ? 'Start Bake Now (from Peak)' : 'Start Bake Now (from Feed)'}
              </span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setIsStartWhenOpen(true)}
              className="w-full py-2 px-3 rounded-2xl bg-[#FAF5EE] hover:bg-[#D1C1A8]/40 border border-[#D1C1A8] text-[#2E1E14] font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all active-press"
            >
              <Clock className="w-3 h-3 text-[#986A4C]" />
              <span>Schedule Start Time &amp; Seed Starter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selected Recipe Card */}
      <div className="bg-[#E7CEB5] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-[#D1C1A8] shadow-xs space-y-2.5 sm:space-y-3">
        <div className="flex items-center justify-between pb-2 sm:pb-2.5 border-b border-[#D1C1A8]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#986A4C] block leading-none mb-1">
              Active Recipe
            </span>
            <h3 className="font-serif text-base sm:text-lg font-extrabold text-[#2E1E14] leading-tight">
              {selectedRecipe.name}
            </h3>
          </div>
          <button
            onClick={onNavigateToRecipes}
            className="text-xs font-bold text-[#2E1E14] hover:text-[#986A4C] flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#FAF5EE] border border-[#D1C1A8] transition-all active-press"
          >
            <span>Change</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recipe Metric Grid */}
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          <div className="bg-[#FAF5EE] rounded-xl px-1 py-1.5 sm:py-2 text-center border border-[#D1C1A8] min-w-0 overflow-hidden">
            <span className="text-[8.5px] sm:text-[10px] font-bold text-[#AD9677] tracking-tight sm:tracking-normal block truncate">Flour</span>
            <p className="font-serif text-xs sm:text-base font-extrabold text-[#2E1E14] mt-0.5 truncate">
              {selectedRecipe.flourGrams}g
            </p>
          </div>

          <div className="bg-[#FAF5EE] rounded-xl px-1 py-1.5 sm:py-2 text-center border border-[#D1C1A8] min-w-0 overflow-hidden">
            <span className="text-[8.5px] sm:text-[10px] font-bold text-[#AD9677] tracking-tight sm:tracking-normal block truncate">Water</span>
            <p className="font-serif text-xs sm:text-base font-extrabold text-[#2E1E14] mt-0.5 truncate">
              {selectedRecipe.waterGrams}g
            </p>
          </div>

          <div className="bg-[#FAF5EE] rounded-xl px-1 py-1.5 sm:py-2 text-center border border-[#D1C1A8] min-w-0 overflow-hidden">
            <span className="text-[8.5px] sm:text-[10px] font-bold text-[#AD9677] tracking-tight sm:tracking-normal block truncate">Starter</span>
            <p className="font-serif text-xs sm:text-base font-extrabold text-[#2E1E14] mt-0.5 truncate">
              {selectedRecipe.starterGrams}g
            </p>
          </div>

          <div className="bg-[#FAF5EE] rounded-xl px-1 py-1.5 sm:py-2 text-center border border-[#D1C1A8] min-w-0 overflow-hidden">
            <span className="text-[8.5px] sm:text-[10px] font-bold text-[#AD9677] tracking-tight sm:tracking-normal block truncate">Salt</span>
            <p className="font-serif text-xs sm:text-base font-extrabold text-[#2E1E14] mt-0.5 truncate">
              {selectedRecipe.saltGrams ?? Math.round(selectedRecipe.flourGrams * 0.02)}g
            </p>
          </div>

          <div className="bg-[#FAF5EE] rounded-xl px-1 py-1.5 sm:py-2 text-center border border-[#D1C1A8] min-w-0 overflow-hidden">
            <span className="text-[8.5px] sm:text-[10px] font-bold text-[#986A4C] tracking-tight sm:tracking-normal block truncate">Hydration</span>
            <p className="font-serif text-xs sm:text-base font-extrabold text-[#986A4C] mt-0.5 truncate">
              {selectedRecipe.hydration}%
            </p>
          </div>
        </div>

        {/* Batch Size Selector (1 - 4) with Large Touch Targets */}
        <div className="flex items-center justify-between pt-0.5 px-0.5 text-xs">
          <span className="text-[#2E1E14] font-bold">Batch Size (Loaves):</span>
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4].map(count => (
              <button
                key={count}
                type="button"
                onClick={() => scaleRecipeLoaves(selectedRecipe.id, count)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold transition-all active-press ${
                  selectedRecipe.loavesCount === count
                    ? 'bg-[#2E1E14] text-[#FAF5EE] shadow-xs'
                    : 'bg-[#FAF5EE] text-[#2E1E14] hover:bg-[#D1C1A8]/40 border border-[#D1C1A8]'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mid-Bake Synchronize Option */}
      <div className="text-center pt-0.5 pb-1">
        <button
          onClick={() => setIsStartFromStepOpen(true)}
          className="text-xs font-semibold text-[#2E1E14]/75 hover:text-[#986A4C] underline underline-offset-4 transition-colors"
        >
          Already started baking? Start from current step
        </button>
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
