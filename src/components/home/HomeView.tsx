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

  const handleQuickStartNow = () => {
    // Start forward schedule right now
    startNewBake('start-when', new Date(), selectedRecipe.defaultRetardHours || 14);
    onNavigateToTimeline();
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-xl mx-auto space-y-5 animate-fade-in text-[#2E1E14]">
      {/* Minimalist Hero Card: Start Bake */}
      <div className="relative rounded-3xl bg-[#E7CEB5] p-6 sm:p-8 border border-[#D1C1A8] shadow-card overflow-hidden">
        {/* Soft Ambient Cream Backdrop Glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FAF5EE]/70 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#FAF5EE]/50 rounded-full blur-3xl pointer-events-none" />

        {/* Subtle Organic Rising Dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute bottom-4 left-[18%] w-2 h-2 rounded-full bg-[#AD9677]/30 animate-bubble" style={{ animationDelay: '0s', animationDuration: '5s' }} />
          <div className="absolute bottom-3 left-[48%] w-1.5 h-1.5 rounded-full bg-[#AD9677]/25 animate-bubble" style={{ animationDelay: '1.8s', animationDuration: '6s' }} />
          <div className="absolute bottom-5 left-[78%] w-2 h-2 rounded-full bg-[#AD9677]/30 animate-bubble" style={{ animationDelay: '3.2s', animationDuration: '5.5s' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Minimalist Breathing Sourdough Emblem */}
          <div className="relative mb-5 flex items-center justify-center">
            <div className="absolute w-24 h-24 rounded-full bg-[#FAF5EE]/60 animate-glow-ring pointer-events-none" />
            <div className="w-20 h-20 rounded-full bg-[#FAF5EE] border border-[#D1C1A8] flex items-center justify-center animate-gentle-float shadow-xs">
              <svg
                width="42"
                height="42"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#2E1E14]"
              >
                {/* Delicate Steam Wisps */}
                <path
                  d="M18 14C18 11.5 20 10.5 20 8"
                  stroke="#AD9677"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  className="animate-steam-1"
                />
                <path
                  d="M24 12C24 9.5 26 8.5 26 6"
                  stroke="#AD9677"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  className="animate-steam-2"
                />
                <path
                  d="M30 14C30 11.5 32 10.5 32 8"
                  stroke="#AD9677"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  className="animate-steam-3"
                />

                {/* Minimalist Scored Sourdough Boule */}
                <path
                  d="M9 34C9 22.5 15 17.5 24 17.5C33 17.5 39 22.5 39 34H9Z"
                  fill="#D1C1A8"
                  fillOpacity="0.4"
                  stroke="#2E1E14"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Clean Score Slash & Wheat Marks */}
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
          </div>

          {/* Calm Heading & Subtitle */}
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#986A4C] mb-1">
            Guided Sourdough Schedule
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2E1E14] tracking-tight">
            Begin Your Bake
          </h1>
          <p className="text-xs sm:text-sm text-[#2E1E14]/85 max-w-sm mt-1.5 leading-relaxed font-normal">
            A calm, step-by-step rhythm from starter feeding through folding, cold proof, and bake.
          </p>

          {/* Subtle Minimalist Journey Flow */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 my-5 text-[11px] font-semibold text-[#2E1E14]">
            <span className="px-2.5 py-1 rounded-full bg-[#FAF5EE] border border-[#D1C1A8]">
              Feed
            </span>
            <span className="text-[#AD9677]">·</span>
            <span className="px-2.5 py-1 rounded-full bg-[#FAF5EE] border border-[#D1C1A8]">
              Fold
            </span>
            <span className="text-[#AD9677]">·</span>
            <span className="px-2.5 py-1 rounded-full bg-[#FAF5EE] border border-[#D1C1A8]">
              Cold Proof
            </span>
            <span className="text-[#AD9677]">·</span>
            <span className="px-2.5 py-1 rounded-full bg-[#FAF5EE] border border-[#D1C1A8]">
              Bake
            </span>
          </div>

          {/* Soothing, Clean Actions */}
          <div className="w-full space-y-2.5">
            <button
              onClick={handleQuickStartNow}
              className="group/btn w-full py-3.5 px-6 rounded-2xl bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] font-bold text-sm sm:text-base shadow-sm transition-all duration-200 active-press flex items-center justify-center space-x-2"
            >
              <span className="tracking-wide">Start Bake Now</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setIsStartWhenOpen(true)}
              className="w-full py-3 px-4 rounded-2xl bg-[#FAF5EE] hover:bg-[#D1C1A8]/40 border border-[#D1C1A8] text-[#2E1E14] font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all active-press"
            >
              <Clock className="w-3.5 h-3.5 text-[#986A4C]" />
              <span>Schedule Start Time &amp; Seed Starter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selected Recipe Card */}
      <div className="bg-[#E7CEB5] rounded-3xl p-5 sm:p-6 border border-[#D1C1A8] shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D1C1A8]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#986A4C] block mb-0.5">
              Active Recipe
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-extrabold text-[#2E1E14]">
              {selectedRecipe.name}
            </h3>
          </div>
          <button
            onClick={onNavigateToRecipes}
            className="text-xs font-bold text-[#2E1E14] hover:text-[#986A4C] flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#FAF5EE] border border-[#D1C1A8] transition-all active-press"
          >
            <span>Change</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recipe Metric Grid */}
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5">
          <div className="bg-[#FAF5EE] rounded-2xl p-2 sm:p-3 text-center border border-[#D1C1A8]">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#AD9677] tracking-wider block">Flour</span>
            <p className="font-serif text-sm sm:text-lg font-extrabold text-[#2E1E14] mt-0.5">
              {selectedRecipe.flourGrams}g
            </p>
          </div>

          <div className="bg-[#FAF5EE] rounded-2xl p-2 sm:p-3 text-center border border-[#D1C1A8]">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#AD9677] tracking-wider block">Water</span>
            <p className="font-serif text-sm sm:text-lg font-extrabold text-[#2E1E14] mt-0.5">
              {selectedRecipe.waterGrams}g
            </p>
          </div>

          <div className="bg-[#FAF5EE] rounded-2xl p-2 sm:p-3 text-center border border-[#D1C1A8]">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#AD9677] tracking-wider block">Starter</span>
            <p className="font-serif text-sm sm:text-lg font-extrabold text-[#2E1E14] mt-0.5">
              {selectedRecipe.starterGrams}g
            </p>
          </div>

          <div className="bg-[#FAF5EE] rounded-2xl p-2 sm:p-3 text-center border border-[#D1C1A8]">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#AD9677] tracking-wider block">Salt</span>
            <p className="font-serif text-sm sm:text-lg font-extrabold text-[#2E1E14] mt-0.5">
              {selectedRecipe.saltGrams ?? Math.round(selectedRecipe.flourGrams * 0.02)}g
            </p>
          </div>

          <div className="bg-[#FAF5EE] rounded-2xl p-2 sm:p-3 text-center border border-[#D1C1A8]">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#986A4C] tracking-wider block">Hydration</span>
            <p className="font-serif text-sm sm:text-lg font-extrabold text-[#986A4C] mt-0.5">
              {selectedRecipe.hydration}%
            </p>
          </div>
        </div>

        {/* Batch Size Selector (1 - 4) with Large Touch Targets */}
        <div className="flex items-center justify-between pt-1 px-1 text-xs">
          <span className="text-[#2E1E14] font-bold">Batch Size (Loaves):</span>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map(count => (
              <button
                key={count}
                type="button"
                onClick={() => scaleRecipeLoaves(selectedRecipe.id, count)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold transition-all active-press ${
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
      <div className="text-center pt-1">
        <button
          onClick={() => setIsStartFromStepOpen(true)}
          className="text-xs font-bold text-[#2E1E14]/80 hover:text-[#986A4C] underline underline-offset-4 transition-colors"
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
