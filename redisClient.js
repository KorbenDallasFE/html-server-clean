// redisClient.js
const { createClient } = require('redis');

const CHANNEL = 'chat_channel';

// 🧠 Основной клиент
const redis = createClient({ url: process.env.REDIS_URL });
// 🔁 Publisher и Subscriber
const redisPublisher = redis.duplicate();
const redisSubscriber = redis.duplicate();

// ⚠️ Обработка ошибок
[redis, redisPublisher, redisSubscriber].forEach((client, i) => {
    client.on('error', (err) =>
        console.error(`❌ Redis Client [${i}] Error:`, err)
    );
});

// 🔌 Инициализация всех клиентов
const initRedis = async () => {
    await redis.connect();
    await redisPublisher.connect();
    await redisSubscriber.connect();

    // 📡 Подписка на канал
    await redisSubscriber.subscribe(CHANNEL, (message) => {
        console.log(`📥 Message received on ${CHANNEL}: ${message}`);
        // Можно подключить WebSocket, SSE и т.п.
    });

    console.log('✅ Redis clients connected & subscribed');
};

module.exports = {
    redis,
    redisPublisher,
    initRedis,
};
