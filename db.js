// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'postgres', // или 'localhost' вне Docker
  database: 'maindb',
  password: 'pass',
  port: 5432,
});

module.exports = pool; // экспортируем сам pool
