// ---------------------- env setup ----------------------------
require('dotenv').config(); // загружаем .env ПЕРЕД всем остальным

// ---------------------- imports & setup ----------------------
const express = require('express');
const cookieParser = require('cookie-parser');
const { redis, redisPublisher, initRedis } = require('./redisClient'); // 🧠 Redis
const pool = require('./db'); // 🐘 PostgreSQL pool
const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------- middleware ---------------------------
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public')); // статика (index.html, css и т.д.)

// ------------------ sessionId cookie helper ------------------
app.use((req, res, next) => {
  if (!req.cookies.sessionId) {
    const randomId = Math.floor(Math.random() * 100_000);
    res.cookie('sessionId', randomId, { httpOnly: true });
    console.log('🔑 Set new sessionId:', randomId);
  } else {
    console.log('🔑 Existing sessionId:', req.cookies.sessionId);
  }
  next();
});

// ------------------------ test route -------------------------
app.get('/test', (req, res) => {
  console.log('🧪 Route /test hit with cookie:', req.cookies.sessionId);
  res.send('OK');
});

// ------------- health-check route for Redis ------------------
app.get('/ping-redis', async (req, res) => {
  try {
    await redis.set('ping', 'pong', { EX: 5 }); // ⏱ TTL 5 сек
    const value = await redis.get('ping');
    res.send(`Redis says: ${value}`);
  } catch (err) {
    console.error('❌ Redis error:', err);
    res.status(500).send('Redis error');
  }
});

// 📨 Публикация сообщения через API
app.post('/api/publish', async (req, res) => {
  const { channel, message } = req.body;
  if (!channel || !message) {
    return res.status(400).send('channel and message required');
  }

  await redisPublisher.publish(channel, message);
  res.send(`📤 Published to ${channel}`);
});

// ------------------- ATIS lookup route -----------------------
app.get('/atis/:icao', async (req, res) => {
  const icao = req.params.icao.toUpperCase(); // Приводим к верхнему регистру
  try {
    const { rows } = await pool.query(
        `SELECT atis_raw 
       FROM weather_reports 
       WHERE icao_code = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
        [icao]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No ATIS data found' });
    }

    res.json({ atis_raw: rows[0].atis_raw });
  } catch (err) {
    console.error('❌ DB error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --------------------- start server --------------------------
initRedis().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('🚫 Failed to init Redis:', err);
});
