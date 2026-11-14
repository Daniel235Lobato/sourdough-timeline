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
      TTL: 600 // 10 minutes max — never deliver stale baking timers the next day
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

const QSTASH_REGIONS = [
  'https://qstash.upstash.io',
  'https://qstash-us-east-1.upstash.io',
  'https://qstash-us-central1.upstash.io',
  'https://qstash-eu-west-1.upstash.io',
  'https://qstash-ap-southeast-1.upstash.io'
];

let workingQStashBase = process.env.QSTASH_URL ? process.env.QSTASH_URL.replace(/\/v2\/publish\/?$/, '').replace(/\/$/, '') : null;

async function postToQStash(endpointBase, targetUrl, delaySeconds, body, token, deduplicationId) {
  const qstashUrl = `${endpointBase}/v2/publish/${targetUrl}`;
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Upstash-Delay': `${delaySeconds}s`,
    'Upstash-Retries': '1'
  };
  if (deduplicationId) {
    headers['Upstash-Deduplication-Id'] = String(deduplicationId).replace(/[^a-zA-Z0-9_-]/g, '_');
  }
  return await fetch(qstashUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
}

// Helper to schedule delayed webhook on serverless environments via Upstash QStash (with multi-region failover and deduplication)
async function scheduleWithQStash(targetUrl, delaySeconds, body, deduplicationId) {
  if (!QSTASH_TOKEN) {
    console.warn('[Push Server] ⚠️ QSTASH_TOKEN is not defined in environment variables');
    return { success: false };
  }
  const token = QSTASH_TOKEN.replace(/^Bearer\s+/i, '').trim();

  const candidateBases = workingQStashBase 
    ? [workingQStashBase, ...QSTASH_REGIONS.filter(r => r !== workingQStashBase)]
    : QSTASH_REGIONS;

  for (const base of candidateBases) {
    try {
      const res = await postToQStash(base, targetUrl, delaySeconds, body, token, deduplicationId);
      if (res.ok) {
        workingQStashBase = base;
        const data = await res.json();
        console.log(`[Push Server] ✓ QStash (${base}) accepted message! ID: ${data.messageId} for delay ${delaySeconds}s -> ${targetUrl} (Dedup: ${deduplicationId || 'none'})`);
        return { success: true, messageId: data.messageId, base };
      }
      const errText = await res.text();
      if (res.status === 404 && errText.includes('not found in this region')) {
        console.warn(`[Push Server] QStash region mismatch on ${base}, trying next region...`);
        continue;
      }
      console.error(`[Push Server] ✗ QStash API returned HTTP ${res.status} from ${base}:`, errText);
      return { success: false };
    } catch (e) {
      console.error(`[Push Server] ✗ QStash fetch exception on ${base}:`, e);
    }
  }
  return { success: false };
}

