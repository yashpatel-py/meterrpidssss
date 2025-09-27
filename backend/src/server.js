import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { query, getClient } from './db.js';
import { requireAuth, verifyPassword, signToken } from './auth.js';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? '*' }));
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.JSON_BODY_LIMIT || '1mb' }));
app.use(morgan('dev'));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

const sensitiveLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

function ensureAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

app.get('/health', async (_req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', time: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'error', error: error instanceof Error ? error.message : String(error) });
  }
});

app.get('/api/posts', async (req, res, next) => {
  const { status = 'published', limit = '20', page = '1' } = req.query;
  const normalizedStatus = typeof status === 'string' && status.toLowerCase() !== 'all' ? status.toLowerCase() : null;
  const limitNumber = Number(limit) || 20;
  const pageNumber = Number(page) || 1;
  const offset = (pageNumber - 1) * limitNumber;

  const postsQuery = `
    SELECT
      p.id,
      p.title,
      p.slug,
      p.excerpt,
      p.hero_image,
      p.seo_title,
      p.seo_description,
      p.published_at,
      p.status,
      jsonb_build_object('id', a.id, 'name', a.name, 'slug', a.slug)           AS author,
      jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug)           AS category,
      COALESCE(
        (
          SELECT json_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
          FROM post_tags pt
          JOIN tags t ON t.id = pt.tag_id
          WHERE pt.post_id = p.id
        ),
        '[]'::json
      )                                                                             AS tags
    FROM posts p
    JOIN authors a ON a.id = p.author_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE ($1::text IS NULL OR p.status = $1::text)
    ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
    LIMIT $2 OFFSET $3;
  `;

  try {
    const { rows } = await query(postsQuery, [normalizedStatus, limitNumber, offset]);
    res.json({ data: rows, meta: { status: normalizedStatus ?? 'all', limit: limitNumber, page: pageNumber } });
  } catch (error) {
    next(error);
  }
});

app.get('/api/posts/:slug', async (req, res, next) => {
  const { slug } = req.params;

  const postQuery = `
    SELECT
      p.id,
      p.title,
      p.slug,
      p.excerpt,
      p.content,
      p.hero_image,
      p.seo_title,
      p.seo_description,
      p.published_at,
      p.status,
      jsonb_build_object('id', a.id, 'name', a.name, 'slug', a.slug, 'bio', a.bio, 'avatar_url', a.avatar_url) AS author,
      jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug)                                                 AS category,
      COALESCE(
        (
          SELECT json_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
          FROM post_tags pt
          JOIN tags t ON t.id = pt.tag_id
          WHERE pt.post_id = p.id
        ),
        '[]'::json
      )                                                                                                             AS tags,
      COALESCE(
        (
          SELECT json_agg(jsonb_build_object('id', pm.id, 'url', pm.url, 'alt_text', pm.alt_text, 'position', pm.position) ORDER BY pm.position)
          FROM post_media pm
          WHERE pm.post_id = p.id
        ),
        '[]'::json
      )                                                                                                             AS media
    FROM posts p
    JOIN authors a ON a.id = p.author_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.slug = $1
      AND p.status = 'published'
    LIMIT 1;
  `;

  try {
    const { rows } = await query(postQuery, [slug]);

    if (!rows.length) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ data: rows[0] });
  } catch (error) {
    next(error);
  }
});

app.get('/api/categories', async (_req, res, next) => {
  const sql = `
    SELECT c.id, c.name, c.slug, c.description,
           COUNT(p.*) FILTER (WHERE p.status = 'published') AS published_count
    FROM categories c
    LEFT JOIN posts p ON p.category_id = c.id
    GROUP BY c.id
    ORDER BY c.name;
  `;

  try {
    const { rows } = await query(sql);
    res.json({ data: rows });
  } catch (error) {
    next(error);
  }
});

app.get('/api/tags', async (_req, res, next) => {
  const sql = `
    SELECT t.id, t.name, t.slug,
           COUNT(pt.*) AS usage_count
    FROM tags t
    LEFT JOIN post_tags pt ON pt.tag_id = t.id
    GROUP BY t.id
    ORDER BY t.name;
  `;

  try {
    const { rows } = await query(sql);
    res.json({ data: rows });
  } catch (error) {
    next(error);
  }
});

