import webpush from 'web-push';

const vapidKeys = webpush.generateVAPIDKeys();
console.log('--- GENERATED VAPID KEYS ---');
console.log('PUBLIC KEY:', vapidKeys.publicKey);
console.log('PRIVATE KEY:', vapidKeys.privateKey);
console.log('----------------------------');
