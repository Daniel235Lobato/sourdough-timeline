import React from 'react';
import { Volume2, VolumeX, Bell, BellOff, MapPin } from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';
import { Logo } from './Logo';

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
    setNotificationsEnabled,
    isPushSubscribed,
    isPushSubscribing,
    subscribeToPushNotifications
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

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      setNotificationsEnabled(true);
      if (!isPushSubscribed) {
        await subscribeToPushNotifications();
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F5]/90 dark:bg-[#121110]/90 backdrop-blur-md border-b border-stone-200/60 dark:border-stone-800/60 px-4 py-3 max-w-2xl mx-auto w-full transition-all">
      <div className="flex items-center justify-between">
        {/* Brand / Logo */}
        <button 
          onClick={() => setActiveTab(activeSession ? 'timeline' : 'home')}
          className="flex items-center space-x-2.5 text-left group active-press"
        >
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 flex items-center justify-center p-1 shadow-card group-hover:scale-105 transition-transform overflow-hidden">
            <Logo size={36} className="w-full h-full" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-serif font-extrabold text-stone-900 dark:text-stone-100 text-[21px] tracking-tight leading-none">
              Levain
            </span>
            <p className="font-serif italic text-[11px] text-stone-500 dark:text-stone-400 tracking-wide mt-1 leading-none">
              Sourdough Baking Schedule
            </p>
          </div>
        </button>

        {/* Live Ambient Status or Controls */}
        <div className="flex items-center space-x-2">
          {activeSession && (
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active-press ${
                activeTab === 'timeline' 
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30' 
                  : 'bg-stone-200/60 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Step {currentStepNum}/{totalSteps}</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute chimes' : 'Enable audio chimes'}
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all active-press ${
              soundEnabled
                ? 'border-amber-400/80 dark:border-amber-600/80 text-amber-700 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 shadow-xs'
                : 'border-stone-200/80 dark:border-stone-800 text-stone-400 dark:text-stone-500 bg-white/60 dark:bg-stone-900/60'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Web Push / Notification Toggle */}
          <button
            onClick={handleNotificationToggle}
            disabled={isPushSubscribing}
            title={
              notificationsEnabled
                ? isPushSubscribed
                  ? 'Background Web Push alerts active (screen locked & closed browser supported)'
                  : 'Step notifications enabled'
                : 'Enable background Web Push alerts'
            }
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all active-press ${
              notificationsEnabled
                ? isPushSubscribed
                  ? 'border-emerald-400 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-xs'
                  : 'border-stone-300 dark:border-stone-700 text-emerald-600 dark:text-emerald-400 bg-white/80 dark:bg-stone-900/80'
                : 'border-stone-200/80 dark:border-stone-800 text-stone-400 dark:text-stone-500 bg-white/60 dark:bg-stone-900/60'
            } ${isPushSubscribing ? 'animate-pulse opacity-70' : ''}`}
          >
            {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar when Bake is Active */}
      {activeSession && !activeSession.isCompleted && (
        <div className="mt-2.5 pt-2 border-t border-stone-200/40 dark:border-stone-800/40">
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 dark:text-stone-400 mb-1">
            <span className="truncate max-w-[200px] font-medium">
              {activeSession.recipeName}
            </span>
            <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
              {progressPercent}% complete
            </span>
          </div>
          <div className="w-full h-1.5 bg-stone-200/80 dark:bg-stone-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 transition-all duration-500 rounded-full shadow-glow-amber"
              style={{ width: `${Math.max(4, progressPercent)}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
};
