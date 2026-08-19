import { addMinutes, subMinutes, format, isSameDay, addDays, isToday, isTomorrow } from 'date-fns';
import { Recipe, ScheduledStep, RecipeStep } from '../types/timeline';
import { getRecipeWithSteps } from '../data/defaultRecipes';

/**
 * Round a Date UP to the nearest half hour (e.g. :00 or :30) with seconds reset to 0
 */
export function roundToNearestHalfHour(date: Date): Date {
  const rounded = new Date(date);
  rounded.setSeconds(0, 0);
  const minutes = rounded.getMinutes();
  
  if (minutes === 0 || minutes === 30) {
    return rounded;
  } else if (minutes < 30) {
    rounded.setMinutes(30);
  } else {
    rounded.setMinutes(0);
    rounded.setHours(rounded.getHours() + 1);
  }
  return rounded;
}

/**
 * Calculate minimum total minutes required for a recipe to complete.
 */
export function getMinimumRecipeDurationMinutes(recipeInput: Recipe, coldRetardHours?: number): number {
  const recipe = getRecipeWithSteps(recipeInput);
  let totalMinutes = 0;

  recipe.steps.forEach((step: RecipeStep) => {
    if (step.isColdRetard) {
      const minRetard = step.minDurationMinutes || 720; // 12 hours minimum
      const effectiveRetard = coldRetardHours !== undefined 
        ? Math.max(minRetard, Math.round(coldRetardHours * 60))
        : (recipe.defaultRetardHours ? Math.round(recipe.defaultRetardHours * 60) : minRetard);
      totalMinutes += effectiveRetard;
    } else {
      totalMinutes += step.durationMinutes;
    }
  });

  return totalMinutes;
}

/**
 * Calculate the earliest valid future "Bake By" date/time from the current moment,
 * strictly rounded up to the nearest half hour.
 */
export function getEarliestBakeByTime(recipe: Recipe, baseTime: Date = new Date(), coldRetardHours?: number): Date {
  const minDurationMin = getMinimumRecipeDurationMinutes(recipe, coldRetardHours);
  const rawEarliest = addMinutes(baseTime, minDurationMin);
  return roundToNearestHalfHour(rawEarliest);
}

/**
 * Format friendly day label relative to today / bake start
 */
export function getFriendlyDayLabel(date: Date, referenceDate: Date = new Date()): string {
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'EEEE, MMM d');
}

/**
 * Forward Scheduling Engine:
 * Takes a Start Date/Time and projects all steps sequentially into the future.
 */
export function calculateForwardSchedule(
  recipeInput: Recipe,
  startTime: Date,
  coldRetardHours: number = 14
): ScheduledStep[] {
  const recipe = getRecipeWithSteps(recipeInput);
  const scheduledSteps: ScheduledStep[] = [];
  let currentCursor = new Date(startTime);

  recipe.steps.forEach((step: RecipeStep, index: number) => {
    let duration = step.durationMinutes;

    // Apply custom cold retard duration if this is the refrigerator step
    if (step.isColdRetard) {
      duration = Math.round(coldRetardHours * 60);
    }

    const stepStart = new Date(currentCursor);
    const stepEnd = addMinutes(stepStart, duration);

    // Detect if this step crosses a midnight boundary
    const isOvernightTransition = !isSameDay(stepStart, stepEnd);

    scheduledSteps.push({
      ...step,
      index,
      durationMinutes: duration,
      startTime: stepStart,
      endTime: stepEnd,
      status: index === 0 ? 'current' : 'upcoming',
      isOvernightTransition,
      dayLabel: getFriendlyDayLabel(stepStart)
    });

    // Advance cursor for next step
    currentCursor = stepEnd;
  });

  return scheduledSteps;
}

/**
 * Reverse Scheduling Engine (Google Maps "Arrive By" for Sourdough):
 * Takes a Target Loaf Ready Date/Time and works backwards step by step
 * to determine the exact time to feed the starter.
 */
