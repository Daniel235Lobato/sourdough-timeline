import React, { useState } from 'react';
import { X, Play, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useSourdough } from '../../context/SourdoughContext';
import { Modal } from '../common/Modal';
import { StepInstructionIcon } from '../icons/StepIcons';

interface StartFromStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete: () => void;
}

export const StartFromStepModal: React.FC<StartFromStepModalProps> = ({
  isOpen,
  onClose,
  onSyncComplete
}) => {
  const { selectedRecipe, startFromStep } = useSourdough();
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(4); // Stretch & fold default
  const [currentTimeStr, setCurrentTimeStr] = useState<string>(format(new Date(), 'HH:mm'));

  if (!isOpen) return null;

  const handleStartFromSelected = () => {
    const [hours, minutes] = currentTimeStr.split(':').map(Number);
    const now = new Date();
    const effectiveTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);

    startFromStep(selectedStepIndex, effectiveTime);
    onSyncComplete();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md" cardClass="p-4 sm:p-5 bg-[#FAF5EE] border border-[#D1C1A8] text-[#2E1E14]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#D1C1A8]">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#E7CEB5] text-[#2E1E14] border border-[#D1C1A8] flex items-center justify-center shadow-xs">
            <Play className="w-5 h-5 fill-[#2E1E14]" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2E1E14]">
              Start From Step
            </h3>
            <p className="text-xs text-[#2E1E14]/75">
              Jump directly into an ongoing bake
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-[#2E1E14]/70 hover:text-[#2E1E14] hover:bg-[#E7CEB5] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Step Selector */}
      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2E1E14]/70 mb-2">
            Select Your Current Step:
          </label>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {selectedRecipe.steps.map((step, idx) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setSelectedStepIndex(idx)}
                className={`w-full text-left px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between active-press ${
                  selectedStepIndex === idx
                    ? 'border-[#2E1E14] bg-[#E7CEB5] text-[#2E1E14] shadow-xs ring-1 ring-[#2E1E14]/30'
                    : 'border-[#D1C1A8] bg-[#FAF5EE] text-[#2E1E14] hover:bg-[#E7CEB5]/60'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                  <div className="w-7 h-7 rounded-lg bg-[#E7CEB5] border border-[#D1C1A8] flex items-center justify-center flex-shrink-0 text-[#2E1E14]">
                    <StepInstructionIcon stepId={step.id} stepName={step.name} phase={step.phase} size={15} />
                  </div>
                  <span className="break-words leading-snug">{idx + 1}. {step.name}</span>
                </div>
                <span className="text-[10px] text-[#2E1E14]/60 font-semibold uppercase tracking-wider flex-shrink-0 ml-2">{step.phase}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Picker */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2E1E14]/70 mb-2">
            What time did this step begin?
          </label>
          <input
            type="time"
            value={currentTimeStr}
            onChange={(e) => setCurrentTimeStr(e.target.value)}
            className="w-full bg-[#E7CEB5] border border-[#D1C1A8] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#2E1E14] focus:outline-none focus:ring-2 focus:ring-[#2E1E14]"
          />
        </div>
      </div>

      {/* Submit (52px Touch Target) */}
      <div className="mt-5">
        <button
          onClick={handleStartFromSelected}
          className="w-full py-4 px-4 bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] rounded-2xl font-bold shadow-md flex items-center justify-center space-x-2 transition-all active-press"
        >
          <span className="tracking-wide">GENERATE REMAINING TIMELINE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Modal>
  );
};
