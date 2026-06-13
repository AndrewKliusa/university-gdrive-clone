import { describe, it, expect } from 'vitest'
import { app } from '../../server'
import request from 'supertest'
import "../setup"

const dummyFile = Buffer.from('test')

function addPhoto(data) {
  const req = request(app)
    .post('/photos')
    .field('caption', data.caption ?? '')
    .field('taken_at', data.taken_at ?? '')
    .attach('photo', dummyFile, data.name)

  return req
}

function getPhoto(id) {
  return request(app).get(`/photos/${id}`)
}

function updatePhoto(id, data) {
  return request(app)
    .patch(`/photos/${id}`)
    .send(data)
}

function removePhoto(id) {
  return request(app).delete(`/photos/${id}`)
}

describe('Photo routes', () => {
  it("Creates a photo", async () => {
    const postRes = await addPhoto({ name: 'test.png', caption: 'test', taken_at: '123' })
    
    expect(postRes.status).toBe(201)
    expect(postRes.body.name).toBe('test.png')
    expect(postRes.body.caption).toBe('test')
  })

  it("Gets a photo", async () => {
    const postRes = await addPhoto({ name: 'test.png', taken_at: '123' })
    const getRes = await getPhoto(postRes.body.id)
    
    expect(getRes.status).toBe(200)
    expect(getRes.body.name).toBe('test.png')
  })

  it("Edits a photo", async () => {
    const postRes = await addPhoto({ name: 'test.png', taken_at: '123' })
    const updateRes = await updatePhoto(postRes.body.id, { caption: 'updated caption' })
    
    expect(updateRes.status).toBe(200)
    expect(updateRes.body.caption).toBe('updated caption')
  })

  it("Removes a photo", async () => {
    const postRes = await addPhoto({ name: 'test.png', taken_at: '123' })
    const getRes = await getPhoto(postRes.body.id)
    expect(getRes.status).toBe(200)

    const removeRes = await removePhoto(postRes.body.id)
    const getResTwo = await getPhoto(postRes.body.id)

    expect(getResTwo.status).toBe(404)
    expect(getResTwo.error).not.toBeNullable()
  })

  it("Removes a photo with non-existent id", async () => {
    const postRes = await addPhoto({ name: 'test.png', taken_at: '123' })
    const getRes = await getPhoto(postRes.body.id)
    expect(getRes.status).toBe(200)

    const removeRes = await removePhoto(123)
    expect(removeRes.status).toBe(404)
  })

  it("Gets all photos", async () => {
    await addPhoto({ name: 'a.png', taken_at: '123' })
    await addPhoto({ name: 'b.png', taken_at: '456' })

    const res = await request(app).get('/photos')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })
})
