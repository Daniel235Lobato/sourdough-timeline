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
import { NowCard } from './NowCard';
import { TimelineItem } from './TimelineItem';
import { RunningBehindModal } from './RunningBehindModal';
import { StartFromStepModal } from './StartFromStepModal';
import { LoafSuccessModal } from './LoafSuccessModal';

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

  if (!activeSession || activeSession.steps.length === 0) {
    return (
      <div className="py-20 px-4 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-stone-800 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center text-3xl">
          🧭
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
          No Active Bake Timeline
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Start a new timeline by setting your start time or target bake-by time.
        </p>
        <button
          onClick={onNavigateHome}
          className="mt-2 py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold text-sm shadow-md transition-all"
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
    <div className="pb-28 pt-2 px-4 max-w-xl mx-auto space-y-6 animate-fade-in">
      {/* "NOW" Prominent Experience Card */}
      {!activeSession.isCompleted && (
        <NowCard
          currentStep={currentStep}
          nextStep={nextStep}
          onOpenRunningBehind={() => setIsRunningBehindOpen(true)}
        />
      )}

      {/* Quick Action Toolbar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setIsRunningBehindOpen(true)}
          className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-medium text-stone-700 dark:text-stone-300 hover:border-amber-500 shadow-2xs"
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>I'm Running Behind</span>
        </button>

        <button
          onClick={() => setIsAdjustRetardOpen(!isAdjustRetardOpen)}
          className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-medium text-stone-700 dark:text-stone-300 hover:border-sky-500 shadow-2xs"
        >
          <Snowflake className="w-3.5 h-3.5 text-sky-500" />
          <span>Retard: {activeSession.coldRetardHours}h</span>
        </button>

        <button
          onClick={() => setIsStartFromStepOpen(true)}
          className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-medium text-stone-700 dark:text-stone-300 hover:border-amber-500 shadow-2xs"
        >
          <Play className="w-3.5 h-3.5 text-amber-600" />
          <span>Jump Step</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to end this baking session?')) {
              resetSession();
              onNavigateHome();
            }
          }}
          className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-medium text-stone-400 hover:text-red-500 shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Expandable Cold Retard Adjuster */}
      {isAdjustRetardOpen && (
        <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-stone-900 border border-sky-200 dark:border-stone-800 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-sky-900 dark:text-sky-300 flex items-center space-x-1">
              <Snowflake className="w-3.5 h-3.5 text-sky-500" />
              <span>Adjust Cold Retard Duration:</span>
            </span>
            <span className="font-mono text-sky-700 dark:text-sky-400">{retardSliderVal} Hours</span>
          </div>
          <input
            type="range"
            min="12"
            max="48"
            step="1"
            value={retardSliderVal}
            onChange={(e) => setRetardSliderVal(Number(e.target.value))}
            className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-400 text-[11px]">12h min – 48h max</span>
            <button
              onClick={handleApplyRetardChange}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold text-xs"
            >
              Update Timeline
            </button>
          </div>
        </div>
      )}

      {/* Main Vertical Timeline */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-2">
            <span>Sourdough Journey</span>
          </h3>
          <span className="text-xs text-stone-400 font-medium">
            {activeSession.steps.length} Milestones
          </span>
        </div>

        <div className="space-y-3 pl-1">
          {activeSession.steps.map((step, idx) => (
            <TimelineItem
              key={step.id}
              step={step}
              isActive={idx === activeSession.currentStepIndex && !activeSession.isCompleted}
              isFirst={idx === 0}
              isLast={idx === activeSession.steps.length - 1}
              onSelectStep={(targetIdx) => advanceToStepIndex(targetIdx)}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
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
