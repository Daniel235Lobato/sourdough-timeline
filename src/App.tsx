import React, { useState } from 'react';
import { SourdoughProvider, useSourdough } from './context/SourdoughContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeView } from './components/home/HomeView';
import { TimelineView } from './components/timeline/TimelineView';
import { RecipeListView } from './components/recipes/RecipeListView';
import { BakeHistoryView } from './components/history/BakeHistoryView';
import { HydrationCalculatorView } from './components/calculator/HydrationCalculatorView';

const MainAppContent: React.FC = () => {
  const { activeSession } = useSourdough();
  const [activeTab, setActiveTab] = useState<string>(activeSession ? 'timeline' : 'home');

  return (
    <div className="min-h-screen bg-flour-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      {/* Sticky Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Tab Screen Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto pt-2 pb-8">
        {(activeTab === 'home' || (!activeSession && activeTab === 'timeline')) && (
          <HomeView
            onNavigateToTimeline={() => setActiveTab('timeline')}
            onNavigateToRecipes={() => setActiveTab('recipes')}
          />
        )}

        {activeTab === 'timeline' && activeSession && (
          <TimelineView onNavigateHome={() => setActiveTab('home')} />
        )}

        {activeTab === 'recipes' && (
          <RecipeListView onSelectAndBake={() => setActiveTab('home')} />
        )}

        {activeTab === 'history' && (
          <BakeHistoryView />
        )}

        {activeTab === 'calculator' && (
          <HydrationCalculatorView onApplyFormula={() => setActiveTab('home')} />
        )}
      </main>

      {/* Mobile-First Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <SourdoughProvider>
      <MainAppContent />
    </SourdoughProvider>
  );
}
