import { useState, useEffect, useCallback, useMemo } from 'react';

const DEFAULT_VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BIU6b6CbdfOxfMZb9-1GZPJetimPSFXx3BlgDuXCy6jAdQMoYvi_QNWOjknWP-nztlwVRfo34Fq4-Fc33q2-z2g';
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Utility to convert VAPID base64 string to Uint8Array for pushManager
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export interface SchedulePushParams {
  stepId: string;
  stepName: string;
  nextStepName?: string;
  fireTimestamp: number;
  recipeName?: string;
  title?: string;
  body?: string;
}

export interface SyncSessionScheduleItem {
  stepId: string;
  stepName: string;
  nextStepName?: string;
  fireTimestamp: number;
  title?: string;
  body?: string;
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null);
  const [isSubscribing, setIsSubscribing] = useState<boolean>(false);

  // iOS and PWA detection
  const isIOS = useMemo(() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  }, []);

  const isStandalone = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const nav = window.navigator as { standalone?: boolean };
    return Boolean(nav.standalone) || window.matchMedia('(display-mode: standalone)').matches;
  }, []);

  // 1. Register Service Worker on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('./sw.js')
        .then(async (registration) => {
          setSwRegistration(registration);

          // Check if already subscribed to push
          try {
            const existing = await registration.pushManager.getSubscription();
            if (existing) {
              setPushSubscription(existing);
            }
          } catch (e) {
            console.warn('[Push] Error getting existing subscription:', e);
          }
        })
        .catch((err) => {
          console.warn('[SW] Registration failed:', err);
        });
    }
  }, []);

  // 2. Request Notification Permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      return res === 'granted';
    } catch {
      return false;
    }
  }, []);

  // 3. Subscribe to Web Push Notifications
  const subscribeToPushNotifications = useCallback(async (): Promise<PushSubscription | null> => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('[Push] Push notifications not supported in this browser environment.');
      return null;
    }

    setIsSubscribing(true);
    try {
      // 1. Ensure permission is granted
      const hasPerm = Notification.permission === 'granted' || (await requestPermission());
      if (!hasPerm) {
        setIsSubscribing(false);
        return null;
      }

      // 2. Obtain / wait for service worker registration
      let registration = swRegistration;
      if (!registration) {
        registration = await navigator.serviceWorker.ready;
        setSwRegistration(registration);
      }

      // 3. Subscribe via pushManager
      const convertedVapidKey = urlBase64ToUint8Array(DEFAULT_VAPID_PUBLIC_KEY);
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey as unknown as ArrayBuffer
      });

      setPushSubscription(subscription);

      // 4. Send subscription payload to backend API (if configured)
      try {
        await fetch(`${API_BASE_URL}/api/notifications/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription })
        });
      } catch (apiErr) {
        console.info('[Push] Backend sync skipped or unavailable:', apiErr);
      }

      setIsSubscribing(false);
      return subscription;
    } catch (err) {
      console.error('[Push] Failed to subscribe to push notifications:', err);
      setIsSubscribing(false);
      return null;
    }
  }, [swRegistration, requestPermission]);

  // 4. Schedule Remote Push for a Single Step Timer
  const scheduleRemotePush = useCallback(async (params: SchedulePushParams) => {
    if (!pushSubscription) return;

    try {
      await fetch(`${API_BASE_URL}/api/notifications/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: pushSubscription,
          ...params
        })
      });
    } catch (e) {
      console.warn('[Push] Remote schedule error:', e);
    }
  }, [pushSubscription]);

  // 5. Batch Sync Session Step Timers with Push Server
  const syncSessionPushSchedules = useCallback(async (
    schedules: SyncSessionScheduleItem[],
    recipeName?: string
  ) => {
    if (!pushSubscription) return;

    try {
      await fetch(`${API_BASE_URL}/api/notifications/sync-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: pushSubscription,
          schedules,
          recipeName
        })
      });
    } catch (e) {
      console.warn('[Push] Session push sync error:', e);
    }
  }, [pushSubscription]);

  // 6. Cancel Scheduled Remote Push Notifications
  const cancelRemotePush = useCallback(async (stepId?: string) => {
    if (!pushSubscription) return;

    try {
      await fetch(`${API_BASE_URL}/api/notifications/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionEndpoint: pushSubscription.endpoint,
          stepId
        })
      });
    } catch (e) {
      console.warn('[Push] Cancel push error:', e);
    }
  }, [pushSubscription]);

  // 7. Test Push Notification (Immediate trigger to verify device lock-screen push)
  const sendTestPush = useCallback(async () => {
    let sub = pushSubscription;
    if (!sub) {
      sub = await subscribeToPushNotifications();
    }
    if (!sub) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub })
      });
      return res.ok;
    } catch (e) {
      console.warn('[Push] Test push error:', e);
      return false;
    }
  }, [pushSubscription, subscribeToPushNotifications]);

  // 8. Local In-App Notification (When app is active in foreground)
  const sendNotification = useCallback((title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        if (swRegistration && 'showNotification' in swRegistration) {
          swRegistration.showNotification(`🍞 ${title}`, {
            body,
            icon: './logo.png',
            badge: './favicon.png'
          });
        } else {
          new Notification(`🍞 ${title}`, {
            body,
            icon: './logo.png'
          });
        }
      } catch (e) {
        console.warn('Local notification error:', e);
      }
    }
  }, [swRegistration]);

  return {
    permission,
    isSubscribed: !!pushSubscription,
    pushSubscription,
    isSubscribing,
    isIOS,
    isStandalone,
    requestPermission,
    subscribeToPushNotifications,
    scheduleRemotePush,
    syncSessionPushSchedules,
    cancelRemotePush,
    sendTestPush,
    sendNotification,
    isSupported: typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator
  };
}
