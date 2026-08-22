import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  ArrowRight, 
  Play, 
  ChevronRight
} from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';
import { StartWhenModal } from './StartWhenModal';
import { BakeByModal } from './BakeByModal';
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
  const [isBakeByOpen, setIsBakeByOpen] = useState<boolean>(false);
  const [isStartFromStepOpen, setIsStartFromStepOpen] = useState<boolean>(false);

  const handleQuickStartNow = () => {
    // Start forward schedule right now
    startNewBake('start-when', new Date(), selectedRecipe.defaultRetardHours || 14);
    onNavigateToTimeline();
  };

  return (
    <div className="pb-24 pt-1 px-3 sm:px-4 max-w-xl mx-auto space-y-5 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="text-center pt-2 pb-1">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-[1.15]">
          When are you baking?
        </h1>
        <p className="font-sans text-sm sm:text-[15px] text-stone-600 dark:text-stone-300 font-normal leading-relaxed mt-1.5 max-w-sm mx-auto">
          We calculate every single fold, rise, and bake step for you.
        </p>
      </div>

      {/* Two Large Action Cards: Start Feeding vs Target Serve Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
        {/* START FEEDING */}
        <button
          onClick={() => setIsStartWhenOpen(true)}
          className="group text-left p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#181614] border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-500/80 dark:hover:border-amber-500/80 shadow-card hover:shadow-card-hover transition-all duration-200 active-press flex flex-col justify-between min-h-[185px] sm:min-h-[195px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all pointer-events-none" />
          
          <div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
              Start Feeding
            </h2>
            <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-400 leading-relaxed mt-1 font-normal">
              Calculate your schedule forward from starter feeding
            </p>
          </div>

          <div className="flex items-center text-xs font-bold text-amber-700 dark:text-amber-400 mt-4">
            <span>Calculate forward</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* TARGET SERVE TIME */}
        <button
          onClick={() => setIsBakeByOpen(true)}
          className="group text-left p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#181614] border border-stone-200/80 dark:border-stone-800/80 hover:border-crust-500/80 dark:hover:border-crust-500/80 shadow-card hover:shadow-card-hover transition-all duration-200 active-press flex flex-col justify-between min-h-[185px] sm:min-h-[195px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-crust-500/5 rounded-full blur-2xl group-hover:bg-crust-500/15 transition-all pointer-events-none" />

          <div>
            <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200/60 dark:border-orange-900/60 flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-snug">
              Target Serve Time
            </h2>
            <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-400 leading-relaxed mt-1 font-normal">
              Work backward from when you want fresh sourdough
            </p>
          </div>

          <div className="flex items-center text-xs font-bold text-orange-700 dark:text-orange-400 mt-4">
            <span>Calculate backward</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Selected Recipe Card */}
      <div className="bg-white dark:bg-[#181614] rounded-3xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800/80 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800/80">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-0.5">
              Active Recipe
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
              {selectedRecipe.name}
            </h3>
          </div>
          <button
            onClick={onNavigateToRecipes}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 transition-all active-press"
          >
            <span>Change</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recipe Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
          <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-3 text-center border border-stone-100 dark:border-stone-800/60">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Flour</span>
            <p className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {selectedRecipe.flourGrams}g
            </p>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-3 text-center border border-stone-100 dark:border-stone-800/60">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Hydration</span>
            <p className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {selectedRecipe.hydration}%
            </p>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-3 text-center border border-stone-100 dark:border-stone-800/60">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Yield</span>
            <p className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {selectedRecipe.loavesCount} {selectedRecipe.loavesCount === 1 ? 'Loaf' : 'Loaves'}
            </p>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-3 text-center border border-stone-100 dark:border-stone-800/60">
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Retard</span>
            <p className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              12–48h
            </p>
          </div>
        </div>

        {/* Batch Size Selector (1 - 4) with Large Touch Targets */}
        <div className="flex items-center justify-between py-1 px-1 text-xs">
          <span className="text-stone-600 dark:text-stone-300 font-semibold">Batch Size:</span>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map(count => (
              <button
                key={count}
                type="button"
                onClick={() => scaleRecipeLoaves(selectedRecipe.id, count)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold transition-all active-press ${
                  selectedRecipe.loavesCount === count
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Start Baking Button (Minimum 52px Touch Target) */}
        <button
          onClick={handleQuickStartNow}
          className="w-full py-4 px-5 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 dark:from-amber-600 dark:via-amber-500 dark:to-amber-600 hover:from-black hover:to-black text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-md shadow-stone-900/20 dark:shadow-amber-600/30 transition-all duration-200 active-press"
        >
          <Play className="w-4 h-4 fill-white" />
          <span className="tracking-wide">START BAKING NOW</span>
        </button>
      </div>

      {/* Mid-Bake Synchronize Option */}
      <div className="text-center pt-1">
        <button
          onClick={() => setIsStartFromStepOpen(true)}
          className="text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 underline underline-offset-4 transition-colors"
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

      <BakeByModal
        isOpen={isBakeByOpen}
        onClose={() => setIsBakeByOpen(false)}
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
