import React, { useState, useMemo, useEffect } from 'react';
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
  const [homeStep, setHomeStep] = useState<'intro' | 'card'>('intro');

  // Auto-transition to bake card after introductory animation sequence, while allowing instant tap
  useEffect(() => {
    if (homeStep === 'intro') {
      const timer = setTimeout(() => {
        setHomeStep('card');
      }, 3600);
      return () => clearTimeout(timer);
    }
  }, [homeStep]);

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

    const formatSchedulePoint = (d?: Date) => {
      if (!d) return { time: '--', day: '' };
      const time = format(d, 'h:mm a');
      if (isToday(d)) return { time, day: 'Today' };
      if (isTomorrow(d)) return { time, day: 'Tomorrow' };
      return { time, day: format(d, 'EEE, MMM d') };
    };

    return {
      mix: formatSchedulePoint(mixStep?.startTime),
      fridge: formatSchedulePoint(retardStep?.startTime),
      bake: formatSchedulePoint(bakeStep?.startTime || lastStep?.endTime),
    };
  }, [selectedRecipe, startStage, retardHours]);

  const handleQuickStartNow = () => {
    startNewBake('start-when', new Date(), retardHours, selectedRecipe, startStage);
    onNavigateToTimeline();
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-start max-w-md mx-auto space-y-3 animate-fade-in text-[#2E1E14]">
      {homeStep === 'intro' ? (
        /* Introductory Step with Artisanal Sourdough Animation */
        <div className="w-full flex-1 flex flex-col justify-start space-y-3 animate-fade-in">
          {/* Introductory Step Header */}
          <div className="px-1 pt-0.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2E1E14] tracking-tight leading-tight">
              Levain Sourdough
            </h1>
            <p className="text-sm sm:text-base text-[#2E1E14]/75 mt-1 leading-normal">
              Fresh flour, wild fermentation, and time. Let&apos;s craft your loaf.
            </p>
          </div>

          {/* Animated Introductory Step Card */}
          <div className="rounded-3xl bg-[#E7CEB5] p-5 sm:p-6 border border-[#D1C1A8] shadow-card space-y-4 text-center flex flex-col items-center justify-center animate-fade-in">
            {/* Step Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF5EE]/90 border border-[#D1C1A8] text-[10px] font-bold uppercase tracking-wider text-[#836A4D]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#986A4C] animate-ping" />
              <span>Bake Overview</span>
            </div>

            {/* Artisanal SVG Animation Centerpiece */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center my-1">
              {/* Outer pulsing glow halo */}
              <div className="absolute inset-0 rounded-full border-2 border-[#AD9677]/40 bg-[#FAF5EE]/60 animate-glow-ring pointer-events-none" />

              {/* Floating bread loaf with rising steam */}
              <div className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 animate-gentle-float flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
                  {/* Steam lines wafting upward */}
                  <path
                    d="M 44 26 C 42 20, 46 16, 43 10"
                    stroke="#986A4C"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    className="animate-steam-1 opacity-75"
                  />
                  <path
                    d="M 50 24 C 52 18, 48 14, 51 8"
                    stroke="#836A4D"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    className="animate-steam-2 opacity-85"
                  />
                  <path
                    d="M 56 26 C 58 20, 54 16, 57 10"
                    stroke="#986A4C"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    className="animate-steam-3 opacity-75"
                  />

                  {/* Sourdough Boule Loaf Body */}
                  <path
                    d="M 22 56 C 22 36, 36 28, 50 28 C 64 28, 78 36, 78 56 C 78 62, 72 66, 50 66 C 28 66, 22 62, 22 56 Z"
                    fill="#FAF5EE"
                    stroke="#836A4D"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Lower crust accent */}
                  <path
                    d="M 26 57 C 34 62, 66 62, 74 57"
                    stroke="#986A4C"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />

                  {/* Artisanal Ear & Wheat Scoring */}
                  <path
                    d="M 32 50 C 42 42, 58 35, 68 35"
                    stroke="#986A4C"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 38 45 C 42 41, 46 40, 46 36"
                    stroke="#986A4C"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 46 41 C 50 37, 54 36, 54 32"
                    stroke="#986A4C"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 54 38 C 58 34, 62 33, 62 29"
                    stroke="#986A4C"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Wheat Laurel Wreath Framing */}
                  <path
                    d="M 16 38 C 10 50, 11 65, 23 74 C 31 79, 41 79, 48 77"
                    stroke="#836A4D"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 84 38 C 90 50, 89 65, 77 74 C 69 79, 59 79, 52 77"
                    stroke="#836A4D"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Intro Headline & Copy */}
            <div className="space-y-1 max-w-xs">
              <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-[#2E1E14] tracking-tight">
                Craft Your Perfect Loaf
              </h2>
              <p className="text-xs sm:text-sm text-[#2E1E14]/75 leading-relaxed">
                Personalized wild fermentation schedules synchronized to your kitchen temperature and routine.
              </p>
            </div>

            {/* 4-Step Journey Preview */}
            <div className="grid grid-cols-4 gap-1.5 w-full max-w-xs pt-1">
              <div className="bg-[#FAF5EE]/90 rounded-xl p-2 border border-[#D1C1A8]/70 flex flex-col items-center text-center">
                <span className="text-base">🌾</span>
                <span className="text-[10px] font-bold text-[#2E1E14] mt-1">Starter</span>
                <span className="text-[9px] text-[#2E1E14]/65">Feed &amp; Peak</span>
              </div>
              <div className="bg-[#FAF5EE]/90 rounded-xl p-2 border border-[#D1C1A8]/70 flex flex-col items-center text-center">
                <span className="text-base">🥣</span>
                <span className="text-[10px] font-bold text-[#2E1E14] mt-1">Mix</span>
                <span className="text-[9px] text-[#2E1E14]/65">3 Folds</span>
              </div>
              <div className="bg-[#FAF5EE]/90 rounded-xl p-2 border border-[#D1C1A8]/70 flex flex-col items-center text-center">
                <span className="text-base">❄️</span>
                <span className="text-[10px] font-bold text-[#2E1E14] mt-1">Retard</span>
                <span className="text-[9px] text-[#2E1E14]/65">Overnight</span>
              </div>
              <div className="bg-[#FAF5EE]/90 rounded-xl p-2 border border-[#D1C1A8]/70 flex flex-col items-center text-center">
                <span className="text-base">🔥</span>
                <span className="text-[10px] font-bold text-[#2E1E14] mt-1">Bake</span>
                <span className="text-[9px] text-[#2E1E14]/65">Cast Iron</span>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="w-full max-w-xs space-y-2 pt-1">
              <button
                type="button"
                onClick={() => setHomeStep('card')}
                className="w-full py-3 px-4 bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 active-press"
              >
                <span>Plan Your Bake</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-[#2E1E14]/60 px-1">
                <span>Auto-opening in 3s...</span>
                <button
                  type="button"
                  onClick={() => setHomeStep('card')}
                  className="font-semibold text-[#836A4D] hover:text-[#2E1E14] underline"
                >
                  Skip to Card
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* The Current Start Bake Card Flow */
        <>
          {/* Screen Introduction & Prompt Header */}
          <div className="px-1 pt-0.5 flex items-start justify-between">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2E1E14] tracking-tight leading-tight">
                Plan Your Bake
              </h1>
              <p className="text-sm sm:text-base text-[#2E1E14]/75 mt-1 leading-normal">
                Choose your starter point and recipe to begin your guided sourdough journey.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setHomeStep('intro')}
              className="text-xs font-bold text-[#836A4D] hover:text-[#2E1E14] bg-[#FAF5EE] px-2.5 py-1.5 rounded-xl border border-[#D1C1A8] shadow-2xs flex items-center gap-1 active-press shrink-0 ml-2 mt-1"
              title="Replay introductory animation"
            >
              <span>↺</span>
              <span className="hidden sm:inline">Intro</span>
            </button>
          </div>

          {/* Main Bake Card */}
          <div className="rounded-3xl bg-[#E7CEB5] p-4 sm:p-5 border border-[#D1C1A8] shadow-card space-y-3.5">
        {/* Active Recipe Card */}
        <div className="bg-[#FAF5EE] rounded-2xl p-3.5 border border-[#D1C1A8] space-y-3">
          {/* Active Recipe Row with Emblem & Badges */}
          <button
            type="button"
            onClick={onNavigateToRecipes}
            className="w-full flex items-center justify-between text-left group active-press"
          >
            <div className="flex items-center space-x-3 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-2xl bg-[#E7CEB5]/50 border border-[#D1C1A8] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <svg
                  width="22"
                  height="22"
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

              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#986A4C] block leading-none">
                    Active Recipe
                  </span>
                  <span className="text-[10px] text-[#2E1E14]/60 font-semibold leading-none">
                    • {selectedRecipe.hydration}% Hydration
                  </span>
                </div>
                <h2 className="font-serif text-base sm:text-lg font-extrabold text-[#2E1E14] mt-0.5 leading-snug">
                  {selectedRecipe.name}
                </h2>
              </div>
            </div>

            <span className="text-xs font-semibold text-[#986A4C] group-hover:text-[#2E1E14] flex items-center shrink-0 transition-colors px-2.5 py-1 rounded-xl bg-[#E7CEB5]/50 border border-[#D1C1A8]">
              <span>Change</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </button>

          {/* 4-Column Formula Weights Bar */}
          <div className="grid grid-cols-4 divide-x divide-[#D1C1A8]/70 py-2 border-y border-[#D1C1A8]/60 text-center">
            <div className="px-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#836A4D] block leading-none">
                Flour
              </span>
              <span className="font-serif text-xs sm:text-sm font-extrabold text-[#2E1E14] mt-1 block">
                {selectedRecipe.flourGrams}g
              </span>
            </div>
            <div className="px-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#836A4D] block leading-none">
                Water
              </span>
              <span className="font-serif text-xs sm:text-sm font-extrabold text-[#2E1E14] mt-1 block">
                {selectedRecipe.waterGrams}g
              </span>
            </div>
            <div className="px-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#836A4D] block leading-none">
                Starter
              </span>
              <span className="font-serif text-xs sm:text-sm font-extrabold text-[#2E1E14] mt-1 block">
                {selectedRecipe.starterGrams}g
              </span>
            </div>
            <div className="px-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#836A4D] block leading-none">
                Salt
              </span>
              <span className="font-serif text-xs sm:text-sm font-extrabold text-[#2E1E14] mt-1 block">
                {saltGrams}g
              </span>
            </div>
          </div>

          {/* Batch Size Selector Row */}
          <div className="flex items-center justify-between text-xs pt-0.5">
            <span className="font-bold text-[#2E1E14]/85 text-[11px] sm:text-xs">
              Batch Size (Loaves):
            </span>
            <div className="inline-flex p-0.5 rounded-xl bg-[#E7CEB5]/60 border border-[#D1C1A8]">
              {[1, 2, 3, 4].map(count => (
                <button
                  key={count}
                  type="button"
                  onClick={() => scaleRecipeLoaves(selectedRecipe.id, count)}
                  className={`w-7 h-6 sm:w-8 sm:h-7 rounded-lg text-xs font-bold transition-all active-press ${
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

        {/* 3. Starter Stage Toggle & Complete Schedule Forecast */}
        <div className="bg-[#FAF5EE] rounded-2xl p-3 border border-[#D1C1A8] space-y-2.5">
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
              className={`relative z-10 w-1/2 py-2 px-2 text-center rounded-lg transition-colors duration-200 active-press select-none flex flex-col items-center justify-center ${
                startStage === 'feed'
                  ? 'text-[#FAF5EE]'
                  : 'text-[#2E1E14]/75 hover:text-[#2E1E14]'
              }`}
            >
              <span className="text-xs font-bold leading-tight">Start from Feed</span>
              <span className={`text-[10px] leading-tight mt-0.5 ${startStage === 'feed' ? 'opacity-85' : 'opacity-65'}`}>
                +{selectedRecipe.starterFeedHours || 5.5}h starter rise
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStartStage('peak')}
              className={`relative z-10 w-1/2 py-2 px-2 text-center rounded-lg transition-colors duration-200 active-press select-none flex flex-col items-center justify-center ${
                startStage === 'peak'
                  ? 'text-[#FAF5EE]'
                  : 'text-[#2E1E14]/75 hover:text-[#2E1E14]'
              }`}
            >
              <span className="text-xs font-bold leading-tight">Start from Peak</span>
              <span className={`text-[10px] leading-tight mt-0.5 ${startStage === 'peak' ? 'opacity-85' : 'opacity-65'}`}>
                Starter ripe, mix now
              </span>
            </button>
          </div>

          {/* Milestone Schedule Forecast (2 columns for peak, 3 columns for feed) */}
          <div className={`grid ${startStage === 'peak' ? 'grid-cols-2' : 'grid-cols-3'} divide-x divide-[#D1C1A8]/70 pt-1 text-center`}>
            {startStage === 'feed' && (
              <div className="px-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#836A4D] block leading-none">
                  Mix Dough
                </span>
                <span className="text-xs font-extrabold text-[#2E1E14] mt-1 block leading-tight">
                  {schedulePreview.mix.time}
                </span>
                <span className="text-[10px] text-[#2E1E14]/70 block mt-0.5 leading-tight">
                  {schedulePreview.mix.day}
                </span>
              </div>
            )}

            <div className="px-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#836A4D] block leading-none">
                In Fridge
              </span>
              <span className="text-xs font-extrabold text-[#2E1E14] mt-1 block leading-tight">
                {schedulePreview.fridge.time}
              </span>
              <span className="text-[10px] text-[#2E1E14]/70 block mt-0.5 leading-tight">
                {schedulePreview.fridge.day}
              </span>
            </div>

            <div className="px-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#986A4C] block leading-none">
                Oven Bake
              </span>
              <span className="text-xs font-extrabold text-[#986A4C] mt-1 block leading-tight">
                {schedulePreview.bake.time}
              </span>
              <span className="text-[10px] text-[#986A4C]/80 block mt-0.5 leading-tight">
                {schedulePreview.bake.day}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="space-y-2 pt-0.5">
          <button
            type="button"
            onClick={handleQuickStartNow}
            className="group/btn w-full py-3.5 px-5 rounded-2xl bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] font-bold text-sm shadow-xs transition-all duration-200 active-press flex items-center justify-center space-x-2"
          >
            <span>Start Bake</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsStartWhenOpen(true)}
              className="py-2.5 px-3 rounded-xl bg-[#FAF5EE] hover:bg-[#D1C1A8]/40 border border-[#D1C1A8] text-[#2E1E14] font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all active-press"
            >
              <Clock className="w-3.5 h-3.5 text-[#986A4C] shrink-0" />
              <span className="whitespace-nowrap">Schedule Time</span>
            </button>

            <button
              type="button"
              onClick={() => setIsStartFromStepOpen(true)}
              className="py-2.5 px-3 rounded-xl bg-[#FAF5EE] hover:bg-[#D1C1A8]/40 border border-[#D1C1A8] text-[#2E1E14] font-semibold text-xs flex items-center justify-center space-x-1.5 transition-all active-press"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#986A4C] shrink-0" />
              <span className="whitespace-nowrap">Start at Step</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )}

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
