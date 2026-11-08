import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Play, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Thermometer, 
  Bell, 
  BellRing
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

  // Auto-scroll to top of viewport when step changes
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
    return 'border-[#D1C1A8] text-[#2E1E14]';
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
    <div 
      ref={cardRef} 
      className="scroll-mt-4 rounded-3xl bg-[#E7CEB5] border border-[#D1C1A8] text-[#2E1E14] p-5 sm:p-6 shadow-xs transition-all relative w-full max-w-full min-w-0 box-border"
    >
      {/* 1. Header: Subtle breadcrumb + quiet Behind link */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D1C1A8]/60 mb-4">
        <span className="text-xs font-semibold text-[#2E1E14]/70">
          Step {currentStep.index + 1} of {activeSession?.steps.length} · <span className="capitalize">{currentStep.phase}</span>
        </span>

        <button
          onClick={onOpenRunningBehind}
          className="text-xs font-semibold text-[#986A4C] hover:text-[#2E1E14] transition-colors"
        >
          Running behind?
        </button>
      </div>

      {/* 2. Step Title & Clean Guidance */}
      <div className="space-y-1.5 mb-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2E1E14] leading-tight">
          {currentStep.name}
        </h2>
        <p className="text-xs sm:text-sm text-[#2E1E14]/80 leading-relaxed">
          {currentStep.description}
        </p>

        {/* Ingredients as calm, clean horizontal chips */}
        {currentStep.ingredientsUsed && currentStep.ingredientsUsed.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            {currentStep.ingredientsUsed.map((ing, i) => (
              <span 
                key={i} 
                className="inline-flex items-center px-2.5 py-1 rounded-xl bg-[#FAF5EE] border border-[#D1C1A8] text-xs text-[#2E1E14]"
              >
                <strong className="font-mono font-bold mr-1">{ing.amount}{ing.unit}</strong>
                <span>{ing.name}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Integrated Serene Timer */}
      <div className="my-4 py-2 text-center rounded-2xl bg-[#FAF5EE]/70 border border-[#D1C1A8]/60">
        <div className="text-[11px] font-semibold text-[#2E1E14]/70 uppercase tracking-wider mb-0.5">
          {isZeroDurationStep 
            ? 'Milestone Ready' 
            : isTimerRunning 
              ? (countdown.isPast ? 'Target reached' : 'Time remaining') 
              : 'Duration'}
        </div>
        <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#2E1E14] tracking-wider">
          {timeDisplay}
        </div>
        {nextStep && (
          <div className="text-xs text-[#2E1E14]/75 mt-1">
            Next: <strong className="text-[#2E1E14] font-semibold">{nextStep.shortName || nextStep.name}</strong>
            {!isZeroDurationStep && (
              <span className="text-[#2E1E14]/60 ml-1">
                · {nextStep.startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 4. One Primary Action Button */}
      <div className="space-y-2.5">
        <button
          onClick={handleActionClick}
          className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all duration-200 active-press shadow-xs bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE]"
        >
          {isZeroDurationStep ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Complete Step ✓</span>
            </>
          ) : isTimerRunning ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Step Complete ✓</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-[#FAF5EE]" />
              <span>Start Step</span>
            </>
          )}
        </button>

        {/* 5. Quiet Secondary Actions (Understated, never shouting) */}
        <div className="flex items-center justify-center space-x-4 pt-1 text-xs">
          {currentStep.canOverrideCompletion && (
            <button
              onClick={handleBiologicalOverride}
              className="text-[#986A4C] hover:text-[#2E1E14] font-semibold transition-colors"
            >
              {currentStep.phase === 'starter' ? 'Starter ready early?' : 'Dough ready early?'}
            </button>
          )}

          {hasExtraInfo && (
            <button
              type="button"
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="text-[#2E1E14]/75 hover:text-[#2E1E14] font-semibold inline-flex items-center space-x-1 transition-colors"
            >
              <span>{isDetailsOpen ? 'Hide guide' : 'Detailed instructions & cues'}</span>
              {isDetailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* 6. Expandable Guidance Tray (Only shown when requested) */}
      {hasExtraInfo && isDetailsOpen && (
        <div className="mt-4 pt-3.5 border-t border-[#D1C1A8] space-y-3 animate-fade-in text-xs text-[#2E1E14]">
          {/* Step Instructions */}
          {currentStep.detailedInstructions && currentStep.detailedInstructions.length > 0 && (
            <div className="space-y-1.5 bg-[#FAF5EE] p-3.5 rounded-2xl border border-[#D1C1A8]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E1E14]/70 block">
                How-to Instructions:
              </span>
              <div className="space-y-1.5">
                {currentStep.detailedInstructions.map((instruction, idx) => (
                  <div key={idx} className="flex items-start space-x-2 leading-relaxed">
                    <span className="w-4 h-4 rounded-full bg-[#E7CEB5] text-[#2E1E14] font-mono font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{instruction}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visual Cues */}
          {currentStep.fermentationCues && (
            <div className="p-3.5 rounded-2xl bg-[#FAF5EE] border border-[#D1C1A8] space-y-1.5">
              <p className="font-bold text-[#2E1E14]">
                👀 {currentStep.fermentationCues.visualCue}
              </p>
              <ul className="space-y-1 pt-0.5">
                {currentStep.fermentationCues.checklist.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2 leading-relaxed text-[#2E1E14]/85">
                    <span className="text-[#986A4C] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {currentStep.fermentationCues.proTip && (
                <p className="pt-1.5 border-t border-[#D1C1A8] text-[11px] italic text-[#986A4C] font-semibold">
                  💡 {currentStep.fermentationCues.proTip}
                </p>
              )}
            </div>
          )}

          {/* Target Temperature */}
          {currentStep.temperatureNote && (
            <div className="p-2.5 rounded-xl bg-[#FAF5EE] border border-[#D1C1A8] text-[#2E1E14] flex items-center space-x-2">
              <span className="text-[#986A4C] font-bold">🌡️</span>
              <span>Target Temp: <strong>{currentStep.temperatureNote}</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
