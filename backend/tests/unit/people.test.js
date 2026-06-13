import { describe, expect, it } from "vitest";
import { Database } from "../../database/database";
import { dummyPhoto, dummyPerson, dummyPersonTwo } from "../setup";

describe("People CRUD", () => {
  it("Adds a person", () => {
    const person = Database.Persons.addPerson(dummyPerson)

    expect(person.id).not.null
    expect(person.name).toBe("test person")
  })

  it("Gets a person", () => {
    const addedPerson = Database.Persons.addPerson(dummyPerson)
    const retrievedPerson = Database.Persons.getPerson(addedPerson.id)
    
    expect(retrievedPerson.id).not.null
    expect(retrievedPerson.name).toBe("test person")
  })

  it("Updates a person", () => {
    const photo = Database.Photos.addPhoto(dummyPhoto)
    const person = Database.Persons.addPerson(dummyPerson)
    Database.Persons.updatePerson(person.id, { name: "andrew", avatar_id: photo.id })
    const updatedPerson = Database.Persons.getPerson(person.id)

    expect(updatedPerson.name).toBe("andrew")
    expect(updatedPerson.avatar_id).toBe(photo.id)
  })

  it("Removes a person", () => {
    const addedPerson = Database.Persons.addPerson(dummyPerson)
    Database.Persons.removePerson(addedPerson.id)
    const retrievedPerson = Database.Persons.getPerson(addedPerson.id)

    expect(retrievedPerson).toBeNullable()
  })

  it("Gets all persons", () => {
    Database.Persons.addPerson(dummyPerson)
    Database.Persons.addPerson(dummyPersonTwo)

    const allPersons = Database.Persons.getAllPersons()
    expect(allPersons).toHaveLength(2)
  })
})
