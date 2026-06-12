import { describe, it, expect } from 'vitest'
import { app } from '../../server'
import request from 'supertest'
import { crudBuilder, dummyAlbum, dummyAlbumTwo } from "../setup"

const { post: addAlbum, get: getAlbum, patch: updateAlbum, delete: removeAlbum } = crudBuilder("albums")

describe('Album routes', () => {
  it("Creates an album", async () => {
    const postRes = await addAlbum(dummyAlbum)
    
    expect(postRes.status).toBe(201)
    expect(postRes.body).toMatchObject(dummyAlbum)
  })

  it("Gets an album", async () => {
    const postRes = await addAlbum(dummyAlbum)
    const getRes = await getAlbum(postRes.body.id)
    
    expect(getRes.status).toBe(200)
    expect(getRes.body).toMatchObject(dummyAlbum)
  })

  it("Edits an album", async () => {
    const postRes = await addAlbum(dummyAlbum)
    const updateRes = await updateAlbum(postRes.body.id, dummyAlbumTwo)
    
    expect(updateRes.status).toBe(200)
    expect(updateRes.body).toMatchObject(dummyAlbumTwo)
  })

  it("Removes an album", async () => {
    const postRes = await addAlbum(dummyAlbum)
    const getRes = await getAlbum(postRes.body.id)

    expect(getRes.status).toBe(200)

    const removeRes = await removeAlbum(postRes.body.id)

    const getResTwo = await getAlbum(postRes.body.id)

    expect(getResTwo.status).toBe(404)
    expect(getResTwo.error).not.toBeNullable()
  })

  it("Removes an album with non-existent id", async () => {
    const postRes = await addAlbum(dummyAlbum)
    const getRes = await getAlbum(postRes.body.id)

    expect(getRes.status).toBe(200)

    const removeRes = await removeAlbum(123)
    expect(removeRes.status).toBe(404)
  })

  it("Gets all albums", async () => {
    await addAlbum(dummyAlbum)
    await addAlbum(dummyAlbumTwo)

    const res = await request(app).get('/albums')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })
})
