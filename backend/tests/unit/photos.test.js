import { describe, expect, it } from "vitest";
import { Database } from "../../database/database";
import { dummyPhoto } from "../setup";

describe("Photos CRUD", () => {
  it("Adds a photo", () => {
    const photo = Database.Photos.addPhoto(dummyPhoto)
    expect(photo.id).not.null
    expect(photo.name).toBe("test")
    expect(photo.taken_at).toBe("123")
  })

  it("Gets a photo", () => {
    const addedPhoto = Database.Photos.addPhoto(dummyPhoto)
    const retrievedPhoto = Database.Photos.getPhoto(addedPhoto.id)
    expect(retrievedPhoto.id).not.null
    expect(retrievedPhoto.name).toBe("test")
  })

  it("Updates a photo", () => {
    const photo = Database.Photos.addPhoto(dummyPhoto)
    Database.Photos.updatePhoto(photo.id, { name: "andrew" })
    const updatedPhoto = Database.Photos.getPhoto(photo.id)

    expect(updatedPhoto.name).toBe("andrew")
  })

  it("Removes a photo", () => {
    const addedPhoto = Database.Photos.addPhoto(dummyPhoto)
    Database.Photos.removePhoto(addedPhoto.id)
    const retrievedPhoto = Database.Photos.getPhoto(addedPhoto.id)

    expect(retrievedPhoto).toBeNullable()
  })
})