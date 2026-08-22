import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  HelpCircle, 
  Thermometer, 
  Bell, 
  BellRing,
  ListOrdered
} from 'lucide-react';
import { ScheduledStep } from '../../types/timeline';
import { useSourdough } from '../../context/SourdoughContext';
import { useCountdown, formatDurationToHMS } from '../../hooks/useCountdown';
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

  // Auto-scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 80);
    return () => clearTimeout(timer);
  }, [currentStep.id, currentStep.index]);

  const isZeroDurationStep = currentStep.durationMinutes === 0;
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const isAlreadyStarted = Boolean(currentStep.actualStartTime);
  const [hasStartedCurrentStep, setHasStartedCurrentStep] = useState(isAlreadyStarted);

  useEffect(() => {
    setHasStartedCurrentStep(Boolean(currentStep.actualStartTime));
  }, [currentStep.id, currentStep.actualStartTime]);

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

  const isTimerRunning = hasStartedCurrentStep || isAlreadyStarted;
  const timeDisplay = isZeroDurationStep
    ? 'Ready Now'
    : isTimerRunning 
      ? countdown.formattedCountdown 
      : formatDurationToHMS(currentStep.durationMinutes);

  const hasExtraInfo = Boolean(
    (currentStep.detailedInstructions && currentStep.detailedInstructions.length > 0) ||
    currentStep.fermentationCues ||
    currentStep.temperatureNote
  );

  return (
    <div ref={cardRef} className={`scroll-mt-4 rounded-3xl bg-white dark:bg-[#181614] border border-stone-200/90 dark:border-stone-800/90 bg-gradient-to-b ${getPhaseColorClass()} p-4 sm:p-5 shadow-card-hover transition-all relative overflow-hidden w-full max-w-full min-w-0 box-border`}>
      {/* 1. Header: Active Badge + Behind Trigger */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-extrabold text-[10px] tracking-wider shadow-xs animate-pulse">
            NOW ACTIVE
          </span>
          <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Step {currentStep.index + 1} of {activeSession?.steps.length}
          </span>
        </div>

        <button
          onClick={onOpenRunningBehind}
          className="flex items-center space-x-1 text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 px-2.5 py-1 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 transition-all active-press"
        >
          <Clock className="w-3.5 h-3.5" />
          <span>I'm Behind</span>
        </button>
      </div>

      {/* 2. Key Step Identity: Icon + Name + 1-Line Goal */}
      <div className="mb-3 flex items-center space-x-3.5 sm:space-x-4">
        <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-white dark:bg-[#1f1d1a] border border-amber-300/80 dark:border-amber-700/80 flex items-center justify-center flex-shrink-0 text-amber-800 dark:text-amber-300 shadow-xs p-2">
          <StepInstructionIcon 
            stepId={currentStep.id} 
            stepName={currentStep.name} 
            phase={currentStep.phase} 
            size={32}
            className="w-8 h-8 sm:w-10 sm:h-10" 
          />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 leading-tight">
            {currentStep.name}
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 leading-snug line-clamp-2">
            {currentStep.description}
          </p>
        </div>
      </div>

      {/* 3. Essential Ingredients Chips (if applicable) */}
      {currentStep.ingredientsUsed && currentStep.ingredientsUsed.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mr-1">
            Add:
          </span>
          {currentStep.ingredientsUsed.map((ing, i) => (
            <span 
              key={i} 
              className="px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-stone-800 border border-amber-200/80 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 shadow-2xs"
            >
              <strong className="font-mono text-amber-700 dark:text-amber-400 mr-1">{ing.amount}{ing.unit}</strong>
              {ing.name}
            </span>
          ))}
        </div>
      )}

      {/* 4. Minimal Glanceable Countdown / Status Box */}
      <div className="p-3 rounded-2xl bg-stone-50/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 mb-3 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Clock className={`w-3.5 h-3.5 ${!isZeroDurationStep && isTimerRunning ? 'text-amber-600 animate-pulse' : 'text-stone-400'}`} />
            <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              {isZeroDurationStep 
                ? 'Action Ready' 
                : isTimerRunning 
                  ? (countdown.isPast ? 'Target reached' : 'Time Remaining') 
                  : 'Step Duration'}
            </span>
          </div>

          {nextStep && (
            <div className="text-right text-[10px] text-stone-500 dark:text-stone-400">
              <span>Next: </span>
              <span className="font-bold text-stone-800 dark:text-stone-200 truncate max-w-[120px] inline-block align-bottom">
                {nextStep.shortName}
              </span>
            </div>
          )}
        </div>

        {/* Digital Countdown */}
        <div className="text-center py-0.5">
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-wider">
            {timeDisplay}
          </span>
        </div>

        {/* Step alerts toggle */}
        {!isZeroDurationStep && (
          <div className="flex items-center justify-between text-[10px] pt-1 border-t border-stone-200/60 dark:border-stone-700/60">
            {isPushSubscribed ? (
              <span className="inline-flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                <BellRing className="w-3 h-3 animate-pulse" />
                <span>Alert & chime armed</span>
              </span>
            ) : (
              <button
                onClick={subscribeToPushNotifications}
                className="inline-flex items-center space-x-1 text-amber-700 dark:text-amber-400 hover:underline font-semibold"
              >
                <Bell className="w-3 h-3" />
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

      {/* 5. Expandable "More Details & Visual Cues" Tray (Hidden by default for pure minimalism) */}
      {hasExtraInfo && (
        <div className="mb-3 rounded-2xl bg-stone-50/80 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 overflow-hidden">
          <button
            type="button"
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="w-full px-3 py-2 text-left flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all active-press"
          >
            <div className="flex items-center space-x-1.5 min-w-0">
              <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span className="truncate">Need guidance? View instructions & visual cues</span>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-stone-500 dark:text-stone-400 font-semibold pl-2">
              <span>{isDetailsOpen ? 'Hide' : 'Show'}</span>
              {isDetailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {isDetailsOpen && (
            <div className="p-3 pt-2.5 border-t border-stone-200/60 dark:border-stone-700/60 space-y-3 bg-white/70 dark:bg-[#181614]/70 animate-fade-in text-xs">
              {/* Step-by-Step Instructions */}
              {currentStep.detailedInstructions && currentStep.detailedInstructions.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Instructions:
                  </span>
                  <div className="space-y-1">
                    {currentStep.detailedInstructions.map((instruction, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-stone-700 dark:text-stone-300">
                        <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{instruction}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fermentation Visual Cues Checklist */}
              {currentStep.fermentationCues && (
                <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 space-y-1.5">
                  <p className="font-bold text-amber-950 dark:text-amber-200">
                    👀 {currentStep.fermentationCues.visualCue}
                  </p>
                  <ul className="space-y-1">
                    {currentStep.fermentationCues.checklist.map((item, idx) => (
                      <li key={idx} className="text-stone-600 dark:text-stone-300 flex items-start space-x-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {currentStep.fermentationCues.proTip && (
                    <div className="pt-1.5 border-t border-amber-200/40 dark:border-stone-800 text-[11px] italic text-amber-900 dark:text-amber-300 font-medium">
                      💡 {currentStep.fermentationCues.proTip}
                    </div>
                  )}
                </div>
              )}

              {/* Target Temperature */}
              {currentStep.temperatureNote && (
                <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-200 flex items-center space-x-2">
                  <Thermometer className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                  <span>Target Temperature: <strong className="font-mono">{currentStep.temperatureNote}</strong></span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 6. Primary Action Button (Prominent & Accessible) */}
      <div className="space-y-2">
        <button
          onClick={handleActionClick}
          className={`w-full py-4 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all duration-200 active-press shadow-md ${
            isZeroDurationStep || isTimerRunning
              ? 'bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-emerald-600/30'
              : 'bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 dark:from-amber-600 dark:via-amber-500 dark:to-amber-600 hover:from-black hover:to-black text-white shadow-stone-900/20 dark:shadow-amber-600/30'
          }`}
        >
          {isZeroDurationStep ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span className="tracking-wide">COMPLETE STEP ✓</span>
            </>
          ) : isTimerRunning ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span className="tracking-wide">STEP COMPLETE ✓</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span className="tracking-wide">START STEP</span>
            </>
          )}
        </button>

        {/* Biological Early Override (e.g. Bulk is Ready Now) */}
        {currentStep.canOverrideCompletion && (
          <button
            onClick={handleBiologicalOverride}
            className="w-full py-2.5 px-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800/80 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all active-press"
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
