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
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60 flex items-center justify-center shadow-xs">
            <Play className="w-5 h-5 fill-amber-600 dark:fill-amber-400" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              Start From Step
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Jump directly into an ongoing bake
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Step Selector */}
      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
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
                    ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/60 text-amber-950 dark:text-amber-100 shadow-xs ring-1 ring-amber-500/30'
                    : 'border-stone-200/80 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center flex-shrink-0 text-stone-600 dark:text-stone-300">
                    <StepInstructionIcon stepId={step.id} stepName={step.name} phase={step.phase} size={15} />
                  </div>
                  <span className="truncate">{idx + 1}. {step.name}</span>
                </div>
                <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider flex-shrink-0 ml-2">{step.phase}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Picker */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
            What time did this step begin?
          </label>
          <input
            type="time"
            value={currentTimeStr}
            onChange={(e) => setCurrentTimeStr(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Submit (52px Touch Target) */}
      <div className="mt-5">
        <button
          onClick={handleStartFromSelected}
          className="w-full py-4 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-2xl font-bold shadow-md shadow-amber-600/30 flex items-center justify-center space-x-2 transition-all active-press"
        >
          <span className="tracking-wide">GENERATE REMAINING TIMELINE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Modal>
  );
};
