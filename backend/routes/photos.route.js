import { Router } from "express";
import { photoCreateBodySchema, photoCreateFileSchema, photoIdSchema, patchPhotoBodySchema, photoListQuerySchema } from "../schemas/photo.schema.js";
import { validate } from "../middleware/zod.js";
import { Database } from "../database/database.js";
import { upload } from "../middleware/multer.js";

export const photoRoutes = Router();

function assertPeopleExist(peopleIds, next) {
  for (const personId of peopleIds) {
    if (!Database.Persons.getPerson(personId)) {
      next({ status: 404, message: "Person with this id was not found" })
      return false
    }
  }
  return true
}

photoRoutes.get("/", validate({ query: photoListQuerySchema }), (req, res, next) => {
  try {
    const photos = Database.Photos.getAllPhotos(req.filters)
    res.status(200).json(photos)
  } catch (err) {
    next(err)
  }
});

photoRoutes.post("/", upload.single("photo"), validate({ body: photoCreateBodySchema, file: photoCreateFileSchema }), (req, res, next) => {
  try {
    const peopleIds = req.body.people

    if (!assertPeopleExist(peopleIds, next)) return

    const photoParams = { 
      album_id: req.body.album_id,
      caption: req.body.caption,
      hash: req.file.filename,
      taken_at: req.body.taken_at,
      name: req.file.originalname,
      size_bytes: req.file.size
    }

    const photo = Database.Photos.addPhoto(photoParams)
    Database.Photos.setPhotoPeople(photo.id, peopleIds)
    res.status(201).json(Database.Photos.getPhoto(photo.id))
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

photoRoutes.patch("/:id", upload.single("photo"), validate({ params: photoIdSchema, body: patchPhotoBodySchema }), (req, res, next) => {
  try {
    const existingPhoto = Database.Photos.getPhoto(req.params.id)
    if (!existingPhoto) return next({ status: 404, message: "Photo with this id was not found" })

    const peopleIds = req.body.people

    if (peopleIds !== undefined && !assertPeopleExist(peopleIds, next)) return

    const fileData = req.file
      ? { hash: req.file.filename, name: req.file.originalname, size_bytes: req.file.size }
      : {}

    const updateData = { ...req.body, ...fileData }
    delete updateData.people

    if (updateData.caption === '') {
      delete updateData.caption
    }

    if (Object.keys(updateData).length) {
      Database.Photos.updatePhoto(req.params.id, updateData)
    }

    if (peopleIds !== undefined) {
      Database.Photos.setPhotoPeople(req.params.id, peopleIds)
    }

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
