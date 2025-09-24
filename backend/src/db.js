import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
  max: process.env.PGPOOL_MAX ? Number(process.env.PGPOOL_MAX) : 10,
  idleTimeoutMillis: process.env.PGPOOL_IDLE ? Number(process.env.PGPOOL_IDLE) : 30_000,
};

// Filter out undefined keys so pg doesn't override connectionString config
const sanitizedConfig = Object.fromEntries(
  Object.entries(poolConfig).filter(([, value]) => value !== undefined)
);

const pool = new Pool(sanitizedConfig);

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error', err);
});

export async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== 'production') {
    console.log('executed query', { text, duration, rows: result.rowCount });
  }
  return result;
}

export async function getClient() {
  return pool.connect();
}

export default pool;
