const pool = require('../config/database');

async function getAll(req, res) {
  const result = await pool.query(
    `SELECT tu.*, m.name_uz, m.name_ru, m.name_en, m.photo_url, m.generation
     FROM telegram_users tu
     LEFT JOIN members m ON tu.member_id = m.id
     ORDER BY tu.created_at DESC`
  );
  res.json(result.rows);
}

async function linkMember(req, res) {
  const { id } = req.params;
  const { member_id } = req.body;
  const result = await pool.query(
    `UPDATE telegram_users SET member_id = $1 WHERE id = $2 RETURNING *`,
    [member_id || null, id]
  );
  if (!result.rows[0]) return res.status(404).json({ message: 'Topilmadi' });
  res.json(result.rows[0]);
}

async function remove(req, res) {
  const { id } = req.params;
  await pool.query(`DELETE FROM telegram_users WHERE id = $1`, [id]);
  res.json({ message: 'O\'chirildi' });
}

module.exports = { getAll, linkMember, remove };
