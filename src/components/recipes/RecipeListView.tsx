import React, { useState } from 'react';
import { Plus, Check, Edit2, Trash2, Droplets, Clock, Flame, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';
import { Recipe } from '../../types/timeline';
import { RecipeBuilderModal } from './RecipeBuilderModal';

interface RecipeListViewProps {
  onSelectAndBake: () => void;
}

export const RecipeListView: React.FC<RecipeListViewProps> = ({ onSelectAndBake }) => {
  const { 
    recipes, 
    selectedRecipe, 
    setSelectedRecipe, 
    deleteRecipe, 
    scaleRecipeLoaves 
  } = useSourdough();

  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const handleCreateNew = () => {
    setEditingRecipe(null);
    setIsBuilderOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingRecipe(recipe);
    setIsBuilderOpen(true);
  };

  const handleDeleteRecipe = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this custom recipe?')) {
      deleteRecipe(id);
    }
  };

  return (
    <div className="pb-24 pt-1 px-3 sm:px-4 max-w-xl mx-auto space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
            Sourdough Recipes
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Select a recipe or build your own custom formula
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold shadow-md shadow-amber-600/25 transition-all active-press"
        >
          <Plus className="w-4 h-4" />
          <span>New Recipe</span>
        </button>
      </div>

      {/* Recipe Cards List */}
      <div className="space-y-4">
        {recipes.map((recipe) => {
          const isSelected = selectedRecipe.id === recipe.id;

          return (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className={`rounded-3xl p-5 sm:p-6 border transition-all duration-200 cursor-pointer relative overflow-hidden active-press ${
                isSelected
                  ? 'bg-white dark:bg-[#181614] border-amber-500/90 dark:border-amber-500 shadow-card-hover ring-1 ring-amber-500/20'
                  : 'bg-white dark:bg-[#181614] border-stone-200/80 dark:border-stone-800/80 hover:border-stone-300 dark:hover:border-stone-700 shadow-card'
              }`}
            >
              {/* Top Row: Name & Selected indicator */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 pr-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                      {recipe.name}
                    </h3>
                    {recipe.isCustom && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                        Custom
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0">
                  {recipe.isCustom && (
                    <>
                      <button
                        onClick={(e) => handleEditRecipe(recipe, e)}
                        className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                        title="Edit recipe"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteRecipe(recipe.id, e)}
                        className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete recipe"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {isSelected && (
                    <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Formula Metric Badges */}
              <div className="grid grid-cols-4 gap-2 my-3.5">
                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-2.5 text-center border border-stone-100 dark:border-stone-800/60">
                  <span className="text-[9px] uppercase font-bold text-stone-400 block tracking-wider">Flour</span>
                  <span className="font-serif text-sm sm:text-base font-bold text-stone-800 dark:text-stone-200">{recipe.flourGrams}g</span>
                </div>
                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-2.5 text-center border border-stone-100 dark:border-stone-800/60">
                  <span className="text-[9px] uppercase font-bold text-stone-400 block tracking-wider">Water</span>
                  <span className="font-serif text-sm sm:text-base font-bold text-stone-800 dark:text-stone-200">{recipe.waterGrams}g</span>
                </div>
                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-2.5 text-center border border-stone-100 dark:border-stone-800/60">
                  <span className="text-[9px] uppercase font-bold text-stone-400 block tracking-wider">Starter</span>
                  <span className="font-serif text-sm sm:text-base font-bold text-stone-800 dark:text-stone-200">{recipe.starterGrams}g</span>
                </div>
                <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-2.5 text-center border border-stone-100 dark:border-stone-800/60">
                  <span className="text-[9px] uppercase font-bold text-amber-700 dark:text-amber-400 block tracking-wider">Hydration</span>
                  <span className="font-serif text-sm sm:text-base font-bold text-amber-800 dark:text-amber-300">{recipe.hydration}%</span>
                </div>
              </div>

              {/* Batch Size Scaling Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="text-stone-500 dark:text-stone-400 font-semibold">Batch:</span>
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={(e) => {
                        e.stopPropagation();
                        scaleRecipeLoaves(recipe.id, num);
                      }}
                      className={`w-7 h-7 rounded-xl text-xs font-bold transition-all active-press ${
                        recipe.loavesCount === num
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <span className="text-stone-400 text-[11px] ml-1">loaves</span>
                </div>

                {isSelected ? (
                  <button
                    onClick={onSelectAndBake}
                    className="flex items-center space-x-1 font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800"
                  >
                    <span>Use & Schedule</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedRecipe(recipe)}
                    className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 font-bold"
                  >
                    Select
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Builder Modal */}
      <RecipeBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        editingRecipe={editingRecipe}
      />
    </div>
  );
};
