import DatabaseDriver from 'better-sqlite3'
import dotenv from 'dotenv'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { PhotoManager } from './crud/photos.js'
import { AlbumManager } from './crud/album.js'
import { PersonManager } from './crud/person.js'

dotenv.config();

/**
 * @typedef {import("./PhotoManager.js").PhotoManager} PhotoManager
 */

/**
 * @typedef {DatabaseDriver & {
 *   Photos: PhotoManager
 * }} Database
 */

/** @type {Database} */
export const Database = new DatabaseDriver(process.env.DATABASE_PATH)

Database.Photos = new PhotoManager(Database)
Database.Albums = new AlbumManager(Database)
Database.Persons = new PersonManager(Database)

Database.pragma('foreign_keys = ON')

export function initDatabase() {
  Database.exec(readFileSync("backend/database/schema.sql", 'utf8'))
}

initDatabase()