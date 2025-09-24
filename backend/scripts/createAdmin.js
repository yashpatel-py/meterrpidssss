import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { query } from '../src/db.js';
import { hashPassword } from '../src/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

async function main() {
  const rl = readline.createInterface({ input, output, terminal: true });

  const email = (await rl.question('Admin email: ')).trim().toLowerCase();
  if (!email) {
    console.error('Email is required');
    process.exit(1);
  }

  const password = await rl.question('Admin password: ', { hideEchoBack: true });
  const confirm = await rl.question('Confirm password: ', { hideEchoBack: true });

  rl.close();

  if (!password) {
    console.error('Password is required');
    process.exit(1);
  }

  if (password !== confirm) {
    console.error('Passwords do not match');
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  const upsertSql = `
    INSERT INTO admin_users (email, password_hash)
    VALUES ($1, $2)
    ON CONFLICT (email)
    DO UPDATE SET password_hash = EXCLUDED.password_hash, updated_at = now();
  `;

  await query(upsertSql, [email, passwordHash]);

  console.log(`Admin user ${email} created/updated successfully.`);
}

main().catch((error) => {
  console.error('Failed to create admin user', error);
  process.exit(1);
});
