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
    <div ref={cardRef} className={`scroll-mt-4 rounded-3xl bg-white dark:bg-stone-900 border-2 bg-gradient-to-b ${getPhaseColorClass()} p-5 shadow-xl transition-all relative overflow-hidden`}>
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
            <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span>Biological Cues Apply</span>
          </div>
        )}
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

      {/* Live Countdown & Next Step Indicator */}
      <div className="space-y-1.5 py-2 border-t border-stone-200/60 dark:border-stone-800/80 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className={`w-4 h-4 ${!isZeroDurationStep && isTimerRunning ? 'text-amber-500 animate-pulse' : 'text-stone-400'}`} />
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              {isZeroDurationStep 
                ? 'Type: ' 
                : isTimerRunning 
                  ? (countdown.isPast ? 'Target reached' : 'Time remaining: ') 
                  : 'Step duration: '}
            </span>
            <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100 tracking-wider">
              {isZeroDurationStep ? 'Milestone Checkpoint' : timeDisplay}
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

        {/* Step push alert pill (only shown for timed steps) */}
        {!isZeroDurationStep && (
          <div className="flex items-center justify-between text-[11px] pt-1">
            {isPushSubscribed ? (
              <span className="inline-flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <BellRing className="w-3 h-3 animate-pulse" />
                <span>Push alert scheduled for next step</span>
              </span>
            ) : (
              <button
                onClick={subscribeToPushNotifications}
                className="inline-flex items-center space-x-1 text-amber-700 dark:text-amber-400 hover:underline font-medium"
              >
                <Bell className="w-3 h-3" />
                <span>Enable push alert when timer ends</span>
              </button>
            )}

            {nextStep && (
              <span className="text-[10px] text-stone-400">
                Starts at {nextStep.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={handleActionClick}
          className={`w-full py-4 px-4 rounded-2xl font-bold text-base flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98] shadow-lg ${
            isZeroDurationStep || isTimerRunning
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              : 'bg-stone-900 dark:bg-amber-600 hover:bg-black dark:hover:bg-amber-700 text-white shadow-stone-900/20'
          }`}
        >
          {isZeroDurationStep ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>COMPLETE STEP ✓</span>
            </>
          ) : isTimerRunning ? (
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
