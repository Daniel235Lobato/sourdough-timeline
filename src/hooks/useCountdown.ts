import { useState, useEffect } from 'react';

export interface CountdownResult {
  hours: number;
  minutes: number;
  seconds: number;
  totalSecondsRemaining: number;
  isPast: boolean;
  formattedCountdown: string; // HH:MM:SS format
  progressPercentage: number;
}

export function formatDurationToHMS(minutesTotal: number): string {
  const totalSeconds = Math.max(0, Math.floor(minutesTotal * 60));
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function useCountdown(
  startTime?: Date | string | null,
  targetTime?: Date | string | null,
  isPaused: boolean = false,
  maxDurationMinutes?: number
): CountdownResult {
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    if (isPaused) return;

    // Immediately set now on mount/unpause
    setNow(Date.now());

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, startTime, targetTime]);

  if (!targetTime) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSecondsRemaining: 0,
      isPast: false,
      formattedCountdown: '00:00:00',
      progressPercentage: 0
    };
  }

  const targetDate = typeof targetTime === 'string' ? new Date(targetTime) : targetTime;
  const startDate = startTime ? (typeof startTime === 'string' ? new Date(startTime) : startTime) : null;

  const targetMs = targetDate.getTime();
  const diffMs = targetMs - now;
  
  let totalSecondsRemaining = Math.max(0, Math.floor(diffMs / 1000));
  
  // Cap at maximum duration so it never displays more than the step duration (e.g. never 00:30:03)
  if (typeof maxDurationMinutes === 'number' && maxDurationMinutes > 0) {
    const maxSec = Math.round(maxDurationMinutes * 60);
    totalSecondsRemaining = Math.min(maxSec, totalSecondsRemaining);
  }

  const isPast = diffMs <= 0;

  const hours = Math.floor(totalSecondsRemaining / 3600);
  const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
  const seconds = totalSecondsRemaining % 60;

  // Strict HH:MM:SS format: e.g. "00:30:00", "00:29:59", "06:00:00"
  const formattedCountdown = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Calculate percentage elapsed if start date is provided
  let progressPercentage = 0;
  if (startDate) {
    const totalDurationMs = targetMs - startDate.getTime();
    if (totalDurationMs > 0) {
      const elapsedMs = now - startDate.getTime();
      progressPercentage = Math.min(100, Math.max(0, Math.round((elapsedMs / totalDurationMs) * 100)));
    }
  }

  return {
    hours,
    minutes,
    seconds,
    totalSecondsRemaining,
    isPast,
    formattedCountdown,
    progressPercentage
  };
}