// Generic error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Meteorroids API listening on port ${PORT}`);
});
app.post('/api/admin/auth/login', authLimiter, async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = req.body.password ?? '';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { rows } = await query(
      'SELECT id, email, password_hash, role FROM admin_users WHERE email = $1 LIMIT 1;',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = rows[0];
    const passwordOk = await verifyPassword(password, admin.password_hash);

    if (!passwordOk) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await query('UPDATE admin_users SET last_login_at = now(), updated_at = now() WHERE id = $1;', [admin.id]);

    const token = signToken({ sub: admin.id, email: admin.email, role: admin.role });

    res.json({
      token,
      user: { id: admin.id, email: admin.email, role: admin.role },
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/profile', requireAuth, ensureAdmin, async (req, res, next) => {
  try {
    const { sub: id } = req.user;
    const { rows } = await query(
      'SELECT id, email, role, last_login_at, created_at, updated_at FROM admin_users WHERE id = $1 LIMIT 1;',
      [id]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json({ data: rows[0] });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/metadata/authors', requireAuth, ensureAdmin, async (_req, res, next) => {
  try {
    const { rows } = await query('SELECT id, name, slug FROM authors ORDER BY name;');
    res.json({ data: rows });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/posts/:id', requireAuth, ensureAdmin, async (req, res, next) => {
  const { id } = req.params;
  const sql = `
    SELECT
      p.id,
      p.title,
      p.slug,
      p.excerpt,
      p.content,
      p.hero_image,
      p.seo_title,
      p.seo_description,
      p.published_at,
      p.status,
      jsonb_build_object('id', a.id, 'name', a.name, 'slug', a.slug, 'bio', a.bio, 'avatar_url', a.avatar_url) AS author,
      jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug)                                                 AS category,
      COALESCE(
        (
          SELECT json_agg(jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
          FROM post_tags pt
          JOIN tags t ON t.id = pt.tag_id
          WHERE pt.post_id = p.id
        ),
        '[]'::json
      )                                                                                                             AS tags,
      COALESCE(
        (
          SELECT json_agg(jsonb_build_object('id', pm.id, 'url', pm.url, 'alt_text', pm.alt_text, 'position', pm.position) ORDER BY pm.position)
          FROM post_media pm
          WHERE pm.post_id = p.id
        ),
        '[]'::json
      )                                                                                                             AS media
    FROM posts p
    JOIN authors a ON a.id = p.author_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id = $1
    LIMIT 1;
  `;

  try {
    const { rows } = await query(sql, [id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ data: rows[0] });
  } catch (error) {
    next(error);
  }
});

app.post('/api/admin/posts', sensitiveLimiter, requireAuth, ensureAdmin, async (req, res, next) => {
  const {
    title,
    slug,
    content,
    status = 'draft',
    excerpt,
    heroImage,
    seoTitle,
    seoDescription,
    publishedAt,
    authorId,
    categoryId,
    tagIds = [],
  } = req.body;

  if (!title || !slug || !content || !authorId) {
    return res.status(400).json({ error: 'title, slug, content, and authorId are required' });
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');
    const insertPost = `
      INSERT INTO posts (
        title, slug, content, status, excerpt, hero_image, seo_title, seo_description,
        published_at, author_id, category_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, slug;
    `;

    const publishedAtValue = publishedAt ? new Date(publishedAt) : null;

    const { rows } = await client.query(insertPost, [
      title,
      slug,
      content,
      status,
      excerpt ?? null,
      heroImage ?? null,
      seoTitle ?? null,
      seoDescription ?? null,
      publishedAtValue,
      authorId,
      categoryId ?? null,
    ]);

    const postId = rows[0].id;

    if (Array.isArray(tagIds) && tagIds.length) {
      const insertTags = `
        INSERT INTO post_tags (post_id, tag_id)
        SELECT $1, UNNEST($2::int[])
        ON CONFLICT DO NOTHING;
      `;
      await client.query(insertTags, [postId, tagIds]);
    }

    await client.query('COMMIT');
    res.status(201).json({ data: { id: postId, slug: rows[0].slug } });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

app.patch('/api/admin/posts/:id', sensitiveLimiter, requireAuth, ensureAdmin, async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    slug,
    content,
    status,
    excerpt,
    heroImage,
    seoTitle,
    seoDescription,
    publishedAt,
    authorId,
    categoryId,
    tagIds,
  } = req.body;

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const updateFields = [];
    const values = [];
    let idx = 1;

    const fieldMap = {
      title,
      slug,
      content,
      status,
      excerpt,
      hero_image: heroImage,
      seo_title: seoTitle,
      seo_description: seoDescription,
      published_at: publishedAt ? new Date(publishedAt) : null,
      author_id: authorId,
      category_id: categoryId,
    };

    for (const [column, value] of Object.entries(fieldMap)) {
      if (value !== undefined) {
        updateFields.push(`${column} = $${idx}`);
        values.push(value);
        idx += 1;
      }
    }

    if (updateFields.length) {
      values.push(id);
      const updateSql = `UPDATE posts SET ${updateFields.join(', ')}, updated_at = now() WHERE id = $${idx} RETURNING id, slug;`;
      const { rows } = await client.query(updateSql, values);
      if (!rows.length) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Post not found' });
      }
    }

    if (Array.isArray(tagIds)) {
      await client.query('DELETE FROM post_tags WHERE post_id = $1;', [id]);
      if (tagIds.length) {
        await client.query(
          'INSERT INTO post_tags (post_id, tag_id) SELECT $1, UNNEST($2::int[]) ON CONFLICT DO NOTHING;',
          [id, tagIds]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ data: { id: Number(id) } });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

app.delete('/api/admin/posts/:id', sensitiveLimiter, requireAuth, ensureAdmin, async (req, res, next) => {
  const { id } = req.params;
  try {
    const { rowCount } = await query('DELETE FROM posts WHERE id = $1;', [id]);
    if (!rowCount) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
