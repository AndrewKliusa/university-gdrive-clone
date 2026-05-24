import { afterAll, afterEach, beforeAll } from "vitest";
import { Database, initDatabase } from "../database/database";
import { app } from "../server";
import request from 'supertest'

export const dummyPhoto = { name: "test", hash: "123", size_bytes: 123, caption: "test", taken_at: "123" }
export const dummyPhotoTwo = { name: "test2", hash: "1233", size_bytes: 1233, caption: "test2", taken_at: "1234" }

export function crudBuilder(routeName) {
  return {
    async post(data) {
      return await request(app)
        .post(`/${routeName}`)
        .send(data)
    },

    async get(id) {
      return await request(app)
        .get(`/${routeName}/${id}`)
    },

    async patch(id, data) {
      return await request(app)
        .patch(`/${routeName}/${id}`)
        .send(data)
    },

    async delete(id) {
      return await request(app)
        .delete(`/${routeName}/${id}`)
    },
  }
}

beforeAll(() => {
  initDatabase()
})

afterEach(() => {
  Database.Photos.removeAllPhotos()
})

afterAll(() => {
  Database.close();
})