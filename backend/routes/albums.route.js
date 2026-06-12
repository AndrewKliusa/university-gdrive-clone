import { Router } from "express";
import { Database } from "../database/database.js";
import { albumCreateBodySchema, albumIdSchema, patchAlbumBodySchema } from "../schemas/album.schema.js";
import { validate } from "../middleware/zod.js";

export const albumRoutes = Router();

albumRoutes.get("/", (req, res, next) => {
  try {
    const albums = Database.Albums.getAllAlbums()
    res.status(200).json(albums)
  } catch (err) {
    next(err)
  }
});

albumRoutes.post("/", validate({ body: albumCreateBodySchema }), (req, res, next) => {
  try {
    const albumParams = {
      name: req.body.name,
      color: req.body.color,
      description: req.body.description
    }
    const album = Database.Albums.addAlbum(albumParams)
    res.status(201).json(album)
  } catch (err) {
    next(err)
  }
});

albumRoutes.get("/:id", validate({ params: albumIdSchema }), (req, res, next) => {
  try {
    const album = Database.Albums.getAlbum(req.params.id)
    if (!album) return next({ status: 404, message: "Album with this id was not found" })

    res.status(200).json(album)
  } catch (err) {
    next(err)
  }
});

albumRoutes.patch("/:id", validate({ params: albumIdSchema, body: patchAlbumBodySchema }), (req, res, next) => {
  try {
    const existingAlbum = Database.Albums.getAlbum(req.params.id)
    if (!existingAlbum) return next({ status: 404, message: "Album with this id was not found" })

    Database.Albums.updateAlbum(req.params.id, req.body)
    const album = Database.Albums.getAlbum(req.params.id)

    res.status(200).json(album)
  } catch (err) {
    next(err)
  }
});

albumRoutes.delete("/:id", validate({ params: albumIdSchema }), (req, res, next) => {
  try {
    const existingAlbum = Database.Albums.getAlbum(req.params.id)
    if (!existingAlbum) return next({ status: 404, message: "Album with this id was not found" })

    Database.Albums.removeAlbum(req.params.id)

    res.status(204).end()
  } catch (err) {
    next(err)
  }
});
