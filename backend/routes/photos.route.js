import { Router } from "express";
import { photoSchema } from "../schemas/photo.schema.js";
import { validate } from "../middleware/zod.js";
import { Database } from "../database/database.js";

export const photoRoutes = Router();

photoRoutes.post("/", validate({ body: photoSchema }), (req, res, next) => {
  try {
    const photo = Database.Photos.addPhoto(req.body)
    res.status(201).json(photo)
  } catch (err) {
    next(err)
  }
});

photoRoutes.get("/", (req, res) => {
  res.send("All photos");
});