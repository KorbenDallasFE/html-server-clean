// ---------------------- imports & setup ----------------------
const express      = require('express');
const cookieParser = require('cookie-parser');     // 🍪
const {
  redis,
  redisSubscriber,
  redisPublisher
} = require('./redisClient');                      // 🧠

const app  = express();
const PORT = process.env.PORT || 3000;

// ---------------------- middleware ---------------------------
app.use(express.json());           // для JSON-body
app.use(cookieParser());           // для cookies
app.use(express.static('public')); // отдача файлов из /public

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
    await redis.set('ping', 'pong', 'EX', 5);       // TTL = 5 сек
    const value = await redis.get('ping');
    res.send(`Redis says: ${value}`);
  } catch (err) {
    console.error('❌ Redis error:', err);
    res.status(500).send('Redis error');
  }
});

// ------------------------ Pub/Sub ----------------------------
const CHANNEL = 'chat_channel';

// 📡 Подписка на канал
redisSubscriber.subscribe(CHANNEL, (err, count) => {
  if (err) {
    console.error('❌ Redis subscribe error:', err);
  } else {
    console.log(`📡 Subscribed to ${count} channel(s): ${CHANNEL}`);
  }
});

// 📥 Получение сообщений из канала
redisSubscriber.on('message', (channel, message) => {
  console.log(`🗨️  PubSub message on [${channel}]: ${message}`);
  // Здесь можно подключить WebSocket, SSE и т.д.
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

// --------------------- listen server -------------------------
app.listen(PORT, '0.0.0.0', () =>
    console.log(`🚀 Server listening on http://localhost:${PORT}`)
);
