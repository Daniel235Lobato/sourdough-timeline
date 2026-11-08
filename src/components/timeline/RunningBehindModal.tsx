import React, { useState } from 'react';
import { X, Clock, AlertCircle, Sparkles, Snowflake, ArrowRight, Check } from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';
import { Modal } from '../common/Modal';

interface RunningBehindModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DelayReason = 'starter_late' | 'bulk_late' | 'started_late' | 'bake_later' | 'bake_sooner';

export const RunningBehindModal: React.FC<RunningBehindModalProps> = ({ isOpen, onClose }) => {
  const { adjustRunningBehind, activeSession } = useSourdough();
  const [selectedReason, setSelectedReason] = useState<DelayReason>('starter_late');
  const [customMinutes, setCustomMinutes] = useState<number>(45);

  if (!isOpen || !activeSession) return null;

  const reasons: { id: DelayReason; title: string; subtitle: string; defaultMinutes: number; explanation: string }[] = [
    {
      id: 'starter_late',
      title: '🌱 Starter isn\'t peaked yet',
      subtitle: 'Needs more time to double and dome',
      defaultMinutes: 60,
      explanation: 'Extends starter fermentation. Pushes all downstream mix and baking steps forward.'
    },
    {
      id: 'bulk_late',
      title: '🌡️ Bulk fermentation isn\'t ready',
      subtitle: 'Dough has not reached 50–75% rise',
      defaultMinutes: 60,
      explanation: 'Adds extra bulk fermentation time so gluten and flavor develop properly before shaping.'
    },
    {
      id: 'started_late',
      title: '⏱️ I started late / fell behind',
      subtitle: 'Shift current step start time to right now',
      defaultMinutes: 0,
      explanation: 'Aligns the current step timestamp with actual real-world clock time right now.'
    },
    {
      id: 'bake_later',
      title: '❄️ I need to bake later',
      subtitle: 'Extend refrigerator cold sleep safely',
      defaultMinutes: 240, // 4 hours
      explanation: 'Extends the cold retard window. Cold temperature pauses yeast while enhancing crust blisters and flavor (safe up to 48h).'
    },
    {
      id: 'bake_sooner',
      title: '🔥 I need to bake sooner',
      subtitle: 'Shorten refrigerator cold retard',
      defaultMinutes: 120, // 2 hours
      explanation: 'Shortens the refrigerator sleep down to the 12-hour minimum required for clean scoring and structural integrity.'
    }
  ];

  const currentOption = reasons.find(r => r.id === selectedReason)!;

  const handleApply = () => {
    adjustRunningBehind(selectedReason, customMinutes);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-md" cardClass="p-4 sm:p-5 bg-[#FAF5EE] border border-[#D1C1A8] text-[#2E1E14]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#D1C1A8]">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#E7CEB5] text-[#2E1E14] border border-[#D1C1A8] flex items-center justify-center shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2E1E14]">
              I'm Running Behind
            </h3>
            <p className="text-xs text-[#2E1E14]/75">
              Intelligent biological rescheduling
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

      {/* Reason Selector */}
      <div className="mt-4 space-y-2">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2E1E14]/70 mb-1">
          What's happening?
        </label>

        {reasons.map((r) => {
          const isSelected = selectedReason === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setSelectedReason(r.id);
                setCustomMinutes(r.defaultMinutes);
              }}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between active-press ${
                isSelected
                  ? 'border-[#2E1E14] bg-[#E7CEB5] text-[#2E1E14] shadow-xs ring-1 ring-[#2E1E14]/30'
                  : 'border-[#D1C1A8] bg-[#FAF5EE] hover:bg-[#E7CEB5]/60 text-[#2E1E14]'
              }`}
            >
              <div>
                <div className="font-bold text-sm font-serif text-[#2E1E14]">{r.title}</div>
                <div className="text-xs text-[#2E1E14]/75 mt-0.5">{r.subtitle}</div>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-[#2E1E14] text-[#FAF5EE] flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Time adjustment slider for this reason */}
      {selectedReason !== 'started_late' && (
        <div className="mt-4 pt-3.5 border-t border-[#D1C1A8] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#2E1E14]">
              Adjustment Duration:
            </span>
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-[#E7CEB5] text-[#2E1E14] border border-[#D1C1A8]">
              {customMinutes >= 60 ? `+${customMinutes / 60}h` : `+${customMinutes}m`}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[30, 45, 60, 120].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setCustomMinutes(mins)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all active-press ${
                  customMinutes === mins
                    ? 'bg-[#2E1E14] text-[#FAF5EE] border-[#2E1E14] shadow-xs'
                    : 'bg-[#E7CEB5] text-[#2E1E14] border-[#D1C1A8] hover:bg-[#D1C1A8]/50'
                }`}
              >
                +{mins >= 60 ? `${mins / 60}h` : `${mins}m`}
              </button>
            ))}
          </div>
          <p className="text-xs text-[#2E1E14] leading-relaxed italic bg-[#E7CEB5] p-3 rounded-2xl border border-[#D1C1A8]">
            💡 {currentOption.explanation}
          </p>
        </div>
      )}

      {/* Action Button (52px Touch Target) */}
      <div className="mt-5">
        <button
          onClick={handleApply}
          className="w-full py-4 px-4 bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] rounded-2xl font-bold shadow-md flex items-center justify-center space-x-2 transition-all active-press"
        >
          <span className="tracking-wide">UPDATE MY SCHEDULE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Modal>
  );
};
