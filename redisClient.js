// redisClient.js
const { createClient } = require('redis');

const CHANNEL = 'chat_channel';

const client = createClient({
    url: process.env.REDIS_URL, // 🔐 Не хардкодим, берём из переменной окружения
});

client.on('error', (err) => console.error('❌ Redis Client Error:', err));

// ⏳ Подключаем основной клиент и на лету создаём Pub/Sub клиентов
const redis = (async () => {
    try {
        await client.connect();
        console.log('✅ Redis connected');

        // Подписка (subscriber) — отдельный клиент
        const redisSubscriber = client.duplicate();
        await redisSubscriber.connect();

        // Подписываемся на канал
        await redisSubscriber.subscribe(CHANNEL, (message) => {
            console.log(`📥 Message received on ${CHANNEL}: ${message}`);
            // 🔧 Можно расширить под WS, SSE и т.п.
        });

        return {
            redisPublisher: client,
            redisSubscriber,
        };
    } catch (err) {
        console.error('🚨 Redis connection/setup failed:', err);
        return null;
    }
})();

module.exports = redis;
