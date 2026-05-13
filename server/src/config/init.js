const fs = require('fs');
const path = require('path');
const pool = require('./database');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);
  await pool.query(
    `ALTER TABLE members ADD COLUMN IF NOT EXISTS mother_id INT REFERENCES members(id) ON DELETE SET NULL`
  );
  await pool.query(
    `ALTER TABLE members ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT`
  );
  await pool.query(`
    CREATE TABLE IF NOT EXISTS telegram_users (
      id SERIAL PRIMARY KEY,
      chat_id BIGINT UNIQUE NOT NULL,
      telegram_username VARCHAR(100),
      first_name VARCHAR(100),
      last_name VARCHAR(100),
      member_id INT REFERENCES members(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const existing = await pool.query('SELECT id FROM admins WHERE username = $1', [
    process.env.ADMIN_USERNAME,
  ]);

  if (existing.rows.length === 0) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await pool.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', [
      process.env.ADMIN_USERNAME,
      hash,
    ]);
    console.log(`Admin yaratildi: ${process.env.ADMIN_USERNAME}`);
  }
}

module.exports = initDatabase;
