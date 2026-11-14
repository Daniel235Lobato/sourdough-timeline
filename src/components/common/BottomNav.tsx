import React from 'react';
import { Compass, BookOpen, History } from 'lucide-react';
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
    }
  ];

  return (
    <div className="shrink-0 z-40 px-3 sm:px-4 pt-1.5 pb-safe bg-[#FAF5EE]">
      <nav className="max-w-md mx-auto mb-2 sm:mb-3 bg-[#E7CEB5] border border-[#D1C1A8] rounded-3xl shadow-dock p-1.5 transition-all">
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
                    ? 'bg-[#FAF5EE] text-[#2E1E14] font-bold shadow-xs' 
                    : 'text-[#2E1E14]/70 hover:text-[#2E1E14] hover:bg-[#FAF5EE]/50'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'}`} />
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-3.5 bg-[#986A4C] text-[#FAF5EE] text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] mt-1 tracking-tight leading-none">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 bg-[#986A4C] rounded-full mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
