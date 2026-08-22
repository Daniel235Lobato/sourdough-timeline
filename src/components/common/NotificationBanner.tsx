import React, { useState } from 'react';
import { 
  Bell, 
  BellRing, 
  Share2, 
  PlusSquare, 
  Check, 
  X, 
  Smartphone, 
  Sparkles, 
  HelpCircle,
  Volume2,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';

export const NotificationBanner: React.FC = () => {
  const { 
    isPushSubscribed, 
    isPushSubscribing, 
    isIOS, 
    isStandalone, 
    subscribeToPushNotifications, 
    setNotificationsEnabled 
  } = useSourdough();

  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return localStorage.getItem('levain_dismiss_push_banner_v1') === 'true';
  });
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'settings'>('ios');

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('levain_dismiss_push_banner_v1', 'true');
  };

  const handleEnablePush = async () => {
    if (isIOS && !isStandalone) {
      setShowGuideModal(true);
      setActiveTab('ios');
      return;
    }
    setNotificationsEnabled(true);
    await subscribeToPushNotifications();
  };

  // If already subscribed and dismissed, keep clean
  if (isDismissed && isPushSubscribed) return null;

  return (
    <>
      <div className="px-3 sm:px-4 mb-4 animate-fade-in">
        <div className={`p-4 sm:p-5 rounded-3xl border transition-all shadow-card ${
          isPushSubscribed
            ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-100'
            : 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-300/70 dark:border-amber-700/60 text-stone-900 dark:text-stone-100'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs ${
                isPushSubscribed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}>
                {isPushSubscribed ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-serif font-bold text-sm sm:text-base tracking-tight">
                    {isPushSubscribed ? 'Step Notifications Active' : 'Step Timer Alerts'}
                  </h4>
                  {isIOS && !isStandalone && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-[10px] font-bold">
                      iOS App
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-sm">
                  {isPushSubscribed
                    ? 'Your device will receive alerts and oven chimes when each timer finishes (even when phone is locked).'
                    : isIOS && !isStandalone
                    ? 'Install Levain on your Home Screen to receive lock-screen alerts for every stretch, fold, and bake step.'
                    : 'Get notified with kitchen chimes on your device when each fold, rise, or bake step is due.'}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {!isPushSubscribed ? (
                    <button
                      onClick={handleEnablePush}
                      disabled={isPushSubscribing}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all active-press disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isPushSubscribing ? 'Enabling...' : isIOS && !isStandalone ? 'Setup on iPhone' : 'Turn On Notifications'}</span>
                    </button>
                  ) : (
                    <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Alerts Active</span>
                    </div>
                  )}

                  <button
                    onClick={() => setShowGuideModal(true)}
                    className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline px-1 py-1 flex items-center space-x-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>How to setup PWA & Alerts</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              title="Dismiss banner"
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive PWA & Notification Setup Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#181614] border border-stone-200/90 dark:border-stone-800/90 rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shadow-xs">
              <Smartphone className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                Notification & PWA Setup Guide
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                Follow these simple steps to ensure you receive step alerts and oven bell chimes even when your phone is locked or closed.
              </p>
            </div>

            {/* Platform Tabs */}
            <div className="flex rounded-2xl bg-stone-100 dark:bg-stone-800/80 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-2 rounded-xl transition-all text-center ${
                  activeTab === 'ios'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                iPhone (iOS)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-2 rounded-xl transition-all text-center ${
                  activeTab === 'android'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                Android / PC
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-2 rounded-xl transition-all text-center ${
                  activeTab === 'settings'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                Sound & Tips
              </button>
            </div>

            {/* Tab 1: iOS iPhone Setup */}
            {activeTab === 'ios' && (
              <div className="space-y-3 bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl text-xs text-stone-700 dark:text-stone-200 border border-stone-200/80 dark:border-stone-700 animate-fade-in">
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100">Tap Share in Safari</span>
                    <div className="flex items-center space-x-1 mt-0.5 text-stone-500 dark:text-stone-400">
                      <Share2 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Tap the Share icon at the bottom of Safari</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100">Tap "Add to Home Screen"</span>
                    <div className="flex items-center space-x-1 mt-0.5 text-stone-500 dark:text-stone-400">
                      <PlusSquare className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                      <span>Scroll down the menu and select "Add to Home Screen"</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100">Open App & Allow Alerts</span>
                    <p className="mt-0.5 text-stone-500 dark:text-stone-400">
                      Open Levain from your Home Screen icon and tap "Turn On Notifications".
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Android Setup */}
            {activeTab === 'android' && (
              <div className="space-y-3 bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl text-xs text-stone-700 dark:text-stone-200 border border-stone-200/80 dark:border-stone-700 animate-fade-in">
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100">Tap Browser Menu (⋮)</span>
                    <p className="mt-0.5 text-stone-500 dark:text-stone-400">
                      In Chrome, tap the 3 dots in the top-right corner.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100">Select "Install App"</span>
                    <p className="mt-0.5 text-stone-500 dark:text-stone-400">
                      Tap "Install App" or "Add to Home Screen".
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100">Allow Notifications</span>
                    <p className="mt-0.5 text-stone-500 dark:text-stone-400">
                      When prompted, tap "Allow" so timers notify you in the background.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Sound & Troubleshooting Tips */}
            {activeTab === 'settings' && (
              <div className="space-y-3 bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl text-xs text-stone-700 dark:text-stone-200 border border-stone-200/80 dark:border-stone-700 animate-fade-in">
                <div className="flex items-start space-x-2.5">
                  <Volume2 className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100">Kitchen Oven Bell Chime</span>
                    <p className="mt-0.5 text-stone-500 dark:text-stone-400">
                      Each step timer plays a realistic oven chime at 00:00:00. Ensure your device ringer / volume is on.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100">iPhone Notification Settings</span>
                    <p className="mt-0.5 text-stone-500 dark:text-stone-400">
                      Go to <code className="font-mono font-bold text-stone-700 dark:text-stone-300">Settings &gt; Notifications &gt; Levain</code> and make sure Lock Screen and Sounds are enabled.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-3.5 bg-stone-900 dark:bg-amber-600 hover:bg-black dark:hover:bg-amber-700 text-white rounded-2xl font-bold text-xs transition-all active-press shadow-sm"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
