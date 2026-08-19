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
      data = { title: 'Levain Alert', body: event.data.text() };
    }
  }

  const title = data.title || '🍞 Sourdough Alert';
  const options = {
    body: data.body || 'Time for your next sourdough baking step!',
    icon: data.icon || './logo.png',
    badge: data.badge || './favicon.png',
    tag: data.tag || 'sourdough-timer-' + Date.now(),
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 400],
    data: {
      url: data.url || './',
      stepId: data.stepId,
      timestamp: Date.now()
    }
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
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
