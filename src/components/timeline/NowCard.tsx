import React, { useState, useEffect, useRef } from 'react';
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
  Wind,
  Bell,
  BellRing
} from 'lucide-react';
import { ScheduledStep } from '../../types/timeline';
import { useSourdough } from '../../context/SourdoughContext';
import { useCountdown, formatDurationToHMS } from '../../hooks/useCountdown';
import { StarterBubbles } from '../animations/StarterBubbles';
import { DoughExpanding } from '../animations/DoughExpanding';
import { FridgeColdEffect } from '../animations/FridgeColdEffect';
import { OvenHeatGlow } from '../animations/OvenHeatGlow';
import { SteamEffect } from '../animations/SteamEffect';
import { StepInstructionIcon } from '../icons/StepIcons';

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
    activeSession,
    isPushSubscribed,
    subscribeToPushNotifications
  } = useSourdough();

  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-scroll window to top of viewport when the step changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    // Double check after DOM render settling
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 80);
    return () => clearTimeout(timer);
  }, [currentStep.id, currentStep.index]);

  // Check if this step is a zero-duration milestone (e.g. Starter Peaked / Checkpoint)
  const isZeroDurationStep = currentStep.durationMinutes === 0;

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
    if (isZeroDurationStep) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      completeCurrentStep();
      return;
    }

    if (!hasStartedCurrentStep && !isAlreadyStarted) {
      setHasStartedCurrentStep(true);
      startCurrentStepNow();
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      completeCurrentStep();
      setHasStartedCurrentStep(false);
    }
  };

  const handleBiologicalOverride = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
  const timeDisplay = isZeroDurationStep
    ? 'Milestone'
    : isTimerRunning 
      ? countdown.formattedCountdown 
      : formatDurationToHMS(currentStep.durationMinutes);

  return (
    <div ref={cardRef} className={`scroll-mt-4 rounded-3xl bg-white dark:bg-[#181614] border border-stone-200/90 dark:border-stone-800/90 bg-gradient-to-b ${getPhaseColorClass()} p-4 sm:p-6 shadow-card-hover transition-all relative overflow-hidden w-full max-w-full min-w-0 box-border`}>
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-extrabold text-[11px] tracking-wider shadow-xs animate-pulse">
            NOW ACTIVE
          </span>
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Step {currentStep.index + 1} of {activeSession?.steps.length}
          </span>
        </div>

        {/* Running Behind Quick Trigger */}
        <button
          onClick={onOpenRunningBehind}
          className="flex items-center space-x-1 text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 px-2.5 py-1.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 transition-all active-press"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>I'm Behind</span>
        </button>
      </div>

      {/* Main Step Title & Large Instructional Hero Icon Header */}
      <div className="mb-4 flex items-center space-x-4 sm:space-x-5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#1f1d1a] border border-amber-300/80 dark:border-amber-700/80 flex items-center justify-center flex-shrink-0 text-amber-800 dark:text-amber-300 shadow-md shadow-amber-900/5 p-2.5">
          <StepInstructionIcon 
            stepId={currentStep.id} 
            stepName={currentStep.name} 
            phase={currentStep.phase} 
            size={44}
            className="w-11 h-11 sm:w-14 sm:h-14" 
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 leading-tight">
            {currentStep.name}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed line-clamp-2">
            {currentStep.description}
          </p>

          {/* Biological Cues Callout if Applicable */}
          {currentStep.isBiologicalEstimate && (
            <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-[10px] sm:text-[11px] font-bold text-amber-900 dark:text-amber-300 shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span>Biological Cues Apply</span>
            </div>
          )}
        </div>
      </div>

      {/* Phase Specific Visual Animation */}
      {currentStep.phase === 'starter' && (
        <div className="mb-4 bg-emerald-950/20 dark:bg-emerald-950/40 rounded-2xl p-4 border border-emerald-500/20 overflow-hidden">
          <StarterBubbles />
        </div>
      )}

      {currentStep.phase === 'ferment' && (
        <div className="mb-4 bg-amber-950/20 dark:bg-amber-950/40 rounded-2xl p-4 border border-amber-500/20 overflow-hidden">
          <DoughExpanding />
        </div>
      )}

      {currentStep.phase === 'retard' && (
        <div className="mb-4 bg-sky-950/20 dark:bg-sky-950/40 rounded-2xl p-4 border border-sky-500/20 overflow-hidden">
          <FridgeColdEffect />
        </div>
      )}

      {currentStep.phase === 'bake' && (
        <div className="mb-4 bg-orange-950/20 dark:bg-orange-950/40 rounded-2xl p-4 border border-orange-500/20 overflow-hidden">
          <OvenHeatGlow />
        </div>
      )}

      {currentStep.phase === 'cool' && (
        <div className="mb-4 bg-indigo-950/20 dark:bg-indigo-950/40 rounded-2xl p-4 border border-indigo-500/20 overflow-hidden">
          <SteamEffect />
        </div>
      )}

      {/* Ingredients Used Pills */}
      {currentStep.ingredientsUsed && currentStep.ingredientsUsed.length > 0 && (
        <div className="mb-4 bg-stone-50 dark:bg-stone-800/80 rounded-2xl p-3.5 border border-stone-200/80 dark:border-stone-700">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
            Ingredients to Add:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {currentStep.ingredientsUsed.map((ing, i) => (
              <span 
                key={i} 
                className="px-3 py-1 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 shadow-2xs"
              >
                {ing.amount}{ing.unit} <span className="font-normal text-stone-500">{ing.name}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fermentation Visual Checklist Box */}
      {currentStep.fermentationCues && (
        <div className="mb-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-4 border border-stone-200 dark:border-stone-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-amber-600" />
              <span>{currentStep.fermentationCues.title}</span>
            </span>
            <span className="text-[10px] font-bold uppercase text-stone-400">Visual Cues</span>
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
            <div className="mt-2.5 pt-2.5 border-t border-stone-200/50 dark:border-stone-700/50 text-[11px] italic text-amber-900 dark:text-amber-300">
              💡 {currentStep.fermentationCues.proTip}
            </div>
          )}
        </div>
      )}

      {/* Prominent Kitchen Glanceable Timer Box */}
      <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className={`w-4 h-4 ${!isZeroDurationStep && isTimerRunning ? 'text-amber-600 animate-pulse' : 'text-stone-400'}`} />
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              {isZeroDurationStep 
                ? 'Checkpoint' 
                : isTimerRunning 
                  ? (countdown.isPast ? 'Target reached' : 'Time Remaining') 
                  : 'Step Duration'}
            </span>
          </div>

          {nextStep && (
            <div className="text-right text-[11px] text-stone-500 dark:text-stone-400">
              <span>Next: </span>
              <span className="font-bold text-stone-800 dark:text-stone-200 truncate max-w-[130px] inline-block align-bottom">
                {nextStep.shortName}
              </span>
            </div>
          )}
        </div>

        {/* Large High-Contrast Digital Countdown */}
        <div className="text-center py-1">
          <span className="font-mono text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 tracking-wider">
            {isZeroDurationStep ? 'Milestone' : timeDisplay}
          </span>
        </div>

        {/* Step push alert pill (only shown for timed steps) */}
        {!isZeroDurationStep && (
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
            {isPushSubscribed ? (
              <span className="inline-flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                <BellRing className="w-3.5 h-3.5 animate-pulse" />
                <span>Alert & chime armed</span>
              </span>
            ) : (
              <button
                onClick={subscribeToPushNotifications}
                className="inline-flex items-center space-x-1 text-amber-700 dark:text-amber-400 hover:underline font-semibold"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Enable step alerts</span>
              </button>
            )}

            {nextStep && (
              <span className="text-[10px] text-stone-400 font-mono">
                Starts {nextStep.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Primary Action Buttons (52px Touch Target) */}
      <div className="space-y-2.5">
        <button
          onClick={handleActionClick}
          className={`w-full py-4 px-5 rounded-2xl font-bold text-base flex items-center justify-center space-x-2 transition-all duration-200 active-press shadow-md ${
            isZeroDurationStep || isTimerRunning
              ? 'bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-emerald-600/30'
              : 'bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 dark:from-amber-600 dark:via-amber-500 dark:to-amber-600 hover:from-black hover:to-black text-white shadow-stone-900/20 dark:shadow-amber-600/30'
          }`}
        >
          {isZeroDurationStep ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span className="tracking-wide">COMPLETE STEP ✓</span>
            </>
          ) : isTimerRunning ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span className="tracking-wide">STEP COMPLETE ✓</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" />
              <span className="tracking-wide">START STEP</span>
            </>
          )}
        </button>

        {/* Biological Early Override (e.g. Bulk is Ready Now) */}
        {currentStep.canOverrideCompletion && (
          <button
            onClick={handleBiologicalOverride}
            className="w-full py-3 px-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800/80 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all active-press"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>
              {currentStep.phase === 'starter' ? 'STARTER IS PEAKED NOW' : 'BULK IS READY NOW (Dough is ready)'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
