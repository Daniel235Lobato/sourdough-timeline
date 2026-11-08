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
    <div className="pb-24 pt-1 px-3 sm:px-4 max-w-xl mx-auto space-y-5 animate-fade-in text-[#2E1E14]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#2E1E14] tracking-tight leading-tight">
            Sourdough Recipes
          </h1>
          <p className="text-sm sm:text-base text-[#2E1E14]/80 mt-1 leading-normal">
            Select a recipe or build your own custom formula
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] text-xs font-bold shadow-xs transition-all active-press"
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
                  ? 'bg-[#E7CEB5] border-2 border-[#2E1E14] shadow-md ring-1 ring-[#2E1E14]/20'
                  : 'bg-[#E7CEB5]/70 border border-[#D1C1A8] hover:border-[#AD9677] shadow-sm'
              }`}
            >
              {/* Top Row: Name & Selected indicator */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 pr-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif text-lg sm:text-xl font-extrabold text-[#2E1E14]">
                      {recipe.name}
                    </h3>
                    {recipe.isCustom && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#FAF5EE] text-[#2E1E14] border border-[#D1C1A8]">
                        Custom
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#2E1E14]/85 mt-1 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0">
                  {recipe.isCustom && (
                    <>
                      <button
                        onClick={(e) => handleEditRecipe(recipe, e)}
                        className="p-2 rounded-xl text-[#2E1E14]/70 hover:text-[#2E1E14] hover:bg-[#FAF5EE] transition-colors"
                        title="Edit recipe"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteRecipe(recipe.id, e)}
                        className="p-2 rounded-xl text-[#986A4C] hover:bg-[#FAF5EE] transition-colors"
                        title="Delete recipe"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {isSelected && (
                    <div className="w-7 h-7 rounded-full bg-[#2E1E14] text-[#FAF5EE] flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Formula Metric Badges */}
              <div className="grid grid-cols-5 gap-1 sm:gap-2 my-3.5">
                <div className="bg-[#FAF5EE] rounded-xl sm:rounded-2xl px-1 py-2 sm:px-2 sm:py-2.5 text-center border border-[#D1C1A8] min-w-0 overflow-hidden">
                  <span className="text-[8.5px] sm:text-[10px] font-bold text-[#AD9677] tracking-tight sm:tracking-normal block truncate">Flour</span>
                  <span className="font-serif text-xs sm:text-base font-extrabold text-[#2E1E14] block truncate">{recipe.flourGrams}g</span>
                </div>
                <div className="bg-[#FAF5EE] rounded-xl sm:rounded-2xl px-1 py-2 sm:px-2 sm:py-2.5 text-center border border-[#D1C1A8] min-w-0 overflow-hidden">
                  <span className="text-[8.5px] sm:text-[10px] font-bold text-[#AD9677] tracking-tight sm:tracking-normal block truncate">Water</span>
                  <span className="font-serif text-xs sm:text-base font-extrabold text-[#2E1E14] block truncate">{recipe.waterGrams}g</span>
                </div>
                <div className="bg-[#FAF5EE] rounded-xl sm:rounded-2xl px-1 py-2 sm:px-2 sm:py-2.5 text-center border border-[#D1C1A8] min-w-0 overflow-hidden">
                  <span className="text-[8.5px] sm:text-[10px] font-bold text-[#AD9677] tracking-tight sm:tracking-normal block truncate">Starter</span>
                  <span className="font-serif text-xs sm:text-base font-extrabold text-[#2E1E14] block truncate">{recipe.starterGrams}g</span>
                </div>
                <div className="bg-[#FAF5EE] rounded-xl sm:rounded-2xl px-1 py-2 sm:px-2 sm:py-2.5 text-center border border-[#D1C1A8] min-w-0 overflow-hidden">
                  <span className="text-[8.5px] sm:text-[10px] font-bold text-[#AD9677] tracking-tight sm:tracking-normal block truncate">Salt</span>
                  <span className="font-serif text-xs sm:text-base font-extrabold text-[#2E1E14] block truncate">{recipe.saltGrams ?? Math.round(recipe.flourGrams * 0.02)}g</span>
                </div>
                <div className="bg-[#FAF5EE] rounded-xl sm:rounded-2xl px-1 py-2 sm:px-2 sm:py-2.5 text-center border border-[#D1C1A8] min-w-0 overflow-hidden">
                  <span className="text-[8.5px] sm:text-[10px] font-bold text-[#986A4C] tracking-tight sm:tracking-normal block truncate">Hydration</span>
                  <span className="font-serif text-xs sm:text-base font-extrabold text-[#986A4C] block truncate">{recipe.hydration}%</span>
                </div>
              </div>

              {/* Batch Size Scaling Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-[#D1C1A8] text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[#2E1E14] font-bold">Batch:</span>
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={(e) => {
                        e.stopPropagation();
                        scaleRecipeLoaves(recipe.id, num);
                      }}
                      className={`w-7 h-7 rounded-xl text-xs font-bold transition-all active-press ${
                        recipe.loavesCount === num
                          ? 'bg-[#2E1E14] text-[#FAF5EE] shadow-xs'
                          : 'bg-[#FAF5EE] text-[#2E1E14] border border-[#D1C1A8] hover:bg-[#D1C1A8]/40'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <span className="text-[#AD9677] text-[11px] ml-1 font-bold">loaves</span>
                </div>

                {isSelected ? (
                  <button
                    onClick={onSelectAndBake}
                    className="flex items-center space-x-1 font-bold text-[#986A4C] hover:text-[#2E1E14]"
                  >
                    <span>Use &amp; Schedule</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedRecipe(recipe)}
                    className="text-[#2E1E14]/80 hover:text-[#2E1E14] font-bold"
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
