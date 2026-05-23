import { afterAll, afterEach, beforeAll } from "vitest";
import { Database, initDatabase } from "../database/database";

beforeAll(() => {
  initDatabase()
})

afterEach(() => {
  Database.Photos.removeAllPhotos()
})

afterAll(() => {
  Database.close();
})