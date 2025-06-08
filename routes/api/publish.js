const express = require('express');
const { redisPublisher } = require('../../lib/redis');

const router = express.Router();

router.post('/', async (req, res) => {
    const { channel, message } = req.body;

    if (!channel || !message) {
        return res.status(400).json({ error: 'Missing channel or message' });
    }

    try {
        await redisPublisher.publish(channel, message);
        res.json({ status: 'ok', channel, message });
    } catch (err) {
        console.error('Failed to publish message:', err);
        res.status(500).json({ error: 'Failed to publish message' });
    }
});

module.exports = router;
