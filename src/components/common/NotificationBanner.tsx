import React, { useState } from 'react';
import { 
  Bell, 
  BellRing, 
  Share2, 
  PlusSquare, 
  Check, 
  X, 
  Sparkles, 
  Volume2,
  Info
} from 'lucide-react';
import { useSourdough } from '../../context/SourdoughContext';
import { Modal } from './Modal';

interface NotificationBannerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  isOpen = false,
  onClose
}) => {
  const { 
    isPushSubscribed, 
    isPushSubscribing, 
    isIOS, 
    isStandalone, 
    subscribeToPushNotifications, 
    setNotificationsEnabled 
  } = useSourdough();

  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'settings'>('ios');

  const handleEnablePush = async () => {
    if (isIOS && !isStandalone) {
      setActiveTab('ios');
      return;
    }
    setNotificationsEnabled(true);
    await subscribeToPushNotifications();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose && onClose()}
      maxWidthClass="max-w-md"
    >
      <div className="space-y-4 text-[#2E1E14]">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#E7CEB5] border border-[#D1C1A8] text-[#2E1E14] flex items-center justify-center shadow-2xs shrink-0">
              {isPushSubscribed ? (
                <BellRing className="w-5 h-5 text-[#986A4C]" />
              ) : (
                <Bell className="w-5 h-5 text-[#986A4C]" />
              )}
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2E1E14] leading-tight">
                Step Timer Alerts
              </h3>
              <p className="text-xs text-[#2E1E14]/70 mt-0.5">
                {isPushSubscribed ? 'Background lock-screen alerts active' : 'Setup kitchen chimes & lock-screen alerts'}
              </p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-[#2E1E14]/60 hover:text-[#2E1E14] p-1.5 rounded-xl hover:bg-[#E7CEB5]/60 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status & Quick Enable Bar */}
        <div className="p-3.5 rounded-2xl bg-[#E7CEB5]/70 border border-[#D1C1A8] flex items-center justify-between gap-3">
          <div className="text-xs text-[#2E1E14]/85 leading-snug">
            {isPushSubscribed
              ? 'Your device will chime when each stretch, fold, or bake step finishes.'
              : isIOS && !isStandalone
              ? 'Add Levain to your iPhone Home Screen to enable lock-screen notifications.'
              : 'Enable push notifications to receive alerts even when your phone is locked.'}
          </div>

          {!isPushSubscribed ? (
            <button
              onClick={handleEnablePush}
              disabled={isPushSubscribing}
              className="px-3.5 py-2 rounded-xl bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] font-bold text-xs shadow-xs flex items-center space-x-1.5 shrink-0 transition-all active-press disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isPushSubscribing ? 'Enabling...' : 'Enable'}</span>
            </button>
          ) : (
            <div className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#FAF5EE] text-[#2E1E14] text-xs font-bold border border-[#D1C1A8] shrink-0">
              <Check className="w-3.5 h-3.5 text-[#986A4C]" />
              <span>Active</span>
            </div>
          )}
        </div>

        {/* Platform Tabs */}
        <div className="flex rounded-2xl bg-[#E7CEB5] p-1 text-xs font-bold border border-[#D1C1A8]">
          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 rounded-xl transition-all text-center ${
              activeTab === 'ios'
                ? 'bg-[#FAF5EE] text-[#2E1E14] shadow-2xs'
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
                ? 'bg-[#FAF5EE] text-[#2E1E14] shadow-2xs'
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
                ? 'bg-[#FAF5EE] text-[#2E1E14] shadow-2xs'
                : 'text-[#2E1E14]/70 hover:text-[#2E1E14]'
            }`}
          >
            Sound &amp; Tips
          </button>
        </div>

        {/* Tab 1: iOS iPhone Setup */}
        {activeTab === 'ios' && (
          <div className="space-y-3 bg-[#E7CEB5]/50 p-4 rounded-2xl text-xs text-[#2E1E14] border border-[#D1C1A8] animate-fade-in">
            <div className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-[#2E1E14] text-[#FAF5EE] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
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
              <span className="w-5 h-5 rounded-full bg-[#2E1E14] text-[#FAF5EE] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <span className="font-bold text-[#2E1E14]">Tap "Add to Home Screen"</span>
                <div className="flex items-center space-x-1 mt-0.5 text-[#2E1E14]/75">
                  <PlusSquare className="w-3.5 h-3.5 text-[#986A4C]" />
                  <span>Scroll down and select "Add to Home Screen"</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-[#2E1E14] text-[#FAF5EE] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <span className="font-bold text-[#2E1E14]">Open App &amp; Enable Alerts</span>
                <p className="mt-0.5 text-[#2E1E14]/75">
                  Open Levain from your Home Screen icon and tap "Enable" above.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Android Setup */}
        {activeTab === 'android' && (
          <div className="space-y-3 bg-[#E7CEB5]/50 p-4 rounded-2xl text-xs text-[#2E1E14] border border-[#D1C1A8] animate-fade-in">
            <div className="flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full bg-[#2E1E14] text-[#FAF5EE] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
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
              <span className="w-5 h-5 rounded-full bg-[#2E1E14] text-[#FAF5EE] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
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
              <span className="w-5 h-5 rounded-full bg-[#2E1E14] text-[#FAF5EE] font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
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
          <div className="space-y-3 bg-[#E7CEB5]/50 p-4 rounded-2xl text-xs text-[#2E1E14] border border-[#D1C1A8] animate-fade-in">
            <div className="flex items-start space-x-2.5">
              <Volume2 className="w-4 h-4 text-[#986A4C] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#2E1E14]">Kitchen Oven Bell Chime</span>
                <p className="mt-0.5 text-[#2E1E14]/75">
                  Each step timer plays a realistic oven chime at 00:00:00. Ensure your device ringer / volume is on.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-[#986A4C] shrink-0 mt-0.5" />
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
          onClick={() => onClose && onClose()}
          className="w-full py-3 bg-[#2E1E14] hover:bg-[#986A4C] text-[#FAF5EE] rounded-2xl font-bold text-xs transition-all active-press shadow-xs"
        >
          Done
        </button>
      </div>
    </Modal>
  );
};
