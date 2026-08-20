import express from 'express';
import cors from 'cors';
import webpush from 'web-push';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Configure Web Push VAPID Details
const VAPID_PUBLIC_KEY = process.env.VITE_VAPID_PUBLIC_KEY || 'BIU6b6CbdfOxfMZb9-1GZPJetimPSFXx3BlgDuXCy6jAdQMoYvi_QNWOjknWP-nztlwVRfo34Fq4-Fc33q2-z2g';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'qgchOH4s56fIuh-FRlfnTyCTWSFszbhDbkyjZOulhDE';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@sourdough-timeline.app';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// Push subscriptions storage (in-memory, keyed by endpoint)
const subscriptions = new Map();

// Scheduled timer jobs storage: Map<jobId, { timeoutId, fireTimestamp, stepName, endpoint }>
const scheduledJobs = new Map();

// Helper to send a web push notification safely
async function sendPush(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { success: true };
  } catch (error) {
    console.error('WebPush delivery error:', error.statusCode, error.message);
    // If subscription is 404 or 410 Gone, remove it
    if (error.statusCode === 404 || error.statusCode === 410) {
      subscriptions.delete(subscription.endpoint);
    }
    return { success: false, error: error.message };
  }
}

// 1. Get Public VAPID Key
app.get('/api/notifications/vapid-public-key', (req, res) => {
  res.json({ publicKey: VAPID_PUBLIC_KEY });
});

// 2. Register/Save Push Subscription
app.post('/api/notifications/subscribe', (req, res) => {
  const { subscription } = req.body;
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Valid subscription object required' });
  }

  subscriptions.set(subscription.endpoint, {
    subscription,
    updatedAt: Date.now()
  });

  console.log(`[Push Server] Registered subscription: ${subscription.endpoint.slice(0, 40)}...`);
  res.status(201).json({ success: true, message: 'Subscription stored successfully' });
});

