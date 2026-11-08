import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  Clock, 
  RotateCcw, 
  Sliders, 
  Snowflake, 
  Play,
  ChevronDown,
  X
} from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';
import { ScheduledStep } from '../../types/timeline';
import { Modal } from '../common/Modal';
import { NowCard } from './NowCard';
import { TimelineItem } from './TimelineItem';
import { RunningBehindModal } from './RunningBehindModal';
import { StartFromStepModal } from './StartFromStepModal';
import { LoafSuccessModal } from './LoafSuccessModal';
import { StepDetailModal } from './StepDetailModal';

interface TimelineViewProps {
  onNavigateHome: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ onNavigateHome }) => {
  const { 
    activeSession, 
    advanceToStepIndex, 
    updateColdRetardHours,
    resetSession 
  } = useSourdough();

  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  const [isRunningBehindOpen, setIsRunningBehindOpen] = useState(false);
  const [isStartFromStepOpen, setIsStartFromStepOpen] = useState(false);
  const [isAdjustRetardOpen, setIsAdjustRetardOpen] = useState(false);
  const [retardSliderVal, setRetardSliderVal] = useState<number>(activeSession?.coldRetardHours || 14);
  const [selectedDetailStep, setSelectedDetailStep] = useState<ScheduledStep | null>(null);

  // Close options menu on click outside
  useEffect(() => {
    if (!isOptionsMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target as Node)) {
        setIsOptionsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOptionsMenuOpen]);

  if (!activeSession || activeSession.steps.length === 0) {
    return (
      <div className="py-20 px-4 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#E7CEB5] text-[#2E1E14] border border-[#D1C1A8] mx-auto flex items-center justify-center text-3xl shadow-sm">
          🧭
        </div>
        <h2 className="font-serif text-2xl font-extrabold text-[#2E1E14]">
          No Active Bake Timeline
        </h2>
        <p className="text-xs sm:text-sm text-[#2E1E14]/80">
          Start a new timeline by setting your start time or target bake-by time.
        </p>
        <button
          onClick={onNavigateHome}
          className="mt-2 py-3.5 px-6 bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] rounded-2xl font-bold text-xs shadow-md transition-all active-press"
        >
          Plan a Sourdough Bake
        </button>
      </div>
    );
  }

  const currentStep = activeSession.steps[activeSession.currentStepIndex] || activeSession.steps[0];
  const nextStep = activeSession.steps[activeSession.currentStepIndex + 1];

  const handleApplyRetardChange = () => {
    updateColdRetardHours(retardSliderVal);
    setIsAdjustRetardOpen(false);
  };

  return (
    <div className="pb-36 pt-1 w-full max-w-full overflow-x-hidden min-w-0 space-y-5 animate-fade-in text-[#2E1E14]">
      {/* "NOW" Prominent Experience Card */}
      {!activeSession.isCompleted && (
        <NowCard
          currentStep={currentStep}
          nextStep={nextStep}
          onOpenRunningBehind={() => setIsRunningBehindOpen(true)}
        />
      )}

      {/* Main Vertical Timeline Header with Options Menu */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between px-1 relative">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-extrabold text-[#2E1E14]">
              Sourdough Journey
            </h3>
            <span className="text-xs text-[#2E1E14]/70 font-medium">
              {activeSession.steps.length} Milestones
            </span>
          </div>

          {/* Options Dropdown Menu */}
          <div className="relative" ref={optionsMenuRef}>
            <button
              type="button"
              onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#E7CEB5] hover:bg-[#FAF5EE] border border-[#D1C1A8] text-xs font-bold text-[#2E1E14] transition-all shadow-2xs active-press"
              aria-expanded={isOptionsMenuOpen}
              aria-label="Bake options menu"
            >
              <Sliders className="w-3.5 h-3.5 text-[#986A4C]" />
              <span>Options</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOptionsMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Floating Options Dropdown Menu */}
            {isOptionsMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#FAF5EE] border border-[#D1C1A8] shadow-lg p-1.5 z-40 animate-fade-in text-[#2E1E14]">
                <button
                  type="button"
                  onClick={() => {
                    setIsOptionsMenuOpen(false);
                    setIsRunningBehindOpen(true);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-[#E7CEB5] transition-colors text-left text-xs font-bold text-[#2E1E14]"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#E7CEB5] border border-[#D1C1A8] flex items-center justify-center text-[#986A4C] flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="leading-tight">Adjust Schedule</div>
                    <div className="text-[10px] text-[#2E1E14]/65 font-normal">Running behind / shift times</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOptionsMenuOpen(false);
                    setIsAdjustRetardOpen(true);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-[#E7CEB5] transition-colors text-left text-xs font-bold text-[#2E1E14]"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#E7CEB5] border border-[#D1C1A8] flex items-center justify-center text-[#986A4C] flex-shrink-0">
                    <Snowflake className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="leading-tight">Fridge Retard</div>
                    <div className="text-[10px] text-[#2E1E14]/65 font-normal">{activeSession.coldRetardHours}h window duration</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOptionsMenuOpen(false);
                    setIsStartFromStepOpen(true);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-[#E7CEB5] transition-colors text-left text-xs font-bold text-[#2E1E14]"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#E7CEB5] border border-[#D1C1A8] flex items-center justify-center text-[#986A4C] flex-shrink-0">
                    <Play className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="leading-tight">Jump to Step</div>
                    <div className="text-[10px] text-[#2E1E14]/65 font-normal">Fast-forward bake status</div>
                  </div>
                </button>

                <div className="my-1 border-t border-[#D1C1A8]/60" />

                <button
                  type="button"
                  onClick={() => {
                    setIsOptionsMenuOpen(false);
                    if (window.confirm('Are you sure you want to end this baking session?')) {
                      resetSession();
                      onNavigateHome();
                    }
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-[#E7CEB5] transition-colors text-left text-xs font-bold text-[#986A4C]"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#E7CEB5] border border-[#D1C1A8] flex items-center justify-center text-[#986A4C] flex-shrink-0">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="leading-tight">Reset Bake</div>
                    <div className="text-[10px] text-[#2E1E14]/65 font-normal">End current session</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="space-y-3 pl-1">
          {activeSession.steps.map((step, idx) => (
            <TimelineItem
              key={step.id}
              step={step}
              isActive={idx === activeSession.currentStepIndex && !activeSession.isCompleted}
              isFirst={idx === 0}
              isLast={idx === activeSession.steps.length - 1}
              onSelectStep={(targetIdx) => advanceToStepIndex(targetIdx)}
              onOpenDetail={(targetStep) => setSelectedDetailStep(targetStep)}
            />
          ))}
        </div>
      </div>

      {/* Fridge Retard Modal */}
      <Modal
        isOpen={isAdjustRetardOpen}
        onClose={() => setIsAdjustRetardOpen(false)}
        maxWidthClass="max-w-sm"
        cardClass="p-5 bg-[#FAF5EE] border border-[#D1C1A8] text-[#2E1E14]"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#D1C1A8]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E7CEB5] border border-[#D1C1A8] flex items-center justify-center text-[#986A4C]">
              <Snowflake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#2E1E14]">
                Adjust Fridge Retard
              </h3>
              <p className="text-xs text-[#2E1E14]/75">
                Current window: {retardSliderVal}h
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAdjustRetardOpen(false)}
            className="p-1.5 rounded-full text-[#2E1E14]/60 hover:text-[#2E1E14] hover:bg-[#E7CEB5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-[#2E1E14]/80">Duration:</span>
            <span className="font-mono text-sm font-extrabold px-2 py-0.5 rounded-lg bg-[#E7CEB5] border border-[#D1C1A8]">
              {retardSliderVal} Hours
            </span>
          </div>

          <input
            type="range"
            min="12"
            max="48"
            step="1"
            value={retardSliderVal}
            onChange={(e) => setRetardSliderVal(Number(e.target.value))}
            className="w-full h-2 bg-[#E7CEB5] rounded-lg appearance-none cursor-pointer accent-[#2E1E14]"
          />
          <div className="flex justify-between text-[11px] text-[#2E1E14]/70 font-semibold">
            <span>12h (Min)</span>
            <span>48h (Max: 2 days)</span>
          </div>

          <p className="text-xs text-[#2E1E14]/80 leading-relaxed bg-[#E7CEB5] p-3 rounded-xl border border-[#D1C1A8]">
            Extending cold retard slows yeast activity while enzymatic breakdown enhances deep flavor and blistered crust.
          </p>

          <button
            onClick={handleApplyRetardChange}
            className="w-full py-3.5 bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] rounded-xl font-bold text-xs shadow-xs transition-all active-press"
          >
            Update Cold Retard
          </button>
        </div>
      </Modal>

      {/* Other Modals */}
      <StepDetailModal
        step={selectedDetailStep}
        isOpen={!!selectedDetailStep}
        onClose={() => setSelectedDetailStep(null)}
      />

      <RunningBehindModal
        isOpen={isRunningBehindOpen}
        onClose={() => setIsRunningBehindOpen(false)}
      />

      <StartFromStepModal
        isOpen={isStartFromStepOpen}
        onClose={() => setIsStartFromStepOpen(false)}
        onSyncComplete={() => {}}
      />

      <LoafSuccessModal
        isOpen={activeSession.isCompleted}
        onBakeAnother={onNavigateHome}
      />
    </div>
  );
};
