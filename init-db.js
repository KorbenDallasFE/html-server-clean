// init-db.js
/** @type {import('pg').Pool} */
const pool = require('./db'); // импортируем pool, а не { client }

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cities (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      country TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS weather_reports (
      id SERIAL PRIMARY KEY,
      city_id INTEGER REFERENCES cities(id),
      temperature DECIMAL,
      wind TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log('✅ Tables created successfully.');
}

initDB().catch((err) => {
  console.error('❌ Error initializing DB:', err);
});
