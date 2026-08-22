import React from 'react';
import { Compass, BookOpen, History, Calculator } from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { activeSession } = useSourdough();

  const navItems = [
    {
      id: activeSession ? 'timeline' : 'home',
      label: activeSession ? 'Timeline' : 'Plan Bake',
      icon: Compass,
      badge: activeSession ? `${activeSession.currentStepIndex + 1}/${activeSession.steps.length}` : null
    },
    {
      id: 'recipes',
      label: 'Recipes',
      icon: BookOpen
    },
    {
      id: 'history',
      label: 'History',
      icon: History
    },
    {
      id: 'calculator',
      label: 'Hydration',
      icon: Calculator
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 sm:px-4 pb-safe pointer-events-none">
      <nav className="max-w-md mx-auto mb-2 sm:mb-3 bg-white/90 dark:bg-[#181614]/90 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800/80 rounded-3xl shadow-dock pointer-events-auto p-1.5 transition-all">
        <div className="flex items-center justify-around">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'home' && activeTab === 'timeline' && !activeSession);

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 min-h-[48px] flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all relative active-press ${
                  isActive 
                    ? 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold' 
                    : 'text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100/50 dark:hover:bg-stone-800/40'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-3.5 bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-1 tracking-tight leading-none">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-amber-600 dark:bg-amber-400 rounded-full mt-1 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
