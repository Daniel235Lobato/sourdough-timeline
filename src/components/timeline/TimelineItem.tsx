import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Sparkles, 
  AlertCircle,
  Snowflake,
  Flame,
  Layers,
  Sprout,
  ChefHat,
  Trophy,
  Compass
} from 'lucide-react';
import { ScheduledStep } from '../../types/timeline';

interface TimelineItemProps {
  step: ScheduledStep;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
  onSelectStep: (index: number) => void;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  step,
  isActive,
  isFirst,
  isLast,
  onSelectStep
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className="relative flex items-start space-x-3.5 sm:space-x-4 group">
      {/* Continuous Vertical Connecting Line */}
      {!isLast && (
        <div 
          className={`absolute left-[19px] sm:left-[21px] top-10 bottom-0 w-[3px] rounded-full transition-colors duration-300 ${
            isCompleted 
              ? 'bg-emerald-500/90 dark:bg-emerald-500/80 shadow-glow-emerald' 
              : isActive 
                ? 'bg-gradient-to-b from-amber-500 to-stone-200 dark:to-stone-800' 
                : 'bg-stone-200/80 dark:bg-stone-800/80'
          }`}
        />
      )}

      {/* Node Bullet Icon */}
      <div className="relative z-10 flex-shrink-0 mt-0.5">
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

      {/* Step Card Content */}
      <div 
        className={`flex-1 rounded-2xl sm:rounded-3xl p-4 sm:p-5 transition-all duration-200 border ${
          isActive 
            ? 'bg-white dark:bg-[#181614] border-amber-500/80 dark:border-amber-500 shadow-card-hover ring-1 ring-amber-500/20' 
            : isCompleted 
              ? 'bg-white/70 dark:bg-[#161513]/70 border-stone-200/70 dark:border-stone-800/70 opacity-90 shadow-2xs' 
              : 'bg-white dark:bg-[#181614] border-stone-200/80 dark:border-stone-800/80 shadow-card'
        }`}
      >
        {/* Card Header: Time & Phase Badge */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs sm:text-[13px] font-extrabold text-stone-900 dark:text-stone-100">
              {formatStepTime(step.startTime)}
            </span>
            {step.isOvernightTransition && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-2xs">
                {step.dayLabel || 'Tomorrow'}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-2xs ${badge.color}`}>
              {badge.label}
            </span>
            {step.durationMinutes > 0 && (
              <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 flex items-center space-x-0.5">
                <Clock className="w-3 h-3" />
                <span>
                  {step.durationMinutes >= 60 
                    ? `${Math.round((step.durationMinutes / 60) * 10) / 10}h` 
                    : `${step.durationMinutes}m`}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Step Name */}
        <div className="flex items-start justify-between gap-2">
          <h4 className={`font-serif text-base sm:text-lg font-bold leading-snug ${
            isCompleted 
              ? 'text-stone-600 dark:text-stone-400 line-through decoration-emerald-500/50' 
              : 'text-stone-900 dark:text-stone-100'
          }`}>
            {step.name}
          </h4>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Short Summary Description */}
        <p className="text-xs sm:text-[13px] text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
          {step.description}
        </p>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3 animate-fade-in">
            {/* Ingredients used */}
            {step.ingredientsUsed && step.ingredientsUsed.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block mb-1">
                  Ingredients:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {step.ingredientsUsed.map((ing, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-stone-700 dark:text-stone-300 font-semibold border border-stone-200/60 dark:border-stone-700/60">
                      {ing.amount}{ing.unit} {ing.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Instructions */}
            {step.detailedInstructions && step.detailedInstructions.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block mb-1">
                  Instructions:
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                  {step.detailedInstructions.map((inst, idx) => (
                    <li key={idx} className="leading-relaxed">{inst}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Jump to step button if not active */}
            {!isActive && (
              <div className="pt-1">
                <button
                  onClick={() => onSelectStep(step.index)}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-xs font-bold text-stone-800 dark:text-stone-200 transition-all active-press"
                >
                  Set as Current Step
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
