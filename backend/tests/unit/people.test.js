import { describe, expect, it } from "vitest";
import { Database } from "../../database/database";
import { dummyPerson, dummyPersonTwo } from "../setup";

describe("People CRUD", () => {
  it("Gets all persons", () => {
    Database.Persons.addPerson(dummyPerson)
    Database.Persons.addPerson(dummyPersonTwo)

    const allPersons = Database.Persons.getAllPersons()
    expect(allPersons).toHaveLength(2)
  })
})
