// fetch-atis.js
const axios = require('axios');

const ICAO_CODES = ['KLAX', 'KSEA']; // добавь свои коды

async function fetchDatis(icao) {
  try {
    const url = `https://datis.clowd.io/api/${icao}`;
    const response = await axios.get(url, { timeout: 5000 });
    const data = response.data;

    console.log(`📦 Raw data for ${icao}:`, data);

    if (Array.isArray(data) && data.length > 0) {
      const firstEntry = data[0];
      if (firstEntry.datis && typeof firstEntry.datis === 'string' && firstEntry.datis.trim()) {
        return firstEntry.datis.trim();
      }
    }

    console.warn(`⚠️  No ATIS found in response for ICAO: ${icao}`);
    return null;
  } catch (err) {
    console.error(`❌ Error fetching ATIS for ${icao}:`, err.message);
    return null;
  }
}

async function updateAtis() {
  for (const icao of ICAO_CODES) {
    const atis = await fetchDatis(icao);
    if (atis) {
      console.log(`✅ ATIS for ${icao}:\n${atis}\n`);
      // здесь можно сохранить в БД, файл или использовать дальше
    } else {
      console.log(`ℹ️ No ATIS data available for ${icao}`);
    }
  }
  console.log('🏁 D-ATIS update complete');
}

updateAtis();
