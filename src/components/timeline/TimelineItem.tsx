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
        return { label: 'STARTER', color: 'bg-[#FAF5EE] text-[#2E1E14] border-[#D1C1A8]' };
      case 'mix':
        return { label: 'MIX', color: 'bg-[#FAF5EE] text-[#2E1E14] border-[#D1C1A8]' };
      case 'ferment':
        return { label: 'FERMENT', color: 'bg-[#FAF5EE] text-[#2E1E14] border-[#D1C1A8]' };
      case 'shape':
        return { label: 'SHAPE', color: 'bg-[#FAF5EE] text-[#2E1E14] border-[#D1C1A8]' };
      case 'retard':
        return { label: 'RETARD', color: 'bg-[#FAF5EE] text-[#986A4C] border-[#D1C1A8]' };
      case 'bake':
        return { label: 'BAKE', color: 'bg-[#986A4C] text-[#FAF5EE] border-[#2E1E14]' };
      case 'cool':
        return { label: 'COOL', color: 'bg-[#FAF5EE] text-[#2E1E14] border-[#D1C1A8]' };
      case 'complete':
        return { label: 'READY', color: 'bg-[#2E1E14] text-[#FAF5EE] border-[#2E1E14]' };
      default:
        return { label: 'STEP', color: 'bg-[#FAF5EE] text-[#2E1E14] border-[#D1C1A8]' };
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
              ? 'bg-[#2E1E14]' 
              : isActive 
                ? 'bg-gradient-to-b from-[#986A4C] to-[#AD9677]' 
                : 'bg-[#D1C1A8]'
          }`}
        />
      )}

      {/* Node Bullet Status Indicator */}
      <div className="relative z-10 flex-shrink-0 mt-3 sm:mt-4">
        {isCompleted ? (
          <div className="w-10 h-10 rounded-2xl bg-[#2E1E14] text-[#FAF5EE] flex items-center justify-center shadow-xs border-2 border-[#2E1E14] transition-transform group-hover:scale-105">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        ) : isActive ? (
          <div className="w-10 h-10 rounded-2xl bg-[#986A4C] text-[#FAF5EE] flex items-center justify-center shadow-md ring-4 ring-[#986A4C]/25 border-2 border-[#2E1E14] animate-pulse">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-2xl bg-[#FAF5EE] border border-[#D1C1A8] text-[#2E1E14]/60 flex items-center justify-center shadow-2xs">
            <Circle className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Step Card Content (Visual-First: Large Icon + Short Name + Time) */}
      <div 
        onClick={() => onOpenDetail(step)}
        className={`flex-1 min-w-0 rounded-3xl p-3.5 sm:p-5 transition-all duration-200 border cursor-pointer active-press ${
          isActive 
            ? 'bg-[#E7CEB5] border-2 border-[#2E1E14] shadow-md ring-1 ring-[#2E1E14]/20' 
            : isCompleted 
              ? 'bg-[#E7CEB5]/70 border border-[#D1C1A8] opacity-85 shadow-2xs hover:border-[#2E1E14]' 
              : 'bg-[#E7CEB5] border border-[#D1C1A8] shadow-sm hover:border-[#AD9677]'
        }`}
      >
        <div className="flex items-center space-x-3.5 sm:space-x-5">
          {/* Large Minimalist Instructional Icon Hero Plate (64px mobile, 80px sm+) */}
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex-shrink-0 flex items-center justify-center p-2 transition-transform group-hover:scale-105 bg-[#FAF5EE] border border-[#D1C1A8] text-[#2E1E14]`}>
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
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF5EE] text-[#986A4C] border border-[#D1C1A8]">
                  {step.dayLabel || 'Overnight'}
                </span>
              )}
            </div>

            {/* Short Action Name (Cleanly fitted without ellipsis ...) */}
            <h3 className={`font-serif text-[15px] sm:text-lg font-extrabold leading-snug break-words ${
              isCompleted 
                ? 'text-[#2E1E14]/60 line-through decoration-[#2E1E14]/40' 
                : 'text-[#2E1E14]'
            }`}>
              {step.name}
            </h3>

            {/* Scheduled Time & Duration */}
            <div className="flex items-center space-x-2 mt-1 font-mono text-xs sm:text-sm text-[#2E1E14] font-bold">
              <span>{formatStepTime(step.startTime)}</span>
              {step.durationMinutes > 0 && (
                <>
                  <span className="text-[#AD9677] font-sans">•</span>
                  <span className="font-sans text-[11px] sm:text-xs font-bold text-[#2E1E14]/80">
                    {step.durationMinutes >= 60 
                      ? `${Math.round((step.durationMinutes / 60) * 10) / 10}h` 
                      : `${step.durationMinutes}m`}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right Chevron indicating tap for details */}
          <div className="flex-shrink-0 text-[#2E1E14]/60 group-hover:text-[#2E1E14] transition-colors pl-1">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

