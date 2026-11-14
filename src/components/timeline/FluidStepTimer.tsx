import React, { useMemo } from 'react';
import { BellRing, Sparkles } from 'lucide-react';
import { ScheduledStep } from '../../types/timeline';
import { CountdownResult, formatDurationToHMS } from '../../hooks/useCountdown';

interface FluidStepTimerProps {
  currentStep: ScheduledStep;
  nextStep?: ScheduledStep;
  countdown: CountdownResult;
  isTimerRunning: boolean;
  isZeroDurationStep: boolean;
}

const RADIUS = 82;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TICK_ANGLES = Array.from({ length: 24 }, (_, i) => i * 15);

/**
 * Format duration or countdown into a clean, readable display.
 * Shows MM:SS when under 1 hour for larger visual presence, or H:MM:SS when >= 1 hour.
 */
function formatDisplayDigits(totalMinutes: number, countdown: CountdownResult, isRunning: boolean): string {
  if (!isRunning) {
    const hms = formatDurationToHMS(totalMinutes);
    return hms.startsWith('00:') ? hms.slice(3) : hms;
  }
  if (countdown.hours === 0) {
    const m = countdown.minutes.toString().padStart(2, '0');
    const s = countdown.seconds.toString().padStart(2, '0');
    return `${m}:${s}`;
  }
  return `${countdown.hours}:${countdown.minutes.toString().padStart(2, '0')}:${countdown.seconds.toString().padStart(2, '0')}`;
}

