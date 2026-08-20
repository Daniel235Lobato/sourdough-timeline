import React, { useState } from 'react';
import { Bell, BellRing, Share2, PlusSquare, Check, X, Smartphone, Sparkles, Send, AlertCircle, Settings, Server } from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';

export const NotificationBanner: React.FC = () => {
  const { 
    isPushSubscribed, 
    isPushSubscribing, 
    serverStatus,
    lastSyncError,
    apiBaseUrl,
    isIOS, 
    isStandalone, 
    subscribeToPushNotifications, 
    sendTestPush,
    setCustomPushServerUrl,
    setNotificationsEnabled 
  } = useSourdough();

  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return localStorage.getItem('levain_dismiss_push_banner_v1') === 'true';
  });
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState<string>(apiBaseUrl);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('levain_dismiss_push_banner_v1', 'true');
  };

  const handleEnablePush = async () => {
    if (isIOS && !isStandalone) {
      setShowIOSModal(true);
      return;
    }
    setNotificationsEnabled(true);
    await subscribeToPushNotifications();
  };

  const handleTestPush = async () => {
    setTestResult(null);
    const res = await sendTestPush();
    if (res.success) {
      setTestResult({ success: true, message: 'Push sent to Apple/WebPush service! Lock your phone to see it.' });
      setTimeout(() => setTestResult(null), 6000);
    } else {
      setTestResult({ success: false, message: res.error || 'Test notification failed' });
    }
  };

  const handleSaveCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomPushServerUrl(customUrlInput);
    setShowSettings(false);
    window.location.reload();
  };

  // If already subscribed and dismissed, don't show the banner
  if (isDismissed && isPushSubscribed && !showSettings) return null;

  return (
    <>
      <div className="px-4 mb-4 animate-fade-in">
        <div className={`p-4 rounded-2xl border transition-all ${
          isPushSubscribed
            ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-100'
            : 'bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-300/60 dark:border-amber-700/60 text-stone-900 dark:text-stone-100'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                isPushSubscribed
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-amber-500 text-white shadow-sm'
              }`}>
                {isPushSubscribed ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-serif font-bold text-sm tracking-tight">
                    {isPushSubscribed ? 'Step Push Notifications Active' : 'Step Timer Alerts'}
                  </h4>
                  {isIOS && !isStandalone && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-[10px] font-bold">
                      iOS PWA
                    </span>
                  )}
                  {/* Push Server Status Pill */}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center space-x-1 ${
                    serverStatus === 'connected'
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${serverStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500 animate-ping'}`} />
                    <span>{serverStatus === 'connected' ? 'Server Connected' : 'Checking Server'}</span>
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-sm">
                  {isPushSubscribed
                    ? 'Your iPhone/device will receive alerts when each timer ends (even when locked/closed) with what to do next.'
                    : isIOS && !isStandalone
                    ? 'Get lock-screen alerts on iPhone for each sourdough step. Add to Home Screen to activate Web Push.'
                    : 'Get notified on your device when each fold, rise, or bake timer finishes so you know when to start the next step.'}
                </p>

                {/* Test Feedback Message */}
                {testResult && (
                  <div className={`p-2 rounded-xl text-xs flex items-start space-x-1.5 mt-2 ${
                    testResult.success 
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700' 
                      : 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                  }`}>
                    {testResult.success ? <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />}
                    <span className="leading-tight">{testResult.message}</span>
                  </div>
                )}

                {/* Last Sync Warning */}
                {!testResult && lastSyncError && (
                  <div className="p-2 rounded-xl text-xs bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-start space-x-1.5 mt-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{lastSyncError}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  {!isPushSubscribed ? (
                    <button
                      onClick={handleEnablePush}
                      disabled={isPushSubscribing}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all transform active:scale-95 disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isPushSubscribing ? 'Enabling...' : isIOS && !isStandalone ? 'Setup on iPhone' : 'Enable Device Alerts'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleTestPush}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all transform active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Test Alert</span>
                    </button>
                  )}

                  {isIOS && !isStandalone && (
                    <button
                      onClick={() => setShowIOSModal(true)}
                      className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline px-1 py-1"
                    >
                      How to install on iOS ➔
                    </button>
                  )}

                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    title="Push Server Settings"
                    className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Server URL Config Drawer */}
                {showSettings && (
                  <form onSubmit={handleSaveCustomUrl} className="mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-700/60 space-y-2">
                    <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                      <Server className="w-3.5 h-3.5" />
                      <span>Push Server URL:</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        placeholder="http://192.168.1.X:3001"
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 font-mono"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-stone-900 dark:bg-amber-600 text-white rounded-xl text-xs font-bold"
                      >
                        Save
                      </button>
                    </div>
                    <p className="text-[10px] text-stone-400">
                      Current connection: <code className="font-mono">{apiBaseUrl}</code>
                    </p>
                  </form>
                )}
              </div>
            </div>

            <button
              onClick={handleDismiss}
              title="Dismiss banner"
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS PWA Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                Install Levain on iPhone
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                Apple requires web apps to be added to the Home Screen to deliver background lock-screen notifications.
              </p>
            </div>

            <div className="space-y-3 bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl text-xs text-stone-700 dark:text-stone-200 border border-stone-200/80 dark:border-stone-700">
              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <span className="font-semibold">Tap the Share button</span>
                  <div className="flex items-center space-x-1 mt-0.5 text-stone-500 dark:text-stone-400">
                    <Share2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>In Safari's bottom toolbar</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <span className="font-semibold">Select "Add to Home Screen"</span>
                  <div className="flex items-center space-x-1 mt-0.5 text-stone-500 dark:text-stone-400">
                    <PlusSquare className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                    <span>Scroll down the share sheet and tap Add</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <span className="font-semibold">Open Levain from Home Screen</span>
                  <p className="mt-0.5 text-stone-500 dark:text-stone-400">
                    Tap "Enable Device Alerts" to receive timer chimes and step notifications on your lock screen!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 bg-stone-900 dark:bg-amber-600 hover:bg-black dark:hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
