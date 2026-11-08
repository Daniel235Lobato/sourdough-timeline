import React from 'react';
import { MapPin } from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';
import { Logo } from './Logo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { activeSession } = useSourdough();

  // Calculate session completion percentage
  let progressPercent = 0;
  let currentStepNum = 0;
  let totalSteps = 0;

  if (activeSession && activeSession.steps.length > 0) {
    totalSteps = activeSession.steps.length;
    currentStepNum = activeSession.currentStepIndex + 1;
    const completedCount = activeSession.steps.filter(s => s.status === 'completed').length;
    progressPercent = Math.round((completedCount / totalSteps) * 100);
    if (activeSession.isCompleted) progressPercent = 100;
  }

  return (
    <header className="sticky top-0 z-30 bg-[#FAF5EE]/95 backdrop-blur-md border-b border-[#D1C1A8] px-4 py-3 max-w-2xl mx-auto w-full transition-all">
      <div className="flex items-center justify-between">
        {/* Brand / Logo */}
        <button 
          onClick={() => setActiveTab(activeSession ? 'timeline' : 'home')}
          className="flex items-center space-x-2.5 text-left group active-press"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#E7CEB5] border border-[#AD9677]/60 flex items-center justify-center p-1 shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
            <Logo size={36} className="w-full h-full" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-serif font-extrabold text-[#2E1E14] text-[21px] tracking-tight leading-none">
              Levain
            </span>
            <p className="font-serif italic text-[11px] text-[#986A4C] tracking-wide mt-1 leading-none">
              Sourdough Baking Made Easy
            </p>
          </div>
        </button>

        {/* Live Ambient Status */}
        {activeSession && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active-press ${
                activeTab === 'timeline' 
                  ? 'bg-[#2E1E14] text-[#FAF5EE] shadow-xs' 
                  : 'bg-[#E7CEB5] text-[#2E1E14] hover:bg-[#D1C1A8]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Step {currentStepNum}/{totalSteps}</span>
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar when Bake is Active */}
      {activeSession && !activeSession.isCompleted && (
        <div className="mt-2.5 pt-2 border-t border-[#D1C1A8]">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#2E1E14] mb-1">
            <span className="truncate max-w-[200px] font-medium">
              {activeSession.recipeName}
            </span>
            <span className="font-mono text-[#986A4C] font-bold">
              {progressPercent}% complete
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#D1C1A8] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#986A4C] transition-all duration-500 rounded-full"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
};
