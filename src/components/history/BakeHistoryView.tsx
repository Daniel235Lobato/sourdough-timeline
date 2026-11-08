import React, { useState } from 'react';
import { format } from 'date-fns';
import { Star, Award, Sparkles, Clock, Snowflake, Droplets, BookOpen, Trash2 } from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';
import { BakeHistoryEntry } from '../../types/timeline';
import { Modal } from '../common/Modal';

export const BakeHistoryView: React.FC = () => {
  const { bakeHistory, deleteHistoryEntry, clearAllHistory } = useSourdough();
  const [entryToDelete, setEntryToDelete] = useState<BakeHistoryEntry | null>(null);
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);

  return (
    <div className="pb-24 pt-1 px-3 sm:px-4 max-w-xl mx-auto space-y-5 animate-fade-in text-[#2E1E14]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#2E1E14] tracking-tight leading-tight">
            Bake Journal & Archive
          </h2>
          <p className="text-xs text-[#2E1E14]/75 mt-0.5">
            Track previous bakes, fermentation timing, and crumb ratings to master your bake
          </p>
        </div>

        {bakeHistory.length > 0 && (
          <button
            type="button"
            onClick={() => setIsClearAllOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#FAF5EE] hover:bg-[#D1C1A8]/40 border border-[#D1C1A8] text-xs font-semibold text-[#2E1E14] transition-colors active-press shrink-0"
            title="Clear all bake entries"
          >
            <Trash2 className="w-3.5 h-3.5 text-[#986A4C]" />
            <span>Clear All</span>
          </button>
        )}
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
              {/* Top Row: Recipe Name, Star Rating & Delete Action */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#2E1E14] truncate">
                    {bake.recipeName}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-[#2E1E14]/75 mt-0.5">
                    <span>{format(new Date(bake.completedAt), 'MMMM d, yyyy • h:mm a')}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
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

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setEntryToDelete(bake)}
                    className="p-1.5 sm:p-2 rounded-xl text-[#2E1E14]/60 hover:text-[#986A4C] hover:bg-[#FAF5EE] transition-colors active-press"
                    title={`Delete ${bake.recipeName} entry`}
                    aria-label={`Delete ${bake.recipeName} entry`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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

      {/* Delete Single Entry Confirmation Modal */}
      <Modal
        isOpen={!!entryToDelete}
        onClose={() => setEntryToDelete(null)}
        maxWidthClass="max-w-sm"
      >
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#E7CEB5] border border-[#D1C1A8] mx-auto flex items-center justify-center shadow-xs">
            <Trash2 className="w-6 h-6 text-[#986A4C]" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2E1E14]">
              Delete Bake Entry?
            </h3>
            <p className="text-xs text-[#2E1E14]/75 mt-1 leading-relaxed">
              Are you sure you want to remove this <span className="font-semibold text-[#2E1E14]">{entryToDelete?.recipeName}</span> entry from your journal? This action cannot be undone.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEntryToDelete(null)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#FAF5EE] hover:bg-[#D1C1A8]/40 border border-[#D1C1A8] text-[#2E1E14] font-semibold text-xs transition-colors active-press"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (entryToDelete) {
                  deleteHistoryEntry(entryToDelete.id);
                  setEntryToDelete(null);
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] font-bold text-xs shadow-xs transition-colors active-press"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Clear All Confirmation Modal */}
      <Modal
        isOpen={isClearAllOpen}
        onClose={() => setIsClearAllOpen(false)}
        maxWidthClass="max-w-sm"
      >
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#E7CEB5] border border-[#D1C1A8] mx-auto flex items-center justify-center shadow-xs">
            <Trash2 className="w-6 h-6 text-[#986A4C]" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2E1E14]">
              Clear Entire Journal?
            </h3>
            <p className="text-xs text-[#2E1E14]/75 mt-1 leading-relaxed">
              Are you sure you want to delete all <span className="font-semibold text-[#2E1E14]">{bakeHistory.length}</span> recorded bakes from your journal? This action cannot be undone.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsClearAllOpen(false)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#FAF5EE] hover:bg-[#D1C1A8]/40 border border-[#D1C1A8] text-[#2E1E14] font-semibold text-xs transition-colors active-press"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                clearAllHistory();
                setIsClearAllOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] font-bold text-xs shadow-xs transition-colors active-press"
            >
              Clear All
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
