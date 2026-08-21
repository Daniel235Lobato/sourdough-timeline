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
  estimatedHours: number;
  description: string;
  instructions: string[];
}

export function calculateStarterFeeding(
  loavesCount: number = 1,
  starterPerLoaf: number = 100,
  reserveGrams: number = 15
): StarterFeedingCalculation {
  const loaves = Math.max(1, loavesCount);
  const starterNeededForDough = loaves * starterPerLoaf;
  const totalLevainYield = starterNeededForDough + reserveGrams;

  // 1:2:2 ratio formula (1 seed + 2 water + 2 flour = 5 parts)
  const seedStarterGrams = Math.ceil(totalLevainYield / 5);
  const remainingFeed = totalLevainYield - seedStarterGrams;
  const waterGrams = Math.floor(remainingFeed / 2);
  const flourGrams = remainingFeed - waterGrams;

  const loavesLabel = loaves === 1 ? '1 loaf' : `${loaves} loaves`;

  return {
    loavesCount: loaves,
    starterNeededForDough,
    reserveForRepopulation: reserveGrams,
    totalLevainYield,
    seedStarterGrams,
    waterGrams,
    flourGrams,
    feedRatio: '1:2:2',
    estimatedHours: 5.5,
    description: `Build ${totalLevainYield}g active levain for ${loavesLabel} (${starterNeededForDough}g for dough + ${reserveGrams}g starter reserve).`,
    instructions: [
      `In a clean jar, measure ${seedStarterGrams}g active seed starter.`,
      `Add ${waterGrams}g lukewarm water (~78°F / 25°C) and stir vigorously to dissolve.`,
      `Add ${flourGrams}g bread flour (or 50:50 white/whole wheat blend) and mix until no dry flour remains.`,
      `Mark jar level with a rubber band. Yields ${totalLevainYield}g total: ${starterNeededForDough}g for ${loavesLabel} and leaves ${reserveGrams}g in the jar for repopulation.`,
      `Leave in a warm spot (75°F–80°F / 24°C–27°C) for 5–6 hours until doubled/tripled with domed crest.`
    ]
  };
}
