const { Pool } = require('pg');
const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

pool.on('connect', () => console.log('PostgreSQL ulandi'));
pool.on('error', (err) => console.error('PostgreSQL xatosi:', err));

module.exports = pool;
