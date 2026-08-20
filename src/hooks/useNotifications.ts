import { useState, useEffect, useCallback, useMemo } from 'react';

const DEFAULT_VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BIU6b6CbdfOxfMZb9-1GZPJetimPSFXx3BlgDuXCy6jAdQMoYvi_QNWOjknWP-nztlwVRfo34Fq4-Fc33q2-z2g';

// Dynamically resolve the Push Server URL so mobile devices on LAN, Vercel, or custom domains connect automatically
export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') return import.meta.env.VITE_API_URL || '';

  // 1. Check if user configured custom URL in localStorage (e.g. manual tunnel or external server)
  const savedUrl = localStorage.getItem('levain_push_server_url_v1');
  if (savedUrl) return savedUrl.replace(/\/$/, '');

  const envUrl = import.meta.env.VITE_API_URL;
  // 2. If envUrl is explicitly set to an external remote URL (e.g. Render / Railway)
  if (envUrl && envUrl.startsWith('http') && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/$/, '');
  }

  const hostname = window.location.hostname;

  // 3. If running locally on LAN dev server (e.g. http://192.168.1.50:5173)
  if (
    hostname &&
    (hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.endsWith('.local'))
  ) {
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}:3001`;
  }

  // 4. If running locally on localhost dev server (http://localhost:5173)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001';
  }

  // 5. If running on a cloud deployment (e.g. Vercel, Netlify, custom HTTPS domain)
  // The API is hosted on the exact same origin!
  return window.location.origin;
}

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
  const [serverStatus, setServerStatus] = useState<'connected' | 'unreachable' | 'checking'>('checking');
  const [lastSyncError, setLastSyncError] = useState<string | null>(null);

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

  // 1. Register Service Worker and check Push Server on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Check Push Server health
    const apiUrl = getApiBaseUrl();
    fetch(`${apiUrl}/api/health`)
      .then(res => {
        if (res.ok) setServerStatus('connected');
        else setServerStatus('unreachable');
      })
      .catch(() => {
        setServerStatus('unreachable');
      });

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
              // Ensure backend knows about this subscription
              try {
                await fetch(`${apiUrl}/api/notifications/subscribe`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ subscription: existing })
                });
                setServerStatus('connected');
              } catch (e) {
                console.warn('[Push] Error syncing existing subscription to server:', e);
              }
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
    setLastSyncError(null);
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

      // 4. Send subscription payload to backend API
      const apiUrl = getApiBaseUrl();
      try {
        const res = await fetch(`${apiUrl}/api/notifications/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription })
        });
        if (res.ok) {
          setServerStatus('connected');
        } else {
          setLastSyncError(`Server returned status ${res.status}`);
        }
      } catch (apiErr: unknown) {
        const msg = apiErr instanceof Error ? apiErr.message : 'Cannot reach push server';
        console.warn(`[Push] Server sync failed (${apiUrl}):`, msg);
        setLastSyncError(`Could not reach push server at ${apiUrl}`);
        setServerStatus('unreachable');
      }

      setIsSubscribing(false);
      return subscription;
    } catch (err: unknown) {
      console.error('[Push] Failed to subscribe to push notifications:', err);
      const msg = err instanceof Error ? err.message : 'Subscription error';
      setLastSyncError(msg);
      setIsSubscribing(false);
      return null;
    }
  }, [swRegistration, requestPermission]);

  // 4. Schedule Remote Push for a Single Step Timer
  const scheduleRemotePush = useCallback(async (params: SchedulePushParams) => {
    if (!pushSubscription) return;
    const apiUrl = getApiBaseUrl();

    try {
      await fetch(`${apiUrl}/api/notifications/schedule`, {
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

  const [scheduledMsgIds, setScheduledMsgIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('levain_scheduled_msg_ids_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Batch Sync Session Step Timers with Push Server
  const syncSessionPushSchedules = useCallback(async (
    schedules: SyncSessionScheduleItem[],
    recipeName?: string
  ) => {
    if (!pushSubscription) return;
    const apiUrl = getApiBaseUrl();

    try {
      const res = await fetch(`${apiUrl}/api/notifications/sync-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: pushSubscription,
          schedules,
          recipeName,
          messageIds: scheduledMsgIds
        })
      });
      if (res.ok) {
        setServerStatus('connected');
        const data = await res.json().catch(() => ({}));
        if (Array.isArray(data.messageIds)) {
          setScheduledMsgIds(data.messageIds);
          localStorage.setItem('levain_scheduled_msg_ids_v1', JSON.stringify(data.messageIds));
        }
      }
    } catch (e) {
      console.warn(`[Push] Session push sync error (${apiUrl}):`, e);
      setServerStatus('unreachable');
    }
  }, [pushSubscription, scheduledMsgIds]);

  // 6. Cancel Scheduled Remote Push Notifications
  const cancelRemotePush = useCallback(async (stepId?: string) => {
    if (!pushSubscription) return;
    const apiUrl = getApiBaseUrl();

    try {
      await fetch(`${apiUrl}/api/notifications/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionEndpoint: pushSubscription.endpoint,
          stepId,
          messageIds: scheduledMsgIds
        })
      });
      setScheduledMsgIds([]);
      localStorage.removeItem('levain_scheduled_msg_ids_v1');
    } catch (e) {
      console.warn('[Push] Cancel push error:', e);
    }
  }, [pushSubscription, scheduledMsgIds]);

  // 7. Test Push Notification (Immediate trigger to verify device lock-screen push)
  const sendTestPush = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    let sub = pushSubscription;
    if (!sub) {
      sub = await subscribeToPushNotifications();
    }
    if (!sub) {
      return { success: false, error: 'Could not create push subscription. Ensure notification permissions are allowed in iOS settings.' };
    }

    const apiUrl = getApiBaseUrl();

    // Mixed Content detection (HTTPS PWA calling HTTP server)
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && apiUrl.startsWith('http:')) {
      setServerStatus('unreachable');
      return {
        success: false,
        error: `HTTPS Push Server Required: Because Levain is loaded securely via HTTPS, iOS requires an HTTPS push server URL. Run 'npm run tunnel' on your computer and paste the https://...loca.lt URL into Settings ⚙️.`
      };
    }

    try {
      const res = await fetch(`${apiUrl}/api/notifications/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub })
      });
      if (res.ok) {
        setServerStatus('connected');
        return { success: true };
      } else {
        const errorData = await res.json().catch(() => ({}));
        return { success: false, error: errorData.error || `Server returned error ${res.status}` };
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Network error';
      console.warn('[Push] Test push error:', e);
      setServerStatus('unreachable');
      return { success: false, error: `Could not connect to push server at ${apiUrl}. Make sure 'npm run server' (and 'npm run tunnel' if using HTTPS) is running!` };
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

  // 9. Save Custom Server URL if user wants to change port/host
  const setCustomPushServerUrl = useCallback((url: string) => {
    if (!url) {
      localStorage.removeItem('levain_push_server_url_v1');
    } else {
      localStorage.setItem('levain_push_server_url_v1', url.trim());
    }
  }, []);

  return {
    permission,
    isSubscribed: !!pushSubscription,
    pushSubscription,
    isSubscribing,
    serverStatus,
    lastSyncError,
    apiBaseUrl: getApiBaseUrl(),
    isIOS,
    isStandalone,
    requestPermission,
    subscribeToPushNotifications,
    scheduleRemotePush,
    syncSessionPushSchedules,
    cancelRemotePush,
    sendTestPush,
    sendNotification,
    setCustomPushServerUrl,
    isSupported: typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator
  };
}
