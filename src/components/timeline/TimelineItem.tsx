import React from 'react';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Compass, 
  ChevronRight 
} from 'lucide-react';
import { ScheduledStep } from '../../types/timeline';
import { StepInstructionIcon } from '../icons/StepIcons';

interface TimelineItemProps {
  step: ScheduledStep;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelectStep: (index: number) => void;
  onOpenDetail: (step: ScheduledStep) => void;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  step,
  isActive,
  isFirst,
  isLast,
  onSelectStep,
  onOpenDetail
}) => {
  const isCompleted = step.status === 'completed';
  const isUpcoming = step.status === 'upcoming';

  const formatStepTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  // Phase badge color
  const getPhaseBadge = () => {
    switch (step.phase) {
      case 'starter':
        return { label: 'STARTER', color: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'mix':
        return { label: 'MIX', color: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      case 'ferment':
        return { label: 'FERMENT', color: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      case 'shape':
        return { label: 'SHAPE', color: 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700' };
      case 'retard':
        return { label: 'RETARD', color: 'bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800' };
      case 'bake':
        return { label: 'BAKE', color: 'bg-orange-100 dark:bg-orange-950/70 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800' };
      case 'cool':
        return { label: 'COOL', color: 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
      case 'complete':
        return { label: 'READY', color: 'bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-100 border-amber-300 dark:border-amber-700' };
      default:
        return { label: 'STEP', color: 'bg-stone-100 text-stone-700' };
    }
  };

  const badge = getPhaseBadge();

  return (
    <div className="relative flex items-start space-x-3 sm:space-x-4 group w-full max-w-full min-w-0">
      {/* Continuous Vertical Connecting Line */}
      {!isLast && (
        <div 
          className={`absolute left-[19px] sm:left-[21px] top-12 bottom-0 w-[3px] rounded-full transition-colors duration-300 ${
            isCompleted 
              ? 'bg-emerald-500/90 dark:bg-emerald-500/80 shadow-glow-emerald' 
              : isActive 
                ? 'bg-gradient-to-b from-amber-500 to-stone-200 dark:to-stone-800' 
                : 'bg-stone-200/80 dark:bg-stone-800/80'
          }`}
        />
      )}

      {/* Node Bullet Status Indicator */}
      <div className="relative z-10 flex-shrink-0 mt-3 sm:mt-4">
        {isCompleted ? (
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/25 border-2 border-emerald-500/40 transition-transform group-hover:scale-105">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        ) : isActive ? (
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 ring-4 ring-amber-500/20 border-2 border-amber-400 animate-pulse">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#181614] border border-stone-300 dark:border-stone-700 text-stone-400 flex items-center justify-center shadow-2xs">
            <Circle className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Step Card Content (Visual-First: Large Icon + Short Name + Time) */}
      <div 
        onClick={() => onOpenDetail(step)}
        className={`flex-1 min-w-0 rounded-3xl p-3.5 sm:p-5 transition-all duration-200 border cursor-pointer active-press ${
          isActive 
            ? 'bg-white dark:bg-[#181614] border-amber-500/80 dark:border-amber-500 shadow-card-hover ring-1 ring-amber-500/20' 
            : isCompleted 
              ? 'bg-white/80 dark:bg-[#161513]/80 border-stone-200/80 dark:border-stone-800/80 opacity-90 shadow-2xs hover:border-emerald-400' 
              : 'bg-white dark:bg-[#181614] border-stone-200/80 dark:border-stone-800/80 shadow-card hover:border-amber-400'
        }`}
      >
        <div className="flex items-center space-x-3.5 sm:space-x-5">
          {/* Large Minimalist Instructional Icon Hero Plate (64px mobile, 80px sm+) */}
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex-shrink-0 flex items-center justify-center p-2 transition-transform group-hover:scale-105 ${
            isCompleted 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300'
              : isActive 
                ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 shadow-xs'
                : 'bg-stone-50 dark:bg-[#1e1b18] border border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300'
          }`}>
            <StepInstructionIcon 
              stepId={step.id} 
              stepName={step.name} 
              phase={step.phase} 
              size={44}
              className="w-11 h-11 sm:w-14 sm:h-14" 
            />
          </div>

          {/* Action Details: Short Action Name + Scheduled Time (WHAT -> WHEN) */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            {/* Phase Tag & Overnight Tag */}
            <div className="flex items-center space-x-2 mb-1">
              <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border shadow-2xs ${badge.color}`}>
                {badge.label}
              </span>
              {step.isOvernightTransition && (
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {step.dayLabel || 'Overnight'}
                </span>
              )}
            </div>

            {/* Short Action Name (Cleanly fitted without ellipsis ...) */}
            <h3 className={`font-serif text-[15px] sm:text-lg font-bold leading-snug break-words ${
              isCompleted 
                ? 'text-stone-500 dark:text-stone-400 line-through decoration-emerald-500/50' 
                : 'text-stone-900 dark:text-stone-100'
            }`}>
              {step.name}
            </h3>

            {/* Scheduled Time & Duration */}
            <div className="flex items-center space-x-2 mt-1 font-mono text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-bold">
              <span>{formatStepTime(step.startTime)}</span>
              {step.durationMinutes > 0 && (
                <>
                  <span className="text-stone-300 dark:text-stone-600 font-sans">•</span>
                  <span className="font-sans text-[11px] sm:text-xs font-semibold text-stone-500 dark:text-stone-400">
                    {step.durationMinutes >= 60 
                      ? `${Math.round((step.durationMinutes / 60) * 10) / 10}h` 
                      : `${step.durationMinutes}m`}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right Chevron indicating tap for details */}
          <div className="flex-shrink-0 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors pl-1">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

