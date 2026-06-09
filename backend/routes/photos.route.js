import { Router } from "express";
import { photoCreateBodySchema, photoCreateFileSchema, photoIdSchema, patchPhotoBodySchema } from "../schemas/photo.schema.js";
import { validate } from "../middleware/zod.js";
import { Database } from "../database/database.js";
import multer from "multer";
import z from "zod";

export const photoRoutes = Router();
const upload = multer({ dest: "photos/" })

photoRoutes.post("/", validate({ body: photoCreateBodySchema, file: photoCreateFileSchema }), upload.single(upload), (req, res, next) => {
  try {
    const photoParams = { 
      album_id: req.body.album_id,
      caption: req.body.caption,
      hash: req.file.filename,
      taken_at: req.body.taken_at,
      name: req.file.name,
      size_bytes: req.file.size_bytes
    }

    const photo = Database.Photos.addPhoto(photoParams)
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