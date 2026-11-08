import React, { useState } from 'react';
import { Droplets, Sparkles, Plus, ArrowRight, Layers, Sliders } from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';

interface HydrationCalculatorViewProps {
  onApplyFormula: () => void;
}

export const HydrationCalculatorView: React.FC<HydrationCalculatorViewProps> = ({ onApplyFormula }) => {
  const { saveRecipe } = useSourdough();

  const [flourGrams, setFlourGrams] = useState<number>(500);
  const [hydrationPercent, setHydrationPercent] = useState<number>(68);
  const [starterPercent, setStarterPercent] = useState<number>(20);
  const [saltPercent, setSaltPercent] = useState<number>(2.0);
  const [loavesCount, setLoavesCount] = useState<number>(1);

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
        badgeColor: 'bg-[#FAF5EE] text-[#2E1E14] border border-[#D1C1A8]'
      };
    } else if (hyd <= 72) {
      return {
        level: 'Artisan Standard (Balanced)',
        desc: 'Sweet spot for home bakers. Silky elasticity, great oven spring, and open tender crumb.',
        badgeColor: 'bg-[#FAF5EE] text-[#2E1E14] border border-[#D1C1A8]'
      };
    } else if (hyd <= 78) {
      return {
        level: 'Intermediate Open Crumb',
        desc: 'Supple, extensible dough requiring careful coil folds and quick bench knife handling.',
        badgeColor: 'bg-[#FAF5EE] text-[#986A4C] border border-[#D1C1A8]'
      };
    } else {
      return {
        level: 'Mastery High Hydration',
        desc: 'Wet custard-like dough. Generates wild honeycomb open crumb with thin glassy crust.',
        badgeColor: 'bg-[#2E1E14] text-[#FAF5EE] border border-[#2E1E14]'
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
    <div className="pb-24 pt-1 px-3 sm:px-4 max-w-xl mx-auto space-y-5 animate-fade-in text-[#2E1E14]">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#2E1E14] tracking-tight leading-tight">
          Baker's Percentages & Hydration
        </h2>
        <p className="text-xs text-[#2E1E14]/75 mt-0.5">
          Adjust baker's percentages to calculate exact gram weights and crumb characteristics
        </p>
      </div>

      {/* Main Formula Card */}
      <div className="bg-[#E7CEB5] rounded-3xl p-5 sm:p-6 border border-[#D1C1A8] shadow-xs space-y-5">
        {/* Hydration Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E1E14] flex items-center space-x-1.5">
              <Droplets className="w-4 h-4 text-[#986A4C]" />
              <span>Dough Hydration</span>
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2E1E14]">
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
            className="w-full h-2.5 bg-[#FAF5EE] rounded-lg appearance-none cursor-pointer accent-[#2E1E14]"
          />
          <div className="flex justify-between text-[11px] text-[#2E1E14]/70 font-semibold mt-1">
            <span>60% (Stiff)</span>
            <span>85% (Super Wet)</span>
          </div>
        </div>

        {/* Handling Cue Badge */}
        <div className="p-4 rounded-2xl bg-[#FAF5EE] border border-[#D1C1A8] space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${handling.badgeColor}`}>
              {handling.level}
            </span>
          </div>
          <p className="text-xs text-[#2E1E14] leading-relaxed">
            {handling.desc}
          </p>
        </div>

        {/* Sliders Grid: Total Flour, Starter %, Salt % */}
        <div className="space-y-4 pt-2 border-t border-[#D1C1A8]">
          {/* Flour */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-[#2E1E14]/75">Total Flour (100% Base):</span>
              <span className="font-mono font-extrabold text-[#2E1E14]">{flourGrams}g</span>
            </div>
            <input
              type="range"
              min="250"
              max="2500"
              step="50"
              value={flourGrams}
              onChange={(e) => setFlourGrams(Number(e.target.value))}
              className="w-full h-2 bg-[#FAF5EE] rounded-lg appearance-none cursor-pointer accent-[#2E1E14]"
            />
          </div>

          {/* Starter % */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-[#2E1E14]/75">Starter Inoculation (% of flour):</span>
              <span className="font-mono font-extrabold text-[#2E1E14]">{starterPercent}% ({starterGrams}g)</span>
            </div>
            <input
              type="range"
              min="10"
              max="30"
              step="1"
              value={starterPercent}
              onChange={(e) => setStarterPercent(Number(e.target.value))}
              className="w-full h-2 bg-[#FAF5EE] rounded-lg appearance-none cursor-pointer accent-[#2E1E14]"
            />
          </div>

          {/* Salt % */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-[#2E1E14]/75">Salt (% of flour):</span>
              <span className="font-mono font-extrabold text-[#2E1E14]">{saltPercent}% ({saltGrams}g)</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="2.5"
              step="0.1"
              value={saltPercent}
              onChange={(e) => setSaltPercent(Number(e.target.value))}
              className="w-full h-2 bg-[#FAF5EE] rounded-lg appearance-none cursor-pointer accent-[#2E1E14]"
            />
          </div>
        </div>

        {/* Result Breakdown Card */}
        <div className="rounded-2xl bg-[#FAF5EE] text-[#2E1E14] p-4 sm:p-5 space-y-3 shadow-xs border border-[#D1C1A8]">
          <div className="flex items-center justify-between border-b border-[#D1C1A8] pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#986A4C]">
              Formula Breakdown
            </span>
            <span className="text-xs font-mono font-bold text-[#2E1E14]">
              Total Dough: {totalDoughWeight}g
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-[#E7CEB5] rounded-xl p-2.5 border border-[#D1C1A8]">
              <span className="text-[9px] uppercase text-[#2E1E14]/70 block font-bold tracking-wider">Flour</span>
              <span className="font-mono font-extrabold text-sm sm:text-base text-[#2E1E14]">{flourGrams}g</span>
            </div>
            <div className="bg-[#E7CEB5] rounded-xl p-2.5 border border-[#D1C1A8]">
              <span className="text-[9px] uppercase text-[#2E1E14]/70 block font-bold tracking-wider">Water</span>
              <span className="font-mono font-extrabold text-sm sm:text-base text-[#2E1E14]">{waterGrams}g</span>
            </div>
            <div className="bg-[#E7CEB5] rounded-xl p-2.5 border border-[#D1C1A8]">
              <span className="text-[9px] uppercase text-[#2E1E14]/70 block font-bold tracking-wider">Starter</span>
              <span className="font-mono font-extrabold text-sm sm:text-base text-[#2E1E14]">{starterGrams}g</span>
            </div>
            <div className="bg-[#E7CEB5] rounded-xl p-2.5 border border-[#D1C1A8]">
              <span className="text-[9px] uppercase text-[#2E1E14]/70 block font-bold tracking-wider">Salt</span>
              <span className="font-mono font-extrabold text-sm sm:text-base text-[#2E1E14]">{saltGrams}g</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#2E1E14]/75 pt-1 font-semibold">
            <span>Yield: {loavesCount} loaves</span>
            <span>~{perLoafWeight}g per loaf</span>
          </div>
        </div>

        {/* Action Button (52px Touch Target) */}
        <button
          onClick={handleCreateFromFormula}
          className="w-full py-4 px-4 bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-md transition-all active-press"
        >
          <span className="tracking-wide">BUILD TIMELINE WITH THIS FORMULA</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
