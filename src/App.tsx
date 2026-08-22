import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { SourdoughProvider, useSourdough } from './context/SourdoughContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeView } from './components/home/HomeView';
import { TimelineView } from './components/timeline/TimelineView';
import { RecipeListView } from './components/recipes/RecipeListView';
import { BakeHistoryView } from './components/history/BakeHistoryView';
import { HydrationCalculatorView } from './components/calculator/HydrationCalculatorView';
import { NotificationBanner } from './components/common/NotificationBanner';
import { Logo } from './components/common/Logo';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error Caught:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 mb-4">
            <Logo size={64} className="w-full h-full" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-2">Something went wrong</h1>
          <p className="text-xs text-stone-400 max-w-sm mb-4">
            {this.state.error?.message || 'An unexpected error occurred while loading the app.'}
          </p>
          <button
            onClick={this.handleReset}
            className="py-2.5 px-5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-colors"
          >
            Clear Data & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainAppContent: React.FC = () => {
  const { activeSession } = useSourdough();
  const [activeTab, setActiveTab] = useState<string>(activeSession ? 'timeline' : 'home');

  return (
    <div className="min-h-screen bg-[#FBF9F5] dark:bg-[#121110] text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors selection:bg-amber-200 selection:text-amber-900">
      {/* Sticky Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Tab Screen Container */}
      <main className="flex-1 w-full max-w-xl mx-auto pt-2 pb-24 px-1 sm:px-0">
        {/* Device & PWA Step Notification Banner */}
        <NotificationBanner />

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
    <ErrorBoundary>
      <SourdoughProvider>
        <MainAppContent />
      </SourdoughProvider>
    </ErrorBoundary>
  );
}
