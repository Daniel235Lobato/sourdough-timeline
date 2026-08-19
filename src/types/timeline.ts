export type StepPhase = 
  | 'starter' 
  | 'mix' 
  | 'ferment' 
  | 'shape' 
  | 'retard' 
  | 'bake' 
  | 'cool' 
  | 'complete';

export interface FermentationCue {
  title: string;
  checklist: string[];
  visualCue: string;
  proTip?: string;
}

export interface RecipeStep {
  id: string;
  name: string;
  shortName: string;
  description: string;
  detailedInstructions?: string[];
  ingredientsUsed?: { name: string; amount: number; unit: string }[];
  durationMinutes: number; // Duration of action or wait
  phase: StepPhase;
  icon: string; // Lucide icon identifier or emoji
  isBiologicalEstimate?: boolean; // If true, say "Estimated ~X time. Watch dough, not clock"
  targetRisePercentage?: string; // e.g. "50–75% rise"
  fermentationCues?: FermentationCue;
  isColdRetard?: boolean;
  minDurationMinutes?: number; // e.g., 720 (12h)
  maxDurationMinutes?: number; // e.g., 2880 (48h)
  isBakeStep?: boolean;
  isCoolingStep?: boolean;
  isFinalMilestone?: boolean;
  canOverrideCompletion?: boolean; // Allows "Bulk Ready Now" / "Starter Peaked"
  temperatureNote?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  loavesCount: number;
  flourGrams: number;
  waterGrams: number;
  starterGrams: number;
  saltGrams: number;
  extraIngredients?: { name: string; amount: number; unit: string }[];
  hydration: number; // percentage, e.g. 65
  starterRatio: string; // e.g. "1:3:3 (30g seed + 90g water + 90g flour)"
  starterFeedHours: number; // 6 hours
  defaultRetardHours: number; // 14 hours default (12h - 48h range)
  preheatMinutes: number; // 45 min
  bakeCoveredMinutes: number; // 20 min
  bakeUncoveredMinutes: number; // 25 min
  coolingMinutes: number; // 120 min (2 hours)
  ovenTempFahrenheit?: number; // 450-500
  steps: RecipeStep[];
  isCustom?: boolean;
  createdAt?: string;
}

export type ScheduleMode = 'start-when' | 'bake-by';

export interface ScheduledStep extends RecipeStep {
  index: number;
  startTime: Date;
  endTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  status: 'upcoming' | 'current' | 'completed' | 'skipped';
  isOvernightTransition?: boolean;
  dayLabel?: string; // "Today", "Tomorrow", "Saturday"
}

export interface BakeSession {
  id: string;
  recipeId: string;
  recipeName: string;
  mode: ScheduleMode;
  targetStartTime: Date;
  targetBakeByTime?: Date;
  coldRetardHours: number;
  steps: ScheduledStep[];
  currentStepIndex: number;
  startedAt: Date;
  isCompleted: boolean;
  completedAt?: Date;
  notes?: string;
  rating?: number;
  flourGrams: number;
  waterGrams: number;
  starterGrams: number;
  saltGrams: number;
  hydration: number;
  loavesCount: number;
}

export interface BakeHistoryEntry {
  id: string;
  recipeName: string;
  loavesCount: number;
  hydration: number;
  startedAt: string;
  bakedAt: string;
  completedAt: string;
  actualBulkMinutes?: number;
  actualRetardHours?: number;
  rating: number; // 1 - 5
  notes: string;
  photos?: string[];
  ambientTempF?: number;
  flourType?: string;
}
