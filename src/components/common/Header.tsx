import React from 'react';
import { Volume2, VolumeX, Bell, BellOff, MapPin } from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { 
    activeSession, 
    soundEnabled, 
    setSoundEnabled, 
    notificationsEnabled, 
    setNotificationsEnabled 
  } = useSourdough();

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
    <header className="sticky top-0 z-30 bg-flour-50/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 px-4 py-3 max-w-2xl mx-auto w-full transition-all">
      <div className="flex items-center justify-between">
        {/* Brand / Logo */}
        <button 
          onClick={() => setActiveTab(activeSession ? 'timeline' : 'home')}
          className="flex items-center space-x-2 text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-crust-700 flex items-center justify-center text-white text-base shadow-sm group-hover:scale-105 transition-transform">
            🍞
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-lg tracking-tight">
                Levain Maps
              </span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                GPS
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              Sourdough Navigation
            </p>
          </div>
        </button>

        {/* Live Ambient Status or Controls */}
        <div className="flex items-center space-x-2">
          {activeSession && (
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                activeTab === 'timeline' 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Step {currentStepNum}/{totalSteps}</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute chimes' : 'Enable audio chimes'}
            className={`p-2 rounded-xl border transition-colors ${
              soundEnabled
                ? 'border-stone-300 dark:border-stone-700 text-amber-600 dark:text-amber-400 bg-white/60 dark:bg-stone-900/60'
                : 'border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notification Toggle */}
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            title={notificationsEnabled ? 'Mute notifications' : 'Enable step alerts'}
            className={`p-2 rounded-xl border transition-colors ${
              notificationsEnabled
                ? 'border-stone-300 dark:border-stone-700 text-emerald-600 dark:text-emerald-400 bg-white/60 dark:bg-stone-900/60'
                : 'border-stone-200 dark:border-stone-800 text-stone-400 dark:text-stone-500'
            }`}
          >
            {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar when Bake is Active */}
      {activeSession && !activeSession.isCompleted && (
        <div className="mt-2.5 pt-2 border-t border-stone-200/50 dark:border-stone-800/50">
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 dark:text-stone-400 mb-1">
            <span className="truncate max-w-[200px]">
              {activeSession.recipeName}
            </span>
            <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
              {progressPercent}% complete
            </span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-crust-500 to-amber-600 transition-all duration-500 rounded-full"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
};
