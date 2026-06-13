import { describe, it, expect } from 'vitest'
import { app } from '../../server'
import request from 'supertest'
import { Database } from "../../database/database"
import { crudBuilder, dummyPhoto, dummyPerson, dummyPersonTwo } from "../setup"

const { post: addPerson, get: getPerson, patch: updatePerson, delete: removePerson } = crudBuilder("people")

describe('Person routes', () => {
  it("Creates a person", async () => {
    const postRes = await addPerson(dummyPerson)
    
    expect(postRes.status).toBe(201)
    expect(postRes.body).toMatchObject(dummyPerson)
  })

  it("Gets a person", async () => {
    const postRes = await addPerson(dummyPerson)
    const getRes = await getPerson(postRes.body.id)
    
    expect(getRes.status).toBe(200)
    expect(getRes.body).toMatchObject(dummyPerson)
  })

  it("Edits a person", async () => {
    const photo = Database.Photos.addPhoto(dummyPhoto)
    const postRes = await addPerson(dummyPerson)
    const updateRes = await updatePerson(postRes.body.id, { name: "andrew", avatar_id: photo.id })
    
    expect(updateRes.status).toBe(200)
    expect(updateRes.body).toMatchObject({ name: "andrew", avatar_id: photo.id })
  })

  it("Removes a person", async () => {
    const postRes = await addPerson(dummyPerson)
    const getRes = await getPerson(postRes.body.id)

    expect(getRes.status).toBe(200)

    const removeRes = await removePerson(postRes.body.id)

    const getResTwo = await getPerson(postRes.body.id)

    expect(getResTwo.status).toBe(404)
    expect(getResTwo.error).not.toBeNullable()
  })

  it("Removes a person with non-existent id", async () => {
    const postRes = await addPerson(dummyPerson)
    const getRes = await getPerson(postRes.body.id)

    expect(getRes.status).toBe(200)

    const removeRes = await removePerson(123)
    expect(removeRes.status).toBe(404)
  })

  it("Gets all persons", async () => {
    await addPerson(dummyPerson)
    await addPerson(dummyPersonTwo)

    const res = await request(app).get('/people')
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(2)
  })
})
