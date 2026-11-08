import React, { useState } from 'react';
import { 
  Compass, 
  Clock, 
  RotateCcw, 
  Sliders, 
  Sparkles, 
  AlertCircle, 
  ChevronRight,
  Snowflake,
  Play
} from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';
import { ScheduledStep } from '../../types/timeline';
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

  const [isRunningBehindOpen, setIsRunningBehindOpen] = useState(false);
  const [isStartFromStepOpen, setIsStartFromStepOpen] = useState(false);
  const [isAdjustRetardOpen, setIsAdjustRetardOpen] = useState(false);
  const [retardSliderVal, setRetardSliderVal] = useState<number>(activeSession?.coldRetardHours || 14);
  const [selectedDetailStep, setSelectedDetailStep] = useState<ScheduledStep | null>(null);

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

      {/* Quick Action Toolbar (Responsive Grid, Never Overflows on iPhone) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full text-xs">
        <button
          onClick={() => setIsRunningBehindOpen(true)}
          className="flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-2xl bg-[#E7CEB5] border border-[#D1C1A8] font-bold text-[#2E1E14] hover:bg-[#FAF5EE] shadow-xs transition-all active-press truncate"
        >
          <Clock className="w-3.5 h-3.5 text-[#986A4C] flex-shrink-0" />
          <span className="truncate">Running Behind</span>
        </button>

        <button
          onClick={() => setIsAdjustRetardOpen(!isAdjustRetardOpen)}
          className="flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-2xl bg-[#E7CEB5] border border-[#D1C1A8] font-bold text-[#2E1E14] hover:bg-[#FAF5EE] shadow-xs transition-all active-press truncate"
        >
          <Snowflake className="w-3.5 h-3.5 text-[#986A4C] flex-shrink-0" />
          <span className="truncate">Retard ({activeSession.coldRetardHours}h)</span>
        </button>

        <button
          onClick={() => setIsStartFromStepOpen(true)}
          className="flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-2xl bg-[#E7CEB5] border border-[#D1C1A8] font-bold text-[#2E1E14] hover:bg-[#FAF5EE] shadow-xs transition-all active-press truncate"
        >
          <Play className="w-3.5 h-3.5 text-[#986A4C] flex-shrink-0" />
          <span className="truncate">Jump Step</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to end this baking session?')) {
              resetSession();
              onNavigateHome();
            }
          }}
          className="flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-2xl bg-[#E7CEB5] border border-[#D1C1A8] font-bold text-[#2E1E14]/80 hover:text-[#986A4C] hover:bg-[#FAF5EE] shadow-xs transition-all active-press truncate"
        >
          <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">Reset</span>
        </button>
      </div>

      {/* Expandable Cold Retard Adjuster */}
      {isAdjustRetardOpen && (
        <div className="p-4 sm:p-5 rounded-3xl bg-[#E7CEB5] border border-[#D1C1A8] shadow-sm space-y-3 animate-fade-in text-[#2E1E14]">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-[#2E1E14] flex items-center space-x-1.5">
              <Snowflake className="w-4 h-4 text-[#986A4C]" />
              <span>Adjust Cold Retard Duration:</span>
            </span>
            <span className="font-mono text-[#2E1E14] text-sm font-extrabold">{retardSliderVal} Hours</span>
          </div>

          <input
            type="range"
            min="12"
            max="48"
            step="1"
            value={retardSliderVal}
            onChange={(e) => setRetardSliderVal(Number(e.target.value))}
            className="w-full h-2 bg-[#D1C1A8] rounded-lg appearance-none cursor-pointer accent-[#2E1E14]"
          />
          <div className="flex justify-between items-center text-xs">
            <div className="flex space-x-2 text-[#2E1E14]/70 font-bold text-[11px]">
              <span>12h (Min)</span>
              <span>•</span>
              <span>48h (Max)</span>
            </div>
            <button
              onClick={handleApplyRetardChange}
              className="px-3.5 py-2 bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] rounded-xl font-bold text-xs shadow-xs transition-all active-press"
            >
              Update Timeline
            </button>
          </div>
        </div>
      )}

      {/* Main Vertical Timeline */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-serif text-lg sm:text-xl font-extrabold text-[#2E1E14] flex items-center space-x-2">
            <span>Sourdough Journey</span>
          </h3>
          <span className="text-xs text-[#2E1E14]/70 font-bold">
            {activeSession.steps.length} Milestones
          </span>
        </div>

        <div className="space-y-3.5 pl-1">
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

      {/* Modals */}
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
