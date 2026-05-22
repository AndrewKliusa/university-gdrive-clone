import { database } from "../database.js"

/**
 * @typedef {Object} AddPhotoParams
 * @property {number} album_id
 * @property {string} name
 * @property {string} hash
 * @property {number} size_bytes
 * @property {string} [caption]
 * @property {string} [taken_at]
 */

/**
 * @typedef {AddPhotoParams & {
 *  id: number,
 * }} AddPhotoResponse
*/

/**
 * @param {AddPhotoParams} params
 * @returns {AddPhotoResponse}
*/
function addPhoto(params) {
  const addQuery = database.prepare(`
    INSERT INTO photo (album_id, name, hash, size_bytes, caption, taken_at) 
    VALUES (@album_id, @name, @hash, @size_bytes, @caption, @taken_at)
  `)
  const result = addQuery.run(params)

  return { ...params, id: result.lastInsertRowid }
}

/**
 * @typedef {AddPhotoResponse & {
 *  created_at: string
 * }} Photo
*/

/**
 * @param {string} id 
 * @returns {Photo}
 */
function getPhoto(id) {
  const getQuery = database.prepare('SELECT * FROM photo WHERE id = @id')
  const result = getQuery.get({ id })

  return { ...result, created_at: new Date(result.created_at) }
}

/** @type {string[]} Array that ensures only allowed fields can be passed into update function,
 * to prevent SQL Injections.*/
const allowedFields = [
  "album_id",
  "name",
  "hash",
  "size_bytes",
  "caption",
  "taken_at"
]

/**
 * @typedef {Object} EditPhotoData
 * @property {number} [album_id]
 * @property {string} [name]
 * @property {string} [hash]
 * @property {number} [size_bytes]
 * @property {string} [caption]
 * @property {string} [taken_at]
*/

/**
 * @param {string} id 
 * @param {EditPhotoData} data 
 */
function updatePhoto(id, data) {
  const fields = Object.keys(data).filter(field => allowedFields.includes(field))

  const fieldsToUpdate = fields.map(field => `${field} = @${field}`).join(', ')
  const updateQuery = database.prepare(`UPDATE photo SET ${fieldsToUpdate} WHERE id = @id`)

  updateQuery.run({ id, ...data })
}

/**
 * @param {string} id 
 */
function removePhoto(id) {
  const removeQuery = database.prepare(`DELETE FROM photo WHERE id = @id`)

  removeQuery.run({ id })
}