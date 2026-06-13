import { describe, it, expect } from 'vitest'
import { app } from '../../server'
import request from 'supertest'
import { Database } from "../../database/database"
import { crudBuilder, dummyPhoto, dummyPhotoTwo, dummyPerson, dummyPersonTwo } from "../setup"

const { post: addPerson, get: getPerson, patch: updatePerson, delete: removePerson } = crudBuilder("people")

function personWithPhotos(name, photo_id, avatar_id) {
  return { name, photo_id, avatar_id }
}

describe('Person routes', () => {
  it("Creates a person", async () => {
    const photo = Database.Photos.addPhoto(dummyPhoto)
    const avatar = Database.Photos.addPhoto(dummyPhotoTwo)
    const postRes = await addPerson(personWithPhotos(dummyPerson.name, photo.id, avatar.id))
    
    expect(postRes.status).toBe(201)
    expect(postRes.body).toMatchObject(personWithPhotos(dummyPerson.name, photo.id, avatar.id))
  })

  it("Gets a person", async () => {
    const photo = Database.Photos.addPhoto(dummyPhoto)
    const avatar = Database.Photos.addPhoto(dummyPhotoTwo)
    const postRes = await addPerson(personWithPhotos(dummyPerson.name, photo.id, avatar.id))
    const getRes = await getPerson(postRes.body.id)
    
    expect(getRes.status).toBe(200)
    expect(getRes.body).toMatchObject(personWithPhotos(dummyPerson.name, photo.id, avatar.id))
  })

  it("Edits a person", async () => {
    const photo = Database.Photos.addPhoto(dummyPhoto)
    const avatar = Database.Photos.addPhoto(dummyPhotoTwo)
    const postRes = await addPerson(personWithPhotos(dummyPerson.name, photo.id, avatar.id))
    const updateRes = await updatePerson(postRes.body.id, { name: "andrew", avatar_id: avatar.id })
    
    expect(updateRes.status).toBe(200)
    expect(updateRes.body).toMatchObject({ name: "andrew", avatar_id: avatar.id })
  })

  it("Removes a person", async () => {
    const photo = Database.Photos.addPhoto(dummyPhoto)
    const avatar = Database.Photos.addPhoto(dummyPhotoTwo)
    const postRes = await addPerson(personWithPhotos(dummyPerson.name, photo.id, avatar.id))

    const getRes = await getPerson(postRes.body.id)
    expect(getRes.status).toBe(200)

    const removeRes = await removePerson(postRes.body.id)
    expect(removeRes.status).toBe(204)
  })

  it("Removes a person with non-existent id", async () => {
    const photo = Database.Photos.addPhoto(dummyPhoto)
    const avatar = Database.Photos.addPhoto(dummyPhotoTwo)
    const postRes = await addPerson(personWithPhotos(dummyPerson.name, photo.id, avatar.id))
    const getRes = await getPerson(postRes.body.id)

    expect(getRes.status).toBe(200)

    const removeRes = await removePerson(123)
    expect(removeRes.status).toBe(404)
  })

  it("Gets all persons", async () => {
    const photo = Database.Photos.addPhoto(dummyPhoto)
    const avatar = Database.Photos.addPhoto(dummyPhotoTwo)
    
    await addPerson(personWithPhotos(dummyPerson.name, photo.id, avatar.id))
    await addPerson(personWithPhotos(dummyPersonTwo.name, photo.id, avatar.id))

    const res = await request(app).get('/people')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })

  it("Filters people by name search", async () => {
    const photo = Database.Photos.addPhoto(dummyPhoto)
    const avatar = Database.Photos.addPhoto(dummyPhotoTwo)

    await addPerson(personWithPhotos("Alice Smith", photo.id, avatar.id))
    await addPerson(personWithPhotos("Bob Jones", photo.id, avatar.id))

    const res = await request(app).get('/people?search=Alice')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].name).toBe("Alice Smith")
  })
})
