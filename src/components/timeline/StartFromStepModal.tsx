import React, { useState } from 'react';
import { X, Play, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { useSourdough } from '../../context/SourdoughContext';
import { Modal } from '../common/Modal';

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
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
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
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Selector */}
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Select Your Current Step:
            </label>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {selectedRecipe.steps.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setSelectedStepIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                    selectedStepIndex === idx
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-100 font-bold shadow-sm'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className="truncate">{idx + 1}. {step.name}</span>
                  <span className="text-[10px] text-stone-400 uppercase">{step.phase}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              What time did this step begin?
            </label>
            <input
              type="time"
              value={currentTimeStr}
              onChange={(e) => setCurrentTimeStr(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6">
          <button
            onClick={handleStartFromSelected}
            className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold shadow-lg shadow-amber-600/25 flex items-center justify-center space-x-2 transition-all transform active:scale-[0.98]"
          >
            <span>GENERATE REMAINING TIMELINE</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
    </Modal>
  );
};
