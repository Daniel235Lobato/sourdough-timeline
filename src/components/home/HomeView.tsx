import React, { useState } from 'react';
import { 
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
    startNewBake('start-when', new Date(), selectedRecipe.defaultRetardHours || 14, selectedRecipe, startStage);
    onNavigateToTimeline();
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-center max-w-md mx-auto animate-fade-in text-[#2E1E14]">
      {/* Minimalist Main Card */}
      <div className="rounded-[32px] bg-[#E7CEB5] p-6 sm:p-7 border border-[#D1C1A8] shadow-card space-y-5">
        
        {/* 1. Minimalist Centered Header */}
        <div className="flex flex-col items-center text-center pt-1">
          <div className="w-12 h-12 rounded-full bg-[#FAF5EE] border border-[#D1C1A8] flex items-center justify-center mb-3">
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

          <h1 className="font-serif text-2xl font-bold text-[#2E1E14] tracking-tight">
            Begin Your Bake
          </h1>
        </div>

        {/* 2. Clean Active Recipe & Loaves Card */}
        <div className="bg-[#FAF5EE] rounded-2xl p-4 border border-[#D1C1A8] space-y-3">
          <button
            type="button"
            onClick={onNavigateToRecipes}
            className="w-full flex items-center justify-between text-left group active-press"
          >
            <div className="min-w-0 pr-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#986A4C] block">
                {selectedRecipe.hydration}% Hydration
              </span>
              <h2 className="font-serif text-lg font-bold text-[#2E1E14] truncate mt-0.5">
                {selectedRecipe.name}
              </h2>
            </div>

            <span className="text-xs font-semibold text-[#986A4C] group-hover:text-[#2E1E14] flex items-center shrink-0 transition-colors">
              <span>Change</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </span>
          </button>

          <div className="pt-2.5 border-t border-[#D1C1A8]/60 flex items-center justify-between">
            <span className="text-xs font-medium text-[#2E1E14]/75">
              Loaves
            </span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => scaleRecipeLoaves(selectedRecipe.id, count)}
                  className={`w-8 h-7 rounded-lg text-xs font-bold transition-all active-press ${
                    selectedRecipe.loavesCount === count
                      ? 'bg-[#2E1E14] text-[#FAF5EE]'
                      : 'text-[#2E1E14]/65 hover:text-[#2E1E14] hover:bg-[#E7CEB5]/50'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Single-Line Animated Sliding Toggle */}
        <div className="relative p-1 rounded-2xl bg-[#FAF5EE] border border-[#D1C1A8] flex">
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl bg-[#2E1E14] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none ${
              startStage === 'peak' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-0'
            }`}
          />

          <button
            type="button"
            onClick={() => setStartStage('feed')}
            className={`relative z-10 w-1/2 py-2.5 text-center rounded-xl text-xs font-bold transition-colors duration-200 active-press select-none ${
              startStage === 'feed'
                ? 'text-[#FAF5EE]'
                : 'text-[#2E1E14]/70 hover:text-[#2E1E14]'
            }`}
          >
            Start from Feed
          </button>

          <button
            type="button"
            onClick={() => setStartStage('peak')}
            className={`relative z-10 w-1/2 py-2.5 text-center rounded-xl text-xs font-bold transition-colors duration-200 active-press select-none ${
              startStage === 'peak'
                ? 'text-[#FAF5EE]'
                : 'text-[#2E1E14]/70 hover:text-[#2E1E14]'
            }`}
          >
            Start from Peak
          </button>
        </div>

        {/* 4. Primary CTA & Minimalist Secondary Links */}
        <div className="space-y-3.5 pt-1">
          <button
            type="button"
            onClick={handleQuickStartNow}
            className="group/btn w-full py-3.5 px-5 rounded-2xl bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] font-bold text-sm shadow-xs transition-all duration-200 active-press flex items-center justify-center space-x-2"
          >
            <span>Start Bake</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-center space-x-4 text-xs font-semibold text-[#2E1E14]/75">
            <button
              type="button"
              onClick={() => setIsStartWhenOpen(true)}
              className="hover:text-[#2E1E14] transition-colors active-press"
            >
              Schedule Time
            </button>
            <span className="text-[#AD9677]">•</span>
            <button
              type="button"
              onClick={() => setIsStartFromStepOpen(true)}
              className="hover:text-[#2E1E14] transition-colors active-press"
            >
              Start at Step
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
