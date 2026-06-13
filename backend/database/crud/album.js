export class AlbumManager {
  constructor(Database) {
    this.Database = Database
  }

  /**
   * @typedef {Object} AddAldumParams
   * @property {string} name
   * @property {string} color
   * @property {number} photo_id
   * @property {string} description
   */

  /**
   * @typedef {AddAlbumParams & {
   *  id: number,
   * }} AddAlbumResponse
  */

  /**
   * @param {AddAlbumParams} params
   * @returns {AddAlbumResponse}
  */
  addAlbum(params) {
    const normalizedParams = {
      name: params.name,
      color: params.color,
      description: params.description
    }

    const addQuery = this.Database.prepare(`
      INSERT INTO album (name, color, description) 
      VALUES (@name, @color, @description)
    `)
    const result = addQuery.run(normalizedParams)

    return { ...params, id: result.lastInsertRowid }
  }

  
  /**
   * @typedef {AddAlbumResponse & {
   *  created_at: string
   * }} Album
  */

  /**
   * @param {string} id 
   * @returns {Album}
   */
  getAlbum(id) {
    const getQuery = this.Database.prepare('SELECT * FROM album WHERE id = @id')
    const result = getQuery.get({ id })

    return result ? { ...result, created_at: new Date(result.created_at) } : null
  }

  /**
   * @param {{ search?: string }} [filters]
   */
  getAllAlbums(filters = {}) {
    let sql = 'SELECT * FROM album'
    const params = {}

    if (filters.search) {
      sql += ' WHERE name LIKE @search'
      params.search = `%${filters.search}%`
    }

    sql += ' ORDER BY created_at DESC'

    const getAllQuery = this.Database.prepare(sql)
    const results = getAllQuery.all(params)
    return results.map(r => ({ ...r, created_at: new Date(r.created_at) }))
  }

  /**
   * @typedef {Object} EditAlbumData
   * @property {string} [name]
   * @property {string} [color]
   * @property {string} [photo_id]
   * @property {string} [description]
  */

  /**
   * @param {string} id 
   * @param {EditAlbumData} data 
   */
  updateAlbum(id, data) {
    const allowedFields = [
      "name",
      "color",
      "photo_id",
      "description"
    ]

    const fields = Object.keys(data).filter(field => allowedFields.includes(field))
    if (!fields.length) return

    const fieldsToUpdate = fields.map(field => `${field} = @${field}`).join(', ')
    const updateQuery = this.Database.prepare(`UPDATE album SET ${fieldsToUpdate} WHERE id = @id`)

    updateQuery.run({ id, ...data })
  }

  /**
   * @param {string} id 
   */
  removeAlbum(id) {
    const removeQuery = this.Database.prepare(`DELETE FROM album WHERE id = @id`)

    removeQuery.run({ id })
  }

  removeAllAlbums() {
    this.Database.exec(`DELETE FROM album`)
  }
}