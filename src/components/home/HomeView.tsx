import React, { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  ArrowRight, 
  Play, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  Droplets, 
  CheckCircle2, 
  Sliders,
  Minus,
  Plus,
  Scale
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

  const [isStartWhenOpen, setIsStartWhenOpen] = useState(false);
  const [isBakeByOpen, setIsBakeByOpen] = useState(false);
  const [isStartFromStepOpen, setIsStartFromStepOpen] = useState(false);

  const handleQuickStartNow = () => {
    // Start forward schedule right now
    startNewBake('start-when', new Date(), selectedRecipe.defaultRetardHours || 14);
    onNavigateToTimeline();
  };

  const totalDoughGrams = selectedRecipe.flourGrams + selectedRecipe.waterGrams + selectedRecipe.starterGrams + selectedRecipe.saltGrams;
  const perLoafGrams = Math.round(totalDoughGrams / (selectedRecipe.loavesCount || 1));

  return (
    <div className="pb-24 pt-2 px-4 max-w-xl mx-auto space-y-6 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="text-center pt-3 pb-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-3 border border-amber-200 dark:border-amber-800/80">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Google Maps for Sourdough</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
          When are you baking?
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 max-w-sm mx-auto">
          Choose a start time or target fresh-baked time. We calculate every single fold, rise, and bake step for you.
        </p>
      </div>

      {/* Two Large Action Cards: START WHEN vs BAKE BY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* START WHEN */}
        <button
          onClick={() => setIsStartWhenOpen(true)}
          className="group text-left p-5 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200/80 dark:border-stone-800 hover:border-amber-500 dark:hover:border-amber-500 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all transform active:scale-[0.98] flex flex-col justify-between h-44 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all pointer-events-none" />
          
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
              START WHEN
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              "I know when I want to begin feeding my starter"
            </p>
          </div>

          <div className="flex items-center text-xs font-semibold text-amber-700 dark:text-amber-400 mt-2">
            <span>Calculate forward</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* BAKE BY */}
        <button
          onClick={() => setIsBakeByOpen(true)}
          className="group text-left p-5 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200/80 dark:border-stone-800 hover:border-crust-500 dark:hover:border-crust-500 shadow-sm hover:shadow-xl hover:shadow-crust-500/10 transition-all transform active:scale-[0.98] flex flex-col justify-between h-44 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-crust-500/5 rounded-full blur-2xl group-hover:bg-crust-500/15 transition-all pointer-events-none" />

          <div>
            <div className="w-10 h-10 rounded-2xl bg-crust-100 dark:bg-crust-950/80 text-crust-700 dark:text-crust-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
              BAKE BY
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              "I know when I want my warm bread ready to eat"
            </p>
          </div>

          <div className="flex items-center text-xs font-semibold text-crust-700 dark:text-crust-400 mt-2">
            <span>Calculate backward</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Selected Recipe Card with Built-in Batch Size Scaler */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        {/* Header with Change Recipe button */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              Active Recipe
            </span>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              {selectedRecipe.name}
            </h3>
          </div>
          <button
            onClick={onNavigateToRecipes}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 transition-colors"
          >
            <span>Change</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Direct Batch Size Scaler Controls */}
        <div className="bg-flour-100/70 dark:bg-stone-800/80 rounded-2xl p-3.5 border border-stone-200/80 dark:border-stone-700/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center space-x-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>Batch Size (Yield)</span>
            </span>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-sm font-extrabold text-amber-700 dark:text-amber-300">
                {selectedRecipe.loavesCount} {selectedRecipe.loavesCount === 1 ? 'Loaf' : 'Loaves'}
              </span>
              <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                (~{perLoafGrams}g / loaf)
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-1.5">
            {/* Quick Loaves Buttons */}
            <div className="flex items-center space-x-1.5 flex-1">
              {[1, 2, 3, 4, 6].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => scaleRecipeLoaves(selectedRecipe.id, count)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all ${
                    selectedRecipe.loavesCount === count
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30'
                      : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  {count} {count === 1 ? 'loaf' : 'loaves'}
                </button>
              ))}
            </div>

            {/* Decrement / Increment Steppers */}
            <div className="flex items-center space-x-1 ml-1">
              <button
                type="button"
                onClick={() => scaleRecipeLoaves(selectedRecipe.id, Math.max(1, selectedRecipe.loavesCount - 1))}
                disabled={selectedRecipe.loavesCount <= 1}
                className="w-8 h-8 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-300 disabled:opacity-40 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                title="Decrease batch"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scaleRecipeLoaves(selectedRecipe.id, Math.min(8, selectedRecipe.loavesCount + 1))}
                disabled={selectedRecipe.loavesCount >= 8}
                className="w-8 h-8 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-700 dark:text-stone-300 disabled:opacity-40 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                title="Increase batch"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Scaled Ingredients Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-flour-100/50 dark:bg-stone-800/50 rounded-2xl p-2.5 text-center border border-stone-200/50 dark:border-stone-700/50">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Flour</span>
            <p className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {selectedRecipe.flourGrams}g
            </p>
          </div>

          <div className="bg-flour-100/50 dark:bg-stone-800/50 rounded-2xl p-2.5 text-center border border-stone-200/50 dark:border-stone-700/50">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Water</span>
            <p className="font-serif text-base font-bold text-sky-700 dark:text-sky-300 mt-0.5">
              {selectedRecipe.waterGrams}g
            </p>
          </div>

          <div className="bg-flour-100/50 dark:bg-stone-800/50 rounded-2xl p-2.5 text-center border border-stone-200/50 dark:border-stone-700/50">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Starter</span>
            <p className="font-serif text-base font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
              {selectedRecipe.starterGrams}g
            </p>
          </div>

          <div className="bg-flour-100/50 dark:bg-stone-800/50 rounded-2xl p-2.5 text-center border border-stone-200/50 dark:border-stone-700/50">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Salt</span>
            <p className="font-serif text-base font-bold text-stone-700 dark:text-stone-300 mt-0.5">
              {selectedRecipe.saltGrams}g
            </p>
          </div>
        </div>

        {/* Total Dough Info & Cold Retard */}
        <div className="flex items-center justify-between text-xs px-1 text-stone-500 dark:text-stone-400">
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-amber-700 dark:text-amber-400">{selectedRecipe.hydration}%</span>
            <span>Hydration</span>
            <span>•</span>
            <span>{totalDoughGrams}g total mass</span>
          </div>
          <span className="text-[11px] bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-lg">
            12–48h Cold Retard
          </span>
        </div>

        {/* Direct Start Baking Button */}
        <button
          onClick={handleQuickStartNow}
          className="w-full mt-2 py-3.5 px-4 bg-stone-900 dark:bg-amber-600 hover:bg-black dark:hover:bg-amber-700 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all transform active:scale-[0.98]"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>START BAKING ({selectedRecipe.loavesCount} {selectedRecipe.loavesCount === 1 ? 'LOAF' : 'LOAVES'})</span>
        </button>
      </div>

      {/* Mid-Bake Synchronize Option */}
      <div className="text-center pt-1">
        <button
          onClick={() => setIsStartFromStepOpen(true)}
          className="text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 underline underline-offset-4 transition-colors"
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
