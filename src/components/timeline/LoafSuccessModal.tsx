import React, { useState } from 'react';
import { format } from 'date-fns';
import { Star, Sparkles, Trophy, Heart, Bookmark, RotateCcw, Check } from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';
import { CompletedLoafAnimation } from '../animations/CompletedLoafAnimation';
import { Modal } from '../common/Modal';

interface LoafSuccessModalProps {
  isOpen: boolean;
  onBakeAnother: () => void;
}

export const LoafSuccessModal: React.FC<LoafSuccessModalProps> = ({ isOpen, onBakeAnother }) => {
  const { activeSession, finishAndSaveBake, resetSession } = useSourdough();
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState<string>('Golden ear with gorgeous open crumb and crispy blistered crust!');
  const [ambientTemp, setAmbientTemp] = useState<number>(75);
  const [flourType, setFlourType] = useState<string>('Unbleached Bread Flour');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen || !activeSession) return null;

  const bakeStep = activeSession.steps.find(s => s.isBakeStep);
  const coolStep = activeSession.steps.find(s => s.isCoolingStep);

  const handleSave = () => {
    finishAndSaveBake(rating, notes, ambientTemp, flourType);
    setIsSaved(true);
  };

  const handleRestart = () => {
    resetSession();
    onBakeAnother();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      maxWidthClass="max-w-md"
      backdropClass="bg-stone-950/80 backdrop-blur-md"
      cardClass="max-h-[95vh]"
    >
      {/* Animated Celebration */}
        <CompletedLoafAnimation />

        {/* Loaf Specs Grid */}
        <div className="bg-flour-100 dark:bg-stone-800/70 rounded-2xl p-4 my-4 border border-stone-200/80 dark:border-stone-700/80">
          <div className="grid grid-cols-3 gap-2 text-center pb-3 border-b border-stone-200 dark:border-stone-700">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Yield</span>
              <p className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100">
                {activeSession.loavesCount} Loaves
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Hydration</span>
              <p className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100">
                {activeSession.hydration}%
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Retard</span>
              <p className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100">
                {activeSession.coldRetardHours}h
              </p>
            </div>
          </div>

          <div className="pt-3 space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
            <div className="flex justify-between">
              <span>Started:</span>
              <span className="font-mono font-medium">{format(activeSession.startedAt, 'EEE, h:mm a')}</span>
            </div>
            {bakeStep && (
              <div className="flex justify-between">
                <span>Baked:</span>
                <span className="font-mono font-medium">{format(bakeStep.startTime, 'EEE, h:mm a')}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-amber-700 dark:text-amber-400">
              <span>Loaf Ready:</span>
              <span className="font-mono">{format(new Date(), 'EEE, h:mm a')}</span>
            </div>
          </div>
        </div>

        {/* Rating & Notes */}
        {!isSaved ? (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5 text-center">
                How did your bake turn out?
              </label>
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                          : 'text-stone-300 dark:text-stone-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Bake Notes & Observations:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Crumb texture, oven spring, taste, adjustments for next time..."
                rows={2}
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-3 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase">Room Temp (°F)</label>
                <input
                  type="number"
                  value={ambientTemp}
                  onChange={(e) => setAmbientTemp(Number(e.target.value))}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-800 dark:text-stone-200"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-stone-400 uppercase">Flour Used</label>
                <input
                  type="text"
                  value={flourType}
                  onChange={(e) => setFlourType(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-800 dark:text-stone-200"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-md transition-all"
            >
              <Bookmark className="w-4 h-4" />
              <span>SAVE TO BAKE HISTORY</span>
            </button>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-1 mb-4">
            <div className="flex items-center justify-center space-x-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
              <Check className="w-4 h-4" />
              <span>Saved to your Bake Archive!</span>
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
              Your timing, crumb ratings, and notes are preserved.
            </p>
          </div>
        )}

        {/* Start Another Bake */}
        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
          <button
            onClick={handleRestart}
            className="w-full py-3 bg-stone-900 dark:bg-stone-800 hover:bg-black text-white rounded-2xl font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>PLAN ANOTHER BAKE</span>
          </button>
        </div>
    </Modal>
  );
};
