-- Family Tree Database Schema

CREATE TABLE IF NOT EXISTS members (
  id SERIAL PRIMARY KEY,
  name_uz VARCHAR(150) NOT NULL,
  name_ru VARCHAR(150),
  name_en VARCHAR(150),
  birth_date DATE,
  death_date DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
  generation INT DEFAULT 1,
  parent_id INT REFERENCES members(id) ON DELETE SET NULL,
  mother_id INT REFERENCES members(id) ON DELETE SET NULL,
  spouse_id INT REFERENCES members(id) ON DELETE SET NULL,
  photo_url TEXT,
  bio_uz TEXT,
  bio_ru TEXT,
  bio_en TEXT,
  phone VARCHAR(30),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  member_id INT REFERENCES members(id) ON DELETE CASCADE,
  media_type VARCHAR(10) CHECK (media_type IN ('image', 'video')),
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  member_id INT REFERENCES members(id) ON DELETE CASCADE,
  type VARCHAR(50) DEFAULT 'birthday',
  message_uz TEXT,
  message_ru TEXT,
  message_en TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  scheduled_for DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS members_updated_at ON members;
CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
