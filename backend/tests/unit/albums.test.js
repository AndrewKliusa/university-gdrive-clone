import { describe, expect, it } from "vitest";
import { Database } from "../../database/database";
import { dummyAlbum, dummyAlbumTwo } from "../setup";

describe("Albums CRUD", () => {
  it("Gets all albums", () => {
    Database.Albums.addAlbum(dummyAlbum)
    Database.Albums.addAlbum(dummyAlbumTwo)

    const allAlbums = Database.Albums.getAllAlbums()
    expect(allAlbums).toHaveLength(2)
  })
})
