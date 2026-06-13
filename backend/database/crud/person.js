export class PersonManager {
  constructor(Database) {
    this.Database = Database
  }

  /**
   * @typedef {Object} AddPersonParams
   * @property {string} name
   * @property {number} [photo_id]
   * @property {number} [avatar_id]
   */

  /**
   * @typedef {AddPersonParams & {
   *  id: number,
   * }} AddPersonResponse
  */

  /**
   * @param {AddPersonParams} params
   * @returns {AddPersonResponse}
  */
  addPerson(params) {
    const normalizedParams = {
      name: params.name,
      photo_id: params.photo_id ?? null,
      avatar_id: params.avatar_id ?? null
    }

    const addQuery = this.Database.prepare(`
      INSERT INTO person (name, photo_id, avatar_id) 
      VALUES (@name, @photo_id, @avatar_id)
    `)
    const result = addQuery.run(normalizedParams)

    return { ...params, id: result.lastInsertRowid }
  }

  
  /**
   * @typedef {AddPersonResponse & {
   *  created_at: string
   * }} Person
  */

  /**
   * @param {string} id 
   * @returns {Person}
   */
  getPerson(id) {
    const getQuery = this.Database.prepare('SELECT * FROM person WHERE id = @id')
    const result = getQuery.get({ id })

    return result ? { ...result, created_at: new Date(result.created_at) } : null
  }

  /**
   * @param {{ search?: string }} [filters]
   */
  getAllPersons(filters = {}) {
    let sql = 'SELECT * FROM person'
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
   * @typedef {Object} EditPersonData
   * @property {string} [name]
   * @property {number} [photo_id]
   * @property {number} [avatar_id]
  */

  /**
   * @param {string} id 
   * @param {EditPersonData} data 
   */
  updatePerson(id, data) {
    /** @type {string[]} Array that ensures only allowed fields can be passed into update function, to prevent SQL Injections.*/
    const allowedFields = [
      "name",
      "photo_id",
      "avatar_id"
    ]

    const fields = Object.keys(data).filter(field => allowedFields.includes(field))

    const fieldsToUpdate = fields.map(field => `${field} = @${field}`).join(', ')
    const updateQuery = this.Database.prepare(`UPDATE person SET ${fieldsToUpdate} WHERE id = @id`)

    updateQuery.run({ id, ...data })
  }

  /**
   * @param {string} id 
   */
  removePerson(id) {
    const removeQuery = this.Database.prepare(`DELETE FROM person WHERE id = @id`)

    removeQuery.run({ id })
  }

  removeAllPersons() {
    this.Database.exec(`DELETE FROM person`)
  }
}