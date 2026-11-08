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
      backdropClass="bg-[#2E1E14]/60 backdrop-blur-sm"
      cardClass="max-h-[95vh] bg-[#FAF5EE] border border-[#D1C1A8] text-[#2E1E14]"
    >
      {/* Animated Celebration */}
        <CompletedLoafAnimation />

        {/* Loaf Specs Grid */}
        <div className="bg-[#E7CEB5] rounded-2xl p-4 my-4 border border-[#D1C1A8]">
          <div className="grid grid-cols-3 gap-2 text-center pb-3 border-b border-[#D1C1A8]">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#2E1E14]/70">Yield</span>
              <p className="font-serif text-sm font-bold text-[#2E1E14]">
                {activeSession.loavesCount} Loaves
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#2E1E14]/70">Hydration</span>
              <p className="font-serif text-sm font-bold text-[#2E1E14]">
                {activeSession.hydration}%
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#2E1E14]/70">Retard</span>
              <p className="font-serif text-sm font-bold text-[#2E1E14]">
                {activeSession.coldRetardHours}h
              </p>
            </div>
          </div>

          <div className="pt-3 space-y-1.5 text-xs text-[#2E1E14]">
            <div className="flex justify-between">
              <span className="text-[#2E1E14]/75">Started:</span>
              <span className="font-mono font-bold">{format(activeSession.startedAt, 'EEE, h:mm a')}</span>
            </div>
            {bakeStep && (
              <div className="flex justify-between">
                <span className="text-[#2E1E14]/75">Baked:</span>
                <span className="font-mono font-bold">{format(bakeStep.startTime, 'EEE, h:mm a')}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-[#986A4C]">
              <span>Loaf Ready:</span>
              <span className="font-mono">{format(new Date(), 'EEE, h:mm a')}</span>
            </div>
          </div>
        </div>

        {/* Rating & Notes */}
        {!isSaved ? (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#2E1E14] mb-1.5 text-center">
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
                          ? 'fill-[#2E1E14] text-[#2E1E14] drop-shadow-xs'
                          : 'text-[#D1C1A8]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#2E1E14]/70 uppercase tracking-wider mb-1">
                Bake Notes & Observations:
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Crumb texture, oven spring, taste, adjustments for next time..."
                rows={2}
                className="w-full bg-[#E7CEB5] border border-[#D1C1A8] rounded-xl p-3 text-xs text-[#2E1E14] placeholder:text-[#2E1E14]/50 focus:outline-none focus:ring-2 focus:ring-[#2E1E14] resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-[#2E1E14]/70 uppercase tracking-wider mb-1">Room Temp (°F)</label>
                <input
                  type="number"
                  value={ambientTemp}
                  onChange={(e) => setAmbientTemp(Number(e.target.value))}
                  className="w-full bg-[#E7CEB5] border border-[#D1C1A8] rounded-xl p-2.5 text-xs font-semibold text-[#2E1E14] focus:outline-none focus:ring-2 focus:ring-[#2E1E14]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#2E1E14]/70 uppercase tracking-wider mb-1">Flour Used</label>
                <input
                  type="text"
                  value={flourType}
                  onChange={(e) => setFlourType(e.target.value)}
                  className="w-full bg-[#E7CEB5] border border-[#D1C1A8] rounded-xl p-2.5 text-xs font-semibold text-[#2E1E14] focus:outline-none focus:ring-2 focus:ring-[#2E1E14]"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full py-4 px-4 bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all active-press"
            >
              <Bookmark className="w-4 h-4" />
              <span className="tracking-wide">SAVE TO BAKE HISTORY</span>
            </button>
          </div>
        ) : (
          <div className="p-4 bg-[#E7CEB5] rounded-2xl border border-[#D1C1A8] text-center space-y-1 mb-4 text-[#2E1E14]">
            <div className="flex items-center justify-center space-x-1.5 text-[#2E1E14] font-bold text-xs">
              <Check className="w-4 h-4 text-[#986A4C]" />
              <span>Saved to your Bake Archive!</span>
            </div>
            <p className="text-[11px] text-[#2E1E14]/75">
              Your timing, crumb ratings, and notes are preserved.
            </p>
          </div>
        )}

        {/* Start Another Bake */}
        <div className="mt-4 pt-4 border-t border-[#D1C1A8]">
          <button
            onClick={handleRestart}
            className="w-full py-3.5 bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all active-press shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="tracking-wide">PLAN ANOTHER BAKE</span>
          </button>
        </div>
    </Modal>
  );
};
