import DatabaseDriver from 'better-sqlite3'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { PhotoManager } from './crud/photos.js'

/**
 * @typedef {import("./PhotoManager.js").PhotoManager} PhotoManager
 */

const databasePath = join(process.cwd(), 'backend/database/database.sqlite')
const schemaPath = join(process.cwd(), 'backend/database/schema.sql')

/**
 * @typedef {DatabaseDriver & {
 *   Photos: PhotoManager
 * }} Database
 */

/** @type {Database} */
export const Database = new DatabaseDriver(
  process.argv.join().includes("--test")
    ? ":memory:"
    : databasePath
)

Database.Photos = new PhotoManager(Database)

Database.pragma('foreign_keys = ON')

export function initDatabase() {
  Database.exec(readFileSync(schemaPath, 'utf8'))
}

initDatabase()