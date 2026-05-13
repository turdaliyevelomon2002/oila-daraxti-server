const pool = require('../config/database');

async function getAll(req, res) {
  const result = await pool.query(
    `SELECT n.*, m.name_uz, m.name_ru, m.name_en, m.photo_url
     FROM notifications n
     JOIN members m ON n.member_id = m.id
     ORDER BY n.created_at DESC
     LIMIT 50`
  );
  res.json(result.rows);
}

async function getUnread(req, res) {
  const result = await pool.query(
    `SELECT n.*, m.name_uz, m.name_ru, m.name_en, m.photo_url
     FROM notifications n
     JOIN members m ON n.member_id = m.id
     WHERE n.is_read = FALSE
     ORDER BY n.created_at DESC`
  );
  res.json(result.rows);
}

async function markRead(req, res) {
  const { id } = req.params;
  await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = $1', [id]);
  res.json({ message: 'O\'qilgan deb belgilandi' });
}

async function markAllRead(req, res) {
  await pool.query('UPDATE notifications SET is_read = TRUE WHERE is_read = FALSE');
  res.json({ message: 'Hammasi o\'qilgan' });
}

module.exports = { getAll, getUnread, markRead, markAllRead };
