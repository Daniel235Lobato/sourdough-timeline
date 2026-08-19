import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Recipe, BakeSession, BakeHistoryEntry, ScheduleMode } from '../types/timeline';
import { DEFAULT_RECIPES, getRecipeWithSteps } from '../data/defaultRecipes';
import { 
  calculateForwardSchedule, 
  calculateReverseSchedule, 
  rescheduleFromCurrentStep,
  startFromChosenStep
} from '../engine/scheduler';
import { useAudioChime } from '../hooks/useAudioChime';
import { useNotifications } from '../hooks/useNotifications';

interface SourdoughContextType {
  recipes: Recipe[];
  selectedRecipe: Recipe;
  setSelectedRecipe: (recipe: Recipe) => void;
  activeSession: BakeSession | null;
  bakeHistory: BakeHistoryEntry[];
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (val: boolean) => void;
  
  // Core Actions
  startNewBake: (mode: ScheduleMode, targetDate: Date, coldRetardHours?: number, recipeToUse?: Recipe) => void;
  completeCurrentStep: () => void;
  advanceToStepIndex: (index: number) => void;
  triggerBiologicalReady: (stepId: string) => void;
  adjustRunningBehind: (type: 'starter_late' | 'bulk_late' | 'started_late' | 'bake_later' | 'bake_sooner', customMinutes?: number) => void;
  startFromStep: (stepIndex: number, effectiveTime?: Date) => void;
  updateColdRetardHours: (newHours: number) => void;
  finishAndSaveBake: (rating: number, notes: string, ambientTemp?: number, flourType?: string) => void;
  resetSession: () => void;
  
  // Recipe Management
  saveRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  scaleRecipeLoaves: (recipeId: string, newLoavesCount: number) => void;
}

const STORAGE_KEYS = {
  ACTIVE_SESSION: 'levain_active_session_v1',
  CUSTOM_RECIPES: 'levain_custom_recipes_v1',
  SELECTED_RECIPE_ID: 'levain_selected_recipe_id_v1',
  BAKE_HISTORY: 'levain_bake_history_v1',
  SETTINGS: 'levain_settings_v1',
};

const SourdoughContext = createContext<SourdoughContextType | undefined>(undefined);

