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
    const options = {
      urgency: 'high',
      topic: 'sourdough-timer',
      TTL: 86400 // 24 hours
    };
    const response = await webpush.sendNotification(subscription, JSON.stringify(payload), options);
    console.log(`[Push Server] ✓ Push delivered successfully (HTTP ${response.statusCode}) to ${subscription.endpoint.slice(0, 45)}...`);
    return { success: true, statusCode: response.statusCode };
  } catch (error) {
    console.error(`[Push Server] ✗ WebPush delivery error (HTTP ${error.statusCode}):`, error.message);
    // If subscription is 404 or 410 Gone, remove it
    if (error.statusCode === 404 || error.statusCode === 410) {
      subscriptions.delete(subscription.endpoint);
    }
    return { success: false, error: error.message, statusCode: error.statusCode };
  }
}

const router = express.Router();

// 1. Get Public VAPID Key
router.get('/vapid-public-key', (req, res) => {
  res.json({ publicKey: VAPID_PUBLIC_KEY });
});

// 2. Register/Save Push Subscription
router.post('/subscribe', (req, res) => {
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

const QSTASH_TOKEN = process.env.QSTASH_TOKEN || process.env.UPSTASH_QSTASH_TOKEN;

// Helper to schedule delayed webhook on serverless environments via Upstash QStash
async function scheduleWithQStash(targetUrl, delaySeconds, body) {
  if (!QSTASH_TOKEN) return false;
  try {
    const qstashUrl = `https://qstash.upstash.io/v2/publish/${encodeURI(targetUrl)}`;
    const res = await fetch(qstashUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${QSTASH_TOKEN}`,
        'Content-Type': 'application/json',
        'Upstash-Delay': `${delaySeconds}s`
      },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    console.log(`[Push Server] ✓ Scheduled QStash message (${data.messageId || 'ok'}) in ${delaySeconds}s -> ${targetUrl}`);
    return true;
  } catch (e) {
    console.error('[Push Server] ✗ QStash scheduling error:', e);
    return false;
  }
}

// 3. Test Push Notification
router.post('/test', async (req, res) => {
  const { subscription } = req.body;
  if (!subscription) {
    return res.status(400).json({ error: 'Subscription required' });
  }

  const payload = {
    title: '🍞 Levain Push Test',
    body: 'Background notifications are connected and working on your device!',
    icon: './logo.png',
    badge: './favicon.png',
    tag: 'test-notification',
    url: './'
  };

  const result = await sendPush(subscription, payload);
  if (result.success) {
    res.json({ success: true, message: 'Test notification sent successfully' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

// 3b. Trigger Direct Push (called by QStash or external scheduler webhook)
router.post('/trigger', async (req, res) => {
  const { subscription, payload, title, body, stepId, stepName } = req.body;
  if (!subscription) {
    return res.status(400).json({ error: 'Subscription required' });
  }

  const pushPayload = payload || {
    title: title || '🍞 Step Complete!',
    body: body || 'Time for your next sourdough baking step!',
    icon: './logo.png',
    badge: './favicon.png',
    tag: `step-${stepId || Date.now()}`,
    stepId,
    url: './'
  };

  console.log(`[Push Server] /trigger received webhook! Sending push: "${pushPayload.title}"`);
  const result = await sendPush(subscription, pushPayload);
  res.json(result);
});

// 4. Schedule Single Timer Push Notification
router.post('/schedule', async (req, res) => {
  const { subscription, stepId, stepName, nextStepName, fireTimestamp, recipeName, body, title } = req.body;
  if (!subscription || !stepId || !fireTimestamp) {
    return res.status(400).json({ error: 'Missing required schedule parameters' });
  }

  const now = Date.now();
  const delayMs = fireTimestamp - now;
  const delaySeconds = Math.max(1, Math.round(delayMs / 1000));
  const jobId = `${subscription.endpoint}::${stepId}`;

  // Clear existing job for this step if any
  if (scheduledJobs.has(jobId)) {
    clearTimeout(scheduledJobs.get(jobId).timeoutId);
    scheduledJobs.delete(jobId);
  }

  const pushTitle = title || `🍞 ${stepName || 'Step'} Complete!`;
  const pushBody = body || (nextStepName ? `Time to start: ${nextStepName}` : `Bake Complete! Your sourdough is ready.`);

  const payload = {
    title: pushTitle,
    body: pushBody,
    icon: './logo.png',
    badge: './favicon.png',
    tag: `step-${stepId}`,
    stepId,
    url: './'
  };

  // If already in the past, trigger immediately
  if (delayMs <= 0) {
    sendPush(subscription, payload);
    return res.json({ success: true, message: 'Step is now; sent immediately' });
  }

  // Determine host for QStash webhook callback
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const proto = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
  const triggerUrl = `${proto}://${host}/api/notifications/trigger`;

  let usedQStash = false;
  if (QSTASH_TOKEN && delaySeconds > 2) {
    usedQStash = await scheduleWithQStash(triggerUrl, delaySeconds, { subscription, payload });
  }

  if (!usedQStash) {
    // Persistent In-Memory Timer fallback (for 24/7 Node.js servers e.g. Render / Railway / local)
    const timeoutId = setTimeout(async () => {
      console.log(`[Push Server] Firing timer notification for completed step "${stepName}" -> Next: "${nextStepName || 'Done'}" (${jobId})`);
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
  }

  console.log(`[Push Server] Scheduled timer push for "${stepName}" (next: "${nextStepName || 'Done'}") in ${delaySeconds}s (QStash: ${usedQStash})`);
  res.json({ success: true, message: `Scheduled in ${delaySeconds} seconds`, jobId, usedQStash });
});

// 5. Batch Sync Session Schedule (Cancels old jobs and sets new future timers)
router.post('/sync-session', async (req, res) => {
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
  let qstashCount = 0;

  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const proto = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
  const triggerUrl = `${proto}://${host}/api/notifications/trigger`;

  for (const item of schedules) {
    const { stepId, stepName, nextStepName, fireTimestamp, title, body } = item;
    if (!stepId || !fireTimestamp) continue;

    const delayMs = fireTimestamp - now;
    const delaySeconds = Math.round(delayMs / 1000);

    // Only schedule future timer ends (allow up to 2 seconds grace)
    if (delayMs > 2000) {
      const jobId = `${subscription.endpoint}::${stepId}`;
      const pushTitle = title || `🍞 ${stepName || 'Step'} Complete!`;
      const pushBody = body || (nextStepName ? `Time to start: ${nextStepName}` : `Bake Complete! Your sourdough is ready 🎉`);

      const payload = {
        title: pushTitle,
        body: pushBody,
        icon: './logo.png',
        badge: './favicon.png',
        tag: `step-${stepId}`,
        stepId,
        url: './'
      };

      let usedQStash = false;
      if (QSTASH_TOKEN && delaySeconds > 2) {
        usedQStash = await scheduleWithQStash(triggerUrl, delaySeconds, { subscription, payload });
        if (usedQStash) qstashCount++;
      }

      if (!usedQStash) {
        const timeoutId = setTimeout(async () => {
          console.log(`[Push Server] Timer expired for step "${stepName}"! Pushing notification for next: "${nextStepName || 'Done'}"`);
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
      }
      scheduledCount++;
    }
  }

  console.log(`[Push Server] Synced session: cancelled ${cancelledCount} previous jobs, scheduled ${scheduledCount} upcoming step timer pushes (QStash: ${qstashCount}).`);
  res.json({ success: true, cancelledCount, scheduledCount, qstashCount });
});

// 6. Cancel Scheduled Push Notifications
router.post('/cancel', (req, res) => {
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
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    activeSubscriptions: subscriptions.size,
    scheduledJobsCount: scheduledJobs.size,
    timestamp: new Date().toISOString()
  });
});

// Mount Router on all common path variations for fullstack and serverless
app.use('/api/notifications', router);
app.use('/notifications', router);
app.use('/api', router);
app.use('/', router);

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Levain Web Push Server running on http://localhost:${PORT}`);
  });
}

export default app;
