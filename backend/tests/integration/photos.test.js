import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../../server'
import { dummyPhoto } from "../setup";

describe('Photo routes', () => {
  it("Creates a photo", async () => {
    const res = await request(app)
      .post('/photos')
      .send(dummyPhoto)
    
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject(dummyPhoto)
  })
})