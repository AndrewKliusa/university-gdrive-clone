import { afterAll, afterEach, beforeAll } from "vitest";
import { Database, initDatabase } from "../database/database";

export const dummyPhoto = { name: "test", hash: "123", size_bytes: 123, caption: "test", taken_at: "123" }

beforeAll(() => {
  initDatabase()
})

afterEach(() => {
  Database.Photos.removeAllPhotos()
})

afterAll(() => {
  Database.close();
})