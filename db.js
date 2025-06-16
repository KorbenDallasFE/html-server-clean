// db.js — подключение к PostgreSQL
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'user',
  host: process.env.PGHOST || 'postgres', // 'localhost' — если не в Docker
  database: process.env.PGDATABASE || 'maindb',
  password: process.env.PGPASSWORD || 'pass',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
});

pool.connect()
    .then(() => console.log('✅ PostgreSQL connected'))
    .catch((err) => console.error('❌ PostgreSQL connection error:', err));

module.exports = pool;
