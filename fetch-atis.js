// fetch-atis.js
const axios=require('axios'), pool=require('./db');
(async()=>{
  const {data:arr}=await axios.get('https://datis.clowd.io/api/all');
  for(const {airport,datis} of arr){
    await pool.query(
        `INSERT INTO weather_reports(icao_code,atis_raw)
       VALUES($1,$2)
       ON CONFLICT(icao_code) DO UPDATE SET atis_raw=EXCLUDED.atis_raw,created_at=NOW()`
        ,[airport,datis]);
  }
  process.exit();
})();