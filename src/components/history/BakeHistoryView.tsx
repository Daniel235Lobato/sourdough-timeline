import React from 'react';
import { format } from 'date-fns';
import { Star, Award, Sparkles, Clock, Snowflake, Droplets, BookOpen } from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';

export const BakeHistoryView: React.FC = () => {
  const { bakeHistory } = useSourdough();

  return (
    <div className="pb-24 pt-1 px-3 sm:px-4 max-w-xl mx-auto space-y-5 animate-fade-in text-[#2E1E14]">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#2E1E14] tracking-tight leading-tight">
          Bake Journal & Archive
        </h2>
        <p className="text-xs text-[#2E1E14]/75 mt-0.5">
          Track previous bakes, fermentation timing, and crumb ratings to master your bake
        </p>
      </div>

      {bakeHistory.length === 0 ? (
        <div className="py-16 text-center bg-[#E7CEB5] rounded-3xl border border-[#D1C1A8] shadow-xs p-8 space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-[#FAF5EE] text-[#2E1E14] border border-[#D1C1A8] mx-auto flex items-center justify-center text-3xl shadow-xs">
            📖
          </div>
          <h3 className="font-serif text-lg font-bold text-[#2E1E14]">
            No Bakes Recorded Yet
          </h3>
          <p className="text-xs text-[#2E1E14]/75 max-w-xs mx-auto leading-relaxed">
            Complete your first sourdough bake and save your rating and crumb observations!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bakeHistory.map((bake) => (
            <div
              key={bake.id}
              className="bg-[#E7CEB5] rounded-3xl p-5 sm:p-6 border border-[#D1C1A8] shadow-xs space-y-3.5 transition-all text-[#2E1E14]"
            >
              {/* Top Row: Recipe Name & Star Rating */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#2E1E14]">
                    {bake.recipeName}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-[#2E1E14]/75 mt-0.5">
                    <span>{format(new Date(bake.completedAt), 'MMMM d, yyyy • h:mm a')}</span>
                  </div>
                </div>

                {/* Star Rating Badge */}
                <div className="flex items-center space-x-0.5 bg-[#FAF5EE] px-2.5 py-1 rounded-xl border border-[#D1C1A8] shadow-2xs">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= bake.rating
                          ? 'fill-[#2E1E14] text-[#2E1E14]'
                          : 'text-[#D1C1A8]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Bake Metrics Pill Grid */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-[#FAF5EE] rounded-2xl p-2.5 text-center border border-[#D1C1A8]">
                  <span className="text-[9px] uppercase font-bold text-[#2E1E14]/70 block tracking-wider">Hydration</span>
                  <span className="font-serif font-bold text-[#2E1E14] text-sm sm:text-base">{bake.hydration}%</span>
                </div>
                <div className="bg-[#FAF5EE] rounded-2xl p-2.5 text-center border border-[#D1C1A8]">
                  <span className="text-[9px] uppercase font-bold text-[#2E1E14]/70 block tracking-wider">Retard</span>
                  <span className="font-serif font-bold text-[#2E1E14] text-sm sm:text-base">{bake.actualRetardHours || 14}h Fridge</span>
                </div>
                <div className="bg-[#FAF5EE] rounded-2xl p-2.5 text-center border border-[#D1C1A8]">
                  <span className="text-[9px] uppercase font-bold text-[#2E1E14]/70 block tracking-wider">Yield</span>
                  <span className="font-serif font-bold text-[#2E1E14] text-sm sm:text-base">{bake.loavesCount} Loaves</span>
                </div>
              </div>

              {/* Notes */}
              {bake.notes && (
                <div className="p-3.5 bg-[#FAF5EE] rounded-2xl border border-[#D1C1A8] text-xs text-[#2E1E14] leading-relaxed italic">
                  "{bake.notes}"
                </div>
              )}

              {/* Extra Parameters */}
              {(bake.ambientTempF || bake.flourType) && (
                <div className="flex items-center justify-between text-[11px] text-[#2E1E14]/70 pt-2 border-t border-[#D1C1A8] font-semibold">
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
