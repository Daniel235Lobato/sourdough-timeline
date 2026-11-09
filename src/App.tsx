import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SourdoughProvider, useSourdough } from './context/SourdoughContext';
import { SignInWall } from './components/auth/SignInWall';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeView } from './components/home/HomeView';
import { TimelineView } from './components/timeline/TimelineView';
import { RecipeListView } from './components/recipes/RecipeListView';
import { BakeHistoryView } from './components/history/BakeHistoryView';
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
        <div className="min-h-screen bg-[#FAF5EE] text-[#2E1E14] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 mb-4">
            <Logo size={64} className="w-full h-full" />
          </div>
          <h1 className="font-serif text-2xl font-bold mb-2 text-[#2E1E14]">Something went wrong</h1>
          <p className="text-xs text-[#2E1E14]/80 max-w-sm mb-4">
            {this.state.error?.message || 'An unexpected error occurred while loading the app.'}
          </p>
          <button
            onClick={this.handleReset}
            className="py-2.5 px-5 bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] rounded-xl font-bold text-xs transition-colors"
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
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-dvh bg-[#FAF5EE] text-[#2E1E14] flex flex-col font-sans selection:bg-[#D1C1A8] selection:text-[#2E1E14] w-full max-w-full overflow-x-hidden">
      {/* Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
      />

      {/* Main Tab Screen Container */}
      <main className="flex-1 flex flex-col w-full max-w-xl mx-auto pt-2.5 pb-24 px-3.5 sm:px-4 min-w-0 overflow-x-hidden box-border">
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
      </main>

      {/* Notification & PWA Setup Modal */}
      <NotificationBanner
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      {/* Mobile-First Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

const AuthGatedApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-[#FAF5EE] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-3 border-[#986A4C] border-t-transparent rounded-full animate-spin" />
        <span className="font-serif text-sm font-semibold text-[#2E1E14]">Opening bakery...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignInWall />;
  }

  return <MainAppContent />;
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SourdoughProvider>
          <AuthGatedApp />
        </SourdoughProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
