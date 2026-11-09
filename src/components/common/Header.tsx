import React, { useState } from 'react';
import { MapPin, Bell, BellRing, LogOut, X, User as UserIcon } from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';
import { useAuth } from '../../context/AuthContext';
import { Logo } from './Logo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenNotifications
}) => {
  const { activeSession, isPushSubscribed } = useSourdough();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
    <header className="sticky top-0 z-30 bg-[#FAF5EE]/90 backdrop-blur-xl border-b border-[#D1C1A8]/70 px-4 py-2.5 max-w-2xl mx-auto w-full transition-all">
      <div className="flex items-center justify-between">
        {/* Brand / Logo */}
        <button 
          onClick={() => setActiveTab(activeSession ? 'timeline' : 'home')}
          className="flex items-center space-x-2.5 text-left group active-press"
        >
          <div className="w-9 h-9 rounded-xl bg-[#E7CEB5] border border-[#D1C1A8] flex items-center justify-center p-1 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
            <Logo size={32} className="w-full h-full" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-serif font-extrabold text-xl sm:text-2xl text-[#2E1E14] tracking-tight leading-none">
              Levain
            </span>
          </div>
        </button>

        {/* Right Controls: Live Step Pill & Minimalist Notification Bell */}
        <div className="flex items-center space-x-2">
          {activeSession && (
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
          )}

          {onOpenNotifications && (
            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative w-9 h-9 rounded-full bg-[#E7CEB5]/70 hover:bg-[#E7CEB5] border border-[#D1C1A8] text-[#2E1E14] flex items-center justify-center transition-all active-press"
              title="Step Alerts & Notification Setup"
              aria-label="Step Alerts & Notification Setup"
            >
              {isPushSubscribed ? (
                <BellRing className="w-4 h-4 text-[#2E1E14]" />
              ) : (
                <>
                  <Bell className="w-4 h-4 text-[#2E1E14]" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#986A4C] ring-2 ring-[#FAF5EE]" />
                </>
              )}
            </button>
          )}

          {/* User Profile Avatar Trigger */}
          {user && (
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="relative w-9 h-9 rounded-full bg-[#E7CEB5] hover:bg-[#D1C1A8] border border-[#D1C1A8] text-[#2E1E14] flex items-center justify-center transition-all active-press overflow-hidden shadow-2xs"
              title={`Baker: ${user.name}`}
              aria-label="Baker Profile"
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold font-serif text-[#2E1E14]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar when Bake is Active */}
      {activeSession && !activeSession.isCompleted && (
        <div className="mt-2 pt-2 border-t border-[#D1C1A8]/70">
          <div className="flex items-center justify-between text-[11px] font-medium text-[#2E1E14] mb-1 gap-2">
            <span className="font-semibold text-[#2E1E14]">
              {activeSession.recipeName}
            </span>
            <span className="font-mono text-[#986A4C] font-bold shrink-0">
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
      {/* User Profile Modal */}
      {isProfileOpen && user && (
        <div className="fixed inset-0 z-50 bg-[#2E1E14]/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-xs bg-[#FAF5EE] border border-[#D1C1A8] rounded-3xl p-5 shadow-card space-y-4 text-[#2E1E14]">
            <div className="flex items-center justify-between border-b border-[#D1C1A8]/60 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#836A4D]">
                Baker Account
              </span>
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="w-7 h-7 rounded-full bg-[#E7CEB5]/70 hover:bg-[#E7CEB5] flex items-center justify-center text-[#2E1E14] active-press"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E7CEB5] border border-[#D1C1A8] flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-6 h-6 text-[#986A4C]" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-serif font-bold text-base text-[#2E1E14] truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-[#2E1E14]/70 truncate">
                  {user.email}
                </p>
                <span className="inline-block mt-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#E7CEB5] text-[#836A4D] border border-[#D1C1A8]">
                  {user.provider === 'google' ? 'Google Account' : 'Email Account'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
                className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-colors active-press"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