// 3. Test Push Notification
app.post('/api/notifications/test', async (req, res) => {
  const { subscription } = req.body;
  if (!subscription) {
    return res.status(400).json({ error: 'Subscription required' });
  }

  const payload = {
    title: '🍞 Levain Push Test',
    body: 'Background notifications are connected and working!',
    icon: './logo.png',
    badge: './favicon.png',
    tag: 'test-notification',
    url: './'
  };

  const result = await sendPush(subscription, payload);
  if (result.success) {
    res.json({ success: true, message: 'Test notification sent' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

// 4. Schedule Single Timer Push Notification
app.post('/api/notifications/schedule', (req, res) => {
  const { subscription, stepId, stepName, nextStepName, fireTimestamp, recipeName, body, title } = req.body;
  if (!subscription || !stepId || !fireTimestamp) {
    return res.status(400).json({ error: 'Missing required schedule parameters' });
  }

  const now = Date.now();
  const delayMs = fireTimestamp - now;
  const jobId = `${subscription.endpoint}::${stepId}`;

  // Clear existing job for this step if any
  if (scheduledJobs.has(jobId)) {
    clearTimeout(scheduledJobs.get(jobId).timeoutId);
    scheduledJobs.delete(jobId);
  }

  const pushTitle = title || `🍞 ${stepName || 'Step'} Complete!`;
  const pushBody = body || (nextStepName ? `Time to start: ${nextStepName}` : `Bake Complete! Your sourdough is ready.`);

  // If already in the past (within 1 minute), trigger immediately
  if (delayMs <= 0) {
    const payload = {
      title: pushTitle,
      body: pushBody,
      icon: './logo.png',
      badge: './favicon.png',
      tag: `step-${stepId}`,
      stepId,
      url: './'
    };
    sendPush(subscription, payload);
    return res.json({ success: true, message: 'Step is now; sent immediately' });
  }

  // Schedule timeout
  const timeoutId = setTimeout(async () => {
    console.log(`[Push Server] Firing timer notification for completed step "${stepName}" -> Next: "${nextStepName || 'Done'}" (${jobId})`);
    const payload = {
      title: pushTitle,
      body: pushBody,
      icon: './logo.png',
      badge: './favicon.png',
      tag: `step-${stepId}`,
      stepId,
      url: './'
    };
    await sendPush(subscription, payload);
    scheduledJobs.delete(jobId);
  }, delayMs);

  scheduledJobs.set(jobId, {
    timeoutId,
    fireTimestamp,
    stepName,
    nextStepName,
    endpoint: subscription.endpoint
  });

  console.log(`[Push Server] Scheduled timer push for "${stepName}" (next: "${nextStepName || 'Done'}") in ${Math.round(delayMs / 1000)}s`);
  res.json({ success: true, message: `Scheduled in ${Math.round(delayMs / 1000)} seconds`, jobId });
});

// 5. Batch Sync Session Schedule (Cancels old jobs and sets new future timers)
app.post('/api/notifications/sync-session', (req, res) => {
  const { subscription, schedules, recipeName } = req.body;
  if (!subscription || !subscription.endpoint || !Array.isArray(schedules)) {
    return res.status(400).json({ error: 'Valid subscription and schedules array required' });
  }

  // First cancel all existing jobs for this subscription endpoint
  let cancelledCount = 0;
  for (const [jobId, job] of scheduledJobs.entries()) {
    if (job.endpoint === subscription.endpoint) {
      clearTimeout(job.timeoutId);
      scheduledJobs.delete(jobId);
      cancelledCount++;
    }
  }

  const now = Date.now();
  let scheduledCount = 0;

  for (const item of schedules) {
    const { stepId, stepName, nextStepName, fireTimestamp, title, body } = item;
    if (!stepId || !fireTimestamp) continue;

    const delayMs = fireTimestamp - now;
    // Only schedule future timer ends (allow up to 2 seconds grace)
    if (delayMs > 2000) {
      const jobId = `${subscription.endpoint}::${stepId}`;
      const pushTitle = title || `🍞 ${stepName || 'Step'} Complete!`;
      const pushBody = body || (nextStepName ? `Time to start: ${nextStepName}` : `Bake Complete! Your sourdough is ready 🎉`);

      const timeoutId = setTimeout(async () => {
        console.log(`[Push Server] Timer expired for step "${stepName}"! Pushing notification for next: "${nextStepName || 'Done'}"`);
        const payload = {
          title: pushTitle,
          body: pushBody,
          icon: './logo.png',
          badge: './favicon.png',
          tag: `step-${stepId}`,
          stepId,
          url: './'
        };
        await sendPush(subscription, payload);
        scheduledJobs.delete(jobId);
      }, delayMs);

      scheduledJobs.set(jobId, {
        timeoutId,
        fireTimestamp,
        stepName,
        nextStepName,
        endpoint: subscription.endpoint
      });
      scheduledCount++;
    }
  }

  console.log(`[Push Server] Synced session: cancelled ${cancelledCount} previous jobs, scheduled ${scheduledCount} upcoming step timer pushes.`);
  res.json({ success: true, cancelledCount, scheduledCount });
});

// 6. Cancel Scheduled Push Notifications
app.post('/api/notifications/cancel', (req, res) => {
  const { subscriptionEndpoint, stepId } = req.body;
  if (!subscriptionEndpoint) {
    return res.status(400).json({ error: 'subscriptionEndpoint required' });
  }

  let cancelledCount = 0;
  for (const [jobId, job] of scheduledJobs.entries()) {
    if (job.endpoint === subscriptionEndpoint) {
      if (!stepId || jobId.endsWith(`::${stepId}`)) {
        clearTimeout(job.timeoutId);
        scheduledJobs.delete(jobId);
        cancelledCount++;
      }
    }
  }

  res.json({ success: true, cancelledCount });
});

// 7. Health & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    activeSubscriptions: subscriptions.size,
    scheduledJobsCount: scheduledJobs.size,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Levain Web Push Server running on http://localhost:${PORT}`);
});
