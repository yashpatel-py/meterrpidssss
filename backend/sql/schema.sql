-- Blog core tables
CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  hero_image TEXT,
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft',
  author_id INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS post_tags (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Optional media attachments for rich posts
CREATE TABLE IF NOT EXISTS post_media (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful indexes for SEO and filtering
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts (published_at);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts (status);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags (slug);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users (email);
