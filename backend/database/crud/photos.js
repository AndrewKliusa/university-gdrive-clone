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
    const normalizedParams = {
      name: params.name,
      hash: params.hash,
      size_bytes: params.size_bytes,
      album_id: params.album_id ?? null,
      caption: params.caption ?? null,
      taken_at: params.taken_at ?? null
    }

    const addQuery = this.Database.prepare(`
      INSERT INTO photo (album_id, name, hash, size_bytes, caption, taken_at) 
      VALUES (@album_id, @name, @hash, @size_bytes, @caption, @taken_at)
    `)
    const result = addQuery.run(normalizedParams)

    const photo = this.Database.prepare('SELECT * FROM photo WHERE id = ?').get(result.lastInsertRowid)
    return this.attachPeopleIds({ ...photo, created_at: normalizeDate(photo.created_at) })
  }

  /**
   * @typedef {AddPhotoResponse & {
   *  created_at: string
   * }} Photo
  */

  /**
   * @param {{ album_id?: number, person_id?: number, from?: string, to?: string }} [filters]
   * @returns {Photo[]}
   */
  getAllPhotos(filters = {}) {
    let sql = 'SELECT DISTINCT photo.* FROM photo'
    const conditions = []
    const params = {}

    if (filters.person_id != null) {
      sql += ' INNER JOIN photo_people pp ON pp.photo_id = photo.id'
      conditions.push('pp.person_id = @person_id')
      params.person_id = filters.person_id
    }
    if (filters.album_id != null) {
      conditions.push('photo.album_id = @album_id')
      params.album_id = filters.album_id
    }
    if (filters.from != null) {
      conditions.push('photo.taken_at >= @from')
      params.from = filters.from
    }
    if (filters.to != null) {
      conditions.push('photo.taken_at <= @to')
      params.to = filters.to
    }

    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ')
    sql += ' ORDER BY photo.created_at DESC'

    const getAllQuery = this.Database.prepare(sql)
    const results = getAllQuery.all(params)
    const peopleMap = this.getAllPhotoPeopleMap()

    return results.map(r => this.attachPeopleIds(
      { ...r, created_at: normalizeDate(r.created_at) },
      peopleMap[r.id] ?? []
    ))
  }

  /**
   * @param {string} id 
   * @returns {Photo}
   */
  getPhoto(id) {
    const getQuery = this.Database.prepare('SELECT * FROM photo WHERE id = @id')
    const result = getQuery.get({ id })

    return result
      ? this.attachPeopleIds({ ...result, created_at: normalizeDate(result.created_at) })
      : null
  }

  setPhotoPeople(photoId, personIds) {
    const removeQuery = this.Database.prepare('DELETE FROM photo_people WHERE photo_id = @photo_id')
    removeQuery.run({ photo_id: photoId })

    const insertQuery = this.Database.prepare(`
      INSERT INTO photo_people (photo_id, person_id) VALUES (@photo_id, @person_id)
    `)

    for (const personId of personIds) {
      insertQuery.run({ photo_id: photoId, person_id: personId })
    }
  }

  getAllPhotoPeopleMap() {
    const getAllQuery = this.Database.prepare('SELECT photo_id, person_id FROM photo_people')
    const rows = getAllQuery.all()
    const map = {}

    for (const row of rows) {
      if (!map[row.photo_id]) map[row.photo_id] = []
      map[row.photo_id].push(row.person_id)
    }

    return map
  }

  attachPeopleIds(photo, peopleIds) {
    if (peopleIds === undefined) {
      const getQuery = this.Database.prepare('SELECT person_id FROM photo_people WHERE photo_id = @photo_id')
      peopleIds = getQuery.all({ photo_id: photo.id }).map(row => row.person_id)
    }
    return { ...photo, people_ids: peopleIds }
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
    const allowedFields = [
      "album_id",
      "name",
      "hash",
      "size_bytes",
      "caption",
      "taken_at"
    ]

    const fields = Object.keys(data).filter(field => allowedFields.includes(field))
    if (!fields.length) return

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

export function normalizeDate(date) {
  date = new Date(date)

  const day = String(date.getUTCDate()).padStart(2, "0")
  const month = String(date.getUTCMonth() + 1).padStart(2, "0")
  const year = String(date.getUTCFullYear()).slice(2)

  return `${day}.${month}.${year}`
}