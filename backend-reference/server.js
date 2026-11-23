require('dotenv').config();

const express = require('express');
const webpush = require('web-push');
const fs = require('node:fs');
const path = require('node:path');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'deadlineguard.json');

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function loadDatabase() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      return {
        subscriptions: parsed.subscriptions || {},
        tasks: parsed.tasks || {},
        delivered: parsed.delivered || {}
      };
    }
  } catch (error) {
    console.error('Database file tidak dapat dibaca:', error.message);
  }
  return { subscriptions: {}, tasks: {}, delivered: {} };
}

let database = loadDatabase();

function saveDatabase() {
  const tempFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(database, null, 2));
  fs.renameSync(tempFile, DATA_FILE);
}

const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';
let pushConfigured = false;

if (vapidPublicKey && vapidPrivateKey) {
  try {
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
    pushConfigured = true;
  } catch (error) {
    console.error('Kunci VAPID tidak valid:', error.message);
  }
}

function isValidInstallationId(value) {
  return typeof value === 'string' && /^[A-Za-z0-9._-]{10,120}$/.test(value);
}

function validSubscription(value) {
  return value && typeof value.endpoint === 'string' &&
    value.endpoint.startsWith('https://') &&
    value.keys && typeof value.keys.p256dh === 'string' &&
    typeof value.keys.auth === 'string';
}

app.get('/api/config', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ vapidPublicKey: pushConfigured ? vapidPublicKey : null });
});

app.post('/api/push/subscribe', (req, res) => {
  if (!pushConfigured) return res.status(503).json({ error: 'Server push belum dikonfigurasi.' });

  const { installationId, subscription } = req.body || {};
  if (!isValidInstallationId(installationId) || !validSubscription(subscription)) {
    return res.status(400).json({ error: 'Data langganan push tidak valid.' });
  }

  const current = database.subscriptions[installationId] || [];
  const filtered = current.filter((item) => item.endpoint !== subscription.endpoint);
  filtered.push(subscription);
  database.subscriptions[installationId] = filtered.slice(-5);
  saveDatabase();

  res.status(201).json({ ok: true });
});

app.post('/api/tasks/sync', async (req, res) => {
  const { installationId, tasks } = req.body || {};
  if (!isValidInstallationId(installationId) || !Array.isArray(tasks)) {
    return res.status(400).json({ error: 'Data sinkronisasi tidak valid.' });
  }
  if (tasks.length > 500) {
    return res.status(413).json({ error: 'Maksimal 500 tugas per perangkat.' });
  }

  database.tasks[installationId] = tasks
    .filter((task) => task && typeof task.id === 'string' &&
      typeof task.title === 'string' && typeof task.deadline === 'string')
    .map((task) => ({
      id: task.id.slice(0, 160),
      title: task.title.slice(0, 300),
      course: String(task.course || '').slice(0, 200),
      deadline: task.deadline,
      status: task.status === 'Selesai' ? 'Selesai' : 'Aktif',
      notified: Boolean(task.notified)
    }));

  saveDatabase();
  await processDueTasks(installationId);

  const deliveredKeys = Object.keys(database.delivered[installationId] || {});
  res.json({ ok: true, deliveredKeys });
});

async function processDueTasks(onlyInstallationId) {
  if (!pushConfigured || processingPush) return;
  processingPush = true;

  try {
    const installationIds = onlyInstallationId
      ? [onlyInstallationId]
      : Object.keys(database.tasks);

    for (const installationId of installationIds) {
      const subscriptions = database.subscriptions[installationId] || [];
      const tasks = database.tasks[installationId] || [];
      if (!subscriptions.length || !tasks.length) continue;

      database.delivered[installationId] ||= {};

      for (const task of tasks) {
        if (task.status === 'Selesai' || task.notified) continue;
        const deadlineMs = new Date(task.deadline).getTime();
        if (!Number.isFinite(deadlineMs)) continue;

        const key = `${task.id}:${task.deadline}`;
        if (database.delivered[installationId][key]) continue;

        const hoursRemaining = (deadlineMs - Date.now()) / 3600000;
        if (hoursRemaining >= 24) continue;

        const overdue = hoursRemaining <= 0;
        const payload = JSON.stringify({
          title: overdue ? 'DeadlineGuard: Tenggat Terlewat' : 'DeadlineGuard: Tugas Mendesak',
          body: overdue
            ? `Tugas "${task.title}" (${task.course}) sudah melewati tenggat.`
            : `Tugas "${task.title}" (${task.course}) tersisa kurang dari 24 jam.`,
          tag: `deadlineguard-${task.id}-${deadlineMs}`,
          url: './'
        });

        let delivered = false;
        const activeSubscriptions = [];

        for (const subscription of subscriptions) {
          try {
            await webpush.sendNotification(subscription, payload, {
              TTL: 60 * 60,
              urgency: 'high'
            });
            activeSubscriptions.push(subscription);
            delivered = true;
          } catch (error) {
            if (error.statusCode !== 404 && error.statusCode !== 410) {
              activeSubscriptions.push(subscription);
              console.error('Pengiriman push gagal:', error.statusCode || '', error.message);
            }
          }
        }

        database.subscriptions[installationId] = activeSubscriptions;
        if (delivered) {
          database.delivered[installationId][key] = Date.now();
          saveDatabase();
        }
      }
    }
  } finally {
    processingPush = false;
  }
}

let processingPush = false;
setInterval(() => {
  processDueTasks().catch((error) => console.error('Pemeriksaan jadwal push gagal:', error));
}, 30 * 1000);

// Serve the PWA from the same origin as its API and Service Worker.
app.use(express.static(PUBLIC_DIR, {
  etag: true,
  maxAge: '1h',
  setHeaders(res, filePath) {
    if (filePath.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Service-Worker-Allowed', '/');
    }
    if (filePath.endsWith('manifest.json')) {
      res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    }
  }
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`DeadlineGuard berjalan di http://localhost:${PORT}`);
  if (!pushConfigured) {
    console.log('INFO: Push belum aktif. Buat kunci VAPID dan isi file .env untuk mengaktifkannya.');
  }
});
