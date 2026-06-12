import { describe, it, expect } from 'vitest'
import { app } from '../../server'
import request from 'supertest'
import { crudBuilder, dummyPhoto, dummyPhotoTwo } from "../setup";

const { post: addPhoto, get: getPhoto, patch: updatePhoto, delete: removePhoto } = crudBuilder("photos")

describe('Photo routes', () => {
  it("Creates a photo", async () => {
    const postRes = await addPhoto(dummyPhoto)
    
    expect(postRes.status).toBe(201)
    expect(postRes.body).toMatchObject(dummyPhoto)
  })

  it("Gets a photo", async () => {
    const postRes = await addPhoto(dummyPhoto)
    const getRes = await getPhoto(postRes.body.id)
    
    expect(getRes.status).toBe(200)
    expect(getRes.body).toMatchObject(dummyPhoto)
  })

  it("Edits a photo", async () => {
    const postRes = await addPhoto(dummyPhoto)
    const updateRes = await updatePhoto(postRes.body.id, dummyPhotoTwo)
    
    expect(updateRes.status).toBe(200)
    expect(updateRes.body).toMatchObject(dummyPhotoTwo)
  })

  it("Removes a photo", async () => {
    const postRes = await addPhoto(dummyPhoto)
    const getRes = await getPhoto(postRes.body.id)

    expect(getRes.status).toBe(200)

    const removeRes = await removePhoto(postRes.body.id)
    console.log(removeRes.status)

    const getResTwo = await getPhoto(postRes.body.id)

    expect(getResTwo.status).toBe(404)
    expect(getResTwo.error).not.toBeNullable()
  })

  it("Removes a photo with non-existent id", async () => {
    const postRes = await addPhoto(dummyPhoto)
    const getRes = await getPhoto(postRes.body.id)

    expect(getRes.status).toBe(200)

    const removeRes = await removePhoto(123)
    expect(removeRes.status).toBe(404)
  })

  it("Gets all photos", async () => {
    await addPhoto(dummyPhoto)
    await addPhoto(dummyPhotoTwo)

    const res = await request(app).get('/photos')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
    expect(res.body[0].name).toBe(dummyPhotoTwo.name)
    expect(res.body[1].name).toBe(dummyPhoto.name)
  })
})