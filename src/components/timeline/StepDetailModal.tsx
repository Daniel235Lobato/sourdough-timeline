import React from 'react';
import { 
  X, 
  Clock, 
  CheckCircle, 
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
        return { label: 'STARTER BUILD', color: 'bg-[#FAF5EE] text-[#2E1E14] border-[#D1C1A8]' };
      case 'mix':
        return { label: 'MIX & REST', color: 'bg-[#FAF5EE] text-[#2E1E14] border-[#D1C1A8]' };
      case 'ferment':
        return { label: 'BULK FERMENT', color: 'bg-[#FAF5EE] text-[#2E1E14] border-[#D1C1A8]' };
      case 'shape':
        return { label: 'SHAPING', color: 'bg-[#FAF5EE] text-[#2E1E14] border-[#D1C1A8]' };
      case 'retard':
        return { label: 'COLD RETARD', color: 'bg-[#FAF5EE] text-[#986A4C] border-[#D1C1A8]' };
      case 'bake':
        return { label: 'BAKE & STEAM', color: 'bg-[#986A4C] text-[#FAF5EE] border-[#2E1E14]' };
      case 'cool':
        return { label: 'COOLING', color: 'bg-[#FAF5EE] text-[#2E1E14] border-[#D1C1A8]' };
      case 'complete':
        return { label: 'READY TO SLICE', color: 'bg-[#2E1E14] text-[#FAF5EE] border-[#2E1E14]' };
      default:
        return { label: 'STEP', color: 'bg-[#FAF5EE] text-[#2E1E14] border-[#D1C1A8]' };
    }
  };

  const badge = getPhaseBadge();

  const handleCompleteThisStep = () => {
    if (isCurrentActive) {
      completeCurrentStep();
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md" cardClass="p-4 sm:p-5 bg-[#FAF5EE] border border-[#D1C1A8] text-[#2E1E14]">
      <div className="flex flex-col space-y-3.5">
        {/* Header: Icon + Title + Close Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            {/* Step Icon Plate */}
            <div className="w-12 h-12 rounded-2xl bg-[#E7CEB5] border border-[#D1C1A8] flex items-center justify-center flex-shrink-0 text-[#2E1E14] shadow-2xs">
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
                <span className="text-[11px] font-mono font-bold text-[#2E1E14]/80">
                  {formatStepTime(step.startTime)}
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-extrabold text-[#2E1E14] leading-tight truncate">
                {step.name}
              </h2>
            </div>
          </div>

          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#2E1E14]/70 hover:text-[#2E1E14] hover:bg-[#E7CEB5] transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Goal Summary */}
        <div className="p-3 rounded-2xl bg-[#E7CEB5] border border-[#D1C1A8]">
          <p className="text-xs sm:text-[13px] text-[#2E1E14] leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Ingredients Chips (if applicable) */}
        {step.ingredientsUsed && step.ingredientsUsed.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E1E14]/70 mr-1">
              Ingredients:
            </span>
            {step.ingredientsUsed.map((ing, i) => (
              <span 
                key={i} 
                className="px-2.5 py-1 rounded-xl bg-[#E7CEB5] border border-[#D1C1A8] text-xs font-bold text-[#2E1E14] shadow-2xs"
              >
                <strong className="font-mono text-[#986A4C] mr-1">{ing.amount}{ing.unit}</strong>
                {ing.name}
              </span>
            ))}
          </div>
        )}

        {/* Step-by-Step Instructions (Concise) */}
        {step.detailedInstructions && step.detailedInstructions.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2E1E14]/70 block">
              Instructions:
            </span>
            <div className="space-y-1.5">
              {step.detailedInstructions.slice(0, 3).map((instruction, idx) => (
                <div 
                  key={idx} 
                  className="p-2.5 rounded-xl bg-[#E7CEB5] border border-[#D1C1A8] flex items-start space-x-2 text-xs text-[#2E1E14] leading-relaxed shadow-2xs"
                >
                  <span className="w-4 h-4 rounded-full bg-[#FAF5EE] border border-[#D1C1A8] text-[#2E1E14] font-mono font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
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
          <div className="p-2.5 rounded-xl bg-[#E7CEB5] border border-[#D1C1A8] flex items-start space-x-2 text-xs text-[#2E1E14]">
            <HelpCircle className="w-4 h-4 text-[#986A4C] flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-bold mr-1 text-[#2E1E14]">{step.fermentationCues.title}</span>
              <span className="text-[#2E1E14]/90">{step.fermentationCues.visualCue}</span>
            </div>
          </div>
        )}

        {/* Temperature Note (if available) */}
        {step.temperatureNote && (
          <div className="p-2 rounded-xl bg-[#E7CEB5] border border-[#D1C1A8] text-xs text-[#2E1E14] flex items-center space-x-2">
            <Thermometer className="w-3.5 h-3.5 text-[#986A4C] flex-shrink-0" />
            <span>Target Temperature: <strong className="font-mono text-[#2E1E14]">{step.temperatureNote}</strong></span>
          </div>
        )}

        {/* Bottom Actions: Active Action CTA (if active) + Bottom Close Button */}
        <div className="pt-2 space-y-2">
          {isCurrentActive && (
            <button
              onClick={handleCompleteThisStep}
              className="w-full py-3.5 px-4 bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center space-x-1.5 transition-all active-press"
            >
              <CheckCircle className="w-4 h-4" />
              <span>MARK STEP COMPLETE ✓</span>
            </button>
          )}

          {/* Bottom Close Button to Exit Back to Timeline */}
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-[#E7CEB5] hover:bg-[#D1C1A8] text-[#2E1E14] rounded-2xl font-bold text-xs transition-all active-press flex items-center justify-center space-x-1.5 border border-[#D1C1A8]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Close & Return to Timeline</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
