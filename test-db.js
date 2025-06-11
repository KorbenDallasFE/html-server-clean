const { Pool } = require('pg');

const pool = new Pool({
  user: 'user',
  host: 'postgres',        // или 'localhost', если ты вне контейнера
  database: 'maindb',
  password: 'pass',
  port: 5432,
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected. Time:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Error connecting to PostgreSQL:', err);
  } finally {
    await pool.end();
  }
}

void testConnection(); // suppress WebStorm warning