// Helper to cancel/delete a scheduled message from QStash cloud queue across regions
async function deleteQStashMessage(entry) {
  if (!QSTASH_TOKEN || !entry) return false;
  const messageId = typeof entry === 'string' ? entry : entry.messageId;
  const preferredBase = typeof entry === 'object' && entry.base ? entry.base : null;
  if (!messageId) return false;

  const token = QSTASH_TOKEN.replace(/^Bearer\s+/i, '').trim();
  const basesToTry = preferredBase
    ? [preferredBase]
    : workingQStashBase
      ? [workingQStashBase, ...QSTASH_REGIONS.filter(r => r !== workingQStashBase)]
      : QSTASH_REGIONS;

  for (const base of basesToTry) {
    try {
      const res = await fetch(`${base}/v2/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        workingQStashBase = base;
        console.log(`[Push Server] 🗑️ QStash cancelled message (${messageId}) on ${base}: HTTP ${res.status}`);
        return true;
      }
      if (res.status === 404) {
        // Might be in another region or already fired/deleted; keep trying if no preferredBase
        continue;
      }
      console.warn(`[Push Server] QStash DELETE (${messageId}) on ${base} returned HTTP ${res.status}`);
    } catch (e) {
      console.warn(`[Push Server] Error deleting QStash message on ${base}:`, e);
    }
  }
  return false;
}

// 2b. QStash Diagnostics & Test
router.get('/test-qstash', async (req, res) => {
  if (!QSTASH_TOKEN) {
    return res.status(400).json({ error: 'QSTASH_TOKEN is missing in Vercel environment variables' });
  }
  const token = QSTASH_TOKEN.replace(/^Bearer\s+/i, '').trim();
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const proto = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
  const targetUrl = `${proto}://${host}/api/notifications/trigger`;

  const candidateBases = workingQStashBase 
    ? [workingQStashBase, ...QSTASH_REGIONS.filter(r => r !== workingQStashBase)]
    : QSTASH_REGIONS;

  for (const base of candidateBases) {
    try {
      const qstashRes = await postToQStash(base, targetUrl, 10, { test: true, timestamp: Date.now() }, token);
      const status = qstashRes.status;
      const body = await qstashRes.text();
      if (qstashRes.ok) {
        workingQStashBase = base;
        let parsed = body;
        try { parsed = JSON.parse(body); } catch {}
        return res.json({ success: true, region: base, status, result: parsed, targetUrl });
      }
      if (status === 404 && body.includes('not found in this region')) {
        continue;
      }
      return res.json({ success: false, region: base, status, body, targetUrl });
    } catch (err) {
      return res.status(500).json({ error: err.message, region: base });
    }
  }

  return res.status(500).json({ error: 'Could not connect to QStash in any region' });
});

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

const MAX_LATE_TRIGGER_MS = 10 * 60 * 1000; // Drop any delayed/retried timer notification >10 min late

function buildTimerReminderPayload({ stepId, stepName, nextStepName, title, body, fireTimestamp }) {
  const pushTitle = title || (
    nextStepName
      ? `⏱️ Time for: ${nextStepName}`
      : `🍞 Bake Timer Complete!`
  );
  const pushBody = body || (
    nextStepName
      ? `${stepName || 'Current step'} timer finished · Tap to start ${nextStepName}`
      : `${stepName || 'Baking'} timer finished · Your sourdough is ready!`
  );

  return {
    title: pushTitle,
    body: pushBody,
    icon: './logo.png',
    badge: './favicon.png',
    tag: 'levain-timer-reminder',
    stepId,
    fireTimestamp,
    url: './'
  };
}

// 3b. Trigger Direct Push (called by QStash or external scheduler webhook)
router.post('/trigger', async (req, res) => {
  // Handle test ping from diagnostic tool
  if (req.body && req.body.test) {
    console.log('[Push Server] /trigger received QStash test ping! Responding HTTP 200 OK.');
    return res.json({ success: true, message: 'QStash test webhook received and acknowledged successfully' });
  }

  const { subscription, payload, title, body, stepId, stepName, nextStepName, fireTimestamp } = req.body || {};
  if (!subscription) {
    console.warn('[Push Server] /trigger called without subscription. Responding 200 to acknowledge webhook.');
    return res.json({ success: false, error: 'No subscription payload in webhook' });
  }

  const targetFireTs = fireTimestamp || payload?.fireTimestamp;
  if (typeof targetFireTs === 'number' && Date.now() - targetFireTs > MAX_LATE_TRIGGER_MS) {
    console.warn(`[Push Server] ⏭️ Dropping stale timer notification (${Math.round((Date.now() - targetFireTs) / 60000)}m late) for step "${stepId || payload?.stepId || 'unknown'}"`);
    return res.json({ success: false, dropped: true, reason: 'Stale timer notification expired' });
  }

  const pushPayload = payload || buildTimerReminderPayload({
    stepId,
    stepName,
    nextStepName,
    title,
    body,
    fireTimestamp: targetFireTs
  });

  console.log(`[Push Server] /trigger received webhook! Sending push: "${pushPayload.title}"`);
  const result = await sendPush(subscription, pushPayload);
  res.json(result);
});

// 4. Schedule Single Timer Push Notification
router.post('/schedule', async (req, res) => {
  const { subscription, stepId, stepName, nextStepName, fireTimestamp, body, title } = req.body;
  if (!subscription || !stepId || !fireTimestamp) {
    return res.status(400).json({ error: 'Missing required schedule parameters' });
  }

  const now = Date.now();
  const delayMs = fireTimestamp - now;
  const delaySeconds = Math.max(1, Math.round(delayMs / 1000));
  const jobId = `${subscription.endpoint}::${stepId}`;

  // Clear existing job for this step if any
  if (scheduledJobs.has(jobId)) {
    const existingJob = scheduledJobs.get(jobId);
    if (existingJob.timeoutId) clearTimeout(existingJob.timeoutId);
    if (existingJob.qstashMessage) await deleteQStashMessage(existingJob.qstashMessage);
    scheduledJobs.delete(jobId);
  }

  const payload = buildTimerReminderPayload({
    stepId,
    stepName,
    nextStepName,
    title,
    body,
    fireTimestamp
  });

  // If already in the past (within grace window), trigger immediately; if >10m old, drop
  if (delayMs <= 0) {
    if (Math.abs(delayMs) <= MAX_LATE_TRIGGER_MS) {
      sendPush(subscription, payload);
      return res.json({ success: true, message: 'Step is now; sent immediately' });
    }
    return res.json({ success: false, dropped: true, message: 'Step timer already expired' });
  }

  // Determine host for QStash webhook callback
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const proto = req.headers['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
  const triggerUrl = `${proto}://${host}/api/notifications/trigger`;

  let usedQStash = false;
  let qstashMessage = null;
  if (QSTASH_TOKEN && delaySeconds > 2) {
    const dedupId = `step_${stepId}_${Math.round(fireTimestamp / 1000)}`;
    const qstashRes = await scheduleWithQStash(triggerUrl, delaySeconds, { subscription, payload, fireTimestamp }, dedupId);
    if (qstashRes.success) {
      usedQStash = true;
      qstashMessage = { messageId: qstashRes.messageId, base: qstashRes.base };
    }
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
      endpoint: subscription.endpoint,
      qstashMessage
    });
  } else {
    scheduledJobs.set(jobId, {
      fireTimestamp,
      stepName,
      nextStepName,
      endpoint: subscription.endpoint,
      qstashMessage
    });
  }

  console.log(`[Push Server] Scheduled timer push for "${stepName}" (next: "${nextStepName || 'Done'}") in ${delaySeconds}s (QStash: ${usedQStash})`);
  res.json({ success: true, message: `Scheduled in ${delaySeconds} seconds`, jobId, usedQStash, qstashMessage });
});

// 5. Batch Sync Session Schedule (Cancels old jobs and sets new future timers)
router.post('/sync-session', async (req, res) => {
  const { subscription, schedules, messageIds, scheduledMessages } = req.body;
  if (!subscription || !subscription.endpoint || !Array.isArray(schedules)) {
    return res.status(400).json({ error: 'Valid subscription and schedules array required' });
  }

  // First cancel all existing in-memory jobs for this subscription endpoint
  let cancelledCount = 0;
  for (const [jobId, job] of scheduledJobs.entries()) {
    if (job.endpoint === subscription.endpoint) {
      if (job.timeoutId) clearTimeout(job.timeoutId);
      if (job.qstashMessage || job.qstashMessageId) {
        await deleteQStashMessage(job.qstashMessage || job.qstashMessageId);
      }
      scheduledJobs.delete(jobId);
      cancelledCount++;
    }
  }

  // Delete any explicit scheduledMessages ({ messageId, base }) or legacy messageIds passed from client
  const toCancel = [
    ...(Array.isArray(scheduledMessages) ? scheduledMessages : []),
    ...(Array.isArray(messageIds) ? messageIds : [])
  ];
  const seenCancelIds = new Set();
  for (const entry of toCancel) {
    const id = typeof entry === 'string' ? entry : entry?.messageId;
    if (id && !seenCancelIds.has(id)) {
      seenCancelIds.add(id);
      await deleteQStashMessage(entry);
    }
  }

  const now = Date.now();
  let scheduledCount = 0;
  let qstashCount = 0;
  const returnedMessageIds = [];
  const returnedScheduledMessages = [];

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
      const payload = buildTimerReminderPayload({
        stepId,
        stepName,
        nextStepName,
        title,
        body,
        fireTimestamp
      });

      let qstashMessage = null;
      let usedQStash = false;
      if (QSTASH_TOKEN && delaySeconds > 2) {
        const dedupId = `step_${stepId}_${Math.round(fireTimestamp / 1000)}`;
        const qstashRes = await scheduleWithQStash(triggerUrl, delaySeconds, { subscription, payload, fireTimestamp }, dedupId);
        if (qstashRes.success) {
          usedQStash = true;
          qstashCount++;
          qstashMessage = { messageId: qstashRes.messageId, base: qstashRes.base };
          if (qstashRes.messageId) {
            returnedMessageIds.push(qstashRes.messageId);
            returnedScheduledMessages.push(qstashMessage);
          }
        }
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
          endpoint: subscription.endpoint,
          qstashMessage
        });
      } else {
        scheduledJobs.set(jobId, {
          fireTimestamp,
          stepName,
          nextStepName,
          endpoint: subscription.endpoint,
          qstashMessage
        });
      }
      scheduledCount++;
    }
  }

  console.log(`[Push Server] Synced session: cancelled ${cancelledCount} previous jobs, scheduled ${scheduledCount} upcoming step timer pushes (QStash: ${qstashCount}).`);
  res.json({
    success: true,
    cancelledCount,
    scheduledCount,
    qstashCount,
    messageIds: returnedMessageIds,
    scheduledMessages: returnedScheduledMessages
  });
});