export function calculateReverseSchedule(
  recipeInput: Recipe,
  targetReadyTime: Date,
  coldRetardHours: number = 14
): { steps: ScheduledStep[]; calculatedStartTime: Date; totalDurationHours: number } {
  const recipe = getRecipeWithSteps(recipeInput);
  const stepsReversed: ScheduledStep[] = [];
  let currentCursor = new Date(targetReadyTime);

  // We loop from last step backwards
  const reversedRecipeSteps = [...recipe.steps].reverse();

  reversedRecipeSteps.forEach((step: RecipeStep) => {
    let duration = step.durationMinutes;

    if (step.isColdRetard) {
      duration = Math.round(coldRetardHours * 60);
    }

    const stepEnd = new Date(currentCursor);
    const stepStart = subMinutes(stepEnd, duration);

    const isOvernightTransition = !isSameDay(stepStart, stepEnd);

    stepsReversed.push({
      ...step,
      index: 0, // will assign correct ascending index below
      durationMinutes: duration,
      startTime: stepStart,
      endTime: stepEnd,
      status: 'upcoming',
      isOvernightTransition,
      dayLabel: getFriendlyDayLabel(stepStart)
    });

    currentCursor = stepStart;
  });

  // Re-reverse back to chronological order
  const chronologicalSteps = stepsReversed.reverse().map((step, idx) => ({
    ...step,
    index: idx,
    status: (idx === 0 ? 'current' : 'upcoming') as ScheduledStep['status']
  }));

  const calculatedStartTime = chronologicalSteps[0].startTime;
  const totalMinutes = (targetReadyTime.getTime() - calculatedStartTime.getTime()) / (1000 * 60);
  const totalDurationHours = Math.round((totalMinutes / 60) * 10) / 10;

  return {
    steps: chronologicalSteps,
    calculatedStartTime,
    totalDurationHours
  };
}

/**
 * Recalculate remaining schedule dynamically when a step is completed early or late.
 */
export function rescheduleFromCurrentStep(
  existingSteps: ScheduledStep[],
  currentStepIndex: number,
  actualCompletionTime: Date = new Date()
): ScheduledStep[] {
  const updatedSteps = [...existingSteps];

  // Mark current step as completed
  if (updatedSteps[currentStepIndex]) {
    updatedSteps[currentStepIndex] = {
      ...updatedSteps[currentStepIndex],
      actualEndTime: actualCompletionTime,
      status: 'completed'
    };
  }

  let nextCursor = new Date(actualCompletionTime);

  for (let i = currentStepIndex + 1; i < updatedSteps.length; i++) {
    const step = updatedSteps[i];
    const duration = step.durationMinutes;
    const stepStart = new Date(nextCursor);
    const stepEnd = addMinutes(stepStart, duration);

    updatedSteps[i] = {
      ...step,
      startTime: stepStart,
      endTime: stepEnd,
      status: i === currentStepIndex + 1 ? 'current' : 'upcoming',
      isOvernightTransition: !isSameDay(stepStart, stepEnd),
      dayLabel: getFriendlyDayLabel(stepStart)
    };

    nextCursor = stepEnd;
  }

  return updatedSteps;
}

/**
 * Mid-bake Synchronization: Start schedule from an arbitrary chosen step & time
 */
export function startFromChosenStep(
  recipeInput: Recipe,
  stepIndex: number,
  currentRealTime: Date = new Date(),
  coldRetardHours: number = 14
): ScheduledStep[] {
  const recipe = getRecipeWithSteps(recipeInput);
  const fullSteps = calculateForwardSchedule(recipe, currentRealTime, coldRetardHours);

  // Mark previous steps as completed
  return fullSteps.map((step, idx) => {
    if (idx < stepIndex) {
      return {
        ...step,
        status: 'completed' as const,
        actualEndTime: subMinutes(currentRealTime, (stepIndex - idx) * 30)
      };
    } else if (idx === stepIndex) {
      return {
        ...step,
        status: 'current' as const,
        startTime: currentRealTime,
        endTime: addMinutes(currentRealTime, step.durationMinutes)
      };
    } else {
      return {
        ...step,
        status: 'upcoming' as const
      };
    }
  });
}
