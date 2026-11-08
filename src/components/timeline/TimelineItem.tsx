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
    <div className="relative flex items-start space-x-3 group w-full max-w-full min-w-0">
      {/* Continuous Vertical Connecting Line */}
      {!isLast && (
        <div 
          className={`absolute left-[15px] sm:left-[17px] top-10 bottom-0 w-[2px] transition-colors duration-300 ${
            isCompleted 
              ? 'bg-[#2E1E14]' 
              : isActive 
                ? 'bg-[#986A4C]' 
                : 'bg-[#D1C1A8]'
          }`}
        />
      )}

      {/* Node Bullet Status Indicator */}
      <div className="relative z-10 flex-shrink-0 mt-3">
        {isCompleted ? (
          <div className="w-8 h-8 rounded-full bg-[#2E1E14] text-[#FAF5EE] flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        ) : isActive ? (
          <div className="w-8 h-8 rounded-full bg-[#986A4C] text-[#FAF5EE] flex items-center justify-center shadow-xs ring-2 ring-[#986A4C]/30">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FAF5EE]" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#FAF5EE] border border-[#D1C1A8] text-[#2E1E14]/40 flex items-center justify-center">
            <Circle className="w-2.5 h-2.5" />
          </div>
        )}
      </div>

      {/* Step Card Content */}
      <div 
        onClick={() => onOpenDetail(step)}
        className={`flex-1 min-w-0 rounded-2xl p-3 sm:p-3.5 transition-all duration-200 border cursor-pointer active-press ${
          isActive 
            ? 'bg-[#E7CEB5] border-2 border-[#2E1E14] shadow-xs' 
            : isCompleted 
              ? 'bg-[#E7CEB5]/60 border border-[#D1C1A8] opacity-75' 
              : 'bg-[#E7CEB5] border border-[#D1C1A8] hover:border-[#AD9677]'
        }`}
      >
        <div className="flex items-center space-x-3">
          {/* Subtle Instructional Icon Plate */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex-shrink-0 flex items-center justify-center p-1.5 bg-[#FAF5EE] border border-[#D1C1A8] text-[#2E1E14]">
            <StepInstructionIcon 
              stepId={step.id} 
              stepName={step.name} 
              phase={step.phase} 
              size={22}
              className="w-5 h-5 sm:w-6 sm:h-6" 
            />
          </div>

          {/* Action Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#986A4C]">
                {badge.label}
              </span>
              {step.isOvernightTransition && (
                <span className="text-[10px] text-[#2E1E14]/60 font-semibold">
                  · {step.dayLabel || 'Overnight'}
                </span>
              )}
            </div>

            <h3 className={`font-serif text-sm sm:text-base font-bold leading-snug truncate ${
              isCompleted 
                ? 'text-[#2E1E14]/60 line-through decoration-[#2E1E14]/40' 
                : 'text-[#2E1E14]'
            }`}>
              {step.name}
            </h3>

            <div className="flex items-center space-x-1.5 text-xs text-[#2E1E14]/75 font-medium mt-0.5">
              <span className="font-mono">{formatStepTime(step.startTime)}</span>
              {step.durationMinutes > 0 && (
                <>
                  <span>·</span>
                  <span>
                    {step.durationMinutes >= 60 
                      ? `${Math.round((step.durationMinutes / 60) * 10) / 10}h` 
                      : `${step.durationMinutes}m`}
                  </span>
                </>
              )}
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-[#2E1E14]/40 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