export const SourdoughProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { playStepChime, playSuccessCelebration } = useAudioChime();
  const { sendNotification, requestPermission } = useNotifications();

  // Load custom recipes and combine with default recipes
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_RECIPES);
      if (saved) {
        const parsed: Recipe[] = JSON.parse(saved);
        return [...DEFAULT_RECIPES, ...parsed.map(getRecipeWithSteps)];
      }
    } catch {
      // Storage parsing fallback
    }
    return DEFAULT_RECIPES.map(getRecipeWithSteps);
  });

  const [selectedRecipe, setSelectedRecipeState] = useState<Recipe>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_KEYS.SELECTED_RECIPE_ID);
      const found = recipes.find(r => r.id === savedId);
      if (found) return getRecipeWithSteps(found);
    } catch {
      // Fallback
    }
    return getRecipeWithSteps(DEFAULT_RECIPES[0]);
  });

  const setSelectedRecipe = (recipe: Recipe) => {
    const full = getRecipeWithSteps(recipe);
    setSelectedRecipeState(full);
    localStorage.setItem(STORAGE_KEYS.SELECTED_RECIPE_ID, full.id);
  };

  // Active Bake Session
  const [activeSession, setActiveSession] = useState<BakeSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Revive Dates
        return {
          ...parsed,
          targetStartTime: new Date(parsed.targetStartTime),
          targetBakeByTime: parsed.targetBakeByTime ? new Date(parsed.targetBakeByTime) : undefined,
          startedAt: new Date(parsed.startedAt),
          completedAt: parsed.completedAt ? new Date(parsed.completedAt) : undefined,
          steps: parsed.steps.map((s: Record<string, unknown>) => ({
            ...s,
            startTime: new Date(s.startTime as string),
            endTime: new Date(s.endTime as string),
            actualStartTime: s.actualStartTime ? new Date(s.actualStartTime as string) : undefined,
            actualEndTime: s.actualEndTime ? new Date(s.actualEndTime as string) : undefined,
          }))
        };
      }
    } catch {
      // Fallback
    }
    return null;
  });

  // Bake History
  const [bakeHistory, setBakeHistory] = useState<BakeHistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BAKE_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [
      {
        id: 'sample-bake-1',
        recipeName: 'Classic Sourdough',
        loavesCount: 2,
        hydration: 65,
        startedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        bakedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        completedAt: new Date(Date.now() - 86400000 * 2 + 7200000).toISOString(),
        actualBulkMinutes: 165,
        actualRetardHours: 15,
        rating: 5,
        notes: 'Incredible blistered crust and open ear! Room temp was 76°F, dough rose beautifully with 65% expansion in 2.75 hours.',
        ambientTempF: 76,
        flourType: 'King Arthur Bread Flour'
      }
    ];
  });

  // Settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  // Sync activeSession to LocalStorage
  useEffect(() => {
    if (activeSession) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(activeSession));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
  }, [activeSession]);

  // Sync bakeHistory to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BAKE_HISTORY, JSON.stringify(bakeHistory));
  }, [bakeHistory]);

  /**
   * Start a brand new bake session using Start When (forward) or Bake By (reverse)
   */
  const startNewBake = useCallback((
    mode: ScheduleMode,
    targetDate: Date,
    coldRetardHours: number = 14,
    recipeToUse: Recipe = selectedRecipe
  ) => {
    const fullRecipe = getRecipeWithSteps(recipeToUse);
    let calculatedSteps = [];
    let startTime: Date;
    let targetBakeBy: Date | undefined;

    if (mode === 'start-when') {
      startTime = targetDate;
      calculatedSteps = calculateForwardSchedule(fullRecipe, startTime, coldRetardHours);
      targetBakeBy = calculatedSteps[calculatedSteps.length - 1]?.endTime;
    } else {
      targetBakeBy = targetDate;
      const reverseResult = calculateReverseSchedule(fullRecipe, targetBakeBy, coldRetardHours);
      calculatedSteps = reverseResult.steps;
      startTime = reverseResult.calculatedStartTime;
    }

    const newSession: BakeSession = {
      id: `bake-${Date.now()}`,
      recipeId: fullRecipe.id,
      recipeName: fullRecipe.name,
      mode,
      targetStartTime: startTime,
      targetBakeByTime: targetBakeBy,
      coldRetardHours,
      steps: calculatedSteps,
      currentStepIndex: 0,
      startedAt: new Date(),
      isCompleted: false,
      flourGrams: fullRecipe.flourGrams,
      waterGrams: fullRecipe.waterGrams,
      starterGrams: fullRecipe.starterGrams,
      saltGrams: fullRecipe.saltGrams,
      hydration: fullRecipe.hydration,
      loavesCount: fullRecipe.loavesCount
    };

    setActiveSession(newSession);

    if (soundEnabled) {
      playStepChime();
    }
    if (notificationsEnabled) {
      requestPermission().then(() => {
        sendNotification(
          'Timeline Generated',
          `Your sourdough schedule is ready! Starting at ${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        );
      });
    }
  }, [selectedRecipe, soundEnabled, notificationsEnabled, playStepChime, requestPermission, sendNotification]);

  /**
   * Mark current step complete and advance to next
   */
  const completeCurrentStep = useCallback(() => {
    if (!activeSession) return;
    const now = new Date();
    const currIdx = activeSession.currentStepIndex;
    const nextIdx = currIdx + 1;

    // Reschedule subsequent steps starting from now
    const updatedSteps = rescheduleFromCurrentStep(activeSession.steps, currIdx, now);
    const isNowCompleted = nextIdx >= updatedSteps.length;

    setActiveSession({
      ...activeSession,
      currentStepIndex: Math.min(nextIdx, updatedSteps.length - 1),
      steps: updatedSteps,
      isCompleted: isNowCompleted,
      completedAt: isNowCompleted ? now : undefined
    });

    if (soundEnabled) {
      if (isNowCompleted) {
        playSuccessCelebration();
      } else {
        playStepChime();
      }
    }

    if (notificationsEnabled && !isNowCompleted) {
      const nextStep = updatedSteps[nextIdx];
      if (nextStep) {
        sendNotification(
          nextStep.shortName,
          `Next step: ${nextStep.name}. Duration: ${nextStep.durationMinutes}m`
        );
      }
    }
  }, [activeSession, soundEnabled, notificationsEnabled, playStepChime, playSuccessCelebration, sendNotification]);

  /**
   * Jump to specific step index
   */
  const advanceToStepIndex = useCallback((index: number) => {
    if (!activeSession || index < 0 || index >= activeSession.steps.length) return;
    const now = new Date();
    const updatedSteps = activeSession.steps.map((step, idx) => {
      if (idx < index) {
        return { ...step, status: 'completed' as const, actualEndTime: now };
      } else if (idx === index) {
        return { ...step, status: 'current' as const, startTime: now };
      } else {
        return { ...step, status: 'upcoming' as const };
      }
    });

    // Re-propagate forward from this step
    const rescheduled = rescheduleFromCurrentStep(updatedSteps, index - 1 >= 0 ? index - 1 : 0, now);

    setActiveSession({
      ...activeSession,
      currentStepIndex: index,
      steps: rescheduled,
      isCompleted: index === rescheduled.length - 1 && rescheduled[index].isFinalMilestone === true
    });
  }, [activeSession]);

  /**
   * Biological Override: "Bulk is Ready Now" or "Starter Peaked"
   */
  const triggerBiologicalReady = useCallback((stepId: string) => {
    if (!activeSession) return;
    const stepIdx = activeSession.steps.findIndex(s => s.id === stepId);
    if (stepIdx !== -1) {
      // Complete this step right now and push forward
      const now = new Date();
      const updatedSteps = rescheduleFromCurrentStep(activeSession.steps, stepIdx, now);
      const nextIdx = Math.min(stepIdx + 1, updatedSteps.length - 1);

      setActiveSession({
        ...activeSession,
        currentStepIndex: nextIdx,
        steps: updatedSteps
      });

      if (soundEnabled) playStepChime();
      if (notificationsEnabled) {
        sendNotification('Fermentation Complete', 'Proceeding immediately to next step!');
      }
    }
  }, [activeSession, soundEnabled, notificationsEnabled, playStepChime, sendNotification]);

  /**
   * "I'm Running Behind" intelligent handler
   */
  const adjustRunningBehind = useCallback((
    type: 'starter_late' | 'bulk_late' | 'started_late' | 'bake_later' | 'bake_sooner',
    customMinutes: number = 45
  ) => {
    if (!activeSession) return;
    const currentIdx = activeSession.currentStepIndex;
    const currentStep = activeSession.steps[currentIdx];
    const now = new Date();

    const updatedSteps = [...activeSession.steps];

    if (type === 'starter_late') {
      // Extend starter or current step duration by customMinutes
      updatedSteps[currentIdx] = {
        ...currentStep,
        durationMinutes: currentStep.durationMinutes + customMinutes,
        endTime: new Date(currentStep.endTime.getTime() + customMinutes * 60000)
      };
    } else if (type === 'bulk_late') {
      // Find bulk step and add time
      const bulkIdx = updatedSteps.findIndex(s => s.id === 'bulk-complete' || s.id === 'stretch-fold-4');
      const targetIdx = bulkIdx !== -1 ? bulkIdx : currentIdx;
      updatedSteps[targetIdx] = {
        ...updatedSteps[targetIdx],
        durationMinutes: updatedSteps[targetIdx].durationMinutes + customMinutes,
        endTime: new Date(updatedSteps[targetIdx].endTime.getTime() + customMinutes * 60000)
      };
    } else if (type === 'started_late') {
      // Shift current step start time to right now
      updatedSteps[currentIdx] = {
        ...currentStep,
        startTime: now,
        endTime: new Date(now.getTime() + currentStep.durationMinutes * 60000)
      };
    } else if (type === 'bake_later') {
      // Extend cold retard by e.g. 4 hours
      const retardIdx = updatedSteps.findIndex(s => s.isColdRetard);
      if (retardIdx !== -1) {
        const addedHours = Math.min(24, Math.round(customMinutes / 60) || 4);
        const newRetardDuration = Math.min(2880, updatedSteps[retardIdx].durationMinutes + addedHours * 60);
        updatedSteps[retardIdx] = {
          ...updatedSteps[retardIdx],
          durationMinutes: newRetardDuration
        };
      }
    } else if (type === 'bake_sooner') {
      // Shorten cold retard down to minimum 12 hours (720 min)
      const retardIdx = updatedSteps.findIndex(s => s.isColdRetard);
      if (retardIdx !== -1) {
        const newRetardDuration = Math.max(720, updatedSteps[retardIdx].durationMinutes - (customMinutes || 120));
        updatedSteps[retardIdx] = {
          ...updatedSteps[retardIdx],
          durationMinutes: newRetardDuration
        };
      }
    }

    // Re-propagate the updated durations forward
    let cursor = updatedSteps[currentIdx].startTime;
    for (let i = currentIdx; i < updatedSteps.length; i++) {
      const step = updatedSteps[i];
      const start = cursor;
      const end = new Date(start.getTime() + step.durationMinutes * 60000);
      updatedSteps[i] = {
        ...step,
        startTime: start,
        endTime: end
      };
      cursor = end;
    }

    setActiveSession({
      ...activeSession,
      steps: updatedSteps,
      targetBakeByTime: updatedSteps[updatedSteps.length - 1]?.endTime
    });

    if (soundEnabled) playStepChime();
  }, [activeSession, soundEnabled, playStepChime]);

  /**
   * Start schedule from chosen step mid-bake
   */
  const startFromStep = useCallback((stepIndex: number, effectiveTime: Date = new Date()) => {
    if (!activeSession) {
      // Create session on selected recipe
      const newSteps = startFromChosenStep(selectedRecipe, stepIndex, effectiveTime, 14);
      setActiveSession({
        id: `bake-${Date.now()}`,
        recipeId: selectedRecipe.id,
        recipeName: selectedRecipe.name,
        mode: 'start-when',
        targetStartTime: effectiveTime,
        targetBakeByTime: newSteps[newSteps.length - 1]?.endTime,
        coldRetardHours: 14,
        steps: newSteps,
        currentStepIndex: stepIndex,
        startedAt: effectiveTime,
        isCompleted: false,
        flourGrams: selectedRecipe.flourGrams,
        waterGrams: selectedRecipe.waterGrams,
        starterGrams: selectedRecipe.starterGrams,
        saltGrams: selectedRecipe.saltGrams,
        hydration: selectedRecipe.hydration,
        loavesCount: selectedRecipe.loavesCount
      });
      return;
    }

    const updated = startFromChosenStep(selectedRecipe, stepIndex, effectiveTime, activeSession.coldRetardHours);
    setActiveSession({
      ...activeSession,
      steps: updated,
      currentStepIndex: stepIndex,
      targetBakeByTime: updated[updated.length - 1]?.endTime
    });
  }, [activeSession, selectedRecipe]);

  /**
   * Update Cold Retard Duration Slider (12h - 48h)
   */
  const updateColdRetardHours = useCallback((newHours: number) => {
    if (!activeSession) return;
    const clampedHours = Math.max(12, Math.min(48, newHours));
    const retardIdx = activeSession.steps.findIndex(s => s.isColdRetard);

    if (retardIdx !== -1) {
      const updatedSteps = [...activeSession.steps];
      updatedSteps[retardIdx] = {
        ...updatedSteps[retardIdx],
        durationMinutes: clampedHours * 60
      };

      // Propagate forward
      let cursor = updatedSteps[retardIdx].startTime;
      for (let i = retardIdx; i < updatedSteps.length; i++) {
        const step = updatedSteps[i];
        const s = cursor;
        const e = new Date(s.getTime() + step.durationMinutes * 60000);
        updatedSteps[i] = {
          ...step,
          startTime: s,
          endTime: e
        };
        cursor = e;
      }

      setActiveSession({
        ...activeSession,
        coldRetardHours: clampedHours,
        steps: updatedSteps,
        targetBakeByTime: updatedSteps[updatedSteps.length - 1]?.endTime
      });
    }
  }, [activeSession]);

  /**
   * Save completed bake to history
   */
  const finishAndSaveBake = useCallback((
    rating: number,
    notes: string,
    ambientTemp?: number,
    flourType?: string
  ) => {
    if (!activeSession) return;
    const now = new Date();

    const bakeStep = activeSession.steps.find(s => s.isBakeStep);
    const bulkStep = activeSession.steps.find(s => s.id === 'stretch-fold-4' || s.id === 'bulk-complete');

    const newHistoryEntry: BakeHistoryEntry = {
      id: `history-${Date.now()}`,
      recipeName: activeSession.recipeName,
      loavesCount: activeSession.loavesCount,
      hydration: activeSession.hydration,
      startedAt: activeSession.startedAt.toISOString(),
      bakedAt: (bakeStep ? bakeStep.startTime : now).toISOString(),
      completedAt: now.toISOString(),
      actualBulkMinutes: bulkStep ? bulkStep.durationMinutes : 150,
      actualRetardHours: activeSession.coldRetardHours,
      rating,
      notes,
      ambientTempF: ambientTemp,
      flourType
    };

    setBakeHistory(prev => [newHistoryEntry, ...prev]);
    setActiveSession(prev => prev ? { ...prev, isCompleted: true, rating, notes, completedAt: now } : null);
  }, [activeSession]);

  /**
   * Reset session to start over
   */
  const resetSession = useCallback(() => {
    setActiveSession(null);
  }, []);

  /**
   * Recipe Management
   */
  const saveRecipe = useCallback((recipe: Recipe) => {
    const full = getRecipeWithSteps(recipe);
    setRecipes(prev => {
      const idx = prev.findIndex(r => r.id === full.id);
      let updated: Recipe[];
      if (idx >= 0) {
        updated = [...prev];
        updated[idx] = full;
      } else {
        updated = [...prev, full];
      }
      const customOnly = updated.filter(r => r.isCustom);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(customOnly));
      return updated;
    });
    setSelectedRecipeState(full);
  }, []);

  const deleteRecipe = useCallback((id: string) => {
    setRecipes(prev => {
      const filtered = prev.filter(r => r.id !== id);
      const customOnly = filtered.filter(r => r.isCustom);
      localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(customOnly));
      return filtered;
    });
    setSelectedRecipeState(DEFAULT_RECIPES[0]);
  }, []);

  const scaleRecipeLoaves = useCallback((recipeId: string, newLoavesCount: number) => {
    if (newLoavesCount < 1 || newLoavesCount > 8) return;
    setRecipes(prev => {
      let updatedSelected: Recipe | null = null;
      const updated = prev.map(recipe => {
        if (recipe.id !== recipeId) return recipe;
        const scaleFactor = newLoavesCount / recipe.loavesCount;
        const newFlour = Math.round(recipe.flourGrams * scaleFactor);
        const newWater = Math.round(recipe.waterGrams * scaleFactor);
        const newStarter = Math.round(recipe.starterGrams * scaleFactor);
        const newSalt = Math.round(recipe.saltGrams * scaleFactor);

        const scaled: Recipe = {
          ...recipe,
          loavesCount: newLoavesCount,
          flourGrams: newFlour,
          waterGrams: newWater,
          starterGrams: newStarter,
          saltGrams: newSalt,
          steps: recipe.steps.map(step => {
            if (step.id === 'mix-dough') {
              return {
                ...step,
                ingredientsUsed: [
                  { name: 'Flour', amount: newFlour, unit: 'g' },
                  { name: 'Water', amount: newWater, unit: 'g' },
                  { name: 'Peaked Starter', amount: newStarter, unit: 'g' }
                ]
              };
            }
            if (step.id === 'add-salt') {
              return {
                ...step,
                ingredientsUsed: [
                  { name: 'Fine Sea Salt', amount: newSalt, unit: 'g' }
                ]
              };
            }
            return step;
          })
        };
        updatedSelected = scaled;
        return scaled;
      });

      if (updatedSelected) {
        setSelectedRecipeState(updatedSelected);
      }
      return updated;
    });
  }, []);

  return (
    <SourdoughContext.Provider value={{
      recipes,
      selectedRecipe,
      setSelectedRecipe,
      activeSession,
      bakeHistory,
      soundEnabled,
      setSoundEnabled,
      notificationsEnabled,
      setNotificationsEnabled,
      startNewBake,
      completeCurrentStep,
      advanceToStepIndex,
      triggerBiologicalReady,
      adjustRunningBehind,
      startFromStep,
      updateColdRetardHours,
      finishAndSaveBake,
      resetSession,
      saveRecipe,
      deleteRecipe,
      scaleRecipeLoaves
    }}>
      {children}
    </SourdoughContext.Provider>
  );
};

export const useSourdough = () => {
  const context = useContext(SourdoughContext);
  if (!context) {
    throw new Error('useSourdough must be used within a SourdoughProvider');
  }
  return context;
};
