// redisClient.js
const Redis = require('ioredis');

// 🧠 Основной клиент Redis
const redis = new Redis({
    host: 'redis',
    port: 6379,
});

// 🔁 Pub/Sub клиенты
const redisSubscriber = new Redis({ host: 'redis' });
const redisPublisher  = new Redis({ host: 'redis' });

const CHANNEL = 'chat_channel';

// 📩 Подписка
redisSubscriber.subscribe(CHANNEL, (err, count) => {
    if (err) {
        console.error('Redis subscribe error:', err);
    } else {
        console.log(`📡 Subscribed to ${count} channel(s)`);
    }
});

// 🧠 Обработка входящих сообщений
redisSubscriber.on('message', (channel, message) => {
    console.log(`📥 Message received on ${channel}: ${message}`);
    // Здесь можно уведомлять клиентов (SSE, WS и т.п.)
});

module.exports = {
    redis,
    redisSubscriber,
    redisPublisher,
};
