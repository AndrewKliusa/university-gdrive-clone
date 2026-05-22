import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const databasePath = join(process.cwd(), 'backend/database/database.sqlite');
const schemaPath = join(process.cwd(), 'backend/database/schema.sql');

export const database = new Database(databasePath);

database.pragma('foreign_keys = ON');
database.exec(readFileSync(schemaPath, 'utf8'));