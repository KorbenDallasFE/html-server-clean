// demo-data.js
const pool = require('./db');

async function insertDemoData() {
  try {
    // 🔹 Добавим обычные города
    await pool.query(`
      INSERT INTO cities (name, country)
      VALUES 
        ('Tbilisi', 'Georgia'),
        ('Yerevan', 'Armenia'),
        ('Baku', 'Azerbaijan')
      ON CONFLICT DO NOTHING;
    `);

    // 🔹 Добавим погодные записи для городов (без ATIS)
    await pool.query(`
      INSERT INTO weather_reports (city_id, temperature, wind)
      VALUES 
        (1, 21.5, '310° 3.1 m/s'),
        (2, 24.0, '280° 5.2 m/s'),
        (3, 28.7, '120° 4.0 m/s');
    `);

    // 🔹 Добавим аэропорты c ICAO-кодами и ATIS-текстами (фиктивные)
    const airports = [
      {
        icao: 'KLAX', // Los Angeles
        atis: 'KLAX ATIS Information Alpha. Wind 270 at 5. Visibility 10. Clear skies...',
        country: 'USA',
      },
      {
        icao: 'KSEA', // Seattle
        atis: 'KSEA ATIS Information Bravo. Wind 250 at 4. Few clouds...',
        country: 'USA',
      },
    ];

    for (const { icao, atis, country } of airports) {
      // 🏙️ Сохраняем аэропорт как "город"
      await pool.query(`
        INSERT INTO cities (name, country)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
      `, [icao, country]);

      // 🔍 Находим ID этого "города"
      const result = await pool.query(
          `SELECT id FROM cities WHERE name = $1`,
          [icao]
      );
      const cityId = result.rows[0]?.id;
      if (!cityId) continue;

      // ☁️ Сохраняем ATIS-погодную запись
      await pool.query(`
        INSERT INTO weather_reports (city_id, temperature, wind, created_at, icao_code, atis_raw)
        VALUES ($1, null, null, NOW(), $2, $3);
      `, [cityId, icao, atis]);
    }

    console.log('✅ Demo data inserted (с городами и ATIS)');
  } catch (err) {
    console.error('❌ Error inserting demo data:', err);
  } finally {
    await pool.end();
  }
}

insertDemoData();
