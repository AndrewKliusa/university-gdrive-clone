import { Router } from "express";
import { photoCreateSchema, photoIdSchema, patchPhotoBodySchema } from "../schemas/photo.schema.js";
import { validate } from "../middleware/zod.js";
import { Database } from "../database/database.js";
import z from "zod";

export const photoRoutes = Router();

photoRoutes.post("/", validate({ body: photoCreateSchema }), (req, res, next) => {
  try {
    const photo = Database.Photos.addPhoto(req.body)
    res.status(201).json(photo)
  } catch (err) {
    next(err)
  }
});

photoRoutes.get("/:id", validate({ params: photoIdSchema }), (req, res, next) => {
  try {
    const photo = Database.Photos.getPhoto(req.params.id)
    if (!photo) return next({ status: 404, message: "Photo with this id was not found" })

    res.status(200).json(photo)
  } catch (err) {
    next(err)
  }
});

photoRoutes.patch("/:id", validate({ params: photoIdSchema, body: patchPhotoBodySchema }), (req, res, next) => {
  try {
    const existingPhoto = Database.Photos.getPhoto(req.params.id)
    if (!existingPhoto) return next({ status: 404, message: "Photo with this id was not found" })

    Database.Photos.updatePhoto(req.params.id, req.body)
    const photo = Database.Photos.getPhoto(req.params.id)

    res.status(200).json(photo)
  } catch (err) {
    next(err)
  }
})

photoRoutes.delete("/:id", validate({ params: photoIdSchema }), (req, res, next) => {
  try {
    const existingPhoto = Database.Photos.getPhoto(req.params.id)
    if (!existingPhoto) return next({ status: 404, message: "Photo with this id was not found" })

    Database.Photos.removePhoto(req.params.id)

    res.status(204).end()
  } catch (err) {
    next(err)
  }
})