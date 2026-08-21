/**
 * Sourdough Starter Feeding Formula Engine
 * 
 * Formula:
 * 1. Target Dough Starter = loavesCount * starterGramsPerLoaf (default 100g per loaf)
 * 2. Reserve for Repopulation = 15g (left in jar for next bake)
 * 3. Total Levain Needed = Target Dough Starter + 15g Reserve
 * 4. 1:2:2 Standard Feeding Ratio (1 part seed : 2 parts water : 2 parts flour = 5 parts total):
 *    - Seed Starter = ceil(Total Levain / 5)
 *    - Feed Water = floor((Total Levain - Seed) / 2)
 *    - Feed Flour = Total Levain - Seed - Water
 * 5. Estimated Rise Time: 5 to 6 hours at warm room temp (76°F–80°F / 24°C–27°C)
 */

export interface StarterFeedingCalculation {
  loavesCount: number;
  starterNeededForDough: number; // Grams needed for the dough
  reserveForRepopulation: number; // 15g left over in jar
  totalLevainYield: number; // Total grams yielded by feeding
  seedStarterGrams: number;
  waterGrams: number;
  flourGrams: number;
  feedRatio: string;
  isCustomMinimum: boolean;
  estimatedHours: number;
  description: string;
  instructions: string[];
}

export function calculateStarterFeeding(
  loavesCount: number = 1,
  starterPerLoaf: number = 100,
  reserveGrams: number = 15,
  customSeedGrams?: number
): StarterFeedingCalculation {
  const loaves = Math.max(1, loavesCount);
  const starterNeededForDough = loaves * starterPerLoaf;
  const totalLevainYield = starterNeededForDough + reserveGrams;

  let seedStarterGrams: number;
  let isCustomMinimum = false;

  if (customSeedGrams !== undefined && customSeedGrams > 0) {
    seedStarterGrams = Math.min(totalLevainYield - 4, Math.max(5, Math.round(customSeedGrams)));
    isCustomMinimum = true;
  } else {
    // Standard 1:2:2 ratio formula (1 seed + 2 water + 2 flour = 5 parts)
    seedStarterGrams = Math.ceil(totalLevainYield / 5);
  }

  const remainingFeed = Math.max(2, totalLevainYield - seedStarterGrams);
  const waterGrams = Math.floor(remainingFeed / 2);
  const flourGrams = remainingFeed - waterGrams;

  // Calculate ratio multiplier M = flourGrams / seedStarterGrams
  const ratioMultiplier = Math.max(1, flourGrams / seedStarterGrams);
  const roundedRatio = Math.round(ratioMultiplier * 10) / 10;
  const feedRatio = `1:${roundedRatio}:${roundedRatio}`;

  // Time to peak calibrated:
  // 1:1:1 (~4h), 1:2:2 (~5.5h), 1:3.3:3.3 (15g seed for 1 loaf -> exactly 6.0 hours), 1:6.7:6.7 (15g seed for 2 loaves -> 8.5 hours)
  let estimatedHours: number;
  if (ratioMultiplier <= 1.2) {
    estimatedHours = 4.0;
  } else if (ratioMultiplier <= 2.2) {
    estimatedHours = 5.5;
  } else if (ratioMultiplier <= 3.6) {
    estimatedHours = 6.0; // 15g seed starter for 1 loaf takes 6 hours to peak
  } else if (ratioMultiplier <= 5.0) {
    estimatedHours = 7.5;
  } else if (ratioMultiplier <= 7.0) {
    estimatedHours = 8.5;
  } else {
    estimatedHours = Math.min(12, Math.round((6.0 + (ratioMultiplier - 3.3) * 0.7) * 2) / 2);
  }

  const loavesLabel = loaves === 1 ? '1 loaf' : `${loaves} loaves`;

  return {
    loavesCount: loaves,
    starterNeededForDough,
    reserveForRepopulation: reserveGrams,
    totalLevainYield,
    seedStarterGrams,
    waterGrams,
    flourGrams,
    feedRatio,
    isCustomMinimum,
    estimatedHours,
    description: isCustomMinimum 
      ? `Build ${totalLevainYield}g active levain for ${loavesLabel} using ${seedStarterGrams}g starter (${starterNeededForDough}g for dough + ${reserveGrams}g reserve).`
      : `Build ${totalLevainYield}g active levain for ${loavesLabel} (${starterNeededForDough}g for dough + ${reserveGrams}g starter reserve).`,
    instructions: [
      `In a clean jar, measure ${seedStarterGrams}g active seed starter${isCustomMinimum ? ' (minimum build)' : ''}.`,
      `Add ${waterGrams}g lukewarm water (~78°F / 25°C) and stir vigorously to dissolve.`,
      `Add ${flourGrams}g bread flour (or 50:50 white/whole wheat blend) and mix until no dry flour remains.`,
      `Mark jar level with a rubber band. Ratio ${feedRatio} yields ${totalLevainYield}g total: ${starterNeededForDough}g for ${loavesLabel} and leaves ${reserveGrams}g in the jar for repopulation.`,
      `Leave in a warm spot (75°F–80°F / 24°C–27°C). Due to the ${feedRatio} feeding ratio, estimated time to peak is ~${estimatedHours} hours.`
    ]
  };
}
