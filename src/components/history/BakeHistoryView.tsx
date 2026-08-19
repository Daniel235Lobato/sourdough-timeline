import React from 'react';
import { format } from 'date-fns';
import { Star, Award, Sparkles, Clock, Snowflake, Droplets, BookOpen } from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';

export const BakeHistoryView: React.FC = () => {
  const { bakeHistory } = useSourdough();

  return (
    <div className="pb-28 pt-2 px-4 max-w-xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
          Bake Journal & Archive
        </h2>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Track previous bakes, fermentation timing, and crumb ratings to master your bake
        </p>
      </div>

      {bakeHistory.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
          <div className="text-4xl">📖</div>
          <h3 className="font-serif text-lg font-bold text-stone-800 dark:text-stone-200">
            No Bakes Recorded Yet
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Complete your first sourdough bake and save your rating and crumb observations!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bakeHistory.map((bake) => (
            <div
              key={bake.id}
              className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3"
            >
              {/* Top Row: Recipe Name & Star Rating */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                    {bake.recipeName}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    <span>{format(new Date(bake.completedAt), 'MMMM d, yyyy • h:mm a')}</span>
                  </div>
                </div>

                {/* Star Rating Badge */}
                <div className="flex items-center space-x-0.5 bg-amber-50 dark:bg-amber-950/60 px-2 py-1 rounded-xl border border-amber-200 dark:border-amber-800/80">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= bake.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300 dark:text-stone-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Bake Metrics Pill Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-flour-100 dark:bg-stone-800/60 rounded-xl p-2 text-center">
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">Hydration</span>
                  <span className="font-serif font-bold text-stone-800 dark:text-stone-200">{bake.hydration}%</span>
                </div>
                <div className="bg-flour-100 dark:bg-stone-800/60 rounded-xl p-2 text-center">
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">Retard</span>
                  <span className="font-serif font-bold text-stone-800 dark:text-stone-200">{bake.actualRetardHours || 14}h Fridge</span>
                </div>
                <div className="bg-flour-100 dark:bg-stone-800/60 rounded-xl p-2 text-center">
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">Yield</span>
                  <span className="font-serif font-bold text-stone-800 dark:text-stone-200">{bake.loavesCount} Loaves</span>
                </div>
              </div>

              {/* Notes */}
              {bake.notes && (
                <div className="p-3 bg-stone-50 dark:bg-stone-800/80 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 text-xs text-stone-700 dark:text-stone-300 leading-relaxed italic">
                  "{bake.notes}"
                </div>
              )}

              {/* Extra Parameters */}
              {(bake.ambientTempF || bake.flourType) && (
                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-100 dark:border-stone-800">
                  {bake.ambientTempF && <span>Room Temp: {bake.ambientTempF}°F</span>}
                  {bake.flourType && <span>Flour: {bake.flourType}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
