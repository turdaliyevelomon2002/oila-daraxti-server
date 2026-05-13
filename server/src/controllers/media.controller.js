const pool = require('../config/database');
const { uploadFile } = require('../utils/storage');

async function addMedia(req, res) {
  const { member_id, caption } = req.body;
  if (!req.file) return res.status(400).json({ message: 'Fayl yuklanmadi' });

  const ext = req.file.originalname.split('.').pop().toLowerCase();
  const videoExts = ['mp4', 'mov', 'avi', 'webm', 'mkv'];
  const media_type = videoExts.includes(ext) ? 'video' : 'image';

  const url = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);

  const result = await pool.query(
    'INSERT INTO media (member_id, media_type, url, caption) VALUES ($1,$2,$3,$4) RETURNING *',
    [member_id, media_type, url, caption || null]
  );

  res.status(201).json(result.rows[0]);
}

async function deleteMedia(req, res) {
  const { id } = req.params;
  await pool.query('DELETE FROM media WHERE id = $1', [id]);
  res.json({ message: 'O\'chirildi' });
}

module.exports = { addMedia, deleteMedia };
