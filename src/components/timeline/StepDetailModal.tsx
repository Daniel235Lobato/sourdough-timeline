import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  CheckCircle, 
  Play, 
  TrendingUp, 
  Sparkles, 
  AlertCircle,
  Thermometer,
  Layers,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ScheduledStep } from '../../types/timeline';
import { useSourdough } from '../../context/SourdoughContext';
import { Modal } from '../common/Modal';
import { StepInstructionIcon } from '../icons/StepIcons';
import { ActionStepAnimation } from '../animations/ActionStepAnimation';

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

  const [isCuesOpen, setIsCuesOpen] = useState(false);

  if (!isOpen || !step) return null;

  const stepIndex = step.index;
  const isCurrentActive = activeSession?.currentStepIndex === stepIndex && !activeSession?.isCompleted;
  const isCompleted = step.status === 'completed';
  const isUpcoming = step.status === 'upcoming';

  const formatStepTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  // Phase badge color
  const getPhaseBadge = () => {
    switch (step.phase) {
      case 'starter':
        return { label: 'STARTER BUILD', color: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'mix':
        return { label: 'MIX & AUTOLYSE', color: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      case 'ferment':
        return { label: 'BULK FERMENTATION', color: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
        {/* Hero Visual-First Icon Header */}
        <div className="flex flex-col items-center text-center p-4 rounded-3xl bg-gradient-to-b from-stone-50 to-amber-50/40 dark:from-stone-800/60 dark:to-[#1e1b18] border border-stone-200/80 dark:border-stone-700/80 shadow-card">
          {/* Large Hero Icon Plate (80px) */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white dark:bg-[#181614] border border-amber-200 dark:border-stone-700 flex items-center justify-center text-amber-800 dark:text-amber-300 shadow-md shadow-amber-900/5 mb-3 p-3">
            <StepInstructionIcon 
              stepId={step.id} 
              stepName={step.name} 
              phase={step.phase} 
              size={56}
              className="w-14 h-14 sm:w-16 sm:h-16" 
            />
          </div>

          {/* Phase Tag */}
          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full border shadow-2xs mb-1.5 ${badge.color}`}>
            {badge.label}
          </span>

          {/* Step Title */}
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 leading-tight">
            {step.name}
          </h2>

          {/* Scheduled Time & Step Number */}
          <div className="flex items-center space-x-2 mt-1.5 text-xs font-bold text-stone-500 dark:text-stone-400">
            <span className="font-mono text-stone-900 dark:text-stone-100">
              {formatStepTime(step.startTime)}
            </span>
            <span>•</span>
            <span>
              {step.durationMinutes > 0 
                ? (step.durationMinutes >= 60 
                    ? `${Math.round((step.durationMinutes / 60) * 10) / 10} Hours` 
                    : `${step.durationMinutes} Minutes`)
                : 'Milestone'}
            </span>
            <span>•</span>
            <span>Step {stepIndex + 1} of {activeSession?.steps.length}</span>
          </div>
        </div>

        {/* Step Summary Description */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
            Goal & Action:
          </span>
          <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
            {step.description}
          </p>
        </div>

        {/* Action-Correlated Physical Animation */}
        <ActionStepAnimation 
          phase={step.phase} 
          stepId={step.id} 
          stepName={step.name} 
        />

        {/* Ingredients Used (if applicable) */}
        {step.ingredientsUsed && step.ingredientsUsed.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-[#1c1916] border border-amber-200/70 dark:border-stone-700 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">
              Ingredients Needed:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {step.ingredientsUsed.map((ing, i) => (
                <div 
                  key={i} 
                  className="px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 shadow-2xs flex flex-col"
                >
                  <span className="font-mono text-amber-700 dark:text-amber-400 text-sm">{ing.amount}{ing.unit}</span>
                  <span className="text-stone-600 dark:text-stone-300 font-normal text-[11px] truncate">{ing.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step-by-Step Instructions (HOW) */}
        {step.detailedInstructions && step.detailedInstructions.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
              Step-by-Step Instructions:
            </span>
            <div className="space-y-2">
              {step.detailedInstructions.map((instruction, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 flex items-start space-x-3 text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed shadow-2xs"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{instruction}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pre-Collapsed Fermentation Visual Cues Checklist */}
        {step.fermentationCues && (
          <div className="rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setIsCuesOpen(!isCuesOpen)}
              className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-bold text-emerald-950 dark:text-emerald-200 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/60 transition-all active-press"
            >
              <div className="flex items-center space-x-2 min-w-0">
                <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="truncate">Unsure if ready? Check visual cues ({step.fermentationCues.title.replace(':', '')})</span>
              </div>
              <div className="flex items-center space-x-1.5 flex-shrink-0 text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold pl-2">
                <span>{isCuesOpen ? 'Hide' : 'Visual Cues'}</span>
                {isCuesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {isCuesOpen && (
              <div className="p-4 pt-2.5 border-t border-emerald-200/60 dark:border-emerald-800/60 bg-white/70 dark:bg-[#181614]/70 space-y-2 animate-fade-in">
                <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  👀 {step.fermentationCues.visualCue}
                </p>

                <ul className="space-y-1.5 pt-1">
                  {step.fermentationCues.checklist.map((item, idx) => (
                    <li key={idx} className="text-xs text-stone-700 dark:text-stone-300 flex items-start space-x-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {step.fermentationCues.proTip && (
                  <div className="mt-2.5 pt-2.5 border-t border-emerald-200/50 dark:border-stone-800 text-[11px] italic text-emerald-900 dark:text-emerald-300 font-medium">
                    💡 {step.fermentationCues.proTip}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Temperature Note */}
        {step.temperatureNote && (
          <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-xs text-orange-900 dark:text-orange-200 flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-orange-600 flex-shrink-0" />
            <span>Target Temperature: <strong className="font-mono">{step.temperatureNote}</strong></span>
          </div>
        )}

        {/* Primary Action Controls (52px Touch Targets) */}
        <div className="pt-2 space-y-2.5">
          {isCurrentActive ? (
            <button
              onClick={handleCompleteThisStep}
              className="w-full py-4 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-2xl font-bold shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active-press"
            >
              <CheckCircle className="w-5 h-5" />
              <span>MARK STEP COMPLETE ✓</span>
            </button>
          ) : isCompleted ? (
            <div className="flex space-x-2">
              <button
                onClick={handleMakeActive}
                className="flex-1 py-3.5 px-4 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 rounded-2xl font-bold text-xs transition-all active-press"
              >
                Jump Back to This Step
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3.5 px-4 bg-stone-900 dark:bg-stone-700 text-white rounded-2xl font-bold text-xs transition-all active-press"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleMakeActive}
                className="flex-1 py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-amber-600/30 flex items-center justify-center space-x-1.5 transition-all active-press"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Jump & Start Step</span>
              </button>
              <button
                onClick={onClose}
                className="py-3.5 px-5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 rounded-2xl font-bold text-xs transition-all active-press"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
