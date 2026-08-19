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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-flour-50/95 dark:bg-stone-950/95 backdrop-blur-lg border-t border-stone-200/80 dark:border-stone-800 pb-safe">
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'home' && activeTab === 'timeline' && !activeSession);

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center py-1.5 px-2 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-crust-600 dark:text-crust-400 font-semibold' 
                  : 'text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <div className="w-4 h-0.5 bg-crust-600 dark:bg-crust-400 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
