import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  Play, 
  ChevronRight, 
  Info, 
  HelpCircle,
  TrendingUp,
  Snowflake,
  Flame,
  Wind
} from 'lucide-react';
import { ScheduledStep } from '../../types/timeline';
import { useSourdough } from '../../context/SourdoughContext';
import { useCountdown, formatDurationToHMS } from '../../hooks/useCountdown';
import { StarterBubbles } from '../animations/StarterBubbles';
import { DoughExpanding } from '../animations/DoughExpanding';
import { FridgeColdEffect } from '../animations/FridgeColdEffect';
import { OvenHeatGlow } from '../animations/OvenHeatGlow';
import { SteamEffect } from '../animations/SteamEffect';

interface NowCardProps {
  currentStep: ScheduledStep;
  nextStep?: ScheduledStep;
  onOpenRunningBehind: () => void;
}

export const NowCard: React.FC<NowCardProps> = ({
  currentStep,
  nextStep,
  onOpenRunningBehind
}) => {
  const { 
    startCurrentStepNow,
    completeCurrentStep, 
    triggerBiologicalReady, 
    activeSession 
  } = useSourdough();

  // Check if this step was already started
  const isAlreadyStarted = Boolean(currentStep.actualStartTime);
  const [hasStartedCurrentStep, setHasStartedCurrentStep] = useState(isAlreadyStarted);

  // Sync state if step changes
  useEffect(() => {
    setHasStartedCurrentStep(Boolean(currentStep.actualStartTime));
  }, [currentStep.id, currentStep.actualStartTime]);

  // Live countdown to step completion in HH:MM:SS format
  const countdown = useCountdown(
    currentStep.startTime,
    currentStep.endTime,
    !hasStartedCurrentStep && !isAlreadyStarted,
    currentStep.durationMinutes
  );

  const handleActionClick = () => {
    if (!hasStartedCurrentStep && !isAlreadyStarted) {
      setHasStartedCurrentStep(true);
      startCurrentStepNow();
    } else {
      completeCurrentStep();
      setHasStartedCurrentStep(false);
    }
  };

  const handleBiologicalOverride = () => {
    triggerBiologicalReady(currentStep.id);
  };

  // Phase color theme
  const getPhaseColorClass = () => {
    switch (currentStep.phase) {
      case 'starter':
        return 'from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30 text-emerald-800 dark:text-emerald-300';
      case 'mix':
        return 'from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30 text-amber-800 dark:text-amber-300';
      case 'ferment':
        return 'from-amber-600/10 via-amber-500/5 to-transparent border-amber-600/30 text-amber-800 dark:text-amber-300';
      case 'shape':
        return 'from-stone-500/10 via-stone-500/5 to-transparent border-stone-400/30 text-stone-800 dark:text-stone-300';
      case 'retard':
        return 'from-sky-500/10 via-blue-500/5 to-transparent border-sky-400/30 text-sky-800 dark:text-sky-300';
      case 'bake':
        return 'from-orange-500/10 via-red-500/5 to-transparent border-orange-500/30 text-orange-800 dark:text-orange-300';
      case 'cool':
        return 'from-indigo-500/10 via-stone-500/5 to-transparent border-indigo-400/30 text-indigo-800 dark:text-indigo-300';
      default:
        return 'from-amber-500/10 via-transparent to-transparent border-amber-500/30 text-stone-900 dark:text-stone-100';
    }
  };

  // Determine display time in Hour:Min:Second format
  const isTimerRunning = hasStartedCurrentStep || isAlreadyStarted;
  const timeDisplay = isTimerRunning 
    ? countdown.formattedCountdown 
    : formatDurationToHMS(currentStep.durationMinutes);

  return (
    <div className={`rounded-3xl bg-white dark:bg-stone-900 border-2 bg-gradient-to-b ${getPhaseColorClass()} p-5 shadow-xl transition-all relative overflow-hidden`}>
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-extrabold text-xs tracking-wider shadow-sm animate-pulse">
            NOW
          </span>
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Step {currentStep.index + 1} of {activeSession?.steps.length}
          </span>
        </div>

        {/* Running Behind Quick Trigger */}
        <button
          onClick={onOpenRunningBehind}
          className="flex items-center space-x-1 text-[11px] font-semibold text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 px-2 py-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>I'm Behind</span>
        </button>
      </div>

      {/* Main Step Title & Description */}
      <div className="mb-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 leading-tight">
          {currentStep.name}
        </h2>
        <p className="text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
          {currentStep.description}
        </p>

        {/* Biological Cues Callout if Applicable */}
        {currentStep.isBiologicalEstimate && (
          <div className="mt-2.5 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[11px] font-medium text-amber-800 dark:text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>Watch the dough, not just the clock! {currentStep.targetRisePercentage || ''}</span>
          </div>
        )}
      </div>

      {/* Phase Specific Micro-Animation */}
      <div className="mb-4">
        {currentStep.phase === 'starter' && <StarterBubbles />}
        {currentStep.phase === 'ferment' && <DoughExpanding targetRise={currentStep.targetRisePercentage} />}
        {currentStep.phase === 'retard' && <FridgeColdEffect hours={activeSession?.coldRetardHours} />}
        {currentStep.phase === 'bake' && <OvenHeatGlow temp={currentStep.temperatureNote} />}
        {currentStep.phase === 'cool' && <SteamEffect />}
      </div>

      {/* Ingredients Used Pills */}
      {currentStep.ingredientsUsed && currentStep.ingredientsUsed.length > 0 && (
        <div className="mb-4 bg-flour-50 dark:bg-stone-800/80 rounded-2xl p-3 border border-stone-200/80 dark:border-stone-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
            Ingredients to Add:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {currentStep.ingredientsUsed.map((ing, i) => (
              <span 
                key={i} 
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 shadow-2xs"
              >
                {ing.amount}{ing.unit} <span className="font-normal text-stone-500">{ing.name}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fermentation Visual Checklist Box */}
      {currentStep.fermentationCues && (
        <div className="mb-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-3.5 border border-stone-200 dark:border-stone-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-amber-500" />
              <span>{currentStep.fermentationCues.title}</span>
            </span>
            <span className="text-[10px] font-medium text-stone-400">Visual Cues</span>
          </div>

          <ul className="space-y-1.5">
            {currentStep.fermentationCues.checklist.map((item, idx) => (
              <li key={idx} className="text-xs text-stone-600 dark:text-stone-300 flex items-start space-x-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {currentStep.fermentationCues.proTip && (
            <div className="mt-2.5 pt-2 border-t border-stone-200/50 dark:border-stone-700/50 text-[11px] italic text-amber-800 dark:text-amber-300">
              💡 {currentStep.fermentationCues.proTip}
            </div>
          )}
        </div>
      )}

      {/* Live Countdown & Next Step Indicator with Hour:Min:Second format */}
      <div className="flex items-center justify-between py-2 border-t border-stone-200/60 dark:border-stone-800/80 mb-4">
        <div className="flex items-center space-x-2">
          <Clock className={`w-4 h-4 ${isTimerRunning ? 'text-amber-500 animate-pulse' : 'text-stone-400'}`} />
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
            {isTimerRunning ? (countdown.isPast ? 'Target reached' : 'Time remaining: ') : 'Step duration: '}
          </span>
          <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100 tracking-wider">
            {timeDisplay}
          </span>
        </div>

        {nextStep && (
          <div className="text-right text-[11px] text-stone-500 dark:text-stone-400">
            <span>Next: </span>
            <span className="font-medium text-stone-800 dark:text-stone-200 truncate max-w-[120px] inline-block align-bottom">
              {nextStep.shortName}
            </span>
          </div>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={handleActionClick}
          className={`w-full py-4 px-4 rounded-2xl font-bold text-base flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98] shadow-lg ${
            isTimerRunning
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              : 'bg-stone-900 dark:bg-amber-600 hover:bg-black dark:hover:bg-amber-700 text-white shadow-stone-900/20'
          }`}
        >
          {isTimerRunning ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>STEP COMPLETE ✓</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" />
              <span>START STEP</span>
            </>
          )}
        </button>

        {/* Biological Early Override (e.g. Bulk is Ready Now) */}
        {currentStep.canOverrideCompletion && (
          <button
            onClick={handleBiologicalOverride}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {currentStep.phase === 'starter' ? 'STARTER IS PEAKED NOW' : 'BULK IS READY NOW (Dough is ready)'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
