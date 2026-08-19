import { useState, useEffect } from 'react';

export interface CountdownResult {
  hours: number;
  minutes: number;
  seconds: number;
  totalSecondsRemaining: number;
  isPast: boolean;
  formattedCountdown: string;
  progressPercentage: number;
}

export function useCountdown(
  startTime?: Date | string | null,
  targetTime?: Date | string | null
): CountdownResult {
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!targetTime) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSecondsRemaining: 0,
      isPast: false,
      formattedCountdown: '--:--',
      progressPercentage: 0
    };
  }

  const targetDate = typeof targetTime === 'string' ? new Date(targetTime) : targetTime;
  const startDate = startTime ? (typeof startTime === 'string' ? new Date(startTime) : startTime) : null;

  const targetMs = targetDate.getTime();
  const diffMs = targetMs - now;
  const totalSecondsRemaining = Math.max(0, Math.floor(diffMs / 1000));
  const isPast = diffMs <= 0;

  const hours = Math.floor(totalSecondsRemaining / 3600);
  const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
  const seconds = totalSecondsRemaining % 60;

  let formattedCountdown = '';
  if (hours > 0) {
    formattedCountdown = `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    formattedCountdown = `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  } else {
    formattedCountdown = `${seconds}s`;
  }

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
