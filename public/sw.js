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
      data = { title: '🍞 Sourdough Alert', body: event.data.text() };
    }
  }

  const title = data.title || '🍞 Sourdough Step Complete!';
  const options = {
    body: data.body || 'Time to start your next baking step!',
    icon: data.icon || './logo.png',
    badge: data.badge || './favicon.png',
    tag: data.tag || 'sourdough-timer-' + Date.now(),
    renotify: true,
    requireInteraction: true,
    vibrate: [300, 150, 300, 150, 500],
    data: {
      url: data.url || './',
      stepId: data.stepId,
      timestamp: Date.now()
    },
    actions: [
      { action: 'open_timeline', title: 'Open Schedule 🍞' }
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
