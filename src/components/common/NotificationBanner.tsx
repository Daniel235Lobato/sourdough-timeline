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
        <div className="p-4 sm:p-5 rounded-3xl border border-[#D1C1A8] bg-[#E7CEB5] text-[#2E1E14] shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#2E1E14] text-[#FAF5EE] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                {isPushSubscribed ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-serif font-bold text-sm sm:text-base tracking-tight text-[#2E1E14]">
                    {isPushSubscribed ? 'Step Notifications Active' : 'Step Timer Alerts'}
                  </h4>
                  {isIOS && !isStandalone && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FAF5EE] text-[#2E1E14] text-[10px] font-bold border border-[#D1C1A8]">
                      iOS App
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#2E1E14]/75 leading-relaxed max-w-sm">
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
                      className="px-4 py-2 rounded-xl bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] font-semibold text-xs shadow-xs flex items-center space-x-1.5 transition-all active-press disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isPushSubscribing ? 'Enabling...' : isIOS && !isStandalone ? 'Setup on iPhone' : 'Turn On Notifications'}</span>
                    </button>
                  ) : (
                    <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#FAF5EE] text-[#2E1E14] text-xs font-semibold border border-[#D1C1A8]">
                      <Check className="w-3.5 h-3.5 text-[#986A4C]" />
                      <span>Alerts Active</span>
                    </div>
                  )}

                  <button
                    onClick={() => setShowGuideModal(true)}
                    className="text-xs font-semibold text-[#986A4C] hover:text-[#2E1E14] px-1 py-1 flex items-center space-x-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>How to setup PWA &amp; Alerts</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              title="Dismiss banner"
              className="p-1 rounded-lg text-[#2E1E14]/60 hover:text-[#2E1E14] hover:bg-[#FAF5EE] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive PWA & Notification Setup Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E1E14]/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF5EE] border border-[#D1C1A8] rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto text-[#2E1E14]">
            <button
              onClick={() => setShowGuideModal(false)}
              className="absolute top-4 right-4 text-[#2E1E14]/70 hover:text-[#2E1E14] p-2 rounded-full hover:bg-[#E7CEB5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#E7CEB5] border border-[#D1C1A8] text-[#2E1E14] flex items-center justify-center shadow-xs">
              <Smartphone className="w-6 h-6 text-[#986A4C]" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-[#2E1E14]">
                Notification & PWA Setup Guide
              </h3>
              <p className="text-xs text-[#2E1E14]/75 mt-1 leading-relaxed">
                Follow these simple steps to ensure you receive step alerts and oven bell chimes even when your phone is locked or closed.
              </p>
            </div>

            {/* Platform Tabs */}
            <div className="flex rounded-2xl bg-[#E7CEB5] p-1 text-xs font-bold border border-[#D1C1A8]">
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-2 rounded-xl transition-all text-center ${
                  activeTab === 'ios'
                    ? 'bg-[#FAF5EE] text-[#2E1E14] shadow-xs'
                    : 'text-[#2E1E14]/70 hover:text-[#2E1E14]'
                }`}
              >
                iPhone (iOS)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-2 rounded-xl transition-all text-center ${
                  activeTab === 'android'
                    ? 'bg-[#FAF5EE] text-[#2E1E14] shadow-xs'
                    : 'text-[#2E1E14]/70 hover:text-[#2E1E14]'
                }`}
              >
                Android / PC
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-2 rounded-xl transition-all text-center ${
                  activeTab === 'settings'
                    ? 'bg-[#FAF5EE] text-[#2E1E14] shadow-xs'
                    : 'text-[#2E1E14]/70 hover:text-[#2E1E14]'
                }`}
              >
                Sound & Tips
              </button>
            </div>

            {/* Tab 1: iOS iPhone Setup */}
            {activeTab === 'ios' && (
              <div className="space-y-3 bg-[#E7CEB5] p-4 rounded-2xl text-xs text-[#2E1E14] border border-[#D1C1A8] animate-fade-in">
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2E1E14] text-[#FAF5EE] font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-[#2E1E14]">Tap Share in Safari</span>
                    <div className="flex items-center space-x-1 mt-0.5 text-[#2E1E14]/75">
                      <Share2 className="w-3.5 h-3.5 text-[#986A4C]" />
                      <span>Tap the Share icon at the bottom of Safari</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2E1E14] text-[#FAF5EE] font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-[#2E1E14]">Tap "Add to Home Screen"</span>
                    <div className="flex items-center space-x-1 mt-0.5 text-[#2E1E14]/75">
                      <PlusSquare className="w-3.5 h-3.5 text-[#986A4C]" />
                      <span>Scroll down the menu and select "Add to Home Screen"</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2E1E14] text-[#FAF5EE] font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-[#2E1E14]">Open App & Allow Alerts</span>
                    <p className="mt-0.5 text-[#2E1E14]/75">
                      Open Levain from your Home Screen icon and tap "Turn On Notifications".
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Android Setup */}
            {activeTab === 'android' && (
              <div className="space-y-3 bg-[#E7CEB5] p-4 rounded-2xl text-xs text-[#2E1E14] border border-[#D1C1A8] animate-fade-in">
                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2E1E14] text-[#FAF5EE] font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-[#2E1E14]">Tap Browser Menu (⋮)</span>
                    <p className="mt-0.5 text-[#2E1E14]/75">
                      In Chrome, tap the 3 dots in the top-right corner.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2E1E14] text-[#FAF5EE] font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-[#2E1E14]">Select "Install App"</span>
                    <p className="mt-0.5 text-[#2E1E14]/75">
                      Tap "Install App" or "Add to Home Screen".
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#2E1E14] text-[#FAF5EE] font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-[#2E1E14]">Allow Notifications</span>
                    <p className="mt-0.5 text-[#2E1E14]/75">
                      When prompted, tap "Allow" so timers notify you in the background.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Sound & Troubleshooting Tips */}
            {activeTab === 'settings' && (
              <div className="space-y-3 bg-[#E7CEB5] p-4 rounded-2xl text-xs text-[#2E1E14] border border-[#D1C1A8] animate-fade-in">
                <div className="flex items-start space-x-2.5">
                  <Volume2 className="w-4 h-4 text-[#986A4C] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#2E1E14]">Kitchen Oven Bell Chime</span>
                    <p className="mt-0.5 text-[#2E1E14]/75">
                      Each step timer plays a realistic oven chime at 00:00:00. Ensure your device ringer / volume is on.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <Info className="w-4 h-4 text-[#986A4C] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#2E1E14]">iPhone Notification Settings</span>
                    <p className="mt-0.5 text-[#2E1E14]/75">
                      Go to <code className="font-mono font-bold text-[#2E1E14]">Settings &gt; Notifications &gt; Levain</code> and make sure Lock Screen and Sounds are enabled.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-3.5 bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] rounded-2xl font-bold text-xs transition-all active-press shadow-xs"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
