export class PhotoManager {
  constructor(Database) {
    this.Database = Database
  }

  /**
   * @typedef {Object} AddPhotoParams
   * @property {number} album_id
   * @property {string} name
   * @property {string} hash
   * @property {number} size_bytes
   * @property {string} caption
   * @property {string} taken_at
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
  addPhoto(params) {
    const addQuery = this.Database.prepare(`
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
  getPhoto(id) {
    const getQuery = this.Database.prepare('SELECT * FROM photo WHERE id = @id')
    const result = getQuery.get({ id })

    return result ? { ...result, created_at: new Date(result.created_at) } : null
  }

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
  updatePhoto(id, data) {
    /** @type {string[]} Array that ensures only allowed fields can be passed into update function, to prevent SQL Injections.*/
    const allowedFields = [
      "album_id",
      "name",
      "hash",
      "size_bytes",
      "caption",
      "taken_at"
    ]

    const fields = Object.keys(data).filter(field => allowedFields.includes(field))

    const fieldsToUpdate = fields.map(field => `${field} = @${field}`).join(', ')
    const updateQuery = this.Database.prepare(`UPDATE photo SET ${fieldsToUpdate} WHERE id = @id`)

    updateQuery.run({ id, ...data })
  }

  /**
   * @param {string} id 
   */
  removePhoto(id) {
    const removeQuery = this.Database.prepare(`DELETE FROM photo WHERE id = @id`)

    removeQuery.run({ id })
  }

  removeAllPhotos() {
    this.Database.exec(`DELETE FROM photo`)
  }
}