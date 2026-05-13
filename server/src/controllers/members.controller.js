const pool = require('../config/database');

async function getTree(req, res) {
  const all = await pool.query(
    `SELECT m.*, s.id as spouse_id_ref, s.name_uz as spouse_name_uz,
            s.name_ru as spouse_name_ru, s.name_en as spouse_name_en,
            s.photo_url as spouse_photo, s.gender as spouse_gender,
            s.birth_date as spouse_birth_date
     FROM members m
     LEFT JOIN members s ON m.spouse_id = s.id
     ORDER BY m.generation, m.id`
  );

  const members = all.rows;
  const map = {};
  members.forEach((m) => (map[m.id] = { ...m, children: [] }));

  const roots = [];
  members.forEach((m) => {
    if (m.parent_id && map[m.parent_id]) {
      map[m.parent_id].children.push(map[m.id]);
    } else if (!m.parent_id) {
      roots.push(map[m.id]);
    }
  });

  res.json(roots);
}

async function getAll(req, res) {
  const result = await pool.query(
    'SELECT * FROM members ORDER BY generation, id'
  );
  res.json(result.rows);
}

async function getById(req, res) {
  const { id } = req.params;
  const memberResult = await pool.query('SELECT * FROM members WHERE id = $1', [id]);
  if (!memberResult.rows[0]) return res.status(404).json({ message: 'Topilmadi' });

  const member = memberResult.rows[0];

  const [mediaResult, spouseResult, childrenResult, parentResult, motherResult] = await Promise.all([
    pool.query('SELECT * FROM media WHERE member_id = $1 ORDER BY created_at', [id]),
    member.spouse_id
      ? pool.query('SELECT id, name_uz, name_ru, name_en, photo_url, gender, birth_date FROM members WHERE id = $1', [member.spouse_id])
      : Promise.resolve({ rows: [] }),
    pool.query(
      'SELECT id, name_uz, name_ru, name_en, photo_url, gender, birth_date FROM members WHERE parent_id = $1 OR mother_id = $1',
      [id]
    ),
    member.parent_id
      ? pool.query('SELECT id, name_uz, name_ru, name_en, photo_url, gender FROM members WHERE id = $1', [member.parent_id])
      : Promise.resolve({ rows: [] }),
    member.mother_id
      ? pool.query('SELECT id, name_uz, name_ru, name_en, photo_url, gender FROM members WHERE id = $1', [member.mother_id])
      : Promise.resolve({ rows: [] }),
  ]);

  res.json({
    ...member,
    media: mediaResult.rows,
    spouse: spouseResult.rows[0] || null,
    children: childrenResult.rows,
    parent: parentResult.rows[0] || null,
    mother: motherResult.rows[0] || null,
  });
}

async function create(req, res) {
  const {
    name_uz, name_ru, name_en, birth_date, death_date, gender,
    generation, parent_id, mother_id, spouse_id, bio_uz, bio_ru, bio_en,
    phone, email,
  } = req.body;

  const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

  const result = await pool.query(
    `INSERT INTO members
      (name_uz,name_ru,name_en,birth_date,death_date,gender,generation,
       parent_id,mother_id,spouse_id,photo_url,bio_uz,bio_ru,bio_en,phone,email)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
     RETURNING *`,
    [
      name_uz, name_ru || null, name_en || null,
      birth_date || null, death_date || null, gender,
      generation || 1,
      parent_id || null, mother_id || null, spouse_id || null, photo_url,
      bio_uz || null, bio_ru || null, bio_en || null,
      phone || null, email || null,
    ]
  );

  if (spouse_id) {
    await pool.query('UPDATE members SET spouse_id = $1 WHERE id = $2', [
      result.rows[0].id,
      spouse_id,
    ]);
  }

  res.status(201).json(result.rows[0]);
}

async function update(req, res) {
  const { id } = req.params;
  const {
    name_uz, name_ru, name_en, birth_date, death_date, gender,
    generation, parent_id, mother_id, spouse_id, bio_uz, bio_ru, bio_en,
    phone, email,
  } = req.body;

  const existing = await pool.query('SELECT photo_url FROM members WHERE id = $1', [id]);
  if (!existing.rows[0]) return res.status(404).json({ message: 'Topilmadi' });

  const photo_url = req.file
    ? `/uploads/${req.file.filename}`
    : existing.rows[0].photo_url;

  const result = await pool.query(
    `UPDATE members SET
      name_uz=$1, name_ru=$2, name_en=$3, birth_date=$4, death_date=$5,
      gender=$6, generation=$7, parent_id=$8, mother_id=$9, spouse_id=$10, photo_url=$11,
      bio_uz=$12, bio_ru=$13, bio_en=$14, phone=$15, email=$16
     WHERE id=$17 RETURNING *`,
    [
      name_uz, name_ru || null, name_en || null,
      birth_date || null, death_date || null, gender,
      generation || 1,
      parent_id || null, mother_id || null, spouse_id || null, photo_url,
      bio_uz || null, bio_ru || null, bio_en || null,
      phone || null, email || null, id,
    ]
  );

  if (spouse_id) {
    await pool.query(
      'UPDATE members SET spouse_id = $1 WHERE id = $2 AND spouse_id IS NULL',
      [id, spouse_id]
    );
  }

  res.json(result.rows[0]);
}

async function remove(req, res) {
  const { id } = req.params;
  await pool.query('DELETE FROM members WHERE id = $1', [id]);
  res.json({ message: 'O\'chirildi' });
}

module.exports = { getTree, getAll, getById, create, update, remove };
