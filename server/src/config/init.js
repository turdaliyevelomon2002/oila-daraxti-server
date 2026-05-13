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
