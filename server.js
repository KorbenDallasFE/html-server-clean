// server.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { redis, initRedis } = require('./redisClient');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// sessionId cookie
app.use((req, res, next) => {
  if (!req.cookies.sessionId) {
    const id = Math.floor(Math.random()*100000);
    res.cookie('sessionId', id, { httpOnly: true });
  }
  next();
});

// test
app.get('/test', (req,res)=> res.send('OK'));

// Redis ping\app.get('/ping-redis', async (req,res)=>{
app.get('/ping-redis', async (req, res) => {
  try {
    await redis.set('ping', 'pong', { EX: 5 });
    const v = await redis.get('ping');
    res.send(`Redis says: ${v}`);
  } catch (e) {
    res.status(500).send('Redis error');
  }
});

// publish stub
app.post('/api/publish', async (req,res)=>{ /* ... */ res.send('ok'); });

// Fresh ATIS fetch
app.get('/atis/:icao', async (req,res)=>{
  const icao = req.params.icao.toUpperCase();
  try {
    const api = await fetch(`https://datis.clowd.io/api/${icao}`);
    const json = await api.json();
    if (json.error) return res.status(404).json(json);
    const atis = Array.isArray(json) ? json[0]?.datis : json.atis;
    if (!atis) return res.status(404).json({error:'No ATIS'});
    res.json({atis_raw:atis});
  } catch(err) {
    res.status(500).json({error:'Fetch error'});
  }
});

// Save snapshot
app.post('/save-atis/:icao', async (req,res)=>{
  const icao = req.params.icao.toUpperCase();
  // fetch fresh
  const api = await fetch(`https://datis.clowd.io/api/${icao}`);
  const json = await api.json();
  const atis = Array.isArray(json)?json[0]?.datis:json.atis;
  if (!atis) return res.status(404).json({error:'No ATIS'});
  // insert
  await pool.query(
      `INSERT INTO saved_atis (icao_code, atis_raw) VALUES($1,$2)`,
      [icao, atis]
  );
  // keep only last 5
  await pool.query(
      `DELETE FROM saved_atis WHERE id NOT IN (
       SELECT id FROM saved_atis WHERE icao_code=$1 ORDER BY saved_at DESC LIMIT 5
     ) AND icao_code=$1`, [icao]
  );
  res.json({status:'saved',icao});
});

// List last 5 saved
app.get('/saved-atis/:icao', async (req,res)=>{
  const icao = req.params.icao.toUpperCase();
  const {rows} = await pool.query(
      `SELECT atis_raw, saved_at FROM saved_atis WHERE icao_code=$1 ORDER BY saved_at DESC LIMIT 5`,
      [icao]
  );
  res.json(rows);
});

initRedis().then(()=>{
  app.listen(PORT,'0.0.0.0',()=>console.log(`🚀 on http://localhost:${PORT}`));
});