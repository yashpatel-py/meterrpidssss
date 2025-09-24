import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import dotenv from 'dotenv';
import { Client } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function runMigration() {
  const connectionConfig = {
    connectionString: process.env.DATABASE_URL,
    host: process.env.PGHOST,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
  };

  const client = new Client(connectionConfig);

  try {
    await client.connect();

    const schemaPath = path.resolve(__dirname, '..', 'sql', 'schema.sql');
    const schema = await readFile(schemaPath, 'utf8');

    await client.query('BEGIN');
    await client.query(schema);
    await client.query('COMMIT');

    return { success: true, message: 'Database schema applied successfully.' };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    return {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    };
  } finally {
    await client.end();
  }
}

runMigration()
  .then((result) => {
    if (result.success) {
      console.log(result.message);
      process.exit(0);
    } else {
      console.error('Migration failed:', result.message);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Unexpected error running migration:', error);
    process.exit(1);
  });