export const FluidStepTimer: React.FC<FluidStepTimerProps> = ({
  currentStep,
  nextStep,
  countdown,
  isTimerRunning,
  isZeroDurationStep
}) => {
  const isComplete = !isZeroDurationStep && isTimerRunning && countdown.isPast;

  // Progress fraction (0 to 1)
  const progressFraction = useMemo(() => {
    if (isZeroDurationStep || isComplete) return 1;
    if (!isTimerRunning) return 0;
    return Math.min(1, Math.max(0, countdown.exactProgress / 100));
  }, [isZeroDurationStep, isComplete, isTimerRunning, countdown.exactProgress]);

  const strokeDashoffset = CIRCUMFERENCE * (1 - progressFraction);
  const rotationDegrees = progressFraction * 360;

  const displayDigits = isZeroDurationStep
    ? 'Ready'
    : formatDisplayDigits(currentStep.durationMinutes, countdown, isTimerRunning);

  const endClockString = useMemo(() => {
    if (!currentStep.endTime) return '';
    return new Date(currentStep.endTime).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  }, [currentStep.endTime]);

  return (
    <div
      className={`my-4 rounded-3xl border transition-all duration-500 px-4 py-5 flex flex-col items-center justify-center relative overflow-hidden ${
        isComplete
          ? 'bg-gradient-to-b from-[#FAF5EE] to-[#F3E4D2] border-[#986A4C]/70 shadow-sm'
          : 'bg-[#FAF5EE]/80 border-[#D1C1A8]/80'
      }`}
    >
      {/* Subtle ambient breathing glow when timer is actively running or complete */}
      {(isTimerRunning || isComplete) && !isZeroDurationStep && (
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center`}
          aria-hidden="true"
        >
          <div
            className={`w-48 h-48 rounded-full blur-2xl animate-timer-breathe ${
              isComplete ? 'bg-[#986A4C]/20' : 'bg-[#E7CEB5]/55'
            }`}
          />
        </div>
      )}

      {/* Circular Fluid Chronometer Ring */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
        <svg
          className="w-full h-full -rotate-90 overflow-visible"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="levainTimerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#986A4C" />
              <stop offset="100%" stopColor="#2E1E14" />
            </linearGradient>
            <linearGradient id="levainCompleteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B87D56" />
              <stop offset="100%" stopColor="#986A4C" />
            </linearGradient>
          </defs>

          {/* Subtle artisan dial ticks */}
          {TICK_ANGLES.map((angle) => (
            <line
              key={angle}
              x1="100"
              y1="6"
              x2="100"
              y2={angle % 90 === 0 ? '12' : '9.5'}
              stroke="#AD9677"
              strokeOpacity={angle % 90 === 0 ? '0.55' : '0.28'}
              strokeWidth={angle % 90 === 0 ? '1.75' : '1.1'}
              strokeLinecap="round"
              transform={`rotate(${angle} 100 100)`}
            />
          ))}

          {/* Background Track */}
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke="#D1C1A8"
            strokeOpacity="0.45"
            strokeWidth="7"
          />

          {/* Fluid Progress Arc */}
          <circle
            cx="100"
            cy="100"
            r={RADIUS}
            fill="none"
            stroke={isComplete ? 'url(#levainCompleteGradient)' : 'url(#levainTimerGradient)'}
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: isTimerRunning
                ? 'stroke-dashoffset 0.95s linear, stroke 0.4s ease'
                : 'stroke-dashoffset 0.45s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          />

          {/* Smooth Gliding Orbital Bead */}
          {isTimerRunning && !isZeroDurationStep && !isComplete && (
            <g
              style={{
                transform: `rotate(${rotationDegrees}deg)`,
                transformOrigin: '100px 100px',
                transition: 'transform 0.95s linear'
              }}
            >
              <circle
                cx="100"
                cy={100 - RADIUS}
                r="5.5"
                fill="#FAF5EE"
                stroke="#2E1E14"
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 select-none">
          {/* Status Pill */}
          <div className="mb-1">
            {isZeroDurationStep ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#E7CEB5] border border-[#D1C1A8] text-[10px] font-bold uppercase tracking-wider text-[#2E1E14]">
                <Sparkles className="w-2.5 h-2.5 text-[#986A4C]" />
                <span>Milestone</span>
              </span>
            ) : isComplete ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-[#986A4C] text-[#FAF5EE] text-[10px] font-bold uppercase tracking-wider shadow-2xs animate-pulse">
                <BellRing className="w-2.5 h-2.5" />
                <span>Timer Up</span>
              </span>
            ) : isTimerRunning ? (
              <span className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest text-[#986A4C]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#986A4C] animate-pulse" />
                <span>Remaining</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2E1E14]/60">
                Duration
              </span>
            )}
          </div>

          {/* Primary Time Digits */}
          <div
            className={`font-mono font-extrabold tracking-tight tabular-nums leading-none transition-colors duration-300 ${
              isZeroDurationStep
                ? 'font-serif text-3xl text-[#2E1E14]'
                : displayDigits.length > 5
                  ? 'text-3xl sm:text-[34px] text-[#2E1E14]'
                  : 'text-4xl sm:text-[42px] text-[#2E1E14]'
            }`}
          >
            {displayDigits}
          </div>

          {/* Sub-caption inside dial */}
          <div className="mt-1.5 text-[11px] font-medium text-[#2E1E14]/65">
            {isZeroDurationStep ? (
              <span>No timer needed</span>
            ) : isComplete ? (
              <span className="font-semibold text-[#986A4C]">Ready for next step</span>
            ) : isTimerRunning ? (
              <span>
                <span className="font-mono font-semibold text-[#2E1E14]/80">{countdown.progressPercentage}%</span>
                {endClockString && <span> · Ends {endClockString}</span>}
              </span>
            ) : (
              <span>Tap Start Step below</span>
            )}
          </div>
        </div>
      </div>

      {/* Next Step Reminder Strip */}
      {nextStep && (
        <div
          className={`mt-2 w-full max-w-xs px-3.5 py-2 rounded-2xl border text-xs flex items-center justify-between gap-2 transition-colors ${
            isComplete
              ? 'bg-[#2E1E14] text-[#FAF5EE] border-[#2E1E14]'
              : 'bg-[#E7CEB5]/55 text-[#2E1E14]/85 border-[#D1C1A8]/70'
          }`}
        >
          <span className="truncate">
            <span className={isComplete ? 'text-[#E7CEB5] font-medium' : 'text-[#2E1E14]/60'}>
              {isComplete ? 'Start next: ' : 'Next: '}
            </span>
            <strong className={isComplete ? 'text-[#FAF5EE] font-bold' : 'text-[#2E1E14] font-semibold'}>
              {nextStep.shortName || nextStep.name}
            </strong>
          </span>
          {!isZeroDurationStep && (
            <span
              className={`font-mono text-[11px] shrink-0 ${
                isComplete ? 'text-[#E7CEB5] font-semibold' : 'text-[#2E1E14]/65'
              }`}
            >
              {nextStep.startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

