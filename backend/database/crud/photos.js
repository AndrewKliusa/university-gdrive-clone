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
   * @returns {Photo[]}
   */
  getAllPhotos() {
    const getAllQuery = this.Database.prepare('SELECT * FROM photo ORDER BY created_at DESC')
    const results = getAllQuery.all()
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

  /**
   * @param {string} photoId
   * @returns {number[]}
   */
  getPhotoPeople(photoId) {
    const getQuery = this.Database.prepare('SELECT person_id FROM photo_people WHERE photo_id = @photo_id')
    return getQuery.all({ photo_id: photoId }).map(row => row.person_id)
  }

  /**
   * @param {string} photoId
   * @param {number[]} personIds
   */
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

  attachPeopleIds(photo, peopleIds = this.getPhotoPeople(photo.id)) {
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

function normalizeDate(date) {
  date = new Date(date);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = String(date.getUTCFullYear()).slice(2);

  return `${day}.${month}.${year}`;
}