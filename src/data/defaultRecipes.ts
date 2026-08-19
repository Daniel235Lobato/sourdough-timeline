import { Recipe } from '../types/timeline';

export const DEFAULT_RECIPES: Recipe[] = [
  {
    id: 'classic-sourdough',
    name: 'Classic Sourdough (2 Loaves)',
    description: 'The golden standard open-crumb country loaf with crispy caramelized crust, tender open crumb, and subtle sourdough tang.',
    loavesCount: 2,
    flourGrams: 1000,
    waterGrams: 650,
    starterGrams: 200,
    saltGrams: 20,
    hydration: 65,
    starterRatio: '1:3:3 (30g starter + 90g water + 90g flour = 210g total)',
    starterFeedHours: 6,
    defaultRetardHours: 14, // 14h cold retard by default (flexible 12-48h)
    preheatMinutes: 45,
    bakeCoveredMinutes: 20,
    bakeUncoveredMinutes: 25,
    coolingMinutes: 120,
    ovenTempFahrenheit: 475,
    steps: [
      {
        id: 'feed-starter',
        name: '🌱 Feed Starter',
        shortName: 'Feed Starter',
        phase: 'starter',
        icon: 'Sprout',
        durationMinutes: 360, // 6 hours
        description: 'Build your levain for peak yeast activity.',
        detailedInstructions: [
          'In a clean glass jar, mix 30g mature starter, 90g lukewarm water (78°F / 25°C), and 90g bread flour.',
          'Stir vigorously until thoroughly combined with no dry patches.',
          'Scrape down the sides and place a rubber band at the current level.',
          'Leave in a warm spot (75°F–80°F / 24°C–27°C) for ~6 hours.'
        ],
        ingredientsUsed: [
          { name: 'Seed Starter', amount: 30, unit: 'g' },
          { name: 'Water (Lukewarm)', amount: 90, unit: 'g' },
          { name: 'Flour', amount: 90, unit: 'g' }
        ],
        isBiologicalEstimate: true,
        canOverrideCompletion: true,
        fermentationCues: {
          title: 'Starter Ready When:',
          visualCue: 'Doubled or tripled in volume with domed peak and webby active bubbles.',
          checklist: [
            'Doubled or tripled in volume above the rubber band marker',
            'Slightly domed top (not yet sunken in the center)',
            'Filled with aeration bubbles throughout the glass',
            'Sweet-yeasty, slightly fruity acidic aroma'
          ],
          proTip: 'Float test: Drop a teaspoon of starter gently into water. If it floats buoyantly, it is ready to bake!'
        }
      },
      {
        id: 'starter-peak',
        name: '🫧 Starter Ready / Levain Peaked',
        shortName: 'Levain Peaked',
        phase: 'starter',
        icon: 'Sparkles',
        durationMinutes: 0,
        description: 'Levain is at peak vitality. Time to mix the main dough.',
        canOverrideCompletion: true,
        fermentationCues: {
          title: 'Levain Peak Milestone',
          visualCue: 'Dome-shaped crest with maximum expansion.',
          checklist: [
            '200g needed for dough (keep 10g remaining to feed for your next bake)',
            'Do not wait until starter starts collapsing back down'
          ]
        }
      },
      {
        id: 'mix-dough',
        name: '🥣 Mix Dough (Autolyse)',
        shortName: 'Mix Dough',
        phase: 'mix',
        icon: 'ChefHat',
        durationMinutes: 30, // 30 min rest before salt
        description: 'Combine flour, water, and active starter. Allow flour to hydrate.',
        detailedInstructions: [
          'In a large mixing bowl, disperse 200g peaked starter into 650g warm water.',
          'Add 1000g flour. Mix by hand or dough scraper until all flour is fully hydrated (shaggy mass).',
          'Cover bowl with a damp towel and rest for 30 minutes to develop gluten and enzymatic activity.'
        ],
        ingredientsUsed: [
          { name: 'Bread Flour', amount: 1000, unit: 'g' },
          { name: 'Water (~80°F/27°C)', amount: 650, unit: 'g' },
          { name: 'Peaked Starter', amount: 200, unit: 'g' }
        ]
      },
      {
        id: 'add-salt',
        name: '🧂 Add Salt',
        shortName: 'Add Salt',
        phase: 'mix',
        icon: 'Sparkle',
        durationMinutes: 30, // 30 min rest before S&F 1
        description: 'Incorporate salt to strengthen gluten and control fermentation.',
        detailedInstructions: [
          'Sprinkle 20g fine sea salt evenly over the dough surface (optionally with 10g splash of water).',
          'Dimple and pinch the salt into the dough with your fingers.',
          'Perform slap-and-folds or bowl squeezes for 2–3 minutes until smooth and elastic.',
          'Cover and rest for 30 minutes before the first Stretch & Fold.'
        ],
        ingredientsUsed: [
          { name: 'Fine Sea Salt', amount: 20, unit: 'g' }
        ]
      },
      {
        id: 'stretch-fold-1',
        name: '🤲 Stretch & Fold #1',
        shortName: 'Fold #1',
        phase: 'ferment',
        icon: 'Layers',
        durationMinutes: 30,
        description: 'First structural fold to build gluten tension.',
        detailedInstructions: [
          'Wet hands with water to prevent sticking.',
          'Reach underneath one side of the dough, pull up gently without tearing, and fold over to the opposite side.',
          'Rotate the bowl 90 degrees and repeat for all 4 quadrants (North, South, East, West).',
          'Cover and rest 30 minutes.'
        ]
      },
      {
        id: 'stretch-fold-2',
        name: '🤲 Stretch & Fold #2',
        shortName: 'Fold #2',
        phase: 'ferment',
        icon: 'Layers',
        durationMinutes: 30,
        description: 'Second structural fold.',
        detailedInstructions: [
          'Wet hands and repeat 4-corner stretch and fold.',
          'Notice how the dough begins to feel smoother and more cohesive.',
          'Cover and rest 30 minutes.'
        ]
      },
      {
        id: 'stretch-fold-3',
        name: '🤲 Stretch & Fold #3',
        shortName: 'Fold #3',
        phase: 'ferment',
        icon: 'Layers',
        durationMinutes: 30,
        description: 'Third structural fold. Dough should show visible elasticity.',
        detailedInstructions: [
          'Perform gentle stretch and fold or coil folds.',
          'Be mindful not to degas the developing air pockets.',
          'Cover and rest 30 minutes.'
        ]
      },
      {
        id: 'stretch-fold-4',
        name: '🤲 Stretch & Fold #4',
        shortName: 'Fold #4',
        phase: 'ferment',
        icon: 'Layers',
        durationMinutes: 150, // 2.5 hours bulk fermentation after S&F 4
        description: 'Final fold. Leave dough undisturbed for bulk fermentation.',
        detailedInstructions: [
          'Perform a gentle final fold, smooth top surface, and tuck edges under.',
          'Transfer into a straight-sided transparent container if desired to monitor rise accurately.',
          'Cover and let rest untouched in a warm location (~78°F / 26°C).'
        ],
        isBiologicalEstimate: true,
        targetRisePercentage: '50–75% rise'
      },
      {
        id: 'bulk-complete',
        name: '🌡️ Bulk Fermentation Complete',
        shortName: 'Bulk Complete',
        phase: 'ferment',
        icon: 'TrendingUp',
        durationMinutes: 0,
        description: 'Dough has reached optimal fermentation with 50-75% rise.',
        isBiologicalEstimate: true,
        canOverrideCompletion: true,
        fermentationCues: {
          title: 'Bulk Ready When:',
          visualCue: 'Aerated, slightly domed with curved edges, jiggles like jelly when shaken.',
          checklist: [
            'Increased by approximately 50% to 75% in volume',
            'Surface is smooth, glossy, and domed at the container edges',
            'Visible translucent bubbles trapped under the surface',
            'Dough wobbles and jiggles freely when gently shaken',
            'Feels airy, pillowy, and releases easily with a wet finger'
          ],
          proTip: 'Watch the dough, not just the clock! If ambient temperature is cool (<70°F), bulk may take 1-2 hours longer.'
        }
      },
      {
        id: 'shape-loaves',
        name: '🍞 Divide & Shape 2 Loaves',
        shortName: 'Shape Loaves',
        phase: 'shape',
        icon: 'PackageCheck',
        durationMinutes: 30,
        description: 'Divide into 2 equal loaves (~930g each), pre-shape, rest, and final shape into bannetons.',
        detailedInstructions: [
          'Turn dough out onto a lightly dusted work surface.',
          'Divide dough into 2 equal portions (~935g each) using a bench knife.',
          'Pre-shape into loose rounds; let bench rest uncovered for 15 minutes.',
          'Dust bannetons with rice flour / 50:50 rice-wheat blend.',
          'Final shape: fold into batards (oval) or boules (round) creating taut surface tension.',
          'Stitch seams and transfer upside-down (smooth side down) into prepared bannetons.'
        ]
      },
      {
        id: 'cold-retard',
        name: '❄️ Cold Retard (Refrigerator Proof)',
        shortName: 'Cold Retard',
        phase: 'retard',
        icon: 'Snowflake',
        durationMinutes: 840, // 14 hours default (12h - 48h range)
        isColdRetard: true,
        minDurationMinutes: 720, // 12h
        maxDurationMinutes: 2880, // 48h
        description: 'Chill dough in refrigerator (36°F–39°F / 2°C–4°C) to develop complex flavor and blistered crust.',
        detailedInstructions: [
          'Slip bannetons into plastic bags or cover with reusable shower caps to retain moisture.',
          'Place immediately in the coldest zone of your refrigerator (36°F–39°F / 2°C–4°C).',
          'Cold retardation firms the dough for clean scoring and slows yeast while bacteria continue producing lactic acid.'
        ],
        fermentationCues: {
          title: 'Refrigerator Window:',
          visualCue: 'Firmed, cool dough with matte surface and slow enzymatic development.',
          checklist: [
            'Minimum 12 hours: Essential for crust blistering and dough firmness',
            'Optimal 14–24 hours: Sweet spot for balanced sourness and oven spring',
            'Maximum 48 hours: Safe window before over-proofing or gluten degradation'
          ]
        }
      },
      {
        id: 'preheat-oven',
        name: '🔥 Preheat Oven & Dutch Oven',
        shortName: 'Preheat Oven',
        phase: 'bake',
        icon: 'Flame',
        durationMinutes: 45,
        temperatureNote: '475°F / 245°C',
        description: 'Heat oven and heavy Dutch oven/combo cooker to saturated baking temperature.',
        detailedInstructions: [
          'Place Dutch oven (with lid on) or baking steel on the middle rack.',
          'Preheat oven to 475°F (245°C) for at least 45 minutes so the cast iron absorbs maximum radiant heat.'
        ]
      },
      {
        id: 'score-bake',
        name: '🔪 Score & Bake Loaves',
        shortName: 'Score & Bake',
        phase: 'bake',
        icon: 'Sparkles',
        durationMinutes: 45, // 20m covered + 25m uncovered
        description: 'Score with a razor blade (lame) and bake with trapped steam.',
        detailedInstructions: [
          'Remove one chilled banneton directly from the fridge (keep the second cold).',
          'Invert onto parchment paper and lightly dust excess flour off the top.',
          'Using a razor lame held at a 30° angle, make a single decisive longitudinal slash (~0.5 inch deep) for an ear.',
          'Carefully transfer into the screaming hot Dutch oven, add 1 ice cube for extra steam, and seal lid.',
          'Bake COVERED for 20 minutes at 475°F (245°C).',
          'Remove lid, lower temperature to 450°F (230°C), and bake UNCOVERED for 20–25 minutes until deep mahogany.'
        ]
      },
      {
        id: 'cool-loaves',
        name: '🌬️ Cool Loaves on Wire Rack',
        shortName: 'Cooling',
        phase: 'cool',
        icon: 'Wind',
        durationMinutes: 120, // 2 hours
        isCoolingStep: true,
        description: 'Allow internal steam to stabilize and crumb structure to set.',
        detailedInstructions: [
          'Transfer golden baked loaves onto a wire cooling rack.',
          'Listen to the loaf "sing" (crackling crust).',
          'DO NOT cut into warm bread! The crumb continues to bake and set as moisture redistributes. Wait at least 2 hours.'
        ],
        fermentationCues: {
          title: 'Cooling Patience:',
          visualCue: 'Internal crumb completes gelatinization.',
          checklist: [
            'Cutting too early will cause gummy, sticky interior texture',
            'Full flavor notes emerge after cooling to room temperature'
          ]
        }
      },
      {
        id: 'loaf-ready',
        name: '🎉 LOAVES READY TO ENJOY!',
        shortName: 'Loaves Ready',
        phase: 'complete',
        icon: 'Trophy',
        durationMinutes: 0,
        isFinalMilestone: true,
        description: 'Slice with a serrated bread knife and admire your artisan open crumb!',
        detailedInstructions: [
          'Slice with an offset serrated knife.',
          'Serve with salted grass-fed butter, fresh jam, or toasted with olive oil and flaky sea salt.'
        ]
      }
    ]
  },
  {
    id: 'high-hydration-sourdough',
    name: 'Tartine Style High Hydration (78%)',
    description: 'Custardy, open honeycombed crumb with a thin, blistered glass-like crust for experienced bakers.',
    loavesCount: 2,
    flourGrams: 1000,
    waterGrams: 780,
    starterGrams: 200,
    saltGrams: 20,
    hydration: 78,
    starterRatio: '1:3:3 (30g seed + 90g water + 90g flour)',
    starterFeedHours: 5.5,
    defaultRetardHours: 16,
    preheatMinutes: 45,
    bakeCoveredMinutes: 20,
    bakeUncoveredMinutes: 25,
    coolingMinutes: 120,
    ovenTempFahrenheit: 475,
    steps: [] // Will clone & scale from template
  },
  {
    id: 'whole-wheat-artisan',
    name: 'Rustic Whole Wheat Blend (72%)',
    description: '30% Stone-ground Whole Wheat flour blend offering rich nutty aroma and deep caramelized crust.',
    loavesCount: 2,
    flourGrams: 1000,
    waterGrams: 720,
    starterGrams: 200,
    saltGrams: 20,
    hydration: 72,
    starterRatio: '1:3:3 (30g seed + 90g water + 90g flour)',
    starterFeedHours: 5,
    defaultRetardHours: 14,
    preheatMinutes: 45,
    bakeCoveredMinutes: 22,
    bakeUncoveredMinutes: 23,
    coolingMinutes: 120,
    ovenTempFahrenheit: 465,
    steps: []
  },
  {
    id: 'same-day-boule',
    name: 'Same-Day Express Sourdough (1 Loaf)',
    description: 'Faster turnaround single loaf utilizing warm ambient fermentation without overnight refrigeration.',
    loavesCount: 1,
    flourGrams: 500,
    waterGrams: 340,
    starterGrams: 120,
    saltGrams: 10,
    hydration: 68,
    starterRatio: '1:2:2 (30g seed + 60g water + 60g flour)',
    starterFeedHours: 4.5,
    defaultRetardHours: 2, // 2h quick chill
    preheatMinutes: 45,
    bakeCoveredMinutes: 20,
    bakeUncoveredMinutes: 25,
    coolingMinutes: 90,
    ovenTempFahrenheit: 475,
    steps: []
  }
];

// Helper to fill in steps for preset variations if empty
export function getRecipeWithSteps(recipe: Recipe): Recipe {
  if (recipe.steps && recipe.steps.length > 0) {
    return recipe;
  }
  const baseSteps = DEFAULT_RECIPES[0].steps;
  const clonedSteps = baseSteps.map(s => {
    const step = { ...s };
    if (step.id === 'cold-retard') {
      step.durationMinutes = recipe.defaultRetardHours * 60;
    }
    if (step.id === 'mix-dough') {
      step.ingredientsUsed = [
        { name: 'Flour', amount: recipe.flourGrams, unit: 'g' },
        { name: 'Water', amount: recipe.waterGrams, unit: 'g' },
        { name: 'Peaked Starter', amount: recipe.starterGrams, unit: 'g' }
      ];
    }
    if (step.id === 'add-salt') {
      step.ingredientsUsed = [
        { name: 'Fine Sea Salt', amount: recipe.saltGrams, unit: 'g' }
      ];
    }
    return step;
  });
  return {
    ...recipe,
    steps: clonedSteps
  };
}
