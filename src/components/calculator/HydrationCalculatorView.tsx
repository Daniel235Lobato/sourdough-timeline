import React, { useState } from 'react';
import { Droplets, Sparkles, Plus, ArrowRight, Layers, Sliders } from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';

interface HydrationCalculatorViewProps {
  onApplyFormula: () => void;
}

export const HydrationCalculatorView: React.FC<HydrationCalculatorViewProps> = ({ onApplyFormula }) => {
  const { saveRecipe } = useSourdough();

  const [flourGrams, setFlourGrams] = useState<number>(1000);
  const [hydrationPercent, setHydrationPercent] = useState<number>(68);
  const [starterPercent, setStarterPercent] = useState<number>(20);
  const [saltPercent, setSaltPercent] = useState<number>(2.0);
  const [loavesCount, setLoavesCount] = useState<number>(2);

  // Calculations
  const waterGrams = Math.round((flourGrams * hydrationPercent) / 100);
  const starterGrams = Math.round((flourGrams * starterPercent) / 100);
  const saltGrams = Math.round((flourGrams * saltPercent) / 100);
  const totalDoughWeight = flourGrams + waterGrams + starterGrams + saltGrams;
  const perLoafWeight = Math.round(totalDoughWeight / loavesCount);

  // Difficulty & handling advice based on hydration
  const getHandlingDescription = (hyd: number) => {
    if (hyd < 65) {
      return {
        level: 'Beginner Friendly',
        desc: 'Stiff, firm dough with great shape retention. Easy to score and handle.',
        badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
      };
    } else if (hyd <= 72) {
      return {
        level: 'Artisan Standard (Balanced)',
        desc: 'Sweet spot for home bakers. Silky elasticity, great oven spring, and open tender crumb.',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
      };
    } else if (hyd <= 78) {
      return {
        level: 'Intermediate Open Crumb',
        desc: 'Supple, extensible dough requiring careful coil folds and quick bench knife handling.',
        badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300'
      };
    } else {
      return {
        level: 'Mastery High Hydration',
        desc: 'Wet custard-like dough. Generates wild honeycomb open crumb with thin glassy crust.',
        badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300'
      };
    }
  };

  const handling = getHandlingDescription(hydrationPercent);

  const handleCreateFromFormula = () => {
    const customRecipe = {
      id: `calc-recipe-${Date.now()}`,
      name: `${hydrationPercent}% Custom Sourdough`,
      description: `Tailored formula: ${hydrationPercent}% hydration, ${starterPercent}% starter, ${saltPercent}% salt.`,
      loavesCount,
      flourGrams,
      waterGrams,
      starterGrams,
      saltGrams,
      hydration: hydrationPercent,
      starterRatio: '1:3:3',
      starterFeedHours: 6,
      defaultRetardHours: 14,
      preheatMinutes: 45,
      bakeCoveredMinutes: 20,
      bakeUncoveredMinutes: 25,
      coolingMinutes: 120,
      steps: [],
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    saveRecipe(customRecipe);
    onApplyFormula();
  };

  return (
    <div className="pb-28 pt-2 px-4 max-w-xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
          Baker's Percentages & Hydration
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Adjust baker's percentages to calculate exact gram weights and crumb characteristics
        </p>
      </div>

      {/* Main Formula Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
        {/* Hydration Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center space-x-1.5">
              <Droplets className="w-4 h-4 text-sky-500" />
              <span>Dough Hydration</span>
            </span>
            <span className="font-serif text-2xl font-extrabold text-amber-600 dark:text-amber-400">
              {hydrationPercent}%
            </span>
          </div>
          <input
            type="range"
            min="60"
            max="85"
            step="1"
            value={hydrationPercent}
            onChange={(e) => setHydrationPercent(Number(e.target.value))}
            className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <div className="flex justify-between text-[11px] text-stone-400 mt-1">
            <span>60% (Stiff)</span>
            <span>70% (Classic)</span>
            <span>85% (Super Wet)</span>
          </div>
        </div>

        {/* Handling Cue Badge */}
        <div className="p-3.5 rounded-2xl bg-flour-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${handling.badgeColor}`}>
              {handling.level}
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {handling.desc}
          </p>
        </div>

        {/* Sliders Grid: Total Flour, Starter %, Salt % */}
        <div className="space-y-4 pt-2 border-t border-stone-100 dark:border-stone-800">
          {/* Flour */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-stone-500">Total Flour (100% Base):</span>
              <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{flourGrams}g</span>
            </div>
            <input
              type="range"
              min="250"
              max="2500"
              step="50"
              value={flourGrams}
              onChange={(e) => setFlourGrams(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-700"
            />
          </div>

          {/* Starter % */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-stone-500">Starter Inoculation (% of flour):</span>
              <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{starterPercent}% ({starterGrams}g)</span>
            </div>
            <input
              type="range"
              min="10"
              max="30"
              step="1"
              value={starterPercent}
              onChange={(e) => setStarterPercent(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Salt % */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-stone-500">Salt (% of flour):</span>
              <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{saltPercent}% ({saltGrams}g)</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="2.5"
              step="0.1"
              value={saltPercent}
              onChange={(e) => setSaltPercent(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-stone-700"
            />
          </div>
        </div>

        {/* Result Breakdown Card */}
        <div className="rounded-2xl bg-stone-900 dark:bg-stone-950 text-white p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Formula Breakdown
            </span>
            <span className="text-xs font-mono text-stone-400">
              Total Dough: {totalDoughWeight}g
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-stone-800/80 rounded-xl p-2">
              <span className="text-[9px] uppercase text-stone-400 block">Flour</span>
              <span className="font-mono font-bold text-sm">{flourGrams}g</span>
            </div>
            <div className="bg-stone-800/80 rounded-xl p-2">
              <span className="text-[9px] uppercase text-stone-400 block">Water</span>
              <span className="font-mono font-bold text-sm text-sky-300">{waterGrams}g</span>
            </div>
            <div className="bg-stone-800/80 rounded-xl p-2">
              <span className="text-[9px] uppercase text-stone-400 block">Starter</span>
              <span className="font-mono font-bold text-sm text-emerald-300">{starterGrams}g</span>
            </div>
            <div className="bg-stone-800/80 rounded-xl p-2">
              <span className="text-[9px] uppercase text-stone-400 block">Salt</span>
              <span className="font-mono font-bold text-sm text-stone-300">{saltGrams}g</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
            <span>Yield: {loavesCount} loaves</span>
            <span>~{perLoafWeight}g per loaf</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCreateFromFormula}
          className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-md transition-all"
        >
          <span>BUILD TIMELINE WITH THIS FORMULA</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
