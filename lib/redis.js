const { createClient } = require('redis');

const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

client.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
    try {
        await client.connect();
        console.log('Redis connected');
    } catch (err) {
        console.error('Redis connection failed:', err);
    }
})();

module.exports = {
    redisPublisher: client,
};
