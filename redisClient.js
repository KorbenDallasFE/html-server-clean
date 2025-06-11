// redisClient.js
const { createClient } = require('redis');

const CHANNEL = 'chat_channel';

// ─── Создаём клиенты ──────────────────────────────────────────
const redis          = createClient({ url: process.env.REDIS_URL });
const redisPublisher = redis;              // тот же клиент для publish
const redisSubscriber = redis.duplicate(); // отдельный для subscribe

// ─── Универсальный init ──────────────────────────────────────
async function initRedis() {
    // подключаем оба клиента
    await redis.connect();
    await redisSubscriber.connect();

    console.log('✅ Redis connected');

    // Подписываемся на канал и логируем входящие сообщения
    await redisSubscriber.subscribe(CHANNEL, (message) => {
        console.log(`📥 Message on ${CHANNEL}: ${message}`);
        // здесь можно прокидывать WS/SSE
    });
}

module.exports = {
    redis,
    redisPublisher,
    redisSubscriber,
    initRedis,
};
