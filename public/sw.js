// Service Worker for Levain Sourdough Timeline Push Notifications

const CACHE_NAME = 'levain-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for incoming Push Events (from backend server when screen is locked or browser is closed)
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: '⏱️ Levain Timer', body: event.data.text() };
    }
  }

  // Drop stale notifications that arrive > 15 minutes after their scheduled fire time
  if (typeof data.fireTimestamp === 'number' && Date.now() - data.fireTimestamp > 15 * 60 * 1000) {
    return;
  }

  const title = data.title || '⏱️ Time for Your Next Step';
  const options = {
    body: data.body || 'Your step timer has finished. Tap to start your next baking step.',
    icon: data.icon || './logo.png',
    badge: data.badge || './favicon.png',
    tag: data.tag || 'levain-timer-reminder',
    renotify: true,
    requireInteraction: true,
    vibrate: [250, 120, 250, 120, 400],
    data: {
      url: data.url || './',
      stepId: data.stepId,
      timestamp: Date.now()
    },
    actions: [
      { action: 'open_timeline', title: 'Start Next Step' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Focus or open app window on notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || './';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          // Send message to client to notify step completion
          client.postMessage({
            type: 'STEP_NOTIFICATION_CLICKED',
            stepId: event.notification.data?.stepId
          });
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
