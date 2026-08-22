import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Sparkles, Layers, Clock } from 'lucide-react';
import { Recipe, RecipeStep, StepPhase } from '../../types/timeline';
import { useSourdough } from '../../context/SourdoughContext';
import { Modal } from '../common/Modal';
import { StepInstructionIcon } from '../icons/StepIcons';

interface RecipeBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingRecipe?: Recipe | null;
}

export const RecipeBuilderModal: React.FC<RecipeBuilderModalProps> = ({
  isOpen,
  onClose,
  editingRecipe
}) => {
  const { saveRecipe } = useSourdough();

  const [name, setName] = useState<string>(editingRecipe?.name || 'Custom Sourdough Loaf');
  const [description, setDescription] = useState<string>(editingRecipe?.description || 'My personalized artisan sourdough schedule.');
  const [loavesCount, setLoavesCount] = useState<number>(editingRecipe?.loavesCount || 1);
  const [flourGrams, setFlourGrams] = useState<number>(editingRecipe?.flourGrams || 500);
  const [waterGrams, setWaterGrams] = useState<number>(editingRecipe?.waterGrams || 325);
  const [starterGrams, setStarterGrams] = useState<number>(editingRecipe?.starterGrams || 100);
  const [saltGrams, setSaltGrams] = useState<number>(editingRecipe?.saltGrams || 10);
  const [defaultRetardHours, setDefaultRetardHours] = useState<number>(editingRecipe?.defaultRetardHours || 14);

  // Dynamic steps list
  const [steps, setSteps] = useState<RecipeStep[]>(() => {
    if (editingRecipe?.steps && editingRecipe.steps.length > 0) {
      return editingRecipe.steps;
    }
    return [
      {
        id: `step-${Date.now()}-1`,
        name: 'Feed Starter',
        shortName: 'Feed Starter',
        phase: 'starter',
        icon: 'Feed',
        durationMinutes: 360,
        description: 'Levain feeding to reach double/peak volume.',
        isBiologicalEstimate: true,
        canOverrideCompletion: true
      },
      {
        id: `step-${Date.now()}-2`,
        name: 'Mix Dough & Autolyse',
        shortName: 'Mix Dough',
        phase: 'mix',
        icon: 'Mix',
        durationMinutes: 30,
        description: 'Incorporate flour, water, and active starter.'
      },
      {
        id: `step-${Date.now()}-3`,
        name: 'Add Salt',
        shortName: 'Add Salt',
        phase: 'mix',
        icon: 'Salt',
        durationMinutes: 30,
        description: 'Incorporate sea salt.'
      },
      {
        id: `step-${Date.now()}-4`,
        name: 'Stretch & Fold Sets',
        shortName: 'Stretch & Folds',
        phase: 'ferment',
        icon: 'Stretch',
        durationMinutes: 120,
        description: 'Gluten structure development folds.'
      },
      {
        id: `step-${Date.now()}-5`,
        name: 'Bulk Fermentation',
        shortName: 'Bulk Ferment',
        phase: 'ferment',
        icon: 'Ferment',
        durationMinutes: 150,
        description: 'Watch for 50-75% rise.',
        isBiologicalEstimate: true,
        canOverrideCompletion: true
      },
      {
        id: `step-${Date.now()}-6`,
        name: 'Divide & Shape',
        shortName: 'Shape',
        phase: 'shape',
        icon: 'Shape',
        durationMinutes: 30,
        description: 'Pre-shape and final shape into bannetons.'
      },
      {
        id: `step-${Date.now()}-7`,
        name: 'Cold Retardation',
        shortName: 'Cold Retard',
        phase: 'retard',
        icon: 'Proof',
        durationMinutes: 840,
        isColdRetard: true,
        minDurationMinutes: 720,
        maxDurationMinutes: 2880,
        description: 'Refrigerate bannetons.'
      },
      {
        id: `step-${Date.now()}-8`,
        name: 'Preheat & Bake',
        shortName: 'Bake',
        phase: 'bake',
        icon: 'Bake',
        durationMinutes: 45,
        isBakeStep: true,
        description: 'Bake covered with steam then uncovered for crust.'
      },
      {
        id: `step-${Date.now()}-9`,
        name: 'Cool Completely',
        shortName: 'Cooling',
        phase: 'cool',
        icon: 'Cool',
        durationMinutes: 120,
        isCoolingStep: true,
        description: 'Rest on wire rack.'
      },
      {
        id: `step-${Date.now()}-10`,
        name: 'Fresh Loaf Ready',
        shortName: 'Ready',
        phase: 'complete',
        icon: 'Slice',
        durationMinutes: 0,
        isFinalMilestone: true,
        description: 'Slice and enjoy!'
      }
    ];
  });

  if (!isOpen) return null;

  const hydration = Math.round((waterGrams / (flourGrams || 1)) * 100);

  const handleAddCustomStep = () => {
    const newStep: RecipeStep = {
      id: `custom-step-${Date.now()}`,
      name: 'Custom Action',
      shortName: 'Action',
      phase: 'ferment',
      icon: 'Layers',
      durationMinutes: 30,
      description: 'Step instruction details.'
    };
    // Insert before cooling/complete
    const lastIndex = steps.length - 2 >= 0 ? steps.length - 2 : steps.length;
    const updated = [...steps];
    updated.splice(lastIndex, 0, newStep);
    setSteps(updated);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 2) return;
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleStepChange = (index: number, field: keyof RecipeStep, value: unknown) => {
    setSteps(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  const handleSaveRecipe = () => {
    const newRecipe: Recipe = {
      id: editingRecipe?.id || `custom-rec-${Date.now()}`,
      name,
      description,
      loavesCount,
      flourGrams,
      waterGrams,
      starterGrams,
      saltGrams,
      hydration,
      starterRatio: '1:3:3',
      starterFeedHours: 6,
      defaultRetardHours,
      preheatMinutes: 45,
      bakeCoveredMinutes: 20,
      bakeUncoveredMinutes: 25,
      coolingMinutes: 120,
      steps,
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    saveRecipe(newRecipe);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-lg">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/60 flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              {editingRecipe ? 'Edit Recipe' : 'Create Custom Recipe'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Customize fermentation timing and ingredients
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Basic Info */}
      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
            Recipe Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Baker's Formulas Grid */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Ingredients & Baker's Ratios
            </label>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
              {hydration}% Hydration
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="text-[10px] text-stone-400 font-bold uppercase block mb-1">Flour (g)</label>
              <input
                type="number"
                value={flourGrams}
                onChange={(e) => setFlourGrams(Number(e.target.value))}
                className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl p-2 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-stone-400 font-bold uppercase block mb-1">Water (g)</label>
              <input
                type="number"
                value={waterGrams}
                onChange={(e) => setWaterGrams(Number(e.target.value))}
                className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl p-2 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-stone-400 font-bold uppercase block mb-1">Starter (g)</label>
              <input
                type="number"
                value={starterGrams}
                onChange={(e) => setStarterGrams(Number(e.target.value))}
                className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl p-2 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-stone-400 font-bold uppercase block mb-1">Salt (g)</label>
              <input
                type="number"
                value={saltGrams}
                onChange={(e) => setSaltGrams(Number(e.target.value))}
                className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl p-2 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Timeline Step Builder */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Timeline Steps ({steps.length})
            </label>
            <button
              type="button"
              onClick={handleAddCustomStep}
              className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center space-x-1 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Step</span>
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {steps.map((step, idx) => (
              <div 
                key={step.id || idx}
                className="p-3 bg-stone-50 dark:bg-stone-800/70 rounded-2xl border border-stone-200/80 dark:border-stone-700 flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-center flex-shrink-0 text-stone-700 dark:text-stone-300">
                  <StepInstructionIcon stepId={step.id} stepName={step.name} phase={step.phase} size={18} />
                </div>

                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={step.name}
                    onChange={(e) => handleStepChange(idx, 'name', e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-2 py-1 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-xs">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <input
                        type="number"
                        value={step.durationMinutes}
                        onChange={(e) => handleStepChange(idx, 'durationMinutes', Number(e.target.value))}
                        className="w-16 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-1.5 py-0.5 text-xs text-stone-800 dark:text-stone-200 font-mono font-bold"
                      />
                      <span className="text-[10px] text-stone-400">mins</span>
                    </div>

                    <select
                      value={step.phase}
                      onChange={(e) => handleStepChange(idx, 'phase', e.target.value as StepPhase)}
                      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg px-1.5 py-0.5 text-[10px] font-bold text-stone-700 dark:text-stone-300"
                    >
                      <option value="starter">STARTER</option>
                      <option value="mix">MIX</option>
                      <option value="ferment">FERMENT</option>
                      <option value="shape">SHAPE</option>
                      <option value="retard">RETARD</option>
                      <option value="bake">BAKE</option>
                      <option value="cool">COOL</option>
                      <option value="complete">COMPLETE</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveStep(idx)}
                  className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button (52px Touch Target) */}
      <div className="mt-5">
        <button
          onClick={handleSaveRecipe}
          className="w-full py-4 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-2xl font-bold shadow-md shadow-amber-600/30 flex items-center justify-center space-x-2 transition-all active-press"
        >
          <Save className="w-4 h-4" />
          <span className="tracking-wide">SAVE RECIPE & SCHEDULE</span>
        </button>
      </div>
    </Modal>
  );
};
