import React from 'react';
import { 
  X, 
  Clock, 
  CheckCircle, 
  Play, 
  Thermometer,
  Sparkles,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { ScheduledStep } from '../../types/timeline';
import { useSourdough } from '../../context/SourdoughContext';
import { Modal } from '../common/Modal';
import { StepInstructionIcon } from '../icons/StepIcons';

interface StepDetailModalProps {
  step: ScheduledStep | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StepDetailModal: React.FC<StepDetailModalProps> = ({
  step,
  isOpen,
  onClose
}) => {
  const { 
    activeSession, 
    advanceToStepIndex, 
    completeCurrentStep 
  } = useSourdough();

  if (!isOpen || !step) return null;

  const stepIndex = step.index;
  const isCurrentActive = activeSession?.currentStepIndex === stepIndex && !activeSession?.isCompleted;
  const isCompleted = step.status === 'completed';

  const formatStepTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  // Phase badge styling
  const getPhaseBadge = () => {
    switch (step.phase) {
      case 'starter':
        return { label: 'STARTER BUILD', color: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'mix':
        return { label: 'MIX & AUTOLYSE', color: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      case 'ferment':
        return { label: 'BULK FERMENT', color: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      case 'shape':
        return { label: 'SHAPING', color: 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700' };
      case 'retard':
        return { label: 'COLD RETARD', color: 'bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800' };
      case 'bake':
        return { label: 'BAKE & STEAM', color: 'bg-orange-100 dark:bg-orange-950/70 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800' };
      case 'cool':
        return { label: 'COOLING', color: 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
      case 'complete':
        return { label: 'READY TO SLICE', color: 'bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-100 border-amber-300 dark:border-amber-700' };
      default:
        return { label: 'STEP', color: 'bg-stone-100 text-stone-700' };
    }
  };

  const badge = getPhaseBadge();

  const handleMakeActive = () => {
    advanceToStepIndex(stepIndex);
    onClose();
  };

  const handleCompleteThisStep = () => {
    if (isCurrentActive) {
      completeCurrentStep();
    } else {
      advanceToStepIndex(stepIndex);
      completeCurrentStep();
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md" cardClass="p-4 sm:p-5">
      <div className="flex flex-col space-y-3.5">
        {/* Header: Icon + Title + Close Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Step Icon Plate */}
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-stone-800 border border-amber-200/80 dark:border-stone-700 flex items-center justify-center flex-shrink-0 text-amber-800 dark:text-amber-300 shadow-2xs">
              <StepInstructionIcon 
                stepId={step.id} 
                stepName={step.name} 
                phase={step.phase} 
                size={28} 
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 mb-0.5">
                <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.color}`}>
                  {badge.label}
                </span>
                <span className="text-[11px] font-mono font-bold text-stone-500 dark:text-stone-400">
                  {formatStepTime(step.startTime)}
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100 leading-tight truncate">
                {step.name}
              </h2>
            </div>
          </div>

          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Goal Summary */}
        <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
          <p className="text-xs sm:text-[13px] text-stone-700 dark:text-stone-300 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Ingredients Chips (if applicable) */}
        {step.ingredientsUsed && step.ingredientsUsed.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mr-1">
              Ingredients:
            </span>
            {step.ingredientsUsed.map((ing, i) => (
              <span 
                key={i} 
                className="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-stone-800 border border-amber-200/80 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 shadow-2xs"
              >
                <strong className="font-mono text-amber-700 dark:text-amber-400 mr-1">{ing.amount}{ing.unit}</strong>
                {ing.name}
              </span>
            ))}
          </div>
        )}

        {/* Step-by-Step Instructions (Concise) */}
        {step.detailedInstructions && step.detailedInstructions.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Instructions:
            </span>
            <div className="space-y-1.5">
              {step.detailedInstructions.slice(0, 3).map((instruction, idx) => (
                <div 
                  key={idx} 
                  className="p-2.5 rounded-xl bg-white dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/70 flex items-start space-x-2 text-xs text-stone-700 dark:text-stone-300 leading-relaxed shadow-2xs"
                >
                  <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{instruction}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visual Cue Callout (if available) */}
        {step.fermentationCues && (
          <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 flex items-start space-x-2 text-xs text-emerald-950 dark:text-emerald-200">
            <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-bold mr-1">{step.fermentationCues.title}</span>
              <span className="text-emerald-900 dark:text-emerald-300">{step.fermentationCues.visualCue}</span>
            </div>
          </div>
        )}

        {/* Temperature Note (if available) */}
        {step.temperatureNote && (
          <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 text-xs text-orange-900 dark:text-orange-200 flex items-center space-x-2">
            <Thermometer className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
            <span>Target Temperature: <strong className="font-mono">{step.temperatureNote}</strong></span>
          </div>
        )}

        {/* Bottom Actions: Primary CTA + Bottom Close Button */}
        <div className="pt-2 space-y-2">
          {isCurrentActive ? (
            <button
              onClick={handleCompleteThisStep}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1.5 transition-all active-press"
            >
              <CheckCircle className="w-4 h-4" />
              <span>MARK STEP COMPLETE ✓</span>
            </button>
          ) : !isCompleted ? (
            <button
              onClick={handleMakeActive}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-amber-600/30 flex items-center justify-center space-x-1.5 transition-all active-press"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Jump & Start This Step</span>
            </button>
          ) : null}

          {/* Bottom Close Button to Exit Back to Timeline */}
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-2xl font-bold text-xs transition-all active-press flex items-center justify-center space-x-1.5 border border-stone-200/80 dark:border-stone-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Close & Return to Timeline</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
