// server.js
const express      = require('express');
const cookieParser = require('cookie-parser');
const {
  redis,
  redisPublisher,
  redisSubscriber,
  initRedis,
} = require('./redisClient');

const app  = express();
const PORT = process.env.PORT || 3000;

// ⏳ Сначала подключаемся к Redis, потом стартуем сервер
(async () => {
  try {
    await initRedis();               // ← ждём, пока Redis готов

    // ── middleware ──
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.static('public'));

    // cookie-helper
    app.use((req, res, next) => {
      if (!req.cookies.sessionId) {
        const id = Math.floor(Math.random() * 100_000);
        res.cookie('sessionId', id, { httpOnly: true });
        console.log('🔑 New sessionId:', id);
      }
      next();
    });

    // test
    app.get('/test', (req, res) => res.send('OK'));

    // health-check
    app.get('/ping-redis', async (_req, res) => {
      try {
        await redis.set('ping', 'pong', { EX: 5 });
        res.send(`Redis says: ${await redis.get('ping')}`);
      } catch (e) {
        console.error('Redis error:', e);
        res.status(500).send('Redis error');
      }
    });

    // publish API
    app.post('/api/publish', async (req, res) => {
      const { channel, message } = req.body || {};
      if (!channel || !message) return res.status(400).send('channel and message required');
      await redisPublisher.publish(channel, message);
      res.send(`📤 Published to ${channel}`);
    });

    // ── стартуем Express ──
    app.listen(PORT, '0.0.0.0', () =>
        console.log(`🚀 Server listening on http://localhost:${PORT}`)
    );

  } catch (err) {
    console.error('❌ Failed to start app:', err);
    process.exit(1);
  }
})();
