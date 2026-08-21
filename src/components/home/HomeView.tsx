import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Calendar, 
  ArrowRight, 
  Play, 
  ChevronRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Scale
} from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';
import { StartWhenModal } from './StartWhenModal';
import { BakeByModal } from './BakeByModal';
import { StartFromStepModal } from '../timeline/StartFromStepModal';
import { calculateStarterFeeding } from '../../engine/starterCalculator';

interface HomeViewProps {
  onNavigateToTimeline: () => void;
  onNavigateToRecipes: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToTimeline,
  onNavigateToRecipes
}) => {
  const { selectedRecipe, scaleRecipeLoaves, updateCustomSeedGrams, startNewBake } = useSourdough();

  const [isStartWhenOpen, setIsStartWhenOpen] = useState<boolean>(false);
  const [isBakeByOpen, setIsBakeByOpen] = useState<boolean>(false);
  const [isStartFromStepOpen, setIsStartFromStepOpen] = useState<boolean>(false);
  const [showStarterBuilder, setShowStarterBuilder] = useState<boolean>(false);
  const [customSeedInput, setCustomSeedInput] = useState<string>('');

  const loaves = selectedRecipe.loavesCount || 1;
  const starterPerLoaf = Math.round((selectedRecipe.starterGrams || 100) / loaves);

  const feedingCalc = useMemo(() => {
    return calculateStarterFeeding(loaves, starterPerLoaf, 15, selectedRecipe.customSeedGrams);
  }, [loaves, starterPerLoaf, selectedRecipe.customSeedGrams]);

  const handleCustomSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomSeedInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 5) {
      updateCustomSeedGrams(selectedRecipe.id, num);
    } else if (val === '') {
      updateCustomSeedGrams(selectedRecipe.id, undefined);
    }
  };

  const handleQuickStartNow = () => {
    // Start forward schedule right now
    startNewBake('start-when', new Date(), selectedRecipe.defaultRetardHours || 14);
    onNavigateToTimeline();
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-xl mx-auto space-y-6 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="text-center pt-2 pb-1">
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-[1.15]">
          When are you baking?
        </h1>
        <p className="font-sans text-[15px] text-[#5A524C] dark:text-stone-300 font-normal leading-[1.4] mt-2 max-w-sm mx-auto">
          We calculate every single fold, rise, and bake step for you.
        </p>
      </div>

      {/* Two Large Action Cards: Start Feeding vs Target Serve Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* START FEEDING */}
        <button
          onClick={() => setIsStartWhenOpen(true)}
          className="group text-left p-5 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200/80 dark:border-stone-800 hover:border-amber-500 dark:hover:border-amber-500 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all transform active:scale-[0.98] flex flex-col justify-between min-h-[190px] sm:min-h-[195px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all pointer-events-none" />
          
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-[21px] font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-[1.2]">
              Start Feeding
            </h2>
            <p className="text-[15px] text-[#5A524C] dark:text-stone-300 leading-[1.45] mt-1.5 font-normal">
              Calculate your schedule forward from starter feeding
            </p>
          </div>

          <div className="flex items-center text-xs font-semibold text-amber-700 dark:text-amber-400 mt-3">
            <span>Calculate forward</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* TARGET SERVE TIME */}
        <button
          onClick={() => setIsBakeByOpen(true)}
          className="group text-left p-5 rounded-3xl bg-white dark:bg-stone-900 border-2 border-stone-200/80 dark:border-stone-800 hover:border-crust-500 dark:hover:border-crust-500 shadow-sm hover:shadow-xl hover:shadow-crust-500/10 transition-all transform active:scale-[0.98] flex flex-col justify-between min-h-[190px] sm:min-h-[195px] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-crust-500/5 rounded-full blur-2xl group-hover:bg-crust-500/15 transition-all pointer-events-none" />

          <div>
            <div className="w-10 h-10 rounded-2xl bg-crust-100 dark:bg-crust-950/80 text-crust-700 dark:text-crust-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-[21px] font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-[1.2]">
              Target Serve Time
            </h2>
            <p className="text-[15px] text-[#5A524C] dark:text-stone-300 leading-[1.45] mt-1.5 font-normal">
              Work backward from when you want fresh sourdough
            </p>
          </div>

          <div className="flex items-center text-xs font-semibold text-crust-700 dark:text-crust-400 mt-3">
            <span>Calculate backward</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Selected Recipe Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm">
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
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center space-x-1"
          >
            <span>Change</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recipe Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4">
          <div className="bg-flour-100 dark:bg-stone-800/60 rounded-2xl p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400">Flour</span>
            <p className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {selectedRecipe.flourGrams}g
            </p>
          </div>

          <div className="bg-flour-100 dark:bg-stone-800/60 rounded-2xl p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400">Hydration</span>
            <p className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {selectedRecipe.hydration}%
            </p>
          </div>

          <div className="bg-flour-100 dark:bg-stone-800/60 rounded-2xl p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400">Yield</span>
            <p className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {selectedRecipe.loavesCount} {selectedRecipe.loavesCount === 1 ? 'Loaf' : 'Loaves'}
            </p>
          </div>

          <div className="bg-flour-100 dark:bg-stone-800/60 rounded-2xl p-3 text-center">
            <span className="text-[10px] uppercase font-bold text-stone-400">Retard</span>
            <p className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              12–48h
            </p>
          </div>
        </div>

        {/* Simple 4 Boxes (1 - 4) at Bottom */}
        <div className="flex items-center justify-between py-2 px-1 text-xs">
          <span className="text-stone-500 dark:text-stone-400 font-medium">Batch Size:</span>
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4].map(count => (
              <button
                key={count}
                type="button"
                onClick={() => scaleRecipeLoaves(selectedRecipe.id, count)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
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

        {/* Starter & Levain Builder Sub-Option */}
        <div className="mt-2 pt-2.5 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={() => setShowStarterBuilder(!showStarterBuilder)}
            className="flex items-center justify-between w-full text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-1"
          >
            <div className="flex items-center space-x-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-amber-500" />
              <span>Low on seed starter? (15g min build)</span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
              <span>{selectedRecipe.customSeedGrams ? `${selectedRecipe.customSeedGrams}g seed` : 'Standard 1:2:2'}</span>
              {showStarterBuilder ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {showStarterBuilder && (
            <div className="mt-2.5 p-3 rounded-2xl bg-amber-50/70 dark:bg-stone-800/80 border border-amber-200/60 dark:border-stone-700/60 space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700 dark:text-stone-200">
                  Available Seed Starter:
                </span>
                <div className="flex items-center space-x-1">
                  {[15, 20, 30].map(grams => (
                    <button
                      key={grams}
                      type="button"
                      onClick={() => updateCustomSeedGrams(selectedRecipe.id, grams)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                        selectedRecipe.customSeedGrams === grams
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-600 hover:border-amber-400'
                      }`}
                    >
                      {grams}g {grams === 15 ? '(Min)' : ''}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateCustomSeedGrams(selectedRecipe.id, undefined)}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                      !selectedRecipe.customSeedGrams
                        ? 'bg-stone-800 dark:bg-stone-600 text-white'
                        : 'bg-white dark:bg-stone-700 text-stone-500'
                    }`}
                  >
                    Auto
                  </button>
                </div>
              </div>

              {/* Custom Exact Grams Input */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-200/40 dark:border-stone-700/40">
                <span className="text-stone-600 dark:text-stone-400 text-[11px]">Or exact seed available:</span>
                <div className="flex items-center space-x-1">
                  <input
                    type="number"
                    min="5"
                    max="200"
                    placeholder={String(feedingCalc.seedStarterGrams)}
                    value={customSeedInput}
                    onChange={handleCustomSeedChange}
                    className="w-16 px-2 py-1 text-center text-xs font-bold rounded-lg bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500 text-stone-900 dark:text-stone-100"
                  />
                  <span className="text-[11px] text-stone-400 font-semibold">g</span>
                </div>
              </div>

              {/* Live Calculation Breakdown Box */}
              <div className="p-2.5 bg-white dark:bg-stone-900/90 rounded-xl border border-amber-100 dark:border-stone-700/60 text-xs space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Calculated Ratio:</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">
                    {feedingCalc.feedRatio} ({feedingCalc.seedStarterGrams}g seed + {feedingCalc.waterGrams}g water + {feedingCalc.flourGrams}g flour)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Total Levain Yield:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {feedingCalc.totalLevainYield}g ({feedingCalc.starterNeededForDough}g for {loaves === 1 ? '1 loaf' : `${loaves} loaves`} + {feedingCalc.reserveForRepopulation}g jar reserve)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Estimated Peak Time:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ⏱️ ~{feedingCalc.estimatedHours} hours to peak
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Direct Start Baking Button */}
        <button
          onClick={handleQuickStartNow}
          className="w-full mt-3 py-3.5 px-4 bg-stone-900 dark:bg-amber-600 hover:bg-black dark:hover:bg-amber-700 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all transform active:scale-[0.98]"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>START BAKING</span>
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
