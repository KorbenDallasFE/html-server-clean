// db.js
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(process.env.PGPORT||'5432'),
});
pool.connect().then(()=>console.log('✅ PG connected')).catch(e=>console.error(e));
module.exports=pool;