// 6. Cancel Scheduled Push Notifications
router.post('/cancel', async (req, res) => {
  const { subscriptionEndpoint, stepId, messageIds, scheduledMessages } = req.body;
  if (!subscriptionEndpoint) {
    return res.status(400).json({ error: 'subscriptionEndpoint required' });
  }

  let cancelledCount = 0;
  for (const [jobId, job] of scheduledJobs.entries()) {
    if (job.endpoint === subscriptionEndpoint) {
      if (!stepId || jobId.endsWith(`::${stepId}`)) {
        if (job.timeoutId) clearTimeout(job.timeoutId);
        if (job.qstashMessage || job.qstashMessageId) {
          await deleteQStashMessage(job.qstashMessage || job.qstashMessageId);
        }
        scheduledJobs.delete(jobId);
        cancelledCount++;
      }
    }
  }

  const toCancel = [
    ...(Array.isArray(scheduledMessages) ? scheduledMessages : []),
    ...(Array.isArray(messageIds) ? messageIds : [])
  ];
  const seenCancelIds = new Set();
  for (const entry of toCancel) {
    const id = typeof entry === 'string' ? entry : entry?.messageId;
    if (id && !seenCancelIds.has(id)) {
      seenCancelIds.add(id);
      await deleteQStashMessage(entry);
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
